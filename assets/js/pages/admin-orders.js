const ADMIN_ORDER_STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
let adminOrdersState = { search: '', status: '' };
let adminOrdersAll = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (!(await barazRequireAdmin())) return;
  renderAdminSidebar('orders');

  document.getElementById('order-search').addEventListener('input', (e) => {
    adminOrdersState.search = e.target.value.toLowerCase();
    renderOrdersTable();
  });
  document.getElementById('status-filter').addEventListener('change', (e) => {
    adminOrdersState.status = e.target.value;
    loadOrders();
  });

  await loadOrders();
});

async function loadOrders() {
  const tbody = document.getElementById('orders-table-body');
  tbody.innerHTML = `<tr><td colspan="7" class="text-secondary">Loading orders…</td></tr>`;
  try {
    const query = adminOrdersState.status ? `?status=${adminOrdersState.status}` : '';
    adminOrdersAll = await apiGet(`/admin/orders${query}`);
  } catch (e) {
    if (e instanceof ApiError && e.status !== 401) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-secondary">Couldn't load orders — try refreshing.</td></tr>`;
    }
    return;
  }
  renderOrdersTable();
}

function statusClass(status) {
  if (status === 'DELIVERED') return 'badge-success';
  if (status === 'CANCELLED') return 'badge-danger';
  if (status === 'PENDING') return 'badge-neutral';
  return 'badge-accent';
}

function statusLabel(status) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function renderOrdersTable() {
  let list = adminOrdersAll;
  if (adminOrdersState.search) {
    const q = adminOrdersState.search;
    list = list.filter((o) => o.shippingName.toLowerCase().includes(q) || o.orderNumber.toLowerCase().includes(q));
  }

  document.getElementById('orders-count-label').textContent = `${list.length} orders`;

  document.getElementById('orders-table-body').innerHTML = list.map((o) => `
    <tr>
      <td>#${o.orderNumber}</td>
      <td>${o.shippingName}</td>
      <td>${formatDate(o.createdAt)}</td>
      <td>${o.items.reduce((s, i) => s + i.quantity, 0)}</td>
      <td>${formatCurrency(o.total)}</td>
      <td><span class="badge ${statusClass(o.status)}">${statusLabel(o.status)}</span></td>
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
  const order = adminOrdersAll.find((o) => o.id === id);
  if (!order) return;

  openModal(`
    <h3>Order #${order.orderNumber}</h3>
    <p class="text-secondary" style="margin-top:4px">${order.shippingName} · ${order.shippingPhone}</p>
    <div class="summary-row"><span>Date</span><span>${formatDate(order.createdAt)}</span></div>
    <div class="summary-row"><span>Items</span><span>${order.items.reduce((s, i) => s + i.quantity, 0)}</span></div>
    <div class="summary-row"><span>Payment</span><span>${order.payment ? order.payment.method.replace(/_/g, ' ') : '—'}</span></div>
    <div class="summary-row summary-total"><span>Total</span><span>${formatCurrency(order.total)}</span></div>
    <div class="field" style="margin-top:20px">
      <label>Update Status</label>
      <select class="select" id="modal-status-select">
        ${ADMIN_ORDER_STATUS_OPTIONS.map((s) => `<option value="${s}" ${s === order.status ? 'selected' : ''}>${statusLabel(s)}</option>`).join('')}
      </select>
    </div>
    <button class="btn btn-primary btn-block" id="save-status-btn" style="margin-top:16px">Save Status</button>
  `);

  document.getElementById('save-status-btn').addEventListener('click', async () => {
    const status = document.getElementById('modal-status-select').value;
    const btn = document.getElementById('save-status-btn');
    btn.disabled = true;
    try {
      await apiPut(`/admin/orders/${order.id}/status`, { status });
      closeModal();
      showToast('Order status updated');
      await loadOrders();
    } catch (e) {
      btn.disabled = false;
      if (e instanceof ApiError && e.status !== 401) showToast(e.message);
    }
  });
}
