const ACCOUNT_ORDER_STATUS_STEPS = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
const ACCOUNT_ORDER_STATUS_LABELS = { CONFIRMED: 'Confirmed', PROCESSING: 'Processing', SHIPPED: 'Shipped', DELIVERED: 'Delivered' };
let myOrders = [];

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('account');
  renderFooter();
  renderAccountSidebar('orders');
  await loadOrders();
});

async function loadOrders() {
  const content = document.getElementById('account-content');
  content.innerHTML = `<p class="text-secondary" style="padding:24px 0">Loading your orders…</p>`;

  try {
    myOrders = await apiGet('/orders');
  } catch (e) {
    if (e instanceof ApiError && e.status !== 401) {
      content.innerHTML = `<p class="text-secondary">Couldn't load your orders — try refreshing.</p>`;
    }
    return;
  }

  if (myOrders.length === 0) {
    content.innerHTML = `
      <div class="empty-state card">
        <h3>No orders yet</h3>
        <p>When you place an order, it will show up here.</p>
        <a href="shop.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    return;
  }

  content.innerHTML = myOrders.map((order) => `
    <div class="order-card card">
      <div class="order-card-head">
        <div>
          <div class="order-card-id">Order #${order.orderNumber}</div>
          <div class="order-card-date">${formatDate(order.createdAt)}</div>
        </div>
        <span class="badge ${statusBadgeClass(order.status)}">${statusLabel(order.status)}</span>
      </div>
      <div class="order-card-meta">
        <span class="text-secondary">${order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
        <span>${formatCurrency(order.total)}</span>
      </div>
      <div class="order-status-track">
        ${ACCOUNT_ORDER_STATUS_STEPS.map((step, i) => {
          const done = i <= ACCOUNT_ORDER_STATUS_STEPS.indexOf(order.status);
          return `
            ${i > 0 ? '<div class="order-status-line"></div>' : ''}
            <div class="order-status-step${done ? ' done' : ''}">
              <span class="order-status-dot"></span>${ACCOUNT_ORDER_STATUS_LABELS[step]}
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
}

function statusLabel(status) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function statusBadgeClass(status) {
  if (status === 'DELIVERED') return 'badge-success';
  if (status === 'CANCELLED') return 'badge-danger';
  if (status === 'PENDING') return 'badge-neutral';
  return 'badge-accent';
}

function showOrderDetail(orderId) {
  const order = myOrders.find((o) => o.id === orderId);
  if (!order) return;

  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';

  openModal(`
    <h3>Order #${order.orderNumber}</h3>
    <p class="text-secondary" style="margin-top:4px">${formatDate(order.createdAt)} · ${order.payment ? order.payment.method.replace(/_/g, ' ') : ''}</p>
    <div class="review-items" style="margin:20px 0">
      ${order.items.map((item) => `
        <div class="review-line">
          <div class="review-line-info">
            <div class="review-line-name">${item.productName}</div>
            <div class="text-secondary">Qty ${item.quantity}</div>
          </div>
          <div class="review-line-price">${formatCurrency(item.subtotal)}</div>
        </div>
      `).join('')}
    </div>
    <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(order.subtotal)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${order.shippingFee === 0 ? 'Free' : formatCurrency(order.shippingFee)}</span></div>
    ${order.discount ? `<div class="summary-row"><span>Discount</span><span>-${formatCurrency(order.discount)}</span></div>` : ''}
    <div class="summary-divider"></div>
    <div class="summary-row summary-total"><span>Total</span><span>${formatCurrency(order.total)}</span></div>
    <p class="text-secondary" style="margin-top:16px">Shipping to ${order.shippingName}, ${order.shippingAddress}</p>
    ${canCancel ? `<button class="btn btn-danger btn-block" id="cancel-order-btn" style="margin-top:20px">Cancel Order</button>` : ''}
  `);

  const cancelBtn = document.getElementById('cancel-order-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', async () => {
      cancelBtn.disabled = true;
      cancelBtn.textContent = 'Cancelling…';
      try {
        await apiPost(`/orders/${order.id}/cancel`, {});
        showToast('Order cancelled');
        closeModal();
        await loadOrders();
      } catch (e) {
        cancelBtn.disabled = false;
        cancelBtn.textContent = 'Cancel Order';
        if (e instanceof ApiError && e.status !== 401) showToast(e.message);
      }
    });
  }
}
