import React from "react";
import PriceDisplay from "../../../components/ui/PriceDisplay";

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount?: number;
  total: number;
  itemCount: number;
  className?: string;
  isConfirmed?: boolean;
}

export default function OrderSummary({
  subtotal,
  deliveryFee,
  tax,
  discount = 0,
  total,
  itemCount,
  className = "",
  isConfirmed = false,
}: OrderSummaryProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] p-6 ${className}`}
    >
      <h3 className="font-semibold text-lg text-[#1e1414] mb-6">
        {isConfirmed ? "Order Summary" : "Order Total"}
        <span className="text-sm font-normal text-[#806b6b] ml-2 font-mono">
          ({itemCount} {itemCount === 1 ? "item" : "items"})
        </span>
      </h3>

      <div className="space-y-4 mb-6 text-sm">
        <div className="flex justify-between items-center text-[#806b6b]">
          <span>Subtotal</span>
          <PriceDisplay
            amount={subtotal}
            className="text-[#1e1414] font-medium"
          />
        </div>

        <div className="flex justify-between items-center text-[#806b6b]">
          <span>Delivery Fee</span>
          {deliveryFee === 0 ? (
            <span className="text-[#2E7D32] font-semibold uppercase tracking-wide text-xs">
              Free
            </span>
          ) : (
            <PriceDisplay
              amount={deliveryFee}
              className="text-[#1e1414] font-medium"
            />
          )}
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-[#2E7D32]">
            <span className="flex items-center gap-1.5">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Discount Applied
            </span>
            <span>
              -<PriceDisplay amount={discount} className="inline-block" />
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-[#806b6b]">
          <span>Estimated Tax</span>
          <PriceDisplay amount={tax} className="text-[#1e1414] font-medium" />
        </div>
      </div>

      <div className="border-t border-[#f3f1f1] pt-4 flex justify-between items-center">
        <span className="font-bold text-[#1e1414] text-lg">Total</span>
        <PriceDisplay
          amount={total}
          className="font-bold text-2xl text-[#7A2E2E]"
        />
      </div>
    </div>
  );
}
