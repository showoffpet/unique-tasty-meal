"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  History,
  MapPin,
  Heart,
  CreditCard,
  Settings,
} from "lucide-react";

interface AccountSidebarProps {
  userName: string;
}

export default function AccountSidebar({ userName }: AccountSidebarProps) {
  const pathname = usePathname();

  const links = [
    { name: "Profile", href: "/account/profile", icon: User },
    { name: "Order History", href: "/account/orders", icon: History },
    { name: "Saved Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Favorites", href: "/account/favorites", icon: Heart },
    {
      name: "Payment Methods",
      href: "/account/payment/methods",
      icon: CreditCard,
    },
    { name: "Preferences", href: "/account/preferences", icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6">
      {/* User Info Card */}
      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-[#f3f1f1]">
        <div className="w-12 h-12 rounded-full bg-[#7b2d2d]/10 flex items-center justify-center text-[#7b2d2d] text-lg font-bold shrink-0">
          {userName ? userName.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-[#1e1414] text-base font-bold leading-tight truncate">
            Welcome, {userName.split(" ")[0]}
          </h1>
          <p className="text-[#7b2d2d] text-xs font-semibold uppercase tracking-wider mt-0.5">
            Member
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 bg-white p-2 rounded-2xl shadow-sm border border-[#f3f1f1] h-fit">
        {links.map((link) => {
          const isActive = pathname?.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-[#7b2d2d]/10 text-[#7b2d2d]"
                  : "text-[#999999] hover:bg-[#F8F8F8] hover:text-[#1e1414]"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? "" : "group-hover:scale-110"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}
              >
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
