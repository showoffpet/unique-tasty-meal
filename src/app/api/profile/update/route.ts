import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, profileUpdateSchema } from "@/lib/api/validation";

export const PATCH = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  const body = await request.json();
  const updates = parseBody(profileUpdateSchema, body);

  const updateData: Record<string, unknown> = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.avatarUrl !== undefined)
    updateData.avatar_url = updates.avatarUrl;
  if (updates.dietaryPreferences !== undefined)
    updateData.dietary_preferences = updates.dietaryPreferences;
  if (updates.allergens !== undefined) updateData.allergens = updates.allergens;
  if (updates.cuisinePreferences !== undefined)
    updateData.cuisine_preferences = updates.cuisinePreferences;
  if (updates.defaultSpiceLevel !== undefined)
    updateData.default_spice_level = updates.defaultSpiceLevel;
  if (updates.notificationSettings !== undefined)
    updateData.notification_settings = updates.notificationSettings;
  if (updates.timezone !== undefined) updateData.timezone = updates.timezone;

  if (Object.keys(updateData).length === 0) {
    return apiError("No fields to update", 400);
  }

  updateData.preferences_updated_at = new Date().toISOString();

  const { data: updated, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) {
    return apiError("Failed to update profile", 500);
  }

  return apiResponse(updated);
});
