"use client";

import { useState } from "react";
import { Plus, CreditCard, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { PaymentMethodCard } from "@/features/payments/components/PaymentMethodCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

// Mock data for UI development
const INITIAL_METHODS = [
  {
    id: "pm_1",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2026,
    isDefault: true,
  },
  {
    id: "pm_2",
    brand: "mastercard",
    last4: "8888",
    expMonth: 5,
    expYear: 2025,
    isDefault: false,
  },
];

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState(INITIAL_METHODS);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setMethods(methods.filter((m) => m.id !== id));
    setIsDeleting(null);
  };

  const handleSetDefault = (id: string) => {
    setMethods(
      methods.map((m) => ({
        ...m,
        isDefault: m.id === id,
      })),
    );
  };

  return (
    <div className="container max-w-6xl py-12 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Payment Methods
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            Manage your saved cards and payment preferences.
          </p>
        </div>
        <Button className="bg-[#7b2d2d] hover:bg-[#7A2E2E] text-white px-6 py-6 rounded-xl shadow-lg transition-all active:scale-95 flex gap-2 h-auto text-lg">
          <Plus className="w-5 h-5" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: List of Methods */}
        <div className="lg:col-span-2 space-y-6">
          {methods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {methods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  {...method}
                  onDelete={() => setIsDeleting(method.id)}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <CreditCard className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600">
                No payment methods saved
              </h3>
              <p className="text-gray-400 mt-2">
                Add a card to get started with your next order.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Security & Info */}
        <div className="space-y-8">
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-emerald-700" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Secure Payments
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm mb-6">
              We never store your full card details on our servers. All
              sensitive information is handled securely through our payment
              provider using industry-standard encryption.
            </p>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>PCI DSS Level 1 Compliant</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>Encrypted data transmission</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>Two-factor authorization support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!isDeleting}
        onCancel={() => setIsDeleting(null)}
        onConfirm={() => isDeleting && handleDelete(isDeleting)}
        title="Delete Payment Method?"
        message="This card will be removed from your account and alternative methods must be used for future orders."
        confirmLabel="Remove Card"
        intent="danger"
      />
    </div>
  );
}
