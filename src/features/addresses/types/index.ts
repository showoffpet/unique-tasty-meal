// Step 79: Address and Delivery Zone Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type DeliveryAddressRow =
  Database["public"]["Tables"]["user_delivery_addresses"]["Row"];
export type DeliveryAddressInsert =
  Database["public"]["Tables"]["user_delivery_addresses"]["Insert"];
export type DeliveryAddressUpdate =
  Database["public"]["Tables"]["user_delivery_addresses"]["Update"];

// ─── Enums ────────────────────────────────────────────────────────
export type AddressLabel = "home" | "work" | "other";
export type VerificationStatus =
  | "valid"
  | "out_of_zone"
  | "partially_in_zone"
  | "unverified";

// ─── Typed JSON Structures ────────────────────────────────────────
export interface DeliveryZoneInfo {
  restaurantId: string;
  restaurantName: string;
  isInZone: boolean;
  distance: number;
  deliveryFee: number;
}

// ─── Extended Types ───────────────────────────────────────────────
export interface DeliveryAddress extends Omit<
  DeliveryAddressRow,
  "delivery_zones"
> {
  delivery_zones: DeliveryZoneInfo[] | null;
}

export interface CreateAddressData {
  label: AddressLabel;
  streetAddress: string;
  apartment?: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  deliveryInstructions?: string;
  isDefault?: boolean;
  formattedAddress: string;
  googlePlacesId?: string;
}

export interface UpdateAddressData {
  label?: AddressLabel;
  streetAddress?: string;
  apartment?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  deliveryInstructions?: string;
  isDefault?: boolean;
}
