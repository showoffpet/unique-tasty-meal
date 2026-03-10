"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Flame,
  Heart,
  Star,
  Clock,
  Utensils,
  UtensilsCrossed,
  Minus,
  Plus,
  ShoppingCart,
  Info,
} from "lucide-react";
import PriceDisplay from "@/components/ui/PriceDisplay";
import DietaryBadges from "@/features/menu/components/DietaryBadges";
import MealCard from "@/features/menu/components/MealCard";
import type { Database } from "@/lib/supabase/database.types";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

type MealRow = Database["public"]["Tables"]["meals"]["Row"];

interface MealDetailClientProps {
  meal: MealRow & {
    restaurant?: {
      id: string;
      name: string;
      logo_url: string | null;
      is_open: boolean;
      next_opening_time: string | null;
    };
    average_rating?: number;
    total_reviews?: number;
    dietary_tags?: string[];
  };
  similarMeals: MealRow[];
}

export default function MealDetailClient({
  meal,
  similarMeals,
}: MealDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState("regular");
  const [spiceLevel, setSpiceLevel] = useState(meal.spice_level || 0);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>(
    {},
  );
  const [isAdding, setIsAdding] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const addItemToCart = useCartStore((state) => state.addItem);

  // Mock portion configurations - in a real app this would come from the database
  const portions = [
    { id: "small", label: "Small", priceModifier: -2.5 },
    { id: "regular", label: "Regular", priceModifier: 0 },
    { id: "large", label: "Large", priceModifier: 4.0 },
  ];

  const currentPortion = portions.find((p) => p.id === selectedPortion);

  // Calculate total add-ons price
  const addOnsPrice = Object.values(selectedAddOns).reduce(
    (sum, price) => sum + price,
    0,
  );

  const calculatedPrice =
    (meal.base_price + (currentPortion?.priceModifier || 0) + addOnsPrice) *
    quantity;

  const handleHighlight = () => {
    setShowHighlight(true);
    setTimeout(() => setShowHighlight(false), 500);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);

    const customizationsHash = btoa(
      JSON.stringify({
        selectedPortion,
        spiceLevel,
        specialInstructions,
        selectedAddOns,
      }),
    ).slice(0, 10);
    const cartItemId = `${meal.id}-${customizationsHash}`;

    addItemToCart({
      id: cartItemId,
      meal_id: meal.id,
      name: meal.name,
      image_url: meal.image_url || "/placeholder.jpg",
      base_price: meal.base_price,
      quantity,
      customizations: {
        portion: selectedPortion,
        spice_level: spiceLevel,
        instructions: specialInstructions,
        add_ons: selectedAddOns,
      },
      price_modifier: (currentPortion?.priceModifier || 0) + addOnsPrice,
    });

    setTimeout(() => {
      setIsAdding(false);
      toast.success(`${quantity}x ${meal.name} added to cart!`, {
        duration: 3000,
        position: "bottom-right",
        style: {
          background: "#FFF",
          color: "#1e1414",
          borderRadius: "12px",
          fontWeight: "bold",
          border: "1px solid #e2e8f0",
        },
      });
    }, 500);
  };

  const handleToggleAddOn = (name: string, price: number) => {
    setSelectedAddOns((prev) => {
      const newAddOns = { ...prev };
      if (newAddOns[name]) {
        delete newAddOns[name];
      } else {
        newAddOns[name] = price;
      }
      return newAddOns;
    });
  };

  const fallbackImages = [
    meal.image_url || "https://picsum.photos/seed/thumb1/400/400",
    "https://picsum.photos/seed/thumb2/400/400",
    "https://picsum.photos/seed/thumb3/400/400",
  ];
  const [activeImage, setActiveImage] = useState(fallbackImages[0]);

  if (!meal.is_available) {
    return (
      <div className="absolute inset-0 bg-[#1e1414]/90 z-50 flex flex-col items-center justify-center text-white backdrop-blur-md min-h-screen">
        <h2 className="text-3xl font-black mb-4">Currently Unavailable</h2>
        <p className="text-[#B3B3B3] mb-8 text-center max-w-md px-6">
          This meal is not available for order right now. We&apos;re sourcing
          fresh ingredients and it will be back soon!
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-8 py-3 bg-[#7b2d2d] rounded-xl font-bold hover:bg-[#561b1b] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f6f6] min-h-screen font-sans text-slate-900 flex flex-col">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm font-medium text-slate-500 items-center">
          <button
            onClick={() => window.history.back()}
            className="hover:text-[#7b2d2d] transition-colors flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Back to Menu
          </button>
          <span className="mx-2">/</span>
          <span className="text-slate-900 truncate max-w-[200px]">
            {meal.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Hero Image & Gallery */}
          <div className="flex flex-col gap-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl bg-slate-100 group">
              <Image
                src={activeImage}
                alt={meal.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-[#7b2d2d] backdrop-blur-sm shadow-sm">
                  <Flame size={14} className="mr-1" />
                  Best Seller
                </span>
                {meal.dietary_tags && meal.dietary_tags.length > 0 && (
                  <DietaryBadges tags={meal.dietary_tags} size="sm" />
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {fallbackImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors relative ${activeImage === imgUrl ? "border-[#7b2d2d] ring-2 ring-[#7b2d2d]/20" : "border-transparent hover:border-slate-300"}`}
                >
                  <Image
                    src={imgUrl}
                    alt="Thumbnail view"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details & Customizations */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
                  {meal.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm mt-3">
                  {meal.average_rating ? (
                    <div className="flex items-center text-yellow-500">
                      <Star size={18} fill="currentColor" strokeWidth={0} />
                      <span className="font-bold ml-1 text-slate-900">
                        {meal.average_rating.toFixed(1)}
                      </span>
                      <span className="text-slate-500 ml-1">
                        ({meal.total_reviews || 0} reviews)
                      </span>
                    </div>
                  ) : null}
                  {meal.average_rating ? (
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  ) : null}

                  <span className="text-slate-500 flex items-center">
                    <Clock size={16} className="mr-1" />
                    {meal.preparation_time} min
                  </span>

                  {meal.nutritional_info &&
                    typeof meal.nutritional_info === "object" &&
                    "calories" in meal.nutritional_info && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-slate-500 flex items-center">
                          <Utensils size={16} className="mr-1" />
                          {String(
                            (meal.nutritional_info as Record<string, unknown>)
                              .calories,
                          )}{" "}
                          kcal
                        </span>
                      </>
                    )}
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-[#7b2d2d] transition-colors rounded-full hover:bg-slate-100 flex-shrink-0">
                <Heart size={28} />
              </button>
            </div>

            <div className="h-px bg-slate-200 my-6"></div>

            <p className="text-slate-600 leading-relaxed text-lg mb-8">
              {meal.description}
            </p>

            {/* Ingredients Tags */}
            {meal.ingredients && meal.ingredients.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                  Key Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {meal.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens Warning */}
            {meal.allergens && meal.allergens.length > 0 && (
              <div className="mb-8 flex items-start gap-3 bg-[#FCF0F0] border border-[#FADBD8] rounded-xl p-4">
                <Info size={20} className="text-[#C0392B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#C0392B] mb-1 uppercase tracking-wider">
                    Allergen Warning
                  </h4>
                  <p className="text-sm text-[#922B21]">
                    This meal contains{" "}
                    <strong>{meal.allergens.join(", ")}</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Customizations Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8 flex flex-col gap-6">
              {/* Portion Size */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <UtensilsCrossed size={18} className="text-[#7b2d2d]" />
                  Portion Size
                </h3>
                <div className="space-y-3">
                  {portions.map((portion) => (
                    <label
                      key={portion.id}
                      onClick={() => {
                        setSelectedPortion(portion.id);
                        handleHighlight();
                      }}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedPortion === portion.id
                          ? "border-[#7b2d2d] bg-[#7b2d2d]/5"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPortion === portion.id ? "border-[#7b2d2d]" : "border-slate-300"}`}
                        >
                          {selectedPortion === portion.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#7b2d2d]"></div>
                          )}
                        </div>
                        <span
                          className={`font-medium ${selectedPortion === portion.id ? "text-slate-900" : "text-slate-700"}`}
                        >
                          {portion.label}
                        </span>
                      </div>
                      <span
                        className={`text-sm ${selectedPortion === portion.id ? "font-semibold text-[#7b2d2d]" : "text-slate-500"}`}
                      >
                        {portion.priceModifier > 0
                          ? `+$${portion.priceModifier.toFixed(2)}`
                          : portion.priceModifier < 0
                            ? `-$${Math.abs(portion.priceModifier).toFixed(2)}`
                            : "Included"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Spice Level */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Flame size={18} className="text-[#D83B01]" />
                    Spice Level
                  </h3>
                  <span className="text-sm font-bold text-[#D83B01]">
                    {Array.from({ length: spiceLevel }).map((_, i) => (
                      <span key={i}>🌶️</span>
                    ))}
                    {spiceLevel === 0 && "No Spice"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none accent-[#D83B01] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 font-medium mt-2">
                  <span>Mild</span>
                  <span>Medium</span>
                  <span>Extra Hot</span>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Add-ons */}
              {meal.add_ons &&
                typeof meal.add_ons === "object" &&
                Object.keys(meal.add_ons).length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <ShoppingCart size={18} className="text-[#3b82f6]" />
                      Optional Extras
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(
                        meal.add_ons as Record<string, number>,
                      ).map(([name, price]) => {
                        const isSelected = !!selectedAddOns[name];
                        const numericPrice =
                          typeof price === "number"
                            ? price
                            : parseFloat(String(price));
                        return (
                          <label
                            key={name}
                            onClick={() => {
                              handleToggleAddOn(name, numericPrice);
                              handleHighlight();
                            }}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#7b2d2d] bg-[#7b2d2d]/5"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? "border-[#7b2d2d] bg-[#7b2d2d]" : "border-slate-300 bg-white"}`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span
                                className={`font-medium ${isSelected ? "text-slate-900" : "text-slate-700"}`}
                              >
                                {name}
                              </span>
                            </div>
                            <span className="text-sm text-slate-500">
                              +${numericPrice.toFixed(2)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Special Instructions */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Special Instructions
                </h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Please put sauce on the side."
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 resize-none h-20 text-sm focus:outline-none focus:border-[#7b2d2d] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="flex-grow"></div>

            {/* Desktop Action Bar (Fixed at bottom of right column) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 pb-8 md:pb-0 sticky bottom-4 z-20 bg-[#f8f6f6] md:bg-transparent">
              <div className="flex items-center bg-slate-100 rounded-lg p-1 w-full sm:w-auto self-stretch sm:self-auto border border-slate-200">
                <button
                  onClick={() => {
                    setQuantity(Math.max(1, quantity - 1));
                    handleHighlight();
                  }}
                  className="w-12 sm:w-10 h-10 sm:h-auto flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-slate-600 transition-all font-bold"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold text-lg text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => {
                    setQuantity(Math.min(99, quantity + 1));
                    handleHighlight();
                  }}
                  className="w-12 sm:w-10 h-10 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-slate-600 transition-all font-bold"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 w-full bg-[#7b2d2d] hover:bg-[#561b1b] text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-[#7b2d2d]/30 flex items-center justify-between px-6 transition-transform active:scale-[0.99] disabled:opacity-80"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart size={20} />
                  <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
                </div>
                <PriceDisplay
                  amount={calculatedPrice}
                  className={`bg-white/20 px-3 py-1 rounded-lg text-base backdrop-blur-sm transition-transform ${showHighlight ? "scale-110 text-[#FFD700]" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Similar Meals */}
        {similarMeals && similarMeals.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                You might also like
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarMeals.map((sm) => (
                <MealCard key={sm.id} meal={sm} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
