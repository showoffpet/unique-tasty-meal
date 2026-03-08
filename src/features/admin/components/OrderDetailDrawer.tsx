"use client";

import React, { useEffect } from "react";

interface OrderDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function OrderDetailDrawer({
  isOpen,
  onClose,
  children,
  title = "Order Details",
}: OrderDetailDrawerProps) {
  // Prevent body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-[#fcfcfc] shadow-2xl h-full flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0 overflow-y-auto">
        {/* Header Ribbon */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#f3f1f1] px-6 py-4 flex items-center justify-between shadow-sm">
          <h2 className="text-xl font-bold text-[#1e1414]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-[#999999] hover:bg-[#f3f1f1] hover:text-[#1e1414] transition-colors rounded-full"
            aria-label="Close panel"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
