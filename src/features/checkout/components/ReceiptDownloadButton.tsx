"use client";

import React, { useState } from "react";
import Button from "../../../components/ui/Button";

interface ReceiptDownloadButtonProps {
  orderId: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "social";
}

export default function ReceiptDownloadButton({
  orderId,
  className = "",
  variant = "secondary",
}: ReceiptDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Simulate API call to generate/fetch PDF
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, this would be a URL returned from the API or a blob trigger
      // const url = `/api/orders/${orderId}/receipt`;
      // window.open(url, '_blank');

      // TODO: Implement actual receipt download via API
    } catch (error) {
      console.error("Failed to download receipt:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleDownload}
      isLoading={isDownloading}
      className={className}
      aria-label={`Download receipt for order ${orderId}`}
    >
      {!isDownloading && (
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
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      )}
      {isDownloading ? "Generating..." : "Download Receipt"}
    </Button>
  );
}
