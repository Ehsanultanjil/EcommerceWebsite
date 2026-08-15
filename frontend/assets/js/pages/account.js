document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('account');
  renderFooter();
  renderAccountSidebar('profile');

  const content = document.getElementById('account-content');
  const session = await barazGetSession();

  if (!session) {
    content.innerHTML = `
      <div class="empty-state">
        <h3>Sign in to view your profile</h3>
        <p>Create an account or sign in to manage your details.</p>
        <a href="login.html" class="btn btn-primary">Sign In</a>
      </div>
    `;
    return;
  }

  let me;
  try {
    me = await apiGet('/auth/me');
  } catch (e) {
    if (e instanceof ApiError && e.status !== 401) {
      content.innerHTML = `<p class="text-secondary">Couldn't load your profile — try refreshing.</p>`;
    }
    return;
  }

  const initial = (me.fullName || me.email).trim().charAt(0).toUpperCase();

  content.innerHTML = `
    <div class="profile-summary">
      <div class="profile-avatar">${initial}</div>
      <div>
        <div class="profile-name">${me.fullName || me.email}</div>
        <div class="text-secondary">${me.email}</div>
      </div>
    </div>
    <h3>Profile Details</h3>
    <div class="auth-form">
      <div class="form-row">
        <div class="field"><label>Full Name</label><input class="input" value="${me.fullName || ''}" disabled /></div>
        <div class="field"><label>Email</label><input class="input" value="${me.email}" disabled /></div>
      </div>
      <div class="field"><label>Phone</label><input class="input" value="${me.phone || ''}" placeholder="Not set" disabled /></div>
      <div class="field"><label>Account Type</label><input class="input" value="${me.role === 'ADMIN' ? 'Administrator' : 'Customer'}" disabled /></div>
      <p class="text-secondary" style="margin-top:8px">Profile editing isn't available yet.</p>
    </div>
  `;
});
