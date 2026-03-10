"use client";

import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import SearchBar from "../../features/search/components/SearchBar";
import type { Database } from "@/lib/supabase/database.types";
import { getActivePromos } from "@/lib/supabase/queries";

type PromoCode = Database["public"]["Tables"]["promo_codes"]["Row"];

export default function PromoCodesPage() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadPromos() {
      try {
        const data = await getActivePromos();
        setPromos(data);
      } catch (err) {
        console.error("Failed to load promos:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPromos();
  }, []);

  const filteredPromos = promos.filter(
    (p) =>
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getDiscountDisplay = (promo: PromoCode) => {
    if (promo.discount_type === "percentage") {
      return `${promo.discount_value}% OFF`;
    }
    if (promo.discount_value === 0 && promo.code.includes("SHIP")) {
      return `FREE`;
    }
    return `$${promo.discount_value.toFixed(2)} OFF`;
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24">
      {/* Hero Section */}
      <div className="bg-[#7A2E2E] text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Special Offers & Promos
          </h1>
          <p className="text-lg md:text-xl text-[#fcfcfc]/80 max-w-2xl mx-auto">
            Discover the latest deals, discounts, and exclusive offers available
            for your next order.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#f3f1f1] max-w-xl mx-auto mb-10">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search for a specific code or deal..."
          />
        </div>

        {/* Promos Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#f3f1f1] h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredPromos.length === 0 ? (
          <EmptyState
            title={
              searchQuery
                ? "No matching promos found"
                : "No active promos right now"
            }
            message={
              searchQuery
                ? "Check your spelling and try again."
                : "We're cooking up some new deals! Check back later."
            }
            actionLabel={searchQuery ? "Clear Search" : undefined}
            onAction={searchQuery ? () => setSearchQuery("") : undefined}
            className="mt-8"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromos.map((promo) => {
              const isCopied = copiedCode === promo.code;

              return (
                <div
                  key={promo.id}
                  className="bg-white rounded-2xl border border-[#f3f1f1] overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  {/* Top: Discount Value */}
                  <div className="bg-[#fcfcfc] border-b border-[#f3f1f1] p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full border-[12px] border-[#7A2E2E]/5"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-20 h-20 rounded-full border-[8px] border-[#ED8B00]/10"></div>

                    <div className="relative z-10">
                      <span className="inline-block px-3 py-1 bg-white text-[#7b2d2d] text-xs font-bold uppercase tracking-widest rounded-full mb-3 shadow-sm">
                        {promo.discount_type === "percentage"
                          ? "Percentage"
                          : "Fixed Rate"}
                      </span>
                      <h2 className="text-4xl font-black text-[#7A2E2E] tracking-tight">
                        {getDiscountDisplay(promo)}
                      </h2>
                    </div>
                  </div>

                  {/* Middle: Details */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-[#1e1414] font-medium text-lg mb-4 text-center">
                      {promo.description ||
                        "Enjoy this special discount on your order!"}
                    </p>

                    <div className="space-y-2 mt-auto text-sm text-[#806b6b]">
                      {promo.minimum_order_amount &&
                        promo.minimum_order_amount > 0 && (
                          <div className="flex justify-between items-center py-1 border-b border-[#f3f1f1] border-dashed">
                            <span>Min Spend:</span>
                            <span className="font-semibold text-[#1e1414]">
                              ${promo.minimum_order_amount.toFixed(2)}
                            </span>
                          </div>
                        )}
                      {promo.max_discount_cap && promo.max_discount_cap > 0 && (
                        <div className="flex justify-between items-center py-1 border-b border-[#f3f1f1] border-dashed">
                          <span>Max Discount:</span>
                          <span className="font-semibold text-[#1e1414]">
                            ${promo.max_discount_cap.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {promo.expires_at && (
                        <div className="flex justify-between items-center py-1 border-b border-[#f3f1f1] border-dashed">
                          <span>Expires:</span>
                          <span className="font-semibold text-[#1e1414]">
                            {new Date(promo.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Code & Action */}
                  <div className="p-4 bg-[#f3f1f1] border-t border-[#f3f1f1] flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="bg-white border-2 border-dashed border-[#7A2E2E]/30 px-4 py-2 rounded-lg text-[#7A2E2E] font-black tracking-widest text-lg w-full sm:w-auto text-center font-mono">
                      {promo.code}
                    </div>

                    <Button
                      variant={isCopied ? "ghost" : "primary"}
                      onClick={() => handleCopyCode(promo.code)}
                      className={`w-full sm:w-auto ${isCopied ? "bg-[#4CAF50]/10 text-[#4CAF50] hover:bg-[#4CAF50]/20" : ""}`}
                    >
                      {isCopied ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </span>
                      ) : (
                        "Copy Code"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
