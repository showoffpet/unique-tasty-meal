import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Database } from "@/lib/supabase/database.types";

type AddressRow =
  Database["public"]["Tables"]["user_delivery_addresses"]["Row"];

interface AddressState {
  addresses: AddressRow[];
  isLoading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
  addAddress: (
    address: Omit<AddressRow, "id" | "user_id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  updateAddress: (
    id: string,
    updates: Partial<Omit<AddressRow, "id" | "user_id" | "updated_at">>,
  ) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

// Mock initial data based on PRD requirements
const mockAddresses: AddressRow[] = [
  {
    id: "addr_1",
    user_id: "user_1",
    label: "Home",
    street_address: "123 Main St",
    apartment: "Apt 4B",
    city: "New York",
    postal_code: "10001",
    latitude: 40.7128,
    longitude: -74.006,
    delivery_instructions: "Leave at front door",
    is_default: true,
    deleted_at: null,
    delivery_zones: null,
    formatted_address: "123 Main St, New York, NY 10001, USA",
    google_places_id: null,
    is_verified: true,
    usage_count: 5,
    verification_status: "verified",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "addr_2",
    user_id: "user_1",
    label: "Work",
    street_address: "456 Market St",
    apartment: "Suite 200",
    city: "New York",
    postal_code: "10004",
    latitude: 40.7042,
    longitude: -74.0136,
    delivery_instructions: "Leave with reception",
    is_default: false,
    deleted_at: null,
    delivery_zones: null,
    formatted_address: "456 Market St, New York, NY 10004, USA",
    google_places_id: null,
    is_verified: true,
    usage_count: 2,
    verification_status: "verified",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "addr_3",
    user_id: "user_1",
    label: "Other",
    street_address: "789 Broadway",
    apartment: null,
    city: "Brooklyn",
    postal_code: "11206",
    latitude: 40.7024,
    longitude: -73.9441,
    delivery_instructions: null,
    is_default: false,
    deleted_at: null,
    delivery_zones: null,
    formatted_address: "789 Broadway, Brooklyn, NY 11206, USA",
    google_places_id: null,
    is_verified: true,
    usage_count: 0,
    verification_status: "verified",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: mockAddresses,
      isLoading: false,
      error: null,

      fetchAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, fetch from Supabase here
          // For now, we rely on the persisted mock data or re-initialize it
          // set({ addresses: data });

          // Simulation delay
          await new Promise((resolve) => setTimeout(resolve, 800));
        } catch (error) {
          const err = error as any;
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },

      addAddress: async (addressData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const newAddress: AddressRow = {
            ...addressData,
            id: `addr_${Math.random().toString(36).substring(7)}`,
            user_id: "current_user",
            latitude: 0,
            longitude: 0,
            deleted_at: null,
            delivery_zones: null,
            formatted_address: "",
            google_places_id: null,
            is_verified: false,
            usage_count: 0,
            verification_status: "pending",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const currentAddresses = get().addresses;

          // If this is the new default, unset others
          let updatedAddresses = currentAddresses;
          if (newAddress.is_default) {
            updatedAddresses = currentAddresses.map((addr) => ({
              ...addr,
              is_default: false,
            }));
          }

          set({ addresses: [...updatedAddresses, newAddress] });
        } catch (error) {
          const err = error as any;
          set({ error: err.message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      updateAddress: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 800));

          const currentAddresses = get().addresses;
          let updatedAddresses = currentAddresses;

          if (updates.is_default) {
            updatedAddresses = currentAddresses.map((addr) => ({
              ...addr,
              is_default: false,
            }));
          }

          set({
            addresses: updatedAddresses.map((addr) =>
              addr.id === id
                ? { ...addr, ...updates, updated_at: new Date().toISOString() }
                : addr,
            ),
          });
        } catch (error) {
          const err = error as any;
          set({ error: err.message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteAddress: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 600));
          set({ addresses: get().addresses.filter((addr) => addr.id !== id) });
        } catch (error) {
          const err = error as any;
          set({ error: err.message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      setDefaultAddress: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 400));
          set({
            addresses: get().addresses.map((addr) => ({
              ...addr,
              is_default: addr.id === id,
            })),
          });
        } catch (error) {
          const err = error as any;
          set({ error: err.message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "address-storage",
    },
  ),
);
