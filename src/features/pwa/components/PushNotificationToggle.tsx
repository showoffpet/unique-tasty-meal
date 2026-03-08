import React, { useState } from "react";

interface PushNotificationToggleProps {
  isSubscribed: boolean;
  onSubscribe: () => Promise<void>;
  onUnsubscribe: () => Promise<void>;
  className?: string;
}

export const PushNotificationToggle: React.FC<PushNotificationToggleProps> = ({
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if browser supports notifications
  const isSupported =
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator;

  const handleToggle = async () => {
    if (!isSupported) {
      setError("Your browser doesn't support push notifications.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isSubscribed) {
        await onUnsubscribe();
      } else {
        // Request permission if not already granted
        if (Notification.permission !== "granted") {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            throw new Error("Permission denied by user.");
          }
        }
        await onSubscribe();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update notification settings.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] p-5 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-4 items-start">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isSubscribed
                ? "bg-[#7A2E2E]/10 text-[#7A2E2E]"
                : "bg-[#fcfcfc] border border-[#f3f1f1] text-[#999999]"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>

          <div>
            <h3 className="font-bold text-[#1e1414] mb-1">
              Push Notifications
            </h3>
            <p className="text-xs text-[#806b6b] leading-relaxed max-w-sm">
              Receive important alerts, order updates, and security notices
              directly on your device, even when the app is closed.
            </p>

            {!isSupported && (
              <p className="text-xs font-semibold text-[#D97706] mt-2 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Not supported by your browser
              </p>
            )}

            {error && (
              <p className="text-xs font-semibold text-[#7b2d2d] mt-2 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          {/* Custom Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={isSubscribed}
            onClick={handleToggle}
            disabled={!isSupported || isLoading}
            className={`
              relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A2E2E] focus-visible:ring-opacity-75
              ${isSubscribed ? "bg-[#2E7D32]" : "bg-[#f3f1f1]"}
              ${!isSupported || isLoading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <span className="sr-only">Toggle push notifications</span>
            <span
              aria-hidden="true"
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                ${isSubscribed ? "translate-x-5" : "translate-x-0"}
              `}
            />
          </button>

          <span
            className={`text-[10px] uppercase font-bold tracking-wider ${isSubscribed ? "text-[#2E7D32]" : "text-[#999999]"}`}
          >
            {isLoading ? "Updating..." : isSubscribed ? "Subscribed" : "Off"}
          </span>
        </div>
      </div>
    </div>
  );
};
