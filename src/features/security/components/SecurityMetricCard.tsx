import React from "react";

interface SecurityMetricCardProps {
  title: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "neutral";
  trendPercent: number;
  icon: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const SecurityMetricCard: React.FC<SecurityMetricCardProps> = ({
  title,
  value,
  unit,
  trend,
  trendPercent,
  icon,
  className = "",
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-xl p-5 border border-[#f3f1f1] shadow-sm animate-pulse ${className}`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="h-4 bg-[#f3f1f1] rounded w-24"></div>
          <div className="w-8 h-8 rounded-lg bg-[#fcfcfc]"></div>
        </div>
        <div className="h-10 bg-[#f3f1f1] rounded w-1/2 mb-3"></div>
        <div className="flex gap-2">
          <div className="h-5 bg-[#f3f1f1] rounded w-16"></div>
          <div className="h-4 bg-[#f3f1f1] rounded w-28 mt-0.5"></div>
        </div>
      </div>
    );
  }

  const isUp = trend === "up";
  const isDown = trend === "down";

  // For security metrics like failed logins, going up is usually BAD (red)
  // But we let the implementer decide via trend prop meaning. Assuming standard:
  // Red for up, Green for down, Gray for neutral
  let trendColor = "text-[#806b6b]";
  let badgeBg = "bg-[#f3f1f1]";

  if (isUp) {
    trendColor = "text-[#7b2d2d]"; // Red
    badgeBg = "bg-[#7b2d2d]/10";
  } else if (isDown) {
    trendColor = "text-[#2E7D32]"; // Green
    badgeBg = "bg-[#2E7D32]/10";
  }

  return (
    <div
      className={`bg-white rounded-xl p-5 border border-[#f3f1f1] shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-[#806b6b] tracking-wider">
          {title}
        </h3>
        <div className="p-2 bg-[#fcfcfc] rounded-lg text-[#1e1414] border border-[#f3f1f1]">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-[#1e1414] tracking-tight">
          {new Intl.NumberFormat().format(value)}
        </span>
        {unit && (
          <span className="text-sm font-medium text-[#999999] tracking-wider">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold ${trendColor} ${badgeBg}`}
        >
          {isUp && (
            <svg
              className="w-3.5 h-3.5 mr-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          )}
          {isDown && (
            <svg
              className="w-3.5 h-3.5 mr-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          )}
          {!isUp && !isDown && (
            <svg
              className="w-3.5 h-3.5 mr-1 text-[#999999]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          )}
          {trendPercent}%
        </span>
        <span className="text-xs text-[#999999]">vs last month</span>
      </div>
    </div>
  );
};
