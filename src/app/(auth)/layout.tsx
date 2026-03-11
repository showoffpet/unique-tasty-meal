import React from "react";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side — Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/auth-hero.png"
          alt="Premium African cuisine — Jollof rice with grilled chicken"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#7b2d2d]/90 via-[#7b2d2d]/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white z-10">
          <h2 className="text-4xl font-black mb-3 leading-tight drop-shadow-xl tracking-tight">
            Premium Meals,
            <br />
            Delivered Fresh.
          </h2>
          <p className="text-white/90 text-lg max-w-md drop-shadow font-medium">
            Discover a variety of delicious, customizable meals crafted with
            fresh ingredients and authentic flavors.
          </p>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="flex-1 flex items-center justify-center bg-[#F8F8F8] px-6 py-8 lg:py-0">
        <div className="w-full max-w-md">
          {/* Mobile Hero */}
          <div className="lg:hidden relative w-full h-48 rounded-2xl overflow-hidden mb-8 shadow-lg">
            <Image
              src="/auth-hero.png"
              alt="Premium cuisine"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#7b2d2d]/80 to-transparent" />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
