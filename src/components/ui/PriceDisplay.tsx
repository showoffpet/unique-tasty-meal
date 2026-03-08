import React from "react";

interface PriceDisplayProps {
  amount: number;
  currency?: "USD" | "NGN" | "EUR" | "GBP";
  className?: string;
  showDecimals?: boolean;
}

export default function PriceDisplay({
  amount,
  currency = "USD",
  className = "",
  showDecimals = true,
}: PriceDisplayProps) {
  // Assume amount is passed in cents if integer, or actual dollars.
  // Standard practice for Stripe/ecommerce is cents.
  // We'll treat amounts >= 100 as likely cents, except if explicit.
  // Let's assume the app uses standard decimal amounts (e.g. 12.99)

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return (
    <span className={`font-semibold tracking-tight ${className}`}>
      {formatter.format(amount)}
    </span>
  );
}
