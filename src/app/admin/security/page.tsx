"use client";

import React from "react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Lock, Eye, Key } from "lucide-react";

export default function AdminSecurityPage() {
  return (
    <div className="flex flex-col h-full bg-[#fcfcfc]">
      <AdminHeader
        title="Security & Access"
        subtitle="Privacy controls and access management"
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Authentication Card */}
            <div className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1e1414] mb-1">Two-Factor Auth</h3>
              <p className="text-xs text-[#806b6b] mb-4">
                Add an extra layer of security to your admin account.
              </p>
              <button className="text-xs font-bold text-[#7b2d2d] hover:underline">
                Setup 2FA →
              </button>
            </div>

            {/* Audit Logs Card */}
            <div className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1e1414] mb-1">Activity Logs</h3>
              <p className="text-xs text-[#806b6b] mb-4">
                Monitor recent login attempts and critical system actions.
              </p>
              <button className="text-xs font-bold text-[#7b2d2d] hover:underline">
                View Logs →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#f3f1f1] flex items-center gap-3">
              <Key className="w-5 h-5 text-[#7b2d2d]" />
              <h2 className="font-bold text-[#1e1414]">Roles & Permissions</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#806b6b]">
                Standard Admin Access - You have full control over orders, menu,
                and system settings.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
