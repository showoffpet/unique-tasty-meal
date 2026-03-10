import { create } from "zustand";

interface UIState {
  modals: Record<string, boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;
}

export const useUIStore = create<UIState>((set, get) => ({
  modals: {},

  openModal: (modalId) => {
    set((state) => ({
      modals: { ...state.modals, [modalId]: true },
    }));
  },

  closeModal: (modalId) => {
    set((state) => ({
      modals: { ...state.modals, [modalId]: false },
    }));
  },

  isModalOpen: (modalId) => {
    return !!get().modals[modalId];
  },
}));
