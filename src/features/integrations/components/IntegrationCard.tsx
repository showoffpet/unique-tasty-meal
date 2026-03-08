import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import { StatusBadge } from "./StatusBadge";

export interface Integration {
  id: string;
  provider: string;
  providerName: string;
  status: "connected" | "disconnected" | "error" | "pending_auth";
  lastSyncAt?: string;
  logoUrl?: string;
}

interface IntegrationCardProps {
  integration: Integration;
  onConfigure: (id: string) => void;
  onTest: (id: string) => void;
  onDisconnect: (id: string) => void;
  onViewLogs: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConfigure,
  onTest,
  onDisconnect,
  onViewLogs,
  isLoading = false,
  className = "",
}) => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    if (!integration.lastSyncAt) return;

    const updateTimeAgo = () => {
      const diffInMs =
        new Date().getTime() - new Date(integration.lastSyncAt!).getTime();
      const diffInMins = Math.floor(diffInMs / 60000);

      if (diffInMins < 1) {
        setTimeAgo("Less than a minute ago");
      } else if (diffInMins === 1) {
        setTimeAgo("1 minute ago");
      } else if (diffInMins < 60) {
        setTimeAgo(`${diffInMins} minutes ago`);
      } else {
        const hours = Math.floor(diffInMins / 60);
        setTimeAgo(`${hours} hour${hours > 1 ? "s" : ""} ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [integration.lastSyncAt]);

  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-xl border border-[#f3f1f1] p-5 shadow-sm animate-pulse ${className}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#f3f1f1]"></div>
            <div>
              <div className="h-5 bg-[#f3f1f1] rounded w-24 mb-2"></div>
              <div className="h-4 bg-[#f3f1f1] rounded w-16"></div>
            </div>
          </div>
          <div className="h-6 bg-[#f3f1f1] rounded w-20"></div>
        </div>
        <div className="h-4 bg-[#f3f1f1] rounded w-3/4 mb-6"></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 bg-[#f3f1f1] rounded w-full"></div>
          <div className="h-9 bg-[#f3f1f1] rounded w-full"></div>
        </div>
      </div>
    );
  }

  const isError = integration.status === "error";
  const isConnected = integration.status === "connected";

  return (
    <div
      className={`
      bg-white rounded-xl border p-5 shadow-sm transition-all hover:shadow-md flex flex-col h-full
      ${isError ? "border-[#7b2d2d]/30 bg-[#7b2d2d]/5" : "border-[#f3f1f1]"} 
      ${className}
    `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#fcfcfc] border border-[#f3f1f1] flex items-center justify-center shrink-0 overflow-hidden text-[#7A2E2E]">
            {integration.logoUrl ? (
              <img
                src={integration.logoUrl}
                alt={integration.providerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-bold text-[#1e1414]">
              {integration.providerName}
            </h3>
            <p className="text-xs text-[#999999] capitalize font-medium">
              {integration.provider} API
            </p>
          </div>
        </div>
        <StatusBadge status={integration.status} size="sm" />
      </div>

      <div className="mb-6 flex-1">
        {integration.lastSyncAt ? (
          <p className="text-sm text-[#806b6b] flex items-center gap-1.5">
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Last synced:{" "}
            <span className="font-medium text-[#1e1414]">{timeAgo}</span>
          </p>
        ) : (
          <p className="text-sm text-[#999999] italic">Never synced</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-auto">
        {isConnected || isError ? (
          <>
            <Button
              variant="secondary"
              onClick={() => onConfigure(integration.id)}
              className="w-full justify-center"
            >
              Configure
            </Button>
            <div className="relative group w-full">
              <Button
                variant="ghost"
                className="w-full justify-center border border-[#f3f1f1] hover:bg-[#f3f1f1]"
              >
                More
              </Button>

              {/* Dropdown menu appearing on hover. Real implementation might use a click-away listener */}
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-[#f3f1f1] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 flex flex-col py-1">
                <button
                  onClick={() => onTest(integration.id)}
                  className="px-4 py-2 text-sm text-left text-[#1e1414] hover:bg-[#f3f1f1] transition-colors flex items-center gap-2"
                >
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Test Connection
                </button>
                <button
                  onClick={() => onViewLogs(integration.id)}
                  className="px-4 py-2 text-sm text-left text-[#1e1414] hover:bg-[#f3f1f1] transition-colors flex items-center gap-2"
                >
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  View Logs
                </button>
                <div className="h-px bg-[#f3f1f1] my-1"></div>
                <button
                  onClick={() => onDisconnect(integration.id)}
                  className="px-4 py-2 text-sm text-left text-[#7b2d2d] hover:bg-[#7b2d2d]/10 transition-colors font-medium flex items-center gap-2"
                >
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
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  Disconnect
                </button>
              </div>
            </div>
          </>
        ) : (
          <Button
            variant="primary"
            onClick={() => onConfigure(integration.id)}
            className="w-full col-span-2 justify-center"
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};
