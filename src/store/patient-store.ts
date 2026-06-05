import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────
export interface PatientReport {
  id: string;
  patientId: string;
  fileName: string;
  fileType: "blood_test" | "xray" | "mri" | "ct_scan" | "ecg" | "ultrasound" | "prescription" | "medical_doc" | "insurance" | "other";
  fileFormat: "pdf" | "jpg" | "jpeg" | "png" | "docx";
  fileSize: number; // in KB
  fileUrl: string; // simulated URL
  uploadedAt: string;
  doctorRemarks: string;
  attachedToPrescription: boolean;
  sharedWithDoctor: boolean;
}

export interface Patient {
  id: string;
  // Basic Information
  fullName: string;
  mobileNumber: string;
  email: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  bloodGroup: string;
  // Address Information
  address: string;
  country: string;
  state: string;
  district: string;
  city: string;
  pinCode: string;
  latitude: string;
  longitude: string;
  // Medical Information
  diseaseDetails: string;
  symptoms: string;
  complaint: string;
  medicalHistory: string;
  allergies: string;
  currentMedications: string;
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyRelationship: string;
  // Reports
  reports: PatientReport[];
  // Meta
  isActive: boolean;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientBooking {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  paymentMethod: "card" | "upi" | "netbanking" | "cod";
  paymentStatus: "paid" | "pending" | "failed";
  bookingStatus: "registered" | "reports_uploaded" | "payment_done" | "appointment_booked" | "meeting_link_generated" | "doctor_reviewing" | "in_consultation" | "prescription_generated" | "follow_up" | "completed" | "cancelled";
  meetingLink: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface PatientState {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "reports" | "isActive" | "registrationDate" | "createdAt" | "updatedAt">) => void;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  togglePatientStatus: (id: string) => void;

  // Reports
  addReport: (patientId: string, report: Omit<PatientReport, "id" | "patientId" | "uploadedAt" | "doctorRemarks" | "attachedToPrescription" | "sharedWithDoctor">) => void;
  deleteReport: (patientId: string, reportId: string) => void;
  addDoctorRemarks: (patientId: string, reportId: string, remarks: string) => void;
  toggleShareWithDoctor: (patientId: string, reportId: string) => void;
  toggleAttachToPrescription: (patientId: string, reportId: string) => void;

  // Bookings
  bookings: PatientBooking[];
  addBooking: (booking: Omit<PatientBooking, "id" | "createdAt" | "updatedAt">) => PatientBooking;
  updateBookingStatus: (id: string, status: PatientBooking["bookingStatus"]) => void;
  updatePaymentStatus: (id: string, status: PatientBooking["paymentStatus"]) => void;

  // Portal UI
  isPortalOpen: boolean;
  openPortal: () => void;
  closePortal: () => void;

  // Upload config
  maxFileSize: number; // in MB
  setMaxFileSize: (size: number) => void;
}

// ─── Sample Data ─────────────────────────────────────────────
const samplePatients: Patient[] = [
  {
    id: "PAT-1001",
    fullName: "John Doe",
    mobileNumber: "+1 (555) 101-2001",
    email: "john.doe@email.com",
    gender: "male",
    dateOfBirth: "1985-03-15",
    bloodGroup: "O+",
    address: "123 Main Street, Apt 4B",
    country: "United States",
    state: "New York",
    district: "Manhattan",
    city: "New York City",
    pinCode: "10001",
    latitude: "40.7128",
    longitude: "-74.0060",
    diseaseDetails: "Chronic migraine with aura",
    symptoms: "Severe headache, nausea, sensitivity to light",
    complaint: "Recurring migraines 3-4 times per week for the last 6 months",
    medicalHistory: "Hypertension (2019), Seasonal allergies",
    allergies: "Penicillin, Sulfa drugs",
    currentMedications: "Amlodipine 5mg daily, Sumatriptan as needed",
    emergencyContactName: "Jane Doe",
    emergencyContactNumber: "+1 (555) 101-2002",
    emergencyRelationship: "Spouse",
    reports: [
      {
        id: "RPT-2001",
        patientId: "PAT-1001",
        fileName: "Blood_Test_Report_Jan2024.pdf",
        fileType: "blood_test",
        fileFormat: "pdf",
        fileSize: 450,
        fileUrl: "/reports/blood_test_jan_2024.pdf",
        uploadedAt: "2024-01-15T10:30:00Z",
        doctorRemarks: "All values within normal range. Cholesterol slightly elevated.",
        attachedToPrescription: true,
        sharedWithDoctor: true,
      },
      {
        id: "RPT-2002",
        patientId: "PAT-1001",
        fileName: "MRI_Head_Scan.pdf",
        fileType: "mri",
        fileFormat: "pdf",
        fileSize: 2800,
        fileUrl: "/reports/mri_head_scan.pdf",
        uploadedAt: "2024-02-20T14:00:00Z",
        doctorRemarks: "",
        attachedToPrescription: false,
        sharedWithDoctor: true,
      },
    ],
    isActive: true,
    registrationDate: "2024-01-10T09:00:00Z",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-02-20T14:00:00Z",
  },
  {
    id: "PAT-1002",
    fullName: "Emily Johnson",
    mobileNumber: "+1 (555) 303-4003",
    email: "emily.j@email.com",
    gender: "female",
    dateOfBirth: "1992-07-22",
    bloodGroup: "A-",
    address: "456 Oak Avenue",
    country: "United States",
    state: "California",
    district: "Santa Clara",
    city: "San Jose",
    pinCode: "95101",
    latitude: "37.3382",
    longitude: "-121.8863",
    diseaseDetails: "Type 2 Diabetes Mellitus",
    symptoms: "Increased thirst, frequent urination, fatigue",
    complaint: "Difficulty managing blood sugar levels despite medication",
    medicalHistory: "Gestational diabetes (2020), PCOS (2018)",
    allergies: "Latex, Shellfish",
    currentMedications: "Metformin 500mg twice daily",
    emergencyContactName: "Robert Johnson",
    emergencyContactNumber: "+1 (555) 303-4004",
    emergencyRelationship: "Father",
    reports: [
      {
        id: "RPT-2003",
        patientId: "PAT-1002",
        fileName: "Blood_Sugar_Report.pdf",
        fileType: "blood_test",
        fileFormat: "pdf",
        fileSize: 380,
        fileUrl: "/reports/blood_sugar_report.pdf",
        uploadedAt: "2024-03-01T11:00:00Z",
        doctorRemarks: "HbA1c at 7.2%, need to adjust medication dosage.",
        attachedToPrescription: true,
        sharedWithDoctor: true,
      },
    ],
    isActive: true,
    registrationDate: "2024-02-05T10:30:00Z",
    createdAt: "2024-02-05T10:30:00Z",
    updatedAt: "2024-03-01T11:00:00Z",
  },
  {
    id: "PAT-1003",
    fullName: "Michael Smith",
    mobileNumber: "+1 (555) 202-3002",
    email: "michael.s@email.com",
    gender: "male",
    dateOfBirth: "1978-11-08",
    bloodGroup: "B+",
    address: "789 Pine Street",
    country: "United States",
    state: "Texas",
    district: "Harris",
    city: "Houston",
    pinCode: "77001",
    latitude: "29.7604",
    longitude: "-95.3698",
    diseaseDetails: "Lower back pain - Lumbar disc herniation",
    symptoms: "Chronic lower back pain, numbness in left leg",
    complaint: "Severe back pain for 3 months, difficulty walking",
    medicalHistory: "Sports injury (2015), Sciatica (2020)",
    allergies: "Aspirin",
    currentMedications: "Ibuprofen 400mg as needed, Muscle relaxants",
    emergencyContactName: "Sarah Smith",
    emergencyContactNumber: "+1 (555) 202-3003",
    emergencyRelationship: "Spouse",
    reports: [
      {
        id: "RPT-2004",
        patientId: "PAT-1003",
        fileName: "XRay_Lumbar_Spine.png",
        fileType: "xray",
        fileFormat: "png",
        fileSize: 1500,
        fileUrl: "/reports/xray_lumbar_spine.png",
        uploadedAt: "2024-04-10T09:30:00Z",
        doctorRemarks: "L4-L5 disc herniation confirmed. Recommend physical therapy.",
        attachedToPrescription: true,
        sharedWithDoctor: true,
      },
      {
        id: "RPT-2005",
        patientId: "PAT-1003",
        fileName: "CT_Scan_Lower_Back.pdf",
        fileType: "ct_scan",
        fileFormat: "pdf",
        fileSize: 3200,
        fileUrl: "/reports/ct_scan_lower_back.pdf",
        uploadedAt: "2024-04-12T16:00:00Z",
        doctorRemarks: "",
        attachedToPrescription: false,
        sharedWithDoctor: false,
      },
    ],
    isActive: true,
    registrationDate: "2024-03-15T08:45:00Z",
    createdAt: "2024-03-15T08:45:00Z",
    updatedAt: "2024-04-12T16:00:00Z",
  },
  {
    id: "PAT-1004",
    fullName: "Sarah Williams",
    mobileNumber: "+1 (555) 404-5004",
    email: "sarah.w@email.com",
    gender: "female",
    dateOfBirth: "1995-05-30",
    bloodGroup: "AB+",
    address: "321 Elm Drive, Suite 12",
    country: "United States",
    state: "Illinois",
    district: "Cook",
    city: "Chicago",
    pinCode: "60601",
    latitude: "41.8781",
    longitude: "-87.6298",
    diseaseDetails: "General health checkup",
    symptoms: "Occasional fatigue, mild joint pain",
    complaint: "Routine annual health checkup and wellness evaluation",
    medicalHistory: "No significant medical history",
    allergies: "None known",
    currentMedications: "Multivitamin, Vitamin D3 1000IU",
    emergencyContactName: "David Williams",
    emergencyContactNumber: "+1 (555) 404-5005",
    emergencyRelationship: "Brother",
    reports: [],
    isActive: true,
    registrationDate: "2024-04-20T13:00:00Z",
    createdAt: "2024-04-20T13:00:00Z",
    updatedAt: "2024-04-20T13:00:00Z",
  },
  {
    id: "PAT-1005",
    fullName: "Robert Chen",
    mobileNumber: "+1 (555) 505-6005",
    email: "robert.c@email.com",
    gender: "male",
    dateOfBirth: "1988-09-12",
    bloodGroup: "O-",
    address: "567 Maple Court",
    country: "United States",
    state: "Washington",
    district: "King",
    city: "Seattle",
    pinCode: "98101",
    latitude: "47.6062",
    longitude: "-122.3321",
    diseaseDetails: "Seasonal allergic rhinitis and mild asthma",
    symptoms: "Sneezing, runny nose, wheezing during exercise",
    complaint: "Allergies worsen in spring, occasional breathing difficulty",
    medicalHistory: "Childhood asthma, Eczema",
    allergies: "Pollen, Dust mites, Peanuts",
    currentMedications: "Cetirizine 10mg daily, Albuterol inhaler PRN",
    emergencyContactName: "Linda Chen",
    emergencyContactNumber: "+1 (555) 505-6006",
    emergencyRelationship: "Mother",
    reports: [
      {
        id: "RPT-2006",
        patientId: "PAT-1005",
        fileName: "Allergy_Test_Results.pdf",
        fileType: "blood_test",
        fileFormat: "pdf",
        fileSize: 520,
        fileUrl: "/reports/allergy_test_results.pdf",
        uploadedAt: "2024-05-01T10:00:00Z",
        doctorRemarks: "High sensitivity to birch pollen and dust mites. Continue current medication.",
        attachedToPrescription: true,
        sharedWithDoctor: true,
      },
    ],
    isActive: false,
    registrationDate: "2024-04-25T15:30:00Z",
    createdAt: "2024-04-25T15:30:00Z",
    updatedAt: "2024-05-01T10:00:00Z",
  },
];

const sampleBookings: PatientBooking[] = [
  {
    id: "PBK-3001",
    patientId: "PAT-1001",
    patientName: "John Doe",
    patientEmail: "john.doe@email.com",
    patientPhone: "+1 (555) 101-2001",
    packageId: "PKG-1001",
    packageName: "Complete Health Checkup",
    packagePrice: 199.99,
    paymentMethod: "card",
    paymentStatus: "paid",
    bookingStatus: "appointment_booked",
    meetingLink: "https://meet.globalintegrativeclinic.com/consult/PAT-1001-001",
    doctorId: "DOC-1001",
    doctorName: "Dr. Sarah Wilson",
    appointmentDate: "2024-06-15T10:00:00Z",
    notes: "Patient has chronic migraine. Please review MRI report before consultation.",
    createdAt: "2024-05-20T10:00:00Z",
    updatedAt: "2024-05-22T09:00:00Z",
  },
  {
    id: "PBK-3002",
    patientId: "PAT-1002",
    patientName: "Emily Johnson",
    patientEmail: "emily.j@email.com",
    patientPhone: "+1 (555) 303-4003",
    packageId: "PKG-1002",
    packageName: "Diabetes Care Package",
    packagePrice: 299.99,
    paymentMethod: "upi",
    paymentStatus: "paid",
    bookingStatus: "doctor_reviewing",
    meetingLink: "https://meet.globalintegrativeclinic.com/consult/PAT-1002-001",
    doctorId: "DOC-1002",
    doctorName: "Dr. Robert Brown",
    appointmentDate: "2024-06-10T14:00:00Z",
    notes: "Need medication adjustment. HbA1c elevated.",
    createdAt: "2024-05-18T14:30:00Z",
    updatedAt: "2024-05-25T11:00:00Z",
  },
  {
    id: "PBK-3003",
    patientId: "PAT-1003",
    patientName: "Michael Smith",
    patientEmail: "michael.s@email.com",
    patientPhone: "+1 (555) 202-3002",
    packageId: "PKG-1003",
    packageName: "Orthopedic Consultation",
    packagePrice: 149.99,
    paymentMethod: "netbanking",
    paymentStatus: "pending",
    bookingStatus: "reports_uploaded",
    meetingLink: "",
    doctorId: "",
    doctorName: "",
    appointmentDate: "",
    notes: "Awaiting doctor assignment.",
    createdAt: "2024-05-25T08:15:00Z",
    updatedAt: "2024-05-25T08:15:00Z",
  },
];

// ─── Store ───────────────────────────────────────────────────
export const usePatientStore = create<PatientState>((set, get) => ({
  patients: samplePatients,

  addPatient: (data) => {
    const patient: Patient = {
      ...data,
      id: `PAT-${1000 + get().patients.length + 1}`,
      reports: [],
      isActive: true,
      registrationDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ patients: [...state.patients, patient] }));
  },

  updatePatient: (id, data) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },

  deletePatient: (id) => {
    set((state) => ({ patients: state.patients.filter((p) => p.id !== id) }));
  },

  togglePatientStatus: (id) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, isActive: !p.isActive, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },

  // ─── Reports ────────────────────────────────────────────
  addReport: (patientId, reportData) => {
    const report: PatientReport = {
      ...reportData,
      id: `RPT-${2000 + Math.floor(Math.random() * 9000)}`,
      patientId,
      uploadedAt: new Date().toISOString(),
      doctorRemarks: "",
      attachedToPrescription: false,
      sharedWithDoctor: false,
    };
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === patientId
          ? { ...p, reports: [...p.reports, report], updatedAt: new Date().toISOString() }
          : p
      ),
    }));
  },

  deleteReport: (patientId, reportId) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === patientId
          ? { ...p, reports: p.reports.filter((r) => r.id !== reportId), updatedAt: new Date().toISOString() }
          : p
      ),
    }));
  },

  addDoctorRemarks: (patientId, reportId, remarks) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === patientId
          ? {
              ...p,
              reports: p.reports.map((r) =>
                r.id === reportId ? { ...r, doctorRemarks: remarks } : r
              ),
              updatedAt: new Date().toISOString(),
            }
          : p
      ),
    }));
  },

  toggleShareWithDoctor: (patientId, reportId) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === patientId
          ? {
              ...p,
              reports: p.reports.map((r) =>
                r.id === reportId ? { ...r, sharedWithDoctor: !r.sharedWithDoctor } : r
              ),
              updatedAt: new Date().toISOString(),
            }
          : p
      ),
    }));
  },

  toggleAttachToPrescription: (patientId, reportId) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === patientId
          ? {
              ...p,
              reports: p.reports.map((r) =>
                r.id === reportId ? { ...r, attachedToPrescription: !r.attachedToPrescription } : r
              ),
              updatedAt: new Date().toISOString(),
            }
          : p
      ),
    }));
  },

  // ─── Bookings ───────────────────────────────────────────
  bookings: sampleBookings,

  addBooking: (bookingData) => {
    const booking: PatientBooking = {
      ...bookingData,
      id: `PBK-${3000 + get().bookings.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ bookings: [booking, ...state.bookings] }));
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

  // ─── Portal UI ─────────────────────────────────────────
  isPortalOpen: false,
  openPortal: () => set({ isPortalOpen: true }),
  closePortal: () => set({ isPortalOpen: false }),

  // ─── Upload Config ─────────────────────────────────────
  maxFileSize: 10, // 10 MB default
  setMaxFileSize: (size) => set({ maxFileSize: size }),
}));
