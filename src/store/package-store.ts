import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────
export interface HealthPackage {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  price: number;
  originalPrice: number;
  category: string;
  duration: string;
  testsIncluded: string[];
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackageBooking {
  id: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: string;
  patientGender: string;
  bookingDate: string;
  preferredDate: string;
  preferredTime: string;
  address: string;
  paymentMethod: "card" | "upi" | "netbanking" | "cod";
  paymentStatus: "paid" | "pending" | "failed";
  bookingStatus: "confirmed" | "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface PackageState {
  packages: HealthPackage[];
  addPackage: (pkg: Omit<HealthPackage, "id" | "createdAt" | "updatedAt">) => void;
  updatePackage: (id: string, data: Partial<HealthPackage>) => void;
  deletePackage: (id: string) => void;
  togglePackageStatus: (id: string) => void;

  // Bookings
  bookings: PackageBooking[];
  placeBooking: (booking: Omit<PackageBooking, "id" | "createdAt" | "updatedAt">) => PackageBooking;
  updateBookingStatus: (id: string, status: PackageBooking["bookingStatus"]) => void;
  updatePaymentStatus: (id: string, status: PackageBooking["paymentStatus"]) => void;

  // Shop UI
  isShopOpen: boolean;
  openShop: () => void;
  closeShop: () => void;
  selectedPackage: HealthPackage | null;
  setSelectedPackage: (pkg: HealthPackage | null) => void;
}

// ─── Sample Data ─────────────────────────────────────────────
const samplePackages: HealthPackage[] = [
  {
    id: "PKG-1001",
    name: "Basic Health Checkup",
    description: "Comprehensive basic health screening package designed for early detection and general wellness monitoring. Ideal for individuals aged 18-40 seeking routine health assessment.",
    benefits: [
      "Complete Blood Count (CBC)",
      "Blood Sugar (Fasting)",
      "Lipid Profile",
      "Liver Function Test",
      "Kidney Function Test",
      "Urine Analysis",
      "Chest X-Ray",
      "ECG",
      "General Physician Consultation",
    ],
    price: 49.99,
    originalPrice: 79.99,
    category: "Basic",
    duration: "4-6 hours",
    testsIncluded: ["CBC", "Fasting Sugar", "Lipid Profile", "LFT", "KFT", "Urine Routine", "Chest X-Ray", "ECG"],
    image: "🩺",
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "PKG-1002",
    name: "Cardiac Health Package",
    description: "Specialized cardiac assessment package for heart health evaluation. Includes advanced cardiac markers and imaging for comprehensive cardiovascular risk assessment.",
    benefits: [
      "All Basic Checkup Tests",
      "Troponin T & I",
      "BNP (Brain Natriuretic Peptide)",
      "2D Echo Cardiography",
      "Stress Test (TMT)",
      "Homocysteine Levels",
      "HS-CRP (High Sensitivity CRP)",
      "Cardiologist Consultation",
      "Diet & Lifestyle Counseling",
    ],
    price: 149.99,
    originalPrice: 219.99,
    category: "Cardiac",
    duration: "6-8 hours",
    testsIncluded: ["CBC", "Lipid Profile", "Troponin T", "BNP", "2D Echo", "TMT", "HS-CRP", "ECG"],
    image: "❤️",
    isActive: true,
    createdAt: "2024-02-15T14:30:00Z",
    updatedAt: "2024-02-15T14:30:00Z",
  },
  {
    id: "PKG-1003",
    name: "Diabetes Care Package",
    description: "Complete diabetes management and monitoring package. Designed for pre-diabetics and diabetic patients to track and manage their condition effectively.",
    benefits: [
      "Fasting & Post-Prandial Blood Sugar",
      "HbA1c (Glycated Hemoglobin)",
      "Fructosamine",
      "Lipid Profile",
      "Kidney Function Test",
      "Urine Microalbumin",
      "Fundoscopy (Eye Exam)",
      "Diabetologist Consultation",
      "Diet Plan by Nutritionist",
    ],
    price: 99.99,
    originalPrice: 149.99,
    category: "Diabetes",
    duration: "5-7 hours",
    testsIncluded: ["FBS", "PPBS", "HbA1c", "Fructosamine", "Lipid Profile", "KFT", "Urine Microalbumin"],
    image: "🩸",
    isActive: true,
    createdAt: "2024-03-05T09:15:00Z",
    updatedAt: "2024-03-05T09:15:00Z",
  },
  {
    id: "PKG-1004",
    name: "Women's Wellness Package",
    description: "Specially curated health package for women covering key health indicators including hormonal health, bone density, and cancer screening markers.",
    benefits: [
      "Complete Blood Count",
      "Thyroid Profile (T3, T4, TSH)",
      "Vitamin D & B12",
      "Calcium & Bone Markers",
      "Iron Studies",
      "Pap Smear",
      "Mammogram (above 40 years)",
      "Gynecologist Consultation",
      "Bone Density Assessment",
    ],
    price: 129.99,
    originalPrice: 189.99,
    category: "Women",
    duration: "5-6 hours",
    testsIncluded: ["CBC", "Thyroid Profile", "Vitamin D", "Vitamin B12", "Calcium", "Iron Studies", "Pap Smear"],
    image: "👩",
    isActive: true,
    createdAt: "2024-04-02T16:20:00Z",
    updatedAt: "2024-04-02T16:20:00Z",
  },
  {
    id: "PKG-1005",
    name: "Executive Health Package",
    description: "Premium comprehensive health package for corporate executives and high-performance individuals. Includes advanced diagnostics and premium consultations.",
    benefits: [
      "All Basic & Advanced Blood Tests",
      "Full Body MRI Screening",
      "CT Coronary Angiography",
      "Advanced Cardiac Assessment",
      "Pulmonary Function Test",
      "Audiometry & Vision Test",
      "Stress Management Consultation",
      "Nutritionist Session",
      "Personal Health Report Card",
      "1-Year Follow-Up Plan",
    ],
    price: 399.99,
    originalPrice: 599.99,
    category: "Premium",
    duration: "Full Day",
    testsIncluded: ["All Blood Tests", "MRI", "CT Coronary", "PFT", "Audiometry", "Vision Test", "ECG", "2D Echo"],
    image: "🏆",
    isActive: true,
    createdAt: "2024-05-01T13:00:00Z",
    updatedAt: "2024-05-01T13:00:00Z",
  },
  {
    id: "PKG-1006",
    name: "Senior Citizen Package",
    description: "Tailored health assessment for senior citizens aged 60 and above. Focuses on age-related health risks, chronic disease monitoring, and preventive care.",
    benefits: [
      "Complete Blood Count & ESR",
      "Blood Sugar & HbA1c",
      "Lipid & Liver Profile",
      "Kidney Function & Electrolytes",
      "Vitamin D, B12 & Calcium",
      "Thyroid Profile",
      "Prostate Screening (PSA) for Men",
      "Bone Density Scan",
      "Geriatrician Consultation",
      "Mobility & Balance Assessment",
    ],
    price: 179.99,
    originalPrice: 249.99,
    category: "Senior",
    duration: "6-8 hours",
    testsIncluded: ["CBC", "ESR", "FBS", "HbA1c", "Lipid Profile", "LFT", "KFT", "Vitamin D", "B12", "PSA"],
    image: "👴",
    isActive: true,
    createdAt: "2024-05-10T10:30:00Z",
    updatedAt: "2024-05-10T10:30:00Z",
  },
];

const sampleBookings: PackageBooking[] = [
  {
    id: "PBK-5001",
    packageId: "PKG-1001",
    packageName: "Basic Health Checkup",
    packagePrice: 49.99,
    patientName: "John Doe",
    patientEmail: "john@example.com",
    patientPhone: "+1 (555) 101-2001",
    patientAge: "35",
    patientGender: "Male",
    bookingDate: "2024-05-15",
    preferredDate: "2024-05-20",
    preferredTime: "09:00 AM",
    address: "123 Main St, New York, NY 10001",
    paymentMethod: "card",
    paymentStatus: "paid",
    bookingStatus: "completed",
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-05-20T14:00:00Z",
  },
  {
    id: "PBK-5002",
    packageId: "PKG-1002",
    packageName: "Cardiac Health Package",
    packagePrice: 149.99,
    patientName: "Emily Johnson",
    patientEmail: "emily@example.com",
    patientPhone: "+1 (555) 303-4003",
    patientAge: "52",
    patientGender: "Female",
    bookingDate: "2024-05-22",
    preferredDate: "2024-05-25",
    preferredTime: "10:00 AM",
    address: "456 Oak Ave, Brooklyn, NY 11201",
    paymentMethod: "upi",
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    createdAt: "2024-05-22T14:30:00Z",
    updatedAt: "2024-05-22T14:30:00Z",
  },
  {
    id: "PBK-5003",
    packageId: "PKG-1005",
    packageName: "Executive Health Package",
    packagePrice: 399.99,
    patientName: "Michael Smith",
    patientEmail: "michael@example.com",
    patientPhone: "+1 (555) 202-3002",
    patientAge: "45",
    patientGender: "Male",
    bookingDate: "2024-05-25",
    preferredDate: "2024-05-28",
    preferredTime: "08:00 AM",
    address: "789 Pine St, Queens, NY 11375",
    paymentMethod: "netbanking",
    paymentStatus: "pending",
    bookingStatus: "scheduled",
    createdAt: "2024-05-25T08:15:00Z",
    updatedAt: "2024-05-25T08:15:00Z",
  },
];

// ─── Store ───────────────────────────────────────────────────
export const usePackageStore = create<PackageState>((set, get) => ({
  packages: samplePackages,

  addPackage: (data) => {
    const pkg: HealthPackage = {
      ...data,
      id: `PKG-${1000 + get().packages.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ packages: [...state.packages, pkg] }));
  },

  updatePackage: (id, data) => {
    set((state) => ({
      packages: state.packages.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },

  deletePackage: (id) => {
    set((state) => ({ packages: state.packages.filter((p) => p.id !== id) }));
  },

  togglePackageStatus: (id) => {
    set((state) => ({
      packages: state.packages.map((p) =>
        p.id === id ? { ...p, isActive: !p.isActive, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },

  // ─── Bookings ─────────────────────────────────────────────
  bookings: sampleBookings,

  placeBooking: (bookingData) => {
    const booking: PackageBooking = {
      ...bookingData,
      id: `PBK-${5000 + get().bookings.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      bookings: [booking, ...state.bookings],
    }));
    return booking;
  },

  updateBookingStatus: (id, status) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, bookingStatus: status, updatedAt: new Date().toISOString() } : b
      ),
    }));
  },

  updatePaymentStatus: (id, status) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, paymentStatus: status, updatedAt: new Date().toISOString() } : b
      ),
    }));
  },

  // ─── Shop UI ────────────────────────────────────────────
  isShopOpen: false,
  openShop: () => set({ isShopOpen: true }),
  closeShop: () => set({ isShopOpen: false, selectedPackage: null }),
  selectedPackage: null,
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
}));
