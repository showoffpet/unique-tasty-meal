"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Loader2 } from "lucide-react";

function ReorderProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem, clearCart } = useCartStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    
    if (!orderId) {
      router.push("/account/orders");
      return;
    }

    async function processReorder() {
      try {
        const res = await fetch("/api/orders/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch order details for reorder.");
        }

        const data = await res.json();
        const items = data.items;

        if (items && Array.isArray(items)) {
          // Clear current cart optionally or just append
          clearCart();
          
          items.forEach((item) => {
            addItem({
              id: crypto.randomUUID(), // Or generate based on meal_id + time if needed
              meal_id: item.meal_id || "custom-meal",
              name: item.meal_name || "Unknown Item",
              base_price: item.item_price || 0,
              quantity: item.quantity || 1,
              image_url: "/placeholder.jpg",
              customizations: {
                portion: item.options?.portionSize || "Regular",
                spice_level: item.options?.spice_level || 1,
                instructions: "",
                add_ons: (item.add_ons || []).reduce((acc: Record<string, number>, addon: {name: string, price?: number}) => {
                  acc[addon.name] = addon.price || 0;
                  return acc;
                }, {}),
              },
              price_modifier: (item.add_ons || []).reduce((sum: number, addon: {price?: number}) => sum + (addon.price || 0), 0)
            });
          });

          // Go to cart
          router.push("/cart");
        } else {
          throw new Error("No items found to reorder.");
        }
      } catch (err: unknown) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
        setError(errorMessage);
      }
    }

    processReorder();
  }, [searchParams, router, addItem, clearCart]);

  if (error) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[50vh] p-4 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl max-w-sm w-full">
          <h2 className="font-bold text-lg mb-2">Reorder Failed</h2>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={() => router.push("/account/orders")}
            className="w-full bg-red-600 text-white font-bold py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-12 h-12 text-[#7b2d2d] animate-spin" />
      <h2 className="text-xl font-bold text-[#1e1414]">Adding to cart...</h2>
      <p className="text-[#806b6b]">Preparing your customized order</p>
    </div>
  );
}

export default function ReorderProcessing() {
  return (
    <Suspense fallback={
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-[#7b2d2d] animate-spin" />
        <h2 className="text-xl font-bold text-[#1e1414]">Loading...</h2>
      </div>
    }>
      <ReorderProcessingContent />
    </Suspense>
  );
}
