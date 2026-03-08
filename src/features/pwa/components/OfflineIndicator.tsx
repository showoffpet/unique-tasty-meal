import React, { useSyncExternalStore } from "react";

type SyncState = "online" | "offline" | "syncing";

interface OfflineIndicatorProps {
  className?: string;
  onStatusClick?: () => void;
  // Option props to override internal state (useful for forcing syncing state)
  forceState?: SyncState;
}

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

const getSnapshot = () => {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
};

const getServerSnapshot = () => true;

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  className = "",
  onStatusClick,
  forceState,
}) => {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Determine effective state (prop overrides internal state)
  const currentState: SyncState =
    forceState || (isOnline ? "online" : "offline");

  const getConfig = () => {
    switch (currentState) {
      case "syncing":
        return {
          bg: "bg-[#7A2E2E]/10",
          text: "text-[#7A2E2E]",
          label: "Syncing...",
          icon: (
            <svg
              className="w-3.5 h-3.5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ),
        };
      case "offline":
        return {
          bg: "bg-[#f3f1f1]",
          text: "text-[#999999]",
          label: "Offline",
          icon: (
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.168a1 1 0 10-1.414 1.414"
              />
            </svg>
          ),
        };
      case "online":
      default:
        return {
          bg: "bg-[#2E7D32]/10",
          text: "text-[#2E7D32]",
          label: "Online",
          icon: (
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          ),
        };
    }
  };

  const config = getConfig();

  return (
    <button
      onClick={onStatusClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${config.bg} ${config.text} ${className}`}
      disabled={!onStatusClick}
      title="Click for sync details"
    >
      {config.icon}
      {config.label}
    </button>
  );
};
