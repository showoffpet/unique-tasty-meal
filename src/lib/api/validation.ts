import { z } from "zod";

// ─── Common Validators ────────────────────────────────────────────
export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email().max(255);
export const passwordSchema = z.string().min(8).max(128);
export const nameSchema = z.string().min(1).max(100).trim();
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/)
  .optional();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ─── Auth Schemas ─────────────────────────────────────────────────
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: passwordSchema,
});

export const validateResetTokenSchema = z.object({
  token: z.string().min(1),
});

// ─── Profile Schemas ──────────────────────────────────────────────
export const profileUpdateSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema,
  avatarUrl: z.string().url().optional().nullable(),
  dietaryPreferences: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  cuisinePreferences: z.array(z.string()).optional(),
  defaultSpiceLevel: z.number().int().min(1).max(5).optional(),
  notificationSettings: z.record(z.string(), z.unknown()).optional(),
  timezone: z.string().optional(),
});

// ─── Menu Schemas ─────────────────────────────────────────────────
export const mealFiltersSchema = z
  .object({
    categoryId: uuidSchema.optional(),
    search: z.string().max(200).optional(),
    dietaryTags: z.array(z.string()).optional(),
    allergens: z.array(z.string()).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    spiceLevel: z.coerce.number().int().min(1).max(5).optional(),
    isAvailable: z.coerce.boolean().optional(),
    sortBy: z.enum(["name", "price", "rating", "newest"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
  })
  .merge(paginationSchema);

export const createMealSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  categoryId: uuidSchema,
  basePrice: z.number().positive(),
  preparationTime: z.number().int().positive(),
  spiceLevel: z.number().int().min(0).max(5).optional(),
  dietaryTags: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  portionOptions: z
    .array(z.object({ name: z.string(), priceModifier: z.number() }))
    .optional(),
  addOns: z
    .array(z.object({ name: z.string(), price: z.number().min(0) }))
    .optional(),
  nutritionalInfo: z.record(z.string(), z.unknown()).optional(),
  imageUrl: z.string().url().optional(),
  isAvailable: z.boolean().default(true),
});

export const updateMealSchema = createMealSchema.partial();

// ─── Cart Schemas ─────────────────────────────────────────────────
export const addToCartSchema = z.object({
  mealId: uuidSchema,
  quantity: z.number().int().min(1).max(99),
  portionSize: z.enum(["small", "regular", "large"]).default("regular"),
  spiceLevel: z.number().int().min(1).max(5).default(3),
  addOns: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number().default(1),
      }),
    )
    .optional(),
  specialInstructions: z.string().max(500).optional(),
  customizationId: uuidSchema.optional(),
});

export const updateCartQuantitySchema = z.object({
  cartItemId: uuidSchema,
  quantity: z.number().int().min(1).max(99),
});

// ─── Address Schemas ──────────────────────────────────────────────
export const createAddressSchema = z.object({
  label: z.enum(["home", "work", "other"]).default("home"),
  streetAddress: z.string().min(1).max(500),
  apartment: z.string().max(100).optional(),
  city: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  deliveryInstructions: z.string().max(500).optional(),
  isDefault: z.boolean().default(false),
  formattedAddress: z.string().min(1).max(500),
  googlePlacesId: z.string().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

// ─── Promo Schemas ────────────────────────────────────────────────
export const applyPromoSchema = z.object({
  code: z
    .string()
    .min(1)
    .max(50)
    .transform((val) => val.toUpperCase()),
});

export const createPromoSchema = z.object({
  code: z.string().min(1).max(50),
  description: z.string().optional(),
  discountType: z.enum(["fixed", "percentage"]),
  discountValue: z.number().positive(),
  maxDiscountCap: z.number().positive().optional(),
  minimumOrderAmount: z.number().min(0).optional(),
  maxUsages: z.number().int().positive(),
  usagePerUserLimit: z.number().int().positive().optional(),
  expiresAt: z.string().datetime(),
  applicableMeals: z.array(uuidSchema).optional(),
  excludedMeals: z.array(uuidSchema).optional(),
  requiresNewUser: z.boolean().default(false),
  stackable: z.boolean().default(false),
});

// ─── Order Schemas ────────────────────────────────────────────────
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        mealId: uuidSchema,
        mealName: z.string(),
        quantity: z.number().int().min(1),
        portionSize: z.string(),
        spiceLevel: z.number().int().min(1).max(5),
        addOns: z
          .array(z.object({ name: z.string(), price: z.number() }))
          .default([]),
        specialInstructions: z.string().optional(),
        basePrice: z.number().min(0),
        portionModifier: z.number().default(1),
        addOnsTotal: z.number().min(0).default(0),
        itemPrice: z.number().min(0),
        totalPrice: z.number().min(0),
      }),
    )
    .min(1),
  subtotal: z.number().min(0),
  deliveryAddressId: uuidSchema,
  deliveryAddress: z.object({
    streetAddress: z.string(),
    apartment: z.string().optional(),
    city: z.string(),
    postalCode: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    deliveryInstructions: z.string().optional(),
  }),
  deliveryFee: z.number().min(0),
  taxAmount: z.number().min(0),
  total: z.number().min(0),
  paymentMethod: z.enum(["card", "wallet", "bank_transfer"]),
  promoCodeId: uuidSchema.optional(),
  promoCode: z.string().optional(),
  discountAmount: z.number().min(0).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]),
  notes: z.string().max(500).optional(),
});

// ─── Customization Schemas ────────────────────────────────────────
export const createCustomizationSchema = z.object({
  mealId: uuidSchema,
  name: z.string().min(1).max(100),
  portionSize: z.enum(["small", "regular", "large"]).default("regular"),
  spiceLevel: z.number().int().min(1).max(5).default(3),
  addOns: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number().default(1),
      }),
    )
    .optional(),
  removedIngredients: z.array(z.string()).optional(),
  extraIngredients: z.array(z.string()).optional(),
  specialInstructions: z.string().max(500).optional(),
  isFavorite: z.boolean().default(false),
});

// ─── Review Schemas ───────────────────────────────────────────────
export const createReviewSchema = z.object({
  mealId: uuidSchema,
  orderId: uuidSchema.optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().max(2000).optional(),
  photoUrls: z.array(z.string().url()).max(5).optional(),
});

// ─── Search Schemas ───────────────────────────────────────────────
export const searchSchema = z
  .object({
    query: z.string().min(1).max(200),
    filters: z.record(z.string(), z.unknown()).optional(),
  })
  .merge(paginationSchema);

export const saveFilterSchema = z.object({
  name: z.string().min(1).max(100),
  filters: z.record(z.string(), z.unknown()),
  isDefault: z.boolean().default(false),
});

// ─── Email Template Schemas ───────────────────────────────────────
export const createEmailTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  subject: z.string().min(1).max(500),
  htmlBody: z.string().min(1),
  textBody: z.string().optional(),
  category: z
    .enum(["transactional", "marketing", "system"])
    .default("transactional"),
  variables: z.array(z.string()).optional(),
});

// ─── Inventory Schemas ────────────────────────────────────────────
export const adjustInventorySchema = z.object({
  inventoryId: uuidSchema,
  quantity: z.number(),
  reason: z.string().max(500).optional(),
});

// ─── Security Schemas ─────────────────────────────────────────────
export const securityEventFilterSchema = z
  .object({
    eventType: z.string().optional(),
    severity: z.enum(["info", "warning", "critical"]).optional(),
    userId: uuidSchema.optional(),
    resolved: z.coerce.boolean().optional(),
  })
  .merge(paginationSchema)
  .merge(dateRangeSchema);

// ─── Utility ──────────────────────────────────────────────────────
export function parseBody<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
      .join("; ");
    throw new Error(`Validation failed: ${message}`);
  }
  return result.data;
}

export function parseQuery<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams,
): T {
  const params: Record<string, string | string[]> = {};
  searchParams.forEach((value, key) => {
    if (params[key]) {
      const existing = params[key];
      params[key] = Array.isArray(existing)
        ? [...existing, value]
        : [existing, value];
    } else {
      params[key] = value;
    }
  });
  return parseBody(schema, params);
}
