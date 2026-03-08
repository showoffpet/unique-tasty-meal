"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import FormErrorMessage from "../../auth/components/FormErrorMessage";

interface AvatarUploaderProps {
  currentImageUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  error?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function AvatarUploader({
  currentImageUrl,
  onUpload,
  isUploading = false,
  error,
  className = "",
  size = "md",
}: AvatarUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        await onUpload(file);
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await onUpload(e.target.files[0]);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div
        className={`
          relative rounded-full overflow-hidden border-2 flex items-center justify-center bg-[#f3f1f1] group
          ${sizeClasses[size]}
          ${dragActive ? "border-[#7A2E2E] bg-[#7A2E2E]/5" : "border-[#f3f1f1]"}
          ${isUploading ? "opacity-70 pointer-events-none" : "cursor-pointer"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {currentImageUrl ? (
          <Image
            src={currentImageUrl}
            alt="Profile Avatar"
            fill
            className="object-cover"
          />
        ) : (
          <svg
            className="w-1/2 h-1/2 text-[#B3B3B3]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-6 h-6 text-white mb-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-xs font-medium text-white">Change</span>
        </div>

        {/* Loading Spinner */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm z-10">
            <div className="inline-block w-6 h-6 border-2 border-[#7A2E2E] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        id="avatar-upload"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      <div className="text-center">
        <label
          htmlFor="avatar-upload"
          className="text-sm font-semibold text-[#7A2E2E] hover:text-[#561b1b] cursor-pointer transition-colors"
        >
          Upload new picture
        </label>
        <p className="text-xs text-[#999999] mt-1">
          JPG, PNG or WebP. Max 5MB.
        </p>
        <FormErrorMessage message={error} className="justify-center" />
      </div>
    </div>
  );
}
