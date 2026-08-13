document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('confirmation');
  renderFooter();
  NovaStore.seedOrders(NOVA_SEED_ORDERS);

  const orderId = qs('order');
  const orders = NovaStore.getOrders() || [];
  const order = orders.find((o) => o.id === orderId) || orders[0];

  document.getElementById('confirmation-root').innerHTML = `
    <div class="confirmation-card fade-in">
      <div class="confirmation-check">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h1>Order Confirmed</h1>
      <p class="text-secondary">Thank you for your order.</p>
      <div class="confirmation-order-id">Order #${order.id}</div>

      <div class="confirmation-eta">
        <div class="eyebrow">Estimated delivery</div>
        <div class="eta-dates">${order.eta}</div>
      </div>

      <div class="confirmation-actions">
        <a href="account-orders.html" class="btn btn-secondary">Track Order</a>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    </div>
  `;
});
