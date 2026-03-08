"use client";

import React, { useState } from "react";
import ModalForm from "../../admin/components/ModalForm";
import Dropdown from "../../../components/ui/Dropdown";
import type { InventoryItemRow, AdjustmentData } from "../types";

export type { InventoryItemRow, AdjustmentData };

interface InventoryModalProps {
  isOpen: boolean;
  item: InventoryItemRow | null;
  onSave: (data: AdjustmentData) => Promise<void>;
  onCancel: () => void;
}

const REASON_OPTIONS = [
  { value: "manual_adjustment", label: "Manual Adjustment" },
  { value: "consumption", label: "Recorded Consumption" },
  { value: "restock", label: "Restock / Received Delivery" },
  { value: "waste", label: "Waste / Spoilage" },
  { value: "correction", label: "Inventory Correction" },
];

export default function InventoryModal({
  isOpen,
  item,
  onSave,
  onCancel,
}: InventoryModalProps) {
  const [adjustmentStr, setAdjustmentStr] = useState("");
  const [reason, setReason] = useState("manual_adjustment");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opened with a new item
  React.useEffect(() => {
    if (isOpen) {
      setAdjustmentStr("");
      setReason("manual_adjustment");
      setNotes("");
      setError(null);
    }
  }, [isOpen, item]);

  if (!item) return null;

  const handleSubmit = async () => {
    setError(null);

    const qty = parseInt(adjustmentStr, 10);
    if (isNaN(qty) || qty === 0) {
      setError("Please enter a non-zero adjustment amount.");
      return;
    }

    const newStock = item.current_stock + qty;
    if (newStock < 0) {
      setError(
        `Adjustment would result in negative stock. Minimum adjustment is -${item.current_stock}.`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        adjustment: qty,
        reason,
        notes: notes.trim(),
      });
      onCancel(); // Close modal on success
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save adjustment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStock = item.current_stock;
  const adjustValue = parseInt(adjustmentStr || "0", 10);
  const finalStock = currentStock + (isNaN(adjustValue) ? 0 : adjustValue);

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onCancel}
      title={`Adjust Stock: ${item.item_name}`}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Save Adjustment"
    >
      {error && (
        <div className="p-3 bg-[#7b2d2d]/10 text-[#7b2d2d] text-sm font-medium rounded-lg mb-4 border border-[#7b2d2d]/20">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-[#f3f1f1] rounded-lg border border-[#f3f1f1]">
        <div className="text-center">
          <p className="text-xs text-[#806b6b] font-semibold uppercase tracking-wider mb-1">
            Current
          </p>
          <p className="text-xl font-bold text-[#1e1414]">
            {currentStock} {item.unit}
          </p>
        </div>
        <div className="text-[#999999] px-4">
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
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#806b6b] font-semibold uppercase tracking-wider mb-1">
            New Total
          </p>
          <p
            className={`text-xl font-bold ${finalStock < 0 ? "text-[#7b2d2d]" : "text-[#2E7D32]"}`}
          >
            {finalStock} {item.unit}
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-sm font-semibold text-[#1e1414] mb-1">
            Adjustment Amount (+ / -)
          </label>
          <div className="relative">
            <input
              type="number"
              value={adjustmentStr}
              onChange={(e) => setAdjustmentStr(e.target.value)}
              placeholder="e.g. -5 or 10"
              className="block w-full focus:ring-[#7A2E2E] focus:border-[#7A2E2E] sm:text-sm border-[#f3f1f1] rounded-md font-mono text-lg"
              autoFocus
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#999999]">
              {item.unit}
            </div>
          </div>
          <p className="text-xs text-[#806b6b] mt-1">
            Use negative numbers for consumption/waste.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1e1414] mb-1">
            Reason code
          </label>
          <Dropdown
            value={reason}
            onChange={setReason}
            options={REASON_OPTIONS}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1e1414] mb-1 flex justify-between">
            <span>Notes</span>
            <span className="text-[#999999] font-normal">
              {notes.length}/500
            </span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Optional details about this adjustment..."
            className="block w-full focus:ring-[#7A2E2E] focus:border-[#7A2E2E] sm:text-sm border-[#f3f1f1] rounded-md"
          />
        </div>
      </div>
    </ModalForm>
  );
}
