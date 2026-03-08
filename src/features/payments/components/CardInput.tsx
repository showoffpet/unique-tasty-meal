"use client";

import React, { useState } from "react";
import Input from "../../../components/ui/Input";

interface CardInputProps {
  formData: {
    nameOnCard: string;
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    zipCode: string;
  };
  onChange: React.Dispatch<
    React.SetStateAction<{
      nameOnCard: string;
      cardNumber: string;
      expiryDate: string;
      cvc: string;
      zipCode: string;
      saveCard: boolean;
    }>
  >;
  errors?: Partial<Record<string, string>>;
}

export default function CardInput({
  formData,
  onChange,
  errors = {},
}: CardInputProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryParams = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 3) {
      return `${v.substring(0, 2)} / ${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryParams(value);
    } else if (name === "cvc") {
      formattedValue = value.replace(/[^0-9]/g, "").substring(0, 4);
    } else if (name === "zipCode") {
      formattedValue = value.replace(/[^0-9a-zA-Z-\s]/g, "").substring(0, 10);
    }

    onChange((prev) => ({ ...prev, [name]: formattedValue }));
  };

  return (
    <div className="space-y-4">
      <Input
        label="Name on Card"
        name="nameOnCard"
        value={formData.nameOnCard}
        onChange={handleInputChange}
        error={errors.nameOnCard}
        placeholder="Jane Doe"
        autoComplete="cc-name"
        onFocus={() => setFocusedField("nameOnCard")}
        onBlur={() => setFocusedField(null)}
      />

      <div className="relative">
        <Input
          label="Card Number"
          name="cardNumber"
          type="text"
          inputMode="numeric"
          value={formData.cardNumber}
          onChange={handleInputChange}
          error={errors.cardNumber}
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          autoComplete="cc-number"
          onFocus={() => setFocusedField("cardNumber")}
          onBlur={() => setFocusedField(null)}
          className={
            focusedField === "cardNumber" ? "ring-2 ring-[#7A2E2E]/20" : ""
          }
        />
        <div className="absolute right-3 top-[34px] pointer-events-none text-[#B3B3B3]">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Expiry"
          name="expiryDate"
          type="text"
          inputMode="numeric"
          value={formData.expiryDate}
          onChange={handleInputChange}
          error={errors.expiryDate}
          placeholder="MM / YY"
          maxLength={7}
          autoComplete="cc-exp"
        />
        <Input
          label="CVC"
          name="cvc"
          type="text"
          inputMode="numeric"
          value={formData.cvc}
          onChange={handleInputChange}
          error={errors.cvc}
          placeholder="123"
          maxLength={4}
          autoComplete="cc-csc"
        />
        <Input
          label="ZIP"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          error={errors.zipCode}
          placeholder="12345"
          autoComplete="postal-code"
        />
      </div>
    </div>
  );
}
