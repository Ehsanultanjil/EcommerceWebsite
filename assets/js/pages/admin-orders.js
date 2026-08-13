const BARAZ_ORDER_STATUS_OPTIONS = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
let adminOrdersState = { search: '', status: '' };

document.addEventListener('DOMContentLoaded', () => {
  renderAdminSidebar('orders');

  document.getElementById('order-search').addEventListener('input', (e) => {
    adminOrdersState.search = e.target.value.toLowerCase();
    renderOrdersTable();
  });
  document.getElementById('status-filter').addEventListener('change', (e) => {
    adminOrdersState.status = e.target.value;
    renderOrdersTable();
  });

  renderOrdersTable();
});

function renderOrdersTable() {
  let list = barazAllAdminOrders();
  if (adminOrdersState.status) list = list.filter((o) => o.status === adminOrdersState.status);
  if (adminOrdersState.search) {
    const q = adminOrdersState.search;
    list = list.filter((o) => o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
  }

  document.getElementById('orders-count-label').textContent = `${list.length} orders`;

  document.getElementById('orders-table-body').innerHTML = list.map((o) => `
    <tr>
      <td>#${o.id}</td>
      <td>${o.customer}</td>
      <td>${formatDate(o.date)}</td>
      <td>${o.items}</td>
      <td>${formatCurrency(o.total)}</td>
      <td><span class="badge ${barazAdminOrderStatusClass(o.status)}">${o.status}</span></td>
      <td>
        <button class="btn btn-outline btn-sm view-order-btn" data-id="${o.id}">View</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.view-order-btn').forEach((btn) => {
    btn.addEventListener('click', () => openOrderModal(btn.dataset.id));
  });
}

function openOrderModal(id) {
  const order = barazAllAdminOrders().find((o) => o.id === id);
  if (!order) return;

  openModal(`
    <h3>Order #${order.id}</h3>
    <p class="text-secondary" style="margin-top:4px">${order.customer} · ${order.email}</p>
    <div class="summary-row"><span>Date</span><span>${formatDate(order.date)}</span></div>
    <div class="summary-row"><span>Items</span><span>${order.items}</span></div>
    <div class="summary-row"><span>Payment</span><span>${order.payment}</span></div>
    <div class="summary-row summary-total"><span>Total</span><span>${formatCurrency(order.total)}</span></div>
    <div class="field" style="margin-top:20px">
      <label>Update Status</label>
      <select class="select" id="modal-status-select">
        ${BARAZ_ORDER_STATUS_OPTIONS.map((s) => `<option ${s === order.status ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
    </div>
    <button class="btn btn-primary btn-block" id="save-status-btn" style="margin-top:16px">Save Status</button>
  `);

  document.getElementById('save-status-btn').addEventListener('click', () => {
    const status = document.getElementById('modal-status-select').value;
    barazUpdateAdminOrderStatus(order.id, status);
    closeModal();
    showToast('Order status updated');
    renderOrdersTable();
  });
}
