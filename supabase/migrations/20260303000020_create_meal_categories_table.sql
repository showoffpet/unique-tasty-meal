-- Create meal_categories table
CREATE TABLE IF NOT EXISTS public.meal_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meal_categories ENABLE ROW LEVEL SECURITY;

-- Everyone can read categories
CREATE POLICY "Anyone can view active categories"
  ON public.meal_categories
  FOR SELECT
  USING (is_active = true);

-- Only admins can modify categories
CREATE POLICY "Admins can manage categories"
  ON public.meal_categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'restaurant_owner')
    )
  );

-- Auto-update updated_at
CREATE TRIGGER set_meal_categories_updated_at
  BEFORE UPDATE ON public.meal_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Index for ordering
CREATE INDEX idx_meal_categories_display_order ON public.meal_categories(display_order);
