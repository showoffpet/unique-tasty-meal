"use client";

import React, { useState } from "react";

interface ExportButtonProps {
  dashboardName: string;
  data?: Record<string, unknown>;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

export default function ExportButton({
  dashboardName,
  data,
  className = "",
  variant = "secondary",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Simulate PDF generation delay for PRD specs
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Use jsPDF or similar to generate real PDF from data

      // Fake download interaction for user confirmation
      const dateStr = new Date().toISOString().split("T")[0];
      const filename = `${dashboardName.toLowerCase().replace(/\s+/g, "-")}-report-${dateStr}.pdf`;

      // Create a dummy link to trigger "download"
      const url = window.URL.createObjectURL(
        new Blob(["Placeholder PDF Content"], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const baseStyles =
    "inline-flex justify-center items-center font-bold px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#7A2E2E] hover:bg-[#5A2222] text-white focus:ring-[#7A2E2E]",
    secondary:
      "bg-[#fcfcfc] hover:bg-[#f3f1f1] text-[#1e1414] border border-[#f3f1f1] hover:border-[#D2D2D2] focus:ring-[#f3f1f1]",
    outline:
      "bg-transparent border-2 border-[#7A2E2E] text-[#7A2E2E] hover:bg-[#7A2E2E]/5 focus:ring-[#7A2E2E]",
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isExporting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Generating PDF...
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          Export Report
        </>
      )}
    </button>
  );
}
