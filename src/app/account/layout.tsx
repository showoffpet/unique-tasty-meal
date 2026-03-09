import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountSidebar from "@/components/account/AccountSidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single();

  const userName = profile?.name || user.email?.split("@")[0] || "User";

  return (
    <div className="flex flex-col flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8 lg:flex-row">
      <AccountSidebar userName={userName} />

      <main className="flex flex-col flex-1 gap-8 min-w-0">
        {/* Mobile Greeting (Visible only on smaller screens) */}
        <div className="lg:hidden flex items-center gap-3 mb-2">
          <div className="flex flex-col">
            <h1 className="text-[#161313] text-xl font-bold">
              Hello, {userName.split(" ")[0]}
            </h1>
            <p className="text-[#806b6b] text-sm">Let's see what's cooking.</p>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
