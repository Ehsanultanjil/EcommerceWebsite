document.addEventListener('DOMContentLoaded', () => {
  renderAdminSidebar('settings');
  document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Settings saved');
  });
});
