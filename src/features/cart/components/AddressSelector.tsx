"use client";

import React, { useState } from "react";
import Button from "../../../components/ui/Button";

interface Address {
  id: string;
  label: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

interface AddressSelectorProps {
  addresses: Address[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onAddNew?: () => void;
  className?: string;
}

export default function AddressSelector({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  className = "",
}: AddressSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedAddress =
    addresses.find((a) => a.id === selectedId) ||
    addresses.find((a) => a.isDefault) ||
    addresses[0];

  if (addresses.length === 0) {
    return (
      <div
        className={`bg-[#fcfcfc] border border-dashed border-[#D2D2D2] rounded-xl p-6 text-center ${className}`}
      >
        <p className="text-[#806b6b] mb-4">No delivery addresses saved yet.</p>
        {onAddNew && (
          <Button variant="secondary" onClick={onAddNew}>
            Add Delivery Address
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <h3 className="text-[#1e1414] font-semibold mb-3">Delivery Address</h3>

      {/* Selected State (Button) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-start justify-between p-4 rounded-xl border text-left transition-colors bg-white
          ${isOpen ? "border-[#7A2E2E] ring-1 ring-[#7A2E2E]" : "border-[#f3f1f1] hover:border-[#D2D2D2]"}
        `}
      >
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-[#7A2E2E] mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1e1414]">
                {selectedAddress?.label || "Selected Address"}
              </span>
              {selectedAddress?.isDefault && (
                <span className="text-[10px] font-bold uppercase tracking-wide bg-[#f3f1f1] text-[#806b6b] px-1.5 py-0.5 rounded">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-[#806b6b] mt-0.5 truncate">
              {selectedAddress?.street1}, {selectedAddress?.city}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-[#999999] transition-transform ${isOpen ? "rotate-180 text-[#7A2E2E]" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl border border-[#f3f1f1] shadow-lg overflow-hidden flex flex-col max-h-[300px]">
            <div className="overflow-y-auto w-full p-2 space-y-1">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => {
                    onSelect(address.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex justify-between items-start text-left p-3 rounded-lg hover:bg-[#fcfcfc] transition-colors
                    ${address.id === selectedId ? "bg-[#fcfcfc]" : ""}
                  `}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#1e1414]">
                        {address.label}
                      </span>
                      {address.isDefault && (
                        <span className="text-[10px] bg-[#f3f1f1] text-[#806b6b] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#806b6b] mt-0.5">
                      {address.street1}
                      {address.street2 ? `, ${address.street2}` : ""},{" "}
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                  </div>
                  {address.id === selectedId && (
                    <svg
                      className="w-5 h-5 text-[#7A2E2E]"
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
                  )}
                </button>
              ))}
            </div>

            {onAddNew && (
              <div className="p-2 border-t border-[#f3f1f1] bg-[#fcfcfc]">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onAddNew();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-semibold text-[#7A2E2E] hover:bg-[#7A2E2E]/10 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Address
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
