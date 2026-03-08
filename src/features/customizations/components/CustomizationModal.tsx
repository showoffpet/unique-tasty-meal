"use client";

import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealId: string;
  mealName: string;
  basePrice: number;
}

export default function CustomizationModal({
  isOpen,
  onClose,
  mealId,
  mealName,
  basePrice,
}: CustomizationModalProps) {
  const [spiceLevel, setSpiceLevel] = useState<number>(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  // Mock customization options
  const addOons = [
    { id: "a1", name: "Extra Cheese", price: 1.5 },
    { id: "a2", name: "Bacon", price: 2.0 },
    { id: "a3", name: "Avocado", price: 1.5 },
  ];

  const removable = [
    { id: "r1", name: "Onions" },
    { id: "r2", name: "Tomatoes" },
    { id: "r3", name: "Pickles" },
  ];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalAddOnPrice = selectedAddOns.reduce((total, id) => {
    const addOn = addOons.find((a) => a.id === id);
    return total + (addOn?.price || 0);
  }, 0);

  const finalPrice = basePrice + totalAddOnPrice;

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleRemove = (id: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleAddToCart = () => {
    // TODO: Add to cart with customizations (mealId, spiceLevel, selectedAddOns, removedIngredients)
    onClose();
  };

  const handleSavePreset = () => {
    // TODO: Save preset and show Toast (mealId, spiceLevel, selectedAddOns, removedIngredients)
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div
        className="fixed inset-0 bg-[#1e1414]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg m-auto z-50 flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-in slide-in-from-bottom-4 sm:zoom-in-95">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-[#f3f1f1]">
          <div>
            <h2 className="text-xl font-bold text-[#1e1414]">{mealName}</h2>
            <p className="text-[#806b6b]">Customize your order</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#999999] hover:text-[#1e1414] hover:bg-[#f3f1f1] rounded-full transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-8">
          {/* Spice Level */}
          <section>
            <h3 className="font-bold text-[#1e1414] mb-4 text-sm uppercase tracking-wider">
              Spice Level
            </h3>
            <div className="flex justify-between gap-2">
              {[0, 1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => setSpiceLevel(level)}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                    spiceLevel === level
                      ? "border-[#7b2d2d] bg-[#7b2d2d]/5 text-[#7b2d2d]"
                      : "border-[#f3f1f1] text-[#806b6b] hover:border-[#D2D2D2]"
                  }`}
                >
                  {level === 0 ? "None" : Array(level).fill("🌶️").join("")}
                </button>
              ))}
            </div>
          </section>

          {/* Add-ons */}
          <section>
            <h3 className="font-bold text-[#1e1414] mb-4 text-sm uppercase tracking-wider">
              Add-ons
            </h3>
            <div className="space-y-3">
              {addOons.map((addon) => (
                <label
                  key={addon.id}
                  className="flex items-center justify-between p-3 border border-[#f3f1f1] rounded-xl hover:bg-[#fcfcfc] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedAddOns.includes(addon.id)}
                      onChange={() => toggleAddOn(addon.id)}
                      className="w-5 h-5 text-[#7A2E2E] rounded border-[#CCCCCC] focus:ring-[#7A2E2E]"
                    />
                    <span className="font-medium text-[#1e1414]">
                      {addon.name}
                    </span>
                  </div>
                  <span className="text-[#806b6b]">
                    +${addon.price.toFixed(2)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Remove Ingredients */}
          <section>
            <h3 className="font-bold text-[#1e1414] mb-4 text-sm uppercase tracking-wider">
              Remove Ingredients
            </h3>
            <div className="flex flex-wrap gap-3">
              {removable.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleRemove(item.id)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    removedIngredients.includes(item.id)
                      ? "bg-[#7b2d2d]/10 border-[#7b2d2d] text-[#7b2d2d]"
                      : "bg-white border-[#f3f1f1] text-[#806b6b] hover:border-[#CCCCCC]"
                  }`}
                >
                  {removedIngredients.includes(item.id) ? "Removed: " : ""}
                  {item.name}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#f3f1f1] bg-[#fcfcfc] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-[#806b6b]">Total</span>
              <span className="text-2xl font-bold text-[#1e1414]">
                ${finalPrice.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex w-full sm:w-auto gap-3">
            <Button
              variant="ghost"
              className="flex-1 sm:flex-none"
              onClick={handleSavePreset}
            >
              Save as Preset
            </Button>
            <Button
              variant="primary"
              className="flex-1 sm:flex-none uppercase tracking-wide font-bold"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
