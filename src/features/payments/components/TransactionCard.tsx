import React from "react";
import PriceDisplay from "@/components/ui/PriceDisplay";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface Transaction {
  id: string; // Internal ID
  stripePaymentIntentId?: string; // e.g. pi_12345
  amount: number; // In cents
  status: "succeeded" | "pending" | "failed" | "refunded" | "processing";
  createdAt: string;
  paymentMethodDetails?: {
    brand?: string;
    last4?: string;
  };
  errorMessage?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  className?: string;
}

export default function TransactionCard({
  transaction,
  className = "",
}: TransactionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isFailed = transaction.status === "failed";
  const isRefunded = transaction.status === "refunded";

  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-[#D2D2D2] ${className}`}
    >
      <div className="flex items-start sm:items-center gap-4">
        {/* Status Icon */}
        <div
          className={`
          w-10 h-10 rounded-full flex items-center justify-center shrink-0
          ${
            transaction.status === "succeeded"
              ? "bg-[#2E7D32]/10 text-[#2E7D32]"
              : isFailed
                ? "bg-[#7b2d2d]/10 text-[#7b2d2d]"
                : isRefunded
                  ? "bg-[#999999]/10 text-[#806b6b]"
                  : "bg-[#F79E1B]/10 text-[#F79E1B]"
          }
        `}
        >
          {transaction.status === "succeeded" && (
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {isFailed && (
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          {isRefunded && (
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
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          )}
          {(transaction.status === "pending" ||
            transaction.status === "processing") && (
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[#1e1414]">
              {transaction.paymentMethodDetails?.brand
                ? `${transaction.paymentMethodDetails.brand.toUpperCase()} •••• ${transaction.paymentMethodDetails.last4}`
                : "Payment"}
            </span>
            <PaymentStatusBadge status={transaction.status} />
          </div>
          <p className="text-sm text-[#806b6b]">
            {formatDate(transaction.createdAt)}
          </p>
          {isFailed && transaction.errorMessage && (
            <p className="text-xs text-[#7b2d2d] mt-1 line-clamp-1">
              {transaction.errorMessage}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0 pl-14 sm:pl-0">
        <PriceDisplay
          amount={transaction.amount / 100} // Convert cents to dollars
          className={`font-semibold ${isRefunded ? "text-[#999999] line-through" : "text-[#1e1414]"}`}
        />
        {transaction.stripePaymentIntentId && (
          <span className="text-[10px] text-[#999999] font-mono mt-1">
            {transaction.stripePaymentIntentId.split("_")[1] ||
              transaction.stripePaymentIntentId}
          </span>
        )}
      </div>
    </div>
  );
}
