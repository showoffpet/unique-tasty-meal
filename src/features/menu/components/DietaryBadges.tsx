import React from "react";
import Tooltip from "../../../components/ui/Tooltip";

type DietaryTag =
  | "vegan"
  | "vegetarian"
  | "gluten_free"
  | "dairy_free"
  | "nut_free"
  | "halal"
  | "contains_nuts"
  | "spicy";

interface DietaryBadgesProps {
  tags?: string[] | null;
  className?: string;
  size?: "sm" | "md";
  showLabels?: boolean;
}

export default function DietaryBadges({
  tags,
  className = "",
  size = "sm",
  showLabels = false,
}: DietaryBadgesProps) {
  if (!tags || tags.length === 0) return null;

  // Configuration for known dietary tags
  const tagConfig: Record<
    string,
    { icon: React.ReactNode; label: string; color: string; bgColor: string }
  > = {
    vegan: {
      label: "Vegan",
      color: "text-[#2E7D32]",
      bgColor: "bg-[#2E7D32]/10",
      icon: (
        <svg
          className="w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 11V3l8 8 8-8v8l-8 8-8-8z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 21v-2"
          />
        </svg>
      ),
    },
    vegetarian: {
      label: "Vegetarian",
      color: "text-[#2E7D32]",
      bgColor: "bg-[#2E7D32]/10",
      icon: (
        <svg
          className="w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v18m-4-6l4 6 4-6"
          />
        </svg>
      ),
    },
    gluten_free: {
      label: "Gluten Free",
      color: "text-[#ED8B00]",
      bgColor: "bg-[#ED8B00]/10",
      icon: (
        <svg
          className="w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
          />
        </svg>
      ),
    },
    halal: {
      label: "Halal",
      color: "text-[#2196F3]",
      bgColor: "bg-[#2196F3]/10",
      icon: (
        <svg
          className="w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ),
    },
    contains_nuts: {
      label: "Contains Nuts",
      color: "text-[#7b2d2d]",
      bgColor: "bg-[#7b2d2d]/10",
      icon: (
        <svg
          className="w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
    },
  };

  const sizeStyles = {
    sm: "w-5 h-5 p-0.5",
    md: "w-7 h-7 p-1",
  };

  const labelTextStyles = {
    sm: "text-[10px]",
    md: "text-xs",
  };

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {tags.map((tag) => {
        const normalizedTag = tag
          .trim()
          .toLowerCase()
          .replace("-", "_") as DietaryTag;
        const config = tagConfig[normalizedTag];

        if (!config) {
          // Fallback for unknown tags
          return showLabels ? (
            <span
              key={tag}
              className={`inline-flex items-center justify-center font-medium rounded-full bg-[#f3f1f1] text-[#806b6b] px-2 py-0.5 ${labelTextStyles[size]}`}
            >
              {tag}
            </span>
          ) : null;
        }

        const badgeContent = (
          <div
            className={`inline-flex items-center justify-center rounded-full ${config.bgColor} ${config.color} ${!showLabels ? sizeStyles[size] : "px-2 py-0.5"}`}
            aria-label={config.label}
          >
            {showLabels ? (
              <span
                className={`font-semibold flex items-center gap-1 ${labelTextStyles[size]}`}
              >
                <span className="w-3.5 h-3.5 inline-block shrink-0">
                  {config.icon}
                </span>
                {config.label}
              </span>
            ) : (
              config.icon
            )}
          </div>
        );

        return showLabels ? (
          <React.Fragment key={tag}>{badgeContent}</React.Fragment>
        ) : (
          <Tooltip key={tag} content={config.label} position="top">
            {badgeContent}
          </Tooltip>
        );
      })}
    </div>
  );
}
