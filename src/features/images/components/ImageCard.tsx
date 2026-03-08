"use client";

import React from "react";
import Button from "../../../components/ui/Button";

export interface ImageMetadata {
  id: string;
  url: string;
  filename: string;
  sizeBytes: number;
  createdAt: string;
}

interface ImageCardProps {
  image: ImageMetadata;
  onDelete?: (id: string) => void;
  onCopyUrl?: (url: string) => void;
  onSelect?: (url: string) => void;
  isSelected?: boolean;
  className?: string;
}

export default function ImageCard({
  image,
  onDelete,
  onCopyUrl,
  onSelect,
  isSelected = false,
  className = "",
}: ImageCardProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div
      className={`group bg-white rounded-xl border overflow-hidden flex flex-col transition-all ${
        isSelected
          ? "border-[#7A2E2E] shadow-sm ring-2 ring-[#7A2E2E]/20 scale-[1.02]"
          : "border-[#f3f1f1] hover:shadow-md hover:border-[#D2D2D2]"
      } ${className}`}
      onClick={() => onSelect && onSelect(image.url)}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="relative aspect-[4/3] bg-[#f3f1f1]">
        <img
          src={image.url}
          alt={image.filename}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
          loading="lazy"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onCopyUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyUrl(image.url);
              }}
              className="p-2 bg-white text-[#1e1414] rounded-full hover:bg-[#fcfcfc] transition-colors"
              title="Copy URL"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(image.id);
              }}
              className="p-2 bg-white text-[#7b2d2d] rounded-full hover:bg-[#fcfcfc] transition-colors"
              title="Delete Image"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-[#7A2E2E] text-white rounded-full flex items-center justify-center shadow-sm">
            <svg
              className="w-4 h-4"
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
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-[#f3f1f1] flex flex-col gap-1 z-10">
        <p
          className="text-xs font-semibold text-[#1e1414] truncate"
          title={image.filename}
        >
          {image.filename}
        </p>
        <div className="flex justify-between items-center text-[10px] text-[#999999] uppercase font-mono tracking-wider">
          <span>{formatBytes(image.sizeBytes)}</span>
          <span>{new Date(image.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
