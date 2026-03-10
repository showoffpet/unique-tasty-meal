"use client";

import React, { useEffect, useState } from "react";
import { useAddressStore } from "@/store/addressStore";
import AddressCard from "@/features/delivery-addresses/components/AddressCard";
import AddressFormModal from "@/features/delivery-addresses/components/AddressFormModal";
import Button from "@/components/ui/Button";
import { Search, Plus, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import type { Database } from "@/lib/supabase/database.types";

type AddressRow =
  Database["public"]["Tables"]["user_delivery_addresses"]["Row"];

export default function DeliveryAddressManagementPage() {
  const {
    addresses,
    fetchAddresses,
    isLoading,
    deleteAddress,
    setDefaultAddress,
    addAddress,
    updateAddress,
  } = useAddressStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressRow | undefined>(
    undefined,
  );

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const filteredAddresses = addresses.filter((addr) => {
    const query = searchQuery.toLowerCase();
    return (
      (addr.label || "").toLowerCase().includes(query) ||
      (addr.street_address || "").toLowerCase().includes(query) ||
      (addr.city || "").toLowerCase().includes(query)
    );
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(id);
        toast.success("Address deleted successfully");
      } catch {
        toast.error("Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      toast.success("Default address updated");
    } catch {
      toast.error("Failed to update default address");
    }
  };

  const handleEdit = (address: AddressRow) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingAddress(undefined);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        apartment: data.apartment || null,
        delivery_instructions: data.delivery_instructions || null,
      };

      if (editingAddress?.id) {
        await updateAddress(editingAddress.id, formattedData);
        toast.success("Address updated successfully");
      } else {
        await addAddress(formattedData);
        toast.success("Address added successfully");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e1414] mb-2">
            Delivery Addresses
          </h1>
          <p className="text-sm text-[#999999]">
            Manage your saved addresses and delivery preferences.
          </p>
        </div>
        <Button
          onClick={handleOpenNew}
          className="shrink-0 flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Address
        </Button>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#B3B3B3]" />
        </div>
        <input
          type="text"
          placeholder="Search by label, street, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D2D2D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#7A2E2E]/40 focus:border-[#7A2E2E] transition-all bg-white"
        />
      </div>

      {isLoading && addresses.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-xl border border-[#f3f1f1] h-32"
            />
          ))}
        </div>
      ) : filteredAddresses.length > 0 ? (
        <div className="space-y-4">
          {filteredAddresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-[#f3f1f1] px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fcfcfc] border border-[#f3f1f1] mb-4 text-[#806b6b]">
            <MapPin size={24} />
          </div>
          <h3 className="text-lg font-semibold text-[#1e1414] mb-2">
            No addresses found
          </h3>
          <p className="text-[#806b6b] mb-6 max-w-sm mx-auto">
            {searchQuery
              ? "Try adjusting your search terms."
              : "You haven't saved any delivery addresses yet. Add one to get started."}
          </p>
          {!searchQuery && (
            <Button
              onClick={handleOpenNew}
              variant="secondary"
              className="gap-2"
            >
              <Plus size={16} /> Add Address
            </Button>
          )}
        </div>
      )}

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingAddress}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
