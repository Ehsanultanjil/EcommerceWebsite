create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete restrict,
  order_number      text not null,
  status            public.order_status not null default 'PENDING',
  subtotal          numeric(10,2) not null check (subtotal >= 0),
  discount          numeric(10,2) not null default 0 check (discount >= 0),
  shipping_fee      numeric(10,2) not null default 0 check (shipping_fee >= 0),
  total             numeric(10,2) not null check (total >= 0),
  shipping_name     text not null,
  shipping_phone    text not null,
  shipping_address  text not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint orders_order_number_key unique (order_number),
  constraint orders_total_arithmetic_check check (total = subtotal - discount + shipping_fee)
);
create index orders_user_id_created_idx on public.orders (user_id, created_at desc);
create index orders_status_idx on public.orders (status);

create table public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price   numeric(10,2) not null check (unit_price >= 0),
  quantity     integer not null check (quantity > 0),
  subtotal     numeric(10,2) not null check (subtotal >= 0),
  constraint order_items_subtotal_arithmetic_check check (subtotal = unit_price * quantity)
);
create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_id_idx on public.order_items (product_id);

create table public.payments (
  id                     uuid primary key default gen_random_uuid(),
  order_id               uuid not null references public.orders(id) on delete cascade,
  method                 public.payment_method not null,
  status                 public.payment_status not null default 'PENDING',
  amount                 numeric(10,2) not null check (amount >= 0),
  transaction_reference  text,
  created_at             timestamptz not null default now()
);
create index payments_order_id_idx on public.payments (order_id);
create unique index payments_transaction_reference_key
  on public.payments (transaction_reference) where transaction_reference is not null;
