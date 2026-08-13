document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('account');
  renderFooter();
  renderAccountSidebar('profile');

  const session = NovaStore.getSession();
  const content = document.getElementById('account-content');

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

  const initial = session.name.trim().charAt(0).toUpperCase();

  content.innerHTML = `
    <div class="profile-summary">
      <div class="profile-avatar">${initial}</div>
      <div>
        <div class="profile-name">${session.name}</div>
        <div class="text-secondary">${session.email}</div>
      </div>
    </div>
    <h3>Profile Details</h3>
    <form id="profile-form" class="auth-form">
      <div class="form-row">
        <div class="field"><label>Full Name</label><input class="input" name="name" value="${session.name}" required /></div>
        <div class="field"><label>Email</label><input class="input" type="email" name="email" value="${session.email}" required /></div>
      </div>
      <div class="field"><label>Phone</label><input class="input" name="phone" placeholder="+91 98765 43210" /></div>
      <button type="submit" class="btn btn-primary">Save Changes</button>
    </form>
  `;

  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    NovaStore.login(data.get('name'), data.get('email'));
    showToast('Profile updated');
    document.querySelector('.profile-name').textContent = data.get('name');
    document.querySelector('.profile-avatar').textContent = data.get('name').trim().charAt(0).toUpperCase();
  });
});
