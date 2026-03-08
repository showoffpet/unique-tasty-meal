"use client";

import React from "react";
import DragDropZone from "./DragDropZone";
import Button from "../../../components/ui/Button";

interface ImageUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export default function ImageUploader({
  onUpload,
  isLoading = false,
  className = "",
}: ImageUploaderProps) {
  const handleFilesSelected = async (files: File[]) => {
    await onUpload(files);
  };

  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] overflow-hidden ${className}`}
    >
      <div className="p-4 border-b border-[#f3f1f1] bg-[#fcfcfc]">
        <h3 className="font-bold text-[#1e1414]">Upload New Images</h3>
        <p className="text-sm text-[#806b6b] line-clamp-1 mt-0.5">
          Files will be securely stored in the cloud.
        </p>
      </div>

      <div className="p-6">
        <DragDropZone
          onFilesSelected={handleFilesSelected}
          isLoading={isLoading}
          maxFiles={5}
        />
      </div>
    </div>
  );
}
