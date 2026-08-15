-- profiles
alter table public.profiles enable row level security;
create policy "profiles_select_own_or_admin" on public.profiles for select
  using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_update_admin" on public.profiles for update
  using (public.is_admin()) with check (public.is_admin());

-- categories (public read, admin write)
alter table public.categories enable row level security;
create policy "categories_select_public" on public.categories for select using (true);
create policy "categories_admin_write" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- products (public read of active rows; admin sees + writes everything)
alter table public.products enable row level security;
create policy "products_select_public" on public.products for select
  using (is_active = true or public.is_admin());
create policy "products_admin_write" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- product_images (public read, admin write)
alter table public.product_images enable row level security;
create policy "product_images_select_public" on public.product_images for select using (true);
create policy "product_images_admin_write" on public.product_images for all
  using (public.is_admin()) with check (public.is_admin());

-- cart (strictly own-row; no admin override)
alter table public.cart enable row level security;
create policy "cart_select_own" on public.cart for select using (auth.uid() = user_id);
create policy "cart_insert_own" on public.cart for insert with check (auth.uid() = user_id);
create policy "cart_update_own" on public.cart for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cart_delete_own" on public.cart for delete using (auth.uid() = user_id);

-- cart_items (ownership via parent cart, no direct user_id column)
alter table public.cart_items enable row level security;
create policy "cart_items_select_own" on public.cart_items for select
  using (exists (select 1 from public.cart c where c.id = cart_id and c.user_id = auth.uid()));
create policy "cart_items_insert_own" on public.cart_items for insert
  with check (exists (select 1 from public.cart c where c.id = cart_id and c.user_id = auth.uid()));
create policy "cart_items_update_own" on public.cart_items for update
  using (exists (select 1 from public.cart c where c.id = cart_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.cart c where c.id = cart_id and c.user_id = auth.uid()));
create policy "cart_items_delete_own" on public.cart_items for delete
  using (exists (select 1 from public.cart c where c.id = cart_id and c.user_id = auth.uid()));

-- orders: customers get SELECT ONLY (checkout/mutation goes through Spring Boot's service role); admin gets full access
alter table public.orders enable row level security;
create policy "orders_select_own_or_admin" on public.orders for select
  using (auth.uid() = user_id or public.is_admin());
create policy "orders_admin_write" on public.orders for all
  using (public.is_admin()) with check (public.is_admin());

-- order_items: same read-only-for-customer / full-for-admin shape
alter table public.order_items enable row level security;
create policy "order_items_select_own_or_admin" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
         or public.is_admin());
create policy "order_items_admin_write" on public.order_items for all
  using (public.is_admin()) with check (public.is_admin());

-- payments: customers can view their own order's payment status; admin full access
alter table public.payments enable row level security;
create policy "payments_select_own_or_admin" on public.payments for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
         or public.is_admin());
create policy "payments_admin_write" on public.payments for all
  using (public.is_admin()) with check (public.is_admin());

-- reviews (public read, own write)
alter table public.reviews enable row level security;
create policy "reviews_select_public" on public.reviews for select using (true);
create policy "reviews_insert_own" on public.reviews for insert with check (auth.uid() = user_id);
create policy "reviews_update_own" on public.reviews for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews_delete_own" on public.reviews for delete using (auth.uid() = user_id);

-- wishlist (own row only, no public read)
alter table public.wishlist enable row level security;
create policy "wishlist_select_own" on public.wishlist for select using (auth.uid() = user_id);
create policy "wishlist_insert_own" on public.wishlist for insert with check (auth.uid() = user_id);
create policy "wishlist_delete_own" on public.wishlist for delete using (auth.uid() = user_id);

-- coupons: admin-only for everything, including SELECT
alter table public.coupons enable row level security;
create policy "coupons_admin_all" on public.coupons for all
  using (public.is_admin()) with check (public.is_admin());
