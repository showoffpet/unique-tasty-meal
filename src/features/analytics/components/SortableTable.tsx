"use client";

import React from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
}

interface SortableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort: (key: string) => void;
  sortBy: string;
  sortDirection: "asc" | "desc";
  keyExtractor: (row: T) => string | number;
  className?: string;
  emptyMessage?: string;
}

export default function SortableTable<T>({
  columns,
  data,
  onSort,
  sortBy,
  sortDirection,
  keyExtractor,
  className = "",
  emptyMessage = "No data available.",
}: SortableTableProps<T>) {
  const renderSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) return null;

    return (
      <span className="ml-1 text-[#7A2E2E]">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div
      className={`overflow-x-auto bg-white rounded-xl border border-[#f3f1f1] shadow-sm ${className}`}
    >
      <table className="w-full text-left whitespace-nowrap">
        <thead>
          <tr className="border-b border-[#f3f1f1] bg-[#fcfcfc]">
            {columns.map((col) => {
              const alignment =
                col.align === "right"
                  ? "text-right"
                  : col.align === "center"
                    ? "text-center"
                    : "text-left";
              const isSorted = sortBy === col.key;

              return (
                <th
                  key={String(col.key)}
                  className={`p-4 text-xs font-semibold uppercase tracking-wider text-[#806b6b] ${alignment} ${
                    col.sortable
                      ? "cursor-pointer hover:bg-[#f3f1f1] transition-colors select-none group"
                      : ""
                  }`}
                  onClick={() => col.sortable && onSort(String(col.key))}
                >
                  <div
                    className={`flex items-center ${col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : "justify-start"}`}
                  >
                    <span
                      className={`${isSorted ? "text-[#7A2E2E] font-bold" : ""}`}
                    >
                      {col.label}
                    </span>
                    {col.sortable && renderSortIcon(String(col.key))}
                    {col.sortable && !isSorted && (
                      <span className="ml-1 text-[#D2D2D2] opacity-0 group-hover:opacity-100 transition-opacity">
                        ↕
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f3f1f1] text-sm">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-8 text-center text-[#999999]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-[#fcfcfc] transition-colors"
              >
                {columns.map((col) => {
                  const alignment =
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                        ? "text-center"
                        : "text-left";
                  const isSortedCol = sortBy === col.key;

                  return (
                    <td
                      key={String(col.key)}
                      className={`p-4 text-[#1e1414] ${alignment} ${isSortedCol ? "bg-[#fcfcfc]/50" : ""}`}
                    >
                      {col.render
                        ? col.render(row)
                        : (() => {
                            const value = row[col.key as keyof T];
                            return value !== undefined && value !== null
                              ? String(value)
                              : "-";
                          })()}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
