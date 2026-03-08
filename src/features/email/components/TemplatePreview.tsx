"use client";

import React, { useMemo } from "react";
import DOMPurify from "dompurify";

interface TemplatePreviewProps {
  htmlBody: string;
  subject?: string;
  mockData?: Record<string, string>;
  className?: string;
}

export default function TemplatePreview({
  htmlBody,
  subject = "",
  mockData = {
    user_name: "Jane Doe",
    order_number: "UTM-123456",
    total_amount: "$45.00",
    delivery_address: "123 Main St, New York, NY",
  },
  className = "",
}: TemplatePreviewProps) {
  // Interpolate variables into HTML and subject
  const renderedHtml = useMemo(() => {
    let result = htmlBody;
    try {
      if (mockData && result) {
        Object.keys(mockData).forEach((key) => {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
          result = result.replace(regex, mockData[key]);
        });
      }
    } catch (e) {
      console.error("Variable interpolation error:", e);
    }
    return result;
  }, [htmlBody, mockData]);

  const renderedSubject = useMemo(() => {
    let result = subject;
    try {
      if (mockData && result) {
        Object.keys(mockData).forEach((key) => {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
          result = result.replace(regex, mockData[key]);
        });
      }
    } catch (e) {
      console.error("Subject interpolation error:", e);
    }
    return result;
  }, [subject, mockData]);

  return (
    <div
      className={`flex flex-col h-full bg-white border border-[#f3f1f1] rounded-xl overflow-hidden ${className}`}
    >
      {/* Email Client Header Chrome */}
      <div className="bg-[#f3f1f1] border-b border-[#f3f1f1] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex">
            <span className="text-[#999999] w-16 shrink-0">From:</span>
            <span className="font-medium text-[#1e1414]">
              Unique Tasty Meals &lt;orders@utm.com&gt;
            </span>
          </div>
          <div className="flex">
            <span className="text-[#999999] w-16 shrink-0">Subject:</span>
            <span className="font-medium text-[#1e1414]">
              {renderedSubject || "No Subject"}
            </span>
          </div>
        </div>
      </div>

      {/* Email Content Frame */}
      <div className="flex-1 overflow-auto bg-[#F9F9F9] p-4 sm:p-8 flex justify-center">
        <div
          className="bg-white w-full max-w-2xl shadow-sm min-h-[400px] rounded"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              renderedHtml ||
                '<div style="padding: 2rem; color: #999; text-align: center; font-family: sans-serif;">Empty Template</div>',
            ),
          }}
        />
      </div>
    </div>
  );
}
