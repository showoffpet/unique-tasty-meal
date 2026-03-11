"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface ContactSupportModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactSupportModal({ orderId, isOpen, onClose }: ContactSupportModalProps) {
  const [topic, setTopic] = useState("missing_item");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for support ticket
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
        setMessage("");
        setTopic("missing_item");
      }, 300);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Contact Support">
      {isSuccess ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#1e1414] mb-2">Message Sent</h3>
          <p className="text-[#806b6b] mb-6">
            We&apos;ve received your request about order #{orderId.split("-")[0].toUpperCase()}. 
            Our support team will contact you shortly via email.
          </p>
          <Button onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-[#806b6b] mb-4">
            Need help with order #{orderId.split("-")[0].toUpperCase()}? Let us know what&apos;s going on.
          </p>
          
          <div>
            <label className="block text-sm font-semibold text-[#1e1414] mb-1">
              What do you need help with?
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-lg border border-[#f3f1f1] px-4 py-2 text-sm focus:border-[#7b2d2d] focus:ring-[#7b2d2d] outline-none"
              required
            >
              <option value="missing_item">Missing or incorrect item</option>
              <option value="late_delivery">Order is late</option>
              <option value="food_quality">Food quality issue</option>
              <option value="driver_issue">Issue with delivery driver</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1e1414] mb-1">
              Additional Details
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-[#f3f1f1] px-4 py-2 text-sm focus:border-[#7b2d2d] focus:ring-[#7b2d2d] outline-none min-h-[120px]"
              placeholder="Please provide more details about your issue..."
              required
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isSubmitting}
            >
              Send Message
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
