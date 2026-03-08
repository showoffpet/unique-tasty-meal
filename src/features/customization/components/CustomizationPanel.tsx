"use client";

import React, { useState } from "react";
import PortionSelector from "../../meal-details/components/PortionSelector";
import AddOnsList from "../../meal-details/components/AddOnsList";
import SpiceLevelPicker from "./SpiceLevelPicker";
import Button from "../../../components/ui/Button";
import PriceDisplay from "../../../components/ui/PriceDisplay";
import type { Database } from "@/lib/supabase/database.types";
import type { CustomizedCartData } from "../types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];

interface CustomizationPanelProps {
  meal: Meal;
  onAddToCart: (customizedData: CustomizedCartData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function CustomizationPanel({
  meal,
  onAddToCart,
  onCancel,
  isLoading = false,
  className = "",
}: CustomizationPanelProps) {
  const [portion, setPortion] = useState("regular");
  const [portionPrice, setPortionPrice] = useState(0);
  const [spiceLevel, setSpiceLevel] = useState(meal.spice_level || 2);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [addOnsTotal, setAddOnsTotal] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handlePortionChange = (id: string, modifier: number) => {
    setPortion(id);
    setPortionPrice(modifier);
  };

  const handleAddOnChange = (id: string, price: number) => {
    setSelectedAddOns((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        setAddOnsTotal((current) => current - price);
        return prev.filter((item) => item !== id);
      } else if (prev.length < 3) {
        setAddOnsTotal((current) => current + price);
        return [...prev, id];
      }
      return prev;
    });
  };

  const calculateTotal = () => {
    return meal.base_price + portionPrice + addOnsTotal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddToCart({
      meal_id: meal.id,
      portion_size: portion,
      portion_modifier: portionPrice,
      spice_level: spiceLevel,
      add_ons: selectedAddOns, // In a real app, Map to full objects if needed
      add_ons_total: addOnsTotal,
      special_instructions: specialInstructions,
      total_price: calculateTotal(),
    });
  };

  // Mock data parsing for the purpose of the UI component
  // In a real implementation, you'd parse meal.portion_options and meal.add_ons properly
  const portionOptions = [
    {
      id: "regular",
      label: "Regular",
      priceModifier: 0,
      description: "Standard serving size",
    },
    {
      id: "large",
      label: "Large",
      priceModifier: 3.5,
      description: "50% more meat and sides",
    },
  ];

  const availableAddOns = [
    { id: "extra_protein", name: "Extra Protein", price: 4.5, isPopular: true },
    { id: "avocado", name: "Fresh Avocado", price: 2.0 },
    { id: "side_salad", name: "Side Salad", price: 3.5 },
    { id: "extra_sauce", name: "Extra Sauce", price: 0.5 },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col h-full bg-white ${className}`}
    >
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Header Summary */}
        <div>
          <h2 className="text-2xl font-bold text-[#1e1414] mb-2">
            Customize {meal.name}
          </h2>
          <p className="text-[#806b6b]">
            Base Price:{" "}
            <PriceDisplay amount={meal.base_price} className="inline-block" />
          </p>
        </div>

        {/* Portions */}
        <div className="pt-6 border-t border-[#f3f1f1]">
          <PortionSelector
            value={portion}
            onChange={handlePortionChange}
            options={portionOptions}
          />
        </div>

        {/* Spice Level */}
        {meal.spice_level !== null && (
          <div className="pt-6 border-t border-[#f3f1f1]">
            <SpiceLevelPicker value={spiceLevel} onChange={setSpiceLevel} />
          </div>
        )}

        {/* Add-ons */}
        <div className="pt-6 border-t border-[#f3f1f1]">
          <AddOnsList
            addons={availableAddOns}
            selectedAddOns={selectedAddOns}
            onToggle={handleAddOnChange}
          />
        </div>

        {/* Special Instructions */}
        <div className="pt-6 border-t border-[#f3f1f1]">
          <h3 className="font-semibold text-[#1e1414] mb-3">
            Special Instructions
          </h3>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="e.g., No onions, extra crispy, sauce on the side..."
            rows={3}
            className="w-full rounded-xl border border-[#f3f1f1] p-3 text-sm focus:ring-2 focus:ring-[#7A2E2E]/40 focus:border-[#7A2E2E] outline-none resize-none"
            maxLength={150}
          />
          <div className="text-right text-xs text-[#999999] mt-1">
            {specialInstructions.length}/150
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 bg-white border-t border-[#f3f1f1] p-4 sm:p-6 pb-safe">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-[#806b6b]">Total</span>
          <PriceDisplay
            amount={calculateTotal()}
            className="text-2xl font-bold text-[#1e1414]"
          />
        </div>
        <div className="flex gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              className="w-1/3"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isLoading}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </form>
  );
}
