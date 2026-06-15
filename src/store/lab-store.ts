import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────
export interface LabPersonnel {
  name: string;
  photo: string;
  qualification: string;
  gstNumber?: string;
  registrationDocuments?: string;
  signature?: string;
}

export interface Lab {
  id: string;
  password: string;
  labName: string;
  district: string;
  state: string;
  country: string;

  // Lab Owner
  ownerName: string;
  ownerQualification: string;

  // Lab Technician
  technician: LabPersonnel;

  // Pathologist
  pathologist: LabPersonnel;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LabState {
  labs: Lab[];
  addLab: (lab: Omit<Lab, "id" | "password" | "isActive" | "createdAt" | "updatedAt">) => { id: string; password: string };
  updateLab: (id: string, data: Partial<Lab>) => void;
  deleteLab: (id: string) => void;
  toggleLabStatus: (id: string) => void;

  // Login
  labLogin: (labId: string, password: string) => Lab | null;
  currentLab: Lab | null;
  isLabLoggedIn: boolean;
  labLogout: () => void;
  setLabLoggedIn: (lab: Lab) => void;

  // UI
  isLabPanelOpen: boolean;
  openLabPanel: () => void;
  closeLabPanel: () => void;
  isLabLoginPage: boolean;
  showLabLoginPage: () => void;
  showLabDashboard: () => void;
}

// ─── ID & Password Generator ─────────────────────────────────
const generateLabId = (): string => {
  const prefix = "LAB";
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
};

const generatePassword = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let pass = "";
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

// ─── Sample Data ─────────────────────────────────────────────
const sampleLabs: Lab[] = [
  {
    id: "LAB-1001",
    password: "LabPass2k24",
    labName: "City Diagnostic Center",
    district: "Manhattan",
    state: "New York",
    country: "USA",
    ownerName: "Dr. Robert Anderson",
    ownerQualification: "MBBS, MD Pathology",
    technician: {
      name: "James Wilson",
      photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=james&backgroundColor=b6e3f4",
      qualification: "DMLT, BSc MLT",
      gstNumber: "12ABCDE3456F1Z5",
      registrationDocuments: "Reg_DOC_1001.pdf",
      signature: "Sign_James.png",
    },
    pathologist: {
      name: "Dr. Sarah Mitchell",
      photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=sarahm&backgroundColor=c0aede",
      qualification: "MBBS, MD Pathology",
      gstNumber: "12FGHIJ7890K2L6",
      registrationDocuments: "Reg_PATH_1001.pdf",
      signature: "Sign_SarahM.png",
    },
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "LAB-1002",
    password: "MedLab2024!",
    labName: "Metro Pathology Lab",
    district: "Brooklyn",
    state: "New York",
    country: "USA",
    ownerName: "Dr. Linda Carter",
    ownerQualification: "MBBS, DCP",
    technician: {
      name: "Mark Thompson",
      photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=mark&backgroundColor=ffd5dc",
      qualification: "BSc MLT, DMLT",
      gstNumber: "23KLMNO1234P3Q7",
      registrationDocuments: "Reg_DOC_1002.pdf",
      signature: "Sign_Mark.png",
    },
    pathologist: {
      name: "Dr. Emily Ross",
      photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=emilyr&backgroundColor=ffeaa7",
      qualification: "MBBS, MD Pathology, FRCPath",
      gstNumber: "23PQRST5678R4S8",
      registrationDocuments: "Reg_PATH_1002.pdf",
      signature: "Sign_EmilyR.png",
    },
    isActive: true,
    createdAt: "2024-02-15T14:30:00Z",
    updatedAt: "2024-02-15T14:30:00Z",
  },
  {
    id: "LAB-1003",
    password: "BioLabSecure",
    labName: "Queens Bio-Medical Lab",
    district: "Queens",
    state: "New York",
    country: "USA",
    ownerName: "Dr. Alan Price",
    ownerQualification: "MBBS, PhD Microbiology",
    technician: {
      name: "Lisa Park",
      photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=lisap&backgroundColor=ffdfba",
      qualification: "MSc MLT, DMLT",
      gstNumber: "34TUVWX9012T5U9",
      registrationDocuments: "Reg_DOC_1003.pdf",
      signature: "Sign_LisaP.png",
    },
    pathologist: {
      name: "Dr. David Kim",
      photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=davidk&backgroundColor=d1d4f9",
      qualification: "MBBS, MD Pathology",
      gstNumber: "34YZABC3456V6W0",
      registrationDocuments: "Reg_PATH_1003.pdf",
      signature: "Sign_DavidK.png",
    },
    isActive: false,
    createdAt: "2024-03-20T09:15:00Z",
    updatedAt: "2024-03-20T09:15:00Z",
  },
];

// ─── Lab Test Catalog ─────────────────────────────────────────
export interface LabTest { id: string; name: string; category: string; }
export const testCatalog: LabTest[] = [
  { id: "T-01", name: "Complete Blood Count (CBC)", category: "Hematology" },
  { id: "T-02", name: "Liver Function Test (LFT)", category: "Biochemistry" },
  { id: "T-03", name: "Kidney Function Test (KFT)", category: "Biochemistry" },
  { id: "T-04", name: "Lipid Profile", category: "Biochemistry" },
  { id: "T-05", name: "Thyroid Profile (T3, T4, TSH)", category: "Endocrinology" },
  { id: "T-06", name: "Vitamin D (25-OH)", category: "Endocrinology" },
  { id: "T-07", name: "Vitamin B12", category: "Endocrinology" },
  { id: "T-08", name: "Blood Sugar Fasting", category: "Biochemistry" },
  { id: "T-09", name: "Blood Sugar PP", category: "Biochemistry" },
  { id: "T-10", name: "HbA1c", category: "Biochemistry" },
  { id: "T-11", name: "C-Reactive Protein (CRP)", category: "Immunology" },
  { id: "T-12", name: "ESR", category: "Hematology" },
  { id: "T-13", name: "Urine Routine & Microscopy", category: "Urinalysis" },
  { id: "T-14", name: "Urine Culture & Sensitivity", category: "Microbiology" },
  { id: "T-15", name: "Dengue NS1 Antigen", category: "Microbiology" },
  { id: "T-16", name: "Malaria Antigen", category: "Microbiology" },
  { id: "T-17", name: "COVID-19 RT-PCR", category: "Microbiology" },
  { id: "T-18", name: "ECG (Electrocardiogram)", category: "Cardiology" },
  { id: "T-19", name: "X-Ray", category: "Radiology" },
  { id: "T-20", name: "Ultrasound", category: "Radiology" },
  { id: "T-21", name: "MRI Scan", category: "Radiology" },
  { id: "T-22", name: "CT Scan", category: "Radiology" },
];

// Which labs can perform which tests (labId → testId[])
export const labTestAvailability: Record<string, string[]> = {
  "LAB-1001": ["T-01","T-02","T-03","T-04","T-05","T-06","T-07","T-08","T-09","T-10","T-11","T-12","T-13","T-14","T-15","T-16","T-17"],
  "LAB-1002": ["T-01","T-02","T-03","T-04","T-05","T-06","T-07","T-08","T-09","T-10","T-11","T-12","T-13","T-18","T-19"],
  "LAB-1003": ["T-18","T-19","T-20","T-21","T-22","T-01","T-02","T-03","T-04"],
};

// ─── Store ───────────────────────────────────────────────────
export const useLabStore = create<LabState>((set, get) => ({
  labs: sampleLabs,

  addLab: (data) => {
    const id = generateLabId();
    const password = generatePassword();
    const lab: Lab = {
      ...data,
      id,
      password,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ labs: [...state.labs, lab] }));
    return { id, password };
  },

  updateLab: (id, data) => {
    set((state) => ({
      labs: state.labs.map((l) =>
        l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l
      ),
    }));
  },

  deleteLab: (id) => {
    set((state) => ({ labs: state.labs.filter((l) => l.id !== id) }));
  },

  toggleLabStatus: (id) => {
    set((state) => ({
      labs: state.labs.map((l) =>
        l.id === id ? { ...l, isActive: !l.isActive, updatedAt: new Date().toISOString() } : l
      ),
    }));
  },

  // ─── Login ───────────────────────────────────────────────
  labLogin: (labId, password) => {
    const lab = get().labs.find((l) => l.id === labId && l.password === password);
    if (lab) {
      set({ currentLab: lab, isLabLoggedIn: true });
      return lab;
    }
    return null;
  },

  currentLab: null,
  isLabLoggedIn: false,
  labLogout: () => set({ currentLab: null, isLabLoggedIn: false, isLabPanelOpen: false }),
  setLabLoggedIn: (lab) => set({ currentLab: lab, isLabLoggedIn: true }),

  // ─── UI ──────────────────────────────────────────────────
  isLabPanelOpen: false,
  openLabPanel: () => set({ isLabPanelOpen: true, isLabLoginPage: true }),
  closeLabPanel: () => set({ isLabPanelOpen: false, isLabLoggedIn: false, currentLab: null }),
  isLabLoginPage: true,
  showLabLoginPage: () => set({ isLabLoginPage: true }),
  showLabDashboard: () => set({ isLabLoginPage: false }),
}));
