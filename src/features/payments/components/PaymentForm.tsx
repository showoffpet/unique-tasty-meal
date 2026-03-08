"use client";

import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import CardInput from "./CardInput";

interface PaymentFormData {
  nameOnCard: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  zipCode: string;
  saveCard: boolean;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  amount: number;
  className?: string;
}

export default function PaymentForm({
  onSubmit,
  onCancel,
  isLoading = false,
  amount,
  className = "",
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    zipCode: "",
    saveCard: true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PaymentFormData, string>>
  >({});

  const validate = () => {
    const newErrors: Partial<Record<keyof PaymentFormData, string>> = {};
    if (!formData.nameOnCard.trim()) newErrors.nameOnCard = "Name is required";
    if (formData.cardNumber.replace(/\s/g, "").length < 15)
      newErrors.cardNumber = "Invalid card number";
    if (formData.expiryDate.replace(/\s|\//g, "").length < 4)
      newErrors.expiryDate = "Invalid expiry date";
    if (formData.cvc.length < 3) newErrors.cvc = "Invalid CVC";
    if (formData.zipCode.length < 5) newErrors.zipCode = "Invalid ZIP code";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="bg-white rounded-xl border border-[#f3f1f1] overflow-hidden">
        {/* Payment Network Header */}
        <div className="bg-[#fcfcfc] p-4 text-center border-b border-[#f3f1f1] flex justify-center gap-2">
          <div className="flex gap-2 opacity-60">
            {/* Visa */}
            <div className="w-10 h-6 bg-white border border-[#f3f1f1] rounded flex items-center justify-center text-[10px] font-bold italic text-[#1434CB]">
              VISA
            </div>
            {/* MC */}
            <div className="w-10 h-6 bg-white border border-[#f3f1f1] rounded flex items-center justify-center">
              <div className="relative w-5 h-3">
                <div className="absolute left-0 w-3 h-3 bg-[#EB001B] rounded-full opacity-80 mix-blend-multiply"></div>
                <div className="absolute right-0 w-3 h-3 bg-[#F79E1B] rounded-full opacity-80 mix-blend-multiply"></div>
              </div>
            </div>
            {/* Amex */}
            <div className="w-10 h-6 bg-white border border-[#f3f1f1] rounded flex items-center justify-center text-[8px] font-bold bg-[#2671B9] text-white">
              Amex
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <CardInput
            formData={formData}
            onChange={setFormData}
            errors={errors}
          />
        </div>

        <div className="bg-[#fcfcfc] p-4 border-t border-[#f3f1f1]">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={formData.saveCard}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    saveCard: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-[#7A2E2E] border-[#D2D2D2] rounded focus:ring-[#7A2E2E]"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1e1414] group-hover:text-[#7A2E2E] transition-colors">
                Save card for future purchases
              </p>
              <p className="text-xs text-[#806b6b] mt-0.5">
                Securely encrypted via Stripe. UTM does not store your full card
                details.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            className="w-1/3"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          className="flex-1 text-base font-bold shadow-md shadow-[#7A2E2E]/20"
          isLoading={isLoading}
        >
          Pay ${(amount / 100).toFixed(2)}
        </Button>
      </div>

      <p className="text-center text-xs text-[#999999] flex items-center justify-center gap-1.5">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        Payments are secure and encrypted
      </p>
    </form>
  );
}
