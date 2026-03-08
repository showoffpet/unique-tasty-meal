import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, withErrorHandler } from "@/lib/api/helpers";
import { parseBody, validateResetTokenSchema } from "@/lib/api/validation";

export const POST = withErrorHandler(async (request: Request) => {
  const body = await request.json();
  const { token } = parseBody(validateResetTokenSchema, body);

  const supabase = await createClient();

  const { data: tokenRecord } = await supabase
    .from("password_reset_tokens")
    .select("id, expires_at, used_at")
    .eq("token", token)
    .single();

  if (!tokenRecord) {
    return apiResponse({ valid: false });
  }

  const isExpired = new Date(tokenRecord.expires_at) < new Date();
  const isUsed = tokenRecord.used_at !== null;

  return apiResponse({ valid: !isExpired && !isUsed });
});
