import { createBrowserClient } from "@supabase/ssr";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";

const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Subscribe to real-time order updates for a restaurant.
 */
export function subscribeToOrders(
  restaurantId: string,
  onUpdate: (payload: Record<string, unknown>) => void,
): RealtimeChannel {
  return supabase
    .channel(`restaurant:${restaurantId}:orders`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
        filter: `restaurant_id=eq.${restaurantId}`,
      },
      (payload) => onUpdate({ ...payload }),
    )
    .subscribe();
}

/**
 * Subscribe to real-time inventory updates for a restaurant.
 */
export function subscribeToInventory(
  restaurantId: string,
  onUpdate: (payload: Record<string, unknown>) => void,
): RealtimeChannel {
  return supabase
    .channel(`restaurant:${restaurantId}:inventory`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "meals",
        filter: `restaurant_id=eq.${restaurantId}`,
      },
      (payload) => onUpdate({ ...payload }),
    )
    .subscribe();
}

/**
 * Unsubscribe from a channel.
 */
export function unsubscribeChannel(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}
