import { createClient } from "@/lib/supabase/server";
import {
  apiResponse,
  apiError,
  checkRateLimit,
  rateLimitError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, loginSchema } from "@/lib/api/validation";

export const POST = withErrorHandler(async (request: Request) => {
  // Rate limit: 5 attempts per 15 minutes per IP
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
    return rateLimitError();
  }

  const body = await request.json();
  const { email, password } = parseBody(loginSchema, body);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return apiError("Invalid email or password", 401);
  }

  // Update lastLoginAt
  await supabase
    .from("users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", data.user.id);

  // Fetch user profile
  const { data: user } = await supabase
    .from("users")
    .select("id, email, name, role, avatar_url, created_at")
    .eq("id", data.user.id)
    .single();

  return apiResponse({
    user,
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    },
  });
});
