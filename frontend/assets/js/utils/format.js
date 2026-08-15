function formatCurrency(amount) {
  const num = Number(amount);
  const formatted = Number.isInteger(num) ? num.toLocaleString('en-US') : num.toFixed(2);
  return '৳' + formatted;
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function qs(param) {
  return new URLSearchParams(window.location.search).get(param);
}
