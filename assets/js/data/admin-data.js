/* Mock data scoped to the admin panel — separate from the single-user customer order history. */

const NOVA_ADMIN_ORDERS = [
  { id: 'NV10284', customer: 'Swapnil Kumar', email: 'swapnil@example.com', date: '2026-08-14', items: 2, total: 302, status: 'Processing', payment: 'Cash on Delivery' },
  { id: 'NV10283', customer: 'Amara Khan', email: 'amara@example.com', date: '2026-08-13', items: 1, total: 149, status: 'Shipped', payment: 'Credit / Debit Card' },
  { id: 'NV10282', customer: 'Daniel Ruiz', email: 'daniel@example.com', date: '2026-08-13', items: 3, total: 89, status: 'Delivered', payment: 'Mobile Payment' },
  { id: 'NV10281', customer: 'Priya Sharma', email: 'priya@example.com', date: '2026-08-12', items: 1, total: 249, status: 'Delivered', payment: 'Credit / Debit Card' },
  { id: 'NV10280', customer: 'Liam Carter', email: 'liam@example.com', date: '2026-08-12', items: 2, total: 178, status: 'Confirmed', payment: 'Cash on Delivery' },
  { id: 'NV10279', customer: 'Noor Fatima', email: 'noor@example.com', date: '2026-08-11', items: 1, total: 199, status: 'Shipped', payment: 'Mobile Payment' },
  { id: 'NV10278', customer: 'Ethan Brooks', email: 'ethan@example.com', date: '2026-08-10', items: 4, total: 412, status: 'Delivered', payment: 'Credit / Debit Card' },
  { id: 'NV10277', customer: 'Sara Ahmed', email: 'sara@example.com', date: '2026-08-09', items: 1, total: 79, status: 'Cancelled', payment: 'Cash on Delivery' },
];

const NOVA_ADMIN_CUSTOMERS = [
  { name: 'Swapnil Kumar', email: 'swapnil@example.com', orders: 4, spent: 890, joined: '2026-02-10' },
  { name: 'Amara Khan', email: 'amara@example.com', orders: 2, spent: 340, joined: '2026-03-22' },
  { name: 'Daniel Ruiz', email: 'daniel@example.com', orders: 6, spent: 1120, joined: '2025-11-05' },
  { name: 'Priya Sharma', email: 'priya@example.com', orders: 1, spent: 249, joined: '2026-06-18' },
  { name: 'Liam Carter', email: 'liam@example.com', orders: 3, spent: 512, joined: '2026-01-30' },
  { name: 'Noor Fatima', email: 'noor@example.com', orders: 2, spent: 398, joined: '2026-04-14' },
  { name: 'Ethan Brooks', email: 'ethan@example.com', orders: 5, spent: 940, joined: '2025-12-02' },
  { name: 'Sara Ahmed', email: 'sara@example.com', orders: 1, spent: 79, joined: '2026-07-01' },
];

const NOVA_ADMIN_COUPONS = [
  { code: 'NOVA15', type: 'Percentage', value: '15%', status: 'Active', used: 214, expires: '2026-12-31' },
  { code: 'WELCOME10', type: 'Percentage', value: '10%', status: 'Active', used: 89, expires: '2026-10-01' },
  { code: 'FREESHIP', type: 'Shipping', value: 'Free shipping', status: 'Active', used: 156, expires: '2026-09-15' },
  { code: 'SUMMER20', type: 'Percentage', value: '20%', status: 'Expired', used: 302, expires: '2026-07-31' },
];

const NOVA_REVENUE_SERIES = [4200, 5100, 4800, 6300, 7100, 6800, 8200, 9100, 8700, 10200, 11400, 12480];
const NOVA_REVENUE_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function novaAdminOrderStatusClass(status) {
  if (status === 'Delivered') return 'badge-success';
  if (status === 'Cancelled') return 'badge-danger';
  if (status === 'Confirmed') return 'badge-neutral';
  return 'badge-accent';
}

/* ---------- Admin product overlay: edits persisted in localStorage on top of the static catalog ---------- */
function novaAllAdminProducts() {
  return NovaStore.getAdminProducts() || NOVA_PRODUCTS.map((p) => ({ ...p }));
}

function novaAdminStock(product) {
  return 12 + ((product.id * 37) % 70);
}

function novaSaveAdminProduct(product) {
  const list = novaAllAdminProducts();
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    list[idx] = product;
  } else {
    list.push(product);
  }
  NovaStore.saveAdminProducts(list);
}

function novaDeleteAdminProduct(id) {
  const list = novaAllAdminProducts().filter((p) => p.id !== id);
  NovaStore.saveAdminProducts(list);
}

function novaNextAdminProductId() {
  const list = novaAllAdminProducts();
  return list.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

/* ---------- Admin order status overlay ---------- */
function novaAllAdminOrders() {
  const overlay = novaRead('nova_admin_orders', null);
  if (overlay) return overlay;
  return NOVA_ADMIN_ORDERS.map((o) => ({ ...o }));
}

function novaUpdateAdminOrderStatus(id, status) {
  const list = novaAllAdminOrders();
  const order = list.find((o) => o.id === id);
  if (order) order.status = status;
  localStorage.setItem('nova_admin_orders', JSON.stringify(list));
}

/* ---------- Admin category overlay ---------- */
function novaAllAdminCategories() {
  return novaRead('nova_admin_categories', null) || NOVA_CATEGORIES.map((c) => ({ ...c }));
}

function novaSaveAdminCategory(category) {
  const list = novaAllAdminCategories();
  const idx = list.findIndex((c) => c.id === category.id);
  if (idx >= 0) list[idx] = category; else list.push(category);
  localStorage.setItem('nova_admin_categories', JSON.stringify(list));
}

function novaDeleteAdminCategory(id) {
  const list = novaAllAdminCategories().filter((c) => c.id !== id);
  localStorage.setItem('nova_admin_categories', JSON.stringify(list));
}

/* ---------- Admin coupon overlay ---------- */
function novaAllAdminCoupons() {
  return novaRead('nova_admin_coupons', null) || NOVA_ADMIN_COUPONS.map((c) => ({ ...c }));
}

function novaSaveAdminCoupon(coupon) {
  const list = novaAllAdminCoupons();
  const idx = list.findIndex((c) => c.code === coupon.code);
  if (idx >= 0) list[idx] = coupon; else list.push(coupon);
  localStorage.setItem('nova_admin_coupons', JSON.stringify(list));
}

function novaDeleteAdminCoupon(code) {
  const list = novaAllAdminCoupons().filter((c) => c.code !== code);
  localStorage.setItem('nova_admin_coupons', JSON.stringify(list));
}
