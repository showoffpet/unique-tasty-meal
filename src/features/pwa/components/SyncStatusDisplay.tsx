import React, { useState } from "react";
import Button from "../../../components/ui/Button";

export type SyncState = "idle" | "syncing" | "synced" | "failed";

interface SyncStatusDisplayProps {
  status: SyncState;
  itemsSynced: number;
  itemsFailed: number;
  lastSyncAt?: string;
  nextSyncAt?: string;
  onSync: () => Promise<void>;
  errorMessage?: string;
  className?: string;
}

export const SyncStatusDisplay: React.FC<SyncStatusDisplayProps> = ({
  status,
  itemsSynced,
  itemsFailed,
  lastSyncAt,
  nextSyncAt,
  onSync,
  errorMessage,
  className = "",
}) => {
  const [isManuallySyncing, setIsManuallySyncing] = useState(false);

  const handleManualSync = async () => {
    setIsManuallySyncing(true);
    try {
      await onSync();
    } finally {
      setIsManuallySyncing(false);
    }
  };

  const isSyncing = status === "syncing" || isManuallySyncing;
  const isFailed = status === "failed";
  const isSynced = status === "synced";

  return (
    <div
      className={`bg-white rounded-xl border ${isFailed ? "border-[#7b2d2d]/30 bg-[#7b2d2d]/5" : "border-[#f3f1f1]"} p-5 shadow-sm ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isSyncing
                ? "bg-[#7A2E2E]/10 text-[#7A2E2E]"
                : isFailed
                  ? "bg-[#7b2d2d]/10 text-[#7b2d2d]"
                  : isSynced
                    ? "bg-[#2E7D32]/10 text-[#2E7D32]"
                    : "bg-[#fcfcfc] border border-[#f3f1f1] text-[#7A2E2E]"
            }`}
          >
            {isSyncing ? (
              <svg
                className="w-5 h-5 animate-spin"
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
            ) : isFailed ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            ) : isSynced ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-[#999999]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-bold text-[#1e1414]">Background Sync</h3>
            <p className="text-xs font-semibold uppercase tracking-wider mt-0.5">
              {isSyncing ? (
                <span className="text-[#1e1414]">Syncing Data...</span>
              ) : isFailed ? (
                <span className="text-[#7b2d2d]">Sync Failed</span>
              ) : isSynced ? (
                <span className="text-[#2E7D32]">Synced Successfully</span>
              ) : (
                <span className="text-[#806b6b]">Idle</span>
              )}
            </p>
          </div>
        </div>
        <Button
          variant={isSyncing ? "ghost" : "primary"}
          size="sm"
          onClick={handleManualSync}
          disabled={isSyncing}
          className={
            isSyncing ? "border border-[#f3f1f1] hover:bg-[#f3f1f1]" : ""
          }
        >
          {isSyncing ? "Syncing..." : "Sync Now"}
        </Button>
      </div>

      {isSyncing && (
        <div className="w-full bg-[#f3f1f1] rounded-full h-1.5 mb-4 overflow-hidden">
          <div
            className="bg-[#7A2E2E] h-1.5 rounded-full w-full animate-[pulse_1.5s_ease-in-out_infinite]"
            style={{ transformOrigin: "left" }}
          ></div>
        </div>
      )}

      {isFailed && errorMessage && (
        <div className="bg-[#7b2d2d]/10 border border-[#7b2d2d]/20 rounded-lg p-3 mb-4">
          <p className="text-xs text-[#7b2d2d] font-medium leading-relaxed">
            {errorMessage}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-[#999999] tracking-wider mb-1">
            Items Processed
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#1e1414]">
              {itemsSynced}
            </span>
            {itemsFailed > 0 && (
              <span className="text-xs font-semibold text-[#7b2d2d]">
                ({itemsFailed} failed)
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase font-bold text-[#999999] tracking-wider mb-1">
            Last Synced
          </p>
          <p className="text-sm font-medium text-[#1e1414]">
            {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : "Never"}
          </p>
        </div>
      </div>

      {nextSyncAt && !isSyncing && (
        <div className="mt-4 pt-4 border-t border-[#f3f1f1]">
          <p className="text-xs text-[#806b6b] flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-[#999999]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Next scheduled sync:{" "}
            <span className="font-semibold text-[#1e1414]">
              {new Date(nextSyncAt).toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
