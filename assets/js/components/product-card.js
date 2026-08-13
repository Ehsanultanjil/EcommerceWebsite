function barazProductCardHtml(product) {
  const wishlisted = BarazStore.isWishlisted(product.id);
  return `
    <div class="product-card fade-in">
      <a href="product.html?id=${product.id}" class="product-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        ${product.isNew ? '<span class="badge badge-accent product-badge">New</span>' : ''}
        ${product.originalPrice ? '<span class="badge badge-danger product-badge">Sale</span>' : ''}
      </a>
      <button class="wishlist-btn${wishlisted ? ' active' : ''}" aria-label="Toggle wishlist" onclick="barazWishlistClick(event, ${product.id}, this)">
        ${BARAZ_ICONS.heart}
      </button>
      <button class="quick-add" onclick="barazQuickAdd(event, ${product.id})">+ Quick Add</button>
      <a href="product.html?id=${product.id}" class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-category">${capitalize(product.category)}</div>
        <div class="product-price">
          ${product.originalPrice ? `<span class="original">${formatCurrency(product.originalPrice)}</span>` : ''}${formatCurrency(product.price)}
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

function barazQuickAdd(event, id) {
  event.preventDefault();
  event.stopPropagation();
  const product = barazGetProduct(id);
  BarazStore.addToCart(id, 1, product.colors[0].name);
  showToast(`${product.name} added to cart`);
}
