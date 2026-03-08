import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const POST = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  const formData = await request.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) {
    return apiError("No file provided", 400);
  }

  // Validate file type and size
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return apiError("Invalid file type. Allowed: JPEG, PNG, WebP", 400);
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return apiError("File too large. Maximum size: 5MB", 400);
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${user.id}/avatar.${ext}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return apiError("Failed to upload avatar", 500);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  // Update user profile with new avatar URL
  await supabase
    .from("users")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  return apiResponse({ avatarUrl: publicUrl });
});
