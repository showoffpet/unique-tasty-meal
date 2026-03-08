import React from "react";

type PaymentStatus =
  | "succeeded"
  | "pending"
  | "failed"
  | "refunded"
  | "processing";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export default function PaymentStatusBadge({
  status,
  className = "",
}: PaymentStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "succeeded":
        return "bg-[#2E7D32]/10 text-[#2E7D32]";
      case "failed":
        return "bg-[#7b2d2d]/10 text-[#7b2d2d]";
      case "pending":
      case "processing":
        return "bg-[#F79E1B]/10 text-[#F79E1B]";
      case "refunded":
        return "bg-[#f3f1f1] text-[#806b6b]";
      default:
        return "bg-[#f3f1f1] text-[#806b6b]";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "succeeded":
        return "Paid";
      case "failed":
        return "Failed";
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "refunded":
        return "Refunded";
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyles()} ${className}`}
    >
      {getStatusLabel()}
    </span>
  );
}
