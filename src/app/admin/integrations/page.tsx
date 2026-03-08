"use client";

import React from "react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { useAuth } from "@/components/auth/AuthProvider";
import { Cpu, ExternalLink, CheckCircle2 } from "lucide-react";

const INTEGRATIONS = [
  {
    name: "Supabase Realtime",
    description: "Powers live order updates and customer notifications.",
    status: "Active",
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  },
  {
    name: "Stripe Payments",
    description: "Handles secure customer transactions and payouts.",
    status: "Configured",
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  },
  {
    name: "Google Maps API",
    description: "Used for delivery distance and address validation.",
    status: "Not Configured",
    icon: <div className="w-4 h-4 rounded-full border-2 border-gray-200" />,
  },
];

export default function AdminIntegrationsPage() {
  // No user hook needed here for return statement anymore

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc]">
      <AdminHeader
        title="API Integrations"
        subtitle="Manage system connections and third-party services"
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#f3f1f1] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-[#7b2d2d]" />
                <h2 className="font-bold text-[#1e1414]">Connected Services</h2>
              </div>
            </div>
            <div className="divide-y divide-[#f3f1f1]">
              {INTEGRATIONS.map((service) => (
                <div
                  key={service.name}
                  className="p-6 flex items-center justify-between hover:bg-[#fcfcfc] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#f3f1f1] flex items-center justify-center text-[#1e1414]">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1e1414] text-sm">
                        {service.name}
                      </p>
                      <p className="text-xs text-[#806b6b]">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      {service.icon}
                      <span className="text-xs font-bold text-[#1e1414]">
                        {service.status}
                      </span>
                    </div>
                    <button className="text-[#806b6b] hover:text-[#7b2d2d] transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
