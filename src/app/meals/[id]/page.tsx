import React from "react";
import MealDetailClient from "./MealDetailClient";
import { notFound } from "next/navigation";
import { MOCK_MEALS } from "@/lib/mockData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meal = MOCK_MEALS.find((m) => m.id === id);

  if (!meal) return { title: "Meal Not Found — UTM" };

  return {
    title: `${meal.name} — UTM`,
    description: meal.description,
  };
}

export default async function MealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Use mock data for frontend scaffolding until backend schema is finalized
  const meal = MOCK_MEALS.find((m) => m.id === id);

  if (!meal) {
    notFound();
  }

  // Fetch similar meals based on same category (excluding current)
  const similarMeals = MOCK_MEALS.filter(
    (m) => m.category_id === meal.category_id && m.id !== meal.id,
  ).slice(0, 4);

  // Fallback to random meals if none found in same category
  const fallbackMeals =
    similarMeals.length > 0
      ? similarMeals
      : MOCK_MEALS.filter((m) => m.id !== meal.id).slice(0, 4);

  return (
    <div className="bg-[#f8f6f6] min-h-screen text-[#161313] pb-24 relative">
      <MealDetailClient
        meal={meal as any}
        similarMeals={fallbackMeals as any}
      />
    </div>
  );
}
