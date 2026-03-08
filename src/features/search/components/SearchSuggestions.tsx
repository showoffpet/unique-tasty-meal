"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface SearchSuggestion {
  id: string;
  name: string;
  type: "meal" | "category" | "ingredient" | "recent";
  image_url?: string;
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelect: (suggestion: SearchSuggestion) => void;
  className?: string;
}

export default function SearchSuggestions({
  suggestions,
  onSelect,
  className = "",
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  const groupedSuggestions = suggestions.reduce(
    (acc, curr) => {
      if (!acc[curr.type]) acc[curr.type] = [];
      acc[curr.type].push(curr);
      return acc;
    },
    {} as Record<string, SearchSuggestion[]>,
  );

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "meal":
        return "Suggested Meals";
      case "category":
        return "Categories";
      case "ingredient":
        return "Ingredients";
      case "recent":
        return "Recent Searches";
      default:
        return type;
    }
  };

  return (
    <div
      className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-[#f3f1f1] overflow-hidden z-50 ${className}`}
    >
      {Object.entries(groupedSuggestions).map(([type, items]) => (
        <div key={type} className="border-b border-[#f3f1f1] last:border-0">
          <div className="px-4 py-2 bg-[#fcfcfc] text-xs font-semibold text-[#806b6b] uppercase tracking-wider">
            {getTypeLabel(type)}
          </div>
          <ul className="py-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item)}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[#f3f1f1] transition-colors group"
                >
                  {type === "meal" && item.image_url ? (
                    <div className="relative w-8 h-8 rounded shrink-0 overflow-hidden bg-[#f3f1f1]">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : type === "recent" ? (
                    <svg
                      className="w-4 h-4 text-[#999999] group-hover:text-[#7A2E2E]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-[#999999] group-hover:text-[#7A2E2E]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                  <span className="text-[#1e1414] group-hover:text-[#7A2E2E] flex-1 truncate">
                    {item.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
