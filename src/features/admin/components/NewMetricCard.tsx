"use client";

import React from "react";

interface StatusPillProps {
  value: string;
  trend: "up" | "down";
}

export function StatusPill({ value, trend }: StatusPillProps) {
  const isUp = trend === "up";
  return (
    <div
      className={`px-2 py-1 rounded text-xs font-semibold ${
        isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
      }`}
    >
      {value}
    </div>
  );
}

interface NewMetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  iconBg: string;
}

export function NewMetricCard({
  title,
  value,
  change,
  trend,
  icon,
  iconBg,
}: NewMetricCardProps) {
  return (
    <div className="bg-[#ffffff] p-6 rounded-xl border border-[#f3f1f1] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
        <StatusPill value={change} trend={trend} />
      </div>
      <p className="text-[#806b6b] text-sm font-medium">{title}</p>
      <p className="text-[#1e1414] text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
