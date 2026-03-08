"use client";

import React from "react";
import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-2xl font-bold text-[#1e1414] tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-[#999999]">{subtitle}</p>}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl shadow-md border border-[#f3f1f1] p-6 sm:p-8 space-y-6">
        {children}
      </div>

      {/* Footer */}
      {footerText && footerLinkText && footerLinkHref && (
        <p className="text-center text-sm text-[#999999]">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="text-[#7b2d2d] font-bold hover:text-[#561b1b] transition-colors hover:underline"
          >
            {footerLinkText}
          </Link>
        </p>
      )}
    </div>
  );
}
