import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export const metadata = {
  title: "Edit Profile — UTM",
  description: "Update your Unique Tasty Meals profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-[#1e1414] mb-2">Edit Profile</h1>
        <p className="text-sm text-[#999999]">
          Manage your personal information and preferences
        </p>
      </div>
      <ProfileForm
        initialData={{
          name: profile?.name || "",
          email: profile?.email || user.email || "",
          avatarUrl: profile?.avatar_url || "",
        }}
      />
    </div>
  );
}
