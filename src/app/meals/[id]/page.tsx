import React from "react";
import MealDetailClient from "./MealDetailClient";
import { notFound } from "next/navigation";
import {
  getMealByIdServer,
  getSimilarMealsServer,
} from "@/lib/supabase/queries.server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meal = await getMealByIdServer(id);

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

  const meal = await getMealByIdServer(id);

  if (!meal) {
    notFound();
  }

  const similarMeals = await getSimilarMealsServer(meal.category_id, meal.id);

  return (
    <div className="bg-[#f8f6f6] min-h-screen text-[#161313] pb-24 relative">
      <MealDetailClient meal={meal as any} similarMeals={similarMeals as any} />
    </div>
  );
}
