document.addEventListener('DOMContentLoaded', () => {
  renderAdminSidebar('analytics');

  const totalRevenue = NOVA_REVENUE_SERIES.reduce((a, b) => a + b, 0);
  const avgOrder = Math.round(totalRevenue / (NOVA_ADMIN_ORDERS.length * 41));

  document.getElementById('analytics-stat-grid').innerHTML = `
    <div class="card stat-tile">
      <div class="stat-tile-label">Total Revenue (YTD)</div>
      <div class="stat-tile-value">${formatCurrency(totalRevenue)}</div>
      <div class="stat-tile-delta up">↑ 18.2% year over year</div>
    </div>
    <div class="card stat-tile">
      <div class="stat-tile-label">Avg. Order Value</div>
      <div class="stat-tile-value">${formatCurrency(avgOrder)}</div>
      <div class="stat-tile-delta up">↑ 4.6% vs last month</div>
    </div>
    <div class="card stat-tile">
      <div class="stat-tile-label">Conversion Rate</div>
      <div class="stat-tile-value">3.8%</div>
      <div class="stat-tile-delta down">↓ 0.3% vs last month</div>
    </div>
  `;

  document.getElementById('analytics-chart-root').innerHTML = novaLineChartSvg(NOVA_REVENUE_SERIES, { height: 260 });
  document.getElementById('analytics-chart-labels').innerHTML = NOVA_REVENUE_MONTHS.map((m) => `<span>${m}</span>`).join('');

  const products = novaAllAdminProducts();
  const categories = novaAllAdminCategories();
  const breakdown = categories.map((c) => ({
    name: c.name,
    count: products.filter((p) => p.category === c.id).length,
  }));
  const maxCount = Math.max(...breakdown.map((b) => b.count), 1);

  document.getElementById('category-breakdown').innerHTML = breakdown.map((b) => `
    <div class="breakdown-row">
      <span class="breakdown-label">${b.name}</span>
      <div class="breakdown-bar-track"><div class="breakdown-bar-fill" style="width:${(b.count / maxCount) * 100}%"></div></div>
      <span class="breakdown-value">${b.count}</span>
    </div>
  `).join('');
});
