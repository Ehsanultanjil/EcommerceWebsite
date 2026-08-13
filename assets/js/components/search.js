const NOVA_POPULAR_SEARCHES = ['Headphones', 'Smart watches', 'Backpacks', 'Sneakers'];

function initSearch() {
  const toggle = document.getElementById('nav-search-toggle');
  const close = document.getElementById('nav-search-close');
  const overlay = document.getElementById('nova-search-overlay');
  const input = document.getElementById('nova-search-input');
  const results = document.getElementById('nova-search-results');

  if (!toggle || !overlay) return;

  function open() {
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 150);
    renderDefault();
  }

  function closeOverlay() {
    overlay.classList.remove('open');
    input.value = '';
  }

  toggle.addEventListener('click', () => {
    overlay.classList.contains('open') ? closeOverlay() : open();
  });
  close.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
  });

  function renderDefault() {
    results.innerHTML = `
      <div class="search-section-label">Popular searches</div>
      <div class="search-chip-row">
        ${NOVA_POPULAR_SEARCHES.map((term) => `<button class="search-chip" data-term="${term}">${term}</button>`).join('')}
      </div>
    `;
    results.querySelectorAll('.search-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        input.value = chip.dataset.term;
        renderResults(chip.dataset.term);
      });
    });
  }

  function renderResults(term) {
    const q = term.trim().toLowerCase();
    if (!q) return renderDefault();
    const matches = NOVA_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 6);
    if (matches.length === 0) {
      results.innerHTML = `<div class="search-section-label">No results for "${term}"</div>`;
      return;
    }
    results.innerHTML = `
      <div class="search-section-label">Search results</div>
      ${matches.map((p) => `
        <a href="product.html?id=${p.id}" class="search-result-item">
          <img src="${p.image}" alt="${p.name}" />
          <div>
            <div class="search-result-name">${p.name}</div>
            <div class="search-result-category">${capitalize(p.category)}</div>
          </div>
          <div class="search-result-price">${formatCurrency(p.price)}</div>
        </a>
      `).join('')}
    `;
  }

  input.addEventListener('input', () => renderResults(input.value));
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
