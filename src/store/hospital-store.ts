import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────
export interface Hospital {
  id: string;
  name: string;
  logo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phone: string;
  email: string;
  website: string;
  emergencyNumber: string;
  registrationNumber: string;
  registrationDocuments: string[];
  type: "government" | "private" | "semi-government" | "trust" | "ngo";
  specialty: string[];
  bedCapacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HospitalState {
  hospitals: Hospital[];
  addHospital: (data: Omit<Hospital, "id" | "createdAt" | "updatedAt">) => void;
  updateHospital: (id: string, data: Partial<Hospital>) => void;
  deleteHospital: (id: string) => void;
  toggleHospitalStatus: (id: string) => void;
}

// ─── Sample Data ─────────────────────────────────────────────
const sampleHospitals: Hospital[] = [
  {
    id: "HOS-1001",
    name: "City Heart Center",
    logo: "🏥",
    address: "456 Cardiology Lane, Manhattan",
    city: "New York",
    state: "New York",
    country: "USA",
    pinCode: "10001",
    phone: "+1 (212) 555-0101",
    email: "info@cityheartcenter.com",
    website: "www.cityheartcenter.com",
    emergencyNumber: "+1 (212) 911-0101",
    registrationNumber: "REG-NYC-2019-4521",
    registrationDocuments: ["registration_certificate.pdf", "health_license.pdf"],
    type: "private",
    specialty: ["Cardiology", "Cardiac Surgery", "Interventional Cardiology"],
    bedCapacity: 200,
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "HOS-1002",
    name: "Metro General Hospital",
    logo: "🏥",
    address: "789 Health Boulevard, Brooklyn",
    city: "New York",
    state: "New York",
    country: "USA",
    pinCode: "11201",
    phone: "+1 (718) 555-0202",
    email: "admin@metrogeneral.com",
    website: "www.metrogeneral.com",
    emergencyNumber: "+1 (718) 911-0202",
    registrationNumber: "REG-NYC-2018-3210",
    registrationDocuments: ["registration_certificate.pdf", "fire_safety.pdf", "health_license.pdf"],
    type: "government",
    specialty: ["General Medicine", "Emergency Medicine", "Orthopedics", "Pediatrics"],
    bedCapacity: 500,
    isActive: true,
    createdAt: "2024-02-15T14:30:00Z",
    updatedAt: "2024-02-15T14:30:00Z",
  },
  {
    id: "HOS-1003",
    name: "Sunrise Skin & Eye Clinic",
    logo: "🏥",
    address: "321 Wellness Avenue, Queens",
    city: "New York",
    state: "New York",
    country: "USA",
    pinCode: "11375",
    phone: "+1 (347) 555-0303",
    email: "contact@sunriseclinic.com",
    website: "www.sunriseclinic.com",
    emergencyNumber: "+1 (347) 911-0303",
    registrationNumber: "REG-NYC-2020-7890",
    registrationDocuments: ["registration_certificate.pdf", "dermatology_license.pdf"],
    type: "private",
    specialty: ["Dermatology", "Ophthalmology", "Cosmetology"],
    bedCapacity: 80,
    isActive: true,
    createdAt: "2024-03-05T09:15:00Z",
    updatedAt: "2024-03-05T09:15:00Z",
  },
  {
    id: "HOS-1004",
    name: "NeuroCare Institute",
    logo: "🏥",
    address: "567 Brain Street, Manhattan",
    city: "New York",
    state: "New York",
    country: "USA",
    pinCode: "10022",
    phone: "+1 (212) 555-0404",
    email: "info@neurocareinstitute.com",
    website: "www.neurocareinstitute.com",
    emergencyNumber: "+1 (212) 911-0404",
    registrationNumber: "REG-NYC-2021-5678",
    registrationDocuments: ["registration_certificate.pdf", "neurology_license.pdf", "nabl_cert.pdf"],
    type: "private",
    specialty: ["Neurology", "Neurosurgery", "Psychiatry"],
    bedCapacity: 150,
    isActive: true,
    createdAt: "2024-04-02T16:20:00Z",
    updatedAt: "2024-04-02T16:20:00Z",
  },
  {
    id: "HOS-1005",
    name: "Community Health Trust",
    logo: "🏥",
    address: "890 Service Road, Bronx",
    city: "New York",
    state: "New York",
    country: "USA",
    pinCode: "10451",
    phone: "+1 (718) 555-0505",
    email: "help@communityhealthtrust.org",
    website: "www.communityhealthtrust.org",
    emergencyNumber: "+1 (718) 911-0505",
    registrationNumber: "REG-NYC-2017-1234",
    registrationDocuments: ["registration_certificate.pdf", "trust_deed.pdf"],
    type: "trust",
    specialty: ["General Medicine", "Pediatrics", "Gynecology", "Dental"],
    bedCapacity: 300,
    isActive: false,
    createdAt: "2024-05-10T10:30:00Z",
    updatedAt: "2024-05-15T12:00:00Z",
  },
];

// ─── Store ───────────────────────────────────────────────────
export const useHospitalStore = create<HospitalState>((set, get) => ({
  hospitals: sampleHospitals,

  addHospital: (data) => {
    const hospital: Hospital = {
      ...data,
      id: `HOS-${1000 + get().hospitals.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ hospitals: [...state.hospitals, hospital] }));
  },

  updateHospital: (id, data) => {
    set((state) => ({
      hospitals: state.hospitals.map((h) =>
        h.id === id ? { ...h, ...data, updatedAt: new Date().toISOString() } : h
      ),
    }));
  },

  deleteHospital: (id) => {
    set((state) => ({ hospitals: state.hospitals.filter((h) => h.id !== id) }));
  },

  toggleHospitalStatus: (id) => {
    set((state) => ({
      hospitals: state.hospitals.map((h) =>
        h.id === id ? { ...h, isActive: !h.isActive, updatedAt: new Date().toISOString() } : h
      ),
    }));
  },
}));
