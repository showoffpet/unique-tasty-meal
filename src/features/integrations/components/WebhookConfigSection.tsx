import React, { useState } from "react";
import Button from "../../../components/ui/Button";

export interface WebhookEndpoint {
  id: string;
  eventType: string;
  url: string;
  isActive: boolean;
  deliveryStatus: "healthy" | "degraded" | "failing" | "unknown";
  lastDeliveryAt?: string;
  failureCount: number;
  successCount: number;
  totalDeliveries: number;
  averageResponseTime: number;
}

interface WebhookConfigSectionProps {
  webhooks: WebhookEndpoint[];
  integrationId: string;
  onTriggerTest: (webhookId: string) => void;
  isLoading?: boolean;
}

export const WebhookConfigSection: React.FC<WebhookConfigSectionProps> = ({
  webhooks,
  integrationId,
  onTriggerTest,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#f3f1f1] overflow-hidden animate-pulse">
        <div className="p-4 border-b border-[#f3f1f1] bg-[#fcfcfc]">
          <div className="h-4 bg-[#f3f1f1] rounded w-32"></div>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 bg-[#f3f1f1] rounded w-64"></div>
              <div className="h-8 bg-[#f3f1f1] rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20";
      case "degraded":
        return "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20";
      case "failing":
        return "bg-[#7b2d2d]/10 text-[#7b2d2d] border-[#7b2d2d]/20";
      default:
        return "bg-[#f3f1f1] text-[#806b6b] border-[#f3f1f1]";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#f3f1f1] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#f3f1f1] bg-[#fcfcfc] flex justify-between items-center">
        <div>
          <h3 className="font-bold text-[#1e1414]">Webhook Endpoints</h3>
          <p className="text-xs text-[#806b6b] mt-0.5">
            Manage automated event notifications
          </p>
        </div>
        <Button variant="secondary" size="sm">
          Add Webhook
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#f3f1f1] text-xs font-semibold uppercase tracking-wider text-[#999999]">
              <th className="p-4">Event Type</th>
              <th className="p-4">Endpoint URL</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Active</th>
              <th className="p-4 text-right">Metrics (24h)</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f1f1] text-sm">
            {webhooks.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#999999]">
                  No webhooks configured for this integration.
                </td>
              </tr>
            ) : (
              webhooks.map((hook) => (
                <tr
                  key={hook.id}
                  className="hover:bg-[#fcfcfc] transition-colors"
                >
                  <td className="p-4 font-bold text-[#1e1414]">
                    {hook.eventType}
                  </td>
                  <td
                    className="p-4 text-[#806b6b] font-mono text-xs max-w-[200px] truncate"
                    title={hook.url}
                  >
                    {hook.url}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeColor(hook.deliveryStatus)}`}
                    >
                      {hook.deliveryStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={hook.isActive}
                        readOnly
                      />
                      <div className="w-9 h-5 bg-[#f3f1f1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2E7D32]"></div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-semibold text-[#1e1414]">
                        {hook.successCount} / {hook.totalDeliveries}{" "}
                        <span className="text-[#999999] font-normal tracking-wide ml-1">
                          ok
                        </span>
                      </span>
                      <span className="text-[10px] text-[#999999]">
                        ~{hook.averageResponseTime}ms avg
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTriggerTest(hook.id)}
                      className="text-[#7A2E2E] hover:bg-[#7A2E2E]/10"
                    >
                      Test
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
