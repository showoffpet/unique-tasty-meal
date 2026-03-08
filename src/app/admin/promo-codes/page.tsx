"use client";

import React, { useState } from "react";
import SearchBar from "../../../features/search/components/SearchBar";
import EmptyState from "../../../components/ui/EmptyState";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import type { Database } from "@/lib/supabase/database.types";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { useAuth } from "@/components/auth/AuthProvider";
import { Plus } from "lucide-react";

type PromoCode = Database["public"]["Tables"]["promo_codes"]["Row"];

// Mock data
const MOCK_PROMOS: PromoCode[] = [
  {
    id: "p1",
    code: "WELCOME10",
    description: "Get 10% off your first order!",
    discount_type: "percentage",
    discount_value: 10,
    minimum_order_amount: 20,
    max_discount_cap: 15,
    expires_at: new Date(Date.now() + 86400000 * 30).toISOString(),
    max_usages: 1,
    usage_count: 0,
    status: "active",
    applicable_cuisines: null,
    applicable_dietary_tags: null,
    applicable_meals: null,
    created_by: "system",
    excluded_meals: null,
    metadata: null,
    requires_minimum_items: null,
    requires_new_user: true,
    stackable: false,
    usage_per_user_limit: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p2",
    code: "FREESHIP",
    description: "Free shipping on orders over $50",
    discount_type: "fixed",
    discount_value: 0,
    minimum_order_amount: 50,
    max_discount_cap: null,
    expires_at: new Date(Date.now() - 86400000).toISOString(), // Expired
    max_usages: 1000,
    usage_count: 124,
    status: "inactive",
    applicable_cuisines: null,
    applicable_dietary_tags: null,
    applicable_meals: null,
    created_by: "system",
    excluded_meals: null,
    metadata: null,
    requires_minimum_items: null,
    requires_new_user: false,
    stackable: false,
    usage_per_user_limit: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function AdminPromoCodesPage() {
  const { user } = useAuth();
  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Chef";
  const [promos, setPromos] = useState<PromoCode[]>(MOCK_PROMOS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">(
    "all",
  );

  // Modals
  const [deleteRef, setDeleteRef] = useState<string | null>(null);

  const filteredPromos = promos.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === "active")
      return p.status === "active" && new Date(p.expires_at) > new Date();
    if (activeTab === "inactive")
      return p.status === "inactive" || new Date(p.expires_at) <= new Date();

    return true;
  });

  const getStatusBadge = (promo: PromoCode) => {
    const isExpired = new Date(promo.expires_at) <= new Date();

    if (promo.status === "inactive") {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#f3f1f1] text-[#806b6b] border border-[#f3f1f1]">
          Inactive
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-orange-50 text-orange-700 border border-orange-100">
          Expired
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-100">
        Active
      </span>
    );
  };

  const getDiscountDisplay = (promo: PromoCode) => {
    if (promo.discount_type === "percentage") {
      return `${promo.discount_value}% OFF`;
    }
    if (promo.discount_value === 0) {
      return `FREE`;
    }
    return `$${promo.discount_value.toFixed(2)} OFF`;
  };

  const togglePromoStatus = (id: string, currentStatus: string) => {
    setPromos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: currentStatus === "active" ? "inactive" : "active" }
          : p,
      ),
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc]">
      <AdminHeader
        title="Promo Codes"
        subtitle="Manage discounts and special offers"
      />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* Actions Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex bg-[#f3f1f1] p-1 rounded-lg w-full md:w-auto">
            {(["all", "active", "inactive"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-md text-xs font-bold transition-colors capitalize ${
                  activeTab === tab
                    ? "bg-white text-[#1e1414] shadow-sm"
                    : "text-[#806b6b] hover:text-[#1e1414]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              // TODO: Open Create Promo Modal
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#7b2d2d] text-white text-sm font-bold rounded-lg hover:bg-[#561b1b] transition-colors shadow-sm w-full md:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Create Promo Code
          </button>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-96 mb-6">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search by code or description..."
          />
        </div>

        {/* Promos Table List */}
        <div className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm overflow-hidden mb-20">
          {filteredPromos.length === 0 ? (
            <EmptyState
              title="No promo codes found"
              message={
                searchQuery
                  ? "Try a different search term or filter."
                  : "Create your first promo code to boost sales."
              }
              actionLabel={searchQuery ? "Clear Search" : "Create Promo Code"}
              onAction={
                searchQuery
                  ? () => setSearchQuery("")
                  : () => {
                      // TODO: Open Create Modal
                    }
              }
              className="py-12"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f3f1f1]/50 text-[#806b6b] text-xs uppercase tracking-wider font-semibold border-b border-[#f3f1f1]">
                    <th className="p-4 font-medium">Code</th>
                    <th className="p-4 font-medium">Discount</th>
                    <th className="p-4 font-medium hidden md:table-cell">
                      Usage (Used / Limit)
                    </th>
                    <th className="p-4 font-medium hidden lg:table-cell">
                      Expires
                    </th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f1f1] text-sm text-[#1e1414]">
                  {filteredPromos.map((promo) => (
                    <tr
                      key={promo.id}
                      className="hover:bg-[#fcfcfc] transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-mono font-bold">{promo.code}</div>
                        <div
                          className="text-xs text-[#806b6b] line-clamp-1 mt-0.5"
                          title={promo.description || ""}
                        >
                          {promo.description}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[#7b2d2d]">
                          {getDiscountDisplay(promo)}
                        </span>
                        {promo.minimum_order_amount &&
                          promo.minimum_order_amount > 0 && (
                            <div className="text-[10px] text-[#806b6b] uppercase mt-0.5 font-bold">
                              Min ${promo.minimum_order_amount}
                            </div>
                          )}
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#f3f1f1] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#7b2d2d]"
                              style={{
                                width: `${Math.min(100, (promo.usage_count / (promo.max_usages || 1)) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-[#806b6b]">
                            {promo.usage_count} / {promo.max_usages || "∞"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        {new Date(promo.expires_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">{getStatusBadge(promo)}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-1.5 text-[#806b6b] hover:text-[#7b2d2d] hover:bg-[#f3f1f1] rounded-lg transition-colors"
                            onClick={() =>
                              togglePromoStatus(promo.id, promo.status)
                            }
                            title={
                              promo.status === "active"
                                ? "Deactivate"
                                : "Activate"
                            }
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              {promo.status === "active" ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              ) : (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              )}
                            </svg>
                          </button>
                          <button
                            className="p-1.5 text-[#806b6b] hover:text-[#7b2d2d] hover:bg-[#f3f1f1] rounded-lg transition-colors"
                            onClick={() => setDeleteRef(promo.id)}
                            title="Delete"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deleteRef && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Promo Code"
          message="Are you sure you want to delete this promo code? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => {
            setPromos(promos.filter((p) => p.id !== deleteRef));
            setDeleteRef(null);
          }}
          onCancel={() => setDeleteRef(null)}
          intent="danger"
        />
      )}
    </div>
  );
}
