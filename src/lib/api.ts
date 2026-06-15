const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("api_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("api_token", token);
    } else {
      localStorage.removeItem("api_token");
    }
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { "Accept": "application/json" };
    if (this.token) h["Authorization"] = `Bearer ${this.token}`;
    return h;
  }

  private async request<T>(method: string, path: string, body?: any): Promise<T> {
    const opts: RequestInit = { method, headers: this.headers() };
    if (body && !(body instanceof FormData)) {
      opts.headers = { ...opts.headers, "Content-Type": "application/json" };
      opts.body = JSON.stringify(body);
    } else if (body instanceof FormData) {
      opts.body = body;
    }
    const res = await fetch(`${API_BASE}${path}`, opts);
    if (res.status === 204) return undefined as T;
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || `API error: ${res.status}`);
    }
    return res.json();
  }

  get<T>(path: string) { return this.request<T>("GET", path); }
  post<T>(path: string, body?: any) { return this.request<T>("POST", path, body); }
  put<T>(path: string, body?: any) { return this.request<T>("PUT", path, body); }
  delete<T>(path: string) { return this.request<T>("DELETE", path); }

  upload<T>(path: string, formData: FormData, method: "POST" | "PUT" = "POST") {
    return this.request<T>(method, path, formData);
  }
}

export const api = new ApiClient();

// ─── Auth ─────────────────────────────────────────────────────
export async function login(email: string, password: string, role: string = "admin") {
  const res: any = await api.post("/login", { email, password, role });
  api.setToken(res.token);
  return res;
}

export function logout() {
  api.post("/logout").catch(() => {});
  api.setToken(null);
}

// ─── Doctors ──────────────────────────────────────────────────
export function fetchDoctors() { return api.get<any[]>("/doctors"); }
export function fetchPublicDoctors() { return api.get<any[]>("/public/doctors"); }
export function createDoctor(data: any) { return api.post<any>("/doctors", data); }
export function updateDoctor(id: number, data: any) { return api.put<any>(`/doctors/${id}`, data); }
export function deleteDoctor(id: number) { return api.delete(`/doctors/${id}`); }

// ─── Services ─────────────────────────────────────────────────
export function fetchServices() { return api.get<any[]>("/services"); }
export function fetchPublicServices() { return api.get<any[]>("/public/services"); }
export function createService(data: any) { return api.post<any>("/services", data); }
export function updateService(id: number, data: any) { return api.put<any>(`/services/${id}`, data); }
export function deleteService(id: number) { return api.delete(`/services/${id}`); }

// ─── Reels ────────────────────────────────────────────────────
export function fetchReels() { return api.get<any[]>("/reels"); }
export function fetchPublicReels() { return api.get<any[]>("/public/reels"); }
export function createReel(data: any) { return api.post<any>("/reels", data); }
export function updateReel(id: number, data: any) { return api.put<any>(`/reels/${id}`, data); }
export function deleteReel(id: number) { return api.delete(`/reels/${id}`); }

// ─── Doctor Schedules ─────────────────────────────────────────
export function fetchSchedules() { return api.get<any[]>("/doctor-schedules"); }
export function createSchedule(data: any) { return api.post<any>("/doctor-schedules", data); }

// ─── Booked Slots ─────────────────────────────────────────────
export function fetchBookedSlots() { return api.get<any[]>("/booked-slots"); }
export function createBookedSlot(data: any) { return api.post<any>("/booked-slots", data); }
export function updateBookedSlot(id: number, data: any) { return api.put<any>(`/booked-slots/${id}`, data); }

// ─── Patients ─────────────────────────────────────────────────
export function fetchPatients() { return api.get<any[]>("/patients"); }
export function createPatient(data: any) { return api.post<any>("/patients", data); }
export function updatePatient(id: number, data: any) { return api.put<any>(`/patients/${id}`, data); }
export function deletePatient(id: number) { return api.delete(`/patients/${id}`); }

// ─── Patient Bookings/Appointments ────────────────────────────
export function fetchPatientBookings() { return api.get<any[]>("/patient-bookings"); }
export function createPatientBooking(data: any) { return api.post<any>("/patient-bookings", data); }
export function updatePatientBooking(id: number, data: any) { return api.put<any>(`/patient-bookings/${id}`, data); }
export function deletePatientBooking(id: number) { return api.delete(`/patient-bookings/${id}`); }

// ─── Hospitals ────────────────────────────────────────────────
export function fetchHospitals() { return api.get<any[]>("/hospitals"); }
export function createHospital(data: any) { return api.post<any>("/hospitals", data); }
export function updateHospital(id: number, data: any) { return api.put<any>(`/hospitals/${id}`, data); }
export function deleteHospital(id: number) { return api.delete(`/hospitals/${id}`); }

// ─── Labs ─────────────────────────────────────────────────────
export function fetchLabs() { return api.get<any[]>("/labs"); }
export function createLab(data: any) { return api.post<any>("/labs", data); }
export function updateLab(id: number, data: any) { return api.put<any>(`/labs/${id}`, data); }
export function deleteLab(id: number) { return api.delete(`/labs/${id}`); }

// ─── Medicines ────────────────────────────────────────────────
export function fetchMedicines() { return api.get<any[]>("/medicines"); }
export function createMedicine(data: any) { return api.post<any>("/medicines", data); }
export function updateMedicine(id: number, data: any) { return api.put<any>(`/medicines/${id}`, data); }
export function deleteMedicine(id: number) { return api.delete(`/medicines/${id}`); }

// ─── Health Packages ──────────────────────────────────────────
export function fetchHealthPackages() { return api.get<any[]>("/health-packages"); }
export function createHealthPackage(data: any) { return api.post<any>("/health-packages", data); }
export function updateHealthPackage(id: number, data: any) { return api.put<any>(`/health-packages/${id}`, data); }
export function deleteHealthPackage(id: number) { return api.delete(`/health-packages/${id}`); }
