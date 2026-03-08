"use client";

import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import StarRating from "./StarRating";
import FormErrorMessage from "../../auth/components/FormErrorMessage";

interface ReviewFormProps {
  mealId: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function ReviewForm({
  mealId,
  onSubmit,
  onCancel,
  isLoading = false,
  className = "",
}: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating to submit your review.");
      return;
    }

    setError("");
    await onSubmit(rating, comment.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-[#fcfcfc] p-6 rounded-xl border border-[#f3f1f1] ${className}`}
    >
      <h3 className="text-lg font-semibold text-[#1e1414] mb-4">
        Write a Review
      </h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#806b6b] mb-2">
          Overall Rating *
        </label>
        <StarRating
          rating={rating}
          onChange={(newRating) => {
            setRating(newRating);
            setError("");
          }}
          readOnly={false}
          size="lg"
        />
        <FormErrorMessage message={error} className="mt-2" />
      </div>

      <div className="mb-6">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-[#806b6b] mb-2"
        >
          Your Review (optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="What did you think of the meal?"
          className="block w-full rounded-lg sm:text-sm border border-[#f3f1f1] hover:border-[#D2D2D2] p-3 focus:ring-2 focus:ring-[#7A2E2E]/40 focus:border-[#7A2E2E] outline-none bg-white transition-colors resize-y"
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={rating === 0}
        >
          Submit Review
        </Button>
      </div>
    </form>
  );
}
