"use client";

import React, { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Toggle from "../../../components/ui/Toggle";
import Dropdown from "../../../components/ui/Dropdown";
import MultiSelectCheckboxes from "../../profile/components/MultiSelectCheckboxes";
import type { Database } from "@/lib/supabase/database.types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];
type Category = Database["public"]["Tables"]["meal_categories"]["Row"];

interface MealFormProps {
  initialData?: Meal;
  categories: Category[];
  onSubmit: (data: Partial<Meal>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function MealForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
  className = "",
}: MealFormProps) {
  const [formData, setFormData] = useState<Partial<Meal>>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    base_price: initialData?.base_price || 0,
    category_id: initialData?.category_id || "",
    is_available: initialData?.is_available ?? true,
    preparation_time: initialData?.preparation_time || 15,
    dietary_tags: initialData?.dietary_tags || [],
    allergens: initialData?.allergens || [],
    ingredients: initialData?.ingredients || [],
    image_url: initialData?.image_url || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const dietaryTagsOptions = [
    { value: "vegan", label: "Vegan" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "gluten_free", label: "Gluten Free" },
    { value: "dairy_free", label: "Dairy Free" },
    { value: "halal", label: "Halal" },
    { value: "spicy", label: "Spicy" },
  ];

  const allergenOptions = [
    { value: "peanuts", label: "Peanuts" },
    { value: "tree_nuts", label: "Tree Nuts" },
    { value: "milk", label: "Milk/Dairy" },
    { value: "eggs", label: "Eggs" },
    { value: "wheat", label: "Wheat/Gluten" },
    { value: "soy", label: "Soy" },
    { value: "fish", label: "Fish" },
    { value: "shellfish", label: "Shellfish" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number = value;
    if (type === "number") {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = 0;
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDropdownChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleMultiSelectChange = (name: string) => (value: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";
    if ((formData.base_price ?? -1) < 0)
      newErrors.base_price = "Price cannot be negative";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-8 ${className}`}>
      {/* Basic Info */}
      <div className="space-y-6 bg-white p-6 rounded-xl border border-[#f3f1f1]">
        <h3 className="text-lg font-semibold text-[#1e1414] border-b border-[#f3f1f1] pb-3">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Meal Name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            error={errors.name}
            required
            className="md:col-span-2"
          />

          <Dropdown
            label="Category"
            value={formData.category_id || ""}
            options={categoryOptions}
            onChange={handleDropdownChange("category_id")}
            error={errors.category_id}
            placeholder="Select a category"
          />

          <Input
            label="Base Price ($)"
            name="base_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.base_price?.toString() || "0"}
            onChange={handleChange}
            error={errors.base_price}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#1e1414]"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={4}
            className="block w-full rounded-lg sm:text-sm border border-[#f3f1f1] hover:border-[#D2D2D2] p-3 focus:ring-2 focus:ring-[#7A2E2E]/40 focus:border-[#7A2E2E] outline-none"
            placeholder="Appetizing description of the meal..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Preparation Time (mins)"
            name="preparation_time"
            type="number"
            min="1"
            value={formData.preparation_time?.toString() || "15"}
            onChange={handleChange}
          />

          <div className="pt-7">
            <Toggle
              checked={!!formData.is_available}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_available: checked }))
              }
              label={formData.is_available ? "Available" : "Sold Out / Hidden"}
            />
          </div>
        </div>
      </div>

      {/* Dietary & Allergens */}
      <div className="space-y-6 bg-white p-6 rounded-xl border border-[#f3f1f1]">
        <h3 className="text-lg font-semibold text-[#1e1414] border-b border-[#f3f1f1] pb-3">
          Dietary & Allergens
        </h3>

        <div className="space-y-6">
          <div>
            <MultiSelectCheckboxes
              label="Dietary Tags"
              options={dietaryTagsOptions}
              value={formData.dietary_tags || []}
              onChange={handleMultiSelectChange("dietary_tags")}
              columns={3}
            />
          </div>

          <div className="pt-4 border-t border-[#f3f1f1]">
            <MultiSelectCheckboxes
              label="Allergens"
              options={allergenOptions}
              value={formData.allergens || []}
              onChange={handleMultiSelectChange("allergens")}
              columns={4}
            />
            <p className="text-xs text-[#999999] mt-2">
              Check all known allergens present in this meal.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 sticky bottom-4 bg-white/80 backdrop-blur-md p-4 rounded-xl border border-[#f3f1f1] shadow-sm">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? "Save Meal" : "Create Meal"}
        </Button>
      </div>
    </form>
  );
}
