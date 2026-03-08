import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, withErrorHandler } from "@/lib/api/helpers";

export const POST = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const type = searchParams.get("type") || "signup";

  if (!token) {
    return apiError("Verification token is required", 400);
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: type as "signup" | "email",
  });

  if (error) {
    return apiError("Invalid or expired verification token", 401);
  }

  if (data.user) {
    await supabase
      .from("users")
      .update({ is_email_verified: true })
      .eq("id", data.user.id);
  }

  return apiResponse({ message: "Email verified successfully" });
});
