import React from "react";
import PromoCodeCard from "./PromoCodeCard";
import EmptyState from "../../../components/ui/EmptyState";
import type { Database } from "@/lib/supabase/database.types";

type PromoRow = Database["public"]["Tables"]["promo_codes"]["Row"];

interface PromoCodeListProps {
  promos: PromoRow[];
  onEdit?: (promo: PromoRow) => void;
  onDelete?: (id: string) => void;
  adminView?: boolean;
  className?: string;
}

export default function PromoCodeList({
  promos,
  onEdit,
  onDelete,
  adminView = false,
  className = "",
}: PromoCodeListProps) {
  if (promos.length === 0) {
    return (
      <EmptyState
        title="No Promo Codes"
        message={
          adminView
            ? "You haven't created any promotional codes yet."
            : "You have no saved promo codes. Look out for promotional emails!"
        }
        icon={
          <svg
            className="w-12 h-12 text-[#999999]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        }
      />
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {promos.map((promo) => (
        <PromoCodeCard
          key={promo.id}
          promo={promo}
          onEdit={onEdit}
          onDelete={onDelete}
          adminView={adminView}
        />
      ))}
    </div>
  );
}
