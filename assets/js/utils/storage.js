/* localStorage-backed state: cart, wishlist, session, orders, admin product overlay */
const BARAZ_KEYS = {
  cart: 'baraz_cart',
  wishlist: 'baraz_wishlist',
  session: 'baraz_session',
  orders: 'baraz_orders',
  addresses: 'baraz_addresses',
  adminProducts: 'baraz_admin_products',
};

function barazRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function barazWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const BarazStore = {
  /* ---------- Cart: [{ id, qty, color }] ---------- */
  getCart() {
    return barazRead(BARAZ_KEYS.cart, []);
  },
  setCart(cart) {
    barazWrite(BARAZ_KEYS.cart, cart);
    document.dispatchEvent(new CustomEvent('baraz:cart-change'));
  },
  addToCart(id, qty = 1, color = null) {
    const cart = BarazStore.getCart();
    const existing = cart.find((item) => item.id === id && item.color === color);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id, qty, color });
    }
    BarazStore.setCart(cart);
  },
  updateCartQty(id, color, qty) {
    let cart = BarazStore.getCart();
    if (qty <= 0) {
      cart = cart.filter((item) => !(item.id === id && item.color === color));
    } else {
      const item = cart.find((i) => i.id === id && i.color === color);
      if (item) item.qty = qty;
    }
    BarazStore.setCart(cart);
  },
  removeFromCart(id, color) {
    BarazStore.setCart(BarazStore.getCart().filter((i) => !(i.id === id && i.color === color)));
  },
  clearCart() {
    BarazStore.setCart([]);
  },
  cartCount() {
    return BarazStore.getCart().reduce((sum, i) => sum + i.qty, 0);
  },

  /* ---------- Wishlist: [id, ...] ---------- */
  getWishlist() {
    return barazRead(BARAZ_KEYS.wishlist, []);
  },
  toggleWishlist(id) {
    let list = BarazStore.getWishlist();
    if (list.includes(id)) {
      list = list.filter((x) => x !== id);
    } else {
      list.push(id);
    }
    barazWrite(BARAZ_KEYS.wishlist, list);
    document.dispatchEvent(new CustomEvent('baraz:wishlist-change'));
    return list.includes(id);
  },
  isWishlisted(id) {
    return BarazStore.getWishlist().includes(id);
  },

  /* ---------- Session ---------- */
  getSession() {
    return barazRead(BARAZ_KEYS.session, null);
  },
  login(name, email) {
    barazWrite(BARAZ_KEYS.session, { name, email });
  },
  logout() {
    localStorage.removeItem(BARAZ_KEYS.session);
  },
  isLoggedIn() {
    return !!BarazStore.getSession();
  },

  /* ---------- Orders: seeded + user-placed ---------- */
  getOrders() {
    return barazRead(BARAZ_KEYS.orders, null);
  },
  seedOrders(orders) {
    if (BarazStore.getOrders() === null) barazWrite(BARAZ_KEYS.orders, orders);
  },
  placeOrder(order) {
    const orders = BarazStore.getOrders() || [];
    orders.unshift(order);
    barazWrite(BARAZ_KEYS.orders, orders);
  },

  /* ---------- Addresses ---------- */
  getAddresses() {
    return barazRead(BARAZ_KEYS.addresses, []);
  },
  addAddress(addr) {
    const list = BarazStore.getAddresses();
    list.push(addr);
    barazWrite(BARAZ_KEYS.addresses, list);
  },
  removeAddress(index) {
    const list = BarazStore.getAddresses();
    list.splice(index, 1);
    barazWrite(BARAZ_KEYS.addresses, list);
  },

  /* ---------- Admin product overlay (edits on top of static catalog) ---------- */
  getAdminProducts() {
    return barazRead(BARAZ_KEYS.adminProducts, null);
  },
  saveAdminProducts(list) {
    barazWrite(BARAZ_KEYS.adminProducts, list);
  },
};
