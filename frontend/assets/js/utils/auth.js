/* Thin wrapper around Supabase Auth (loaded via CDN as the global `supabase`).
   Session persistence/refresh is handled entirely by the Supabase SDK itself
   (its own localStorage keys) — that's an SDK implementation detail, not app data. */
const supabaseClient = supabase.createClient(BARAZ_CONFIG.SUPABASE_URL, BARAZ_CONFIG.SUPABASE_ANON_KEY);

async function barazGetSession() {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
}

async function barazGetAccessToken() {
  const session = await barazGetSession();
  return session ? session.access_token : null;
}

async function barazSignUp(email, password, fullName) {
  return supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
}

async function barazSignIn(email, password) {
  return supabaseClient.auth.signInWithPassword({ email, password });
}

async function barazSignOut() {
  await supabaseClient.auth.signOut();
}

/** Redirects to login if not authenticated. Call at the top of any protected page. */
async function barazRequireAuth() {
  const session = await barazGetSession();
  if (!session) {
    // Relative to the CALLING page — admin/*.html pages are one level down, so a
    // bare 'login.html' from there would resolve to the nonexistent admin/login.html.
    const inAdmin = window.location.pathname.includes('/admin/');
    window.location.href = inAdmin ? '../login.html' : 'login.html';
    return null;
  }
  return session;
}

/** Redirects non-admins away. Call at the top of every admin/*.html page. */
async function barazRequireAdmin() {
  const session = await barazRequireAuth();
  if (!session) return null;
  try {
    const me = await apiGet('/auth/me');
    if (me.role !== 'ADMIN') {
      window.location.href = '../account.html';
      return null;
    }
    return me;
  } catch (e) {
    window.location.href = '../login.html';
    return null;
  }
}

/** Redirects admins to the admin dashboard. Call at the top of customer account pages. */
async function barazRequireCustomer() {
  const session = await barazGetSession();
  if (!session) return null;
  try {
    const me = await apiGet('/auth/me');
    if (me.role === 'ADMIN') {
      window.location.href = 'admin/dashboard.html';
      return null;
    }
    return me;
  } catch (e) {
    return null;
  }
}

/** After login/register, redirect based on role: admin → admin dashboard, customer → account. */
async function barazRedirectByRole() {
  try {
    const me = await apiGet('/auth/me');
    if (me.role === 'ADMIN') {
      window.location.href = 'admin/dashboard.html';
    } else {
      window.location.href = 'account.html';
    }
  } catch (e) {
    window.location.href = 'account.html';
  }
}

