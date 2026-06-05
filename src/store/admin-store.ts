import { create } from "zustand";

interface AdminState {
  isLoggedIn: boolean;
  username: string;
  isPanelOpen: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export const useAdminStore = create<AdminState>((set) => ({
  isLoggedIn: false,
  username: "",
  isPanelOpen: false,

  login: (username: string, password: string) => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      set({ isLoggedIn: true, username });
      return true;
    }
    return false;
  },

  logout: () => set({ isLoggedIn: false, username: "", isPanelOpen: false }),

  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false, isLoggedIn: false }),
}));
