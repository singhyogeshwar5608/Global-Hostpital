import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────
export interface DoctorSchedule {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  availableDays: number[]; // 0=Sun .. 6=Sat
  availableSlots: string[]; // e.g. ["09:00","10:00","11:00","14:30","16:00"]
  slotDuration: number; // minutes per slot
  createdAt: string;
  updatedAt: string;
}

export interface BookedSlot {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientReason: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  paymentStatus: "paid" | "pending" | "refunded";
  paymentMethod: "card" | "upi" | "insurance";
  meetingLink?: string;
  fee: number;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStep =
  | "specialty"
  | "doctor"
  | "schedule"
  | "patient-info"
  | "payment"
  | "confirmation";

// ─── Data ────────────────────────────────────────────────────
export const specialties = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Dermatology",
  "Pediatrics",
  "Gynecology",
  "Ophthalmology",
  "ENT",
  "Psychiatry",
  "General Medicine",
];

export const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const defaultTimeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

const formatTime = (time24: string): string => {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
};

export { formatTime };

// ─── Sample Doctor Schedules ─────────────────────────────────
const sampleSchedules: DoctorSchedule[] = [
  {
    id: "SCH-1001",
    doctorId: "DOC-1001",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    availableDays: [1, 2, 3, 4, 5],
    availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:30", "17:00"],
    slotDuration: 30,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "SCH-1002",
    doctorId: "DOC-1002",
    doctorName: "Dr. Michael Chen",
    specialty: "Neurologist",
    availableDays: [1, 3, 5],
    availableSlots: ["09:30", "10:30", "11:30", "14:30", "16:00"],
    slotDuration: 30,
    createdAt: "2024-02-15T14:30:00Z",
    updatedAt: "2024-02-15T14:30:00Z",
  },
  {
    id: "SCH-1003",
    doctorId: "DOC-1003",
    doctorName: "Dr. Emily Williams",
    specialty: "Dermatologist",
    availableDays: [2, 4, 6],
    availableSlots: ["10:00", "11:00", "12:00", "15:00", "16:30"],
    slotDuration: 30,
    createdAt: "2024-03-05T09:15:00Z",
    updatedAt: "2024-03-05T09:15:00Z",
  },
];

// ─── Sample Booked Slots ─────────────────────────────────────
const today = new Date();
const todayStr = today.toISOString().split("T")[0];
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split("T")[0];
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);
const dayAfterStr = dayAfter.toISOString().split("T")[0];

const sampleBookings: BookedSlot[] = [
  {
    id: "APT-2001",
    doctorId: "DOC-1001",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: todayStr,
    time: "10:00",
    patientName: "John Doe",
    patientEmail: "john@example.com",
    patientPhone: "+1 (555) 101-2001",
    patientReason: "Chest pain and shortness of breath",
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "card",
    meetingLink: `https://meet.globalintegrativeclinic.com/DOC-1001-${todayStr}-10:00`,
    fee: 500,
    createdAt: new Date(today.getTime() - 86400000 * 2).toISOString(),
    updatedAt: new Date(today.getTime() - 86400000 * 2).toISOString(),
  },
  {
    id: "APT-2002",
    doctorId: "DOC-1001",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: todayStr,
    time: "14:00",
    patientName: "Alice Brown",
    patientEmail: "alice@example.com",
    patientPhone: "+1 (555) 404-5054",
    patientReason: "Follow-up for blood pressure",
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "upi",
    meetingLink: `https://meet.globalintegrativeclinic.com/DOC-1001-${todayStr}-14:00`,
    fee: 500,
    createdAt: new Date(today.getTime() - 86400000).toISOString(),
    updatedAt: new Date(today.getTime() - 86400000).toISOString(),
  },
  {
    id: "APT-2003",
    doctorId: "DOC-1002",
    doctorName: "Dr. Michael Chen",
    specialty: "Neurologist",
    date: tomorrowStr,
    time: "10:30",
    patientName: "Michael Smith",
    patientEmail: "michael@example.com",
    patientPhone: "+1 (555) 202-3002",
    patientReason: "Recurring headaches and dizziness",
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "insurance",
    meetingLink: `https://meet.globalintegrativeclinic.com/DOC-1002-${tomorrowStr}-10:30`,
    fee: 600,
    createdAt: new Date(today.getTime() - 43200000).toISOString(),
    updatedAt: new Date(today.getTime() - 43200000).toISOString(),
  },
  {
    id: "APT-2004",
    doctorId: "DOC-1003",
    doctorName: "Dr. Emily Williams",
    specialty: "Dermatologist",
    date: tomorrowStr,
    time: "15:00",
    patientName: "Emily Johnson",
    patientEmail: "emily@example.com",
    patientPhone: "+1 (555) 303-4003",
    patientReason: "Skin rash and allergic reaction",
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "card",
    meetingLink: `https://meet.globalintegrativeclinic.com/DOC-1003-${tomorrowStr}-15:00`,
    fee: 400,
    createdAt: new Date(today.getTime() - 36000000).toISOString(),
    updatedAt: new Date(today.getTime() - 36000000).toISOString(),
  },
  {
    id: "APT-2005",
    doctorId: "DOC-1001",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: dayAfterStr,
    time: "11:00",
    patientName: "William Davis",
    patientEmail: "william@example.com",
    patientPhone: "+1 (555) 505-6065",
    patientReason: "Heart palpitations during exercise",
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "card",
    meetingLink: `https://meet.globalintegrativeclinic.com/DOC-1001-${dayAfterStr}-11:00`,
    fee: 500,
    createdAt: new Date(today.getTime() - 14400000).toISOString(),
    updatedAt: new Date(today.getTime() - 14400000).toISOString(),
  },
  {
    id: "APT-2006",
    doctorId: "DOC-1002",
    doctorName: "Dr. Michael Chen",
    specialty: "Neurologist",
    date: todayStr,
    time: "14:30",
    patientName: "Sarah Miller",
    patientEmail: "sarah.m@example.com",
    patientPhone: "+1 (555) 606-7076",
    patientReason: "Memory concerns and brain fog",
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "upi",
    fee: 600,
    createdAt: new Date(today.getTime() - 172800000).toISOString(),
    updatedAt: new Date(today.getTime() - 86400000).toISOString(),
  },
  {
    id: "APT-2007",
    doctorId: "DOC-1003",
    doctorName: "Dr. Emily Williams",
    specialty: "Dermatologist",
    date: dayAfterStr,
    time: "10:00",
    patientName: "Robert Wilson",
    patientEmail: "robert@example.com",
    patientPhone: "+1 (555) 707-8087",
    patientReason: "Acne treatment consultation",
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "insurance",
    meetingLink: `https://meet.globalintegrativeclinic.com/DOC-1003-${dayAfterStr}-10:00`,
    fee: 400,
    createdAt: new Date(today.getTime() - 7200000).toISOString(),
    updatedAt: new Date(today.getTime() - 7200000).toISOString(),
  },
  {
    id: "APT-2008",
    doctorId: "DOC-1001",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: tomorrowStr,
    time: "09:00",
    patientName: "Jennifer Lee",
    patientEmail: "jennifer@example.com",
    patientPhone: "+1 (555) 808-9098",
    patientReason: "Routine cardiac checkup",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "card",
    fee: 500,
    createdAt: new Date(today.getTime() - 259200000).toISOString(),
    updatedAt: new Date(today.getTime() - 86400000).toISOString(),
  },
];

// ─── Public Modal State ──────────────────────────────────────
export const doctors = [
  {
    id: "DOC-1001",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4",
    rating: 4.9,
    experience: "15 years",
    fee: 500,
    availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:30", "17:00"],
    availableDays: [1, 2, 3, 4, 5],
  },
  {
    id: "DOC-1002",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=michael&backgroundColor=c0aede",
    rating: 4.8,
    experience: "12 years",
    fee: 600,
    availableSlots: ["09:30", "10:30", "11:30", "14:30", "16:00"],
    availableDays: [1, 3, 5],
  },
  {
    id: "DOC-1003",
    name: "Dr. Emily Williams",
    specialty: "Dermatology",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=emily&backgroundColor=ffd5dc",
    rating: 4.7,
    experience: "10 years",
    fee: 400,
    availableSlots: ["10:00", "11:00", "12:00", "15:00", "16:30"],
    availableDays: [2, 4, 6],
  },
  {
    id: "DOC-1004",
    name: "Dr. James Rodriguez",
    specialty: "Orthopedics",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=james&backgroundColor=d1d4f9",
    rating: 4.9,
    experience: "18 years",
    fee: 550,
    availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    availableDays: [1, 2, 3, 4, 5],
  },
  {
    id: "DOC-1005",
    name: "Dr. Priya Sharma",
    specialty: "Pediatrics",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=priya&backgroundColor=ffeaa7",
    rating: 4.8,
    experience: "14 years",
    fee: 350,
    availableSlots: ["09:00", "10:30", "12:00", "14:00", "15:30"],
    availableDays: [1, 2, 4, 5, 6],
  },
  {
    id: "DOC-1006",
    name: "Dr. Lisa Park",
    specialty: "Gynecology",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=lisa&backgroundColor=ffdfba",
    rating: 4.9,
    experience: "16 years",
    fee: 500,
    availableSlots: ["09:00", "10:00", "11:30", "14:30", "16:00"],
    availableDays: [1, 3, 5],
  },
  {
    id: "DOC-1007",
    name: "Dr. Robert Kim",
    specialty: "General Medicine",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=robert&backgroundColor=b6e3f4",
    rating: 4.6,
    experience: "8 years",
    fee: 300,
    availableSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
    availableDays: [1, 2, 3, 4, 5, 6],
  },
  {
    id: "DOC-1008",
    name: "Dr. Anna Martinez",
    specialty: "Psychiatry",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=anna&backgroundColor=c0aede",
    rating: 4.7,
    experience: "11 years",
    fee: 450,
    availableSlots: ["10:00", "11:00", "12:00", "15:00", "16:00"],
    availableDays: [2, 3, 4, 5],
  },
];

const initialState = {
  isOpen: false,
  currentStep: "specialty" as AppointmentStep,
  selectedSpecialty: "",
  selectedDoctor: null as typeof doctors[0] | null,
  selectedDate: undefined as Date | undefined,
  selectedTime: "",
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  patientReason: "",
  paymentMethod: "card" as const,
  isProcessing: false,
  currentBooking: null as BookedSlot | null,
};

interface AppointmentState {
  // ─── Public Modal State ────────────────────────────────
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  currentStep: AppointmentStep;
  setStep: (step: AppointmentStep) => void;

  selectedSpecialty: string;
  setSelectedSpecialty: (s: string) => void;
  selectedDoctor: typeof doctors[0] | null;
  setSelectedDoctor: (d: typeof doctors[0] | null) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (d: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;

  patientName: string;
  setPatientName: (n: string) => void;
  patientEmail: string;
  setPatientEmail: (e: string) => void;
  patientPhone: string;
  setPatientPhone: (p: string) => void;
  patientReason: string;
  setPatientReason: (r: string) => void;

  paymentMethod: "card" | "upi" | "insurance";
  setPaymentMethod: (m: "card" | "upi" | "insurance") => void;
  isProcessing: boolean;

  // ─── Admin Booking Management ──────────────────────────
  bookedSlots: BookedSlot[];
  currentBooking: BookedSlot | null;

  addBooking: (booking: Omit<BookedSlot, "id" | "createdAt" | "updatedAt">) => void;
  updateBookingStatus: (id: string, status: BookedSlot["status"]) => void;
  updatePaymentStatus: (id: string, status: BookedSlot["paymentStatus"]) => void;
  editBooking: (id: string, data: Partial<BookedSlot>) => void;
  deleteBooking: (id: string) => void;

  // ─── Doctor Schedule Management ────────────────────────
  schedules: DoctorSchedule[];
  addSchedule: (schedule: Omit<DoctorSchedule, "id" | "createdAt" | "updatedAt">) => void;
  updateSchedule: (id: string, data: Partial<DoctorSchedule>) => void;
  deleteSchedule: (id: string) => void;

  // ─── Availability Check ────────────────────────────────
  getAvailableTimeSlots: (doctorId: string, date: string) => string[];
  isSlotAvailable: (doctorId: string, date: string, time: string) => boolean;

  // ─── Public Booking Action ─────────────────────────────
  bookAppointment: () => void;
  reset: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  ...initialState,

  // ─── Public Modal Actions ──────────────────────────────
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false, ...initialState, bookedSlots: get().bookedSlots }),
  setStep: (step) => set({ currentStep: step }),

  setSelectedSpecialty: (s) => set({ selectedSpecialty: s, selectedDoctor: null, selectedDate: undefined, selectedTime: "" }),
  setSelectedDoctor: (d) => set({ selectedDoctor: d, selectedDate: undefined, selectedTime: "" }),
  setSelectedDate: (d) => set({ selectedDate: d, selectedTime: "" }),
  setSelectedTime: (t) => set({ selectedTime: t }),

  setPatientName: (n) => set({ patientName: n }),
  setPatientEmail: (e) => set({ patientEmail: e }),
  setPatientPhone: (p) => set({ patientPhone: p }),
  setPatientReason: (r) => set({ patientReason: r }),
  setPaymentMethod: (m) => set({ paymentMethod: m }),

  // ─── Admin Booking Management ──────────────────────────
  bookedSlots: sampleBookings,

  addBooking: (data) => {
    const booking: BookedSlot = {
      ...data,
      id: `APT-${2000 + get().bookedSlots.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ bookedSlots: [booking, ...state.bookedSlots] }));
  },

  updateBookingStatus: (id, status) => {
    set((state) => ({
      bookedSlots: state.bookedSlots.map((b) =>
        b.id === id
          ? {
              ...b,
              status,
              updatedAt: new Date().toISOString(),
              paymentStatus: status === "cancelled" ? "refunded" as const : b.paymentStatus,
            }
          : b
      ),
    }));
  },

  updatePaymentStatus: (id, paymentStatus) => {
    set((state) => ({
      bookedSlots: state.bookedSlots.map((b) =>
        b.id === id ? { ...b, paymentStatus, updatedAt: new Date().toISOString() } : b
      ),
    }));
  },

  editBooking: (id, data) => {
    // Double-booking prevention on edit
    if (data.doctorId && data.date && data.time) {
      const conflict = get().bookedSlots.find(
        (b) =>
          b.id !== id &&
          b.doctorId === data.doctorId &&
          b.date === data.date &&
          b.time === data.time &&
          b.status !== "cancelled"
      );
      if (conflict) return; // Prevent double booking
    }
    set((state) => ({
      bookedSlots: state.bookedSlots.map((b) =>
        b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b
      ),
    }));
  },

  deleteBooking: (id) => {
    set((state) => ({ bookedSlots: state.bookedSlots.filter((b) => b.id !== id) }));
  },

  // ─── Doctor Schedule Management ────────────────────────
  schedules: sampleSchedules,

  addSchedule: (data) => {
    // Check if schedule already exists for this doctor
    const existing = get().schedules.find((s) => s.doctorId === data.doctorId);
    if (existing) {
      // Update existing schedule instead
      get().updateSchedule(existing.id, {
        availableDays: data.availableDays,
        availableSlots: data.availableSlots,
        slotDuration: data.slotDuration,
      });
      return;
    }
    const schedule: DoctorSchedule = {
      ...data,
      id: `SCH-${1000 + get().schedules.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ schedules: [...state.schedules, schedule] }));
  },

  updateSchedule: (id, data) => {
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
      ),
    }));
  },

  deleteSchedule: (id) => {
    set((state) => ({ schedules: state.schedules.filter((s) => s.id !== id) }));
  },

  // ─── Availability Check ────────────────────────────────
  getAvailableTimeSlots: (doctorId, date) => {
    const state = get();
    const schedule = state.schedules.find((s) => s.doctorId === doctorId);
    if (!schedule) {
      // Fallback to doctors array for public modal
      const doctor = doctors.find((d) => d.id === doctorId);
      if (!doctor) return [];
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay();
      if (!doctor.availableDays.includes(dayOfWeek)) return [];
      const booked = state.bookedSlots.filter(
        (b) => b.doctorId === doctorId && b.date === date && b.status !== "cancelled"
      );
      const bookedTimes = new Set(booked.map((b) => b.time));
      return doctor.availableSlots.filter((slot) => !bookedTimes.has(slot));
    }

    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();

    if (!schedule.availableDays.includes(dayOfWeek)) return [];

    const booked = state.bookedSlots.filter(
      (b) => b.doctorId === doctorId && b.date === date && b.status !== "cancelled"
    );
    const bookedTimes = new Set(booked.map((b) => b.time));

    return schedule.availableSlots.filter((slot) => !bookedTimes.has(slot));
  },

  isSlotAvailable: (doctorId, date, time) => {
    const state = get();
    const booked = state.bookedSlots.find(
      (b) =>
        b.doctorId === doctorId &&
        b.date === date &&
        b.time === time &&
        b.status !== "cancelled"
    );
    return !booked;
  },

  // ─── Public Booking Action ─────────────────────────────
  bookAppointment: () => {
    const state = get();
    const { selectedDoctor, selectedDate, selectedTime, patientName, patientEmail, patientPhone, patientReason, paymentMethod } = state;

    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    const dateStr = selectedDate.toISOString().split("T")[0];

    // Double-booking prevention
    const alreadyBooked = state.bookedSlots.find(
      (b) =>
        b.doctorId === selectedDoctor.id &&
        b.date === dateStr &&
        b.time === selectedTime &&
        b.status !== "cancelled"
    );
    if (alreadyBooked) return;

    set({ isProcessing: true });

    setTimeout(() => {
      const booking: BookedSlot = {
        id: `APT-${2000 + state.bookedSlots.length + 1}`,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: dateStr,
        time: selectedTime,
        patientName,
        patientEmail,
        patientPhone,
        patientReason,
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod,
        meetingLink: `https://meet.globalintegrativeclinic.com/${selectedDoctor.id}-${dateStr}-${selectedTime}`,
        fee: selectedDoctor.fee,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((s) => ({
        bookedSlots: [booking, ...s.bookedSlots],
        currentBooking: booking,
        isProcessing: false,
        currentStep: "confirmation",
      }));
    }, 1500);
  },

  reset: () => set({ ...initialState, bookedSlots: get().bookedSlots }),
}));
