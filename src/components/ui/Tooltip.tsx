"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  className?: string;
  disabled?: boolean;
}

export default function Tooltip({
  children,
  content,
  position = "top",
  delayMs = 200,
  className = "",
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (disabled || !content) return;
    timerRef.current = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, delayMs);
  };

  const hideTooltip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();

    // Default to a safe top position if tooltip ref isn't ready yet,
    // assuming an average tooltip height of ~30px.
    const tooltipHeight = tooltipRef.current?.offsetHeight || 30;
    const tooltipWidth = tooltipRef.current?.offsetWidth || 120;
    const spacing = 8; // distance from trigger

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = triggerRect.top - tooltipHeight - spacing;
        left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + spacing;
        left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        left = triggerRect.left - tooltipWidth - spacing;
        break;
      case "right":
        top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        left = triggerRect.right + spacing;
        break;
    }

    // Keep within window bounds (simple clamping)
    if (typeof window !== "undefined") {
      left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8));
      top = Math.max(8, Math.min(top, window.innerHeight - tooltipHeight - 8));
    }

    setCoords({ top, left });
  };

  // Update position on scroll/resize if visible
  useEffect(() => {
    if (!isVisible) return;
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
        aria-describedby={isVisible ? "tooltip-content" : undefined}
      >
        {children}
      </div>

      {isVisible &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            id="tooltip-content"
            role="tooltip"
            className={`fixed z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-[#1e1414] rounded shadow-lg pointer-events-none transition-opacity ${className}`}
            style={{ top: coords.top, left: coords.left }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
