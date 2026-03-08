// Steps 81, 83, 84, 89: Order, Checkout, and Order History Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

export type OrderStatusHistoryRow =
  Database["public"]["Tables"]["order_status_history"]["Row"];
export type OrderStatusHistoryInsert =
  Database["public"]["Tables"]["order_status_history"]["Insert"];

// ─── Enums ────────────────────────────────────────────────────────
export type PaymentMethod = "card" | "wallet" | "bank_transfer";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

// ─── Raw JSON Structures (as stored in the DB JSON column) ───────
export interface OrderItemJson {
  meal_name?: string;
  meal_id?: string;
  quantity?: number;
  item_price?: number;
  options?: {
    spice_level?: number;
    [key: string]: unknown;
  };
  add_ons?: Array<{ name: string; price?: number }>;
  [key: string]: unknown;
}

export interface OrderDeliveryAddressJson {
  street_address?: string;
  apartment?: string;
  city?: string;
  postal_code?: string;
  delivery_instructions?: string;
  latitude?: number;
  longitude?: number;
}

// ─── Typed JSON Structures ────────────────────────────────────────
export interface OrderItem {
  mealId: string;
  mealName: string;
  quantity: number;
  portionSize: string;
  spiceLevel: number;
  addOns: Array<{ name: string; price: number }>;
  specialInstructions?: string;
  basePrice: number;
  portionModifier: number;
  addOnsTotal: number;
  itemPrice: number;
  totalPrice: number;
}

export interface OrderDeliveryAddress {
  streetAddress: string;
  apartment?: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  deliveryInstructions?: string;
}

// ─── Extended Types ───────────────────────────────────────────────
export interface Order extends Omit<OrderRow, "items" | "delivery_address"> {
  items: OrderItem[];
  delivery_address: OrderDeliveryAddress | null;
  statusHistory?: OrderStatusHistoryRow[];
}

export interface CreateOrderData {
  items: OrderItem[];
  subtotal: number;
  deliveryAddressId: string;
  deliveryAddress: OrderDeliveryAddress;
  deliveryFee: number;
  taxAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  promoCodeId?: string;
  promoCode?: string;
  discountAmount?: number;
  estimatedDeliveryTime?: number;
  estimatedPrepTime?: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "created_at" | "total" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface OrderSummary {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  favoriteItems: Array<{
    mealId: string;
    mealName: string;
    orderCount: number;
  }>;
}
