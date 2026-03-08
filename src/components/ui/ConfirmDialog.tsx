"use client";

import React, { useEffect } from "react";
import Button from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  intent?: "danger" | "warning" | "info" | "primary";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  intent = "primary",
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1e1414]/80 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog Panel */}
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 z-50 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="p-6">
          <h2
            id="dialog-title"
            className="text-xl font-bold text-[#1e1414] mb-2"
          >
            {title}
          </h2>
          <p className="text-sm text-[#806b6b]">{message}</p>
        </div>

        <div className="bg-[#f3f1f1] px-6 py-4 flex flex-row-reverse gap-3 border-t border-[#f3f1f1]">
          <Button
            variant={
              intent === "danger"
                ? "primary"
                : intent === "warning"
                  ? "primary"
                  : "primary"
            } // Map to primary as base or custom coloring if button supports it
            onClick={onConfirm}
            className={
              intent === "danger" ? "bg-[#7b2d2d] hover:bg-[#561b1b]" : ""
            }
          >
            {confirmLabel}
          </Button>

          {cancelLabel && (
            <Button variant="ghost" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
