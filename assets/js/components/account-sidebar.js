const NOVA_ACCOUNT_LINKS = [
  { id: 'profile', label: 'Profile', href: 'account.html' },
  { id: 'orders', label: 'Orders', href: 'account-orders.html' },
  { id: 'wishlist', label: 'Wishlist', href: 'account-wishlist.html' },
  { id: 'addresses', label: 'Addresses', href: 'account-addresses.html' },
  { id: 'settings', label: 'Settings', href: 'account-settings.html' },
];

function renderAccountSidebar(active) {
  const root = document.getElementById('account-sidebar');
  if (!root) return;
  root.innerHTML = `
    <nav class="account-nav card">
      ${NOVA_ACCOUNT_LINKS.map((l) => `
        <a href="${l.href}" class="account-nav-link${l.id === active ? ' active' : ''}">${l.label}</a>
      `).join('')}
      <button class="account-nav-link account-logout" id="account-logout-btn">Logout</button>
    </nav>
  `;
  document.getElementById('account-logout-btn').addEventListener('click', () => {
    NovaStore.logout();
    showToast('Logged out');
    window.location.href = 'index.html';
  });
}
