document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('home');
  renderFooter();
  loadCategories();
  loadFeatured();
  loadNewArrivals();

  document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Subscribed! Welcome to BARAZ.');
    e.target.reset();
  });
});

async function loadCategories() {
  const grid = document.getElementById('category-grid');
  try {
    const categories = await apiGet('/categories');
    grid.innerHTML = categories.map((cat) => `
      <a href="shop.html?category=${cat.slug}" class="category-card">
        <img src="${cat.imageUrl}" alt="${cat.name}" />
        <div class="category-overlay"></div>
        <div class="category-label">
          <span>${cat.name}</span>
          <span class="link-arrow">Explore
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </div>
      </a>
    `).join('');
  } catch (e) {
    grid.innerHTML = `<p class="text-secondary">Couldn't load categories right now.</p>`;
  }
}

async function loadFeatured() {
  const grid = document.getElementById('featured-grid');
  try {
    const products = await apiGet('/products?featured=true');
    grid.innerHTML = products.length
      ? products.map(barazProductCardHtml).join('')
      : `<p class="text-secondary">No featured products yet.</p>`;
  } catch (e) {
    grid.innerHTML = `<p class="text-secondary">Couldn't load products right now.</p>`;
  }
}

async function loadNewArrivals() {
  const track = document.getElementById('new-arrivals-track');
  try {
    const products = await apiGet('/products?newArrivals=true');
    track.innerHTML = products.length
      ? products.map((p) => `<div class="carousel-item">${barazProductCardHtml(p)}</div>`).join('')
      : `<p class="text-secondary">No new arrivals yet.</p>`;
  } catch (e) {
    track.innerHTML = `<p class="text-secondary">Couldn't load new arrivals right now.</p>`;
  }

  document.getElementById('carousel-next').addEventListener('click', () => {
    track.scrollBy({ left: 320, behavior: 'smooth' });
  });
  document.getElementById('carousel-prev').addEventListener('click', () => {
    track.scrollBy({ left: -320, behavior: 'smooth' });
  });
}
