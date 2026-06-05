import { create } from "zustand";

interface DoctorPortalState {
  isPanelOpen: boolean;
  isLoggedIn: boolean;
  doctorId: string | null;
  doctorName: string | null;
  openPanel: () => void;
  closePanel: () => void;
  doctorLogin: (doctorId: string, doctorName: string) => void;
  logout: () => void;
}

export const useDoctorPortalStore = create<DoctorPortalState>((set, get) => ({
  isPanelOpen: false,
  isLoggedIn: false,
  doctorId: null,
  doctorName: null,

  openPanel: () => set({ isPanelOpen: true }),

  closePanel: () =>
    set({ isPanelOpen: false, isLoggedIn: false, doctorId: null, doctorName: null }),

  doctorLogin: (doctorId: string, doctorName: string) => {
    set({
      isLoggedIn: true,
      doctorId,
      doctorName,
    });
  },

  logout: () => {
    set({ isLoggedIn: false, doctorId: null, doctorName: null, isPanelOpen: false });
  },
}));
