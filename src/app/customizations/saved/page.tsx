"use client";

import React, { useState } from "react";
import SavedPresetCard, {
  SavedPreset,
} from "../../../features/customizations/components/SavedPresetCard";
import EmptyState from "../../../components/ui/EmptyState";
import Button from "../../../components/ui/Button";

// Mock Data
const MOCK_PRESETS: SavedPreset[] = [
  {
    id: "preset-1",
    name: "My Spicy Chicken",
    meal_name: "Grilled Chicken Salad",
    spice_level: "Medium",
    add_ons: [
      { id: "a1", name: "Avocado" },
      { id: "a2", name: "Extra Dressing" },
    ],
    is_favorite: true,
  },
  {
    id: "preset-2",
    name: "Classic Burger Combo",
    meal_name: "Wagyu Beef Burger",
    remove_ingredients: [
      { id: "r1", name: "Pickles" },
      { id: "r2", name: "Onions" },
    ],
    portion_size: "Large",
    is_favorite: false,
  },
  {
    id: "preset-3",
    name: "Post-Workout Meal",
    meal_name: "Quinoa Bowl with Salmon",
    add_ons: [{ id: "a3", name: "Extra Protein" }],
    is_favorite: true,
  },
];

export default function SavedCustomizationsPage() {
  const [presets, setPresets] = useState<SavedPreset[]>(MOCK_PRESETS);
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleApply = (id: string) => {
    // TODO: Add logic to push this preset directly to cart
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEdit = (id: string) => {
    // TODO: Open CustomizationModal with this preset loaded
  };

  const handleDelete = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleFavorite = (id: string, isFav: boolean) => {
    setPresets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_favorite: isFav } : p)),
    );
  };

  const displayedPresets =
    filter === "favorites" ? presets.filter((p) => p.is_favorite) : presets;

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
