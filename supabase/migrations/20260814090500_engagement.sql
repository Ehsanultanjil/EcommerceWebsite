create table public.reviews (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating     integer not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz not null default now(),
  constraint reviews_user_product_key unique (user_id, product_id)
);
create index reviews_product_id_idx on public.reviews (product_id);

create table public.wishlist (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint wishlist_user_product_key unique (user_id, product_id)
);
create index wishlist_user_id_idx on public.wishlist (user_id);

create table public.coupons (
  id             uuid primary key default gen_random_uuid(),
  code           text not null,
  discount_type  public.discount_type not null,
  discount_value numeric(10,2) not null check (discount_value >= 0),
  minimum_order  numeric(10,2) not null default 0 check (minimum_order >= 0),
  expires_at     timestamptz,
  is_active      boolean not null default true,
  constraint coupons_code_key unique (code),
  constraint coupons_percentage_bounds check (discount_type <> 'PERCENTAGE' or discount_value <= 100)
);
create index coupons_active_idx on public.coupons (is_active) where is_active = true;
