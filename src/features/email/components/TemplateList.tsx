"use client";

import React from "react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import type { Database } from "@/lib/supabase/database.types";

type TemplateRow = Database["public"]["Tables"]["email_templates"]["Row"];

interface TemplateListProps {
  templates: TemplateRow[];
  onEdit: (template: TemplateRow) => void;
  onPreview: (template: TemplateRow) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export default function TemplateList({
  templates,
  onEdit,
  onPreview,
  onDelete,
  className = "",
}: TemplateListProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "transactional":
        return "bg-[#2E7D32]/10 text-[#2E7D32]";
      case "marketing":
        return "bg-[#7A2E2E]/10 text-[#7A2E2E]";
      case "system":
      default:
        return "bg-[#F79E1B]/10 text-[#F79E1B]";
    }
  };

  if (templates.length === 0) {
    return (
      <div
        className={`p-8 text-center bg-white border border-[#f3f1f1] border-dashed rounded-xl ${className}`}
      >
        <p className="text-[#806b6b]">No email templates found.</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {templates.map((template) => (
        <div
          key={template.id}
          className="bg-white rounded-xl border border-[#f3f1f1] hover:border-[#D2D2D2] transition-colors overflow-hidden flex flex-col"
        >
          <div className="p-5 flex-1">
            <div className="flex justify-between items-start mb-3">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getCategoryColor(template.category)}`}
              >
                {template.category}
              </span>
              <Badge variant={template.is_active ? "success" : "default"}>
                {template.is_active ? "Active" : "Draft"}
              </Badge>
            </div>

            <h3 className="font-bold text-[#1e1414] text-lg mb-1 leading-tight">
              {template.name}
            </h3>
            <p className="text-sm text-[#806b6b] line-clamp-2 mb-4">
              <span className="font-medium text-[#999999]">Subj: </span>
              {template.subject}
            </p>

            <div className="flex flex-wrap gap-1 mt-auto">
              {template.variables?.slice(0, 3).map((v) => (
                <span
                  key={v}
                  className="text-[10px] bg-[#f3f1f1] text-[#806b6b] px-1.5 py-0.5 rounded font-mono"
                >
                  {v}
                </span>
              ))}
              {template.variables && template.variables.length > 3 && (
                <span className="text-[10px] bg-[#f3f1f1] text-[#806b6b] px-1.5 py-0.5 rounded">
                  +{template.variables.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-[#f3f1f1] bg-[#fcfcfc] p-3 flex justify-between items-center gap-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(template)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onPreview(template)}
              >
                Preview
              </Button>
            </div>

            {onDelete && (
              <button
                onClick={() => onDelete(template.id)}
                className="p-2 text-[#999999] hover:text-[#7b2d2d] transition-colors"
                aria-label="Delete template"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
