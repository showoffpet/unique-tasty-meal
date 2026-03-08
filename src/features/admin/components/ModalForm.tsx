"use client";

import React from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  children: React.ReactNode;
  className?: string;
  hideFooter?: boolean;
}

export default function ModalForm({
  isOpen,
  onClose,
  title,
  description,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  children,
  className = "",
  hideFooter = false,
}: ModalFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    await onSubmit(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose()}
      title={title}
    >
      <form onSubmit={handleSubmit} className={className}>
        <div className="p-6">
          {description && (
            <p className="text-sm text-[#806b6b] mb-5">{description}</p>
          )}
          <div className="space-y-4">{children}</div>
        </div>

        {!hideFooter && (
          <div className="bg-[#fcfcfc] px-6 py-4 border-t border-[#f3f1f1] flex justify-end gap-3 rounded-b-xl">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {submitLabel}
            </Button>
          </div>
        )}
      </form>
    </Modal>
  );
}
