import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ActiveOrderTracker from "./ActiveOrderTracker";
import PaginatedOrdersGrid from "./PaginatedOrdersGrid";

export const metadata = {
  title: "Order History — UTM",
  description: "View your active and past orders",
};

export default async function OrderHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-3xl font-black text-[#1e1414] mb-8">Your Orders</h1>
        
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#1e1414] text-xl font-bold tracking-tight">
              Active Order
            </h2>
          </div>
          <ActiveOrderTracker userId={user.id} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#1e1414] text-xl font-bold tracking-tight">
              Order History
            </h2>
          </div>
          <PaginatedOrdersGrid userId={user.id} />
        </section>
      </div>
    </div>
  );
}
