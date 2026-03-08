import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import { Integration } from "./IntegrationCard";
import type { IntegrationConfigData } from "../types";

interface ConfigurationModalProps {
  integration: Integration | null;
  onSave: (configData: IntegrationConfigData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  integration,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const isNew = !integration;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "failure" | null>(
    null,
  );

  // Basic Form State
  const [formData, setFormData] = useState({
    providerName: integration?.providerName || "",
    apiKey: "",
    syncFrequency: "hourly",
    baseUrl: "",
    webhookSecret: "",
    rateLimitCount: "",
  });

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Mock validation logic: if API key ends in 'error', simulate failure
      if (formData.apiKey.toLowerCase().endsWith("error")) {
        setTestResult("failure");
      } else {
        setTestResult("success");
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      setTestResult("failure");
    } finally {
      setIsTesting(false);
    }
  };

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.providerName || !formData.apiKey) return;

    if (formData.apiKey.length < 8) {
      setValidationError("API key must be at least 8 characters.");
      return;
    }

    if (formData.baseUrl) {
      try {
        new URL(formData.baseUrl);
      } catch {
        setValidationError("Base URL must be a valid URL (e.g. https://api.example.com).");
        return;
      }
    }

    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      ></div>

      {/* Modal */}
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden border border-[#f3f1f1] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f3f1f1] bg-[#fcfcfc] flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#1e1414]">
              {isNew
                ? "New Integration"
                : `Configure ${integration.providerName}`}
            </h2>
            <p className="text-xs text-[#806b6b]">
              {isNew
                ? "Connect a new 3rd-party service to UTM"
                : "Update credentials and sync settings"}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-[#999999] hover:text-[#7b2d2d] hover:bg-[#7b2d2d]/10 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          <form
            id="integration-config-form"
            onSubmit={handleSave}
            className="space-y-6"
          >
            {validationError && (
              <div className="p-3 bg-[#7b2d2d]/10 text-[#7b2d2d] text-sm font-medium rounded-lg border border-[#7b2d2d]/20">
                {validationError}
              </div>
            )}

            {/* Basic Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#1e1414] tracking-wider uppercase border-b border-[#f3f1f1] pb-2">
                Basic Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#806b6b] mb-1">
                    Integration Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.providerName}
                    onChange={(e) =>
                      setFormData({ ...formData, providerName: e.target.value })
                    }
                    placeholder="e.g. Stripe Production"
                    className="w-full border border-[#f3f1f1] rounded-lg p-2.5 text-sm focus:ring-[#7A2E2E] focus:border-[#7A2E2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#806b6b] mb-1">
                    API Key / Token *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.apiKey}
                    onChange={(e) =>
                      setFormData({ ...formData, apiKey: e.target.value })
                    }
                    placeholder="sk_live_..."
                    className="w-full border border-[#f3f1f1] rounded-lg p-2.5 text-sm focus:ring-[#7A2E2E] focus:border-[#7A2E2E] font-mono"
                  />
                  <p className="text-[10px] text-[#999999] mt-1">
                    Stored securely using military-grade encryption.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#806b6b] mb-1">
                  Sync Frequency
                </label>
                <select
                  value={formData.syncFrequency}
                  onChange={(e) =>
                    setFormData({ ...formData, syncFrequency: e.target.value })
                  }
                  className="w-full border border-[#f3f1f1] rounded-lg p-2.5 text-sm bg-white focus:ring-[#7A2E2E] focus:border-[#7A2E2E]"
                >
                  <option value="realtime">
                    Real-time (Webhooks required)
                  </option>
                  <option value="5m">Every 5 minutes</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>
            </div>

            {/* Test Connection Button */}
            <div className="bg-[#fcfcfc] border border-[#f3f1f1] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#1e1414] mb-1">
                  Validate Credentials
                </p>
                <p className="text-[10px] text-[#806b6b]">
                  Check if the API key has the correct permissions.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {testResult === "success" && (
                  <span className="flex items-center text-xs font-bold text-[#2E7D32]">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Connection OK
                  </span>
                )}
                {testResult === "failure" && (
                  <span className="flex items-center text-xs font-bold text-[#7b2d2d]">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Auth Failed
                  </span>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleTestConnection}
                  disabled={isTesting || !formData.apiKey}
                  className="whitespace-nowrap w-full sm:w-auto border border-[#f3f1f1] hover:bg-[#f3f1f1]"
                >
                  {isTesting ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </div>

            {/* Advanced Settings Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm font-bold text-[#7A2E2E] hover:text-[#7b2d2d] hover:bg-[#7A2E2E]/5 px-3 py-2 rounded-lg transition-colors w-full"
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Advanced Settings
              </button>

              {/* Advanced Settings Expandable Area */}
              {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-[#f3f1f1] space-y-4 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#806b6b] mb-1">
                        Base URL Override
                      </label>
                      <input
                        type="url"
                        value={formData.baseUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, baseUrl: e.target.value })
                        }
                        placeholder="https://api.custom.com/v1"
                        className="w-full border border-[#f3f1f1] rounded-lg p-2.5 text-sm focus:ring-[#7A2E2E] focus:border-[#7A2E2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#806b6b] mb-1">
                        Webhook Signing Secret
                      </label>
                      <input
                        type="password"
                        value={formData.webhookSecret}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            webhookSecret: e.target.value,
                          })
                        }
                        placeholder="whsec_..."
                        className="w-full border border-[#f3f1f1] rounded-lg p-2.5 text-sm focus:ring-[#7A2E2E] focus:border-[#7A2E2E] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#806b6b] mb-1">
                        Rate Limit Handling
                      </label>
                      <select className="w-full border border-[#f3f1f1] rounded-lg p-2.5 text-sm bg-white focus:ring-[#7A2E2E] focus:border-[#7A2E2E]">
                        <option value="exponential_backoff">
                          Exponential Backoff (Recommended)
                        </option>
                        <option value="linear">Linear Delay</option>
                        <option value="fail_fast">Fail Fast</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f3f1f1] bg-[#fcfcfc] flex justify-end gap-3 shrink-0">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            form="integration-config-form"
            type="submit"
            variant="primary"
            disabled={isLoading || !formData.providerName || !formData.apiKey}
          >
            {isLoading
              ? "Saving..."
              : isNew
                ? "Create Integration"
                : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};
