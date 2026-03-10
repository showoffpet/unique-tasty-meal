"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CalendarDays,
  Download,
} from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { getDashboardMetrics, getPopularMeals } from "@/lib/supabase/queries";

interface MetricDisplay {
  title: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  icon: React.ReactNode;
  iconBg: string;
  pillBg: string;
}

interface PopularMeal {
  name: string;
  count: number;
  revenue: number;
}

export default function RestaurantAnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState("This Month");
  const [metrics, setMetrics] = useState<MetricDisplay[]>([]);
  const [popularMeals, setPopularMeals] = useState<PopularMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [metricsData, popular] = await Promise.all([
          getDashboardMetrics(),
          getPopularMeals(),
        ]);

        setMetrics([
          {
            title: "Total Meals Prepped",
            value: `${metricsData.totalOrders} Orders`,
            trend: "+0%",
            trendDirection: "up",
            icon: <PieChart className="w-6 h-6" />,
            iconBg: "bg-blue-50 text-blue-600",
            pillBg: "bg-blue-50 text-blue-600",
          },
          {
            title: "Gross Revenue",
            value: `$${metricsData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            trend: "+0%",
            trendDirection: "up",
            icon: <TrendingUp className="w-6 h-6" />,
            iconBg: "bg-green-50 text-green-600",
            pillBg: "bg-green-50 text-green-600",
          },
          {
            title: "Avg Order Value",
            value: `$${metricsData.avgOrderValue.toFixed(2)}`,
            trend: "+0%",
            trendDirection: "up",
            icon: <BarChart3 className="w-6 h-6" />,
            iconBg: "bg-red-50 text-red-600",
            pillBg: "bg-red-50 text-red-600",
          },
        ]);

        setPopularMeals(popular);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc]">
      <AdminHeader
        title="Sales & Demand Analytics"
        subtitle="Review your revenue and menu performance"
      />

      <main className="flex-1 overflow-y-auto p-8 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div className="invisible">{/* Spacer */}</div>
          <div className="flex items-center gap-3">
            <select
              className="bg-white border border-[#f3f1f1] text-xs rounded-lg px-4 py-2 font-bold text-[#1e1414] focus:ring-0 cursor-pointer shadow-sm outline-none"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>Year to Date</option>
            </select>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-[#7b2d2d] text-white text-xs font-bold rounded-lg hover:bg-[#561b1b] transition-colors shadow-sm"
            >
              <Download className="w-3 h-3" />
              Export Report
            </button>
          </div>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="bg-white h-32 rounded-xl border border-[#f3f1f1] animate-pulse" />
              ))
            : metrics.map((metric, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl border border-[#f3f1f1] shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${metric.iconBg}`}>
                      {metric.icon}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${metric.pillBg}`}>
                      {metric.trend}
                    </span>
                  </div>
                  <p className="text-[#806b6b] text-sm font-medium">{metric.title}</p>
                  <p className="text-[#1e1414] text-2xl font-bold mt-1">{metric.value}</p>
                </div>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Meal Popularity Table */}
          <div className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#f3f1f1]">
              <h2 className="text-lg font-bold text-[#1e1414]">Top Performing Meals</h2>
              <p className="text-sm text-[#806b6b] mt-1">By volume and revenue</p>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f3f1f1]/50 text-[#806b6b] text-xs uppercase tracking-wider font-semibold border-b border-[#f3f1f1]">
                    <th className="p-4">Meal Name</th>
                    <th className="p-4 text-right">Bowls Sold</th>
                    <th className="p-4 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f1f1] text-sm">
                  {popularMeals.length === 0 && !isLoading ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-[#806b6b]">No order data yet</td>
                    </tr>
                  ) : (
                    popularMeals.map((meal, index) => (
                      <tr key={index} className="hover:bg-[#f3f1f1]/30 transition-colors group">
                        <td className="p-4 font-medium text-[#1e1414]">{meal.name}</td>
                        <td className="p-4 text-right font-bold text-[#7b2d2d]">{meal.count}</td>
                        <td className="p-4 text-right font-mono text-[#806b6b]">
                          ${meal.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-[#f3f1f1] bg-white flex justify-center">
              <button className="text-sm font-bold text-[#7b2d2d] hover:text-[#561b1b] transition-colors flex items-center gap-2">
                View Full Menu Details
              </button>
            </div>
          </div>

          {/* Demand Forecasting Placeholder Chart */}
          <div className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#f3f1f1] flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-[#1e1414]">Weekly Demand Forecast</h2>
                <p className="text-sm text-[#806b6b] mt-1">Predicted prep volume</p>
              </div>
            </div>
            <div className="p-6 flex-grow flex items-center justify-center bg-[#fcfcfc]/50">
              <div className="text-center text-[#806b6b]">
                <CalendarDays className="w-16 h-16 mx-auto mb-4 text-[#e5e5e5]" />
                <p className="font-bold text-[#1e1414] mb-2">Demand Chart Visualization</p>
                <p className="text-sm max-w-sm mx-auto text-[#806b6b]">
                  Once enough order data is collected (usually 4+ weeks), a bar
                  chart showing predicted daily prep volumes will appear here to
                  help you plan ingredient sourcing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
