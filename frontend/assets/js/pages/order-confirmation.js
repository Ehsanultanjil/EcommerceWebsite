document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('confirmation');
  renderFooter();

  const orderId = qs('id');
  const root = document.getElementById('confirmation-root');

  if (!orderId) {
    root.innerHTML = `
      <div class="empty-state">
        <h3>No order to show</h3>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    return;
  }

  let order;
  try {
    order = await apiGet(`/orders/${orderId}`);
  } catch (e) {
    if (e instanceof ApiError && e.status !== 401) {
      root.innerHTML = `
        <div class="empty-state">
          <h3>Couldn't find that order</h3>
          <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
    }
    return;
  }

  const created = new Date(order.createdAt);
  const etaStart = new Date(created);
  etaStart.setDate(created.getDate() + 4);
  const etaEnd = new Date(created);
  etaEnd.setDate(created.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  root.innerHTML = `
    <div class="confirmation-card fade-in">
      <div class="confirmation-check">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h1>Order Confirmed</h1>
      <p class="text-secondary">Thank you for your order.</p>
      <div class="confirmation-order-id">Order #${order.orderNumber}</div>

      <div class="confirmation-eta">
        <div class="eyebrow">Estimated delivery</div>
        <div class="eta-dates">${fmt(etaStart)} – ${fmt(etaEnd)}</div>
      </div>

      <div class="confirmation-actions">
        <a href="account-orders.html" class="btn btn-secondary">Track Order</a>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    </div>
  `;
});
