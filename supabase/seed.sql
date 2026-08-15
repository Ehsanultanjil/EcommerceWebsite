-- Categories
insert into public.categories (name, slug, image_url) values
  ('Electronics', 'electronics', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&h=860&fit=crop&q=80'),
  ('Lifestyle', 'lifestyle', 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=700&h=860&fit=crop&q=80'),
  ('Fashion', 'fashion', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&h=860&fit=crop&q=80'),
  ('Accessories', 'accessories', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&h=860&fit=crop&q=80')
on conflict (slug) do nothing;

-- Products (ported from assets/js/data/products.js) + product_images
with inserted_products as (
  insert into public.products (category_id, name, slug, description, price, compare_price, stock, image_url, is_featured, is_new, is_active)
  values
    ((select id from public.categories where slug = 'electronics'), 'Wireless Headphones', 'wireless-headphones',
      'Premium wireless headphones with active noise cancellation and 30-hour battery life. Engineered for clarity, tuned for comfort.',
      14900.00, null, 49, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&h=1100&fit=crop&q=80', true, true, true),

    ((select id from public.categories where slug = 'accessories'), 'Everyday Backpack', 'everyday-backpack',
      'A minimal, weatherproof backpack built for daily commuting. Padded laptop sleeve fits up to 16".',
      8900.00, 10900.00, 16, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&h=1100&fit=crop&q=80', false, false, true),

    ((select id from public.categories where slug = 'fashion'), 'Classic Sneakers', 'classic-sneakers',
      'Clean-lined leather sneakers with a cushioned sole, built for everyday wear that goes the distance.',
      19900.00, null, 53, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1000&h=1100&fit=crop&q=80', true, true, true),

    ((select id from public.categories where slug = 'accessories'), 'Minimal Wallet', 'minimal-wallet',
      'Slim full-grain leather wallet with room for six cards and a hidden cash pocket.',
      7900.00, null, 20, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=1000&h=1100&fit=crop&q=80', false, false, true),

    ((select id from public.categories where slug = 'electronics'), 'Smart Watch', 'smart-watch',
      'Track your day with precision. Heart rate, sleep, and activity monitoring in a display built for daylight.',
      24900.00, 28900.00, 57, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&h=1100&fit=crop&q=80', false, false, true),

    ((select id from public.categories where slug = 'fashion'), 'Wool Overcoat', 'wool-overcoat',
      'A tailored wool-blend overcoat designed to layer cleanly over everything in your wardrobe.',
      28900.00, null, 24, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1000&h=1100&fit=crop&q=80', false, true, true),

    ((select id from public.categories where slug = 'lifestyle'), 'Ceramic Pour-Over Set', 'ceramic-pour-over-set',
      'A hand-finished ceramic pour-over set for a slower, better morning routine.',
      5900.00, null, 61, 'https://images.unsplash.com/photo-1638202518327-956c496a5240?w=1000&h=1100&fit=crop&q=80', true, false, true),

    ((select id from public.categories where slug = 'lifestyle'), 'Desk Lamp', 'desk-lamp',
      'Adjustable LED desk lamp with three warmth settings and a weighted base.',
      11900.00, null, 28, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1000&h=1100&fit=crop&q=80', false, false, true),

    ((select id from public.categories where slug = 'electronics'), 'Wireless Earbuds', 'wireless-earbuds',
      'Compact true-wireless earbuds with adaptive EQ and a pocketable charging case.',
      12900.00, null, 65, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&h=1100&fit=crop&q=80', false, true, true),

    ((select id from public.categories where slug = 'fashion'), 'Linen Shirt', 'linen-shirt',
      'A breathable linen shirt cut for warm days and easy layering.',
      7900.00, 9900.00, 32, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&h=1100&fit=crop&q=80', false, false, true),

    ((select id from public.categories where slug = 'accessories'), 'Leather Sunglasses Case', 'leather-sunglasses-case',
      'Protective full-grain leather case with a soft microfiber lining.',
      3900.00, null, 69, 'https://images.unsplash.com/photo-1632986636968-04958bfbbf3f?w=1000&h=1100&fit=crop&q=80', false, false, true),

    ((select id from public.categories where slug = 'lifestyle'), 'Aroma Candle', 'aroma-candle',
      'Soy wax candle with a warm, woody scent. 45-hour burn time.',
      3400.00, null, 36, 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=1000&h=1100&fit=crop&q=80', false, false, true),

    ((select id from public.categories where slug = 'electronics'), 'Portable Speaker', 'portable-speaker',
      'Room-filling sound in a pocket-sized, weatherproof shell.',
      9900.00, null, 73, 'https://images.unsplash.com/photo-1582978571763-2d039e56f0c3?w=1000&h=1100&fit=crop&q=80', false, false, true),

    ((select id from public.categories where slug = 'fashion'), 'Merino Sweater', 'merino-sweater',
      'Fine-gauge merino wool sweater, soft against skin and light enough to layer.',
      13900.00, null, 40, 'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?w=1000&h=1100&fit=crop&q=80', false, true, true),

    ((select id from public.categories where slug = 'accessories'), 'Travel Duffel', 'travel-duffel',
      'A structured weekend duffel with a dedicated shoe compartment and trolley strap.',
      15900.00, 18900.00, 77, 'https://images.unsplash.com/photo-1525103504173-8dc1582c7430?w=1000&h=1100&fit=crop&q=80', false, false, true),

    ((select id from public.categories where slug = 'lifestyle'), 'Ceramic Mug Set', 'ceramic-mug-set',
      'Set of two hand-glazed stoneware mugs, dishwasher and microwave safe.',
      4400.00, null, 44, 'https://images.unsplash.com/photo-1572003414077-38770ebec0a4?w=1000&h=1100&fit=crop&q=80', false, false, true),

    ((select id from public.categories where slug = 'electronics'), 'Mechanical Keyboard', 'mechanical-keyboard',
      'Low-profile mechanical keyboard with hot-swappable switches and a machined aluminum frame.',
      17900.00, null, 81, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=1000&h=1100&fit=crop&q=80', true, true, true),

    ((select id from public.categories where slug = 'accessories'), 'Cotton Cap', 'cotton-cap',
      'A structured six-panel cap in brushed cotton twill.',
      3500.00, null, 48, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=1000&h=1100&fit=crop&q=80', false, false, true),

    ((select id from public.categories where slug = 'fashion'), 'Tailored Trousers', 'tailored-trousers',
      'Tailored trousers with a tapered leg, built from a durable stretch weave.',
      11900.00, null, 15, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1000&h=1100&fit=crop&q=80', false, false, true),

    ((select id from public.categories where slug = 'lifestyle'), 'Table Planter', 'table-planter',
      'A concrete tabletop planter with an integrated drainage tray.',
      4900.00, null, 52, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1000&h=1100&fit=crop&q=80', false, true, true)
  on conflict (slug) do nothing
  returning id, image_url
)
insert into public.product_images (product_id, image_url, display_order)
select id, image_url, 0 from inserted_products;

-- Coupons (mirrors admin dummy data: BARAZ15, WELCOME10, FREESHIP, SUMMER20)
insert into public.coupons (code, discount_type, discount_value, minimum_order, expires_at, is_active) values
  ('BARAZ15', 'PERCENTAGE', 15, 2000.00, '2026-12-31', true),
  ('WELCOME10', 'PERCENTAGE', 10, 0, '2026-10-01', true),
  ('FREESHIP', 'FIXED', 100.00, 0, '2026-09-15', true),
  ('SUMMER20', 'PERCENTAGE', 20, 0, '2026-07-31', false)
on conflict (code) do nothing;
