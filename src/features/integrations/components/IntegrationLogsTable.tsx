import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import Dropdown from "../../../components/ui/Dropdown";
import type { IntegrationLogFilters } from "../types";

export interface IntegrationLog {
  id: string;
  timestamp: string;
  logType: "api_call" | "webhook_delivery" | "sync_operation" | "error";
  operation: string;
  status: "success" | "failure" | "pending" | "retry" | "rate_limited";
  statusCode?: number;
  responseTime?: number; // in ms
  errorMessage?: string;
}

interface IntegrationLogsTableProps {
  logs: IntegrationLog[];
  integrationId: string;
  isLoading?: boolean;
  onFilterChange: (filters: IntegrationLogFilters) => void;
  className?: string;
}

export const IntegrationLogsTable: React.FC<IntegrationLogsTableProps> = ({
  logs,
  integrationId,
  isLoading = false,
  onFilterChange,
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(logs.length / 10)); // Mock pagination

  if (isLoading) {
    return (
      <div
        className={`overflow-x-auto bg-white border border-[#f3f1f1] rounded-xl shadow-sm animate-pulse ${className}`}
      >
        <div className="p-4 border-b border-[#f3f1f1] bg-[#fcfcfc] flex justify-between">
          <div className="h-6 bg-[#f3f1f1] rounded w-32"></div>
          <div className="h-6 bg-[#f3f1f1] rounded w-64"></div>
        </div>
        <table className="w-full text-left bg-white whitespace-nowrap">
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-[#f3f1f1]">
                <td className="p-4">
                  <div className="h-4 bg-[#f3f1f1] rounded w-24"></div>
                </td>
                <td className="p-4">
                  <div className="h-4 bg-[#f3f1f1] rounded w-16"></div>
                </td>
                <td className="p-4">
                  <div className="h-4 bg-[#f3f1f1] rounded w-32"></div>
                </td>
                <td className="p-4">
                  <div className="h-4 bg-[#f3f1f1] rounded w-20"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20">
            Success
          </span>
        );
      case "failure":
      case "rate_limited":
        return (
          <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#7b2d2d]/10 text-[#7b2d2d] border border-[#7b2d2d]/20">
            {status.replace("_", " ")}
          </span>
        );
      case "pending":
      case "retry":
        return (
          <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F59E0B]/10 text-[#D97706] border border-[#F59E0B]/20">
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#f3f1f1] text-[#806b6b] border border-[#f3f1f1]">
            {status}
          </span>
        );
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "api_call":
        return "bg-[#1e1414] text-white";
      case "webhook_delivery":
        return "bg-[#7A2E2E] text-white";
      case "sync_operation":
        return "bg-[#2E7D32] text-white";
      case "error":
        return "bg-[#7b2d2d] text-white";
      default:
        return "bg-[#999999] text-white";
    }
  };

  return (
    <div
      className={`overflow-x-auto bg-white border border-[#f3f1f1] rounded-xl shadow-sm ${className}`}
    >
      {/* Table Header / Filters */}
      <div className="p-4 border-b border-[#f3f1f1] bg-[#fcfcfc] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-[#1e1414]">Integration Audit Trail</h3>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            className="border border-[#f3f1f1] bg-white rounded-lg text-xs p-2 text-[#1e1414] focus:ring-[#7A2E2E]"
            onChange={(e) => onFilterChange({ range: e.target.value })}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <select
            className="border border-[#f3f1f1] bg-white rounded-lg text-xs p-2 text-[#1e1414] focus:ring-[#7A2E2E]"
            onChange={(e) => onFilterChange({ status: e.target.value })}
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
            <option value="pending">Pending</option>
          </select>
          <select
            className="border border-[#f3f1f1] bg-white rounded-lg text-xs p-2 text-[#1e1414] focus:ring-[#7A2E2E]"
            onChange={(e) => onFilterChange({ type: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="api_call">API Call</option>
            <option value="webhook">Webhook</option>
            <option value="sync">Sync Operation</option>
          </select>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full text-left bg-white whitespace-nowrap relative">
          <thead className="sticky top-0 bg-[#fcfcfc] z-10 shadow-sm border-b border-[#f3f1f1]">
            <tr className="text-xs font-semibold uppercase tracking-wider text-[#999999]">
              <th className="p-4">Timestamp</th>
              <th className="p-4">Type</th>
              <th className="p-4">Operation</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Code</th>
              <th className="p-4 text-right">Duration</th>
              <th className="p-4 w-1/4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f1f1] text-sm group-hover:bg-[#fcfcfc]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#999999]">
                  No logs found matching criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className={`hover:bg-[#fcfcfc] transition-colors ${log.status === "failure" ? "bg-[#7b2d2d]/5" : ""}`}
                >
                  <td className="p-4 text-xs font-medium text-[#806b6b]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${getTypeStyle(log.logType)}`}
                    >
                      {log.logType.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#1e1414]">
                    {log.operation}
                  </td>
                  <td className="p-4 text-center">
                    {getStatusBadge(log.status)}
                  </td>
                  <td className="p-4 text-center font-mono text-xs text-[#806b6b]">
                    {log.statusCode || "-"}
                  </td>
                  <td className="p-4 text-right text-xs text-[#999999]">
                    {log.responseTime ? `${log.responseTime}ms` : "-"}
                  </td>
                  <td className="p-4">
                    <div
                      className="max-w-[200px] truncate text-xs text-[#7b2d2d] font-medium"
                      title={log.errorMessage}
                    >
                      {log.errorMessage || "-"}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {logs.length > 0 && (
        <div className="p-4 border-t border-[#f3f1f1] bg-[#fcfcfc] flex justify-between items-center text-xs text-[#806b6b]">
          <span>
            Showing Data for Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border border-[#f3f1f1] hover:bg-[#f3f1f1]"
            >
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="border border-[#f3f1f1] hover:bg-[#f3f1f1]"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
