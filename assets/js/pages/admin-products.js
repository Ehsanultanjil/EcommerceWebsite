let adminProductsState = { search: '', category: '' };
let adminProductsAll = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (!(await barazRequireAdmin())) return;
  renderAdminSidebar('products');

  document.getElementById('product-search').addEventListener('input', (e) => {
    adminProductsState.search = e.target.value.toLowerCase();
    renderProductsTable();
  });

  const tbody = document.getElementById('products-table-body');
  tbody.innerHTML = `<tr><td colspan="6" class="text-secondary">Loading products…</td></tr>`;

  let categories = [];
  try {
    [adminProductsAll, categories] = await Promise.all([apiGet('/products'), apiGet('/categories')]);
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-secondary">Couldn't load products — try refreshing.</td></tr>`;
    return;
  }

  const categorySelect = document.getElementById('category-filter');
  categorySelect.innerHTML += categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
  categorySelect.addEventListener('change', () => {
    adminProductsState.category = categorySelect.value;
    renderProductsTable();
  });

  renderProductsTable();
});

function renderProductsTable() {
  let list = adminProductsAll;
  if (adminProductsState.category) list = list.filter((p) => p.category && p.category.id === adminProductsState.category);
  if (adminProductsState.search) list = list.filter((p) => p.name.toLowerCase().includes(adminProductsState.search));

  document.getElementById('products-count-label').textContent = `${list.length} products`;

  document.getElementById('products-table-body').innerHTML = list.map((p) => {
    const stock = p.stock;
    return `
      <tr>
        <td>
          <div class="admin-table-product">
            <img src="${p.imageUrl}" alt="${p.name}" />
            <span>${p.name}</span>
          </div>
        </td>
        <td>${p.category ? p.category.name : ''}</td>
        <td>${formatCurrency(p.price)}</td>
        <td>${stock}</td>
        <td><span class="badge ${stock > 15 ? 'badge-success' : 'badge-danger'}">${stock > 15 ? 'In Stock' : 'Low Stock'}</span></td>
        <td>
          <div class="admin-table-actions">
            <a href="product-edit.html?id=${p.id}" class="icon-btn" aria-label="Edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </a>
            <button class="icon-btn delete-product-btn" data-id="${p.id}" aria-label="Delete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.delete-product-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const product = adminProductsAll.find((p) => p.id === id);
      openModal(`
        <h3>Delete product?</h3>
        <p class="text-secondary" style="margin:12px 0 20px">Remove "${product.name}" from the catalog. This can't be undone.</p>
        <button class="btn btn-danger btn-block" id="confirm-delete-product">Delete</button>
      `);
      document.getElementById('confirm-delete-product').addEventListener('click', async () => {
        try {
          await apiDelete(`/admin/products/${id}`);
          adminProductsAll = adminProductsAll.filter((p) => p.id !== id);
          closeModal();
          showToast('Product deleted');
          renderProductsTable();
        } catch (e) {
          if (e instanceof ApiError && e.status !== 401) showToast(e.message);
        }
      });
    });
  });
}
