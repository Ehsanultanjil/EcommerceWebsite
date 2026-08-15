/* Not secret — the Supabase anon key is designed to be public (RLS enforces access),
   same key the Spring Boot backend's JWKS verification trusts. */
const BARAZ_IS_LOCAL = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const BARAZ_CONFIG = {
  SUPABASE_URL: 'https://womdgicjncendsgbbfnf.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_rg9R-lYPqBMCj4CQKd-huw_CP8oY6LS',
  // Local dev talks to the local Spring Boot instance (no Render cold-start wait);
  // anything else (Vercel, etc.) hits the live backend.
  API_BASE_URL: BARAZ_IS_LOCAL ? 'http://localhost:8080/api' : 'https://baraz-backend.onrender.com/api',
};
