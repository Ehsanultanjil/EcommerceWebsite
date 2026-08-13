document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('account');
  renderFooter();
  renderAccountSidebar('addresses');
  renderAddresses();
});

function renderAddresses() {
  const addresses = BarazStore.getAddresses();
  const content = document.getElementById('account-content');

  content.innerHTML = `
    <div class="card card-pad" style="margin-bottom:24px">
      <h3>Add New Address</h3>
      <form id="address-form" class="auth-form">
        <div class="field"><label>Full Name</label><input class="input" name="name" required /></div>
        <div class="field"><label>Address</label><input class="input" name="line1" required /></div>
        <div class="form-row">
          <div class="field"><label>City</label><input class="input" name="city" required /></div>
          <div class="field"><label>Postal Code</label><input class="input" name="postal" required /></div>
        </div>
        <div class="field"><label>Phone</label><input class="input" name="phone" required /></div>
        <button type="submit" class="btn btn-primary">Save Address</button>
      </form>
    </div>
    <div id="address-list">
      ${addresses.length === 0
        ? '<p class="text-secondary">No saved addresses yet.</p>'
        : addresses.map((addr, i) => `
          <div class="address-card card">
            <div>
              <div class="address-card-name">${addr.name}</div>
              <div class="text-secondary">${addr.line1}, ${addr.city} ${addr.postal}</div>
              <div class="text-secondary">${addr.phone}</div>
            </div>
            <button class="icon-btn remove-address-btn" data-index="${i}" aria-label="Remove address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        `).join('')}
    </div>
  `;

  document.getElementById('address-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    BarazStore.addAddress({
      name: data.get('name'),
      line1: data.get('line1'),
      city: data.get('city'),
      postal: data.get('postal'),
      phone: data.get('phone'),
    });
    showToast('Address saved');
    renderAddresses();
  });

  content.querySelectorAll('.remove-address-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      BarazStore.removeAddress(Number(btn.dataset.index));
      renderAddresses();
    });
  });
}
