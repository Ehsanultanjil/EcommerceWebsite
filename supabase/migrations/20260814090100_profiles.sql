create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  email      text not null,
  phone      text,
  role       public.user_role not null default 'CUSTOMER',
  avatar_url text,
  created_at timestamptz not null default now()
);

create unique index profiles_email_lower_key on public.profiles (lower(email));
create index profiles_role_idx on public.profiles (role);
