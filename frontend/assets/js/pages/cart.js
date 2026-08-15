const CART_FREE_SHIPPING_THRESHOLD = 15000;
const CART_STANDARD_SHIPPING_FEE = 1000;

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('cart');
  renderFooter();
  renderCart();
  document.addEventListener('baraz:cart-change', renderCart);
});

async function renderCart() {
  const root = document.getElementById('cart-root');
  root.innerHTML = `<p class="text-secondary" style="padding:48px 0">Loading your cart…</p>`;

  let cart;
  try {
    cart = await apiGet('/cart');
  } catch (e) {
    // A 401 already redirected to login via the shared API handler.
    if (e instanceof ApiError && e.status !== 401) {
      root.innerHTML = `<p class="text-secondary" style="padding:48px 0">Couldn't load your cart — try refreshing.</p>`;
    }
    return;
  }

  const items = cart.items;
  document.getElementById('cart-item-count').textContent =
    `${items.reduce((sum, i) => sum + i.quantity, 0)} item${items.length === 1 && items[0].quantity === 1 ? '' : 's'}`;

  if (items.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    return;
  }

  const subtotal = cart.subtotal;
  const shipping = subtotal > CART_FREE_SHIPPING_THRESHOLD ? 0 : CART_STANDARD_SHIPPING_FEE;
  const total = subtotal + shipping;

  root.innerHTML = `
    <div class="cart-layout">
      <div class="cart-table card">
        <div class="cart-table-head">
          <span>Product</span>
          <span>Qty</span>
          <span>Price</span>
          <span>Total</span>
          <span></span>
        </div>
        ${items.map((item) => `
          <div class="cart-row">
            <div class="cart-row-product">
              <img src="${item.productImageUrl}" alt="${item.productName}" />
              <div>
                <div class="cart-row-name">${item.productName}</div>
              </div>
            </div>
            <div class="qty-stepper" data-item-id="${item.id}" data-qty="${item.quantity}">
              <button class="cart-qty-minus">−</button>
              <span>${item.quantity}</span>
              <button class="cart-qty-plus">+</button>
            </div>
            <div>${formatCurrency(item.unitPrice)}</div>
            <div class="cart-row-total">${formatCurrency(item.lineTotal)}</div>
            <button class="icon-btn cart-remove" data-item-id="${item.id}" aria-label="Remove">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        `).join('')}
      </div>

      <div class="order-summary card card-pad">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : formatCurrency(shipping)}</span></div>
        <div class="promo-row">
          <input type="text" class="input" id="promo-input" placeholder="Promo code" />
          <button class="btn btn-outline btn-sm" id="promo-apply">Apply</button>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-row summary-total"><span>Total</span><span>${formatCurrency(total)}</span></div>
        <a href="checkout.html" class="btn btn-primary btn-block">Checkout
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </div>
  `;

  root.querySelectorAll('.cart-qty-minus, .cart-qty-plus').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const stepper = btn.closest('.qty-stepper');
      const itemId = stepper.dataset.itemId;
      const current = Number(stepper.dataset.qty);
      const next = current + (btn.classList.contains('cart-qty-plus') ? 1 : -1);
      try {
        if (next <= 0) {
          await apiDelete(`/cart/items/${itemId}`);
        } else {
          await apiPut(`/cart/items/${itemId}`, { quantity: next });
        }
        document.dispatchEvent(new CustomEvent('baraz:cart-change'));
      } catch (e) {
        if (e instanceof ApiError && e.status !== 401) showToast(e.message);
      }
    });
  });

  root.querySelectorAll('.cart-remove').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await apiDelete(`/cart/items/${btn.dataset.itemId}`);
        showToast('Removed from cart');
        document.dispatchEvent(new CustomEvent('baraz:cart-change'));
      } catch (e) {
        if (e instanceof ApiError && e.status !== 401) showToast(e.message);
      }
    });
  });

  document.getElementById('promo-apply').addEventListener('click', () => {
    showToast("Coupons aren't available yet");
  });
}
