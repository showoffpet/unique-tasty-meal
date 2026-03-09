"use client";

import { useState } from "react";
import { Search, Download, Filter } from "lucide-react";
import Button from "@/components/ui/Button";
import TransactionCard from "@/features/payments/components/TransactionCard";

// Mock data for UI development
const INITIAL_TRANSACTIONS = [
  {
    id: "txn_1",
    stripePaymentIntentId: "pi_3OgJ8A2eZvKYlo2C1x9A",
    amount: 4500,
    status: "succeeded" as const,
    createdAt: "2024-03-01T14:30:00Z",
    paymentMethodDetails: { brand: "visa", last4: "4242" },
  },
  {
    id: "txn_2",
    stripePaymentIntentId: "pi_3OgJ8A2eZvKYlo2C1x9B",
    amount: 3250,
    status: "failed" as const,
    createdAt: "2024-02-28T09:15:00Z",
    paymentMethodDetails: { brand: "mastercard", last4: "8888" },
    errorMessage: "Insufficient funds",
  },
  {
    id: "txn_3",
    stripePaymentIntentId: "pi_3OgJ8A2eZvKYlo2C1x9C",
    amount: 1500,
    status: "refunded" as const,
    createdAt: "2024-02-25T18:45:00Z",
    paymentMethodDetails: { brand: "visa", last4: "4242" },
  },
];

export default function TransactionHistoryPage() {
  const [transactions] = useState(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.stripePaymentIntentId
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      txn.paymentMethodDetails?.last4?.includes(searchQuery),
  );

  return (
    <div className="container max-w-5xl py-12 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Transaction History
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            View and manage your recent payments and refunds.
          </p>
        </div>
        <Button
          variant="secondary"
          className="flex gap-2 py-6 px-6 rounded-xl border-2 hover:bg-gray-50 h-auto"
        >
          <Download className="w-5 h-5" />
          Download CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#7b2d2d] transition-colors" />
          <input
            type="text"
            placeholder="Search by Order ID or card last 4..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#7b2d2d] outline-none transition-all"
          />
        </div>
        <Button
          variant="secondary"
          className="flex gap-2 py-4 px-6 rounded-xl border-2 h-auto"
        >
          <Filter className="w-5 h-5 text-gray-500" />
          Filter
        </Button>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((txn) => (
            <TransactionCard key={txn.id} transaction={txn} />
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg font-medium">
              No transactions found matching your criteria.
            </p>
            <Button
              variant="ghost"
              onClick={() => setSearchQuery("")}
              className="text-[#7b2d2d] mt-2 weight-bold"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-center">
        <Button
          variant="ghost"
          className="text-gray-500 hover:text-[#7b2d2d] hover:bg-red-50 py-4 px-8 rounded-xl"
        >
          Load more transactions
        </Button>
      </div>
    </div>
  );
}
