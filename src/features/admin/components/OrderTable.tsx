"use client";

import React from "react";
import PriceDisplay from "../../../components/ui/PriceDisplay";
import Badge from "../../../components/ui/Badge";
import StatusUpdateDropdown from "./StatusUpdateDropdown";

export interface OrderItem {
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
}

export interface OrderRow {
  id: string;
  created_at: string;
  order_status: string;
  total: number;
  items: OrderItem[];
  user_id: string;
}

interface OrderTableProps {
  orders: OrderRow[];
  onViewDetails: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, newStatus: string) => Promise<void>;
  selectedIds?: string[];
  onToggleSelect?: (orderId: string) => void;
  onToggleSelectAll?: (allIds: string[]) => void;
  isLoading?: boolean;
  className?: string;
}

export default function OrderTable({
  orders,
  onViewDetails,
  onUpdateStatus,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  isLoading = false,
  className = "",
}: OrderTableProps) {
  const allSelected = orders.length > 0 && selectedIds.length === orders.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onToggleSelectAll) {
      if (e.target.checked) {
        onToggleSelectAll(orders.map((o) => o.id));
      } else {
        onToggleSelectAll([]);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "cancelled":
        return (
          <Badge variant="error" dot>
            Cancelled
          </Badge>
        );
      case "out_for_delivery":
        return <Badge variant="primary">En Route</Badge>;
      case "preparing":
        return <Badge variant="warning">Prep</Badge>;
      case "confirmed":
        return <Badge variant="warning">Confirmed</Badge>;
      case "pending":
        return (
          <Badge variant="error" dot>
            New
          </Badge>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div
        className={`overflow-x-auto bg-white border border-[#f3f1f1] rounded-xl ${className}`}
      >
        <table className="w-full text-left bg-white whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#f3f1f1] bg-[#fcfcfc]">
              <th className="p-4 w-12 text-[#999999]">Loading...</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-[#f3f1f1]">
                <td className="p-4" colSpan={7}>
                  <div className="h-4 bg-[#f3f1f1] rounded-md animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div
      className={`overflow-x-auto bg-white border border-[#f3f1f1] rounded-xl shadow-sm ${className}`}
    >
      <table className="w-full text-left bg-white whitespace-nowrap">
        <thead>
          <tr className="border-b border-[#f3f1f1] bg-[#fcfcfc] text-xs font-semibold uppercase tracking-wider text-[#806b6b]">
            {onToggleSelect && (
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="rounded border-[#D2D2D2] text-[#7A2E2E] focus:ring-[#7A2E2E]"
                />
              </th>
            )}
            <th className="p-4">Order ID</th>
            <th className="p-4">Date</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Total</th>
            <th className="p-4 w-44">Status</th>
            <th className="p-4 w-16"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f3f1f1] text-sm">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-[#999999]">
                No orders found matching the current criteria.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : [];
              const itemCount = items.reduce(
                (sum: number, i: OrderItem) => sum + (i.quantity || 1),
                0,
              );
              const isSelected = selectedIds.includes(order.id);

              return (
                <tr
                  key={order.id}
                  className={`hover:bg-[#fcfcfc] transition-colors ${isSelected ? "bg-[#fcfcfc]" : ""}`}
                >
                  {onToggleSelect && (
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(order.id)}
                        className="rounded border-[#D2D2D2] text-[#7A2E2E] focus:ring-[#7A2E2E]"
                      />
                    </td>
                  )}
                  <td className="p-4 font-mono text-xs font-bold text-[#1e1414]">
                    #{order.id.split("-")[0].toUpperCase()}
                  </td>
                  <td className="p-4 text-[#806b6b]">
                    {new Date(order.created_at).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-4 text-[#1e1414]">
                    {/* Placeholder for customer name if resolved, else user_id start */}
                    {order.user_id.substring(0, 8)}...
                  </td>
                  <td className="p-4 font-semibold text-[#1e1414]">
                    <PriceDisplay amount={order.total} />
                    <span className="text-[#999999] text-xs font-normal ml-2">
                      ({itemCount} items)
                    </span>
                  </td>
                  <td className="p-4">
                    {onUpdateStatus ? (
                      <StatusUpdateDropdown
                        currentStatus={order.order_status}
                        onUpdate={(v) => onUpdateStatus(order.id, v)}
                      />
                    ) : (
                      getStatusBadge(order.order_status)
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onViewDetails(order.id)}
                      className="text-[#999999] hover:text-[#1e1414] transition-colors p-1"
                      title="View Details"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
