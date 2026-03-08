"use client";

import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import AddressForm, { AddressFormData } from "./AddressForm";
import type { Database } from "@/lib/supabase/database.types";

type AddressRow =
  Database["public"]["Tables"]["user_delivery_addresses"]["Row"];

interface AddressPickerProps {
  addresses: AddressRow[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onAddAddress: (data: AddressFormData) => Promise<void>;
  className?: string;
}

export default function AddressPicker({
  addresses,
  selectedId,
  onSelect,
  onAddAddress,
  className = "",
}: AddressPickerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);
    try {
      await onAddAddress(data);
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#1e1414]">Delivery Address</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="text-[#7A2E2E]"
        >
          + Add New
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-[#fcfcfc] border border-dashed border-[#D2D2D2] rounded-xl p-8 text-center">
          <p className="text-[#806b6b] mb-4">
            No delivery addresses saved yet.
          </p>
          <Button variant="secondary" onClick={() => setIsAddModalOpen(true)}>
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => {
            const isSelected = address.id === selectedId;
            return (
              <div
                key={address.id}
                onClick={() => onSelect(address.id)}
                className={`
                  relative p-4 rounded-xl border cursor-pointer transition-all
                  ${
                    isSelected
                      ? "bg-[#7A2E2E]/5 border-[#7A2E2E] shadow-sm ring-1 ring-[#7A2E2E]"
                      : "bg-white border-[#f3f1f1] hover:border-[#D2D2D2]"
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 text-[#7A2E2E]">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                <div className="pr-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#1e1414]">
                      {address.label || "Address"}
                    </span>
                    {address.is_default && (
                      <span className="text-[10px] bg-[#f3f1f1] text-[#806b6b] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#806b6b] leading-relaxed">
                    {address.street_address}
                    {address.apartment && (
                      <>
                        <br />
                        {address.apartment}
                      </>
                    )}
                    <br />
                    {address.city} {address.postal_code}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !isSubmitting && setIsAddModalOpen(false)}
        title="Add Delivery Address"
      >
        <AddressForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
