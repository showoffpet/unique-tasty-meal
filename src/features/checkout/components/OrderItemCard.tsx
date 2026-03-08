import React from "react";
import Image from "next/image";
import PriceDisplay from "../../../components/ui/PriceDisplay";

interface OrderItem {
  id: string; // Order item ID
  mealId: string;
  name: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  customizationDetails?: string;
}

interface OrderItemCardProps {
  item: OrderItem;
  className?: string;
  compact?: boolean;
}

export default function OrderItemCard({
  item,
  className = "",
  compact = false,
}: OrderItemCardProps) {
  const totalPrice = item.unitPrice * item.quantity;
  const imageSize = compact ? "w-12 h-12" : "w-16 h-16 sm:w-20 sm:h-20";

  return (
    <div
      className={`flex items-start gap-4 py-3 border-b border-[#f3f1f1] last:border-0 ${className}`}
    >
      {/* Image */}
      <div
        className={`relative ${imageSize} rounded-md overflow-hidden bg-[#f3f1f1] shrink-0 border border-[#f3f1f1]`}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-[#B3B3B3]">
            <svg
              className={compact ? "w-5 h-5" : "w-8 h-8"}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4
            className={`font-semibold text-[#1e1414] ${compact ? "text-sm" : "text-base"}`}
          >
            {item.quantity}x {item.name}
          </h4>
          <PriceDisplay
            amount={totalPrice}
            className={`font-medium text-[#1e1414] ${compact ? "text-sm" : "text-base"}`}
          />
        </div>

        {item.customizationDetails && (
          <p
            className={`text-[#806b6b] line-clamp-2 mt-0.5 ${compact ? "text-[10px]" : "text-xs"}`}
          >
            {item.customizationDetails}
          </p>
        )}
      </div>
    </div>
  );
}
