import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PreferencesForm from "./PreferencesForm";

export const metadata = {
  title: "Preferences — UTM",
  description: "Manage your notifications and dietary preferences",
};

export default async function PreferencesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-[#1e1414] mb-2">Preferences</h1>
        <p className="text-sm text-[#999999]">
          Manage your notifications and dietary requirements
        </p>
      </div>
      <PreferencesForm />
    </div>
  );
}
