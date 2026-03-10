-- Create meals table
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category_id UUID NOT NULL REFERENCES public.meal_categories(id) ON DELETE RESTRICT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  preparation_time INTEGER NOT NULL DEFAULT 15,
  spice_level INTEGER DEFAULT 0,
  dietary_tags TEXT[],
  add_ons JSONB,
  allergens TEXT[],
  average_rating NUMERIC(3,2) DEFAULT 0,
  ingredients TEXT[],
  nutritional_info JSONB,
  portion_options JSONB,
  total_reviews INTEGER DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Everyone can read available meals
CREATE POLICY "Anyone can view available meals"
  ON public.meals
  FOR SELECT
  USING (true);

-- Only admins can modify meals
CREATE POLICY "Admins can manage meals"
  ON public.meals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'restaurant_owner')
    )
  );

-- Auto-update updated_at
CREATE TRIGGER set_meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Indexes
CREATE INDEX idx_meals_category_id ON public.meals(category_id);
CREATE INDEX idx_meals_display_order ON public.meals(display_order);
CREATE INDEX idx_meals_is_available ON public.meals(is_available);
