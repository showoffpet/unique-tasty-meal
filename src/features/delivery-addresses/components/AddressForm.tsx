"use client";

import React, { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Toggle from "../../../components/ui/Toggle";
import type { Database } from "@/lib/supabase/database.types";

type AddressRow =
  Database["public"]["Tables"]["user_delivery_addresses"]["Row"];

export interface AddressFormData {
  label: string;
  street_address: string;
  apartment: string | null;
  city: string;
  postal_code: string;
  is_default: boolean;
  delivery_instructions: string | null;
}

interface AddressFormProps {
  initialData?: Partial<AddressRow>;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  className = "",
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    label: initialData?.label || "",
    street_address: initialData?.street_address || "",
    apartment: initialData?.apartment || "",
    city: initialData?.city || "",
    postal_code: initialData?.postal_code || "",
    is_default: initialData?.is_default || false,
    delivery_instructions: initialData?.delivery_instructions || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddressFormData, string>>
  >({});

  const validate = () => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};
    if (!formData.street_address.trim())
      newErrors.street_address = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postal_code.trim())
      newErrors.postal_code = "ZIP/Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof AddressFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="bg-white rounded-xl border border-[#f3f1f1] overflow-hidden">
        <div className="p-6 space-y-4">
          <Input
            label="Label (e.g. Home, Work)"
            name="label"
            value={formData.label || ""}
            onChange={handleChange}
            placeholder="Home"
          />

          <Input
            label="Street Address *"
            name="street_address"
            value={formData.street_address}
            onChange={handleChange}
            error={errors.street_address}
            placeholder="123 Main St"
            required
          />

          <Input
            label="Apt, Suite, Bldg (optional)"
            name="apartment"
            value={formData.apartment || ""}
            onChange={handleChange}
            placeholder="Apt 4B"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City *"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              required
            />
            <Input
              label="ZIP Code *"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              error={errors.postal_code}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e1414] mb-1.5">
              Delivery Instructions (Optional)
            </label>
            <textarea
              name="delivery_instructions"
              value={formData.delivery_instructions || ""}
              onChange={handleChange}
              placeholder="e.g. Leave at front door, gate code is 1234"
              rows={3}
              className="w-full rounded-lg border border-[#f3f1f1] p-3 text-sm focus:ring-2 focus:ring-[#7A2E2E]/40 focus:border-[#7A2E2E] outline-none"
            />
          </div>
        </div>

        <div className="bg-[#fcfcfc] p-6 border-t border-[#f3f1f1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#1e1414]">Make Default</p>
              <p className="text-sm text-[#806b6b]">
                Use this address for future orders
              </p>
            </div>
            <Toggle
              checked={formData.is_default || false}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_default: checked }))
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Save Address
        </Button>
      </div>
    </form>
  );
}
