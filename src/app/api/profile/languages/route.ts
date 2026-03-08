import { apiResponse, withErrorHandler } from "@/lib/api/helpers";

// English-only project, but keeping endpoint for consistency
export const GET = withErrorHandler(async () => {
  return apiResponse([{ code: "en", name: "English", isDefault: true }]);
});
