import React from "react";
import Button from "../../../components/ui/Button";

export interface SecurityEvent {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  description: string;
  status: "open" | "investigating" | "resolved";
}

interface AlertCardProps {
  alert: SecurityEvent;
  onViewDetails: (id: string) => void;
  onAssign: (id: string) => void;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onViewDetails,
  onAssign,
  className = "",
}) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-[#7b2d2d]/10 text-[#7b2d2d] border-[#7b2d2d]/20";
      case "high":
        return "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20";
      case "medium":
        return "bg-[#FCD34D]/10 text-[#B45309] border-[#FCD34D]/20";
      case "low":
      default:
        return "bg-[#f3f1f1] text-[#806b6b] border-[#f3f1f1]";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7b2d2d]"></span>Open
          </span>
        );
      case "investigating":
        return (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
            Investigating
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>Resolved
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:shadow-sm transition-shadow ${className}`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded border ${getSeverityStyles(alert.severity)}`}
          >
            {alert.severity}
          </span>
          <span className="text-xs font-semibold text-[#806b6b] bg-[#f3f1f1] px-2 py-0.5 rounded">
            {alert.type}
          </span>
          <span className="text-xs text-[#999999]">
            {new Date(alert.timestamp).toLocaleString()}
          </span>
        </div>

        <p className="text-sm font-medium text-[#1e1414] mb-2">
          {alert.description}
        </p>

        <div className="text-xs font-semibold text-[#806b6b]">
          Status: {getStatusDisplay(alert.status)}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:flex-col lg:flex-row shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAssign(alert.id)}
          className={`border border-[#f3f1f1] hover:bg-[#f3f1f1] ${alert.status !== "open" ? "opacity-50 pointer-events-none" : ""}`}
        >
          Assign to Me
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewDetails(alert.id)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
