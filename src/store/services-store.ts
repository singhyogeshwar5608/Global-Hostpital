import { create } from "zustand";
import {
  fetchPublicServices,
  createService as apiCreateService,
  updateService as apiUpdateService,
  deleteService as apiDeleteService,
} from "@/lib/api";

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

interface ServicesStore {
  services: Service[];
  loading: boolean;
  error: string | null;
  loadServices: () => Promise<void>;
  addService: (data: Omit<Service, "id">) => Promise<void>;
  updateService: (id: string, data: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

const defaultServices: Service[] = [
  { id: "s1", name: "Find Doctors", description: "Search and connect with top specialists worldwide", icon: "Stethoscope", isActive: true },
  { id: "s2", name: "Book Appointment", description: "Schedule appointments at your convenience", icon: "CalendarPlus", isActive: true },
  { id: "s3", name: "Video Consultation", description: "Consult with doctors from the comfort of your home", icon: "Video", isActive: true },
  { id: "s4", name: "Lab Tests", description: "Book lab tests and get reports online", icon: "FlaskConical", isActive: true },
  { id: "s5", name: "Order Medicines", description: "Order prescribed medicines for home delivery", icon: "Pill", isActive: true },
  { id: "s6", name: "Health Packages", description: "Comprehensive health checkup packages", icon: "Package", isActive: true },
];

function loadLocal(): Service[] {
  try {
    const stored = localStorage.getItem("gclinic-services");
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultServices;
}

function saveLocal(services: Service[]) {
  try { localStorage.setItem("gclinic-services", JSON.stringify(services)); } catch {}
}

export const useServicesStore = create<ServicesStore>((set, get) => ({
  services: loadLocal(),
  loading: false,
  error: null,

  loadServices: async () => {
    set({ loading: true, error: null });
    try {
      const data: any[] = await fetchPublicServices();
      const mapped: Service[] = data.map((s: any) => ({
        id: String(s.id),
        name: s.name,
        description: s.description || "",
        icon: s.icon || "Package",
        isActive: s.is_active,
      }));
      saveLocal(mapped);
      set({ services: mapped, loading: false });
    } catch {
      const fallback = loadLocal();
      set({ services: fallback, loading: false, error: null });
    }
  },

  addService: async (data) => {
    try {
      const res: any = await apiCreateService({
        name: data.name,
        description: data.description,
        icon: data.icon,
        is_active: data.isActive,
      });
      const service: Service = {
        id: String(res.id),
        name: res.name,
        description: res.description || "",
        icon: res.icon || "Package",
        isActive: res.is_active,
      };
      const updated = [...get().services, service];
      saveLocal(updated);
      set({ services: updated });
    } catch {
      const service: Service = { ...data, id: "srv_" + Date.now() };
      const updated = [...get().services, service];
      saveLocal(updated);
      set({ services: updated });
    }
  },

  updateService: async (id, data) => {
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      try {
        const payload: any = {};
        if (data.name !== undefined) payload.name = data.name;
        if (data.description !== undefined) payload.description = data.description;
        if (data.icon !== undefined) payload.icon = data.icon;
        if (data.isActive !== undefined) payload.is_active = data.isActive;
        await apiUpdateService(numericId, payload);
      } catch {}
    }
    const updated = get().services.map((s) => (s.id === id ? { ...s, ...data } : s));
    saveLocal(updated);
    set({ services: updated });
  },

  deleteService: async (id) => {
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      try { await apiDeleteService(numericId); } catch {}
    }
    const updated = get().services.filter((s) => s.id !== id);
    saveLocal(updated);
    set({ services: updated });
  },
}));
