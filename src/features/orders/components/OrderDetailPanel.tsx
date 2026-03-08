"use client";

import React from "react";
import type { Database } from "@/lib/supabase/database.types";
import PriceDisplay from "../../../components/ui/PriceDisplay";
import OrderStatusTimeline, { OrderStatus } from "./OrderStatusTimeline";
import Button from "../../../components/ui/Button";
import type { OrderItemJson, OrderDeliveryAddressJson } from "../types";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

interface OrderDetailPanelProps {
  order: OrderRow;
  onClose?: () => void;
  onReorder?: (items: OrderItemJson[]) => void;
  className?: string;
}

export default function OrderDetailPanel({
  order,
  onClose,
  onReorder,
  className = "",
}: OrderDetailPanelProps) {
  const items: OrderItemJson[] = Array.isArray(order.items)
    ? (order.items as unknown as OrderItemJson[])
    : [];
  const address: OrderDeliveryAddressJson | null =
    typeof order.delivery_address === "object" &&
    order.delivery_address !== null
      ? (order.delivery_address as unknown as OrderDeliveryAddressJson)
      : null;

  return (
    <div
      className={`bg-white md:rounded-xl md:border border-[#f3f1f1] overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-[#f3f1f1] bg-[#fcfcfc] flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-[#1e1414]">
            Order #{order.id.split("-")[0].toUpperCase()}
          </h2>
          <p className="text-sm text-[#806b6b] mt-1">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-[#999999] hover:text-[#1e1414] transition-colors bg-white rounded-full shadow-sm border border-[#f3f1f1]"
          >
            <svg
              className="w-5 h-5"
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
        )}
      </div>

      {/* Timeline */}
      <div className="p-6 border-b border-[#f3f1f1]">
        <OrderStatusTimeline
          currentStatus={order.order_status as OrderStatus}
          createdAt={order.created_at}
          deliveredAt={order.delivered_at || undefined}
          cancelledAt={order.cancelled_at || undefined}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Items List */}
        <div className="md:col-span-2 p-6 border-b md:border-b-0 md:border-r border-[#f3f1f1]">
          <h3 className="font-semibold text-[#1e1414] mb-4">Order Items</h3>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-16 h-16 bg-[#f3f1f1] rounded-lg shrink-0 overflow-hidden">
                  {/* Placeholder for item image */}
                  <div className="w-full h-full bg-[#f3f1f1]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-[#1e1414]">
                      {item.quantity}x {item.meal_name || "Custom Item"}
                    </h4>
                    <PriceDisplay
                      amount={(item.item_price ?? 0) * (item.quantity || 1)}
                      className="font-medium text-[#1e1414]"
                    />
                  </div>
                  {/* Options / Customizations */}
                  {(item.options || item.add_ons) && (
                    <div className="text-sm text-[#806b6b] mt-1 space-y-0.5">
                      {item.options?.spice_level && (
                        <p>Spice: {item.options.spice_level}</p>
                      )}
                      {item.add_ons?.map((addon, i) => (
                        <p key={i}>+ {addon.name}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {onReorder && (
            <div className="mt-8 pt-6 border-t border-[#f3f1f1]">
              <Button
                variant="secondary"
                onClick={() => onReorder(items)}
                className="w-full sm:w-auto"
              >
                Reorder These Items
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="p-6 bg-[#fcfcfc] space-y-8">
          {/* Delivery Details */}
          <div>
            <h3 className="font-semibold text-[#1e1414] mb-3 text-sm uppercase tracking-wider">
              Delivery Details
            </h3>
            {address ? (
              <div className="text-sm text-[#806b6b] leading-relaxed">
                <p>{address.street_address}</p>
                {address.apartment && <p>{address.apartment}</p>}
                <p>
                  {address.city} {address.postal_code}
                </p>
                {address.delivery_instructions && (
                  <p className="mt-2 text-[#999999] italic">
                    "{address.delivery_instructions}"
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#999999] italic">
                No delivery address provided.
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="font-semibold text-[#1e1414] mb-3 text-sm uppercase tracking-wider">
              Payment Method
            </h3>
            <div className="text-sm text-[#806b6b] flex items-center gap-2">
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
              <span>{order.payment_method || "Credit Card"}</span>
            </div>
          </div>

          {/* Cost Summary */}
          <div>
            <h3 className="font-semibold text-[#1e1414] mb-3 text-sm uppercase tracking-wider">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#806b6b]">
                <span>Subtotal</span>
                <PriceDisplay amount={order.subtotal} />
              </div>
              <div className="flex justify-between text-[#806b6b]">
                <span>Delivery</span>
                <PriceDisplay amount={order.delivery_fee} />
              </div>
              {order.discount_amount && order.discount_amount > 0 ? (
                <div className="flex justify-between text-[#2E7D32]">
                  <span>Discount</span>
                  <span>
                    -
                    <PriceDisplay
                      amount={order.discount_amount}
                      className="inline-block"
                    />
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between text-[#806b6b]">
                <span>Tax</span>
                <PriceDisplay amount={order.tax_amount} />
              </div>
              <div className="flex justify-between font-bold text-[#1e1414] pt-3 border-t border-[#f3f1f1] mt-2 text-base">
                <span>Total</span>
                <PriceDisplay amount={order.total} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
