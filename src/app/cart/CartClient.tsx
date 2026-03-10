"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import PriceDisplay from "@/components/ui/PriceDisplay";
import { useCartStore } from "@/store/cartStore";
import { getImageUrl } from "@/lib/images/cdn-client";

export default function CartClient() {
  const { items, updateQuantity, removeItem, cartTotal } = useCartStore();

  const subtotal = cartTotal();
  const taxes = subtotal * 0.0825; // Example 8.25%
  const total = subtotal + taxes;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-[#f3f1f1]">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-[#1e1414] mb-2">
          Your cart is empty
        </h2>
        <p className="text-[#806b6b] mb-8">
          Looks like you haven&apos;t added any meals yet.
        </p>
        <Link
          href="/menu"
          className="inline-block px-8 py-3 bg-[#7b2d2d] text-white font-bold rounded-xl hover:bg-[#561b1b] transition-colors"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Items List */}
      <div className="flex-1 flex flex-col gap-4">
        {items.map((item) => {
          const itemTotal =
            (item.base_price + item.price_modifier) * item.quantity;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#f3f1f1] flex flex-col sm:flex-row gap-6"
            >
              {/* Image */}
              <div className="w-full sm:w-32 aspect-square relative rounded-xl overflow-hidden bg-[#f8f6f6] shrink-0">
                <Image
                  src={
                    item.image_url?.startsWith("http")
                      ? item.image_url
                      : getImageUrl(item.image_url)
                  }
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="text-lg font-bold text-[#1e1414]">
                    {item.name}
                  </h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-[#806b6b] hover:text-[#C0392B] hover:bg-[#FCF0F0] rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="text-sm text-[#806b6b] space-y-1 mb-4 flex-1">
                  <p>
                    <span className="font-medium text-[#161313]">Portion:</span>{" "}
                    <span className="capitalize">
                      {item.customizations.portion}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-[#161313]">Spice:</span>{" "}
                    {item.customizations.spice_level > 0
                      ? Array.from({
                          length: item.customizations.spice_level,
                        }).map((_, i) => <span key={i}>🌶️</span>)
                      : "None"}
                  </p>

                  {item.customizations.add_ons &&
                    Object.keys(item.customizations.add_ons).length > 0 && (
                      <p>
                        <span className="font-medium text-[#161313]">
                          Add-ons:
                        </span>{" "}
                        {Object.keys(item.customizations.add_ons).join(", ")}
                      </p>
                    )}

                  {item.customizations.instructions && (
                    <p className="italic">
                      &quot;{item.customizations.instructions}&quot;
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#f8f6f6]">
                  {/* Quantity */}
                  <div className="flex items-center gap-3 bg-[#f8f6f6] rounded-full p-1 border border-[#f3f1f1]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-[#161313] hover:text-[#7b2d2d] transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-[#161313] hover:text-[#7b2d2d] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <PriceDisplay
                    amount={itemTotal}
                    className="text-lg font-black text-[#1e1414]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary Sidebar */}
      <div className="w-full lg:w-96 shrink-0 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3f1f1] sticky top-24">
          <h2 className="text-xl font-bold text-[#1e1414] mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm text-[#806b6b] mb-6">
            <div className="flex justify-between">
              <span>
                Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
              <span className="font-medium text-[#161313]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Taxes</span>
              <span className="font-medium text-[#161313]">
                ${taxes.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-medium text-[#161313]">
                Calculated at checkout
              </span>
            </div>
          </div>

          <div className="border-t border-[#f3f1f1] pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#161313]">Total</span>
              <PriceDisplay
                amount={total}
                className="text-2xl font-black text-[#1e1414]"
              />
            </div>
          </div>

          <Link href="/checkout" className="w-full relative group block">
            <div className="absolute inset-0 bg-[#7b2d2d] rounded-xl blur-[8px] opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <button className="relative w-full flex items-center justify-center gap-2 py-4 bg-[#7b2d2d] text-white rounded-xl font-bold hover:bg-[#561b1b] transition-colors">
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
          </Link>

          <p className="text-xs text-center text-[#999999] mt-4">
            Secure checkout powered by Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
