"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/features/checkout/store/checkoutStore";
import { useAddressStore } from "@/store/addressStore";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  CreditCard,
  Wallet,
  Banknote,
  ArrowRight,
  HelpCircle,
  Lock,
} from "lucide-react";
import CheckoutAddressSelector from "@/features/delivery-addresses/components/CheckoutAddressSelector";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { items, cartTotal } = useCartStore();
  const {
    currentStep,
    setStep,
    nextStep,
    paymentMethod,
    setPaymentMethod,
    deliveryAddressId,
  } = useCheckoutStore();
  const { addresses, fetchAddresses } = useAddressStore();

  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const activeAddress =
    addresses.find((a) => a.id === deliveryAddressId) ||
    addresses.find((a) => a.is_default) ||
    addresses[0];

  const subtotal = cartTotal();
  const deliveryFee = 5.0; // Example
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate API call for now
    setTimeout(() => {
      setIsProcessing(false);
      router.push(
        `/checkout/confirmation?order_id=ORD-${Math.floor(Math.random() * 100000)}`,
      );
    }, 2000);
  };

  if (items.length === 0) return null; // Prevent flicker before redirect

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout" },
          ]}
        />
        <h1 className="text-4xl md:text-5xl font-black text-[#1e1414] tracking-tight">
          Checkout
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative">
        {/* LEFT COLUMN: Steps */}
        <div className="flex-1 min-w-0">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-semibold text-[#7b2d2d]">
                Step {currentStep} of 3
              </span>
              <span className="text-xs text-slate-500">
                {currentStep === 1 && "Delivery Address"}
                {currentStep === 2 && "Payment Method"}
                {currentStep === 3 && "Review Order"}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7b2d2d] rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* STEP 1: Delivery Address */}
            <div
              className={`border rounded-xl bg-white overflow-hidden transition-all ${currentStep === 1 ? "border-[#7b2d2d] ring-4 ring-[#7b2d2d]/5" : currentStep > 1 ? "border-[#f3f1f1]" : "border-[#f3f1f1] opacity-60"}`}
            >
              <div
                className={`p-5 ${currentStep > 1 ? "bg-green-50/50 cursor-pointer" : currentStep === 1 ? "border-b border-[#f3f1f1]" : ""}`}
                onClick={() => currentStep > 1 && setStep(1)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentStep > 1 ? (
                      <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center">
                        <CheckCircle2 size={14} strokeWidth={3} />
                      </div>
                    ) : (
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 1 ? "bg-[#7b2d2d] text-white" : "border-2 border-slate-400 text-slate-400"}`}
                      >
                        1
                      </div>
                    )}
                    <h3
                      className={`font-bold ${currentStep < 1 ? "text-slate-500" : "text-slate-900"}`}
                    >
                      Delivery Address
                    </h3>
                  </div>
                  {currentStep > 1 && (
                    <span className="text-sm font-semibold text-[#7b2d2d]">
                      Edit
                    </span>
                  )}
                </div>

                {currentStep > 1 && activeAddress && (
                  <div className="mt-4 pl-9">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-700">
                        {activeAddress.label || "Address"}
                      </span>
                      {activeAddress.is_default && (
                        <span className="text-[10px] bg-white border border-[#f3f1f1] text-[#806b6b] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-1">
                      {activeAddress.street_address}
                      {activeAddress.apartment
                        ? `, ${activeAddress.apartment}`
                        : ""}
                      <br />
                      {activeAddress.city}, {activeAddress.postal_code}
                    </p>
                  </div>
                )}
              </div>

              {currentStep === 1 && (
                <div className="p-5 md:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <CheckoutAddressSelector />
                  <div className="flex justify-end pt-6 mt-6 border-t border-[#f3f1f1]">
                    <button
                      onClick={nextStep}
                      className="bg-[#7b2d2d] hover:bg-[#6a2525] text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2"
                    >
                      Continue to Payment
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: Payment Method */}
            <div
              className={`border rounded-xl bg-white overflow-hidden transition-all ${currentStep === 2 ? "border-[#7b2d2d] ring-4 ring-[#7b2d2d]/5" : currentStep > 2 ? "border-[#f3f1f1]" : "border-[#f3f1f1] opacity-60"}`}
            >
              <div
                className={`flex items-center justify-between p-5 ${currentStep > 2 ? "bg-green-50/50 cursor-pointer" : currentStep === 2 ? "border-b border-[#f3f1f1]" : ""}`}
                onClick={() => currentStep > 2 && setStep(2)}
              >
                <div className="flex items-center gap-3">
                  {currentStep > 2 ? (
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center">
                      <CheckCircle2 size={14} strokeWidth={3} />
                    </div>
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 2 ? "bg-[#7b2d2d] text-white" : "border-2 border-slate-400 text-slate-400"}`}
                    >
                      2
                    </div>
                  )}
                  <h3
                    className={`font-bold ${currentStep < 2 ? "text-slate-500" : "text-slate-900"}`}
                  >
                    Payment Method
                  </h3>
                </div>
                {currentStep > 2 && (
                  <span className="text-sm font-semibold text-[#7b2d2d]">
                    Edit
                  </span>
                )}
              </div>

              {currentStep === 2 && (
                <div className="p-5 md:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <p className="text-slate-500 text-sm mb-6">
                    Select your preferred payment method below. All transactions
                    are secure and encrypted.
                  </p>

                  {/* Payment Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all h-full ${paymentMethod === "card" ? "border-[#7b2d2d] bg-[#7b2d2d]/5 text-[#7b2d2d]" : "border-[#f3f1f1] hover:bg-gray-50 text-slate-700"}`}
                    >
                      <CreditCard className="mb-2" size={32} />
                      <span className="text-sm font-semibold text-slate-900">
                        Credit Card
                      </span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("wallet")}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all h-full ${paymentMethod === "wallet" ? "border-[#7b2d2d] bg-[#7b2d2d]/5 text-[#7b2d2d]" : "border-[#f3f1f1] hover:bg-gray-50 text-slate-700"}`}
                    >
                      <Wallet className="mb-2" size={32} />
                      <span className="text-sm font-semibold text-slate-900">
                        Digital Wallet
                      </span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all h-full ${paymentMethod === "cod" ? "border-[#7b2d2d] bg-[#7b2d2d]/5 text-[#7b2d2d]" : "border-[#f3f1f1] hover:bg-gray-50 text-slate-700"}`}
                    >
                      <Banknote className="mb-2" size={32} />
                      <span className="text-sm font-semibold text-slate-900">
                        Cash on Delivery
                      </span>
                    </button>
                  </div>

                  {/* Dummy Card Form (If Card Selected) */}
                  {paymentMethod === "card" && (
                    <div className="space-y-5 animate-in fade-in duration-300">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                          Card Number
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <CreditCard size={18} />
                          </span>
                          <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border-[#f3f1f1] bg-gray-50 focus:border-[#7b2d2d] focus:ring-[#7b2d2d] text-sm font-medium outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            className="w-full px-4 py-3 rounded-lg border-[#f3f1f1] bg-gray-50 focus:border-[#7b2d2d] focus:ring-[#7b2d2d] text-sm font-medium outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                            CVC
                            <HelpCircle size={14} className="text-slate-400" />
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 rounded-lg border-[#f3f1f1] bg-gray-50 focus:border-[#7b2d2d] focus:ring-[#7b2d2d] text-sm font-medium outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-lg border-[#f3f1f1] bg-gray-50 focus:border-[#7b2d2d] focus:ring-[#7b2d2d] text-sm font-medium outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-6 mt-6 border-t border-[#f3f1f1]">
                    <button
                      onClick={nextStep}
                      disabled={!paymentMethod}
                      className="bg-[#7b2d2d] hover:bg-[#6a2525] disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2"
                    >
                      Review Order
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: Review (Disabled State) */}
            <div
              className={`border rounded-xl bg-white overflow-hidden transition-all ${currentStep === 3 ? "border-[#7b2d2d] ring-4 ring-[#7b2d2d]/5" : "border-[#f3f1f1] opacity-60"}`}
            >
              <div
                className={`flex items-center justify-between p-5 ${currentStep === 3 ? "border-b border-[#f3f1f1]" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 3 ? "bg-[#7b2d2d] text-white" : "border-2 border-slate-400 text-slate-400"}`}
                  >
                    3
                  </div>
                  <h3
                    className={`font-bold ${currentStep < 3 ? "text-slate-500" : "text-slate-900"}`}
                  >
                    Review & Place Order
                  </h3>
                </div>
                {currentStep < 3 && (
                  <Lock size={18} className="text-slate-400" />
                )}
              </div>

              {currentStep === 3 && (
                <div className="p-5 md:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <p className="text-slate-600 mb-6">
                    Please confirm your order details from the summary on the
                    right. By placing your order, you agree to our Terms of
                    Service.
                  </p>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-[#7b2d2d] hover:bg-[#6a2525] disabled:opacity-70 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-[#7b2d2d]/20 transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    {isProcessing ? "Processing Payment..." : "Place Order"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Order Summary */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="sticky top-28 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-[#f3f1f1] overflow-hidden">
              <div className="p-5 border-b border-[#f3f1f1] bg-gray-50 flex justify-between items-center">
                <h2 className="font-bold text-lg text-slate-900">
                  Order Summary
                </h2>
                <span className="bg-[#7b2d2d]/10 text-[#7b2d2d] text-xs font-bold px-2 py-1 rounded">
                  {items.length} Items
                </span>
              </div>

              <div className="p-5 border-t border-[#f3f1f1] space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-slate-900">
                    ${deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="h-px bg-[#f3f1f1] my-2"></div>
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-900">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-[#7b2d2d]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-[#7b2d2d]/5 rounded-lg p-4 flex items-center gap-3 border border-[#7b2d2d]/10">
              <CheckCircle2 className="text-[#7b2d2d]" size={24} />
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  100% Secure Checkout
                </h4>
                <p className="text-xs text-slate-500">
                  Your information is encrypted and safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
