"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import OrderCard from "@/features/orders/components/OrderCard";
import type { Database } from "@/lib/supabase/database.types";
import { ShoppingBag, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

interface PaginatedOrdersProps {
  userId: string;
}

const ORDERS_PER_PAGE = 8;

export default function PaginatedOrdersGrid({ userId }: PaginatedOrdersProps) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const supabase = createClient();
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchOrders = useCallback(
    async (page: number, append = false) => {
      try {
        if (page === 0) setIsLoading(true);
        else setIsLoadingMore(true);
        setError(null);

        let query = supabase
          .from("orders")
          .select("*", { count: "exact" })
          .eq("user_id", userId);

        if (statusFilter !== "all") {
          query = query.eq("order_status", statusFilter);
        }

        const from = page * ORDERS_PER_PAGE;
        const to = from + ORDERS_PER_PAGE - 1;

        const { data, error: fetchError, count } = await query
          .order("created_at", { ascending: sortOrder === "asc" })
          .range(from, to);

        if (fetchError) throw fetchError;

        if (data) {
          setOrders((prev) => (append ? [...prev, ...data] : data));
          setHasMore(count !== null && from + data.length < count);
        }
      } catch (err: unknown) {
        console.error("Error fetching orders:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load orders";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [userId, statusFilter, sortOrder, supabase]
  );

  // Initial load and filter changes
  useEffect(() => {
    fetchOrders(0, false);
  }, [fetchOrders]);

  // Infinite scroll intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          const nextPage = Math.floor(orders.length / ORDERS_PER_PAGE);
          fetchOrders(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, orders.length, fetchOrders]);

  const handleReorder = async (orderId: string) => {
    // Phase C will implement this fully. For now, navigate to cart.
    window.location.href = `/reorder?orderId=${orderId}`;
  };

  if (error && orders.length === 0) {
    return (
      <div className="bg-[#7b2d2d]/10 border border-[#7b2d2d]/20 rounded-xl p-6 text-center">
        <AlertCircle className="w-8 h-8 text-[#7b2d2d] mx-auto mb-3" />
        <h3 className="text-[#1e1414] font-bold mb-2">Couldn&apos;t load orders</h3>
        <p className="text-[#806b6b] text-sm mb-4">{error}</p>
        <Button onClick={() => fetchOrders(0)}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Desktop Sidebar / Mobile Accordion (Simplified for now) */}
      <div className="md:w-64 shrink-0 space-y-6">
        <div>
          <h3 className="font-bold text-[#1e1414] mb-3">Sort By</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="desc"
                name="sort"
                checked={sortOrder === "desc"}
                onChange={() => setSortOrder("desc")}
                className="text-[#7b2d2d] focus:ring-[#7b2d2d]"
              />
              <label htmlFor="desc" className="text-sm text-[#1e1414]">Newest First</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="asc"
                name="sort"
                checked={sortOrder === "asc"}
                onChange={() => setSortOrder("asc")}
                className="text-[#7b2d2d] focus:ring-[#7b2d2d]"
              />
              <label htmlFor="asc" className="text-sm text-[#1e1414]">Oldest First</label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-[#1e1414] mb-3">Status</h3>
          <div className="space-y-2">
            {[
              { id: "all", label: "All Orders" },
              { id: "delivered", label: "Delivered" },
              { id: "cancelled", label: "Cancelled" },
              { id: "pending", label: "Pending" },
            ].map((status) => (
              <div key={status.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={`status-${status.id}`}
                  name="status"
                  checked={statusFilter === status.id}
                  onChange={() => setStatusFilter(status.id)}
                  className="text-[#7b2d2d] focus:ring-[#7b2d2d]"
                />
                <label htmlFor={`status-${status.id}`} className="text-sm text-[#1e1414]">
                  {status.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {isLoading && orders.length === 0 ? (
          // Skeleton loader
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border text-left border-[#f3f1f1] rounded-xl overflow-hidden p-5 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#f3f1f1]">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-[#f3f1f1] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#f8f6f6] flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-[#806b6b]" />
            </div>
            <h3 className="text-xl font-bold text-[#1e1414] mb-2">No orders yet</h3>
            <p className="text-[#806b6b] mb-6 max-w-sm">
              Start exploring our meals and your order history will appear here.
            </p>
            <Button
              onClick={() => window.location.href = "/menu"}
              className="px-8"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          // order grid
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={(id) => (window.location.href = `/account/orders/${id}`)}
                  onReorder={handleReorder}
                />
              ))}
            </div>

            {/* Inline error for pagination */}
            {error && orders.length > 0 && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex justify-between items-center">
                <span>Problem loading more orders.</span>
                <button 
                  onClick={() => fetchOrders(Math.floor(orders.length / ORDERS_PER_PAGE), true)}
                  className="font-bold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Intersection Observer Target */}
            {hasMore && (
              <div
                ref={observerTarget}
                className="py-8 flex justify-center items-center"
              >
                {isLoadingMore && (
                  <div className="flex items-center gap-2 text-[#806b6b]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Loading more orders...</span>
                  </div>
                )}
              </div>
            )}
            
            {!hasMore && orders.length > 0 && (
              <div className="py-8 text-center text-[#806b6b] text-sm">
                You&apos;ve reached the end of your order history.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
