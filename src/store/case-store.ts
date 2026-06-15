import { create } from "zustand";
import { type CaseStatus, type Specialty } from "./specialty-store";
import { usePatientStore } from "./patient-store";

export interface CaseAnswer {
  questionId: string;
  question: string;
  answer: string;
}

export interface CaseSubmission {
  id: string;
  caseId: string;
  patientId: string;
  specialtyId: string | null;
  specialtyName: string;
  doctorId: string;
  doctorName: string;
  status: CaseStatus;
  appointmentDate: string;
  appointmentTime: string;
  paymentStatus: "pending" | "paid" | "failed";
  notes: string;
  answers: CaseAnswer[];
  reportIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface CaseState {
  submissions: CaseSubmission[];
  createSubmission: (data: {
    patientId: string;
    specialtyId: string | null;
    specialtyName: string;
    answers: CaseAnswer[];
    reportIds: string[];
    appointmentDate?: string;
    appointmentTime?: string;
  }) => CaseSubmission;
  updateSubmission: (caseId: string, data: Partial<CaseSubmission>) => void;
  updateStatus: (caseId: string, status: CaseStatus) => void;
  getPatientCases: (patientId: string) => CaseSubmission[];
}

const sampleCases: CaseSubmission[] = [
  {
    id: "CASE-1",
    caseId: "CASE-1001",
    patientId: "PAT-1001",
    specialtyId: "SP-5",
    specialtyName: "Cardiology",
    doctorId: "DOC-1001",
    doctorName: "Dr. Sarah Johnson",
    status: "under_review",
    appointmentDate: "2026-06-20",
    appointmentTime: "10:00",
    paymentStatus: "paid",
    notes: "Patient reports chest pain during exercise",
    answers: [
      { questionId: "SQ-13", question: "Do you have chest pain or discomfort?", answer: "Yes" },
      { questionId: "SQ-14", question: "Do you have high blood pressure?", answer: "Yes" },
    ],
    reportIds: ["RPT-2001"],
    createdAt: "2026-06-10T10:00:00Z",
    updatedAt: "2026-06-11T10:00:00Z",
  },
];

export const useCaseStore = create<CaseState>((set, get) => ({
  submissions: sampleCases,

  createSubmission: (data) => {
    const submission: CaseSubmission = {
      id: `CASE-${Date.now()}`,
      caseId: `CASE-${1000 + get().submissions.length + 1}`,
      patientId: data.patientId,
      specialtyId: data.specialtyId,
      specialtyName: data.specialtyName,
      doctorId: "",
      doctorName: "",
      status: "submitted" as CaseStatus,
      appointmentDate: data.appointmentDate || "",
      appointmentTime: data.appointmentTime || "",
      paymentStatus: "pending",
      notes: "",
      answers: data.answers,
      reportIds: data.reportIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ submissions: [submission, ...state.submissions] }));
    return submission;
  },

  updateSubmission: (caseId, data) => {
    set((state) => ({
      submissions: state.submissions.map((c) =>
        c.id === caseId ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
      ),
    }));
  },

  updateStatus: (caseId, status) => {
    set((state) => ({
      submissions: state.submissions.map((c) =>
        c.id === caseId ? { ...c, status, updatedAt: new Date().toISOString() } : c
      ),
    }));
  },

  getPatientCases: (patientId) => {
    return get().submissions.filter((c) => c.patientId === patientId);
  },
}));
