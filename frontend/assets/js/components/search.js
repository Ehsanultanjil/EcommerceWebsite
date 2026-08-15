const BARAZ_POPULAR_SEARCHES = ['Headphones', 'Smart watches', 'Backpacks', 'Sneakers'];
let barazSearchSeq = 0;
let barazSearchDebounce = null;

function initSearch() {
  const toggle = document.getElementById('nav-search-toggle');
  const close = document.getElementById('nav-search-close');
  const overlay = document.getElementById('baraz-search-overlay');
  const input = document.getElementById('baraz-search-input');
  const results = document.getElementById('baraz-search-results');

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
        ${BARAZ_POPULAR_SEARCHES.map((term) => `<button class="search-chip" data-term="${term}">${term}</button>`).join('')}
      </div>
    `;
    results.querySelectorAll('.search-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        input.value = chip.dataset.term;
        renderResults(chip.dataset.term);
      });
    });
  }

  async function renderResults(term) {
    const q = term.trim();
    if (!q) return renderDefault();

    const seq = ++barazSearchSeq;
    results.innerHTML = `<div class="search-section-label">Searching…</div>`;

    let matches;
    try {
      matches = await apiGet(`/products?search=${encodeURIComponent(q)}`);
    } catch (e) {
      if (seq === barazSearchSeq) {
        results.innerHTML = `<div class="search-section-label">Couldn't load results — try again</div>`;
      }
      return;
    }
    if (seq !== barazSearchSeq) return; // a newer keystroke already superseded this response

    matches = matches.slice(0, 6);
    if (matches.length === 0) {
      results.innerHTML = `<div class="search-section-label">No results for "${term}"</div>`;
      return;
    }
    results.innerHTML = `
      <div class="search-section-label">Search results</div>
      ${matches.map((p) => `
        <a href="product.html?id=${p.id}" class="search-result-item">
          <img src="${p.imageUrl}" alt="${p.name}" />
          <div>
            <div class="search-result-name">${p.name}</div>
            <div class="search-result-category">${p.category ? p.category.name : ''}</div>
          </div>
          <div class="search-result-price">${formatCurrency(p.price)}</div>
        </a>
      `).join('')}
    `;
  }

  input.addEventListener('input', () => {
    clearTimeout(barazSearchDebounce);
    const value = input.value;
    barazSearchDebounce = setTimeout(() => renderResults(value), 250);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
