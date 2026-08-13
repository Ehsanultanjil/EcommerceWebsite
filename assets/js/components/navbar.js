const NOVA_NAV_LINKS = [
  { label: 'Shop', href: 'shop.html' },
  { label: 'Categories', href: 'shop.html' },
  { label: 'New Arrivals', href: 'shop.html?filter=new' },
  { label: 'Deals', href: 'shop.html?filter=deals' },
];

const NOVA_ICONS = {
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-10-9.3C.5 8 2 4.5 5.5 4c2-.3 3.8.7 6.5 3.2C14.7 4.7 16.5 3.7 18.5 4c3.5.5 5 4 3.5 7.2-2.5 4.7-10 9.3-10 9.3z"/></svg>',
  user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.6-4 5-6 8-6s6.4 2 8 6"/></svg>',
  bag: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>',
  close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
};

function renderNavbar(activePage) {
  const root = document.getElementById('navbar-root');
  if (!root) return;

  const links = NOVA_NAV_LINKS.map((l) => {
    const isActive = activePage === 'shop' && l.label === 'Shop';
    return `<a href="${l.href}" class="nav-link${isActive ? ' active' : ''}">${l.label}</a>`;
  }).join('');

  root.innerHTML = `
    <header class="navbar" id="nova-navbar" data-page="${activePage}">
      <div class="container navbar-inner">
        <a href="index.html" class="navbar-logo">NOVA</a>

        <nav class="navbar-links">${links}</nav>

        <div class="navbar-actions">
          <button class="icon-btn" id="nav-search-toggle" aria-label="Search">${NOVA_ICONS.search}</button>
          <a href="account-wishlist.html" class="icon-btn" id="nav-wishlist-link" aria-label="Wishlist">
            ${NOVA_ICONS.heart}
            <span class="icon-badge" id="wishlist-count" hidden>0</span>
          </a>
          <a href="account.html" class="icon-btn" aria-label="Account">${NOVA_ICONS.user}</a>
          <a href="cart.html" class="icon-btn" id="nav-cart-link" aria-label="Cart">
            ${NOVA_ICONS.bag}
            <span class="icon-badge" id="cart-count" hidden>0</span>
          </a>
          <button class="icon-btn navbar-burger" id="nav-burger" aria-label="Menu">${NOVA_ICONS.menu}</button>
        </div>
      </div>

      <div class="navbar-mobile" id="nova-mobile-menu">
        ${NOVA_NAV_LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}
        <a href="account.html">Account</a>
        <a href="account-wishlist.html">Wishlist</a>
      </div>

      <div class="search-overlay" id="nova-search-overlay">
        <div class="container search-overlay-inner">
          <div class="search-bar">
            <input type="text" id="nova-search-input" class="search-input" placeholder="Search products..." autocomplete="off" />
            <button class="icon-btn" id="nav-search-close" aria-label="Close search">${NOVA_ICONS.close}</button>
          </div>
          <div id="nova-search-results" class="search-results"></div>
        </div>
      </div>
    </header>
  `;

  updateNavCounts();
  document.addEventListener('nova:cart-change', updateNavCounts);
  document.addEventListener('nova:wishlist-change', updateNavCounts);

  const navbar = document.getElementById('nova-navbar');
  const burger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('nova-mobile-menu');

  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  function applyScrollState() {
    const isHome = activePage === 'home';
    if (!isHome || window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  applyScrollState();
  window.addEventListener('scroll', applyScrollState, { passive: true });

  if (typeof initSearch === 'function') initSearch();
}

function updateNavCounts() {
  const cartCount = document.getElementById('cart-count');
  const wishlistCount = document.getElementById('wishlist-count');
  if (cartCount) {
    const n = NovaStore.cartCount();
    cartCount.textContent = n;
    cartCount.hidden = n === 0;
  }
  if (wishlistCount) {
    const n = NovaStore.getWishlist().length;
    wishlistCount.textContent = n;
    wishlistCount.hidden = n === 0;
  }
}
