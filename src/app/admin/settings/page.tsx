"use client";

import Link from "next/link";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Save,
  User,
  Bell,
  Shield,
  Cpu,
  ChevronRight,
  MapPin,
  Instagram,
  MessageCircle,
  Globe,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  // Unused: userName

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc]">
      <AdminHeader
        title="Admin Settings"
        subtitle="Configure your portal preferences"
      />

      <main className="flex-1 p-8 overflow-y-auto pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Business Profile Section */}
          <section className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#f3f1f1] flex items-center gap-3">
              <User className="w-5 h-5 text-[#7b2d2d]" />
              <h2 className="font-bold text-[#1e1414]">Business Profile</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#806b6b] uppercase">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ""}
                    className="w-full px-4 py-2 border border-[#f3f1f1] rounded-lg text-sm focus:ring-2 focus:ring-[#7b2d2d] focus:outline-none"
                    placeholder="e.g. hello@uniquetastymeals.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#806b6b] uppercase">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#806b6b]" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-[#f3f1f1] rounded-lg text-sm focus:ring-2 focus:ring-[#7b2d2d] focus:outline-none"
                      placeholder="+234..."
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#fcfcfc]">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#806b6b] uppercase">
                    Physical Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#806b6b]" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-[#f3f1f1] rounded-lg text-sm focus:ring-2 focus:ring-[#7b2d2d] focus:outline-none"
                      placeholder="Street name and number"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#806b6b] uppercase">
                    Country / Region
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#806b6b]" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-[#f3f1f1] rounded-lg text-sm focus:ring-2 focus:ring-[#7b2d2d] focus:outline-none"
                      placeholder="e.g. Nigeria"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-4 border-t border-[#fcfcfc]">
                <div className="space-y-1 max-w-md">
                  <label className="text-xs font-bold text-[#806b6b] uppercase">
                    Instagram Handle
                  </label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#806b6b]" />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-[#806b6b]">
                      @
                    </span>
                    <input
                      type="text"
                      className="w-full pl-14 pr-4 py-2 border border-[#f3f1f1] rounded-lg text-sm focus:ring-2 focus:ring-[#7b2d2d] focus:outline-none"
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#fcfcfc]">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#7b2d2d] text-white text-sm font-bold rounded-lg hover:bg-[#561b1b] transition-colors shadow-md">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#f3f1f1] flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#7b2d2d]" />
              <h2 className="font-bold text-[#1e1414]">Notifications</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1e1414]">
                    New Order Alerts
                  </p>
                  <p className="text-xs text-[#806b6b]">
                    Receive a notification when a new batch order is placed
                  </p>
                </div>
                <div className="w-10 h-5 bg-[#7b2d2d] rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Links for Integration & Security */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/admin/integrations"
              className="bg-white p-6 rounded-xl border border-[#f3f1f1] shadow-sm hover:border-[#7b2d2d]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-[#f3f1f1] text-[#1e1414] group-hover:bg-[#7b2d2d]/10 group-hover:text-[#7b2d2d] transition-colors">
                  <Cpu className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#806b6b]" />
              </div>
              <h3 className="font-bold text-[#1e1414]">Integrations</h3>
              <p className="text-xs text-[#806b6b] mt-1">
                Manage API connections and third-party services like Stripe.
              </p>
            </Link>

            <Link
              href="/admin/security"
              className="bg-white p-6 rounded-xl border border-[#f3f1f1] shadow-sm hover:border-[#7b2d2d]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-[#f3f1f1] text-[#1e1414] group-hover:bg-[#7b2d2d]/10 group-hover:text-[#7b2d2d] transition-colors">
                  <Shield className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#806b6b]" />
              </div>
              <h3 className="font-bold text-[#1e1414]">Security</h3>
              <p className="text-xs text-[#806b6b] mt-1">
                Configure account privacy, 2FA, and monitor activity logs.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
