"use client";

import React from "react";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  status?: "default" | "success" | "warning" | "error";
  actor?: string;
}

interface StatusTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export default function StatusTimeline({
  events,
  className = "",
}: StatusTimelineProps) {
  // Sort events newest first
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "success":
        return "bg-[#2E7D32] border-[#2E7D32]";
      case "warning":
        return "bg-[#ED8B00] border-[#ED8B00]";
      case "error":
        return "bg-[#7b2d2d] border-[#7b2d2d]";
      case "default":
      default:
        return "bg-[#7A2E2E] border-[#7A2E2E]";
    }
  };

  const getStatusBgColor = (status?: string) => {
    switch (status) {
      case "success":
        return "bg-[#2E7D32]/10";
      case "warning":
        return "bg-[#ED8B00]/10";
      case "error":
        return "bg-[#7b2d2d]/10";
      case "default":
      default:
        return "bg-[#7A2E2E]/10";
    }
  };

  const getStatusIconColor = (status?: string) => {
    switch (status) {
      case "success":
        return "text-[#2E7D32]";
      case "warning":
        return "text-[#ED8B00]";
      case "error":
        return "text-[#7b2d2d]";
      case "default":
      default:
        return "text-[#7A2E2E]";
    }
  };

  if (events.length === 0) {
    return (
      <div className={`text-sm text-[#999999] italic ${className}`}>
        No events recorded.
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Vertical Line */}
      <div className="absolute top-4 bottom-4 left-4 w-[2px] bg-[#f3f1f1] -z-10 rounded-full" />

      <div className="space-y-6">
        {sortedEvents.map((event, idx) => (
          <div key={event.id} className="flex gap-4">
            {/* Context Icon */}
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${getStatusColor(event.status)} ${getStatusBgColor(event.status)} mt-0.5 shadow-sm`}
            >
              {event.icon ? (
                <div className={`w-4 h-4 ${getStatusIconColor(event.status)}`}>
                  {event.icon}
                </div>
              ) : (
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(event.status).split(" ")[0]}`}
                />
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start gap-4 mb-0.5">
                <h4 className="font-semibold text-[#1e1414] text-sm">
                  {event.title}
                </h4>
                <span className="text-xs text-[#999999] whitespace-nowrap">
                  {new Date(event.timestamp).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {event.description && (
                <p className="text-sm text-[#806b6b] leading-relaxed">
                  {event.description}
                </p>
              )}

              {event.actor && (
                <p className="text-xs text-[#999999] mt-1 italic">
                  by {event.actor}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
