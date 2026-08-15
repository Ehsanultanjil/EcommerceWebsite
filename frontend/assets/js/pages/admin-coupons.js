document.addEventListener('DOMContentLoaded', async () => {
  if (!(await barazRequireAdmin())) return;
  renderAdminSidebar('coupons');
  document.getElementById('add-coupon-btn').addEventListener('click', () => openCouponModal());
  renderCouponsTable();
});

function renderCouponsTable() {
  const coupons = barazAllAdminCoupons();
  document.getElementById('coupons-count-label').textContent = `${coupons.length} coupons`;

  document.getElementById('coupons-table-body').innerHTML = coupons.map((c) => `
    <tr>
      <td><strong>${c.code}</strong></td>
      <td>${c.type}</td>
      <td>${c.value}</td>
      <td>${c.used}</td>
      <td>${formatDate(c.expires)}</td>
      <td><span class="badge ${c.status === 'Active' ? 'badge-success' : 'badge-danger'}">${c.status}</span></td>
      <td>
        <div class="admin-table-actions">
          <button class="icon-btn edit-coupon-btn" data-code="${c.code}" aria-label="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="icon-btn delete-coupon-btn" data-code="${c.code}" aria-label="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.edit-coupon-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const coupon = barazAllAdminCoupons().find((c) => c.code === btn.dataset.code);
      openCouponModal(coupon);
    });
  });

  document.querySelectorAll('.delete-coupon-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      barazDeleteAdminCoupon(btn.dataset.code);
      showToast('Coupon deleted');
      renderCouponsTable();
    });
  });
}

function openCouponModal(coupon) {
  const editing = !!coupon;
  openModal(`
    <h3>${editing ? 'Edit' : 'Add'} Coupon</h3>
    <form id="coupon-form" style="margin-top:20px;display:flex;flex-direction:column;gap:16px">
      <div class="field"><label>Code</label><input class="input" name="code" value="${editing ? coupon.code : ''}" ${editing ? 'readonly' : ''} required style="text-transform:uppercase" /></div>
      <div class="form-row">
        <div class="field">
          <label>Type</label>
          <select class="select" name="type">
            <option ${editing && coupon.type === 'Percentage' ? 'selected' : ''}>Percentage</option>
            <option ${editing && coupon.type === 'Shipping' ? 'selected' : ''}>Shipping</option>
            <option ${editing && coupon.type === 'Fixed' ? 'selected' : ''}>Fixed</option>
          </select>
        </div>
        <div class="field"><label>Value</label><input class="input" name="value" value="${editing ? coupon.value : ''}" placeholder="15%" required /></div>
      </div>
      <div class="field"><label>Expires</label><input class="input" type="date" name="expires" value="${editing ? coupon.expires : '2026-12-31'}" required /></div>
      <label class="checkbox-row"><input type="checkbox" name="active" ${!editing || coupon.status === 'Active' ? 'checked' : ''} /> Active</label>
      <button type="submit" class="btn btn-primary btn-block">Save Coupon</button>
    </form>
  `);

  document.getElementById('coupon-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    barazSaveAdminCoupon({
      code: data.get('code').toUpperCase(),
      type: data.get('type'),
      value: data.get('value'),
      used: editing ? coupon.used : 0,
      expires: data.get('expires'),
      status: data.get('active') ? 'Active' : 'Expired',
    });
    closeModal();
    showToast(editing ? 'Coupon updated' : 'Coupon added');
    renderCouponsTable();
  });
}
