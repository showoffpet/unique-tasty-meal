import React from "react";
import CartClient from "./CartClient";

export const metadata = {
  title: "Your Cart — UTM",
  description: "Review your meal selections and proceed to checkout.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#f8f6f6] text-[#161313] py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#1e1414] tracking-tight mb-8">
          Your Cart
        </h1>
        <CartClient />
      </div>
    </div>
  );
}
