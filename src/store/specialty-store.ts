import { create } from "zustand";

export interface SpecialtyQuestion {
  id: string;
  specialtyId: string;
  question: string;
  questionType: "yes_no" | "text";
  sortOrder: number;
  isActive: boolean;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  questions: SpecialtyQuestion[];
}

export const caseStatuses = [
  "submitted",
  "payment_completed",
  "doctor_assigned",
  "under_review",
  "additional_info_required",
  "consultation_scheduled",
  "prescription_generated",
  "completed",
] as const;

export type CaseStatus = (typeof caseStatuses)[number];

export const caseStatusLabels: Record<CaseStatus, string> = {
  submitted: "Submitted",
  payment_completed: "Payment Completed",
  doctor_assigned: "Doctor Assigned",
  under_review: "Under Review",
  additional_info_required: "Additional Information Required",
  consultation_scheduled: "Consultation Scheduled",
  prescription_generated: "Prescription Generated",
  completed: "Completed",
};

const sampleSpecialties: Specialty[] = [
  {
    id: "SP-1",
    name: "LFT",
    description: "Liver Function Test",
    icon: "🫁",
    isActive: true,
    questions: [
      { id: "SQ-1", specialtyId: "SP-1", question: "Do you have a history of jaundice?", questionType: "yes_no", sortOrder: 1, isActive: true },
      { id: "SQ-2", specialtyId: "SP-1", question: "Do you consume alcohol regularly?", questionType: "yes_no", sortOrder: 2, isActive: true },
      { id: "SQ-3", specialtyId: "SP-1", question: "Have you experienced abdominal pain?", questionType: "yes_no", sortOrder: 3, isActive: true },
    ],
  },
  {
    id: "SP-2",
    name: "KFT",
    description: "Kidney Function Test",
    icon: "🫘",
    isActive: true,
    questions: [
      { id: "SQ-4", specialtyId: "SP-2", question: "Do you have frequent urination?", questionType: "yes_no", sortOrder: 1, isActive: true },
      { id: "SQ-5", specialtyId: "SP-2", question: "Have you noticed swelling in your feet or ankles?", questionType: "yes_no", sortOrder: 2, isActive: true },
      { id: "SQ-6", specialtyId: "SP-2", question: "Do you have a history of kidney stones?", questionType: "yes_no", sortOrder: 3, isActive: true },
    ],
  },
  {
    id: "SP-3",
    name: "Diabetes",
    description: "Diabetes Screening & Management",
    icon: "💉",
    isActive: true,
    questions: [
      { id: "SQ-7", specialtyId: "SP-3", question: "Do you have a family history of diabetes?", questionType: "yes_no", sortOrder: 1, isActive: true },
      { id: "SQ-8", specialtyId: "SP-3", question: "Do you experience excessive thirst?", questionType: "yes_no", sortOrder: 2, isActive: true },
      { id: "SQ-9", specialtyId: "SP-3", question: "Have you noticed unexplained weight loss?", questionType: "yes_no", sortOrder: 3, isActive: true },
    ],
  },
  {
    id: "SP-4",
    name: "Thyroid",
    description: "Thyroid Function Assessment",
    icon: "🔬",
    isActive: true,
    questions: [
      { id: "SQ-10", specialtyId: "SP-4", question: "Do you feel fatigued most of the time?", questionType: "yes_no", sortOrder: 1, isActive: true },
      { id: "SQ-11", specialtyId: "SP-4", question: "Have you noticed changes in your weight?", questionType: "yes_no", sortOrder: 2, isActive: true },
      { id: "SQ-12", specialtyId: "SP-4", question: "Do you experience sensitivity to cold or heat?", questionType: "yes_no", sortOrder: 3, isActive: true },
    ],
  },
  {
    id: "SP-5",
    name: "Cardiology",
    description: "Heart & Cardiovascular Health",
    icon: "❤️",
    isActive: true,
    questions: [
      { id: "SQ-13", specialtyId: "SP-5", question: "Do you have chest pain or discomfort?", questionType: "yes_no", sortOrder: 1, isActive: true },
      { id: "SQ-14", specialtyId: "SP-5", question: "Do you have high blood pressure?", questionType: "yes_no", sortOrder: 2, isActive: true },
      { id: "SQ-15", specialtyId: "SP-5", question: "Do you experience shortness of breath?", questionType: "yes_no", sortOrder: 3, isActive: true },
      { id: "SQ-16", specialtyId: "SP-5", question: "Do you have a history of heart disease in your family?", questionType: "yes_no", sortOrder: 4, isActive: true },
    ],
  },
];

interface SpecialtyState {
  specialties: Specialty[];
  addSpecialty: (specialty: Omit<Specialty, "id" | "questions">) => void;
  updateSpecialty: (id: string, data: Partial<Specialty>) => void;
  deleteSpecialty: (id: string) => void;
  addQuestion: (specialtyId: string, question: Omit<SpecialtyQuestion, "id" | "specialtyId">) => void;
  updateQuestion: (specialtyId: string, questionId: string, data: Partial<SpecialtyQuestion>) => void;
  deleteQuestion: (specialtyId: string, questionId: string) => void;
}

export const useSpecialtyStore = create<SpecialtyState>((set) => ({
  specialties: sampleSpecialties,

  addSpecialty: (data) => {
    const specialty: Specialty = {
      ...data,
      id: `SP-${Date.now()}`,
      questions: [],
    };
    set((state) => ({ specialties: [...state.specialties, specialty] }));
  },

  updateSpecialty: (id, data) => {
    set((state) => ({
      specialties: state.specialties.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    }));
  },

  deleteSpecialty: (id) => {
    set((state) => ({ specialties: state.specialties.filter((s) => s.id !== id) }));
  },

  addQuestion: (specialtyId, questionData) => {
    const question: SpecialtyQuestion = {
      ...questionData,
      id: `SQ-${Date.now()}`,
      specialtyId,
    };
    set((state) => ({
      specialties: state.specialties.map((s) =>
        s.id === specialtyId
          ? { ...s, questions: [...s.questions, question] }
          : s
      ),
    }));
  },

  updateQuestion: (specialtyId, questionId, data) => {
    set((state) => ({
      specialties: state.specialties.map((s) =>
        s.id === specialtyId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId ? { ...q, ...data } : q
              ),
            }
          : s
      ),
    }));
  },

  deleteQuestion: (specialtyId, questionId) => {
    set((state) => ({
      specialties: state.specialties.map((s) =>
        s.id === specialtyId
          ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) }
          : s
      ),
    }));
  },
}));
