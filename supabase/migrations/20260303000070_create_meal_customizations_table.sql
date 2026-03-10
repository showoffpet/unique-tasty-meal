-- Create meal_customizations table
CREATE TABLE IF NOT EXISTS public.meal_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  portion_size TEXT NOT NULL DEFAULT 'regular',
  spice_level INTEGER NOT NULL DEFAULT 0,
  add_ons JSONB,
  extra_ingredients TEXT[],
  removed_ingredients TEXT[],
  special_instructions TEXT,
  is_favorite BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meal_customizations ENABLE ROW LEVEL SECURITY;

-- Users can manage their own customizations
CREATE POLICY "Users can view own customizations"
  ON public.meal_customizations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customizations"
  ON public.meal_customizations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customizations"
  ON public.meal_customizations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own customizations"
  ON public.meal_customizations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER set_meal_customizations_updated_at
  BEFORE UPDATE ON public.meal_customizations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Indexes
CREATE INDEX idx_meal_customizations_user_id ON public.meal_customizations(user_id);
CREATE INDEX idx_meal_customizations_meal_id ON public.meal_customizations(meal_id);
