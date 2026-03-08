import React from "react";
import { SecurityEvent } from "./AlertCard";

interface IncidentTimelineProps {
  incidents: SecurityEvent[];
  onIncidentClick: (id: string) => void;
  className?: string;
  isLoading?: boolean;
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({
  incidents,
  onIncidentClick,
  className = "",
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className={`p-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 mb-8 animate-pulse">
            <div className="w-12 text-right">
              <div className="h-4 bg-[#f3f1f1] rounded w-full mb-1"></div>
              <div className="h-3 bg-[#f3f1f1] rounded w-8 ml-auto"></div>
            </div>
            <div className="relative flex-col items-center hidden sm:flex">
              <div className="h-3 w-3 bg-[#f3f1f1] rounded-full z-10"></div>
              {i !== 3 && (
                <div className="w-px h-full bg-[#f3f1f1] absolute top-3"></div>
              )}
            </div>
            <div className="flex-1 bg-white border border-[#f3f1f1] p-4 rounded-xl">
              <div className="h-5 bg-[#f3f1f1] rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-[#f3f1f1] rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div
        className={`text-center py-12 bg-[#fcfcfc] rounded-xl border border-dashed border-[#f3f1f1] ${className}`}
      >
        <p className="text-[#806b6b] font-medium">
          No incidents recorded in this timeframe.
        </p>
      </div>
    );
  }

  const getDotColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-[#7b2d2d] border-[#7b2d2d]/30";
      case "high":
        return "bg-[#F59E0B] border-[#F59E0B]/30";
      case "medium":
        return "bg-[#FCD34D] border-[#FCD34D]/30";
      default:
        return "bg-[#999999] border-[#f3f1f1]";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {incidents.map((incident, index) => {
        const date = new Date(incident.timestamp);
        const isLast = index === incidents.length - 1;

        return (
          <div
            key={incident.id}
            className="flex gap-4 mb-6 group cursor-pointer"
            onClick={() => onIncidentClick(incident.id)}
          >
            {/* Left aligned time - hiding on very small screens for better space */}
            <div className="hidden sm:block w-16 text-right pt-1 shrink-0">
              <div className="text-xs font-bold text-[#1e1414]">
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-[10px] text-[#999999] font-medium uppercase">
                {date.toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Timeline Line & Dot */}
            <div className="relative flex flex-col items-center shrink-0 w-4">
              <div
                className={`h-3 w-3 rounded-full border-[3px] z-10 mt-1.5 transition-transform group-hover:scale-125 ${getDotColor(incident.severity)}`}
              ></div>
              {!isLast && (
                <div className="w-px h-full bg-[#f3f1f1] absolute top-4 group-hover:bg-[#D2D2D2] transition-colors"></div>
              )}
            </div>

            {/* Content Box */}
            <div className="flex-1 bg-white border border-[#f3f1f1] p-4 rounded-xl group-hover:border-[#D2D2D2] group-hover:shadow-sm transition-all relative">
              <div className="sm:hidden flex justify-between items-center mb-2 pb-2 border-b border-[#f3f1f1]">
                <span className="text-xs font-bold text-[#1e1414]">
                  {date.toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-[#1e1414]">
                  {incident.type}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    incident.severity === "critical"
                      ? "bg-[#7b2d2d]/10 text-[#7b2d2d]"
                      : incident.severity === "high"
                        ? "bg-[#F59E0B]/10 text-[#D97706]"
                        : incident.severity === "medium"
                          ? "bg-[#FCD34D]/10 text-[#B45309]"
                          : "bg-[#f3f1f1] text-[#806b6b]"
                  }`}
                >
                  {incident.severity}
                </span>
              </div>
              <p className="text-sm text-[#806b6b]">{incident.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
