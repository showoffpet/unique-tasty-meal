"use client";

import { useEffect, useRef, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";

const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Subscribe to real-time updates on a single order.
 */
export function useOrderRealtimeSubscription(
  orderId: string | null,
  onUpdate: (payload: Record<string, unknown>) => void,
) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const callbackRef = useRef(onUpdate);
  callbackRef.current = onUpdate;

  useEffect(() => {
    if (!orderId) return;

    channelRef.current = supabase
      .channel(`order:${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) =>
          callbackRef.current({ ...payload }),
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [orderId]);
}

/**
 * Subscribe to real-time updates on the entire order queue for a restaurant.
 * Filters by restaurantId. Triggers on new orders, status changes, etc.
 */
export function useOrderQueueRealtimeSubscription(
  restaurantId: string | null,
  onUpdate: (payload: Record<string, unknown>) => void,
) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const callbackRef = useRef(onUpdate);
  callbackRef.current = onUpdate;

  const subscribe = useCallback(() => {
    if (!restaurantId) return;

    channelRef.current = supabase
      .channel(`restaurant:${restaurantId}:order-queue`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) =>
          callbackRef.current({ ...payload }),
      )
      .subscribe();
  }, [restaurantId]);

  useEffect(() => {
    subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [subscribe]);
}
