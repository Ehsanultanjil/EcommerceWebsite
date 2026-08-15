create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null,
  image_url  text,
  created_at timestamptz not null default now(),
  constraint categories_slug_key unique (slug)
);

create table public.products (
  id             uuid primary key default gen_random_uuid(),
  category_id    uuid not null references public.categories(id) on delete restrict,
  name           text not null,
  slug           text not null,
  description    text,
  price          numeric(10,2) not null check (price >= 0),
  compare_price  numeric(10,2) check (compare_price is null or compare_price > price),
  stock          integer not null default 0 check (stock >= 0),
  image_url      text,
  is_featured    boolean not null default false,
  is_new         boolean not null default false,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint products_slug_key unique (slug)
);
create index products_category_id_active_idx on public.products (category_id, is_active);
create index products_is_featured_idx on public.products (is_featured) where is_featured = true;

create table public.product_images (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  image_url      text not null,
  display_order  integer not null default 0 check (display_order >= 0)
);
create index product_images_product_id_idx on public.product_images (product_id, display_order);
