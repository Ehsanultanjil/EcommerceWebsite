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
      const email = data.get('email');
      const password = data.get('password');
      const fullName = data.get('name');

      const { data: signUpData, error } = await barazSignUp(email, password, fullName);

      if (error) {
        submitBtn.disabled = false;
        showToast(error.message);
        return;
      }

      // If already has session or can sign in immediately
      if (signUpData.session) {
        submitBtn.disabled = false;
        showToast('Account created');
        await barazRedirectByRole();
        return;
      }

      // Attempt immediate sign in
      const { error: signInError } = await barazSignIn(email, password);
      submitBtn.disabled = false;

      if (!signInError) {
        showToast('Account created and signed in');
        await barazRedirectByRole();
      } else {
        // Only if Supabase server strictly enforces email confirmation
        showToast('Account created! Please disable "Confirm email" in Supabase settings for instant login.');
        window.location.href = 'login.html';
      }
    });
  }
});

