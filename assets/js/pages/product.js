const BARAZ_SAMPLE_REVIEWS = [
  { name: 'Amara K.', stars: 5, text: 'Exactly as described — the quality feels premium and it arrived well packaged.' },
  { name: 'Daniel R.', stars: 5, text: 'Been using it daily for a month now. Holding up great, would buy again.' },
  { name: 'Priya S.', stars: 4, text: 'Really solid product. Only wish it came in one more color option.' },
];

let currentProduct = null;
let selectedColor = null;
let selectedQty = 1;

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('product');
  renderFooter();

  const id = qs('id');
  currentProduct = barazGetProduct(id) || BARAZ_PRODUCTS[0];
  selectedColor = currentProduct.colors[0].name;

  renderProduct();
  renderRelated();
});

function renderProduct() {
  const p = currentProduct;
  const root = document.getElementById('product-root');
  root.innerHTML = `
    <div class="product-detail">
      <div class="product-detail-media">
        <img src="${p.image}" alt="${p.name}" />
      </div>
      <div class="product-detail-info">
        <a href="shop.html?category=${p.category}" class="eyebrow">${capitalize(p.category)}</a>
        <h1>${p.name}</h1>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}</span>
          <span class="text-secondary">${p.rating} (${p.reviews})</span>
        </div>
        <div class="product-detail-price">
          ${p.originalPrice ? `<span class="original">${formatCurrency(p.originalPrice)}</span>` : ''}${formatCurrency(p.price)}
        </div>
        <p class="product-detail-desc text-secondary">${p.desc}</p>

        <div class="option-group">
          <div class="option-label">Color <span id="selected-color-label">${selectedColor}</span></div>
          <div class="swatch-row" id="color-swatches">
            ${p.colors.map((c) => `
              <button class="swatch${c.name === selectedColor ? ' active' : ''}" style="background:${c.hex}" data-color="${c.name}" aria-label="${c.name}"></button>
            `).join('')}
          </div>
        </div>

        <div class="option-group">
          <div class="option-label">Quantity</div>
          <div class="qty-stepper">
            <button id="qty-minus">−</button>
            <span id="qty-value">1</span>
            <button id="qty-plus">+</button>
          </div>
        </div>

        <div class="product-actions">
          <button class="btn btn-primary btn-block" id="add-to-cart-btn">Add to Cart</button>
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
        <p class="text-secondary">${p.desc}</p>
      </div>
      <div class="tab-panel" id="tab-specs">
        <table class="specs-table">
          ${Object.entries(p.specs).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
        </table>
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

  document.querySelectorAll('.swatch').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedColor = btn.dataset.color;
      document.getElementById('selected-color-label').textContent = selectedColor;
      document.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('active', s === btn));
    });
  });

  selectedQty = 1;
  document.getElementById('qty-minus').addEventListener('click', () => {
    selectedQty = Math.max(1, selectedQty - 1);
    document.getElementById('qty-value').textContent = selectedQty;
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    selectedQty += 1;
    document.getElementById('qty-value').textContent = selectedQty;
  });

  document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    BarazStore.addToCart(p.id, selectedQty, selectedColor);
    showToast(`${p.name} added to cart`);
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

function renderRelated() {
  const related = barazRelatedProducts(currentProduct, 4);
  document.getElementById('related-grid').innerHTML = related.map(barazProductCardHtml).join('');
}
