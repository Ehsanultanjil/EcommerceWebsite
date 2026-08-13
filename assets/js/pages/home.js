document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('home');
  renderFooter();

  const categoryGrid = document.getElementById('category-grid');
  categoryGrid.innerHTML = NOVA_CATEGORIES.map((cat) => `
    <a href="shop.html?category=${cat.id}" class="category-card">
      <img src="${cat.image}" alt="${cat.name}" />
      <div class="category-overlay"></div>
      <div class="category-label">
        <span>${cat.name}</span>
        <span class="link-arrow">Explore
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </div>
    </a>
  `).join('');

  const featuredGrid = document.getElementById('featured-grid');
  featuredGrid.innerHTML = NOVA_PRODUCTS.slice(0, 8).map(novaProductCardHtml).join('');

  const track = document.getElementById('new-arrivals-track');
  const newArrivals = NOVA_PRODUCTS.filter((p) => p.isNew).concat(NOVA_PRODUCTS.filter((p) => !p.isNew)).slice(0, 8);
  track.innerHTML = newArrivals.map((p) => `<div class="carousel-item">${novaProductCardHtml(p)}</div>`).join('');

  document.getElementById('carousel-next').addEventListener('click', () => {
    track.scrollBy({ left: 320, behavior: 'smooth' });
  });
  document.getElementById('carousel-prev').addEventListener('click', () => {
    track.scrollBy({ left: -320, behavior: 'smooth' });
  });

  document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Subscribed! Welcome to NOVA.');
    e.target.reset();
  });
});
