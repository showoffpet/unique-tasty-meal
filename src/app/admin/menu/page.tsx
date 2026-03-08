"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import Button from "@/components/ui/Button";
import SearchBar from "@/features/search/components/SearchBar";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CategoryForm from "@/features/menu/components/CategoryForm";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
// Unused: useAuth

// Mock Data
const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Starters", display_order: 1, meal_count: 5 },
  { id: "cat-2", name: "Mains", display_order: 2, meal_count: 12 },
  { id: "cat-3", name: "Sides", display_order: 3, meal_count: 8 },
  { id: "cat-4", name: "Desserts", display_order: 4, meal_count: 0 },
];

const MOCK_MEALS = Array.from({ length: 10 }).map((_, i) => ({
  id: `meal-${i}`,
  name: `Dish ${i + 1}`,
  description: "A wonderful description of this fantastic dish...",
  base_price: 15.99,
  image_url: `https://picsum.photos/seed/${i + 200}/400/300`,
  category_id: "cat-1",
  display_order: i + 1,
}));

export default function MenuManagementPage() {
  // No user hook needed here
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0].id,
  );
  const [meals, setMeals] = useState(MOCK_MEALS);
  const [searchQuery, setSearchQuery] = useState("");

  // UI States
  const [isLoading] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Modals
  const [deleteCategoryRef, setDeleteCategoryRef] = useState<string | null>(
    null,
  );
  const [deleteMealRef, setDeleteMealRef] = useState<string | null>(null);

  // Derived state
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const filteredMeals = meals.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDragEnd = (result: DropResult, type: "category" | "meal") => {
    if (!result.destination) return;

    if (type === "category") {
      const items = Array.from(categories);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setCategories(items);
    } else {
      const items = Array.from(filteredMeals);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      if (!searchQuery) setMeals(items);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc]">
      <AdminHeader
        title="Menu Management"
        subtitle="Manage your dishes and categories"
      />

      <main className="flex-1 p-8 overflow-y-auto pb-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* LEFT COLUMN: Categories */}
          <div className="w-full md:w-80 shrink-0 flex flex-col gap-6">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-bold text-[#1e1414]">Categories</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingCategory(true)}
                className="text-[#7b2d2d] hover:bg-[#7b2d2d]/10 font-bold"
              >
                + Add
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm overflow-hidden">
              {isAddingCategory && (
                <div className="p-4 border-b border-[#f3f1f1] bg-[#fcfcfc]">
                  <h3 className="text-sm font-bold text-[#1e1414] mb-3">
                    Add Category
                  </h3>
                  <CategoryForm
                    onSubmit={async () => {
                      setIsAddingCategory(false);
                    }}
                    onCancel={() => setIsAddingCategory(false)}
                  />
                </div>
              )}

              <DragDropContext
                onDragEnd={(result: DropResult) =>
                  handleDragEnd(result, "category")
                }
              >
                <Droppable droppableId="categories">
                  {(provided: DroppableProvided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="divide-y divide-[#f3f1f1]"
                    >
                      {categories.map((category, index) => (
                        <Draggable
                          key={category.id}
                          draggableId={category.id}
                          index={index}
                        >
                          {(
                            provided: DraggableProvided,
                            snapshot: DraggableStateSnapshot,
                          ) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center group transition-colors ${
                                selectedCategoryId === category.id
                                  ? "bg-[#7b2d2d]/5 border-l-4 border-l-[#7b2d2d]"
                                  : "hover:bg-[#fcfcfc] border-l-4 border-l-transparent"
                              } ${snapshot.isDragging ? "shadow-lg bg-white z-50" : ""}`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="px-3 text-[#999999] hover:text-[#806b6b] cursor-grab active:cursor-grabbing"
                              >
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
                                    d="M4 8h16M4 16h16"
                                  />
                                </svg>
                              </div>

                              <button
                                className="flex-1 py-4 pr-4 text-left flex justify-between items-center"
                                onClick={() =>
                                  setSelectedCategoryId(category.id)
                                }
                              >
                                <span
                                  className={`text-sm font-bold ${selectedCategoryId === category.id ? "text-[#7b2d2d]" : "text-[#1e1414]"}`}
                                >
                                  {category.name}
                                </span>
                                {category.meal_count > 0 && (
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      selectedCategoryId === category.id
                                        ? "bg-[#7b2d2d] text-white"
                                        : "bg-[#f3f1f1] text-[#806b6b]"
                                    }`}
                                  >
                                    {category.meal_count}
                                  </span>
                                )}
                              </button>

                              <button
                                className="pr-4 text-[#999999] hover:text-[#7b2d2d] opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteCategoryRef(category.id);
                                }}
                              >
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>

              {categories.length === 0 && !isAddingCategory && (
                <div className="p-8 text-center text-[#806b6b] text-sm">
                  No categories yet.
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-[#f3f1f1] shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-[#1e1414]">
                  {selectedCategory?.name || "Select a Category"}
                </h2>
                <p className="text-sm text-[#806b6b] mt-1">
                  {selectedCategory?.meal_count || 0} meals in this category
                </p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-full sm:w-64">
                  <SearchBar
                    onSearch={setSearchQuery}
                    placeholder="Search meals..."
                  />
                </div>
                <button
                  onClick={() => {
                    // TODO: Open Meal Form
                  }}
                  className="flex-shrink-0 px-4 py-2 bg-[#7b2d2d] text-white text-sm font-bold rounded-lg hover:bg-[#561b1b] transition-colors shadow-sm"
                >
                  Add Meal
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white h-64 rounded-xl border border-[#f3f1f1] p-4"
                  >
                    <Skeleton className="w-full h-32 rounded-lg mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredMeals.length === 0 ? (
              <EmptyState
                title={
                  searchQuery
                    ? "No meals match search"
                    : "No meals in this category"
                }
                message={
                  searchQuery
                    ? "Try a different search term."
                    : "Get started by adding your first meal."
                }
                actionLabel={searchQuery ? "Clear Search" : "Add Meal"}
                onAction={
                  searchQuery
                    ? () => setSearchQuery("")
                    : () => {
                        // TODO: Open Meal Form
                      }
                }
              />
            ) : (
              <DragDropContext
                onDragEnd={(result: DropResult) =>
                  handleDragEnd(result, "meal")
                }
              >
                <Droppable droppableId="meals" direction="vertical">
                  {(provided: DroppableProvided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                      {filteredMeals.map((meal, index) => (
                        <Draggable
                          key={meal.id}
                          draggableId={meal.id}
                          index={index}
                          isDragDisabled={!!searchQuery}
                        >
                          {(
                            provided: DraggableProvided,
                            snapshot: DraggableStateSnapshot,
                          ) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-white rounded-xl border transition-all group overflow-hidden ${
                                snapshot.isDragging
                                  ? "border-[#7b2d2d] shadow-xl z-50 ring-2 ring-[#7b2d2d]/20"
                                  : "border-[#f3f1f1] hover:shadow-md hover:border-[#CCCCCC]"
                              }`}
                            >
                              <div className="relative h-40 bg-[#f3f1f1]">
                                <Image
                                  src={meal.image_url}
                                  alt={meal.name}
                                  fill
                                  className="object-cover"
                                />

                                {!searchQuery && (
                                  <div
                                    {...provided.dragHandleProps}
                                    className="absolute top-2 left-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-lg cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
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
                                        d="M4 8h16M4 16h16"
                                      />
                                    </svg>
                                  </div>
                                )}

                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    className="bg-white/90 hover:bg-white text-[#1e1414] p-1.5 rounded-lg shadow-sm"
                                    onClick={() => {
                                      // TODO: Edit meal
                                    }}
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    className="bg-white/90 hover:bg-[#7b2d2d] hover:text-white text-[#7b2d2d] p-1.5 rounded-lg shadow-sm transition-colors"
                                    onClick={() => setDeleteMealRef(meal.id)}
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-bold text-[#1e1414] line-clamp-1 flex-1 pr-2">
                                    {meal.name}
                                  </h3>
                                  <span className="font-semibold text-[#1e1414]">
                                    ${meal.base_price.toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-sm text-[#806b6b] line-clamp-2">
                                  {meal.description}
                                </p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {deleteCategoryRef && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Category"
          message="Are you sure you want to delete this category?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => {
            setCategories(categories.filter((c) => c.id !== deleteCategoryRef));
            setDeleteCategoryRef(null);
          }}
          onCancel={() => setDeleteCategoryRef(null)}
          intent="danger"
        />
      )}

      {deleteMealRef && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Meal"
          message="Are you sure you want to delete this meal?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => {
            setMeals(meals.filter((m) => m.id !== deleteMealRef));
            setDeleteMealRef(null);
          }}
          onCancel={() => setDeleteMealRef(null)}
          intent="danger"
        />
      )}
    </div>
  );
}
