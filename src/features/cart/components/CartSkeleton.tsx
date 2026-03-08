import React from "react";
import Skeleton from "../../../components/ui/Skeleton";

interface CartSkeletonProps {
  className?: string;
  itemCount?: number;
}

export default function CartSkeleton({
  className = "",
  itemCount = 3,
}: CartSkeletonProps) {
  return (
    <div className={`flex flex-col lg:flex-row gap-8 ${className}`}>
      {/* Main Cart Area */}
      <div className="w-full lg:w-2/3 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton variant="text" width={150} height={28} />
          <Skeleton variant="text" width={80} height={20} />
        </div>

        <div className="bg-white rounded-xl border border-[#f3f1f1] overflow-hidden">
          {[...Array(itemCount)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 border-b border-[#f3f1f1] last:border-0"
            >
              <Skeleton
                variant="rectangular"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg shrink-0"
              />
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between mb-2">
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="circular" width={24} height={24} />
                </div>
                <Skeleton variant="text" width="80%" height={16} />
                <Skeleton variant="text" width="40%" height={16} />

                <div className="mt-auto pt-3 flex items-center justify-between">
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={32}
                    className="rounded-lg"
                  />
                  <Skeleton variant="text" width={60} height={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Area */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-xl border border-[#f3f1f1] p-6 lg:sticky lg:top-6">
          <Skeleton variant="text" width={120} height={24} className="mb-6" />

          <Skeleton
            variant="rectangular"
            width="100%"
            height={48}
            className="rounded-lg mb-6"
          />

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <Skeleton variant="text" width={80} height={16} />
              <Skeleton variant="text" width={40} height={16} />
            </div>
            <div className="flex justify-between">
              <Skeleton variant="text" width={70} height={16} />
              <Skeleton variant="text" width={40} height={16} />
            </div>
            <div className="flex justify-between">
              <Skeleton variant="text" width={100} height={16} />
              <Skeleton variant="text" width={40} height={16} />
            </div>
          </div>

          <div className="border-t border-[#f3f1f1] pt-4 mb-6 flex justify-between">
            <Skeleton variant="text" width={60} height={24} />
            <Skeleton variant="text" width={80} height={24} />
          </div>

          <Skeleton
            variant="rectangular"
            width="100%"
            height={48}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
