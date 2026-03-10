-- Seed data for UTM application
-- Run after migrations to populate tables with initial data

-- ============================================
-- Meal Categories
-- ============================================
INSERT INTO public.meal_categories (id, name, display_order, is_active) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Rice Dishes', 1, true),
  ('00000000-0000-0000-0000-000000000002', 'Pasta', 2, true),
  ('00000000-0000-0000-0000-000000000003', 'Beans', 3, true),
  ('00000000-0000-0000-0000-000000000004', 'Soups', 4, true),
  ('00000000-0000-0000-0000-000000000005', 'Stews', 5, true),
  ('00000000-0000-0000-0000-000000000006', 'Proteins', 6, true),
  ('00000000-0000-0000-0000-000000000007', 'Pastries', 7, true),
  ('00000000-0000-0000-0000-000000000008', 'Sauces', 8, true),
  ('00000000-0000-0000-0000-000000000009', 'Others', 9, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Meals (20 items matching MOCK_MEALS structure)
-- ============================================
INSERT INTO public.meals (id, name, description, base_price, image_url, category_id, is_available, preparation_time, spice_level, dietary_tags, add_ons, allergens, average_rating, ingredients, nutritional_info, display_order) VALUES
  ('10000000-0000-0000-0000-000000000000', 'Classic Jollof Rice Bowl', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 12.99, 'https://picsum.photos/seed/100/800/600', '00000000-0000-0000-0000-000000000001', true, 15, 0, ARRAY['vegetarian', 'gluten-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.0, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 0),
  ('10000000-0000-0000-0000-000000000001', 'Spicy Beef Suya Bowl', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 17.99, 'https://picsum.photos/seed/101/800/600', '00000000-0000-0000-0000-000000000002', true, 20, 1, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.1, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 1),
  ('10000000-0000-0000-0000-000000000002', 'Vegan Plantain Power Bowl', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 22.99, 'https://picsum.photos/seed/102/800/600', '00000000-0000-0000-0000-000000000003', true, 25, 2, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.2, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 2),
  ('10000000-0000-0000-0000-000000000003', 'Build Your Own Bowl', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 12.99, 'https://picsum.photos/seed/103/800/600', '00000000-0000-0000-0000-000000000004', true, 15, 3, ARRAY['vegetarian', 'gluten-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', ARRAY['peanuts', 'dairy'], 4.3, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 3),
  ('10000000-0000-0000-0000-000000000004', 'Egusi Soup Special', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 17.99, 'https://picsum.photos/seed/104/800/600', '00000000-0000-0000-0000-000000000001', true, 20, 0, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.4, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 4),
  ('10000000-0000-0000-0000-000000000005', 'Pounded Yam Delight', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 22.99, 'https://picsum.photos/seed/105/800/600', '00000000-0000-0000-0000-000000000002', true, 25, 1, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.5, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 5),
  ('10000000-0000-0000-0000-000000000006', 'Pepper Soup Bowl', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 12.99, 'https://picsum.photos/seed/106/800/600', '00000000-0000-0000-0000-000000000003', true, 15, 2, ARRAY['vegetarian', 'gluten-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.6, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 6),
  ('10000000-0000-0000-0000-000000000007', 'Grilled Chicken Platter', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 17.99, 'https://picsum.photos/seed/107/800/600', '00000000-0000-0000-0000-000000000004', false, 20, 3, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.7, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 7),
  ('10000000-0000-0000-0000-000000000008', 'Fried Rice Supreme', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 22.99, 'https://picsum.photos/seed/108/800/600', '00000000-0000-0000-0000-000000000001', true, 25, 0, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', ARRAY['peanuts', 'dairy'], 4.8, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 8),
  ('10000000-0000-0000-0000-000000000009', 'Moi Moi Platter', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 12.99, 'https://picsum.photos/seed/109/800/600', '00000000-0000-0000-0000-000000000002', true, 15, 1, ARRAY['vegetarian', 'gluten-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.9, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 9),
  ('10000000-0000-0000-0000-000000000010', 'Suya Spice Wrap', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 17.99, 'https://picsum.photos/seed/110/800/600', '00000000-0000-0000-0000-000000000003', true, 20, 2, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.0, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 10),
  ('10000000-0000-0000-0000-000000000011', 'Asun Goat Meat', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 22.99, 'https://picsum.photos/seed/111/800/600', '00000000-0000-0000-0000-000000000004', true, 25, 3, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.1, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 11),
  ('10000000-0000-0000-0000-000000000012', 'Coconut Rice Bowl', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 12.99, 'https://picsum.photos/seed/112/800/600', '00000000-0000-0000-0000-000000000001', true, 15, 0, ARRAY['vegetarian', 'gluten-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', ARRAY['peanuts', 'dairy'], 4.2, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 12),
  ('10000000-0000-0000-0000-000000000013', 'Gizdodo Special', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 17.99, 'https://picsum.photos/seed/113/800/600', '00000000-0000-0000-0000-000000000002', true, 20, 1, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.3, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 13),
  ('10000000-0000-0000-0000-000000000014', 'Ofada Rice Bowl', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 22.99, 'https://picsum.photos/seed/114/800/600', '00000000-0000-0000-0000-000000000003', false, 25, 2, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.4, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 14),
  ('10000000-0000-0000-0000-000000000015', 'Yam Porridge Deluxe', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 12.99, 'https://picsum.photos/seed/115/800/600', '00000000-0000-0000-0000-000000000004', true, 15, 3, ARRAY['vegetarian', 'gluten-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.5, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 15),
  ('10000000-0000-0000-0000-000000000016', 'Akara & Pap Combo', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 17.99, 'https://picsum.photos/seed/116/800/600', '00000000-0000-0000-0000-000000000001', true, 20, 0, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', ARRAY['peanuts', 'dairy'], 4.6, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 16),
  ('10000000-0000-0000-0000-000000000017', 'Efo Riro Bowl', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 22.99, 'https://picsum.photos/seed/117/800/600', '00000000-0000-0000-0000-000000000002', true, 25, 1, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.7, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 17),
  ('10000000-0000-0000-0000-000000000018', 'Nkwobi Platter', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 12.99, 'https://picsum.photos/seed/118/800/600', '00000000-0000-0000-0000-000000000003', true, 15, 2, ARRAY['vegetarian', 'gluten-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.8, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 18),
  ('10000000-0000-0000-0000-000000000019', 'Isi Ewu Special', 'A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.', 17.99, 'https://picsum.photos/seed/119/800/600', '00000000-0000-0000-0000-000000000004', true, 20, 3, ARRAY['dairy-free'], '{"Extra Protein": 4.5, "Extra Sauce": 1.0, "Side Salad": 3.0, "Plantain": 2.5}', NULL, 4.9, ARRAY['Rice', 'Tomatoes', 'Onions', 'Spices'], '{"calories": 450, "protein": 25, "carbs": 45}', 19)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Promo Codes
-- ============================================
INSERT INTO public.promo_codes (id, code, description, discount_type, discount_value, minimum_order_amount, max_discount_cap, expires_at, max_usages, usage_count, status, requires_new_user, stackable, usage_per_user_limit, created_by) VALUES
  ('20000000-0000-0000-0000-000000000001', 'WELCOME10', 'Get 10% off your first order!', 'percentage', 10, 20, 15, now() + interval '30 days', 1, 0, 'active', true, false, 1, 'system'),
  ('20000000-0000-0000-0000-000000000002', 'FREESHIP', 'Free shipping on orders over $50', 'fixed', 0, 50, NULL, now() + interval '7 days', 1000, 124, 'active', false, false, 1, 'system')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Sample Orders (for admin dashboard)
-- Note: These reference a placeholder user_id. In production,
-- replace with actual user IDs from auth.users.
-- We use a DO block to only insert if a user exists.
-- ============================================
DO $$
DECLARE
  sample_user_id UUID;
BEGIN
  -- Try to get an existing user, or skip if none exist
  SELECT id INTO sample_user_id FROM public.users LIMIT 1;

  IF sample_user_id IS NOT NULL THEN
    INSERT INTO public.orders (id, user_id, items, subtotal, tax_amount, delivery_fee, total, order_status, payment_method, payment_status, created_at) VALUES
      ('30000000-0000-0000-0000-000000000001', sample_user_id,
       '[{"id": 1, "name": "Classic Jollof Rice Bowl", "quantity": 2, "price": 18.50, "customizations": [{"category": "Base", "choice": "Jollof Quinoa"}, {"category": "Protein", "choice": "Grilled Chicken"}]}, {"id": 2, "name": "Spicy Beef Suya Bowl", "quantity": 1, "price": 21.00, "customizations": [{"category": "Base", "choice": "Coconut Rice"}, {"category": "Protein", "choice": "Beef Suya"}]}]',
       58.00, 4.64, 0, 62.64, 'new', 'card', 'paid', now() - interval '1 hour'),
      ('30000000-0000-0000-0000-000000000002', sample_user_id,
       '[{"id": 1, "name": "Pepper Soup Bowl", "quantity": 1, "price": 18.00}]',
       18.00, 1.44, 0, 19.44, 'new', 'card', 'paid', now() - interval '2 hours'),
      ('30000000-0000-0000-0000-000000000003', sample_user_id,
       '[{"id": 1, "name": "Egusi Soup Special", "quantity": 3, "price": 17.99}, {"id": 2, "name": "Pounded Yam Delight", "quantity": 2, "price": 22.99}]',
       99.95, 7.99, 0, 107.94, 'confirmed', 'card', 'paid', now() - interval '4 hours'),
      ('30000000-0000-0000-0000-000000000004', sample_user_id,
       '[{"id": 1, "name": "Fried Rice Supreme", "quantity": 2, "price": 17.00}]',
       34.00, 2.72, 0, 36.72, 'prepping', 'card', 'paid', now() - interval '6 hours'),
      ('30000000-0000-0000-0000-000000000005', sample_user_id,
       '[{"id": 1, "name": "Coconut Rice Bowl", "quantity": 2, "price": 12.99}, {"id": 2, "name": "Suya Spice Wrap", "quantity": 2, "price": 17.99}]',
       61.96, 4.96, 0, 66.92, 'ready', 'card', 'paid', now() - interval '8 hours')
    ON CONFLICT (id) DO NOTHING;

    -- Order status history
    INSERT INTO public.order_status_history (order_id, status, changed_by, created_at) VALUES
      ('30000000-0000-0000-0000-000000000001', 'new', NULL, now() - interval '1 hour'),
      ('30000000-0000-0000-0000-000000000002', 'new', NULL, now() - interval '2 hours'),
      ('30000000-0000-0000-0000-000000000003', 'new', NULL, now() - interval '4 hours'),
      ('30000000-0000-0000-0000-000000000003', 'confirmed', NULL, now() - interval '3 hours'),
      ('30000000-0000-0000-0000-000000000004', 'new', NULL, now() - interval '6 hours'),
      ('30000000-0000-0000-0000-000000000004', 'confirmed', NULL, now() - interval '5 hours 30 minutes'),
      ('30000000-0000-0000-0000-000000000004', 'prepping', NULL, now() - interval '5 hours'),
      ('30000000-0000-0000-0000-000000000005', 'new', NULL, now() - interval '8 hours'),
      ('30000000-0000-0000-0000-000000000005', 'confirmed', NULL, now() - interval '7 hours'),
      ('30000000-0000-0000-0000-000000000005', 'prepping', NULL, now() - interval '6 hours 30 minutes'),
      ('30000000-0000-0000-0000-000000000005', 'ready', NULL, now() - interval '6 hours');
  END IF;
END $$;
