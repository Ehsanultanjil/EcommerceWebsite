-- BaaS Checkout and Order cancellation functions

create or replace function public.checkout(
  p_shipping_name text,
  p_shipping_phone text,
  p_shipping_address text,
  p_payment_method text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_cart_id uuid;
  v_cart_item record;
  v_subtotal numeric(10,2) := 0;
  v_discount numeric(10,2) := 0;
  v_shipping_fee numeric(10,2) := 0;
  v_total numeric(10,2) := 0;
  v_order_id uuid;
  v_order_number text;
  v_payment_id uuid;
  v_payment_method public.payment_method;
  v_payment_status public.payment_status;
  v_tx_ref text := null;
  v_item_count int := 0;
  v_order_json jsonb;
begin
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  -- Validate payment method
  begin
    v_payment_method := p_payment_method::public.payment_method;
  exception when others then
    raise exception 'Invalid payment method: %', p_payment_method;
  end;

  -- Get user cart
  select id into v_cart_id from public.cart where user_id = v_user_id;
  if v_cart_id is null then
    raise exception 'Cart is empty';
  end if;

  -- Validate items and compute subtotal using actual product prices
  for v_cart_item in
    select ci.id as item_id, ci.product_id, ci.quantity, p.name as product_name, p.price as current_price, p.stock
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    where ci.cart_id = v_cart_id
  loop
    v_item_count := v_item_count + 1;
    if v_cart_item.quantity > v_cart_item.stock then
      raise exception 'Only % of "%" in stock', v_cart_item.stock, v_cart_item.product_name;
    end if;
    v_subtotal := v_subtotal + (v_cart_item.current_price * v_cart_item.quantity);
  end loop;

  if v_item_count = 0 then
    raise exception 'Cart is empty';
  end if;

  -- Free shipping over 15000, otherwise 1000
  if v_subtotal >= 15000 then
    v_shipping_fee := 0;
  else
    v_shipping_fee := 1000;
  end if;

  v_total := v_subtotal - v_discount + v_shipping_fee;

  -- Generate order number
  v_order_number := 'BZ-' || floor(random() * 90000 + 10000)::text;

  -- Insert order
  insert into public.orders (
    user_id, order_number, status, subtotal, discount, shipping_fee, total,
    shipping_name, shipping_phone, shipping_address
  )
  values (
    v_user_id, v_order_number, 'PENDING', v_subtotal, v_discount, v_shipping_fee, v_total,
    p_shipping_name, p_shipping_phone, p_shipping_address
  )
  returning id into v_order_id;

  -- Insert order items and deduct stock
  for v_cart_item in
    select ci.id as item_id, ci.product_id, ci.quantity, p.name as product_name, p.price as current_price
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    where ci.cart_id = v_cart_id
  loop
    insert into public.order_items (
      order_id, product_id, product_name, unit_price, quantity, subtotal
    )
    values (
      v_order_id, v_cart_item.product_id, v_cart_item.product_name, v_cart_item.current_price, v_cart_item.quantity,
      v_cart_item.current_price * v_cart_item.quantity
    );

    update public.products
    set stock = stock - v_cart_item.quantity
    where id = v_cart_item.product_id;
  end loop;

  -- Determine payment status
  if v_payment_method = 'CASH_ON_DELIVERY' then
    v_payment_status := 'PENDING';
    v_tx_ref := null;
  else
    v_payment_status := 'COMPLETED';
    v_tx_ref := 'TX-' || floor(random() * 900000 + 100000)::text;
  end if;

  -- Insert payment record
  insert into public.payments (
    order_id, method, status, amount, transaction_reference
  )
  values (
    v_order_id, v_payment_method, v_payment_status, v_total, v_tx_ref
  )
  returning id into v_payment_id;

  -- Clear cart items
  delete from public.cart_items where cart_id = v_cart_id;

  -- Build return JSON
  select jsonb_build_object(
    'id', o.id,
    'orderNumber', o.order_number,
    'status', o.status,
    'subtotal', o.subtotal,
    'discount', o.discount,
    'shippingFee', o.shipping_fee,
    'total', o.total,
    'shippingName', o.shipping_name,
    'shippingPhone', o.shipping_phone,
    'shippingAddress', o.shipping_address,
    'createdAt', o.created_at,
    'payment', jsonb_build_object(
      'id', p.id,
      'method', p.method,
      'status', p.status,
      'amount', p.amount,
      'transactionReference', p.transaction_reference
    )
  ) into v_order_json
  from public.orders o
  join public.payments p on p.order_id = o.id
  where o.id = v_order_id;

  return v_order_json;
end;
$$;

create or replace function public.cancel_order(
  p_order_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_order record;
  v_item record;
  v_order_json jsonb;
begin
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  select * into v_order from public.orders where id = p_order_id;
  if v_order.id is null then
    raise exception 'Order not found';
  end if;

  if v_order.user_id <> v_user_id and not public.is_admin() then
    raise exception 'Permission denied';
  end if;

  if v_order.status not in ('PENDING', 'CONFIRMED') then
    raise exception 'Cannot cancel an order in % status', v_order.status;
  end if;

  -- Update order status
  update public.orders
  set status = 'CANCELLED', updated_at = now()
  where id = p_order_id;

  -- Restore stock
  for v_item in select product_id, quantity from public.order_items where order_id = p_order_id and product_id is not null loop
    update public.products
    set stock = stock + v_item.quantity
    where id = v_item.product_id;
  end loop;

  select jsonb_build_object(
    'id', o.id,
    'orderNumber', o.order_number,
    'status', o.status
  ) into v_order_json
  from public.orders o
  where o.id = p_order_id;

  return v_order_json;
end;
$$;

grant execute on function public.checkout(text, text, text, text) to authenticated;
grant execute on function public.cancel_order(uuid) to authenticated;
