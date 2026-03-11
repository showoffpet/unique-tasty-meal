import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OrderDetailClient from "./OrderDetailClient";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Order Details — UTM",
  description: "View details of your past order",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch the order. Security policy ensures user can only fetch their own orders.
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-[#1e1414] mb-4">Order Not Found</h1>
        <p className="text-[#806b6b] mb-8">
          The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
        <Link 
          href="/account/orders"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e1414] text-white rounded-lg font-semibold hover:bg-[#2d2424] transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Breadcrumbs
          items={[
            { label: "Account", href: "/account" },
            { label: "Orders", href: "/account/orders" },
            { label: `Order #${id.split("-")[0].toUpperCase()}` },
          ]}
        />
        <div className="mt-4 flex items-center justify-between">
            <h1 className="text-3xl font-black text-[#1e1414] tracking-tight">
            Order Details
            </h1>
            <Link 
                href="/account/orders"
                className="text-sm font-semibold text-[#806b6b] hover:text-[#1e1414] flex items-center gap-1 transition-colors"
            >
                <ArrowLeft size={16} />
                Back
            </Link>
        </div>
      </div>

      <OrderDetailClient order={order} />
    </div>
  );
}
