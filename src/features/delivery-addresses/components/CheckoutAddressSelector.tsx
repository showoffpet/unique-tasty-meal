"use client";

import React, { useEffect, useState } from "react";
import { useAddressStore } from "@/store/addressStore";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import AddressFormModal from "./AddressFormModal";
import { AddressFormData } from "./AddressForm";
import { MapPin } from "lucide-react";
import toast from "react-hot-toast";
import type { Database } from "@/lib/supabase/database.types";

type AddressRow =
  Database["public"]["Tables"]["user_delivery_addresses"]["Row"];

interface CheckoutAddressSelectorProps {
  onAddressSelect?: (address: AddressRow | null) => void;
}

export default function CheckoutAddressSelector({
  onAddressSelect,
}: CheckoutAddressSelectorProps) {
  const { addresses, fetchAddresses, isLoading, addAddress } =
    useAddressStore();

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Determine the effective selected address (manual selection or default)
  const activeAddress =
    addresses.find((a) => a.id === selectedAddressId) ||
    addresses.find((a) => a.is_default) ||
    addresses[0];

  useEffect(() => {
    if (onAddressSelect) {
      onAddressSelect(activeAddress || null);
    }
  }, [activeAddress, onAddressSelect]);

  const handleSelect = (id: string) => {
    setSelectedAddressId(id);
    setIsPickerOpen(false);
  };

  const handleAddNew = async (data: AddressFormData) => {
    try {
      await addAddress(data as any);
      toast.success("Address added and selected");
      setIsAddFormOpen(false);
      setIsPickerOpen(false);
    } catch {
      toast.error("Failed to add address");
    }
  };

  if (isLoading && addresses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3f1f1] animate-pulse">
        <div className="h-6 bg-[#f3f1f1] rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-[#f3f1f1] rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-[#f3f1f1] rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3f1f1]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1e1414] flex items-center gap-2">
            <MapPin size={20} className="text-[#7b2d2d]" />
            Delivery Address
          </h2>
          {addresses.length > 0 && (
            <button
              onClick={() => setIsPickerOpen(true)}
              className="text-sm font-semibold text-[#7b2d2d] hover:text-[#561b1b] transition-colors"
            >
              Change
            </button>
          )}
        </div>

        {activeAddress ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-[#1e1414]">
                {activeAddress.label || "Address"}
              </span>
              {activeAddress.is_default && (
                <span className="text-[10px] bg-[#f3f1f1] text-[#806b6b] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                  Default
                </span>
              )}
            </div>
            <p className="text-[#806b6b] leading-relaxed mb-2">
              {activeAddress.street_address}
              {activeAddress.apartment ? `, ${activeAddress.apartment}` : ""}
              <br />
              {activeAddress.city} {activeAddress.postal_code}
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-[#806b6b] mb-4">No address selected.</p>
            <Button
              onClick={() => setIsAddFormOpen(true)}
              variant="secondary"
              className="w-full"
            >
              Add Delivery Address
            </Button>
          </div>
        )}
      </div>

      {/* Address Picker Modal */}
      <Modal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        title="Select Delivery Address"
        maxWidth="2xl"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => handleSelect(address.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${activeAddress?.id === address.id ? "border-[#7b2d2d] bg-[#7b2d2d]/5 ring-1 ring-[#7b2d2d]" : "border-[#f3f1f1] hover:border-[#D2D2D2]"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#1e1414]">
                      {address.label || "Address"}
                    </span>
                  </div>
                  <p className="text-[#806b6b] text-sm">
                    {address.street_address}
                    {address.apartment ? `, ${address.apartment}` : ""},{" "}
                    {address.city} {address.postal_code}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="secondary"
            className="w-full mt-4"
            onClick={() => {
              setIsPickerOpen(false);
              setIsAddFormOpen(true);
            }}
          >
            Add New Address
          </Button>
        </div>
      </Modal>

      {/* Add New Address Modal */}
      <AddressFormModal
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddNew}
        isLoading={isLoading}
      />
    </>
  );
}
