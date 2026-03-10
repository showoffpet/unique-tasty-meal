-- Create promo_codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  minimum_order_amount NUMERIC(10,2),
  max_discount_cap NUMERIC(10,2),
  expires_at TIMESTAMPTZ NOT NULL,
  max_usages INTEGER NOT NULL DEFAULT 1,
  usage_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  requires_new_user BOOLEAN DEFAULT false,
  stackable BOOLEAN DEFAULT false,
  usage_per_user_limit INTEGER,
  applicable_meals TEXT[],
  excluded_meals TEXT[],
  applicable_cuisines TEXT[],
  applicable_dietary_tags TEXT[],
  requires_minimum_items INTEGER,
  metadata JSONB,
  created_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Everyone can view active promo codes
CREATE POLICY "Anyone can view active promos"
  ON public.promo_codes
  FOR SELECT
  USING (status = 'active');

-- Admins can view all and manage
CREATE POLICY "Admins can manage promos"
  ON public.promo_codes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'restaurant_owner')
    )
  );

-- Auto-update updated_at
CREATE TRIGGER set_promo_codes_updated_at
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Index
CREATE INDEX idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX idx_promo_codes_status ON public.promo_codes(status);
