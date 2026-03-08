import { apiResponse, withErrorHandler } from "@/lib/api/helpers";

const cuisineTypes = [
  "African",
  "American",
  "Asian",
  "BBQ",
  "Brazilian",
  "Caribbean",
  "Chinese",
  "Ethiopian",
  "French",
  "Greek",
  "Indian",
  "Italian",
  "Japanese",
  "Korean",
  "Lebanese",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nigerian",
  "Persian",
  "Peruvian",
  "Spanish",
  "Thai",
  "Turkish",
  "Vietnamese",
];

export const GET = withErrorHandler(async () => {
  return apiResponse(cuisineTypes);
});
