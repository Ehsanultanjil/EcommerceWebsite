/* Direct Supabase BaaS Client Layer.
   Handles all frontend queries, mutations, and RPCs directly against Supabase,
   maintaining the existing apiGet/apiPost/apiPut/apiDelete interface. */

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function parseUrl(path) {
  const [pathname, queryString] = path.split('?');
  const params = new URLSearchParams(queryString || '');
  return { pathname, params };
}

function formatProduct(p) {
  if (!p) return null;
  const cat = p.category || p.categories;
  const imgs = p.product_images || [];
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    comparePrice: p.compare_price != null ? Number(p.compare_price) : null,
    stock: p.stock,
    imageUrl: p.image_url || (imgs.length > 0 ? imgs[0].image_url : null),
    isFeatured: p.is_featured,
    isNew: p.is_new,
    isActive: p.is_active,
    category: cat ? {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      imageUrl: cat.image_url,
    } : null,
    images: imgs.map((img) => img.image_url),
  };
}

function formatOrder(o) {
  if (!o) return null;
  const rawPayment = o.payment || o.payments;
  const paymentRecord = Array.isArray(rawPayment) ? rawPayment[0] : rawPayment;
  const rawItems = o.items || o.order_items || [];

  return {
    id: o.id,
    orderNumber: o.order_number,
    status: o.status,
    subtotal: Number(o.subtotal),
    discount: Number(o.discount || 0),
    shippingFee: Number(o.shipping_fee || 0),
    total: Number(o.total),
    shippingName: o.shipping_name,
    shippingPhone: o.shipping_phone,
    shippingAddress: o.shipping_address,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
    items: rawItems.map((i) => ({
      id: i.id,
      productId: i.product_id,
      productName: i.product_name,
      unitPrice: Number(i.unit_price),
      quantity: i.quantity,
      subtotal: Number(i.subtotal),
    })),
    payment: paymentRecord ? {
      id: paymentRecord.id,
      method: paymentRecord.method,
      status: paymentRecord.status,
      amount: Number(paymentRecord.amount),
      transactionReference: paymentRecord.transaction_reference,
    } : null,
  };
}

async function apiGet(path) {
  const { pathname, params } = parseUrl(path);

  // 1. Current user profile (/auth/me)
  if (pathname === '/auth/me') {
    const session = await barazGetSession();
    if (!session) throw new ApiError(401, 'Unauthorized');
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error || !data) throw new ApiError(404, 'Profile not found');
    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone,
      role: data.role,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
    };
  }

  // 2. Categories (/categories)
  if (pathname === '/categories') {
    const { data, error } = await supabaseClient
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw new ApiError(500, error.message);
    return (data || []).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      imageUrl: c.image_url,
      createdAt: c.created_at,
    }));
  }

  // 3. Products list or search (/products)
  if (pathname === '/products') {
    const search = params.get('search');
    const featured = params.get('featured') === 'true';
    const newArrivals = params.get('newArrivals') === 'true';

    let query = supabaseClient
      .from('products')
      .select('*, category:categories(*), product_images(*)');

    if (featured) query = query.eq('is_featured', true);
    if (newArrivals) query = query.eq('is_new', true);
    if (search) query = query.ilike('name', `%${search}%`);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw new ApiError(500, error.message);
    return (data || []).map(formatProduct);
  }

  // 4. Products by category (/products/category/{id})
  const categoryMatch = pathname.match(/^\/products\/category\/([^/]+)$/);
  if (categoryMatch) {
    const categoryId = categoryMatch[1];
    const { data, error } = await supabaseClient
      .from('products')
      .select('*, category:categories(*), product_images(*)')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw new ApiError(500, error.message);
    return (data || []).map(formatProduct);
  }

  // 5. Single product (/products/{id})
  const productMatch = pathname.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    const productId = productMatch[1];
    const { data, error } = await supabaseClient
      .from('products')
      .select('*, category:categories(*), product_images(*)')
      .eq('id', productId)
      .single();

    if (error || !data) throw new ApiError(404, 'Product not found');
    return formatProduct(data);
  }

  // 6. User cart (/cart)
  if (pathname === '/cart') {
    const session = await barazGetSession();
    if (!session) {
      return { id: null, items: [], subtotal: 0 };
    }

    let { data: cart } = await supabaseClient
      .from('cart')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: createErr } = await supabaseClient
        .from('cart')
        .insert({ user_id: session.user.id })
        .select('id')
        .single();
      if (createErr) throw new ApiError(500, createErr.message);
      cart = newCart;
    }

    const { data: items, error: itemsErr } = await supabaseClient
      .from('cart_items')
      .select('id, quantity, unit_price, product:products(*)')
      .eq('cart_id', cart.id);

    if (itemsErr) throw new ApiError(500, itemsErr.message);

    const formattedItems = (items || []).map((i) => ({
      id: i.id,
      productId: i.product ? i.product.id : null,
      productName: i.product ? i.product.name : 'Unknown Product',
      productImageUrl: i.product ? (i.product.image_url || null) : null,
      unitPrice: Number(i.unit_price),
      quantity: i.quantity,
      lineTotal: Number(i.unit_price) * i.quantity,
    }));

    const subtotal = formattedItems.reduce((acc, item) => acc + item.lineTotal, 0);
    return { id: cart.id, items: formattedItems, subtotal };
  }

  // 7. Orders (/orders)
  if (pathname === '/orders') {
    const session = await barazGetSession();
    if (!session) throw new ApiError(401, 'Unauthorized');

    const { data, error } = await supabaseClient
      .from('orders')
      .select('*, items:order_items(*), payment:payments(*)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw new ApiError(500, error.message);
    return (data || []).map(formatOrder);
  }

  // 8. Single order (/orders/{id})
  const orderMatch = pathname.match(/^\/orders\/([^/]+)$/);
  if (orderMatch) {
    const orderId = orderMatch[1];
    const session = await barazGetSession();
    if (!session) throw new ApiError(401, 'Unauthorized');

    const { data, error } = await supabaseClient
      .from('orders')
      .select('*, items:order_items(*), payment:payments(*)')
      .eq('id', orderId)
      .single();

    if (error || !data) throw new ApiError(404, 'Order not found');
    return formatOrder(data);
  }

  // 9. Admin orders (/admin/orders)
  if (pathname === '/admin/orders') {
    const status = params.get('status');
    let q = supabaseClient
      .from('orders')
      .select('*, items:order_items(*), payment:payments(*)')
      .order('created_at', { ascending: false });

    if (status) q = q.eq('status', status);

    const { data, error } = await q;
    if (error) throw new ApiError(500, error.message);
    return (data || []).map(formatOrder);
  }

  // 10. Admin command history stub
  if (pathname === '/admin/command-history') {
    return [];
  }

  throw new ApiError(404, `Endpoint not found: ${path}`);
}

async function apiPost(path, body) {
  const { pathname } = parseUrl(path);

  // 1. Add item to cart (/cart/items)
  if (pathname === '/cart/items') {
    const session = await barazGetSession();
    if (!session) throw new ApiError(401, 'Unauthorized');

    const { data: prod, error: prodErr } = await supabaseClient
      .from('products')
      .select('*')
      .eq('id', body.productId)
      .single();

    if (prodErr || !prod) throw new ApiError(404, 'Product not found');
    if (prod.stock < body.quantity) throw new ApiError(400, `Only ${prod.stock} in stock`);

    let { data: cart } = await supabaseClient
      .from('cart')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: createErr } = await supabaseClient
        .from('cart')
        .insert({ user_id: session.user.id })
        .select('id')
        .single();
      if (createErr) throw new ApiError(500, createErr.message);
      cart = newCart;
    }

    const { data: existing } = await supabaseClient
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', body.productId)
      .maybeSingle();

    if (existing) {
      const newQty = existing.quantity + body.quantity;
      if (newQty > prod.stock) throw new ApiError(400, `Only ${prod.stock} in stock`);
      await supabaseClient
        .from('cart_items')
        .update({ quantity: newQty, unit_price: prod.price })
        .eq('id', existing.id);
    } else {
      await supabaseClient
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: body.productId,
          quantity: body.quantity,
          unit_price: prod.price,
        });
    }

    return apiGet('/cart');
  }

  // 2. Checkout (/checkout)
  if (pathname === '/checkout') {
    const session = await barazGetSession();
    if (!session) throw new ApiError(401, 'Unauthorized');

    const { data, error } = await supabaseClient.rpc('checkout', {
      p_shipping_name: body.shippingName,
      p_shipping_phone: body.shippingPhone,
      p_shipping_address: body.shippingAddress,
      p_payment_method: body.paymentMethod || 'CASH_ON_DELIVERY',
    });

    if (error) throw new ApiError(400, error.message);
    return data;
  }

  // 3. Cancel order (/orders/{id}/cancel)
  const cancelMatch = pathname.match(/^\/orders\/([^/]+)\/cancel$/);
  if (cancelMatch) {
    const orderId = cancelMatch[1];
    const session = await barazGetSession();
    if (!session) throw new ApiError(401, 'Unauthorized');

    const { data, error } = await supabaseClient.rpc('cancel_order', {
      p_order_id: orderId,
    });

    if (error) throw new ApiError(400, error.message);
    return data;
  }

  // 4. Admin create product (/admin/products)
  if (pathname === '/admin/products') {
    const { data, error } = await supabaseClient
      .from('products')
      .insert({
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category_id: body.categoryId,
        description: body.description,
        price: body.price,
        compare_price: body.comparePrice || null,
        stock: body.stock,
        image_url: body.imageUrl,
        is_featured: !!body.isFeatured,
        is_new: !!body.isNew,
        is_active: body.isActive !== undefined ? body.isActive : true,
      })
      .select('*, category:categories(*)')
      .single();

    if (error) throw new ApiError(400, error.message);
    return formatProduct(data);
  }

  throw new ApiError(404, `Endpoint not found: ${path}`);
}

async function apiPut(path, body) {
  const { pathname } = parseUrl(path);

  // 1. Update cart item quantity (/cart/items/{id})
  const cartItemMatch = pathname.match(/^\/cart\/items\/([^/]+)$/);
  if (cartItemMatch) {
    const itemId = cartItemMatch[1];
    const session = await barazGetSession();
    if (!session) throw new ApiError(401, 'Unauthorized');

    if (body.quantity <= 0) {
      await supabaseClient.from('cart_items').delete().eq('id', itemId);
    } else {
      const { data: item } = await supabaseClient
        .from('cart_items')
        .select('product:products(stock, name)')
        .eq('id', itemId)
        .single();

      if (item && item.product && item.product.stock < body.quantity) {
        throw new ApiError(400, `Only ${item.product.stock} of "${item.product.name}" in stock`);
      }

      await supabaseClient
        .from('cart_items')
        .update({ quantity: body.quantity })
        .eq('id', itemId);
    }

    return apiGet('/cart');
  }

  // 2. Admin update product (/admin/products/{id})
  const adminProductMatch = pathname.match(/^\/admin\/products\/([^/]+)$/);
  if (adminProductMatch) {
    const productId = adminProductMatch[1];
    const updatePayload = {
      name: body.name,
      slug: body.slug,
      category_id: body.categoryId,
      description: body.description,
      price: body.price,
      compare_price: body.comparePrice || null,
      stock: body.stock,
      image_url: body.imageUrl,
      is_featured: body.isFeatured,
      is_new: body.isNew,
      is_active: body.isActive,
    };

    const { data, error } = await supabaseClient
      .from('products')
      .update(updatePayload)
      .eq('id', productId)
      .select('*, category:categories(*)')
      .single();

    if (error) throw new ApiError(400, error.message);
    return formatProduct(data);
  }

  // 3. Admin update order status (/admin/orders/{id}/status)
  const adminOrderStatusMatch = pathname.match(/^\/admin\/orders\/([^/]+)\/status$/);
  if (adminOrderStatusMatch) {
    const orderId = adminOrderStatusMatch[1];
    const { data, error } = await supabaseClient
      .from('orders')
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select('*, items:order_items(*), payment:payments(*)')
      .single();

    if (error) throw new ApiError(400, error.message);
    return formatOrder(data);
  }

  throw new ApiError(404, `Endpoint not found: ${path}`);
}

async function apiDelete(path) {
  const { pathname } = parseUrl(path);

  // 1. Remove item from cart (/cart/items/{id})
  const cartItemMatch = pathname.match(/^\/cart\/items\/([^/]+)$/);
  if (cartItemMatch) {
    const itemId = cartItemMatch[1];
    const session = await barazGetSession();
    if (!session) throw new ApiError(401, 'Unauthorized');

    await supabaseClient.from('cart_items').delete().eq('id', itemId);
    return apiGet('/cart');
  }

  // 2. Admin delete product (/admin/products/{id})
  const adminProductMatch = pathname.match(/^\/admin\/products\/([^/]+)$/);
  if (adminProductMatch) {
    const productId = adminProductMatch[1];
    const { error } = await supabaseClient.from('products').delete().eq('id', productId);
    if (error) throw new ApiError(400, error.message);
    return null;
  }

  throw new ApiError(404, `Endpoint not found: ${path}`);
}
