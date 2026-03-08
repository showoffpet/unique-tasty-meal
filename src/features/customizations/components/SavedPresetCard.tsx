"use client";

import React from "react";
import Button from "../../../components/ui/Button";

interface PresetItem {
  id: string;
  name: string;
}

export interface SavedPreset {
  id: string;
  name: string;
  meal_name: string;
  spice_level?: string;
  add_ons?: PresetItem[];
  remove_ingredients?: PresetItem[];
  portion_size?: string;
  is_favorite?: boolean;
}

interface SavedPresetCardProps {
  preset: SavedPreset;
  onApply: (presetId: string) => void;
  onEdit: (presetId: string) => void;
  onDelete: (presetId: string) => void;
  onToggleFavorite: (presetId: string, isFav: boolean) => void;
}

export default function SavedPresetCard({
  preset,
  onApply,
  onEdit,
  onDelete,
  onToggleFavorite,
}: SavedPresetCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#f3f1f1] p-5 hover:border-[#D2D2D2] transition-colors flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-[#1e1414] text-lg">{preset.name}</h3>
          <p className="text-sm font-medium text-[#7A2E2E]">
            {preset.meal_name}
          </p>
        </div>
        <button
          onClick={() => onToggleFavorite(preset.id, !preset.is_favorite)}
          className={`p-1.5 rounded-full transition-colors ${preset.is_favorite ? "text-[#ED8B00] bg-[#fcfcfc]" : "text-[#999999] hover:bg-[#f3f1f1]"}`}
        >
          {preset.is_favorite ? (
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 border-current"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex-1 space-y-2 mb-6 text-sm text-[#806b6b]">
        {preset.portion_size && (
          <p>
            <strong className="text-[#1e1414]">Portion:</strong>{" "}
            {preset.portion_size}
          </p>
        )}
        {preset.spice_level && (
          <p>
            <strong className="text-[#1e1414]">Spice Level:</strong>{" "}
            {preset.spice_level}
          </p>
        )}
        {preset.add_ons && preset.add_ons.length > 0 && (
          <p>
            <strong className="text-[#1e1414]">Added:</strong>{" "}
            {preset.add_ons.map((a) => a.name).join(", ")}
          </p>
        )}
        {preset.remove_ingredients && preset.remove_ingredients.length > 0 && (
          <p>
            <strong className="text-[#1e1414]">Removed:</strong>{" "}
            {preset.remove_ingredients.map((r) => r.name).join(", ")}
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-auto pt-4 border-t border-[#f3f1f1]">
        <Button
          variant="primary"
          className="flex-1 bg-[#7A2E2E] hover:bg-[#5E2323]"
          onClick={() => onApply(preset.id)}
        >
          Order This
        </Button>
        <button
          onClick={() => onEdit(preset.id)}
          className="p-2 text-[#806b6b] hover:bg-[#f3f1f1] rounded-lg transition-colors border border-[#f3f1f1]"
          aria-label="Edit preset"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(preset.id)}
          className="p-2 text-[#7b2d2d] hover:bg-[#7b2d2d]/10 rounded-lg transition-colors border border-[#f3f1f1]"
          aria-label="Delete preset"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
