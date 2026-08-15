create table public.cart (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cart_user_id_key unique (user_id)
);

create table public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  cart_id    uuid not null references public.cart(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity   integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  constraint cart_items_cart_product_key unique (cart_id, product_id)
);
create index cart_items_cart_id_idx on public.cart_items (cart_id);
create index cart_items_product_id_idx on public.cart_items (product_id);
