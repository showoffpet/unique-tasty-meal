import React from "react";
import StarRating from "./StarRating";
import Image from "next/image";

interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar_url?: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  is_verified_purchase?: boolean;
}

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export default function ReviewCard({
  review,
  className = "",
}: ReviewCardProps) {
  // Simple date formatter
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div
      className={`py-6 border-b border-[#f3f1f1] last:border-0 ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-[#f3f1f1] overflow-hidden border border-[#f3f1f1] shrink-0">
            {review.user_avatar_url ? (
              <Image
                src={review.user_avatar_url}
                alt={review.user_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#7A2E2E]/10 text-[#7A2E2E] font-semibold">
                {review.user_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-[#1e1414] flex items-center gap-2">
              {review.user_name}
              {review.is_verified_purchase && (
                <span className="flex items-center gap-1 text-[10px] text-[#2E7D32] bg-[#2E7D32]/10 px-1.5 py-0.5 rounded uppercase tracking-wide font-bold">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Verified
                </span>
              )}
            </h4>
            <span className="text-xs text-[#999999]">
              {formatDate(review.created_at)}
            </span>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {review.comment && (
        <p className="text-[#806b6b] text-sm leading-relaxed mt-2 pl-13 sm:pl-0">
          {review.comment}
        </p>
      )}
    </div>
  );
}
