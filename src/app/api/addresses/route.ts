import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";
import {
  parseBody,
  createAddressSchema,
  updateAddressSchema,
} from "@/lib/api/validation";

export const GET = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("user_delivery_addresses")
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("is_default", { ascending: false })
    .order("usage_count", { ascending: false });

  if (error) return apiError("Failed to fetch addresses", 500);
  return apiResponse(data);
});

export const POST = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  const body = await request.json();
  const data = parseBody(createAddressSchema, body);

  // If setting as default, unset other defaults
  if (data.isDefault) {
    await supabase
      .from("user_delivery_addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { data: address, error } = await supabase
    .from("user_delivery_addresses")
    .insert({
      user_id: user.id,
      label: data.label,
      street_address: data.streetAddress,
      apartment: data.apartment,
      city: data.city,
      postal_code: data.postalCode,
      latitude: data.latitude,
      longitude: data.longitude,
      delivery_instructions: data.deliveryInstructions,
      is_default: data.isDefault,
      formatted_address: data.formattedAddress,
      google_places_id: data.googlePlacesId,
    })
    .select("*")
    .single();

  if (error) return apiError("Failed to create address", 500);
  return apiResponse(address, 201);
});

export const PATCH = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) return apiError("Address ID is required", 400);
  const data = parseBody(updateAddressSchema, updates);

  const updateData: Record<string, unknown> = {};
  if (data.label !== undefined) updateData.label = data.label;
  if (data.streetAddress !== undefined)
    updateData.street_address = data.streetAddress;
  if (data.apartment !== undefined) updateData.apartment = data.apartment;
  if (data.city !== undefined) updateData.city = data.city;
  if (data.postalCode !== undefined) updateData.postal_code = data.postalCode;
  if (data.latitude !== undefined) updateData.latitude = data.latitude;
  if (data.longitude !== undefined) updateData.longitude = data.longitude;
  if (data.deliveryInstructions !== undefined)
    updateData.delivery_instructions = data.deliveryInstructions;
  if (data.isDefault !== undefined) {
    updateData.is_default = data.isDefault;
    if (data.isDefault) {
      await supabase
        .from("user_delivery_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }
  }

  const { data: updated, error } = await supabase
    .from("user_delivery_addresses")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) return apiError("Failed to update address", 500);
  return apiResponse(updated);
});

export const DELETE = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return apiError("Address ID is required", 400);

  const { error } = await supabase
    .from("user_delivery_addresses")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return apiError("Failed to delete address", 500);
  return apiResponse({ message: "Address deleted" });
});
