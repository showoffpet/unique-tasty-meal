"use client";

import React, { useState } from "react";
import OrderDetailPanel from "@/features/orders/components/OrderDetailPanel";
import Button from "@/components/ui/Button";
import ContactSupportModal from "@/features/orders/components/ContactSupportModal";
import type { Database } from "@/lib/supabase/database.types";
import { Download, MessageCircle, RefreshCw } from "lucide-react";
import { generateReceiptPDF } from "@/features/orders/utils/receipt";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

interface OrderDetailClientProps {
  order: OrderRow;
}

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleReorder = () => {
    // Navigate to reorder API endpoint which will populate cart
    window.location.href = `/reorder?orderId=${order.id}`;
  };

  const handleDownloadReceipt = async () => {
    setIsGeneratingPdf(true);
    try {
      // Small timeout so the loading spinner is visible for a moment
      await new Promise(resolve => setTimeout(resolve, 300));
      generateReceiptPDF(order);
    } catch (error) {
      console.error("Failed to generate receipt:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <OrderDetailPanel order={order} onReorder={handleReorder} />

      {/* Action Buttons Container */}
      <div className="bg-white md:rounded-xl md:border border-[#f3f1f1] p-6 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
            onClick={() => setIsSupportModalOpen(true)}
          >
            <MessageCircle size={18} />
            Contact Support
          </Button>
          <Button
            variant="secondary"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
            onClick={handleDownloadReceipt}
            isLoading={isGeneratingPdf}
          >
            <Download size={18} />
            Download Receipt
          </Button>
        </div>

        <Button
          variant="primary"
          className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-md shadow-[#7b2d2d]/20 px-8"
          onClick={() => handleReorder()}
        >
          <RefreshCw size={18} />
          Reorder All Items
        </Button>
      </div>

      <ContactSupportModal
        orderId={order.id}
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}
