"use client";

import React from "react";
import Button from "../../../components/ui/Button";
import type { Database } from "@/lib/supabase/database.types";

type PromoRow = Database["public"]["Tables"]["promo_codes"]["Row"];

interface PromoCodeCardProps {
  promo: PromoRow;
  onEdit?: (promo: PromoRow) => void;
  onDelete?: (id: string) => void;
  className?: string;
  adminView?: boolean;
}

export default function PromoCodeCard({
  promo,
  onEdit,
  onDelete,
  className = "",
  adminView = false,
}: PromoCodeCardProps) {
  const isExpired = new Date(promo.expires_at) < new Date();
  const isActive =
    promo.status === "active" &&
    !isExpired &&
    (promo.max_usages === null || promo.usage_count < promo.max_usages);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`bg-white rounded-xl border p-5 relative group transition-colors ${
        !isActive
          ? "border-[#f3f1f1] opacity-75"
          : "border-[#f3f1f1] hover:border-[#D2D2D2]"
      } ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`font-bold text-lg tracking-wider uppercase px-2 py-0.5 rounded-md ${
              isActive
                ? "bg-[#7A2E2E]/10 text-[#7A2E2E]"
                : "bg-[#f3f1f1] text-[#806b6b]"
            }`}
          >
            {promo.code}
          </span>
          {adminView && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                isActive
                  ? "bg-[#2E7D32]/10 text-[#2E7D32]"
                  : "bg-[#7b2d2d]/10 text-[#7b2d2d]"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          )}
        </div>

        {adminView && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit(promo)}
                className="p-1 text-[#999999] hover:text-[#1e1414] transition-colors"
                aria-label="Edit promo code"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(promo.id)}
                className="p-1 text-[#999999] hover:text-[#7b2d2d] transition-colors"
                aria-label="Delete promo code"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1 mb-4">
        <p className="font-medium text-[#1e1414]">
          {promo.discount_type === "percentage"
            ? `${promo.discount_value}% OFF`
            : `$${promo.discount_value} OFF`}
          {promo.minimum_order_amount &&
            promo.minimum_order_amount > 0 &&
            ` on orders over $${promo.minimum_order_amount}`}
        </p>
        <p className="text-sm text-[#806b6b]">
          Expires: {formatDate(promo.expires_at)}
        </p>
      </div>

      {adminView && (
        <div className="flex items-center justify-between text-xs text-[#999999] pt-3 border-t border-[#f3f1f1]">
          <span>
            Uses: {promo.usage_count}{" "}
            {promo.max_usages ? `/ ${promo.max_usages}` : "(Unlimited)"}
          </span>
        </div>
      )}

      {!adminView && isActive && (
        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-center bg-white border-[#f3f1f1] hover:bg-[#fcfcfc]"
          onClick={() => {
            navigator.clipboard.writeText(promo.code);
            // Optionally could emit an event here to show a toast message
          }}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy Code
        </Button>
      )}
    </div>
  );
}
