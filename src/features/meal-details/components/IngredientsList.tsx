import React from "react";

interface IngredientsListProps {
  ingredients: string[] | null;
  allergens: string[] | null;
  className?: string;
}

export default function IngredientsList({
  ingredients,
  allergens,
  className = "",
}: IngredientsListProps) {
  if (!ingredients || ingredients.length === 0) return null;

  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-[#1e1414] mb-4">Ingredients</h3>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
        {ingredients.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-[#806b6b]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D2D2D2] mt-2 shrink-0"></span>
            <span className="capitalize">{item.trim()}</span>
          </li>
        ))}
      </ul>

      {allergens && allergens.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[#f3f1f1]">
          <h4 className="text-sm font-medium text-[#7b2d2d] mb-2 flex items-center gap-1.5">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            Allergen Warning
          </h4>
          <p className="text-sm text-[#806b6b]">
            This meal contains:{" "}
            <strong className="text-[#1e1414] font-medium capitalize">
              {allergens.join(", ")}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
