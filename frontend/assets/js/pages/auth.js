document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('auth');
  renderFooter();

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = loginForm.querySelector('button[type=submit]');
      submitBtn.disabled = true;
      const data = new FormData(loginForm);
      const { error } = await barazSignIn(data.get('email'), data.get('password'));
      submitBtn.disabled = false;
      if (error) {
        showToast(error.message === 'Invalid login credentials' ? 'Incorrect email or password' : error.message);
        return;
      }
      showToast('Signed in');
      await barazRedirectByRole();
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = registerForm.querySelector('button[type=submit]');
      submitBtn.disabled = true;
      const data = new FormData(registerForm);
      const { data: signUpData, error } = await barazSignUp(data.get('email'), data.get('password'), data.get('name'));
      submitBtn.disabled = false;

      if (error) {
        showToast(error.message);
        return;
      }

      if (signUpData.session) {
        showToast('Account created');
        await barazRedirectByRole();
        return;
      }

      // Email confirmation is required on this project — no session yet. Swap the
      // form's own content rather than its parent, so the surrounding card layout
      // (logo, heading) stays intact.
      registerForm.innerHTML = `
        <h3>Check your email</h3>
        <p class="text-secondary">We sent a confirmation link to <strong>${data.get('email')}</strong>. Confirm your address, then sign in.</p>
        <a href="login.html" class="btn btn-primary btn-block">Go to Sign In</a>
      `;
    });
  }
});

