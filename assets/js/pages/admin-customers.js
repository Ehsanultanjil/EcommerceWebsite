let customerSearch = '';

document.addEventListener('DOMContentLoaded', () => {
  renderAdminSidebar('customers');
  document.getElementById('customer-search').addEventListener('input', (e) => {
    customerSearch = e.target.value.toLowerCase();
    renderCustomersTable();
  });
  renderCustomersTable();
});

function renderCustomersTable() {
  let list = BARAZ_ADMIN_CUSTOMERS;
  if (customerSearch) {
    list = list.filter((c) => c.name.toLowerCase().includes(customerSearch) || c.email.toLowerCase().includes(customerSearch));
  }

  document.getElementById('customers-count-label').textContent = `${list.length} customers`;

  document.getElementById('customers-table-body').innerHTML = list.map((c) => `
    <tr>
      <td>
        <div class="admin-table-product">
          <div class="profile-avatar" style="width:36px;height:36px;font-size:14px">${c.name.charAt(0)}</div>
          <div>
            <div style="font-weight:600">${c.name}</div>
            <div class="text-secondary" style="font-size:12px">${c.email}</div>
          </div>
        </div>
      </td>
      <td>${c.orders}</td>
      <td>${formatCurrency(c.spent)}</td>
      <td>${formatDate(c.joined)}</td>
    </tr>
  `).join('');
}
