import { createClient } from "./client";
import type { Database } from "./database.types";

type MealRow = Database["public"]["Tables"]["meals"]["Row"];
type CategoryRow = Database["public"]["Tables"]["meal_categories"]["Row"];
type PromoCodeRow = Database["public"]["Tables"]["promo_codes"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type AddressRow =
  Database["public"]["Tables"]["user_delivery_addresses"]["Row"];
type CustomizationRow =
  Database["public"]["Tables"]["meal_customizations"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];

// ============================================
// Categories
// ============================================

export async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("meal_categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) throw error;
  return data as CategoryRow[];
}

// ============================================
// Meals
// ============================================

export async function getMeals(options?: {
  categoryId?: string;
  search?: string;
  limit?: number;
  availableOnly?: boolean;
}) {
  const supabase = createClient();
  let query = supabase.from("meals").select("*");

  if (options?.availableOnly !== false) {
    query = query.eq("is_available", true);
  }
  if (options?.categoryId && options.categoryId !== "all") {
    query = query.eq("category_id", options.categoryId);
  }
  if (options?.search) {
    query = query.or(
      `name.ilike.%${options.search}%,description.ilike.%${options.search}%`,
    );
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query.order("display_order");
  if (error) throw error;
  return data as MealRow[];
}

export async function getMealById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as MealRow;
}

// ============================================
// Admin Meals (includes unavailable)
// ============================================

export async function getAdminMeals() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .order("display_order");

  if (error) throw error;
  return data as MealRow[];
}

export async function getAdminCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("meal_categories")
    .select("*, meals(count)")
    .order("display_order");

  if (error) throw error;
  return (data ?? []).map((cat: any) => ({
    ...cat,
    meal_count: cat.meals?.[0]?.count ?? 0,
  }));
}

export async function deleteMeal(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("meals").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("meal_categories")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function updateMealOrder(
  meals: { id: string; display_order: number }[],
) {
  const supabase = createClient();
  for (const meal of meals) {
    const { error } = await supabase
      .from("meals")
      .update({ display_order: meal.display_order })
      .eq("id", meal.id);
    if (error) throw error;
  }
}

export async function updateCategoryOrder(
  categories: { id: string; display_order: number }[],
) {
  const supabase = createClient();
  for (const cat of categories) {
    const { error } = await supabase
      .from("meal_categories")
      .update({ display_order: cat.display_order })
      .eq("id", cat.id);
    if (error) throw error;
  }
}

// ============================================
// Promo Codes
// ============================================

export async function getPromos(status?: string) {
  const supabase = createClient();
  let query = supabase.from("promo_codes").select("*");

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data as PromoCodeRow[];
}

export async function getActivePromos() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("status", "active")
    .gte("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as PromoCodeRow[];
}

export async function updatePromoStatus(id: string, status: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("promo_codes")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function deletePromo(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("promo_codes").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// Orders
// ============================================

export async function getOrders(stage?: string) {
  const supabase = createClient();
  let query = supabase
    .from("orders")
    .select("*, users(name, email, phone)")
    .order("created_at", { ascending: false });

  if (stage && stage !== "all") {
    query = query.eq("order_status", stage);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as (OrderRow & {
    users: Pick<UserRow, "name" | "email" | "phone"> | null;
  })[];
}

export async function getOrderById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, users(name, email, phone), order_status_history(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("orders")
    .update({ order_status: status })
    .eq("id", id);
  if (error) throw error;
}

// ============================================
// Customers (Admin)
// ============================================

export async function getCustomers() {
  const supabase = createClient();
  const { data: users, error } = await supabase
    .from("users")
    .select("id, name, email, phone, created_at, last_login_at, role")
    .eq("role", "customer")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Get order aggregates per user
  const { data: orders } = await supabase
    .from("orders")
    .select("user_id, total");

  const ordersByUser = new Map<string, { count: number; total: number }>();
  if (orders) {
    for (const order of orders) {
      const existing = ordersByUser.get(order.user_id) || {
        count: 0,
        total: 0,
      };
      existing.count += 1;
      existing.total += Number(order.total);
      ordersByUser.set(order.user_id, existing);
    }
  }

  return (users ?? []).map((user) => {
    const stats = ordersByUser.get(user.id) || { count: 0, total: 0 };
    return {
      ...user,
      totalOrders: stats.count,
      totalSpent: stats.total,
      lastOrder: user.last_login_at,
      status:
        stats.count >= 20 ? "loyal" : stats.count > 0 ? "active" : "inactive",
    };
  });
}

// ============================================
// Dashboard Metrics
// ============================================

export async function getDashboardMetrics() {
  const supabase = createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("total, order_status, created_at, items");

  const allOrders = orders ?? [];
  const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = allOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
  };
}

export async function getPopularMeals(limit = 4) {
  const supabase = createClient();

  // Get all orders and aggregate meal counts from the items JSON
  const { data: orders } = await supabase.from("orders").select("items, total");

  const mealCounts = new Map<string, { count: number; revenue: number }>();

  for (const order of orders ?? []) {
    const items = order.items as any[];
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      const name = item.name || "Unknown";
      const existing = mealCounts.get(name) || { count: 0, revenue: 0 };
      existing.count += item.quantity || 1;
      existing.revenue += (item.price || 0) * (item.quantity || 1);
      mealCounts.set(name, existing);
    }
  }

  return Array.from(mealCounts.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function getRecentOrders(limit = 5) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, users(name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

// ============================================
// Addresses
// ============================================

export async function getUserAddresses(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_delivery_addresses")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("is_default", { ascending: false });

  if (error) throw error;
  return data as AddressRow[];
}

export async function addUserAddress(
  address: Database["public"]["Tables"]["user_delivery_addresses"]["Insert"],
) {
  const supabase = createClient();

  // If setting as default, unset others first
  if (address.is_default) {
    await supabase
      .from("user_delivery_addresses")
      .update({ is_default: false })
      .eq("user_id", address.user_id)
      .eq("is_default", true);
  }

  const { data, error } = await supabase
    .from("user_delivery_addresses")
    .insert(address)
    .select()
    .single();

  if (error) throw error;
  return data as AddressRow;
}

export async function updateUserAddress(
  id: string,
  updates: Database["public"]["Tables"]["user_delivery_addresses"]["Update"],
) {
  const supabase = createClient();

  if (updates.is_default && updates.user_id) {
    await supabase
      .from("user_delivery_addresses")
      .update({ is_default: false })
      .eq("user_id", updates.user_id)
      .eq("is_default", true);
  }

  const { data, error } = await supabase
    .from("user_delivery_addresses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as AddressRow;
}

export async function deleteUserAddress(id: string) {
  const supabase = createClient();
  // Soft delete
  const { error } = await supabase
    .from("user_delivery_addresses")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function setDefaultAddress(userId: string, addressId: string) {
  const supabase = createClient();

  // Unset all defaults
  await supabase
    .from("user_delivery_addresses")
    .update({ is_default: false })
    .eq("user_id", userId)
    .eq("is_default", true);

  // Set new default
  const { error } = await supabase
    .from("user_delivery_addresses")
    .update({ is_default: true })
    .eq("id", addressId);

  if (error) throw error;
}

// ============================================
// Saved Customizations (Presets)
// ============================================

export async function getSavedPresets(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("meal_customizations")
    .select("*, meals(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as (CustomizationRow & { meals: { name: string } | null })[];
}

export async function deletePreset(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("meal_customizations")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function togglePresetFavorite(id: string, isFavorite: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("meal_customizations")
    .update({ is_favorite: isFavorite })
    .eq("id", id);
  if (error) throw error;
}
