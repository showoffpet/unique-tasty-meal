import React from "react";

interface PresetOption {
  id: string;
  name: string;
  description: string;
  customizationDetails: string; // e.g., "Large • Extra Hot • No Onions"
}

interface PresetCardProps {
  preset: PresetOption;
  onApply: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export default function PresetCard({
  preset,
  onApply,
  onDelete,
  className = "",
}: PresetCardProps) {
  return (
    <div
      className={`bg-white border border-[#f3f1f1] rounded-xl p-4 transition-all hover:border-[#D2D2D2] hover:shadow-sm group flex flex-col ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-[#1e1414]">{preset.name}</h4>
          <p className="text-sm text-[#806b6b] mt-0.5">{preset.description}</p>
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(preset.id);
            }}
            className="text-[#999999] hover:text-[#7b2d2d] p-1 rounded-full hover:bg-[#f3f1f1] transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Delete preset"
          >
            <svg
              className="w-4 h-4"
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
        )}
      </div>

      <div className="bg-[#fcfcfc] p-2.5 rounded-lg border border-[#f3f1f1] mb-4">
        <p className="text-xs text-[#806b6b] font-medium truncate">
          {preset.customizationDetails}
        </p>
      </div>

      <button
        onClick={() => onApply(preset.id)}
        className="mt-auto w-full py-2 px-4 rounded-lg text-sm font-semibold text-[#7A2E2E] bg-[#7A2E2E]/10 hover:bg-[#7A2E2E]/20 transition-colors"
      >
        Apply Preset
      </button>
    </div>
  );
}
