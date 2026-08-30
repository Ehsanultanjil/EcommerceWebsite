document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('account');
  renderFooter();
  renderAccountSidebar('wishlist');
  if (!(await barazRequireCustomer())) return;
  renderWishlist();
  document.addEventListener('baraz:wishlist-change', renderWishlist);
});

async function renderWishlist() {
  const ids = BarazStore.getWishlist();
  const content = document.getElementById('account-content');

  if (ids.length === 0) {
    content.innerHTML = `
      <div class="empty-state card">
        <h3>Your wishlist is empty</h3>
        <p>Save products you love to find them here later.</p>
        <a href="shop.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }

  content.innerHTML = `<p class="text-secondary" style="padding:24px 0">Loading your wishlist…</p>`;

  const results = await Promise.allSettled(ids.map((id) => apiGet(`/products/${id}`)));
  const products = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);

  if (products.length === 0) {
    content.innerHTML = `
      <div class="empty-state card">
        <h3>Your wishlist is empty</h3>
        <p>Save products you love to find them here later.</p>
        <a href="shop.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }

  content.innerHTML = `<div class="grid-4">${products.map(barazProductCardHtml).join('')}</div>`;
}
