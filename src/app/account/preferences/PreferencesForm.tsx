"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface PreferencesFormData {
  emailNotifications: boolean;
  smsNotifications: boolean;
  dietaryRestrictions: string;
}

export default function PreferencesForm() {
  const [formData, setFormData] = useState<PreferencesFormData>({
    emailNotifications: true,
    smsNotifications: false,
    dietaryRestrictions: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPreferences() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("users")
            .select(
              "dietary_restrictions, email_notifications, sms_notifications",
            )
            .eq("id", user.id)
            .single();

          if (!error && data) {
            setFormData({
              emailNotifications: data.email_notifications ?? true,
              smsNotifications: data.sms_notifications ?? false,
              dietaryRestrictions: data.dietary_restrictions || "",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load preferences", err);
      } finally {
        setIsFetching(false);
      }
    }

    loadPreferences();
  }, []);

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
          dietary_restrictions: formData.dietaryRestrictions,
          email_notifications: formData.emailNotifications,
          sms_notifications: formData.smsNotifications,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      setMessage("Preferences saved successfully!");
    } catch {
      setMessage("Failed to save preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (field: keyof PreferencesFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (isFetching) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-[#f3f1f1] p-6 sm:p-8 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 w-full bg-gray-100 rounded"></div>
          <div className="h-10 w-full bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md border border-[#f3f1f1] p-6 sm:p-8 space-y-8"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#1e1414] mb-1">
            Notifications
          </h2>
          <p className="text-sm text-[#999999]">
            Choose how you want to be updated about your orders.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-[#f3f1f1] rounded-xl hover:border-[#D2D2D2] transition-colors">
            <div>
              <p className="font-medium text-[#1e1414]">Email Notifications</p>
              <p className="text-sm text-[#999999]">
                Order confirmations and delivery updates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("emailNotifications")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.emailNotifications ? "bg-[#7b2d2d]" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.emailNotifications
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-[#f3f1f1] rounded-xl hover:border-[#D2D2D2] transition-colors">
            <div>
              <p className="font-medium text-[#1e1414]">SMS Notifications</p>
              <p className="text-sm text-[#999999]">
                Real-time text alerts for delivery tracking.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("smsNotifications")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.smsNotifications ? "bg-[#7b2d2d]" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.smsNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-[#f3f1f1]" />

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#1e1414] mb-1">
            Dietary Preferences
          </h2>
          <p className="text-sm text-[#999999]">
            Let us know about any allergies or restrictions.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1e1414] mb-1.5">
            Dietary Notes
          </label>
          <textarea
            value={formData.dietaryRestrictions}
            onChange={(e) =>
              setFormData({ ...formData, dietaryRestrictions: e.target.value })
            }
            placeholder="e.g., Peanut allergy, vegetarian, gluten-free..."
            className="w-full px-4 py-3 rounded-xl border border-[#D2D2D2] bg-white text-[#1e1414] placeholder-[#B3B3B3] focus:outline-none focus:border-[#7b2d2d] focus:ring-1 focus:ring-[#7b2d2d] transition-all resize-none h-32"
          />
        </div>
      </div>

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

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          isLoading={isLoading}
          size="lg"
          className="w-full sm:w-auto px-8"
        >
          Save Preferences
        </Button>
      </div>
    </form>
  );
}
