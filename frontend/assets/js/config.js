/* Not secret — the Supabase anon key is designed to be public (RLS enforces access),
   same key the Spring Boot backend's JWKS verification trusts. */
const BARAZ_CONFIG = {
  SUPABASE_URL: 'https://womdgicjncendsgbbfnf.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_rg9R-lYPqBMCj4CQKd-huw_CP8oY6LS',
  API_BASE_URL: 'http://localhost:8080/api',
};
