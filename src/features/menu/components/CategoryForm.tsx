"use client";

import React from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Toggle from "../../../components/ui/Toggle";
import type { Database } from "@/lib/supabase/database.types";

type Category = Database["public"]["Tables"]["meal_categories"]["Row"];
type CategoryInput = Database["public"]["Tables"]["meal_categories"]["Insert"];

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: Partial<CategoryInput>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  className = "",
}: CategoryFormProps) {
  const [formData, setFormData] = React.useState<Partial<CategoryInput>>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    display_order: initialData?.display_order || 0,
    is_active: initialData?.is_active ?? true,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Category name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <Input
        label="Category Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        error={errors.name}
        placeholder="e.g., Starters, Mains, Desserts"
        required
      />

      <div className="space-y-1.5">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-[#1e1414]"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows={3}
          className={`
            block w-full rounded-lg sm:text-sm border p-2.5 transition-colors
            focus:ring-2 focus:ring-[#7A2E2E]/40 focus:border-[#7A2E2E] outline-none
            ${errors.description ? "border-[#7b2d2d]" : "border-[#f3f1f1] hover:border-[#D2D2D2] bg-white"}
          `}
          placeholder="Brief description of this category..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-[#7b2d2d]">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        <Input
          label="Display Order"
          name="display_order"
          type="number"
          min="0"
          value={formData.display_order?.toString() || "0"}
          onChange={handleChange}
          error={errors.display_order}
          helpText="Lower numbers appear first"
        />

        <div className="pt-7">
          <Toggle
            checked={!!formData.is_active}
            onChange={handleToggle}
            label={formData.is_active ? "Active" : "Hidden"}
            description="Hidden categories won't show on the customer menu"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#f3f1f1]">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
