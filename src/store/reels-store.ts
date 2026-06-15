import { create } from "zustand";
import {
  fetchPublicReels,
  createReel as apiCreateReel,
  updateReel as apiUpdateReel,
  deleteReel as apiDeleteReel,
} from "@/lib/api";

export interface Reel {
  id: string;
  url: string;
  title: string;
  isActive: boolean;
}

interface ReelsStore {
  reels: Reel[];
  loading: boolean;
  error: string | null;
  loadReels: () => Promise<void>;
  addReel: (data: Omit<Reel, "id">) => Promise<void>;
  updateReel: (id: string, data: Partial<Reel>) => Promise<void>;
  deleteReel: (id: string) => Promise<void>;
}

const DEFAULT_REELS: Reel[] = [
  { id: "1", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Patient Success Story", isActive: true },
  { id: "2", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Expert Doctor Consultation", isActive: true },
  { id: "3", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Advanced Lab Services", isActive: true },
  { id: "4", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Medicine Delivery", isActive: true },
  { id: "5", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Patient Testimonial", isActive: true },
];

function loadLocal(): Reel[] {
  try {
    const stored = localStorage.getItem("gclinic-reels");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  saveLocal(DEFAULT_REELS);
  return DEFAULT_REELS;
}

function saveLocal(reels: Reel[]) {
  try { localStorage.setItem("gclinic-reels", JSON.stringify(reels)); } catch {}
}

export const useReelsStore = create<ReelsStore>((set, get) => ({
  reels: loadLocal(),
  loading: false,
  error: null,

  loadReels: async () => {
    set({ loading: true, error: null });
    try {
      const data: any[] = await fetchPublicReels();
      const mapped: Reel[] = data.map((r: any) => ({
        id: String(r.id),
        url: r.url,
        title: r.title,
        isActive: r.is_active,
      }));
      saveLocal(mapped);
      set({ reels: mapped, loading: false });
    } catch {
      const fallback = loadLocal();
      set({ reels: fallback, loading: false, error: null });
    }
  },

  addReel: async (data) => {
    try {
      const res: any = await apiCreateReel({
        url: data.url,
        title: data.title,
        is_active: data.isActive,
      });
      const reel: Reel = {
        id: String(res.id),
        url: res.url,
        title: res.title,
        isActive: res.is_active,
      };
      const updated = [...get().reels, reel];
      saveLocal(updated);
      set({ reels: updated });
    } catch {
      const reel: Reel = { ...data, id: "reel_" + Date.now() };
      const updated = [...get().reels, reel];
      saveLocal(updated);
      set({ reels: updated });
    }
  },

  updateReel: async (id, data) => {
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      try {
        const payload: any = {};
        if (data.url !== undefined) payload.url = data.url;
        if (data.title !== undefined) payload.title = data.title;
        if (data.isActive !== undefined) payload.is_active = data.isActive;
        await apiUpdateReel(numericId, payload);
      } catch {}
    }
    const updated = get().reels.map((r) => (r.id === id ? { ...r, ...data } : r));
    saveLocal(updated);
    set({ reels: updated });
  },

  deleteReel: async (id) => {
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      try { await apiDeleteReel(numericId); } catch {}
    }
    const updated = get().reels.filter((r) => r.id !== id);
    saveLocal(updated);
    set({ reels: updated });
  },
}));
