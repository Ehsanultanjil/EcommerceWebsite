document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('account');
  renderFooter();
  renderAccountSidebar('orders');
  BarazStore.seedOrders(BARAZ_SEED_ORDERS);

  const orders = BarazStore.getOrders() || [];
  const content = document.getElementById('account-content');

  if (orders.length === 0) {
    content.innerHTML = `
      <div class="empty-state card">
        <h3>No orders yet</h3>
        <p>When you place an order, it will show up here.</p>
        <a href="shop.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    return;
  }

  content.innerHTML = orders.map((order) => `
    <div class="order-card card">
      <div class="order-card-head">
        <div>
          <div class="order-card-id">Order #${order.id}</div>
          <div class="order-card-date">${formatDate(order.date)}</div>
        </div>
        <span class="badge ${statusBadgeClass(order.status)}">${order.status}</span>
      </div>
      <div class="order-card-meta">
        <span class="text-secondary">${order.items.reduce((s, i) => s + i.qty, 0)} items</span>
        <span>${formatCurrency(order.total)}</span>
      </div>
      <div class="order-status-track">
        ${BARAZ_ORDER_STATUS_STEPS.map((step, i) => {
          const done = i <= BARAZ_ORDER_STATUS_STEPS.indexOf(order.status);
          return `
            ${i > 0 ? '<div class="order-status-line"></div>' : ''}
            <div class="order-status-step${done ? ' done' : ''}">
              <span class="order-status-dot"></span>${step}
            </div>
          `;
        }).join('')}
      </div>
      <button class="btn btn-outline btn-sm view-order-btn" data-id="${order.id}">View Order</button>
    </div>
  `).join('');

  content.querySelectorAll('.view-order-btn').forEach((btn) => {
    btn.addEventListener('click', () => showOrderDetail(btn.dataset.id));
  });
});

function statusBadgeClass(status) {
  if (status === 'Delivered') return 'badge-success';
  if (status === 'Confirmed') return 'badge-neutral';
  return 'badge-accent';
}

function showOrderDetail(orderId) {
  const orders = BarazStore.getOrders() || [];
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;

  const lines = order.items.map((i) => ({ item: i, product: barazGetProduct(i.productId) })).filter((l) => l.product);

  openModal(`
    <h3>Order #${order.id}</h3>
    <p class="text-secondary" style="margin-top:4px">${formatDate(order.date)} · ${order.payment}</p>
    <div class="review-items" style="margin:20px 0">
      ${lines.map((l) => `
        <div class="review-line">
          <img src="${l.product.image}" alt="${l.product.name}" />
          <div class="review-line-info">
            <div class="review-line-name">${l.product.name}</div>
            <div class="text-secondary">${l.item.color || ''} · Qty ${l.item.qty}</div>
          </div>
          <div class="review-line-price">${formatCurrency(l.product.price * l.item.qty)}</div>
        </div>
      `).join('')}
    </div>
    <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(order.subtotal)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}</span></div>
    ${order.discount ? `<div class="summary-row"><span>Discount</span><span>-${formatCurrency(order.discount)}</span></div>` : ''}
    <div class="summary-divider"></div>
    <div class="summary-row summary-total"><span>Total</span><span>${formatCurrency(order.total)}</span></div>
    <p class="text-secondary" style="margin-top:16px">Shipping to ${order.address.name}, ${order.address.line1}, ${order.address.city} ${order.address.postal}</p>
  `);
}
