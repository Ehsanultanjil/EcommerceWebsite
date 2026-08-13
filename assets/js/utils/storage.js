/* localStorage-backed state: cart, wishlist, session, orders, admin product overlay */
const NOVA_KEYS = {
  cart: 'nova_cart',
  wishlist: 'nova_wishlist',
  session: 'nova_session',
  orders: 'nova_orders',
  addresses: 'nova_addresses',
  adminProducts: 'nova_admin_products',
};

function novaRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function novaWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const NovaStore = {
  /* ---------- Cart: [{ id, qty, color }] ---------- */
  getCart() {
    return novaRead(NOVA_KEYS.cart, []);
  },
  setCart(cart) {
    novaWrite(NOVA_KEYS.cart, cart);
    document.dispatchEvent(new CustomEvent('nova:cart-change'));
  },
  addToCart(id, qty = 1, color = null) {
    const cart = NovaStore.getCart();
    const existing = cart.find((item) => item.id === id && item.color === color);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id, qty, color });
    }
    NovaStore.setCart(cart);
  },
  updateCartQty(id, color, qty) {
    let cart = NovaStore.getCart();
    if (qty <= 0) {
      cart = cart.filter((item) => !(item.id === id && item.color === color));
    } else {
      const item = cart.find((i) => i.id === id && i.color === color);
      if (item) item.qty = qty;
    }
    NovaStore.setCart(cart);
  },
  removeFromCart(id, color) {
    NovaStore.setCart(NovaStore.getCart().filter((i) => !(i.id === id && i.color === color)));
  },
  clearCart() {
    NovaStore.setCart([]);
  },
  cartCount() {
    return NovaStore.getCart().reduce((sum, i) => sum + i.qty, 0);
  },

  /* ---------- Wishlist: [id, ...] ---------- */
  getWishlist() {
    return novaRead(NOVA_KEYS.wishlist, []);
  },
  toggleWishlist(id) {
    let list = NovaStore.getWishlist();
    if (list.includes(id)) {
      list = list.filter((x) => x !== id);
    } else {
      list.push(id);
    }
    novaWrite(NOVA_KEYS.wishlist, list);
    document.dispatchEvent(new CustomEvent('nova:wishlist-change'));
    return list.includes(id);
  },
  isWishlisted(id) {
    return NovaStore.getWishlist().includes(id);
  },

  /* ---------- Session ---------- */
  getSession() {
    return novaRead(NOVA_KEYS.session, null);
  },
  login(name, email) {
    novaWrite(NOVA_KEYS.session, { name, email });
  },
  logout() {
    localStorage.removeItem(NOVA_KEYS.session);
  },
  isLoggedIn() {
    return !!NovaStore.getSession();
  },

  /* ---------- Orders: seeded + user-placed ---------- */
  getOrders() {
    return novaRead(NOVA_KEYS.orders, null);
  },
  seedOrders(orders) {
    if (NovaStore.getOrders() === null) novaWrite(NOVA_KEYS.orders, orders);
  },
  placeOrder(order) {
    const orders = NovaStore.getOrders() || [];
    orders.unshift(order);
    novaWrite(NOVA_KEYS.orders, orders);
  },

  /* ---------- Addresses ---------- */
  getAddresses() {
    return novaRead(NOVA_KEYS.addresses, []);
  },
  addAddress(addr) {
    const list = NovaStore.getAddresses();
    list.push(addr);
    novaWrite(NOVA_KEYS.addresses, list);
  },
  removeAddress(index) {
    const list = NovaStore.getAddresses();
    list.splice(index, 1);
    novaWrite(NOVA_KEYS.addresses, list);
  },

  /* ---------- Admin product overlay (edits on top of static catalog) ---------- */
  getAdminProducts() {
    return novaRead(NOVA_KEYS.adminProducts, null);
  },
  saveAdminProducts(list) {
    novaWrite(NOVA_KEYS.adminProducts, list);
  },
};
