/* localStorage-backed state for wishlist and saved addresses. Cart, session/auth,
   and orders are handled by Supabase BaaS — see utils/auth.js and utils/api.js. */
const BARAZ_KEYS = {
  wishlist: 'baraz_wishlist',
  addresses: 'baraz_addresses',
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
};
