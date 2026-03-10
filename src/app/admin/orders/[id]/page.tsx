"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  MessageSquare,
  Printer,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { getOrderById } from "@/lib/supabase/queries";

interface OrderData {
  id: string;
  customer: { name: string; phone: string; email: string; notes: string | null };
  status: string;
  timeline: { stage: string; time: string; completed: boolean }[];
  items: { id: number; name: string; quantity: number; price: number; customizations: { category: string; choice: string }[] }[];
  summary: { subtotal: number; tax: number; total: number };
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await getOrderById(params.id);
        if (!data) return;

        const items = (data.items as any[]) || [];
        const history = (data.order_status_history as any[]) || [];

        const stageLabels: Record<string, string> = {
          new: "Order Placed",
          confirmed: "Payment Confirmed",
          accepted: "Accepted by Kitchen",
          prepping: "Scheduled for Prep",
          ready: "Ready for Dispatch",
        };

        const allStages = ["new", "confirmed", "accepted", "prepping", "ready"];
        const completedStatuses = new Set(history.map((h: any) => h.status));

        const timeline = allStages.map((stage) => {
          const entry = history.find((h: any) => h.status === stage);
          return {
            stage: stageLabels[stage] || stage,
            time: entry ? new Date(entry.created_at).toLocaleString() : "Pending",
            completed: completedStatuses.has(stage),
          };
        });

        // Extract customer notes from items if present
        const customerNotes = items.find((i: any) => i.customizations?.some((c: any) => c.category === "Sauce"))
          ? "Special sauce instructions noted"
          : null;

        setOrder({
          id: data.id.slice(0, 8).toUpperCase(),
          customer: {
            name: (data as any).users?.name || "Unknown",
            phone: (data as any).users?.phone || "",
            email: (data as any).users?.email || "",
            notes: customerNotes,
          },
          status: data.order_status,
          timeline,
          items: items.map((item: any, idx: number) => ({
            id: idx + 1,
            name: item.name || "Unknown Item",
            quantity: item.quantity || 1,
            price: item.price || 0,
            customizations: item.customizations || [],
          })),
          summary: {
            subtotal: Number(data.subtotal),
            tax: Number(data.tax_amount),
            total: Number(data.total),
          },
        });
      } catch (err) {
        console.error("Failed to load order:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-[#7A2E2E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <p className="text-center text-[#806b6b]">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-500 hover:text-[#7b2d2d] font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Queue
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Order {order.id}
            </h1>
            <p className="text-gray-500 mt-1">Due {order.timeline[order.timeline.length - 1]?.time}</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="bg-white border-2 text-gray-600 font-semibold flex gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Prep Label
            </Button>
            <Button className="bg-[#7A2E2E] hover:bg-burgundy text-white font-semibold flex gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Mark Prepping
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Order Contents & Customer */}
        <div className="md:col-span-2 space-y-8">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Order Contents</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-lg bg-[#fcfcfc] border border-[#f3f1f1] flex items-center justify-center text-[#7A2E2E] font-bold text-sm shrink-0">
                        {item.quantity}x
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                        <div className="mt-3 space-y-2">
                          {item.customizations.map((cust, i) => (
                            <div key={i} className="flex gap-2 text-sm">
                              <span className="font-semibold text-gray-500 min-w-[70px]">{cust.category}:</span>
                              <span className="text-gray-900">{cust.choice}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="space-y-3 max-w-xs ml-auto">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${order.summary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total paid</span>
                  <span>${order.summary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Customer Info</h2>
              <Button variant="ghost" size="sm" className="text-[#7b2d2d] hover:text-[#7A2E2E] hover:bg-red-50 flex gap-2">
                <MessageSquare className="w-4 h-4" /> Message
              </Button>
            </div>
            <div className="p-6">
              <div className="font-medium text-gray-900 mb-4">{order.customer.name}</div>
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p>{order.customer.phone}</p>
                <p>{order.customer.email}</p>
              </div>

              {order.customer.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2">Customer Note</h4>
                  <p className="text-yellow-900 text-sm font-medium">&quot;{order.customer.notes}&quot;</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Preparation Timeline</h2>
            </div>
            <div className="p-6">
              <div className="relative pl-6 space-y-8 border-l-2 border-gray-100 ml-3">
                {order.timeline.map((step, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`absolute -left-[35px] w-4 h-4 rounded-full border-2 bg-white ${
                        step.completed ? "border-[#7A2E2E] bg-[#7A2E2E]" : "border-gray-300"
                      }`}
                    />
                    <div>
                      <p className={`font-semibold ${step.completed ? "text-gray-900" : "text-gray-400"}`}>
                        {step.stage}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {step.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
