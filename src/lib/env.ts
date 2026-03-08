/**
 * Centralized environment variable validation.
 * Throws early with a clear message if required vars are missing.
 */

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Check your .env.local file.`,
    );
  }
  return value;
}

// Public environment (safe for client and server)
// Uses direct process.env access so Next.js can inline at build time.
export const SUPABASE_URL = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_URL",
);

export const SUPABASE_ANON_KEY = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
);

// Server-only environment (lazy getters — only evaluated when accessed)
export const serverEnv = {
  get SUPABASE_SERVICE_ROLE_KEY() {
    return requireEnv(
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      "SUPABASE_SERVICE_ROLE_KEY",
    );
  },
  get STRIPE_SECRET_KEY() {
    return requireEnv(
      process.env.STRIPE_SECRET_KEY,
      "STRIPE_SECRET_KEY",
    );
  },
  get STRIPE_WEBHOOK_SECRET() {
    return process.env.STRIPE_WEBHOOK_SECRET;
  },
};
