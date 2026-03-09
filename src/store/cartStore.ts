import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartCustomizations {
  portion: string;
  spice_level: number;
  instructions?: string;
  add_ons?: Record<string, number>; // e.g. { "Extra Egg": 1.50 }
}

export interface CartItem {
  id: string; // Unique ID for the cart entry (could be meal_id + hash of customizations)
  meal_id: string;
  name: string;
  image_url: string;
  base_price: number;
  quantity: number;
  customizations: CartCustomizations;
  price_modifier: number; // Sum of portion modifier + add-ons
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => {
          // Check if an identical item already exists in the cart.
          // For a true production app, you'd serialize the customizations into a hash string to compare perfectly.
          // Here, we just rely on the unique `id` passed in representing that exact combo.
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === newItem.id,
          );

          if (existingItemIndex > -1) {
            // If the exact same customization exists, just increment quantity
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += newItem.quantity;
            return { items: newItems };
          } else {
            // Otherwise, add as a new row
            return { items: [...state.items, newItem] };
          }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, newQuantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, newQuantity) }
              : item,
          ),
        })),

      clearCart: () => set({ items: [] }),

      cartTotal: () => {
        return get().items.reduce(
          (total, item) =>
            total + (item.base_price + item.price_modifier) * item.quantity,
          0,
        );
      },

      cartItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "utm-cart-storage", // name of the item in the storage (must be unique)
      // getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    },
  ),
);
