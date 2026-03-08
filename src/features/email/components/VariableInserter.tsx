"use client";

import React from "react";

interface VariableInserterProps {
  variables: string[];
  onInsert: (variable: string) => void;
  className?: string;
}

export default function VariableInserter({
  variables = [],
  onInsert,
  className = "",
}: VariableInserterProps) {
  if (!variables || variables.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-semibold text-[#806b6b] uppercase tracking-wider">
        Available Variables
      </label>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable) => (
          <button
            key={variable}
            type="button"
            onClick={() => onInsert(`{{${variable}}}`)}
            className="inline-flex items-center px-2 py-1 rounded bg-[#f3f1f1] hover:bg-[#f3f1f1] text-[#1e1414] text-xs font-mono transition-colors border border-[#D2D2D2]"
            title={`Insert {{${variable}}}`}
          >
            <span className="text-[#999999] mr-0.5">{"{{"}</span>
            {variable}
            <span className="text-[#999999] ml-0.5">{"}}"}</span>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-[#999999]">
        Click a variable to insert it at your cursor position in the template
        body.
      </p>
    </div>
  );
}
