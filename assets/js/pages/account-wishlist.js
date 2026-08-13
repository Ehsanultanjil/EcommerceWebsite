document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('account');
  renderFooter();
  renderAccountSidebar('wishlist');
  renderWishlist();
  document.addEventListener('baraz:wishlist-change', renderWishlist);
});

function renderWishlist() {
  const ids = BarazStore.getWishlist();
  const products = ids.map(barazGetProduct).filter(Boolean);
  const content = document.getElementById('account-content');

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
