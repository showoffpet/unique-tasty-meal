// Step 91: Analytics Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type SalesMetricsRow =
  Database["public"]["Tables"]["sales_metrics"]["Row"];

// ─── Enums ────────────────────────────────────────────────────────
export type PeriodType = "daily" | "weekly" | "monthly";

// ─── Typed JSON Structures ────────────────────────────────────────
export interface TopMealData {
  mealId: string;
  mealName: string;
  totalOrders: number;
  totalRevenue: number;
}

export interface TopCategoryData {
  categoryId: string;
  categoryName: string;
  totalOrders: number;
  totalRevenue: number;
}

export interface PeakHourData {
  hour: number;
  orderCount: number;
  revenue: number;
}

// ─── Extended Types ───────────────────────────────────────────────
export interface SalesMetrics extends Omit<
  SalesMetricsRow,
  | "top_meals"
  | "top_categories"
  | "peak_hours"
  | "payment_method_breakdown"
  | "customer_segments"
> {
  top_meals: TopMealData[];
  top_categories: TopCategoryData[];
  peak_hours: PeakHourData[];
  payment_method_breakdown: Record<string, number>;
  customer_segments: Record<string, number>;
}

export interface AnalyticsFilters {
  periodType: PeriodType;
  startDate: string;
  endDate: string;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  orders: number;
}

export interface AnalyticsDashboard {
  currentPeriod: SalesMetrics;
  previousPeriod?: SalesMetrics;
  revenueChart: RevenueChartData[];
  growthPercentage: number;
}
