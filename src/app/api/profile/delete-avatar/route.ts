import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const DELETE = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();

  if (!user.avatar_url) {
    return apiError("No avatar to delete", 400);
  }

  // Remove from storage
  const path = `${user.id}/avatar`;
  await supabase.storage
    .from("avatars")
    .remove([`${path}.jpg`, `${path}.png`, `${path}.webp`]);

  // Clear avatar URL from user profile
  await supabase.from("users").update({ avatar_url: null }).eq("id", user.id);

  return apiResponse({ message: "Avatar deleted successfully" });
});
