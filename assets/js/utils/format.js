function formatCurrency(amount) {
  return '$' + Number(amount).toFixed(2).replace(/\.00$/, '');
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function qs(param) {
  return new URLSearchParams(window.location.search).get(param);
}
