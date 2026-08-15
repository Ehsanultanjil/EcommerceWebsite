document.addEventListener('DOMContentLoaded', async () => {
  if (!(await barazRequireAdmin())) return;
  renderAdminSidebar('products');

  const categorySelect = document.getElementById('field-category');
  const imageInput = document.getElementById('field-image');
  const imagePreview = document.getElementById('image-preview');
  const id = qs('id');

  let categories = [];
  let editing = null;
  try {
    const requests = [apiGet('/categories')];
    if (id) requests.push(apiGet(`/products/${id}`));
    const [categoriesResult, editingResult] = await Promise.all(requests);
    categories = categoriesResult;
    editing = editingResult || null;
  } catch (e) {
    showToast("Couldn't load this product");
    window.location.href = 'products.html';
    return;
  }

  categorySelect.innerHTML = categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');

  if (editing) {
    document.getElementById('edit-page-title').textContent = 'Edit Product';
    document.getElementById('edit-page-subtitle').textContent = editing.name;
    document.getElementById('field-name').value = editing.name;
    categorySelect.value = editing.category ? editing.category.id : '';
    document.getElementById('field-price').value = editing.price;
    document.getElementById('field-original-price').value = editing.comparePrice || '';
    document.getElementById('field-stock').value = editing.stock;
    document.getElementById('field-desc').value = editing.description || '';
    document.getElementById('field-isnew').checked = !!editing.isNew;
    imageInput.value = editing.imageUrl || '';
    imagePreview.src = editing.imageUrl || '';
  } else {
    const placeholderImg = `https://picsum.photos/seed/baraz-new-${Date.now()}/1000/1100`;
    imageInput.value = placeholderImg;
    imagePreview.src = placeholderImg;
  }

  imageInput.addEventListener('input', () => {
    imagePreview.src = imageInput.value;
  });

  document.getElementById('product-edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type=submit]');
    submitBtn.disabled = true;

    const name = data.get('name');
    const slug = editing ? editing.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const payload = {
      categoryId: data.get('category'),
      name,
      slug,
      description: data.get('desc'),
      price: Number(data.get('price')),
      comparePrice: data.get('originalPrice') ? Number(data.get('originalPrice')) : null,
      stock: Number(data.get('stock')),
      imageUrl: data.get('image'),
      // No "featured" control in this form — preserve it on edit rather than
      // silently un-featuring a product every time it's saved.
      featured: editing ? editing.featured : false,
      isNew: document.getElementById('field-isnew').checked,
      active: true,
    };

    try {
      if (editing) {
        await apiPut(`/admin/products/${editing.id}`, payload);
      } else {
        await apiPost('/admin/products', payload);
      }
      showToast(editing ? 'Product updated' : 'Product added');
      window.location.href = 'products.html';
    } catch (e) {
      submitBtn.disabled = false;
      if (e instanceof ApiError && e.status !== 401) showToast(e.message);
    }
  });
});
