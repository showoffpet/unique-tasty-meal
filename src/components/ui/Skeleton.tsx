"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = "",
  variant = "rounded",
  width,
  height,
}: SkeletonProps) {
  const variantStyles = {
    text: "rounded-md h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`animate-pulse bg-[#f3f1f1] ${variantStyles[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
