document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('account');
  renderFooter();
  renderAccountSidebar('settings');
  if (!(await barazRequireCustomer())) return;

  const content = document.getElementById('account-content');
  content.innerHTML = `
    <h3>Notifications</h3>
    <div class="settings-row">
      <label class="checkbox-row"><input type="checkbox" checked /> Order updates via email</label>
    </div>
    <div class="settings-row">
      <label class="checkbox-row"><input type="checkbox" checked /> New arrivals &amp; promotions</label>
    </div>
    <div class="settings-row">
      <label class="checkbox-row"><input type="checkbox" /> SMS notifications</label>
    </div>

    <h3 style="margin-top:32px">Password</h3>
    <form id="password-form" class="auth-form">
      <div class="field"><label>Current Password</label><input class="input" type="password" required /></div>
      <div class="field"><label>New Password</label><input class="input" type="password" required minlength="4" /></div>
      <button type="submit" class="btn btn-primary">Update Password</button>
    </form>

    <h3 style="margin-top:32px">Danger Zone</h3>
    <button class="btn btn-danger" id="delete-account-btn">Delete Account</button>
  `;

  document.getElementById('password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Password updated');
    e.target.reset();
  });

  document.getElementById('delete-account-btn').addEventListener('click', () => {
    openModal(`
      <h3>Delete account?</h3>
      <p class="text-secondary" style="margin:12px 0 20px">This will remove your session and locally saved data. This action can't be undone.</p>
      <button class="btn btn-danger btn-block" id="confirm-delete-btn">Delete Account</button>
    `);
    document.getElementById('confirm-delete-btn').addEventListener('click', () => {
      localStorage.clear();
      closeModal();
      window.location.href = 'index.html';
    });
  });
});
