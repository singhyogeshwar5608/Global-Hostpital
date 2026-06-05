import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: string;
  fee: number;
  availableSlots: string[]; // e.g. ["09:00","10:00","11:00","14:30","16:00"]
  availableDays: number[]; // 0=Sun .. 6=Sat
}

export interface BookedSlot {
  id: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: "confirmed" | "pending" | "cancelled";
  meetingLink?: string;
  createdAt: string;
}

export type AppointmentStep =
  | "specialty"
  | "doctor"
  | "schedule"
  | "patient-info"
  | "payment"
  | "confirmation";

interface AppointmentState {
  // Modal
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  // Steps
  currentStep: AppointmentStep;
  setStep: (step: AppointmentStep) => void;

  // Selections
  selectedSpecialty: string;
  setSelectedSpecialty: (s: string) => void;
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (d: Doctor | null) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (d: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;

  // Patient
  patientName: string;
  setPatientName: (n: string) => void;
  patientEmail: string;
  setPatientEmail: (e: string) => void;
  patientPhone: string;
  setPatientPhone: (p: string) => void;
  patientReason: string;
  setPatientReason: (r: string) => void;

  // Payment
  paymentMethod: "card" | "upi" | "insurance";
  setPaymentMethod: (m: "card" | "upi" | "insurance") => void;
  isProcessing: boolean;

  // Booking
  bookedSlots: BookedSlot[];
  currentBooking: BookedSlot | null;

  // Actions
  getAvailableTimeSlots: (doctorId: string, date: string) => string[];
  bookAppointment: () => void;
  reset: () => void;
}

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

export const doctors: Doctor[] = [
  {
    id: "dr-1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4",
    rating: 4.9,
    experience: "15 years",
    fee: 500,
    availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:30", "17:00"],
    availableDays: [1, 2, 3, 4, 5], // Mon-Fri
  },
  {
    id: "dr-2",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=michael&backgroundColor=c0aede",
    rating: 4.8,
    experience: "12 years",
    fee: 600,
    availableSlots: ["09:30", "10:30", "11:30", "14:30", "16:00"],
    availableDays: [1, 3, 5], // Mon, Wed, Fri
  },
  {
    id: "dr-3",
    name: "Dr. Emily Williams",
    specialty: "Dermatology",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=emily&backgroundColor=ffd5dc",
    rating: 4.7,
    experience: "10 years",
    fee: 400,
    availableSlots: ["10:00", "11:00", "12:00", "15:00", "16:30"],
    availableDays: [2, 4, 6], // Tue, Thu, Sat
  },
  {
    id: "dr-4",
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
    id: "dr-5",
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
    id: "dr-6",
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
    id: "dr-7",
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
    id: "dr-8",
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

const formatTime = (time24: string): string => {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
};

export { formatTime };

const initialState = {
  isOpen: false,
  currentStep: "specialty" as AppointmentStep,
  selectedSpecialty: "",
  selectedDoctor: null as Doctor | null,
  selectedDate: undefined as Date | undefined,
  selectedTime: "",
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  patientReason: "",
  paymentMethod: "card" as const,
  isProcessing: false,
  bookedSlots: [] as BookedSlot[],
  currentBooking: null as BookedSlot | null,
};

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  ...initialState,

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

  getAvailableTimeSlots: (doctorId, date) => {
    const state = get();
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return [];

    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();

    // Check if doctor works on this day
    if (!doctor.availableDays.includes(dayOfWeek)) return [];

    // Get already booked slots for this doctor + date
    const booked = state.bookedSlots.filter(
      (b) => b.doctorId === doctorId && b.date === date && b.status !== "cancelled"
    );
    const bookedTimes = new Set(booked.map((b) => b.time));

    // Return slots that are not booked
    return doctor.availableSlots.filter((slot) => !bookedTimes.has(slot));
  },

  bookAppointment: () => {
    const state = get();
    const { selectedDoctor, selectedDate, selectedTime, patientName, patientEmail, patientPhone } = state;

    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    // Double-booking prevention: check again
    const dateStr = selectedDate.toISOString().split("T")[0];
    const alreadyBooked = state.bookedSlots.find(
      (b) =>
        b.doctorId === selectedDoctor.id &&
        b.date === dateStr &&
        b.time === selectedTime &&
        b.status !== "cancelled"
    );
    if (alreadyBooked) return; // Slot already taken

    set({ isProcessing: true });

    // Simulate payment processing
    setTimeout(() => {
      const booking: BookedSlot = {
        id: `apt-${Date.now()}`,
        doctorId: selectedDoctor.id,
        date: dateStr,
        time: selectedTime,
        patientName,
        patientEmail,
        patientPhone,
        status: "confirmed",
        meetingLink: `https://meet.globalintegrativeclinic.com/${selectedDoctor.id}-${dateStr}-${selectedTime}`,
        createdAt: new Date().toISOString(),
      };

      set((s) => ({
        bookedSlots: [...s.bookedSlots, booking],
        currentBooking: booking,
        isProcessing: false,
        currentStep: "confirmation",
      }));
    }, 1500);
  },

  reset: () => set({ ...initialState, bookedSlots: get().bookedSlots }),
}));
