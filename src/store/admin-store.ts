import { create } from "zustand";
import { login as apiLogin, logout as apiLogout } from "@/lib/api";

interface AdminState {
  isLoggedIn: boolean;
  username: string;
  isPanelOpen: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isLoggedIn: false,
  username: "",
  isPanelOpen: false,

  login: async (email: string, password: string) => {
    try {
      const res: any = await apiLogin(email, password, "admin");
      set({ isLoggedIn: true, username: res.user?.email || email });
      return true;
    } catch {
      return false;
    }
  },

  logout: () => {
    apiLogout();
    set({ isLoggedIn: false, username: "", isPanelOpen: false });
  },

  openPanel: () => {
    const stored = localStorage.getItem("api_token");
    set({ isPanelOpen: true, isLoggedIn: !!stored, username: stored ? "admin@globalclinic.com" : "" });
  },

  closePanel: () => {
    set({ isPanelOpen: false, isLoggedIn: false });
  },
}));
