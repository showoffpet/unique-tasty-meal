"use client";

import React, { useState, useEffect } from "react";
import ModalForm from "../../admin/components/ModalForm";
import type { InventoryItemRow, ReorderData } from "../types";

export type { InventoryItemRow, ReorderData };

interface ReorderLevelModalProps {
  isOpen: boolean;
  item: InventoryItemRow | null;
  onSave: (data: ReorderData) => Promise<void>;
  onCancel: () => void;
}

export default function ReorderLevelModal({
  isOpen,
  item,
  onSave,
  onCancel,
}: ReorderLevelModalProps) {
  const [level, setLevel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      setLevel(item.reorder_level?.toString() || "0");
      setError(null);
    }
  }, [isOpen, item]);

  if (!item) return null;

  const handleSubmit = async () => {
    setError(null);
    const val = parseInt(level, 10);

    if (isNaN(val) || val < 0) {
      setError("Reorder level must be 0 or greater.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({ reorder_level: val });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update reorder level");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onCancel}
      title="Adjust Reorder Level"
      description={`Set the minimum stock threshold for "${item.item_name}". An alert will be triggered when stock falls below this level.`}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      {error && (
        <div className="p-3 bg-[#7b2d2d]/10 text-[#7b2d2d] text-sm font-medium rounded-lg mb-4 border border-[#7b2d2d]/20">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-[#1e1414] mb-1">
          New Reorder Level
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="block w-full focus:ring-[#7A2E2E] focus:border-[#7A2E2E] sm:text-sm border-[#f3f1f1] rounded-md font-mono text-lg"
            autoFocus
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#999999]">
            {item.unit}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between p-3 bg-[#fcfcfc] rounded border border-[#f3f1f1] text-sm text-[#806b6b]">
          <span>Current Stock:</span>
          <span className="font-bold text-[#1e1414]">
            {item.current_stock} {item.unit}
          </span>
        </div>
      </div>
    </ModalForm>
  );
}
