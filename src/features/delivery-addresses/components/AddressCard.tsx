"use client";

import React from "react";
import Button from "../../../components/ui/Button";
import type { Database } from "@/lib/supabase/database.types";

type AddressRow =
  Database["public"]["Tables"]["user_delivery_addresses"]["Row"];

interface AddressCardProps {
  address: AddressRow;
  onEdit?: (address: AddressRow) => void;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
  className?: string;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  className = "",
}: AddressCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-[#f3f1f1] p-4 relative group hover:shadow-md transition-shadow ${className}`}
    >
      {address.is_default && (
        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide bg-[#f3f1f1] text-[#806b6b] px-2 py-1 rounded">
          Default
        </span>
      )}

      <div className="mb-4 pr-16">
        <h3 className="font-semibold text-[#1e1414] mb-1">
          {address.label || "Address"}
        </h3>
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
        {address.delivery_instructions && (
          <p className="text-sm text-[#999999] mt-2 italic">
            &ldquo;{address.delivery_instructions}&rdquo;
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#f3f1f1]">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(address)}
            className="text-[#806b6b] hover:text-[#1e1414]"
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(address.id)}
            className="text-[#999999] hover:text-[#7b2d2d]"
          >
            Delete
          </Button>
        )}
        {!address.is_default && onSetDefault && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSetDefault(address.id)}
            className="ml-auto bg-white border-[#f3f1f1]"
          >
            Set as Default
          </Button>
        )}
      </div>
    </div>
  );
}
