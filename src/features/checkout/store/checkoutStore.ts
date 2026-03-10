import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CheckoutState {
  currentStep: number;
  deliveryAddressId: string | null;
  billingAddressSameAsDelivery: boolean;
  billingAddressId: string | null;
  paymentMethod: "card" | "wallet" | "cod" | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setDeliveryAddress: (id: string) => void;
  setBillingAddressSameAsDelivery: (same: boolean) => void;
  setBillingAddress: (id: string) => void;
  setPaymentMethod: (method: "card" | "wallet" | "cod") => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      deliveryAddressId: null,
      billingAddressSameAsDelivery: true,
      billingAddressId: null,
      paymentMethod: null,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 3) set({ currentStep: currentStep + 1 });
      },
      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) set({ currentStep: currentStep - 1 });
      },
      setDeliveryAddress: (id) => set({ deliveryAddressId: id }),
      setBillingAddressSameAsDelivery: (same) =>
        set({ billingAddressSameAsDelivery: same }),
      setBillingAddress: (id) => set({ billingAddressId: id }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      resetCheckout: () =>
        set({
          currentStep: 1,
          deliveryAddressId: null,
          billingAddressSameAsDelivery: true,
          billingAddressId: null,
          paymentMethod: null,
        }),
    }),
    {
      name: "utm-checkout-storage",
    },
  ),
);
