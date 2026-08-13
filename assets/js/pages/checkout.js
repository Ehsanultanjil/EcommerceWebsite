document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('checkout');
  renderFooter();

  const cart = NovaStore.getCart();
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  renderReview();
  renderSummary();

  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    placeOrder(e.target);
  });
});

function getCartLines() {
  return NovaStore.getCart()
    .map((item) => ({ item, product: novaGetProduct(item.id) }))
    .filter((l) => l.product);
}

function computeTotals() {
  const lines = getCartLines();
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.item.qty, 0);
  const shipping = subtotal > 150 ? 0 : 10;
  const discount = window.__novaCartDiscount || 0;
  return { subtotal, shipping, discount, total: subtotal + shipping - discount };
}

function renderReview() {
  const lines = getCartLines();
  document.getElementById('review-items').innerHTML = lines.map((l) => `
    <div class="review-line">
      <img src="${l.product.image}" alt="${l.product.name}" />
      <div class="review-line-info">
        <div class="review-line-name">${l.product.name}</div>
        <div class="text-secondary">${l.item.color || ''} · Qty ${l.item.qty}</div>
      </div>
      <div class="review-line-price">${formatCurrency(l.product.price * l.item.qty)}</div>
    </div>
  `).join('');
}

function renderSummary() {
  const t = computeTotals();
  document.getElementById('checkout-summary').innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(t.subtotal)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : formatCurrency(t.shipping)}</span></div>
    ${t.discount ? `<div class="summary-row"><span>Discount</span><span>-${formatCurrency(t.discount)}</span></div>` : ''}
    <div class="summary-divider"></div>
    <div class="summary-row summary-total"><span>Total</span><span>${formatCurrency(t.total)}</span></div>
    <button type="submit" form="checkout-form" class="btn btn-primary btn-block">Place Order</button>
  `;
}

function placeOrder(form) {
  const data = new FormData(form);
  const t = computeTotals();
  const lines = getCartLines();
  const orderId = 'NV-' + Math.floor(10000 + Math.random() * 90000);
  const today = new Date('2026-08-14');
  const etaStart = new Date(today);
  etaStart.setDate(today.getDate() + 4);
  const etaEnd = new Date(today);
  etaEnd.setDate(today.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const order = {
    id: orderId,
    date: today.toISOString().slice(0, 10),
    status: 'Confirmed',
    items: lines.map((l) => ({ productId: l.product.id, qty: l.item.qty, color: l.item.color })),
    subtotal: t.subtotal,
    shipping: t.shipping,
    discount: t.discount,
    total: t.total,
    eta: `${fmt(etaStart)} – ${fmt(etaEnd)}`,
    address: {
      name: data.get('fullName'),
      line1: data.get('address'),
      city: data.get('city'),
      postal: data.get('postal'),
      phone: data.get('phone'),
    },
    payment: data.get('payment'),
  };

  NovaStore.placeOrder(order);
  NovaStore.login(data.get('fullName'), data.get('email'));
  NovaStore.clearCart();
  window.__novaCartDiscount = 0;
  window.location.href = `order-confirmation.html?order=${orderId}`;
}
