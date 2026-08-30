const BARAZ_ADMIN_LINKS = [
  { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html' },
  { id: 'products', label: 'Products', href: 'products.html' },
  { id: 'categories', label: 'Categories', href: 'categories.html' },
  { id: 'orders', label: 'Orders', href: 'orders.html' },
  { id: 'customers', label: 'Customers', href: 'customers.html' },
  { id: 'coupons', label: 'Coupons', href: 'coupons.html' },
  { id: 'analytics', label: 'Analytics', href: 'analytics.html' },
];

const BARAZ_ADMIN_ICONS = {
  dashboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  products: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
  categories: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>',
  orders: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  customers: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1.2-3.4 3.6-5 6.5-5s5.3 1.6 6.5 5"/><circle cx="17.5" cy="8" r="2.7"/><path d="M15.5 13.2c2.2.3 3.9 1.7 4.9 4.6"/></svg>',
  coupons: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4V9z"/><line x1="9" y1="7" x2="9" y2="17"/></svg>',
  analytics: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V10"/><path d="M12 19V5"/><path d="M20 19v-7"/></svg>',
  settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9c.32-.62.27-1.36-.15-1.94l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .68.38 1.29 1 1.51.62.24 1.36.14 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.42.58-.47 1.32-.15 1.94.24.62.85 1 1.51 1H21a2 2 0 0 1 0 4h-.09c-.68 0-1.29.38-1.51 1z"/></svg>',
};

function renderAdminSidebar(active) {
  const root = document.getElementById('admin-sidebar-root');
  if (!root) return;
  root.innerHTML = `
    <aside class="admin-sidebar">
      <div class="admin-logo">BARAZ <span>ADMIN</span></div>
      <nav class="admin-nav">
        ${BARAZ_ADMIN_LINKS.map((l) => `
          <a href="${l.href}" class="admin-nav-link${l.id === active ? ' active' : ''}">
            ${BARAZ_ADMIN_ICONS[l.id]}<span>${l.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="admin-nav admin-nav-bottom">
        <a href="settings.html" class="admin-nav-link${active === 'settings' ? ' active' : ''}">
          ${BARAZ_ADMIN_ICONS.settings}<span>Settings</span>
        </a>
        <a href="../index.html" class="admin-nav-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 18l-6-6 6-6"/></svg>
          <span>View Store</span>
        </a>
        <button class="admin-nav-link admin-logout" id="admin-logout-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  `;

  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await barazSignOut();
      showToast('Logged out');
      window.location.href = '../login.html';
    });
  }
}
