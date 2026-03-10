"use client";

import React, { useState, useEffect } from "react";
import SavedPresetCard, {
  SavedPreset,
} from "../../../features/customizations/components/SavedPresetCard";
import EmptyState from "../../../components/ui/EmptyState";
import Button from "../../../components/ui/Button";
import { getSavedPresets, deletePreset, togglePresetFavorite } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";

export default function SavedCustomizationsPage() {
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPresets() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const data = await getSavedPresets(user.id);
        const mapped: SavedPreset[] = data.map((p) => ({
          id: p.id,
          name: p.name,
          meal_name: p.meals?.name || "Unknown Meal",
          spice_level: p.spice_level > 0 ? ["Mild", "Medium", "Hot", "Extra Hot"][p.spice_level - 1] || "Medium" : undefined,
          portion_size: p.portion_size !== "regular" ? p.portion_size.charAt(0).toUpperCase() + p.portion_size.slice(1) : undefined,
          add_ons: p.add_ons ? Object.entries(p.add_ons as Record<string, number>).map(([name], i) => ({ id: `a${i}`, name })) : undefined,
          remove_ingredients: p.removed_ingredients ? p.removed_ingredients.map((name, i) => ({ id: `r${i}`, name })) : undefined,
          is_favorite: p.is_favorite ?? false,
        }));
        setPresets(mapped);
      } catch (err) {
        console.error("Failed to load presets:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPresets();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleApply = (id: string) => {
    // TODO: Add logic to push this preset directly to cart
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEdit = (id: string) => {
    // TODO: Open CustomizationModal with this preset loaded
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePreset(id);
      setPresets((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete preset:", err);
    }
  };

  const handleToggleFavorite = async (id: string, isFav: boolean) => {
    try {
      await togglePresetFavorite(id, isFav);
      setPresets((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_favorite: isFav } : p)),
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const displayedPresets =
    filter === "favorites" ? presets.filter((p) => p.is_favorite) : presets;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-[#7A2E2E] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1e1414] mb-3">
              Saved Presets
            </h1>
            <p className="text-[#806b6b] max-w-2xl text-lg">
              Quickly reorder your perfectly customized meals. Save your
              favorite combinations to skip the customization step next time.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#f3f1f1] p-1 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-white text-[#1e1414] shadow-sm"
                  : "text-[#806b6b] hover:text-[#1e1414]"
              }`}
            >
              All Presets
            </button>
            <button
              onClick={() => setFilter("favorites")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "favorites"
                  ? "bg-white text-[#ED8B00] shadow-sm"
                  : "text-[#806b6b] hover:text-[#1e1414]"
              }`}
            >
              Favorites Only
            </button>
          </div>
        </div>

        {/* Grid Content */}
        {presets.length === 0 ? (
          <EmptyState
            title="No Saved Presets"
            message="You haven't saved any customized meals yet. When customizing a meal, hit 'Save as Preset'."
            actionLabel="Browse Menu"
            onAction={() => (window.location.href = "/menu")}
            className="my-12"
          />
        ) : displayedPresets.length === 0 ? (
          <EmptyState
            title="No Favorites Found"
            message="You don't have any presets marked as favorite yet."
            actionLabel="View All Presets"
            onAction={() => setFilter("all")}
            className="my-12"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedPresets.map((preset) => (
              <SavedPresetCard
                key={preset.id}
                preset={preset}
                onApply={handleApply}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
