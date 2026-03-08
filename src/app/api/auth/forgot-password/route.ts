import { createClient } from "@/lib/supabase/server";
import {
  apiResponse,
  apiError,
  checkRateLimit,
  rateLimitError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, forgotPasswordSchema } from "@/lib/api/validation";

export const POST = withErrorHandler(async (request: Request) => {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(`forgot:${ip}`, 3, 60 * 60 * 1000)) {
    return rateLimitError();
  }

  const body = await request.json();
  const { email } = parseBody(forgotPasswordSchema, body);

  const supabase = await createClient();

  // Always return success to prevent email enumeration
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (user) {
    // Generate reset token and store it
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await supabase.from("password_reset_tokens").insert({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });

    // Send reset email via Supabase Auth
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${token}`,
    });
  }

  return apiResponse({
    message:
      "If an account exists with that email, a password reset link has been sent.",
  });
});
