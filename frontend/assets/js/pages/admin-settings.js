document.addEventListener('DOMContentLoaded', async () => {
  if (!(await barazRequireAdmin())) return;
  renderAdminSidebar('settings');
  document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Settings saved');
  });
});
