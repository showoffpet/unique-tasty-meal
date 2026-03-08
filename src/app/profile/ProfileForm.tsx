"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    avatarUrl: string;
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [name, setName] = useState(initialData.name);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("users")
        .update({
          name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        setMessage("Failed to update profile. Please try again.");
      } else {
        setMessage("Profile updated successfully!");
      }
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md border border-[#f3f1f1] p-6 sm:p-8 space-y-6"
    >
      {/* Avatar placeholder */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#7b2d2d]/10 flex items-center justify-center text-[#7b2d2d] text-xl font-bold">
          {name ? name.charAt(0).toUpperCase() : "?"}
        </div>
        <div>
          <p className="text-sm font-medium text-[#1e1414]">
            {name || "Your Name"}
          </p>
          <p className="text-xs text-[#999999]">{initialData.email}</p>
        </div>
      </div>

      <Input
        label="Full Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your full name"
      />

      <Input
        label="Email Address"
        type="email"
        value={initialData.email}
        disabled
        className="opacity-60 cursor-not-allowed"
      />

      {message && (
        <div
          className={`text-sm rounded-lg px-4 py-3 ${
            message.includes("success")
              ? "bg-[#2E7A2E]/5 text-[#2E7A2E] border border-[#2E7A2E]/20"
              : "bg-[#7b2d2d]/5 text-[#7b2d2d] border border-[#7b2d2d]/20"
          }`}
        >
          {message}
        </div>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
        Save Changes
      </Button>
    </form>
  );
}
