"use client";

import { Clock, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/Progress";

interface PrepWorkloadProps {
  todayCount: number;
  todayGoal: number;
  tomorrowCount: number;
}

export function PrepWorkloadCard({
  todayCount,
  todayGoal,
  tomorrowCount,
}: PrepWorkloadProps) {
  const percentage = Math.round((todayCount / todayGoal) * 100);

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-burgundy/10 rounded-lg">
              <Clock className="w-6 h-6 text-[#7A2E2E]" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">
              Today&apos;s Preparation
            </h3>
          </div>
          <span className="text-2xl font-black text-[#7A2E2E]">
            {todayCount}/{todayGoal}
          </span>
        </div>
        <Progress value={percentage} className="h-3 bg-gray-100" />
        <p className="text-xs text-gray-400 mt-3 font-medium tracking-wide uppercase">
          {percentage}% of daily capacity scheduled
        </p>
      </div>

      <div className="pt-6 border-t border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Calendar className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">
              Tomorrow&apos;s Batch
            </h3>
          </div>
          <span className="text-2xl font-black text-gray-400">
            {tomorrowCount}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2 font-medium tracking-wide uppercase">
          Orders scheduled for 48h fulfillment
        </p>
      </div>
    </div>
  );
}
