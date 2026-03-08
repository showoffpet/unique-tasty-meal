import React from "react";

interface PreferenceSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function PreferenceSection({
  title,
  description,
  children,
  className = "",
}: PreferenceSectionProps) {
  return (
    <section
      className={`bg-white rounded-xl shadow-sm border border-[#f3f1f1] overflow-hidden ${className}`}
    >
      <div className="px-6 py-5 border-b border-[#f3f1f1] bg-[#fcfcfc]">
        <h3 className="text-lg font-semibold text-[#1e1414]">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-[#806b6b]">{description}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}
