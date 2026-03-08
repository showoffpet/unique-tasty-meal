"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Tag,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAVIGATION = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Batch Orders", href: "/admin/orders", icon: ClipboardList },
  { name: "Menu Management", href: "/admin/menu", icon: UtensilsCrossed },
  { name: "Promo Codes", href: "/admin/promo-codes", icon: Tag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-[#ffffff] border-r border-[#f3f1f1] flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300">
      <div className="p-6 border-b border-[#f3f1f1] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1B4332] flex items-center justify-center text-white font-bold text-sm shrink-0">
          UTM
        </div>
        <div className="flex flex-col overflow-hidden">
          <h1 className="text-[#1e1414] text-sm font-bold leading-tight truncate">
            Unique Tasty Meals
          </h1>
          <p className="text-[#806b6b] text-xs font-normal leading-normal">
            Admin Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
        {NAVIGATION.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#7b2d2d]/10 text-[#7b2d2d] font-semibold"
                  : "text-[#806b6b] hover:bg-[#f3f1f1] hover:text-[#1e1414] font-medium"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
              {item.name === "Batch Orders" && (
                <span className="ml-auto bg-[#7b2d2d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#f3f1f1]">
        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#7b2d2d] text-white text-sm font-bold hover:bg-[#561b1b] transition-colors shadow-sm gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="truncate">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
