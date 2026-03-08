"use client";

import React, { useCallback, useState } from "react";

interface DragDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
  isLoading?: boolean;
}

export default function DragDropZone({
  onFilesSelected,
  accept = "image/*",
  maxFiles = 10,
  maxSizeMB = 5,
  className = "",
  isLoading = false,
}: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const fileArray = Array.from(files);

    // Validate Max Files
    if (fileArray.length > maxFiles) {
      setError(`You can only select up to ${maxFiles} files at once.`);
      return;
    }

    // Validate Max Size
    const maxBytes = maxSizeMB * 1024 * 1024;
    const oversizedFiles = fileArray.filter((f) => f.size > maxBytes);
    if (oversizedFiles.length > 0) {
      setError(
        `Files must be under ${maxSizeMB}MB. ${oversizedFiles[0].name} is too large.`,
      );
      return;
    }

    onFilesSelected(fileArray);
  };

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!isLoading) setIsDragging(true);
    },
    [isLoading],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (isLoading) return;
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [isLoading, maxFiles, maxSizeMB, onFilesSelected],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset value so same file can be selected again if needed
    e.target.value = "";
  };

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? "border-[#7A2E2E] bg-[#7A2E2E]/5 scale-[1.01]"
            : error
              ? "border-[#7b2d2d] bg-[#7b2d2d]/5"
              : "border-[#D2D2D2] hover:border-[#999999] bg-[#fcfcfc]"
        } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
          <div
            className={`p-4 rounded-full ${isDragging ? "bg-[#7A2E2E]/10" : "bg-white"} shadow-sm transition-colors`}
          >
            {isLoading ? (
              <svg
                className="w-8 h-8 text-[#7A2E2E] animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            ) : (
              <svg
                className={`w-8 h-8 ${isDragging ? "text-[#7A2E2E]" : "text-[#999999]"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}
          </div>

          <div>
            <p className="font-semibold text-[#1e1414] tracking-wide">
              {isLoading ? "Uploading..." : "Click or drag images here"}
            </p>
            <p className="text-sm text-[#999999] mt-1">
              Supports JPG, PNG, WEBP up to {maxSizeMB}MB
            </p>
          </div>
        </div>

        {/* Hidden file input stretching over the zone */}
        <input
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileInput}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title=""
        />
      </div>

      {error && (
        <p className="text-sm text-[#7b2d2d] font-medium mt-3 flex items-center gap-1.5 animate-in fade-in">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
