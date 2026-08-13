/* Mock data scoped to the admin panel — separate from the single-user customer order history. */

const BARAZ_ADMIN_ORDERS = [
  { id: 'BZ10284', customer: 'Swapnil Kumar', email: 'swapnil@example.com', date: '2026-08-14', items: 2, total: 30200, status: 'Processing', payment: 'Cash on Delivery' },
  { id: 'BZ10283', customer: 'Amara Khan', email: 'amara@example.com', date: '2026-08-13', items: 1, total: 14900, status: 'Shipped', payment: 'Credit / Debit Card' },
  { id: 'BZ10282', customer: 'Daniel Ruiz', email: 'daniel@example.com', date: '2026-08-13', items: 3, total: 8900, status: 'Delivered', payment: 'Mobile Payment' },
  { id: 'BZ10281', customer: 'Priya Sharma', email: 'priya@example.com', date: '2026-08-12', items: 1, total: 24900, status: 'Delivered', payment: 'Credit / Debit Card' },
  { id: 'BZ10280', customer: 'Liam Carter', email: 'liam@example.com', date: '2026-08-12', items: 2, total: 17800, status: 'Confirmed', payment: 'Cash on Delivery' },
  { id: 'BZ10279', customer: 'Noor Fatima', email: 'noor@example.com', date: '2026-08-11', items: 1, total: 19900, status: 'Shipped', payment: 'Mobile Payment' },
  { id: 'BZ10278', customer: 'Ethan Brooks', email: 'ethan@example.com', date: '2026-08-10', items: 4, total: 41200, status: 'Delivered', payment: 'Credit / Debit Card' },
  { id: 'BZ10277', customer: 'Sara Ahmed', email: 'sara@example.com', date: '2026-08-09', items: 1, total: 7900, status: 'Cancelled', payment: 'Cash on Delivery' },
];

const BARAZ_ADMIN_CUSTOMERS = [
  { name: 'Swapnil Kumar', email: 'swapnil@example.com', orders: 4, spent: 89000, joined: '2026-02-10' },
  { name: 'Amara Khan', email: 'amara@example.com', orders: 2, spent: 34000, joined: '2026-03-22' },
  { name: 'Daniel Ruiz', email: 'daniel@example.com', orders: 6, spent: 112000, joined: '2025-11-05' },
  { name: 'Priya Sharma', email: 'priya@example.com', orders: 1, spent: 24900, joined: '2026-06-18' },
  { name: 'Liam Carter', email: 'liam@example.com', orders: 3, spent: 51200, joined: '2026-01-30' },
  { name: 'Noor Fatima', email: 'noor@example.com', orders: 2, spent: 39800, joined: '2026-04-14' },
  { name: 'Ethan Brooks', email: 'ethan@example.com', orders: 5, spent: 94000, joined: '2025-12-02' },
  { name: 'Sara Ahmed', email: 'sara@example.com', orders: 1, spent: 7900, joined: '2026-07-01' },
];

const BARAZ_ADMIN_COUPONS = [
  { code: 'BARAZ15', type: 'Percentage', value: '15%', status: 'Active', used: 214, expires: '2026-12-31' },
  { code: 'WELCOME10', type: 'Percentage', value: '10%', status: 'Active', used: 89, expires: '2026-10-01' },
  { code: 'FREESHIP', type: 'Shipping', value: 'Free shipping', status: 'Active', used: 156, expires: '2026-09-15' },
  { code: 'SUMMER20', type: 'Percentage', value: '20%', status: 'Expired', used: 302, expires: '2026-07-31' },
];

const BARAZ_REVENUE_SERIES = [420000, 510000, 480000, 630000, 710000, 680000, 820000, 910000, 870000, 1020000, 1140000, 1248000];
const BARAZ_REVENUE_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function barazAdminOrderStatusClass(status) {
  if (status === 'Delivered') return 'badge-success';
  if (status === 'Cancelled') return 'badge-danger';
  if (status === 'Confirmed') return 'badge-neutral';
  return 'badge-accent';
}

/* ---------- Admin product overlay: edits persisted in localStorage on top of the static catalog ---------- */
function barazAllAdminProducts() {
  return BarazStore.getAdminProducts() || BARAZ_PRODUCTS.map((p) => ({ ...p }));
}

function barazAdminStock(product) {
  return 12 + ((product.id * 37) % 70);
}

function barazSaveAdminProduct(product) {
  const list = barazAllAdminProducts();
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    list[idx] = product;
  } else {
    list.push(product);
  }
  BarazStore.saveAdminProducts(list);
}

function barazDeleteAdminProduct(id) {
  const list = barazAllAdminProducts().filter((p) => p.id !== id);
  BarazStore.saveAdminProducts(list);
}

function barazNextAdminProductId() {
  const list = barazAllAdminProducts();
  return list.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

/* ---------- Admin order status overlay ---------- */
function barazAllAdminOrders() {
  const overlay = barazRead('baraz_admin_orders', null);
  if (overlay) return overlay;
  return BARAZ_ADMIN_ORDERS.map((o) => ({ ...o }));
}

function barazUpdateAdminOrderStatus(id, status) {
  const list = barazAllAdminOrders();
  const order = list.find((o) => o.id === id);
  if (order) order.status = status;
  localStorage.setItem('baraz_admin_orders', JSON.stringify(list));
}

/* ---------- Admin category overlay ---------- */
function barazAllAdminCategories() {
  return barazRead('baraz_admin_categories', null) || BARAZ_CATEGORIES.map((c) => ({ ...c }));
}

function barazSaveAdminCategory(category) {
  const list = barazAllAdminCategories();
  const idx = list.findIndex((c) => c.id === category.id);
  if (idx >= 0) list[idx] = category; else list.push(category);
  localStorage.setItem('baraz_admin_categories', JSON.stringify(list));
}

function barazDeleteAdminCategory(id) {
  const list = barazAllAdminCategories().filter((c) => c.id !== id);
  localStorage.setItem('baraz_admin_categories', JSON.stringify(list));
}

/* ---------- Admin coupon overlay ---------- */
function barazAllAdminCoupons() {
  return barazRead('baraz_admin_coupons', null) || BARAZ_ADMIN_COUPONS.map((c) => ({ ...c }));
}

function barazSaveAdminCoupon(coupon) {
  const list = barazAllAdminCoupons();
  const idx = list.findIndex((c) => c.code === coupon.code);
  if (idx >= 0) list[idx] = coupon; else list.push(coupon);
  localStorage.setItem('baraz_admin_coupons', JSON.stringify(list));
}

function barazDeleteAdminCoupon(code) {
  const list = barazAllAdminCoupons().filter((c) => c.code !== code);
  localStorage.setItem('baraz_admin_coupons', JSON.stringify(list));
}
