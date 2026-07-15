import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  activeSidebarTab: string;
  setActiveSidebarTab: (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  activeSidebarTab: 'dashboard',
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
}));
