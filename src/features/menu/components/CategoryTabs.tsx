"use client";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface CategoryTabsProps {
  tabs: Tab[];
  activeTabId: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export default function CategoryTabs({
  tabs,
  activeTabId,
  onChange,
  className = "",
}: CategoryTabsProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Optional gradient fades for scrolling could go here, but keeping it clean for now */}
      <nav
        className="flex space-x-2 overflow-x-auto custom-scrollbar pb-2 pt-1"
        aria-label="Tabs"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                whitespace-nowrap py-2.5 px-6 rounded-full font-bold text-[15px] transition-all duration-300 flex items-center
                ${
                  isActive
                    ? "bg-[#7b2d2d] text-white shadow-md shadow-[#7b2d2d]/20"
                    : "bg-white text-[#1e1414] hover:bg-[#fcfcfc] shadow-sm"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`
                    ml-2 py-0.5 px-2.5 rounded-full text-xs font-bold
                    ${isActive ? "bg-white/20 text-white" : "bg-[#f3f1f1] text-[#806b6b]"}
                  `}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
