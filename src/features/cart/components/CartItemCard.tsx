import React from "react";
import Image from "next/image";
import CartQuantityControl from "./CartQuantityControl";
import PriceDisplay from "../../../components/ui/PriceDisplay";

interface CartItem {
  id: string; // Cart item unique ID
  mealId: string;
  name: string;
  imageUrl?: string;
  unitPrice: number; // Base + modifiers
  quantity: number;
  customizationDetails?: string;
}

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export default function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
  className = "",
}: CartItemCardProps) {
  const totalPrice = item.unitPrice * item.quantity;

  return (
    <div
      className={`flex items-start gap-4 py-4 px-1 border-b border-[#f3f1f1] bg-white last:border-0 group ${className}`}
    >
      {/* Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-[#f3f1f1] shrink-0 border border-[#f3f1f1]">
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
              className="w-8 h-8"
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
      <div className="flex-1 min-w-0 flex flex-col h-full">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-[#1e1414] truncate pr-2">
            {item.name}
          </h3>
          <button
            onClick={() => onRemove(item.id)}
            className="text-[#999999] hover:text-[#7b2d2d] hover:bg-[#f3f1f1] p-1.5 rounded-full transition-colors flex-shrink-0"
            aria-label={`Remove ${item.name} from cart`}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {item.customizationDetails && (
          <p className="text-sm text-[#806b6b] line-clamp-2 mt-0.5">
            {item.customizationDetails}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between">
          <CartQuantityControl
            quantity={item.quantity}
            onChange={(qty) => onUpdateQuantity(item.id, qty)}
            size="sm"
          />
          <PriceDisplay
            amount={totalPrice}
            className="font-bold text-[#1e1414]"
          />
        </div>
      </div>
    </div>
  );
}
