"use client";

import React, { useState } from "react";
import type { Database } from "@/lib/supabase/database.types";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export interface InventoryItemRow {
  id: string;
  item_name: string;
  current_stock: number;
  reorder_level?: number | null;
  unit: string;
  updated_at: string;
}

interface ConsumptionHistoryModalProps {
  isOpen: boolean;
  item: InventoryItemRow | null;
  onClose: () => void;
}

export default function ConsumptionHistoryModal({
  isOpen,
  item,
  onClose,
}: ConsumptionHistoryModalProps) {
  const [range, setRange] = useState<string>("30d");

  if (!item) return null;

  // Mock data for UI representation
  const avgDaily = Math.round((item.current_stock || 100) / 14);
  const trend: string = "stable";

  const ranges = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
  ] as const;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Consumption History: ${item.item_name}`}
    >
      <div className="p-6">
        {/* Header Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#fcfcfc] p-4 rounded-xl border border-[#f3f1f1]">
            <p className="text-xs uppercase tracking-wider font-semibold text-[#806b6b] mb-1">
              Avg. Daily
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1e1414]">
                {avgDaily}
              </span>
              <span className="text-sm text-[#999999]">{item.unit}/day</span>
            </div>
          </div>
          <div className="bg-[#fcfcfc] p-4 rounded-xl border border-[#f3f1f1]">
            <p className="text-xs uppercase tracking-wider font-semibold text-[#806b6b] mb-1">
              30d Trend
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {trend === "up" ? (
                <span className="flex items-center text-[#7b2d2d] font-bold text-lg">
                  <svg
                    className="w-5 h-5 mr-1"
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
                  +12%
                </span>
              ) : trend === "down" ? (
                <span className="flex items-center text-[#2E7D32] font-bold text-lg">
                  <svg
                    className="w-5 h-5 mr-1"
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
                  -5%
                </span>
              ) : (
                <span className="flex items-center text-[#806b6b] font-bold text-lg">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14"
                    />
                  </svg>
                  Stable
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-[#1e1414]">Usage Over Time</h4>
            <div className="flex bg-[#f3f1f1] rounded-lg p-1">
              {ranges.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRange(r.value)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    range === r.value
                      ? "bg-white text-[#1e1414] shadow-sm"
                      : "text-[#999999] hover:text-[#806b6b]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-48 bg-[#fcfcfc] border border-[#f3f1f1] border-dashed rounded-xl flex items-center justify-center text-[#999999]">
            {/* Placeholder for actual Recharts or ChartJS implementation */}
            <div className="text-center">
              <svg
                className="w-8 h-8 mx-auto mb-2 text-[#D2D2D2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="text-sm font-medium">
                Chart visualization pending analytics integration
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#fcfcfc] px-6 py-4 border-t border-[#f3f1f1] flex justify-end">
        <Button variant="secondary" onClick={onClose}>
          Close Filter
        </Button>
      </div>
    </Modal>
  );
}
