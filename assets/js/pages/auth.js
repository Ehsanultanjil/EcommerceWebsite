document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('auth');
  renderFooter();

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const email = data.get('email');
      const name = email.split('@')[0].replace(/[._]/g, ' ');
      NovaStore.login(capitalize(name), email);
      showToast('Signed in');
      window.location.href = 'account.html';
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      NovaStore.login(data.get('name'), data.get('email'));
      showToast('Account created');
      window.location.href = 'account.html';
    });
  }
});
