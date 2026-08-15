document.addEventListener('DOMContentLoaded', async () => {
  if (!(await barazRequireAdmin())) return;
  renderAdminSidebar('dashboard');

  const revenue = BARAZ_REVENUE_SERIES[BARAZ_REVENUE_SERIES.length - 1];
  const orderCount = BARAZ_ADMIN_ORDERS.length * 41;

  let productCount = '—';
  let categoryCount = '—';
  try {
    const [products, categories] = await Promise.all([apiGet('/products'), apiGet('/categories')]);
    productCount = products.length;
    categoryCount = categories.length;
  } catch (e) {
    // Stat tile just shows a dash if the API is unreachable — not fatal to the page.
  }

  document.getElementById('stat-grid').innerHTML = `
    <div class="card stat-tile">
      <div class="stat-tile-label">Revenue</div>
      <div class="stat-tile-value">${formatCurrency(revenue)}</div>
      <div class="stat-tile-delta up">↑ 12.4% vs last month</div>
    </div>
    <div class="card stat-tile">
      <div class="stat-tile-label">Orders</div>
      <div class="stat-tile-value">${orderCount}</div>
      <div class="stat-tile-delta up">↑ 8.1% vs last month</div>
    </div>
    <div class="card stat-tile">
      <div class="stat-tile-label">Products</div>
      <div class="stat-tile-value">${productCount}</div>
      <div class="stat-tile-delta">Across ${categoryCount} categories</div>
    </div>
  `;

  document.getElementById('chart-root').innerHTML = barazLineChartSvg(BARAZ_REVENUE_SERIES);
  document.getElementById('chart-labels').innerHTML = BARAZ_REVENUE_MONTHS.map((m) => `<span>${m}</span>`).join('');

  document.getElementById('recent-orders-body').innerHTML = BARAZ_ADMIN_ORDERS.slice(0, 6).map((o) => `
    <tr>
      <td>#${o.id}</td>
      <td>${o.customer}</td>
      <td>${formatCurrency(o.total)}</td>
      <td><span class="badge ${barazAdminOrderStatusClass(o.status)}">${o.status}</span></td>
    </tr>
  `).join('');
});
