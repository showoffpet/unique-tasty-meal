import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UserRow } from "@/features/auth/types";

// ─── Auth Helpers ─────────────────────────────────────────────────

/**
 * Get the authenticated user from the Supabase session.
 * Returns the user row from the `users` table, or null if not authenticated.
 */
export async function getAuthUser(): Promise<UserRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

/**
 * Require authentication — throws a 401 NextResponse if not authenticated.
 */
export async function requireAuth(): Promise<{
  user: UserRow;
  supabase: Awaited<ReturnType<typeof createClient>>;
}> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    throw apiError("Authentication required", 401);
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!user) {
    throw apiError("User not found", 404);
  }

  return { user, supabase };
}

/**
 * Require a specific role — throws 403 if the user doesn't have the role.
 */
export function requireRole(user: UserRow, ...roles: string[]): void {
  if (!roles.includes(user.role)) {
    throw apiError("Insufficient permissions", 403);
  }
}

// ─── Response Helpers ─────────────────────────────────────────────

export function apiResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
}

// ─── Rate Limiting (in-memory, per-instance) ──────────────────────

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter. Returns true if the request is allowed.
 * For production, replace with Redis or Upstash.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

export function rateLimitError() {
  return apiError("Too many requests. Please try again later.", 429);
}

// ─── Handler Wrapper ──────────────────────────────────────────────

/**
 * Wraps an API handler with consistent error handling.
 * Catches thrown NextResponse objects (from apiError/requireAuth) and returns them.
 * Supports both simple routes and dynamic routes with params.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withErrorHandler<
  T extends (...args: any[]) => Promise<NextResponse>,
>(handler: T): T {
  return (async (...args: Parameters<T>): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof NextResponse) {
        return error;
      }
      console.error("API Error:", error);
      return apiError("Internal server error", 500);
    }
  }) as T;
}
