document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('cart');
  renderFooter();
  renderCart();
  document.addEventListener('nova:cart-change', renderCart);
});

function renderCart() {
  const cart = NovaStore.getCart();
  const root = document.getElementById('cart-root');
  const countLabel = document.getElementById('cart-item-count');
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);
  countLabel.textContent = `${itemCount} item${itemCount === 1 ? '' : 's'}`;

  if (cart.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    return;
  }

  const lines = cart.map((item) => ({ item, product: novaGetProduct(item.id) })).filter((l) => l.product);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.item.qty, 0);
  const shipping = subtotal > 150 ? 0 : 10;
  const discount = window.__novaCartDiscount || 0;
  const total = subtotal + shipping - discount;

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
        ${lines.map((l) => `
          <div class="cart-row">
            <div class="cart-row-product">
              <img src="${l.product.image}" alt="${l.product.name}" />
              <div>
                <div class="cart-row-name">${l.product.name}</div>
                <div class="text-secondary cart-row-color">${l.item.color || ''}</div>
              </div>
            </div>
            <div class="qty-stepper" data-id="${l.item.id}" data-color="${l.item.color || ''}">
              <button class="cart-qty-minus">−</button>
              <span>${l.item.qty}</span>
              <button class="cart-qty-plus">+</button>
            </div>
            <div>${formatCurrency(l.product.price)}</div>
            <div class="cart-row-total">${formatCurrency(l.product.price * l.item.qty)}</div>
            <button class="icon-btn cart-remove" data-id="${l.item.id}" data-color="${l.item.color || ''}" aria-label="Remove">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        `).join('')}
      </div>

      <div class="order-summary card card-pad">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : formatCurrency(shipping)}</span></div>
        ${discount ? `<div class="summary-row"><span>Discount</span><span>-${formatCurrency(discount)}</span></div>` : ''}
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
    btn.addEventListener('click', () => {
      const stepper = btn.closest('.qty-stepper');
      const id = Number(stepper.dataset.id);
      const color = stepper.dataset.color || null;
      const current = cart.find((i) => i.id === id && (i.color || '') === (color || ''));
      const delta = btn.classList.contains('cart-qty-plus') ? 1 : -1;
      NovaStore.updateCartQty(id, color, current.qty + delta);
    });
  });

  root.querySelectorAll('.cart-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      NovaStore.removeFromCart(Number(btn.dataset.id), btn.dataset.color || null);
      showToast('Removed from cart');
    });
  });

  const promoApply = document.getElementById('promo-apply');
  promoApply.addEventListener('click', () => {
    const code = document.getElementById('promo-input').value.trim().toUpperCase();
    if (code === 'NOVA15') {
      window.__novaCartDiscount = 15;
      showToast('Promo code applied');
    } else {
      window.__novaCartDiscount = 0;
      showToast('Invalid promo code');
    }
    renderCart();
  });
}
