"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { NewMetricCard } from "@/features/admin/components/NewMetricCard";
import { DollarSign, ShoppingCart, Receipt, Smile, Eye } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";
import { getDashboardMetrics, getPopularMeals, getRecentOrders } from "@/lib/supabase/queries";

interface MetricData {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  iconBg: string;
}

interface PopularItem {
  name: string;
  count: number;
  max: number;
}

interface LiveOrder {
  id: string;
  customer: string;
  items: string;
  total: string;
  status: string;
  time: string;
}

export default function RestaurantAdminDashboardPage() {
  const { user } = useAuth();
  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";

  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [metricsData, popular, recent] = await Promise.all([
          getDashboardMetrics(),
          getPopularMeals(),
          getRecentOrders(5),
        ]);

        setMetrics([
          {
            title: "Total Revenue",
            value: `$${metricsData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: "+0%",
            trend: "up",
            icon: <DollarSign className="w-6 h-6 text-[#1E8E3E]" />,
            iconBg: "bg-[#E6F4EA]",
          },
          {
            title: "Batch Orders",
            value: String(metricsData.totalOrders),
            change: "+0%",
            trend: "up",
            icon: <ShoppingCart className="w-6 h-6 text-[#1A73E8]" />,
            iconBg: "bg-[#E8F0FE]",
          },
          {
            title: "Avg. Order Value",
            value: `$${metricsData.avgOrderValue.toFixed(2)}`,
            change: "+0%",
            trend: "up",
            icon: <Receipt className="w-6 h-6 text-[#E37400]" />,
            iconBg: "bg-[#FEF7E0]",
          },
          {
            title: "Satisfaction",
            value: "N/A",
            change: "+0%",
            trend: "up",
            icon: <Smile className="w-6 h-6 text-[#9334E6]" />,
            iconBg: "bg-[#F3E8FD]",
          },
        ]);

        const maxCount = popular.length > 0 ? Math.max(...popular.map((p) => p.count)) + 10 : 150;
        setPopularItems(
          popular.map((p) => ({
            name: p.name,
            count: p.count,
            max: maxCount,
          })),
        );

        setLiveOrders(
          recent.map((o: any) => {
            const items = o.items as any[];
            const itemSummary = Array.isArray(items)
              ? items.map((i: any) => `${i.quantity || 1}x ${i.name || "Item"}`).join(", ")
              : "N/A";
            const timeAgo = getTimeAgo(new Date(o.created_at));

            return {
              id: `#${o.id.slice(0, 8).toUpperCase()}`,
              customer: o.users?.name || "Unknown",
              items: itemSummary.length > 40 ? itemSummary.slice(0, 37) + "..." : itemSummary,
              total: `$${Number(o.total).toFixed(2)}`,
              status: o.order_status === "new" ? "New" : o.order_status.charAt(0).toUpperCase() + o.order_status.slice(1),
              time: timeAgo,
            };
          }),
        );
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc]">
      <AdminHeader
        title="Dashboard Overview"
        subtitle={`Good afternoon, ${userName}`}
      />

      <main className="flex-1 p-8 overflow-y-auto pb-20">
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white h-32 rounded-xl border border-[#f3f1f1] animate-pulse" />
              ))
            : metrics.map((metric, i) => (
                <NewMetricCard key={i} {...metric} />
              ))}
        </div>

        {/* Center Grid: Chart and Popular Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart Placeholder */}
          <div className="lg:col-span-2 bg-[#ffffff] rounded-xl border border-[#f3f1f1] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1e1414]">Daily Revenue</h3>
                <p className="text-sm text-[#806b6b]">Income trend over last 24 hours</p>
              </div>
              <select className="bg-[#f3f1f1] border-none text-xs rounded-lg px-3 py-1.5 font-medium text-[#1e1414] focus:ring-0 cursor-pointer outline-none">
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 mt-8 px-2">
              {[4, 6, 3, 7, 5, 9, 6, 4, 3, 5, 7, 8].map((h, i) => (
                <div key={i} className="w-full bg-[#f3f1f1] rounded-t-sm relative group h-full flex flex-col justify-end">
                  <div
                    className={`absolute bottom-0 w-full rounded-t-sm transition-colors ${i === 5 ? "bg-[#7b2d2d] group-hover:bg-[#561b1b]" : "bg-[#7b2d2d]/20 group-hover:bg-[#7b2d2d]/30"}`}
                    style={{ height: `${h * 10}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-2 text-xs text-[#806b6b]">
              <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>23:59</span>
            </div>
          </div>

          {/* Popular Items */}
          <div className="lg:col-span-1 bg-[#ffffff] rounded-xl border border-[#f3f1f1] p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-[#1e1414] mb-1">Popular Items</h3>
            <p className="text-sm text-[#806b6b] mb-6">Top selling dishes today</p>

            <div className="flex flex-col gap-5 flex-1 justify-center">
              {popularItems.length === 0 && !isLoading ? (
                <p className="text-sm text-[#806b6b] text-center">No order data yet</p>
              ) : (
                popularItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 bg-cover bg-center border border-[#f3f1f1]">
                      <div className="w-full h-full bg-[#1B4332] opacity-10"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-sm font-semibold text-[#1e1414] truncate">{item.name}</span>
                        <span className="text-sm font-bold text-[#1e1414]">{item.count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#f3f1f1] rounded-full overflow-hidden">
                        <div className="h-full bg-[#7b2d2d] rounded-full" style={{ width: `${(item.count / item.max) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-6 py-2 text-sm text-[#7b2d2d] font-bold hover:bg-[#f3f1f1] rounded-lg transition-colors">
              View Full Menu Analytics
            </button>
          </div>
        </div>

        {/* Bottom Table: Order Queue */}
        <div className="bg-[#ffffff] rounded-xl border border-[#f3f1f1] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#f3f1f1] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#1e1414]">Orders Queue</h3>
              <p className="text-sm text-[#806b6b]">Batch order tracking</p>
            </div>
            <div className="flex gap-2">
              <Button className="px-4 py-2 bg-[#7b2d2d] text-white text-sm font-bold rounded-lg hover:bg-[#561b1b] transition-colors flex items-center gap-2">
                + Manual Order
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f3f1f1]/50 text-[#806b6b] text-xs uppercase tracking-wider font-semibold border-b border-[#f3f1f1]">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Time</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f1f1] text-sm">
                {liveOrders.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#806b6b]">No recent orders</td>
                  </tr>
                ) : (
                  liveOrders.map((order, i) => (
                    <tr key={i} className="hover:bg-[#f3f1f1]/30 transition-colors group">
                      <td className="p-4 font-mono font-medium text-[#1e1414]">{order.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs ring-2 ring-white">
                            {order.customer.charAt(0)}
                          </div>
                          <span className="font-medium text-[#1e1414]">{order.customer}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#806b6b] max-w-[200px] truncate">{order.items}</td>
                      <td className="p-4 font-bold text-[#1e1414]">{order.total}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8F0FE] text-[#1A73E8]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] animate-pulse"></span>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-[#806b6b]">{order.time}</td>
                      <td className="p-4 text-right">
                        <button className="p-1.5 text-[#806b6b] hover:text-[#7b2d2d] hover:bg-[#f3f1f1] rounded transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-[#f3f1f1] flex justify-center">
            <button className="text-sm font-bold text-[#7b2d2d] hover:text-[#561b1b] transition-colors flex items-center gap-2">
              View All Orders
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${Math.floor(diffHours / 24)} days ago`;
}
