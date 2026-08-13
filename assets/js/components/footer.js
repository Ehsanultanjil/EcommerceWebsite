function renderFooter() {
  const root = document.getElementById('footer-root');
  if (!root) return;
  const year = 2026;
  root.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <div class="navbar-logo">NOVA</div>
          <p class="text-secondary">Elevated everyday essentials.</p>
        </div>

        <div class="footer-col">
          <div class="footer-col-title">Shop</div>
          <a href="shop.html">All Products</a>
          <a href="shop.html?filter=new">New Arrivals</a>
          <a href="shop.html">Categories</a>
          <a href="shop.html?filter=deals">Deals</a>
        </div>

        <div class="footer-col">
          <div class="footer-col-title">Help</div>
          <a href="#">Contact</a>
          <a href="#">Shipping</a>
          <a href="#">Returns</a>
          <a href="#">FAQ</a>
        </div>

        <div class="footer-col">
          <div class="footer-col-title">Company</div>
          <a href="#">About</a>
          <a href="#">Our Story</a>
          <a href="#">Careers</a>
          <a href="#">Privacy</a>
        </div>
      </div>

      <div class="container footer-bottom">
        <span>&copy; ${year} NOVA</span>
        <div class="footer-bottom-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
        </div>
      </div>
    </footer>
  `;
}
