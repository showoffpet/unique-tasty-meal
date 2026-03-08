import React from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full shrink-0";

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 min-w-[1.25rem]",
    md: "text-xs px-2.5 py-0.5 min-w-[1.5rem]",
  };

  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-[#f3f1f1] text-[#1e1414]",
    primary: "bg-[#7A2E2E]/10 text-[#7A2E2E]",
    success: "bg-[#2E7D32]/10 text-[#2E7D32]",
    warning: "bg-[#ED8B00]/10 text-[#ED8B00]",
    error: "bg-[#7b2d2d]/10 text-[#7b2d2d]",
    outline: "border border-[#f3f1f1] text-[#806b6b] bg-transparent",
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: "bg-[#999999]",
    primary: "bg-[#7A2E2E]",
    success: "bg-[#2E7D32]",
    warning: "bg-[#ED8B00]",
    error: "bg-[#7b2d2d]",
    outline: "bg-[#999999]",
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
