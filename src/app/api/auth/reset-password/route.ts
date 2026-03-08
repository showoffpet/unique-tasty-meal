import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiResponse, apiError, withErrorHandler } from "@/lib/api/helpers";
import { parseBody, resetPasswordSchema } from "@/lib/api/validation";

export const POST = withErrorHandler(async (request: Request) => {
  const body = await request.json();
  const { token, newPassword } = parseBody(resetPasswordSchema, body);

  const supabase = await createClient();

  // Find and validate token
  const { data: tokenRecord } = await supabase
    .from("password_reset_tokens")
    .select("id, user_id, expires_at, used_at")
    .eq("token", token)
    .single();

  if (!tokenRecord) {
    return apiError("Invalid reset token", 401);
  }

  if (new Date(tokenRecord.expires_at) < new Date()) {
    return apiError("Reset token has expired", 401);
  }

  if (tokenRecord.used_at) {
    return apiError("Reset token has already been used", 401);
  }

  // Update password via admin client
  const adminClient = createAdminClient();
  const { error: updateError } = await adminClient.auth.admin.updateUserById(
    tokenRecord.user_id,
    { password: newPassword },
  );

  if (updateError) {
    return apiError("Failed to update password", 500);
  }

  // Mark token as used
  await supabase
    .from("password_reset_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", tokenRecord.id);

  // Invalidate all sessions for this user
  await adminClient.auth.admin.signOut(tokenRecord.user_id, "global");

  return apiResponse({
    message:
      "Password has been reset successfully. Please login with your new password.",
  });
});
