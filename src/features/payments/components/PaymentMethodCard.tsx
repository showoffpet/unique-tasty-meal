"use client";

import { CreditCard, Trash2, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface PaymentMethodCardProps {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function PaymentMethodCard({
  id,
  brand,
  last4,
  expMonth,
  expYear,
  isDefault,
  onDelete,
  onSetDefault,
}: PaymentMethodCardProps) {
  return (
    <div className="relative flex flex-col p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow group">
      {isDefault && (
        <div className="absolute top-4 right-4 text-emerald-600 flex items-center gap-1 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Primary</span>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg border">
          <CreditCard className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 capitalize">
            {brand} •••• {last4}
          </p>
          <p className="text-sm text-gray-500">
            Exp: {expMonth}/{expYear}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
        {!isDefault && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSetDefault(id)}
            className="text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 px-3"
          >
            Set as Primary
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(id)}
          className="text-gray-400 hover:text-red-600 hover:bg-red-50 ml-auto px-2"
          disabled={isDefault}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
