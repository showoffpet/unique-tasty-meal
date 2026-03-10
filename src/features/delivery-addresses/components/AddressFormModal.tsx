"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import AddressForm, { AddressFormData } from "./AddressForm";
import type { Database } from "@/lib/supabase/database.types";

type AddressRow =
  Database["public"]["Tables"]["user_delivery_addresses"]["Row"];

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<AddressRow>;
  onSubmit: (data: AddressFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function AddressFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading = false,
}: AddressFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? "Edit Delivery Address" : "Add Delivery Address"}
      maxWidth="max-w-xl"
    >
      <div className="p-1">
        <AddressForm
          initialData={initialData}
          onSubmit={async (data) => {
            await onSubmit(data);
          }}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
}
