"use client";

import React, { useState, useEffect } from "react";
import { Search, Mail, Phone, Calendar, ArrowUpRight } from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { getCustomers } from "@/lib/supabase/queries";

interface CustomerDisplay {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string | null;
  status: string;
}

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<CustomerDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to load customers:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "loyal":
        return "bg-green-50 text-green-700 border-green-100";
      case "active":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "inactive":
        return "bg-gray-50 text-gray-500 border-gray-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const formatSpent = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatLastActive = (date: string | null) => {
    if (!date) return "Never";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc]">
      <AdminHeader
        title="Customer Directory"
        subtitle="View and manage your customer database"
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#806b6b]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#f3f1f1] rounded-lg text-sm text-[#1e1414] focus:ring-2 focus:ring-[#7b2d2d] focus:outline-none transition-all"
            />
          </div>
          <button className="px-4 py-2 bg-[#7b2d2d] text-white text-sm font-bold rounded-lg hover:bg-[#561b1b] transition-colors shadow-sm">
            Export Customer List
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f3f1f1]/50 text-[#806b6b] text-xs uppercase tracking-wider font-semibold border-b border-[#f3f1f1]">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Orders</th>
                  <th className="p-4">Total Spent</th>
                  <th className="p-4">Last Active</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f1f1] text-sm text-[#1e1414]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-[#806b6b]">
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-[#fcfcfc] transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#f3f1f1] flex items-center justify-center font-bold text-[#7b2d2d]">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold">{customer.name}</p>
                            <p className="text-xs text-[#806b6b]">
                              ID: {customer.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-[#806b6b]">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#806b6b]">
                            <Phone className="w-3 h-3" />
                            {customer.phone || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold">{customer.totalOrders}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold">{formatSpent(customer.totalSpent)}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-xs text-[#806b6b]">
                          <Calendar className="w-3 h-3" />
                          {formatLastActive(customer.lastOrder)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(customer.status)}`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 text-[#806b6b] hover:text-[#7b2d2d] hover:bg-[#f3f1f1] rounded-lg transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-[#806b6b]">
                      No customers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
