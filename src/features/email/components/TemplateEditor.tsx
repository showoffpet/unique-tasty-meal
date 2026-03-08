"use client";

import React, { useRef, useState, useEffect } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Toggle from "../../../components/ui/Toggle";
import Dropdown from "../../../components/ui/Dropdown";
import VariableInserter from "./VariableInserter";
import type { Database } from "@/lib/supabase/database.types";

type TemplateRow = Database["public"]["Tables"]["email_templates"]["Row"];

export type EmailTemplateFormData = Omit<
  TemplateRow,
  "id" | "created_at" | "updated_at" | "created_by"
>;

interface TemplateEditorProps {
  initialData?: Partial<TemplateRow>;
  onSubmit: (data: EmailTemplateFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function TemplateEditor({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  className = "",
}: TemplateEditorProps) {
  const [formData, setFormData] = useState<EmailTemplateFormData>({
    name: initialData?.name || "",
    category: initialData?.category || "transactional",
    subject: initialData?.subject || "",
    html_body: initialData?.html_body || "",
    text_body: initialData?.text_body || "",
    is_active: initialData?.is_active ?? true,
    variables:
      initialData?.variables && Array.isArray(initialData.variables)
        ? initialData.variables
        : ["user_name", "order_number", "total_amount", "delivery_address"],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof EmailTemplateFormData, string>>
  >({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const validate = () => {
    const newErrors: Partial<Record<keyof EmailTemplateFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Template name is required";
    if (!formData.subject.trim())
      newErrors.subject = "Subject line is required";
    if (!formData.html_body.trim())
      newErrors.html_body = "HTML body cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof EmailTemplateFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const insertVariable = (variableStr: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      // Fallback if ref fails
      setFormData((prev) => ({
        ...prev,
        html_body: prev.html_body + variableStr,
      }));
      return;
    }

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = formData.html_body;

    const newText =
      text.substring(0, startPos) + variableStr + text.substring(endPos);
    setFormData((prev) => ({ ...prev, html_body: newText }));

    // Set cursor position after inserted variable
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        startPos + variableStr.length,
        startPos + variableStr.length,
      );
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="bg-white rounded-xl border border-[#f3f1f1] overflow-hidden">
        {/* Basic Info */}
        <div className="p-6 space-y-5 border-b border-[#f3f1f1]">
          <h3 className="text-lg font-bold text-[#1e1414]">
            Template Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Template Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="e.g. Order Confirmation"
              required
            />

            <div>
              <label className="block text-sm font-medium text-[#1e1414] mb-1.5">
                Category
              </label>
              <Dropdown
                value={formData.category}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, category: val }))
                }
                options={[
                  {
                    value: "transactional",
                    label: "Transactional (Order Updates)",
                  },
                  { value: "marketing", label: "Marketing (Promos, News)" },
                  { value: "system", label: "System (Password Reset)" },
                ]}
              />
            </div>
          </div>

          <Input
            label="Email Subject Line"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            error={errors.subject}
            placeholder="e.g. Your UTM Order #{{order_number}} is confirmed!"
            required
          />
        </div>

        {/* Content Editor */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-[#1e1414]">
              Email Body (HTML)
            </h3>
          </div>

          <VariableInserter
            variables={formData.variables || []}
            onInsert={insertVariable}
            className="mb-4"
          />

          <div>
            <textarea
              ref={textareaRef}
              name="html_body"
              value={formData.html_body}
              onChange={handleChange}
              placeholder="<html><body><h1>Hi {{user_name}}</h1>...</body></html>"
              rows={15}
              className={`w-full rounded-lg border font-mono text-sm p-4 focus:ring-2 focus:ring-[#7A2E2E]/40 focus:border-[#7A2E2E] outline-none transition-shadow ${
                errors.html_body ? "border-[#7b2d2d]" : "border-[#f3f1f1]"
              }`}
            />
            {errors.html_body && (
              <p className="mt-1 text-sm text-[#7b2d2d]">{errors.html_body}</p>
            )}
          </div>
        </div>

        {/* Status Toggle */}
        <div className="bg-[#fcfcfc] p-6 border-t border-[#f3f1f1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#1e1414]">Active Status</p>
              <p className="text-sm text-[#806b6b]">
                When active, system triggers can send this template
              </p>
            </div>
            <Toggle
              checked={formData.is_active}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_active: checked }))
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Save Template
        </Button>
      </div>
    </form>
  );
}
