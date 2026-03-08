/**
 * Security configuration for rate limits, alert thresholds, and notification settings.
 */
export const securityConfig = {
  rateLimits: {
    loginAttempts: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    apiRequests: {
      maxRequests: 100,
      windowMs: 60 * 1000, // 1 minute
    },
  },
  alertThresholds: {
    failedLogins: 3,
    suspiciousActivity: 5,
    bruteForce: 10,
  },
  notifications: {
    enableSound: true,
    enableBrowserNotification: true,
    criticalSeverities: ["critical", "high"] as const,
  },
  session: {
    maxAge: 24 * 60 * 60, // 24 hours in seconds
    refreshThreshold: 60 * 60, // 1 hour in seconds
  },
} as const;

export type SecurityConfig = typeof securityConfig;
