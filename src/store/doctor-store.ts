import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────
export interface Doctor {
  id: string;
  photo: string;
  name: string;
  qualification: string;
  degree: string;
  specialty: string;
  experience: string;
  mobile: string;
  email: string;
  hospitalName: string;
  district: string;
  state: string;
  country: string;
  address: string;
  consultancyFee: number;
  createdAt: string;
}

export type FieldKey =
  | "mobile"
  | "email"
  | "specialty"
  | "hospitalName"
  | "consultancyFee";

interface FieldVisibility {
  mobile: boolean;
  email: boolean;
  specialty: boolean;
  hospitalName: boolean;
  consultancyFee: boolean;
}

interface DoctorState {
  // Doctor list
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, "id" | "createdAt">) => void;
  deleteDoctor: (id: string) => void;
  editDoctor: (id: string, data: Partial<Doctor>) => void;

  // Field visibility (Super Admin controlled)
  fieldVisibility: FieldVisibility;
  toggleFieldVisibility: (field: FieldKey) => void;
}

// ─── Sample Data ─────────────────────────────────────────────
const sampleDoctors: Doctor[] = [
  {
    id: "DOC-1001",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4",
    name: "Dr. Sarah Johnson",
    qualification: "MBBS, MD",
    degree: "Cardiology",
    specialty: "Cardiologist",
    experience: "15 years",
    mobile: "+1 (555) 101-2001",
    email: "sarah.johnson@hospital.com",
    hospitalName: "City Heart Center",
    district: "Manhattan",
    state: "New York",
    country: "USA",
    address: "456 Cardiology Lane, Manhattan, NY 10001",
    consultancyFee: 500,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "DOC-1002",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=michael&backgroundColor=c0aede",
    name: "Dr. Michael Chen",
    qualification: "MBBS, MS",
    degree: "Neurology",
    specialty: "Neurologist",
    experience: "12 years",
    mobile: "+1 (555) 202-3002",
    email: "michael.chen@hospital.com",
    hospitalName: "Metro Neuro Institute",
    district: "Brooklyn",
    state: "New York",
    country: "USA",
    address: "789 Brain Street, Brooklyn, NY 11201",
    consultancyFee: 600,
    createdAt: "2024-02-20T14:30:00Z",
  },
  {
    id: "DOC-1003",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=emily&backgroundColor=ffd5dc",
    name: "Dr. Emily Williams",
    qualification: "MBBS, MD",
    degree: "Dermatology",
    specialty: "Dermatologist",
    experience: "10 years",
    mobile: "+1 (555) 303-4003",
    email: "emily.williams@hospital.com",
    hospitalName: "Skin Care Hospital",
    district: "Queens",
    state: "New York",
    country: "USA",
    address: "321 Skin Avenue, Queens, NY 11375",
    consultancyFee: 400,
    createdAt: "2024-03-10T09:15:00Z",
  },
];

export const useDoctorStore = create<DoctorState>((set, get) => ({
  doctors: sampleDoctors,

  addDoctor: (data) => {
    const doctor: Doctor = {
      ...data,
      id: `DOC-${1000 + get().doctors.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ doctors: [...state.doctors, doctor] }));
  },

  deleteDoctor: (id) => {
    set((state) => ({ doctors: state.doctors.filter((d) => d.id !== id) }));
  },

  editDoctor: (id, data) => {
    set((state) => ({
      doctors: state.doctors.map((d) =>
        d.id === id ? { ...d, ...data } : d
      ),
    }));
  },

  // Field visibility - controlled by Super Admin
  fieldVisibility: {
    mobile: true,
    email: true,
    specialty: true,
    hospitalName: true,
    consultancyFee: true,
  },

  toggleFieldVisibility: (field) => {
    set((state) => ({
      fieldVisibility: {
        ...state.fieldVisibility,
        [field]: !state.fieldVisibility[field],
      },
    }));
  },
}));
