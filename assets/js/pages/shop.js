const PRICE_RANGES = [
  { id: '0-50', label: '৳0 – ৳5,000', min: 0, max: 5000 },
  { id: '50-100', label: '৳5,000 – ৳10,000', min: 5000, max: 10000 },
  { id: '100-200', label: '৳10,000 – ৳20,000', min: 10000, max: 20000 },
  { id: '200-plus', label: '৳20,000+', min: 20000, max: Infinity },
];

const shopState = {
  categories: [],
  price: null,
  sort: 'featured',
};

let allProducts = [];
let allCategories = [];

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('shop');
  renderFooter();

  const initialCategory = qs('category');
  if (initialCategory) shopState.categories.push(initialCategory);

  const grid = document.getElementById('shop-grid');
  grid.innerHTML = `<p class="text-secondary">Loading products…</p>`;

  try {
    [allProducts, allCategories] = await Promise.all([apiGet('/products'), apiGet('/categories')]);
  } catch (e) {
    grid.innerHTML = `<p class="text-secondary">Couldn't load products right now — try refreshing.</p>`;
    return;
  }

  renderDesktopFilters();
  bindToolbar();
  applyFilters();
});

function getFilteredProducts() {
  const filterParam = qs('filter');
  let list = allProducts.slice();

  if (filterParam === 'new') list = list.filter((p) => p.isNew);
  if (filterParam === 'deals') list = list.filter((p) => p.comparePrice);

  if (shopState.categories.length) {
    list = list.filter((p) => p.category && shopState.categories.includes(p.category.slug));
  }
  if (shopState.price) {
    const range = PRICE_RANGES.find((r) => r.id === shopState.price);
    list = list.filter((p) => p.price >= range.min && p.price < range.max);
  }

  switch (shopState.sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      list.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
      break;
  }
  return list;
}

function applyFilters() {
  const list = getFilteredProducts();
  const grid = document.getElementById('shop-grid');
  const empty = document.getElementById('shop-empty');
  const count = document.getElementById('results-count');

  count.textContent = `${list.length} Product${list.length === 1 ? '' : 's'}`;
  grid.innerHTML = list.map(barazProductCardHtml).join('');
  grid.hidden = list.length === 0;
  empty.hidden = list.length !== 0;
}

function filterFormHtml() {
  return `
    <div class="filter-group">
      <div class="filter-group-title">Category</div>
      ${allCategories.map((cat) => `
        <label class="checkbox-row">
          <input type="checkbox" class="filter-category" value="${cat.slug}" ${shopState.categories.includes(cat.slug) ? 'checked' : ''} />
          ${cat.name}
        </label>
      `).join('')}
    </div>
    <div class="filter-group">
      <div class="filter-group-title">Price</div>
      ${PRICE_RANGES.map((r) => `
        <label class="radio-row">
          <input type="radio" name="price-range" class="filter-price" value="${r.id}" ${shopState.price === r.id ? 'checked' : ''} />
          ${r.label}
        </label>
      `).join('')}
    </div>
    <button class="btn btn-ghost btn-sm filter-clear-btn">Clear filters</button>
  `;
}

function bindFilterInputs(container, onApply) {
  container.querySelectorAll('.filter-category').forEach((el) => {
    el.addEventListener('change', () => {
      shopState.categories = Array.from(container.querySelectorAll('.filter-category:checked')).map((c) => c.value);
      applyFilters();
      if (onApply) onApply();
    });
  });
  container.querySelectorAll('.filter-price').forEach((el) => {
    el.addEventListener('change', () => {
      shopState.price = el.checked ? el.value : null;
      applyFilters();
      if (onApply) onApply();
    });
  });
  container.querySelector('.filter-clear-btn').addEventListener('click', () => {
    shopState.categories = [];
    shopState.price = null;
    applyFilters();
    renderDesktopFilters();
    if (onApply) onApply(true);
  });
}

function renderDesktopFilters() {
  const el = document.getElementById('shop-filters-desktop');
  el.innerHTML = filterFormHtml();
  bindFilterInputs(el);
}

function bindToolbar() {
  document.getElementById('sort-select').addEventListener('change', (e) => {
    shopState.sort = e.target.value;
    applyFilters();
  });

  document.getElementById('mobile-filter-btn').addEventListener('click', () => {
    openModal(`
      <h3>Filter &amp; Sort</h3>
      <div class="filter-modal-body">${filterFormHtml()}</div>
      <button class="btn btn-primary btn-block" id="mobile-filter-apply">View results</button>
    `);
    const overlay = document.getElementById('baraz-modal');
    bindFilterInputs(overlay, () => renderDesktopFilters());
    overlay.querySelector('#mobile-filter-apply').addEventListener('click', closeModal);
  });

  document.getElementById('clear-filters-empty').addEventListener('click', () => {
    shopState.categories = [];
    shopState.price = null;
    applyFilters();
    renderDesktopFilters();
  });
}
