import { createClient } from "@/lib/supabase/server";
import {
  apiResponse,
  apiError,
  checkRateLimit,
  rateLimitError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, registerSchema } from "@/lib/api/validation";

export const POST = withErrorHandler(async (request: Request) => {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(`register:${ip}`, 3, 60 * 60 * 1000)) {
    return rateLimitError();
  }

  const body = await request.json();
  const { email, password, name } = parseBody(registerSchema, body);

  const supabase = await createClient();

  // Check if email already exists
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return apiError("Email already registered", 409);
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (authError) {
    return apiError(authError.message, 400);
  }

  if (!authData.user) {
    return apiError("Failed to create user", 500);
  }

  // Create user record in users table
  const { data: user, error: userError } = await supabase
    .from("users")
    .insert({
      id: authData.user.id,
      email,
      name,
      role: "customer",
    })
    .select("id, email, name, role, created_at")
    .single();

  if (userError) {
    return apiError("Failed to create user profile", 500);
  }

  return apiResponse(user, 201);
});
