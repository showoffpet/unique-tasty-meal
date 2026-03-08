import { requireAuth, apiResponse, withErrorHandler } from "@/lib/api/helpers";

export const GET = withErrorHandler(async () => {
  const { user } = await requireAuth();

  return apiResponse({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatar_url,
    phone: user.phone,
    isEmailVerified: user.is_email_verified,
    loyaltyPoints: user.loyalty_points,
    createdAt: user.created_at,
  });
});
