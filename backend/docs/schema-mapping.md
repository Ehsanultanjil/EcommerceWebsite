# Supabase schema → JPA entity mapping (Phase 2 scope)

Source of truth: `/supabase/migrations/*.sql` (already applied + verified against the live
Supabase project in Phase 1). Only the tables needed for product browsing are mapped in this
phase; the rest of the schema exists but has no entity yet.

## categories → Category

| Column     | Type        | Nullable | Notes |
|---|---|---|---|
| id         | uuid PK     | no       | `gen_random_uuid()` default |
| name       | text        | no       | |
| slug       | text UNIQUE | no       | |
| image_url  | text        | yes      | |
| created_at | timestamptz | no       | default `now()` |

## products → Product

| Column        | Type            | Nullable | Notes |
|---|---|---|---|
| id            | uuid PK         | no       | |
| category_id   | uuid FK→categories(id) | no | `ON DELETE RESTRICT` |
| name          | text            | no       | |
| slug          | text UNIQUE     | no       | |
| description   | text            | yes      | |
| price         | numeric(10,2)   | no       | maps to `BigDecimal` |
| compare_price | numeric(10,2)   | yes      | maps to `BigDecimal` |
| stock         | integer         | no       | default 0 |
| image_url     | text            | yes      | |
| is_featured   | boolean         | no       | default false |
| is_new        | boolean         | no       | default false |
| is_active     | boolean         | no       | default true |
| created_at    | timestamptz     | no       | |
| updated_at    | timestamptz     | no       | |

## product_images → ProductImage

| Column        | Type    | Nullable | Notes |
|---|---|---|---|
| id            | uuid PK | no       | |
| product_id    | uuid FK→products(id) | no | `ON DELETE CASCADE` |
| image_url     | text    | no       | |
| display_order | integer | no       | default 0 |

## Relationships

```
Category (1) ──< (N) Product (1) ──< (N) ProductImage
```

## Not mapped yet (exist in DB, out of scope for Phase 2)

`profiles`, `cart`, `cart_items`, `orders`, `order_items`, `payments`, `reviews`, `wishlist`,
`coupons` — plus the Postgres enums `user_role`, `order_status`, `payment_method`,
`payment_status`, `discount_type`, none of which are referenced by categories/products/
product_images. These come in later phases (auth, cart, checkout, admin).
