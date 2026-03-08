import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, withErrorHandler } from "@/lib/api/helpers";

export const POST = withErrorHandler(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return apiError("Not authenticated", 401);
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    return apiError("Failed to logout", 500);
  }

  return apiResponse({ message: "Logged out successfully" });
});
