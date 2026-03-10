import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Database } from "@/lib/supabase/database.types";
import {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";

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

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      isLoading: false,
      error: null,

      fetchAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            set({ addresses: [], isLoading: false });
            return;
          }

          const data = await getUserAddresses(user.id);
          set({ addresses: data });
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
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          const newAddress = await addUserAddress({
            ...addressData,
            user_id: user.id,
          });

          const currentAddresses = get().addresses;

          // If this is the new default, unset others locally
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
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          await updateUserAddress(id, { ...updates, user_id: user.id });

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
          await deleteUserAddress(id);
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
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          await setDefaultAddress(user.id, id);
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
