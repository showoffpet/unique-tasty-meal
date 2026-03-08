"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";

const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type ConnectionStatus = "connecting" | "connected" | "error" | "disconnected";

/**
 * Subscribe to real-time security events and audit logs for the platform admin dashboard.
 * Handles connection state, reconnection, and optional sound notifications.
 */
export function useSecurityRealtime(
  onSecurityEvent: (payload: Record<string, unknown>) => void,
  onAuditLog?: (payload: Record<string, unknown>) => void,
  options?: { enableSoundNotification?: boolean },
) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const securityChannelRef = useRef<RealtimeChannel | null>(null);
  const auditChannelRef = useRef<RealtimeChannel | null>(null);
  const callbackRef = useRef(onSecurityEvent);
  const auditCallbackRef = useRef(onAuditLog);
  callbackRef.current = onSecurityEvent;
  auditCallbackRef.current = onAuditLog;

  const playNotificationSound = useCallback(() => {
    if (!options?.enableSoundNotification) return;
    try {
      const audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch {
      // Silently fail if audio is not available
    }
  }, [options?.enableSoundNotification]);

  useEffect(() => {
    setConnectionStatus("connecting");

    // Security events channel
    securityChannelRef.current = supabase
      .channel("security-events-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "security_events",
        },
        (payload) => {
          callbackRef.current({ ...payload });
          playNotificationSound();
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setConnectionStatus("connected");
        else if (status === "CHANNEL_ERROR") setConnectionStatus("error");
      });

    // Audit logs channel
    auditChannelRef.current = supabase
      .channel("audit-logs-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "platform_audit_logs",
        },
        (payload) => {
          auditCallbackRef.current?.({ ...payload });
        },
      )
      .subscribe();

    return () => {
      if (securityChannelRef.current) {
        supabase.removeChannel(securityChannelRef.current);
        securityChannelRef.current = null;
      }
      if (auditChannelRef.current) {
        supabase.removeChannel(auditChannelRef.current);
        auditChannelRef.current = null;
      }
      setConnectionStatus("disconnected");
    };
  }, [playNotificationSound]);

  return { connectionStatus };
}
