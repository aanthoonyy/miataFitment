import { create } from "zustand";
import type { UIStore } from "@/types/stores";

export const useUIStore = create<UIStore>((set) => ({
  bodyLoadStatus: { phase: "idle", hasBody: false },
  bodyRetryRequest: 0,
  setBodyLoadStatus: (status) => set({ bodyLoadStatus: status }),
  retryBody: () => set((state) => ({ bodyRetryRequest: state.bodyRetryRequest + 1 })),
  isSettingsOpen: false,
  activeTab: "alignment",
  bounceRequested: false,

  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  requestBounce: () => set({ bounceRequested: true }),
  clearBounceRequest: () => set({ bounceRequested: false }),
}));
