"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "../../../components/ui/Button";

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export default function SearchBar({
  initialQuery = "",
  onSearch,
  onClear,
  placeholder = "Search for meals, ingredients...",
  autoFocus = false,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full max-w-2xl mx-auto shadow-sm transition-shadow focus-within:shadow-md rounded-full bg-white border border-[#f3f1f1] hover:border-[#D2D2D2] p-1 ${className}`}
    >
      <div className="pl-4 pr-2 text-[#999999]">
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent py-2.5 px-1 text-sm sm:text-base text-[#1e1414] placeholder-[#999999] outline-none"
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="p-2 text-[#999999] hover:text-[#7b2d2d] transition-colors bg-transparent rounded-full mr-1"
          aria-label="Clear search"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <Button
        type="submit"
        variant="primary"
        className="rounded-full px-6 py-2.5 shadow-none"
      >
        Search
      </Button>
    </form>
  );
}
