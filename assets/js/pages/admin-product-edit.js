const NOVA_SWATCH_PALETTE = ['#171717', '#C4C4C4', '#374151', '#B08B5A', '#D6CDBF', '#92400E'];

document.addEventListener('DOMContentLoaded', () => {
  renderAdminSidebar('products');

  const categorySelect = document.getElementById('field-category');
  categorySelect.innerHTML = NOVA_CATEGORIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');

  const id = qs('id');
  const editing = id ? novaAllAdminProducts().find((p) => p.id === Number(id)) : null;
  const imageInput = document.getElementById('field-image');
  const imagePreview = document.getElementById('image-preview');

  if (editing) {
    document.getElementById('edit-page-title').textContent = 'Edit Product';
    document.getElementById('edit-page-subtitle').textContent = editing.name;
    document.getElementById('field-name').value = editing.name;
    categorySelect.value = editing.category;
    document.getElementById('field-price').value = editing.price;
    document.getElementById('field-original-price').value = editing.originalPrice || '';
    document.getElementById('field-colors').value = editing.colors.map((c) => c.name).join(', ');
    document.getElementById('field-desc').value = editing.desc;
    document.getElementById('field-isnew').checked = !!editing.isNew;
    imageInput.value = editing.image;
    imagePreview.src = editing.image;
  } else {
    const placeholderImg = `https://picsum.photos/seed/nova-new-${Date.now()}/1000/1100`;
    imageInput.value = placeholderImg;
    imagePreview.src = placeholderImg;
  }

  imageInput.addEventListener('input', () => {
    imagePreview.src = imageInput.value;
  });

  document.getElementById('product-edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const colorNames = data.get('colors').split(',').map((s) => s.trim()).filter(Boolean);

    const product = {
      id: editing ? editing.id : novaNextAdminProductId(),
      name: data.get('name'),
      category: data.get('category'),
      price: Number(data.get('price')),
      originalPrice: data.get('originalPrice') ? Number(data.get('originalPrice')) : null,
      image: data.get('image'),
      colors: colorNames.map((name, i) => ({ name, hex: NOVA_SWATCH_PALETTE[i % NOVA_SWATCH_PALETTE.length] })),
      desc: data.get('desc'),
      specs: editing ? editing.specs : {},
      rating: editing ? editing.rating : 4.5,
      reviews: editing ? editing.reviews : 0,
      isNew: document.getElementById('field-isnew').checked,
    };

    novaSaveAdminProduct(product);
    showToast(editing ? 'Product updated' : 'Product added');
    window.location.href = 'products.html';
  });
});
