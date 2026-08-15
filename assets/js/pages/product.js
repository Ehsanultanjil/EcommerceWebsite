const BARAZ_SAMPLE_REVIEWS = [
  { name: 'Amara K.', stars: 5, text: 'Exactly as described — the quality feels premium and it arrived well packaged.' },
  { name: 'Daniel R.', stars: 5, text: 'Been using it daily for a month now. Holding up great, would buy again.' },
  { name: 'Priya S.', stars: 4, text: 'Really solid product. Only wish it came in one more color option.' },
];

let currentProduct = null;
let selectedQty = 1;

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('product');
  renderFooter();

  const id = qs('id');
  const root = document.getElementById('product-root');
  root.innerHTML = `<p class="text-secondary" style="padding:48px 0">Loading product…</p>`;

  if (!id) {
    root.innerHTML = notFoundHtml();
    return;
  }

  try {
    currentProduct = await apiGet(`/products/${id}`);
  } catch (e) {
    root.innerHTML = e instanceof ApiError && e.status === 404 ? notFoundHtml() : errorHtml();
    return;
  }

  renderProduct();
  renderRelated();
});

function notFoundHtml() {
  return `
    <div class="empty-state">
      <h3>Product not found</h3>
      <p>This item may have been removed.</p>
      <a href="shop.html" class="btn btn-primary">Back to Shop</a>
    </div>
  `;
}

function errorHtml() {
  return `
    <div class="empty-state">
      <h3>Couldn't load this product</h3>
      <p>Something went wrong — try refreshing.</p>
      <a href="shop.html" class="btn btn-primary">Back to Shop</a>
    </div>
  `;
}

function renderProduct() {
  const p = currentProduct;
  const root = document.getElementById('product-root');
  root.innerHTML = `
    <div class="product-detail">
      <div class="product-detail-media">
        <img src="${p.imageUrl}" alt="${p.name}" />
      </div>
      <div class="product-detail-info">
        <a href="shop.html?category=${p.category ? p.category.slug : ''}" class="eyebrow">${p.category ? p.category.name : ''}</a>
        <h1>${p.name}</h1>
        <div class="product-detail-price">
          ${p.comparePrice ? `<span class="original">${formatCurrency(p.comparePrice)}</span>` : ''}${formatCurrency(p.price)}
        </div>
        <p class="product-detail-desc text-secondary">${p.description || ''}</p>

        <div class="option-group">
          <div class="option-label">Quantity</div>
          <div class="qty-stepper">
            <button id="qty-minus">−</button>
            <span id="qty-value">1</span>
            <button id="qty-plus">+</button>
          </div>
          ${p.stock <= 0 ? '<p class="text-secondary" style="margin-top:8px">Out of stock</p>' : ''}
        </div>

        <div class="product-actions">
          <button class="btn btn-primary btn-block" id="add-to-cart-btn" ${p.stock <= 0 ? 'disabled' : ''}>Add to Cart</button>
          <button class="btn btn-secondary btn-block" id="add-to-wishlist-btn">
            ${BARAZ_ICONS.heart} Add to Wishlist
          </button>
        </div>
      </div>
    </div>

    <div class="product-tabs-section">
      <div class="tabs" id="product-tabs">
        <button class="tab active" data-tab="description">Description</button>
        <button class="tab" data-tab="specs">Specifications</button>
        <button class="tab" data-tab="reviews">Reviews</button>
      </div>
      <div class="tab-panel active" id="tab-description">
        <p class="text-secondary">${p.description || 'No description available.'}</p>
      </div>
      <div class="tab-panel" id="tab-specs">
        <p class="text-secondary">No specifications listed for this product.</p>
      </div>
      <div class="tab-panel" id="tab-reviews">
        ${BARAZ_SAMPLE_REVIEWS.map((r) => `
          <div class="review-item">
            <div class="review-head">
              <span class="review-name">${r.name}</span>
              <span class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</span>
            </div>
            <p class="text-secondary">${r.text}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  selectedQty = 1;
  document.getElementById('qty-minus').addEventListener('click', () => {
    selectedQty = Math.max(1, selectedQty - 1);
    document.getElementById('qty-value').textContent = selectedQty;
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    selectedQty += 1;
    document.getElementById('qty-value').textContent = selectedQty;
  });

  document.getElementById('add-to-cart-btn').addEventListener('click', async () => {
    const session = await barazGetSession();
    if (!session) {
      window.location.href = 'login.html';
      return;
    }
    try {
      await apiPost('/cart/items', { productId: p.id, quantity: selectedQty });
      showToast(`${p.name} added to cart`);
      document.dispatchEvent(new CustomEvent('baraz:cart-change'));
    } catch (e) {
      if (e instanceof ApiError && e.status !== 401) showToast(e.message);
    }
  });

  const wishlistBtn = document.getElementById('add-to-wishlist-btn');
  if (BarazStore.isWishlisted(p.id)) wishlistBtn.classList.add('wishlisted');
  wishlistBtn.addEventListener('click', () => {
    const active = BarazStore.toggleWishlist(p.id);
    wishlistBtn.classList.toggle('wishlisted', active);
    showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
  });

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

async function renderRelated() {
  const grid = document.getElementById('related-grid');
  if (!currentProduct.category) {
    grid.innerHTML = '';
    return;
  }
  try {
    const categoryProducts = await apiGet(`/products/category/${currentProduct.category.id}`);
    const related = categoryProducts.filter((p) => p.id !== currentProduct.id).slice(0, 4);
    grid.innerHTML = related.map(barazProductCardHtml).join('');
  } catch (e) {
    grid.innerHTML = '';
  }
}
