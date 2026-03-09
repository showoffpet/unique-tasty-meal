import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ActiveOrderTracker from "./ActiveOrderTracker";
import RecentOrdersGrid from "./RecentOrdersGrid";

export const metadata = {
  title: "Order History — UTM",
  description: "View your active and recent orders",
};

export default async function OrderHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-8 w-full">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#161313] text-2xl font-bold tracking-tight">
            Active Order
          </h2>
        </div>
        <ActiveOrderTracker userId={user.id} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#161313] text-xl font-bold tracking-tight">
            Order History
          </h2>
        </div>
        <RecentOrdersGrid userId={user.id} />
      </section>
    </div>
  );
}
