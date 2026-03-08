"use client";

import React from "react";
import ImageCard, { ImageMetadata } from "./ImageCard";

interface ImageGalleryProps {
  images: ImageMetadata[];
  onDelete?: (id: string) => void;
  onCopyUrl?: (url: string) => void;
  onSelect?: (url: string) => void;
  selectedUrl?: string; // For single selection mode
  className?: string;
  emptyMessage?: string;
}

export default function ImageGallery({
  images,
  onDelete,
  onCopyUrl,
  onSelect,
  selectedUrl,
  className = "",
  emptyMessage = "No images uploaded yet.",
}: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div
        className={`p-12 text-center bg-white border border-[#f3f1f1] border-dashed rounded-xl ${className}`}
      >
        <div className="w-12 h-12 bg-[#f3f1f1] text-[#999999] rounded-full flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-[#806b6b]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 ${className}`}
    >
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onDelete={onDelete}
          onCopyUrl={onCopyUrl}
          onSelect={onSelect}
          isSelected={selectedUrl === image.url}
        />
      ))}
    </div>
  );
}
