"use client";

import React, { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Toggle from "../../../components/ui/Toggle";
import Dropdown from "../../../components/ui/Dropdown";
import type { Database } from "@/lib/supabase/database.types";

type PromoRow = Database["public"]["Tables"]["promo_codes"]["Row"];

export interface PromoFormData {
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount: number | null;
  max_usages: number | null;
  expires_at: string;
  status: string;
}

interface PromoCodeFormProps {
  initialData?: Partial<PromoRow>;
  onSubmit: (data: PromoFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function PromoCodeForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  className = "",
}: PromoCodeFormProps) {
  const getDefaultExpiry = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState<PromoFormData>({
    code: initialData?.code || "",
    discount_type: initialData?.discount_type || "percentage",
    discount_value: initialData?.discount_value || 0,
    minimum_order_amount: initialData?.minimum_order_amount || null,
    max_usages: initialData?.max_usages || null,
    expires_at: initialData?.expires_at
      ? initialData.expires_at.split("T")[0]
      : getDefaultExpiry(),
    status: initialData?.status || "active",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PromoFormData, string>>
  >({});

  const validate = () => {
    const newErrors: Partial<Record<keyof PromoFormData, string>> = {};
    if (!formData.code.trim()) {
      newErrors.code = "Promo code is required";
    } else if (/\s/.test(formData.code)) {
      newErrors.code = "Code cannot contain spaces";
    }

    if (formData.discount_value <= 0) {
      newErrors.discount_value = "Discount must be greater than 0";
    } else if (
      formData.discount_type === "percentage" &&
      formData.discount_value > 100
    ) {
      newErrors.discount_value = "Percentage cannot exceed 100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit({
        ...formData,
        code: formData.code.toUpperCase().trim(),
        // Convert empty strings to null for optional numbers
        minimum_order_amount: formData.minimum_order_amount || null,
        expires_at: new Date(formData.expires_at).toISOString(),
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? 0
            : Number(value)
          : value.toUpperCase(),
    }));

    if (errors[name as keyof PromoFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="bg-white rounded-xl border border-[#f3f1f1] overflow-hidden">
        <div className="p-6 space-y-5">
          <Input
            label="Promo Code *"
            name="code"
            value={formData.code}
            onChange={handleChange}
            error={errors.code}
            placeholder="SUMMER2025"
            maxLength={20}
            required
            className="uppercase font-mono tracking-wider"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1e1414] mb-1.5">
                Discount Type *
              </label>
              <Dropdown
                value={formData.discount_type}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, discount_type: val }))
                }
                options={[
                  { value: "percentage", label: "Percentage (%)" },
                  { value: "fixed", label: "Fixed Amount ($)" },
                ]}
              />
            </div>
            <Input
              label="Discount Value *"
              name="discount_value"
              type="number"
              min="0"
              step={formData.discount_type === "percentage" ? "1" : "0.01"}
              value={formData.discount_value.toString() || ""}
              onChange={handleChange}
              error={errors.discount_value}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum Order Amount ($)"
              name="minimum_order_amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.minimum_order_amount?.toString() || ""}
              onChange={handleChange}
              placeholder="e.g. 50"
            />
            <Input
              label="Max Total Uses"
              name="max_usages"
              type="number"
              min="1"
              step="1"
              value={formData.max_usages?.toString() || ""}
              onChange={handleChange}
              placeholder="Leave empty for unlimited"
            />
          </div>

          <Input
            label="Expiration Date *"
            name="expires_at"
            type="date"
            value={formData.expires_at}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bg-[#fcfcfc] p-6 border-t border-[#f3f1f1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#1e1414]">Active Status</p>
              <p className="text-sm text-[#806b6b]">
                Enable or disable this code for customers
              </p>
            </div>
            <Toggle
              checked={formData.status === "active"}
              onChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  status: checked ? "active" : "inactive",
                }))
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
          Save Promo Code
        </Button>
      </div>
    </form>
  );
}
