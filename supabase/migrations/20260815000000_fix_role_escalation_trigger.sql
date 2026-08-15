-- Bug: prevent_role_self_escalation() blocked ALL role changes made via a direct
-- Postgres connection (superuser/service-role, no PostgREST JWT context), because
-- auth.uid() is NULL there and is_admin() (which depends on auth.uid()) then always
-- evaluates false — including for the postgres superuser itself. That made it
-- impossible to ever bootstrap the first admin account, which is exactly the
-- documented Phase 1 bootstrap step (see supabase migrations README / completion
-- report: "update public.profiles set role = 'ADMIN' where email = ...").
--
-- Fix: only enforce the admin-only check when the change is happening through an
-- actual authenticated session (auth.uid() IS NOT NULL) — i.e. a logged-in user
-- hitting PostgREST directly and trying to self-escalate. Direct DB access (superuser,
-- service_role, migrations) already bypasses RLS entirely by design, so trusting it
-- here is consistent with that model, not a weakening of it.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.role <> old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'Only admins can change a profile role';
  end if;
  return new;
end;
$$;
