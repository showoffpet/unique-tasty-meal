import React from "react";

interface Nutrients {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  [key: string]: number | undefined | string; // Flexibility for other nutrients
}

interface NutritionalInfoProps {
  info: Nutrients | null | any; // Any because it's JSON from Supabase
  className?: string;
}

export default function NutritionalInfo({
  info,
  className = "",
}: NutritionalInfoProps) {
  if (!info || Object.keys(info).length === 0) return null;

  // Type assertion or safe extraction
  const nutrients: Nutrients =
    typeof info === "object" && !Array.isArray(info) ? (info as Nutrients) : {};

  // Extract main macros if they exist
  const mainMacros = [
    { label: "Calories", value: nutrients.calories, unit: "kcal" },
    { label: "Protein", value: nutrients.protein, unit: "g" },
    { label: "Carbs", value: nutrients.carbs, unit: "g" },
    { label: "Fat", value: nutrients.fat, unit: "g" },
  ].filter((macro) => macro.value !== undefined && macro.value !== null);

  if (mainMacros.length === 0) return null;

  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-[#1e1414] mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-[#7A2E2E]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        Nutritional Value
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {mainMacros.map((macro, idx) => (
          <div
            key={idx}
            className="bg-[#fcfcfc] p-4 rounded-lg flex flex-col items-center justify-center text-center"
          >
            <span className="text-[#806b6b] text-xs font-medium uppercase tracking-wider mb-1">
              {macro.label}
            </span>
            <span className="text-xl font-bold text-[#1e1414]">
              {macro.value}
              <span className="text-sm font-medium text-[#999999] ml-0.5">
                {macro.unit}
              </span>
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#999999] mt-4 text-center">
        * Nutritional values are estimates based on standard portion sizes.
      </p>
    </div>
  );
}
