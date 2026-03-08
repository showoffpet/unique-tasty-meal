import React from "react";

export interface ComplianceRequirement {
  id: string;
  name: string;
  status: "compliant" | "in-progress" | "non-compliant";
  lastChecked: string;
  nextCheck: string;
}

interface ComplianceChecklistProps {
  requirements: ComplianceRequirement[];
  className?: string;
  isLoading?: boolean;
}

export const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({
  requirements,
  className = "",
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#f3f1f1] rounded-xl p-4 flex justify-between animate-pulse"
          >
            <div className="w-1/2">
              <div className="h-4 bg-[#f3f1f1] rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-[#f3f1f1] rounded w-1/4"></div>
            </div>
            <div className="w-1/4 flex flex-col items-end">
              <div className="h-6 bg-[#f3f1f1] rounded w-20 mb-2"></div>
              <div className="h-3 bg-[#f3f1f1] rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (requirements.length === 0) {
    return (
      <div
        className={`text-center py-12 bg-[#fcfcfc] rounded-xl border border-dashed border-[#f3f1f1] ${className}`}
      >
        <p className="text-[#806b6b] font-medium">
          No compliance requirements configured.
        </p>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "compliant":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#2E7D32]/10 text-[#2E7D32] px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Compliant
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#F59E0B]/10 text-[#D97706] px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Pending
          </span>
        );
      case "non-compliant":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#7b2d2d]/10 text-[#7b2d2d] px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Non-Compliant
          </span>
        );
      default:
        return (
          <span className="text-[#999999] text-xs font-medium uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {requirements.map((req) => (
        <div
          key={req.id}
          className="bg-white rounded-xl border border-[#f3f1f1] p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-sm transition-shadow"
        >
          <div>
            <h4 className="font-bold text-[#1e1414] mb-1">{req.name}</h4>
            <div className="flex items-center gap-4 text-xs font-medium text-[#806b6b]">
              <span>
                Last Checked: {new Date(req.lastChecked).toLocaleDateString()}
              </span>
              <span className="w-1 h-1 bg-[#D2D2D2] rounded-full"></span>
              <span>
                Next Check: {new Date(req.nextCheck).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            {getStatusDisplay(req.status)}
          </div>
        </div>
      ))}
    </div>
  );
};
