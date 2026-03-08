"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  Clock,
  Box,
} from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

// Mock Data for 48h Batch Workflow
const BATCH_ORDERS = [
  {
    id: "ORD-1204",
    customer: "Sarah K.",
    meals: 3,
    total: 45.5,
    due: "Tomorrow, 5:00 PM",
    stage: "new",
  },
  {
    id: "ORD-1205",
    customer: "Mike T.",
    meals: 1,
    total: 18.0,
    due: "Today, 6:30 PM",
    stage: "new",
  },
  {
    id: "ORD-1201",
    customer: "Emma W.",
    meals: 5,
    total: 82.5,
    due: "Tomorrow, 5:00 PM",
    stage: "confirmed",
  },
  {
    id: "ORD-1198",
    customer: "John D.",
    meals: 2,
    total: 34.0,
    due: "Today, 5:00 PM",
    stage: "prepping",
  },
  {
    id: "ORD-1195",
    customer: "Alice M.",
    meals: 4,
    total: 65.0,
    due: "Today, 12:00 PM",
    stage: "ready",
  },
];

const STAGES = [
  {
    id: "new",
    label: "New",
    count: 2,
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    id: "confirmed",
    label: "Confirmed",
    count: 1,
    color: "bg-purple-50 text-purple-700 border-purple-100",
  },
  {
    id: "prepping",
    label: "Prepping",
    count: 1,
    color: "bg-orange-50 text-orange-700 border-orange-100",
  },
  {
    id: "ready",
    label: "Ready",
    count: 1,
    color: "bg-green-50 text-green-700 border-green-100",
  },
];

export default function BatchOrderQueuePage() {
  const [activeStage, setActiveStage] = useState("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const filteredOrders = BATCH_ORDERS.filter(
    (o) =>
      o.stage === activeStage &&
      (o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const getActionForStage = (stage: string) => {
    switch (stage) {
      case "new":
        return "Confirm Selected";
      case "confirmed":
        return "Start Prepping";
      case "prepping":
        return "Mark as Ready";
      case "ready":
        return "Mark Completed";
      default:
        return "Action";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc]">
      <AdminHeader title="Batch Order Queue" subtitle="Managing orders" />

      <main className="flex-1 p-8 overflow-y-auto pb-20">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#f3f1f1] hover:bg-[#f3f1f1] text-[#1e1414] text-sm font-bold rounded-lg transition-colors shadow-sm">
              <Filter className="w-4 h-4" />
              Filter by Date
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#7b2d2d] text-white text-sm font-bold rounded-lg hover:bg-[#561b1b] transition-colors shadow-sm">
            View Prep Board
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stage Navigation */}
        <div className="flex gap-1 bg-[#f3f1f1] p-1 rounded-xl w-fit mb-8">
          {STAGES.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-lg text-sm transition-all ${
                activeStage === stage.id
                  ? "bg-white text-[#7b2d2d] font-bold shadow-sm"
                  : "text-[#806b6b] hover:text-[#1e1414] font-bold"
              }`}
            >
              {stage.label}
              <span
                className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold border ${activeStage === stage.id ? "bg-[#7b2d2d] text-white border-[#7b2d2d]" : "bg-white text-[#806b6b] border-[#e5e5e5]"}`}
              >
                {stage.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Bulk Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#806b6b]" />
            <input
              type="text"
              placeholder="Search by ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#f3f1f1] rounded-lg text-sm text-[#1e1414] focus:ring-2 focus:ring-[#7b2d2d] focus:outline-none transition-all"
            />
          </div>

          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-3 bg-[#7b2d2d]/5 border border-[#7b2d2d]/10 px-4 py-1.5 rounded-lg">
              <span className="text-xs font-bold text-[#7b2d2d]">
                {selectedOrders.length} selected
              </span>
              <button className="flex items-center gap-2 px-3 py-1 bg-[#7b2d2d] text-white text-[11px] font-bold rounded-md hover:bg-[#561b1b] transition-colors">
                <CheckCircle2 className="w-3 h-3" />
                {getActionForStage(activeStage)}
              </button>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm overflow-hidden mb-10">
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f3f1f1]/50 text-[#806b6b] text-xs uppercase tracking-wider font-semibold border-b border-[#f3f1f1]">
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-[#f3f1f1] text-[#7b2d2d] focus:ring-[#7b2d2d]"
                        onChange={handleSelectAll}
                        checked={
                          filteredOrders.length > 0 &&
                          selectedOrders.length === filteredOrders.length
                        }
                      />
                    </th>
                    <th className="p-4 font-medium">Order Details</th>
                    <th className="p-4 font-medium text-center">Meals</th>
                    <th className="p-4 font-medium text-right">Total</th>
                    <th className="p-4 font-medium text-right">Due Time</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f1f1] text-sm text-[#1e1414]">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-[#fcfcfc] transition-colors group ${selectedOrders.includes(order.id) ? "bg-[#7b2d2d]/5" : ""}`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-[#f3f1f1] text-[#7b2d2d] focus:ring-[#7b2d2d]"
                          checked={selectedOrders.includes(order.id)}
                          onChange={(e) => {
                            if (e.target.checked)
                              setSelectedOrders([...selectedOrders, order.id]);
                            else
                              setSelectedOrders(
                                selectedOrders.filter((id) => id !== order.id),
                              );
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-bold">{order.id}</p>
                          <p className="text-xs text-[#806b6b] font-medium">
                            {order.customer}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-[#7b2d2d]">
                          {order.meals}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-bold">
                          ${order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 text-xs font-medium">
                          <Clock className="w-3 h-3 text-[#806b6b]" />
                          {order.due}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 text-[#806b6b] hover:text-[#7b2d2d] hover:bg-[#f3f1f1] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center text-[#806b6b]">
              <Box className="w-12 h-12 mx-auto mb-4 text-[#f3f1f1]" />
              <p className="font-bold text-[#1e1414]">No orders found</p>
              <p className="text-sm">
                There are no orders in the{" "}
                {STAGES.find((s) => s.id === activeStage)?.label} stage.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
