import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const POST = withErrorHandler(async (request: Request) => {
  await requireAuth();
  const body = await request.json();
  const { phone } = body;

  if (!phone || typeof phone !== "string") {
    return apiError("Phone number is required", 400);
  }

  // Basic E.164 format validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  const isValid = phoneRegex.test(phone.replace(/[\s\-()]/g, ""));

  return apiResponse({
    valid: isValid,
    formatted: isValid ? phone.replace(/[\s\-()]/g, "") : null,
    message: isValid ? "Phone number is valid" : "Invalid phone number format",
  });
});
