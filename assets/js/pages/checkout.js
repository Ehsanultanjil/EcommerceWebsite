const CHECKOUT_FREE_SHIPPING_THRESHOLD = 15000;
const CHECKOUT_STANDARD_SHIPPING_FEE = 1000;

let checkoutCart = null;

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('checkout');
  renderFooter();

  const session = await barazGetSession();
  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  try {
    checkoutCart = await apiGet('/cart');
  } catch (e) {
    if (e instanceof ApiError && e.status !== 401) showToast("Couldn't load your cart");
    return;
  }

  if (!checkoutCart.items.length) {
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

function computeTotals() {
  const subtotal = checkoutCart.subtotal;
  const shipping = subtotal > CHECKOUT_FREE_SHIPPING_THRESHOLD ? 0 : CHECKOUT_STANDARD_SHIPPING_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
}

function renderReview() {
  document.getElementById('review-items').innerHTML = checkoutCart.items.map((item) => `
    <div class="review-line">
      <img src="${item.productImageUrl}" alt="${item.productName}" />
      <div class="review-line-info">
        <div class="review-line-name">${item.productName}</div>
        <div class="text-secondary">Qty ${item.quantity}</div>
      </div>
      <div class="review-line-price">${formatCurrency(item.lineTotal)}</div>
    </div>
  `).join('');
}

function renderSummary() {
  const t = computeTotals();
  document.getElementById('checkout-summary').innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(t.subtotal)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : formatCurrency(t.shipping)}</span></div>
    <div class="summary-divider"></div>
    <div class="summary-row summary-total"><span>Total</span><span>${formatCurrency(t.total)}</span></div>
    <button type="submit" form="checkout-form" class="btn btn-primary btn-block" id="place-order-btn">Place Order</button>
  `;
}

async function placeOrder(form) {
  const data = new FormData(form);
  const btn = document.getElementById('place-order-btn');
  btn.disabled = true;
  btn.textContent = 'Placing order…';

  try {
    const order = await apiPost('/checkout', {
      shippingName: data.get('fullName'),
      shippingPhone: data.get('phone'),
      shippingAddress: data.get('address'),
      paymentMethod: data.get('payment'),
    });
    document.dispatchEvent(new CustomEvent('baraz:cart-change'));
    window.location.href = `order-confirmation.html?id=${order.id}`;
  } catch (e) {
    btn.disabled = false;
    btn.textContent = 'Place Order';
    if (e instanceof ApiError && e.status !== 401) showToast(e.message);
  }
}
