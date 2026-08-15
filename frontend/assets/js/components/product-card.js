function barazProductCardHtml(product) {
  const wishlisted = BarazStore.isWishlisted(product.id);
  return `
    <div class="product-card fade-in">
      <a href="product.html?id=${product.id}" class="product-media">
        <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" />
        ${product.isNew ? '<span class="badge badge-accent product-badge">New</span>' : ''}
        ${product.comparePrice ? '<span class="badge badge-danger product-badge">Sale</span>' : ''}
      </a>
      <button class="wishlist-btn${wishlisted ? ' active' : ''}" aria-label="Toggle wishlist" onclick="barazWishlistClick(event, '${product.id}', this)">
        ${BARAZ_ICONS.heart}
      </button>
      <button class="quick-add" onclick="barazQuickAdd(event, '${product.id}')">+ Quick Add</button>
      <a href="product.html?id=${product.id}" class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-category">${product.category ? product.category.name : ''}</div>
        <div class="product-price">
          ${product.comparePrice ? `<span class="original">${formatCurrency(product.comparePrice)}</span>` : ''}${formatCurrency(product.price)}
        </div>
      </a>
    </div>
  `;
}

function barazWishlistClick(event, id, btn) {
  event.preventDefault();
  event.stopPropagation();
  const active = BarazStore.toggleWishlist(id);
  btn.classList.toggle('active', active);
  showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
}

async function barazQuickAdd(event, id) {
  event.preventDefault();
  event.stopPropagation();

  const session = await barazGetSession();
  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  try {
    await apiPost('/cart/items', { productId: id, quantity: 1 });
    showToast('Added to cart');
    document.dispatchEvent(new CustomEvent('baraz:cart-change'));
  } catch (e) {
    if (e instanceof ApiError && e.status !== 401) showToast(e.message);
  }
}
