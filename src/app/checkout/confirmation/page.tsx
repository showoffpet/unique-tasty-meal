"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import {
  CheckCircle2,
  ChevronRight,
  FileText,
  ShoppingBag,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";

function CheckoutConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear cart on successful order
    if (orderId) {
      clearCart();
    }
  }, [orderId, clearCart]);

  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="text-2xl font-bold mb-4">Order Session Not Found</h1>
        <p className="text-slate-500 mb-8">
          We couldn&apos;t find your recent order details.
        </p>
        <button
          onClick={() => router.push("/account/orders")}
          className="bg-[#7b2d2d] hover:bg-[#6a2525] text-white px-6 py-3 rounded-lg font-bold"
        >
          View My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Success Header */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2
            className="text-green-600"
            size={48}
            strokeWidth={2.5}
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-slate-500 mb-2">
          Thank you for your order. We&apos;ve sent a confirmation email to you.
        </p>
        <p className="text-sm font-medium text-slate-700 bg-slate-100 inline-block px-4 py-2 rounded-lg mt-2">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        {/* Delivery Info */}
        <div className="bg-white rounded-xl p-6 border border-[#f3f1f1] shadow-sm">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MapPin className="text-[#7b2d2d]" size={20} />
            Delivery Details
          </h2>
          <div className="space-y-3 text-sm text-slate-600">
            <p className="font-medium text-slate-900">John Doe</p>
            <p>123 Recipe Street</p>
            <p>Suite 4B</p>
            <p>Foodville, CA 90210</p>
            <p className="pt-2 font-medium text-slate-900">
              Arrives in 25-35 minutes
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          <Link
            href="/account/orders"
            className="block bg-white rounded-xl p-5 border border-[#f3f1f1] shadow-sm hover:border-[#7b2d2d] hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#7b2d2d]/10 flex items-center justify-center text-[#7b2d2d]">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-[#7b2d2d] transition-colors">
                    Track Order
                  </h3>
                  <p className="text-xs text-slate-500">
                    Follow your delivery in real-time
                  </p>
                </div>
              </div>
              <ChevronRight className="text-slate-400 group-hover:text-[#7b2d2d] transition-colors" />
            </div>
          </Link>

          <button className="w-full text-left bg-white rounded-xl p-5 border border-[#f3f1f1] shadow-sm hover:border-[#7b2d2d] hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#7b2d2d]/10 group-hover:text-[#7b2d2d] transition-colors">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-[#7b2d2d] transition-colors">
                    Download Receipt
                  </h3>
                  <p className="text-xs text-slate-500">
                    Get a PDF copy for your records
                  </p>
                </div>
              </div>
              <ChevronRight className="text-slate-400 group-hover:text-[#7b2d2d] transition-colors" />
            </div>
          </button>
        </div>
      </div>

      <div className="text-center pt-8 border-t border-[#f3f1f1]">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#7b2d2d] font-semibold transition-colors"
        >
          <ShoppingBag size={20} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12 text-[#806b6b]">Loading confirmation...</div>}>
      <CheckoutConfirmationContent />
    </Suspense>
  );
}
