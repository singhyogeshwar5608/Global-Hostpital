import { create } from "zustand";

// ─── Doctor Status ───────────────────────────────────────────
export type DoctorStatus = "active" | "inactive" | "suspended";

// ─── Permission Keys ─────────────────────────────────────────
export type PermissionKey =
  | "viewPatients"
  | "editPatients"
  | "createPrescription"
  | "editPrescription"
  | "assignLabTests"
  | "viewLabReports"
  | "downloadReports"
  | "generateMeetingLinks"
  | "videoConsultation"
  | "viewPayments"
  | "viewRevenue"
  | "manageSchedule"
  | "manageFollowUps"
  | "chatSystem"
  | "uploadMedicalDocuments";

export interface DoctorPermissions {
  viewPatients: boolean;
  editPatients: boolean;
  createPrescription: boolean;
  editPrescription: boolean;
  assignLabTests: boolean;
  viewLabReports: boolean;
  downloadReports: boolean;
  generateMeetingLinks: boolean;
  videoConsultation: boolean;
  viewPayments: boolean;
  viewRevenue: boolean;
  manageSchedule: boolean;
  manageFollowUps: boolean;
  chatSystem: boolean;
  uploadMedicalDocuments: boolean;
}

// ─── Profile Visibility Keys ────────────────────────────────
export type ProfileFieldKey =
  | "mobile"
  | "email"
  | "qualification"
  | "degree"
  | "specialty"
  | "experience"
  | "hospitalName"
  | "consultancyFee"
  | "address"
  | "certificates"
  | "reviewsRatings";

export interface DoctorProfileVisibility {
  mobile: boolean;
  email: boolean;
  qualification: boolean;
  degree: boolean;
  specialty: boolean;
  experience: boolean;
  hospitalName: boolean;
  consultancyFee: boolean;
  address: boolean;
  certificates: boolean;
  reviewsRatings: boolean;
}

// ─── Patient Access Type ────────────────────────────────────
export type PatientAccessType =
  | "all"
  | "assigned"
  | "countryWise"
  | "hospitalWise"
  | "departmentWise";

export interface PatientAccessControl {
  type: PatientAccessType;
  assignedPatientIds: string[];
  allowedCountries: string[];
  allowedHospitals: string[];
  allowedDepartments: string[];
}

// ─── Audit Log Entry ────────────────────────────────────────
export type AuditAction =
  | "login"
  | "logout"
  | "patientViewed"
  | "patientEdited"
  | "prescriptionCreated"
  | "reportViewed"
  | "meetingCreated"
  | "paymentViewed"
  | "profileUpdated"
  | "scheduleUpdated"
  | "permissionChanged"
  | "statusChanged";

export interface AuditLogEntry {
  id: string;
  doctorId: string;
  doctorName: string;
  action: AuditAction;
  details: string;
  date: string;
  time: string;
  ipAddress: string;
  device: string;
  location: string;
}

// ─── Doctor Interface ───────────────────────────────────────
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
  status: DoctorStatus;
  password: string;
  assignedPatientIds: string[];
  assignedLabIds: string[];
  assignedCountries: string[];
  assignedStates: string[];
  assignedDistricts: string[];
  permissions: DoctorPermissions;
  profileVisibility: DoctorProfileVisibility;
  patientAccess: PatientAccessControl;
  lastLogin: string;
  isOnline: boolean;
  rating: number;
  totalConsultations: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Legacy compatibility ───────────────────────────────────
export type FieldKey = "mobile" | "email" | "specialty" | "hospitalName" | "consultancyFee";

interface FieldVisibility {
  mobile: boolean;
  email: boolean;
  specialty: boolean;
  hospitalName: boolean;
  consultancyFee: boolean;
}

// ─── Default Permissions ────────────────────────────────────
const defaultPermissions: DoctorPermissions = {
  viewPatients: true,
  editPatients: true,
  createPrescription: true,
  editPrescription: true,
  assignLabTests: true,
  viewLabReports: true,
  downloadReports: true,
  generateMeetingLinks: true,
  videoConsultation: true,
  viewPayments: false,
  viewRevenue: false,
  manageSchedule: true,
  manageFollowUps: true,
  chatSystem: true,
  uploadMedicalDocuments: true,
};

const defaultProfileVisibility: DoctorProfileVisibility = {
  mobile: true,
  email: true,
  qualification: true,
  degree: true,
  specialty: true,
  experience: true,
  hospitalName: true,
  consultancyFee: true,
  address: true,
  certificates: true,
  reviewsRatings: true,
};

const defaultPatientAccess: PatientAccessControl = {
  type: "all",
  assignedPatientIds: [],
  allowedCountries: [],
  allowedHospitals: [],
  allowedDepartments: [],
};

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
    status: "active",
    password: "temp123",
    assignedPatientIds: ["PAT-1001", "PAT-1002"],
    assignedLabIds: ["LAB-1001"],
    assignedCountries: ["USA"],
    assignedStates: ["New York"],
    assignedDistricts: ["Manhattan"],
    permissions: { ...defaultPermissions },
    profileVisibility: { ...defaultProfileVisibility },
    patientAccess: { ...defaultPatientAccess },
    lastLogin: "2024-06-15T09:30:00Z",
    isOnline: true,
    rating: 4.9,
    totalConsultations: 342,
    totalRevenue: 171000,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-06-15T09:30:00Z",
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
    status: "active",
    password: "temp123",
    assignedPatientIds: ["PAT-1003"],
    assignedLabIds: ["LAB-1002"],
    assignedCountries: ["USA"],
    assignedStates: ["New York"],
    assignedDistricts: ["Brooklyn"],
    permissions: { ...defaultPermissions, viewPayments: true, viewRevenue: true },
    profileVisibility: { ...defaultProfileVisibility },
    patientAccess: { type: "hospitalWise", assignedPatientIds: [], allowedCountries: [], allowedHospitals: ["City Heart Center"], allowedDepartments: ["Neurology"] },
    lastLogin: "2024-06-14T14:20:00Z",
    isOnline: false,
    rating: 4.8,
    totalConsultations: 256,
    totalRevenue: 153600,
    createdAt: "2024-02-20T14:30:00Z",
    updatedAt: "2024-06-14T14:20:00Z",
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
    status: "suspended",
    password: "temp123",
    assignedPatientIds: [],
    assignedLabIds: [],
    assignedCountries: ["USA"],
    assignedStates: ["New York"],
    assignedDistricts: ["Queens"],
    permissions: { ...defaultPermissions, editPatients: false, manageSchedule: false },
    profileVisibility: { ...defaultProfileVisibility, mobile: false, email: false },
    patientAccess: { type: "assigned", assignedPatientIds: ["PAT-1004"], allowedCountries: [], allowedHospitals: [], allowedDepartments: [] },
    lastLogin: "2024-06-10T11:45:00Z",
    isOnline: false,
    rating: 4.7,
    totalConsultations: 189,
    totalRevenue: 75600,
    createdAt: "2024-03-10T09:15:00Z",
    updatedAt: "2024-06-10T11:45:00Z",
  },
];

// ─── Sample Audit Logs ──────────────────────────────────────
const sampleAuditLogs: AuditLogEntry[] = [
  { id: "LOG-001", doctorId: "DOC-1001", doctorName: "Dr. Sarah Johnson", action: "login", details: "Logged in successfully", date: "2024-06-15", time: "09:30:00", ipAddress: "192.168.1.101", device: "Chrome / Windows", location: "New York, USA" },
  { id: "LOG-002", doctorId: "DOC-1001", doctorName: "Dr. Sarah Johnson", action: "patientViewed", details: "Viewed patient John Doe (PAT-1001)", date: "2024-06-15", time: "09:35:00", ipAddress: "192.168.1.101", device: "Chrome / Windows", location: "New York, USA" },
  { id: "LOG-003", doctorId: "DOC-1001", doctorName: "Dr. Sarah Johnson", action: "prescriptionCreated", details: "Created prescription for PAT-1001", date: "2024-06-15", time: "09:45:00", ipAddress: "192.168.1.101", device: "Chrome / Windows", location: "New York, USA" },
  { id: "LOG-004", doctorId: "DOC-1002", doctorName: "Dr. Michael Chen", action: "login", details: "Logged in successfully", date: "2024-06-14", time: "14:20:00", ipAddress: "10.0.0.55", device: "Safari / macOS", location: "Brooklyn, USA" },
  { id: "LOG-005", doctorId: "DOC-1002", doctorName: "Dr. Michael Chen", action: "meetingCreated", details: "Video consultation meeting link generated", date: "2024-06-14", time: "14:35:00", ipAddress: "10.0.0.55", device: "Safari / macOS", location: "Brooklyn, USA" },
  { id: "LOG-006", doctorId: "DOC-1001", doctorName: "Dr. Sarah Johnson", action: "patientEdited", details: "Updated medical history for PAT-1002", date: "2024-06-14", time: "11:00:00", ipAddress: "192.168.1.101", device: "Chrome / Windows", location: "New York, USA" },
  { id: "LOG-007", doctorId: "DOC-1003", doctorName: "Dr. Emily Williams", action: "login", details: "Login attempt (account suspended)", date: "2024-06-13", time: "08:00:00", ipAddress: "172.16.0.10", device: "Firefox / Linux", location: "Queens, USA" },
  { id: "LOG-008", doctorId: "DOC-1001", doctorName: "Dr. Sarah Johnson", action: "reportViewed", details: "Viewed lab report for PAT-1001", date: "2024-06-13", time: "16:20:00", ipAddress: "192.168.1.101", device: "Chrome / Windows", location: "New York, USA" },
  { id: "LOG-009", doctorId: "DOC-1002", doctorName: "Dr. Michael Chen", action: "paymentViewed", details: "Viewed payment records", date: "2024-06-13", time: "10:10:00", ipAddress: "10.0.0.55", device: "Safari / macOS", location: "Brooklyn, USA" },
  { id: "LOG-010", doctorId: "DOC-1001", doctorName: "Dr. Sarah Johnson", action: "scheduleUpdated", details: "Updated weekly schedule", date: "2024-06-12", time: "17:00:00", ipAddress: "192.168.1.101", device: "Chrome / Windows", location: "New York, USA" },
  { id: "LOG-011", doctorId: "DOC-1002", doctorName: "Dr. Michael Chen", action: "logout", details: "Logged out", date: "2024-06-14", time: "18:00:00", ipAddress: "10.0.0.55", device: "Safari / macOS", location: "Brooklyn, USA" },
  { id: "LOG-012", doctorId: "DOC-1003", doctorName: "Dr. Emily Williams", action: "statusChanged", details: "Account suspended by Super Admin", date: "2024-06-10", time: "12:00:00", ipAddress: "192.168.1.1", device: "Chrome / Windows", location: "Admin Panel" },
];

// ─── Store Interface ────────────────────────────────────────
interface DoctorState {
  // Doctor list
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, "id" | "createdAt" | "updatedAt">) => void;
  deleteDoctor: (id: string) => void;
  editDoctor: (id: string, data: Partial<Doctor>) => void;

  // Status management
  setDoctorStatus: (id: string, status: DoctorStatus) => void;
  resetDoctorPassword: (id: string, newPassword: string) => void;

  // Permission management (per-doctor)
  setDoctorPermission: (id: string, key: PermissionKey, value: boolean) => void;
  setAllPermissions: (id: string, permissions: DoctorPermissions) => void;

  // Profile visibility management (per-doctor)
  setProfileVisibility: (id: string, key: ProfileFieldKey, value: boolean) => void;
  setAllProfileVisibility: (id: string, visibility: DoctorProfileVisibility) => void;

  // Patient access management (per-doctor)
  setPatientAccess: (id: string, access: PatientAccessControl) => void;

  // Audit logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, "id">) => void;

  // Legacy field visibility (Super Admin controlled - global)
  fieldVisibility: FieldVisibility;
  toggleFieldVisibility: (field: FieldKey) => void;
}

export const useDoctorStore = create<DoctorState>((set, get) => ({
  doctors: sampleDoctors,

  addDoctor: (data) => {
    const doctor: Doctor = {
      ...data,
      id: `DOC-${1000 + get().doctors.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ doctors: [...state.doctors, doctor] }));
  },

  deleteDoctor: (id) => {
    set((state) => ({ doctors: state.doctors.filter((d) => d.id !== id) }));
  },

  editDoctor: (id, data) => {
    set((state) => ({
      doctors: state.doctors.map((d) =>
        d.id === id ? { ...d, ...data, updatedAt: new Date().toISOString() } : d
      ),
    }));
  },

  // Status management
  setDoctorStatus: (id, status) => {
    set((state) => ({
      doctors: state.doctors.map((d) =>
        d.id === id ? { ...d, status, isOnline: status === "active" ? d.isOnline : false, updatedAt: new Date().toISOString() } : d
      ),
    }));
    // Add audit log for status change
    const doc = get().doctors.find((d) => d.id === id);
    if (doc) {
      get().addAuditLog({
        doctorId: id,
        doctorName: doc.name,
        action: "statusChanged",
        details: `Account status changed to ${status} by Super Admin`,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().split(" ")[0],
        ipAddress: "192.168.1.1",
        device: "Admin Panel",
        location: "Super Admin",
      });
    }
  },

  resetDoctorPassword: (id, newPassword) => {
    set((state) => ({
      doctors: state.doctors.map((d) =>
        d.id === id ? { ...d, password: newPassword, updatedAt: new Date().toISOString() } : d
      ),
    }));
  },

  // Permission management
  setDoctorPermission: (id, key, value) => {
    set((state) => ({
      doctors: state.doctors.map((d) =>
        d.id === id
          ? { ...d, permissions: { ...d.permissions, [key]: value }, updatedAt: new Date().toISOString() }
          : d
      ),
    }));
  },

  setAllPermissions: (id, permissions) => {
    set((state) => ({
      doctors: state.doctors.map((d) =>
        d.id === id ? { ...d, permissions, updatedAt: new Date().toISOString() } : d
      ),
    }));
  },

  // Profile visibility management
  setProfileVisibility: (id, key, value) => {
    set((state) => ({
      doctors: state.doctors.map((d) =>
        d.id === id
          ? { ...d, profileVisibility: { ...d.profileVisibility, [key]: value }, updatedAt: new Date().toISOString() }
          : d
      ),
    }));
  },

  setAllProfileVisibility: (id, visibility) => {
    set((state) => ({
      doctors: state.doctors.map((d) =>
        d.id === id ? { ...d, profileVisibility: visibility, updatedAt: new Date().toISOString() } : d
      ),
    }));
  },

  // Patient access management
  setPatientAccess: (id, access) => {
    set((state) => ({
      doctors: state.doctors.map((d) =>
        d.id === id ? { ...d, patientAccess: access, updatedAt: new Date().toISOString() } : d
      ),
    }));
  },

  // Audit logs
  auditLogs: sampleAuditLogs,

  addAuditLog: (entry) => {
    const log: AuditLogEntry = {
      ...entry,
      id: `LOG-${String(get().auditLogs.length + 1).padStart(3, "0")}`,
    };
    set((state) => ({ auditLogs: [log, ...state.auditLogs] }));
  },

  // Legacy field visibility - controlled by Super Admin (global)
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
