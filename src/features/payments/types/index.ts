// Step 82: Payment Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type PaymentMethodRow =
  Database["public"]["Tables"]["payment_methods"]["Row"];
export type PaymentMethodInsert =
  Database["public"]["Tables"]["payment_methods"]["Insert"];
export type PaymentMethodUpdate =
  Database["public"]["Tables"]["payment_methods"]["Update"];

export type PaymentTransactionRow =
  Database["public"]["Tables"]["payment_transactions"]["Row"];
export type PaymentTransactionInsert =
  Database["public"]["Tables"]["payment_transactions"]["Insert"];

// ─── Enums ────────────────────────────────────────────────────────
export type PaymentType = "card" | "wallet" | "bank_transfer";
export type PaymentProvider = "stripe" | "paystack" | "flutterwave";
export type TransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded"
  | "disputed";

// ─── Typed JSON Structures ────────────────────────────────────────
export interface TransactionMetadata {
  itemCount?: number;
  deliveryFee?: number;
  promoCode?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

// ─── Extended Types ───────────────────────────────────────────────
export interface SavedPaymentMethod extends Omit<
  PaymentMethodRow,
  "billing_address"
> {
  billing_address: BillingAddress | null;
}

export interface PaymentTransaction extends Omit<
  PaymentTransactionRow,
  "metadata"
> {
  metadata: TransactionMetadata | null;
}

export interface AddPaymentMethodData {
  paymentType: PaymentType;
  provider: PaymentProvider;
  providerPaymentMethodId: string;
  displayName: string;
  lastFour?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
  billingAddress?: BillingAddress;
}

export interface ProcessPaymentData {
  orderId: string;
  paymentMethodId: string;
  amount: number;
  currency: string;
}

export interface RefundData {
  transactionId: string;
  amount: number;
  reason: string;
}
