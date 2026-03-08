import { requireAuth, apiResponse, withErrorHandler } from "@/lib/api/helpers";

export const GET = withErrorHandler(async () => {
  const { user } = await requireAuth();

  return apiResponse({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    avatarUrl: user.avatar_url,
    dietaryPreferences: user.dietary_preferences,
    allergens: user.allergens,
    cuisinePreferences: user.cuisine_preferences,
    defaultSpiceLevel: user.default_spice_level,
    notificationSettings: user.notification_settings,
    timezone: user.timezone,
    language: user.language,
    isEmailVerified: user.is_email_verified,
    loyaltyPoints: user.loyalty_points,
    referralCode: user.referral_code,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    preferencesUpdatedAt: user.preferences_updated_at,
  });
});
