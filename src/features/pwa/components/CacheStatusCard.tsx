import React, { useState } from "react";
import Button from "../../../components/ui/Button";

export interface CacheResourceData {
  type: string;
  count: number;
  sizeMB: number;
}

interface CacheStatusCardProps {
  totalItems: number;
  totalSizeMB: number;
  oldestItemAt: string;
  newestItemAt: string;
  staleCount: number;
  resources: CacheResourceData[];
  onClearCache: () => Promise<void>;
  className?: string;
}

export const CacheStatusCard: React.FC<CacheStatusCardProps> = ({
  totalItems,
  totalSizeMB,
  oldestItemAt,
  newestItemAt,
  staleCount,
  resources,
  onClearCache,
  className = "",
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearConfirm = async () => {
    setIsClearing(true);
    try {
      await onClearCache();
      setIsConfirming(false);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] p-5 shadow-sm ${className}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-[#1e1414]">Local Data Cache</h3>
          <p className="text-xs text-[#806b6b] mt-0.5">
            Manage data stored on your device for offline use
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#1e1414] block">
            {totalSizeMB.toFixed(1)} MB
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#999999]">
            Total Size
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#fcfcfc] border border-[#f3f1f1] rounded-lg p-3">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#999999] mb-1">
            Total Items
          </p>
          <p className="text-lg font-bold text-[#1e1414]">{totalItems}</p>
        </div>
        <div className="bg-[#fcfcfc] border border-[#f3f1f1] rounded-lg p-3">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#999999] mb-1">
            Stale Items
          </p>
          <p
            className={`text-lg font-bold ${staleCount > 0 ? "text-[#D97706]" : "text-[#1e1414]"}`}
          >
            {staleCount}
          </p>
        </div>
        <div className="bg-[#fcfcfc] border border-[#f3f1f1] rounded-lg p-3">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#999999] mb-1">
            Oldest Entry
          </p>
          <p
            className="text-xs font-semibold text-[#1e1414] mt-1 pr-2 truncate"
            title={new Date(oldestItemAt).toLocaleString()}
          >
            {new Date(oldestItemAt).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-[#fcfcfc] border border-[#f3f1f1] rounded-lg p-3">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#999999] mb-1">
            Newest Entry
          </p>
          <p
            className="text-xs font-semibold text-[#1e1414] mt-1 pr-2 truncate"
            title={new Date(newestItemAt).toLocaleString()}
          >
            {new Date(newestItemAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#806b6b] mb-3 border-b border-[#f3f1f1] pb-2">
          Resource Breakdown
        </h4>
        <ul className="space-y-2">
          {resources.map((res) => (
            <li
              key={res.type}
              className="flex justify-between items-center text-sm"
            >
              <span className="font-medium text-[#1e1414] capitalize">
                {res.type}
              </span>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-[#806b6b]">{res.count} items</span>
                <span className="font-mono text-[#999999] w-12 text-right">
                  {res.sizeMB.toFixed(1)}M
                </span>
              </div>
            </li>
          ))}
          {resources.length === 0 && (
            <li className="text-sm text-[#999999] italic">
              No resources cached yet.
            </li>
          )}
        </ul>
      </div>

      <div className="pt-4 border-t border-[#f3f1f1]">
        {isConfirming ? (
          <div className="bg-[#7b2d2d]/5 border border-[#7b2d2d]/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
            <p className="text-sm font-bold text-[#7b2d2d] mb-3">
              Are you sure you want to clear the cache?
            </p>
            <p className="text-xs text-[#806b6b] mb-4">
              You will need an internet connection to download this data again.
              Un-synced changes might be lost.
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                className="border border-[#f3f1f1] hover:bg-[#f3f1f1]"
                onClick={() => setIsConfirming(false)}
                disabled={isClearing}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                className="bg-[#7b2d2d] hover:bg-[#561b1b]"
                onClick={handleClearConfirm}
                disabled={isClearing}
              >
                {isClearing ? "Clearing..." : "Yes, clear cache"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-[#999999] max-w-[250px]">
              Clearing cache will remove all offline data and require a re-sync
              on the next connection.
            </p>
            <Button
              type="button"
              variant="ghost"
              className="text-[#7b2d2d] hover:bg-[#7b2d2d]/10 font-bold"
              onClick={() => setIsConfirming(true)}
              disabled={totalItems === 0}
            >
              Clear Cache
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
