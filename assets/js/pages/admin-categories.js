document.addEventListener('DOMContentLoaded', () => {
  renderAdminSidebar('categories');
  document.getElementById('add-category-btn').addEventListener('click', () => openCategoryModal());
  renderCategoriesTable();
});

function renderCategoriesTable() {
  const categories = novaAllAdminCategories();
  const products = novaAllAdminProducts();

  document.getElementById('categories-count-label').textContent = `${categories.length} categories`;

  document.getElementById('categories-table-body').innerHTML = categories.map((c) => {
    const count = products.filter((p) => p.category === c.id).length;
    return `
      <tr>
        <td>
          <div class="admin-table-product">
            <img src="${c.image}" alt="${c.name}" />
            <span>${c.name}</span>
          </div>
        </td>
        <td>${count} products</td>
        <td>
          <div class="admin-table-actions">
            <button class="icon-btn edit-category-btn" data-id="${c.id}" aria-label="Edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <button class="icon-btn delete-category-btn" data-id="${c.id}" aria-label="Delete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.edit-category-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = novaAllAdminCategories().find((c) => c.id === btn.dataset.id);
      openCategoryModal(cat);
    });
  });

  document.querySelectorAll('.delete-category-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      novaDeleteAdminCategory(btn.dataset.id);
      showToast('Category deleted');
      renderCategoriesTable();
    });
  });
}

function openCategoryModal(category) {
  const editing = !!category;
  openModal(`
    <h3>${editing ? 'Edit' : 'Add'} Category</h3>
    <form id="category-form" style="margin-top:20px;display:flex;flex-direction:column;gap:16px">
      <div class="field"><label>Name</label><input class="input" name="name" value="${editing ? category.name : ''}" required /></div>
      <div class="field"><label>Image URL</label><input class="input" name="image" value="${editing ? category.image : 'https://picsum.photos/seed/nova-cat-new/700/860'}" required /></div>
      <button type="submit" class="btn btn-primary btn-block">Save Category</button>
    </form>
  `);

  document.getElementById('category-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name');
    const id = editing ? category.id : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    novaSaveAdminCategory({ id, name, image: data.get('image') });
    closeModal();
    showToast(editing ? 'Category updated' : 'Category added');
    renderCategoriesTable();
  });
}
