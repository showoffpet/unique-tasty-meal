"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  MapPin,
  Clock,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Don't show this navbar on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md py-3 shadow-sm border-b border-[#f3f1f1]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#7b2d2d] rounded-xl flex items-center justify-center shadow-lg shadow-[#7b2d2d]/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl leading-none">
              S
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-tight text-[#1e1414] leading-tight uppercase">
              Unique Tasty
            </span>
            <span className="font-bold text-[10px] tracking-[0.2em] text-[#7b2d2d] leading-tight uppercase">
              Meals
            </span>
          </div>
        </Link>

        {/* Centered Navigation - Desktop */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[13px] font-bold uppercase tracking-widest transition-all hover:text-[#7b2d2d] relative group ${
                pathname === link.href ? "text-[#7b2d2d]" : "text-[#806b6b]"
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#7b2d2d] transition-transform duration-300 origin-left ${
                  pathname === link.href
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Actions & Auth */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="p-2.5 text-[#1e1414] hover:bg-[#7b2d2d]/5 rounded-full transition-colors relative group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#7b2d2d] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white px-1">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="p-1 border-2 border-transparent hover:border-[#7b2d2d]/20 rounded-full transition-all focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#f3f1f1] flex items-center justify-center text-[#1e1414] font-bold text-sm overflow-hidden border border-[#D2D2D2]">
                  {user.user_metadata?.full_name?.charAt(0).toUpperCase() ||
                    user.email?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[#f3f1f1] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="px-4 py-3 border-b border-[#fcfcfc] bg-zinc-50/50">
                    <p className="text-sm font-bold text-[#1e1414] truncate">
                      {user.user_metadata?.full_name || "User Account"}
                    </p>
                    <p className="text-xs text-[#806b6b] truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/account/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#806b6b] hover:text-[#1e1414] hover:bg-[#fcfcfc] transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Account Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#806b6b] hover:text-[#1e1414] hover:bg-[#fcfcfc] transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      Order History
                    </Link>
                    <Link
                      href="/account/addresses"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#806b6b] hover:text-[#1e1414] hover:bg-[#fcfcfc] transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      Saved Addresses
                    </Link>
                    <Link
                      href="/account/preferences"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#806b6b] hover:text-[#1e1414] hover:bg-[#fcfcfc] transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Preferences
                    </Link>
                  </div>
                  <div className="py-1 border-t border-[#fcfcfc]">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#7b2d2d] hover:bg-[#7b2d2d]/5 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:block px-5 py-2 overflow-hidden relative group rounded-lg bg-white border border-[#D2D2D2] shadow-sm hover:border-[#7b2d2d] hover:shadow-md transition-all duration-300"
            >
              <span className="relative z-10 text-sm font-bold text-[#1e1414] group-hover:text-white transition-colors duration-300">
                Log In
              </span>
              <div className="absolute inset-0 h-full w-full bg-[#7b2d2d] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2.5 text-[#1e1414]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[#f3f1f1] animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-bold py-2 ${
                  pathname === link.href ? "text-[#7b2d2d]" : "text-[#1e1414]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
