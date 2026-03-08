import React from "react";
import PriceDisplay from "../../../components/ui/PriceDisplay";

interface AddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
  isPopular?: boolean;
}

interface AddOnsListProps {
  addons: AddOn[];
  selectedAddOns: string[]; // array of selected addon ids
  onToggle: (id: string, price: number) => void;
  className?: string;
}

export default function AddOnsList({
  addons,
  selectedAddOns,
  onToggle,
  className = "",
}: AddOnsListProps) {
  if (!addons || addons.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#1e1414]">Optional Extras</h3>
        <span className="text-xs text-[#999999]">Select up to 3</span>
      </div>

      <div className="flex flex-col gap-3">
        {addons.map((addon) => {
          const isSelected = selectedAddOns.includes(addon.id);
          const isDisabled = !isSelected && selectedAddOns.length >= 3;

          return (
            <label
              key={addon.id}
              className={`
                relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                ${
                  isSelected
                    ? "bg-[#7A2E2E]/5 border-[#7A2E2E] ring-1 ring-[#7A2E2E]"
                    : isDisabled
                      ? "bg-[#f3f1f1] border-[#f3f1f1] opacity-70 cursor-not-allowed"
                      : "bg-white border-[#f3f1f1] hover:border-[#D2D2D2]"
                }
              `}
            >
              <div className="flex items-center h-5 mr-4 shrink-0">
                <input
                  type="checkbox"
                  className={`
                    w-5 h-5 text-[#7A2E2E] bg-white border border-[#D2D2D2] rounded transition-colors
                    ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
                    focus:ring-[#7A2E2E]/40 focus:ring-2 focus:ring-offset-1
                  `}
                  checked={isSelected}
                  onChange={() => onToggle(addon.id, addon.price)}
                  disabled={isDisabled}
                  aria-label={`Add ${addon.name}`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-medium ${isSelected ? "text-[#1e1414]" : "text-[#1e1414]"}`}
                    >
                      {addon.name}
                    </span>
                    {addon.isPopular && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#ED8B00]/10 text-[#ED8B00] uppercase tracking-wide">
                        Popular
                      </span>
                    )}
                  </div>
                  <span className="text-[#1e1414] shrink-0 font-medium">
                    +
                    <PriceDisplay
                      amount={addon.price}
                      className="inline-block"
                    />
                  </span>
                </div>
                {addon.description && (
                  <p className="text-sm text-[#806b6b] mt-1 pr-12">
                    {addon.description}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
