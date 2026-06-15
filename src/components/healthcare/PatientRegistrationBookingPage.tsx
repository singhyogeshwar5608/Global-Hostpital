"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAppointmentStore,
  specialties,
  specialtyQuestions,
  doctors,
  formatTime,
} from "@/store/appointment-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePatientStore } from "@/store/patient-store";
import { useSpecialtyStore } from "@/store/specialty-store";
import { useAuthStore } from "@/store/auth-store";
import {
  Stethoscope,
  UserRound,
  CalendarDays,
  Clock,
  CreditCard,
  CheckCircle2,
  Star,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Video,
  FileText,
  FlaskConical,
  CalendarPlus,
  Lock,
  Sun,
  Moon,
  SunMedium,
  PlusCircle,
  Trash2,
  CloudUpload,
  Phone,
  Mail,
  HeartPulse,
  ClipboardList,
  ChevronDown,
  Smartphone,
  ScanLine,
  Brain,
  Bone,
  Pill,
  Wind,
  Activity,
  Droplets,
  TestTube2,
  Sparkles,
  Award,
  LayoutDashboard,
  Users,
  BadgeCheck,
} from "lucide-react";

const stepConfig: { key: string; label: string; icon: React.ElementType }[] = [
  { key: "option", label: "Choose Option", icon: ClipboardList },
  { key: "details", label: "Personal Info", icon: UserRound },
  { key: "medical", label: "Medical Details", icon: Stethoscope },
  { key: "questionnaire", label: "Questionnaire", icon: ClipboardList },
  { key: "reports", label: "Upload Reports", icon: CloudUpload },
  { key: "schedule", label: "Appointment", icon: CalendarDays },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "confirmation", label: "Confirmed", icon: CheckCircle2 },
];

const registrationSteps = stepConfig.slice(0, 7);

type TimePeriod = "morning" | "afternoon" | "evening";

function getTimePeriod(time24: string): TimePeriod {
  const h = parseInt(time24.split(":")[0], 10);
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

const periodConfig: Record<TimePeriod, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  morning: { label: "Morning", icon: Sun, color: "text-amber-500", bgColor: "bg-amber-50" },
  afternoon: { label: "Afternoon", icon: SunMedium, color: "text-orange-500", bgColor: "bg-orange-50" },
  evening: { label: "Evening", icon: Moon, color: "text-indigo-500", bgColor: "bg-indigo-50" },
};

const specialtyIcons: Record<string, React.ElementType> = {
  LFT: FlaskConical,
  KFT: Droplets,
  Diabetes: TestTube2,
  Thyroid: Activity,
  Cardiology: HeartPulse,
  Gastroenterology: Pill,
  Orthopedic: Bone,
  Neurology: Brain,
  Oncology: ScanLine,
  Pulmonology: Wind,
  "General Consultation": Stethoscope,
  Other: PlusCircle,
};

const specialtyDescriptions: Record<string, string> = {
  LFT: "Liver Function Test",
  KFT: "Kidney Function Test",
  Diabetes: "Diabetes Management",
  Thyroid: "Thyroid Evaluation",
  Cardiology: "Heart & Cardiovascular",
  Gastroenterology: "Digestive System",
  Orthopedic: "Bones & Joints",
  Neurology: "Brain & Nervous System",
  Oncology: "Cancer Care",
  Pulmonology: "Lungs & Respiratory",
  "General Consultation": "General Health Checkup",
  Other: "Other Specialty",
};

const specialtyColors: Record<string, { bg: string; icon: string; border: string }> = {
  LFT: { bg: "bg-red-50", icon: "text-red-500", border: "border-red-200" },
  KFT: { bg: "bg-rose-50", icon: "text-rose-500", border: "border-rose-200" },
  Diabetes: { bg: "bg-blue-50", icon: "text-blue-500", border: "border-blue-200" },
  Thyroid: { bg: "bg-purple-50", icon: "text-purple-500", border: "border-purple-200" },
  Cardiology: { bg: "bg-red-50", icon: "text-red-500", border: "border-red-200" },
  Gastroenterology: { bg: "bg-amber-50", icon: "text-amber-500", border: "border-amber-200" },
  Orthopedic: { bg: "bg-blue-50", icon: "text-blue-500", border: "border-blue-200" },
  Neurology: { bg: "bg-indigo-50", icon: "text-indigo-500", border: "border-indigo-200" },
  Oncology: { bg: "bg-rose-50", icon: "text-rose-500", border: "border-rose-200" },
  Pulmonology: { bg: "bg-sky-50", icon: "text-sky-500", border: "border-sky-200" },
  "General Consultation": { bg: "bg-emerald-50", icon: "text-emerald-500", border: "border-emerald-200" },
  Other: { bg: "bg-gray-50", icon: "text-gray-500", border: "border-gray-200" },
};

const defaultTimeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

interface PatientRegistrationBookingPageProps {
  onBackToHome: () => void;
}

export default function PatientRegistrationBookingPage({ onBackToHome }: PatientRegistrationBookingPageProps) {
  const { currentStep, reset } = useAppointmentStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentIndex = registrationSteps.findIndex((s) => s.key === currentStep);
  const isConfirmation = currentStep === "confirmation";

  const handleBackToHome = () => {
    const { generatedPatientId } = useAppointmentStore.getState();
    const patientId = generatedPatientId;
    reset();
    if (patientId) {
      const patient = usePatientStore.getState().patients.find((p) => p.id === patientId);
      if (patient) {
        useAuthStore.getState().loginWithPatientId(patientId, patient.fullName, patient.email);
        usePatientStore.getState().openPortal();
      }
    }
    onBackToHome();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Back to Home */}
      <div className="bg-emerald-950 border-b border-emerald-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-1.5">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-1 text-xs text-emerald-300 hover:text-emerald-100 transition-colors"
            >
              <ArrowLeft size={12} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
      {/* Announcement Bar */}
      <div className="bg-emerald-950/90 border-b border-emerald-800/30 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2.5 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 text-emerald-200">
              <Clock size={13} className="text-emerald-400 shrink-0" />
              OPD: Mon-Sat, 9:00 AM - 6:00 PM
            </span>
            <span className="hidden sm:inline text-emerald-700/50">|</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-200">
              <Phone size={13} className="text-emerald-400 shrink-0" />
              Emergency: +91 9876543210
            </span>
            <span className="hidden sm:inline text-emerald-700/50">|</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-200">
              <Award size={13} className="text-emerald-400 shrink-0" />
              Registration is free! No hidden charges.
            </span>
          </div>
        </div>
      </div>

      {/* Step Progress */}
      {!isConfirmation && (
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 py-4 overflow-x-auto scrollbar-none">
              {registrationSteps.map((step, i) => (
                <React.Fragment key={step.key}>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div
                      className={cn(
                        "relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs font-bold transition-all duration-300",
                        i < currentIndex
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                          : i === currentIndex
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 ring-4 ring-emerald-100"
                          : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                      )}
                    >
                      {i < currentIndex ? (
                        <CheckCircle2 size={16} className="text-white" />
                      ) : (
                        <step.icon size={14} />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-semibold hidden sm:block transition-colors",
                        i <= currentIndex ? "text-emerald-700" : "text-gray-400"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < registrationSteps.length - 1 && (
                    <div className="flex items-center mx-1 sm:mx-2">
                      <div
                        className={cn(
                          "w-8 sm:w-12 h-1 rounded-full transition-all duration-300",
                          i < currentIndex ? "bg-emerald-500" : "bg-gray-200"
                        )}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {currentStep === "option" && <StepChooseOption />}
            {currentStep === "details" && <StepPersonalInfo />}
            {currentStep === "medical" && <StepMedicalDetails />}
            {currentStep === "questionnaire" && <StepQuestionnaire />}
            {currentStep === "reports" && <StepReportsRedesigned />}
            {currentStep === "schedule" && <StepScheduleRedesigned />}
            {currentStep === "payment" && <StepPaymentRedesigned />}
            {currentStep === "confirmation" && (
              <StepConfirmation onBackToHome={handleBackToHome} />
            )}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 xl:w-96 border-l border-gray-100 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="sticky top-[73px] overflow-y-auto max-h-[calc(100vh-73px)]">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <ClipboardList size={16} className="text-emerald-700" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">Booking Summary</h3>
              </div>
              <RegistrationSidebar />
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <ClipboardList size={16} className="text-emerald-700" />
                  </div>
                  <span className="text-sm font-bold text-gray-800">Booking Summary</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-5">
                <RegistrationSidebar />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RegistrationSidebar() {
  const {
    registrationOption,
    selectedSpecialty,
    uploadedReports,
    selectedDoctor,
    selectedDate,
    selectedTime,
  } = useAppointmentStore();

  const fee = selectedDoctor?.fee || 0;
  const platformFee = 10;
  const total = fee + platformFee;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <SummaryRow
          label="Registration Type"
          value={
            registrationOption === "consult"
              ? "Consult Doctor"
              : registrationOption === "submit"
              ? "Submit Without Doctor"
              : undefined
          }
          icon={UserRound}
        />
        <SummaryRow
          label="Specialty"
          value={selectedSpecialty || undefined}
          icon={Stethoscope}
        />
        <SummaryRow
          label="Reports"
          value={
            uploadedReports.length > 0
              ? `${uploadedReports.length} File${uploadedReports.length !== 1 ? "s" : ""}`
              : "0 Files"
          }
          icon={FileText}
        />
        <SummaryRow
          label="Appointment"
          value={
            selectedDate && selectedTime
              ? `${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${formatTime(selectedTime)}`
              : undefined
          }
          icon={CalendarDays}
        />
        <SummaryRow
          label="Consultation Fee"
          value={`₹${fee}`}
          icon={CreditCard}
        />
      </div>

      {selectedDoctor && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/60">
          <div className="flex items-center gap-3">
            <img
              src={selectedDoctor.image}
              alt={selectedDoctor.name}
              className="w-12 h-12 rounded-xl bg-white border border-emerald-100"
            />
            <div className="min-w-0">
              <div className="text-sm font-bold text-gray-900 truncate">{selectedDoctor.name}</div>
              <div className="text-xs text-emerald-700 font-medium">{selectedDoctor.specialty}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-gray-600">{selectedDoctor.rating}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-emerald-50/50 border border-emerald-100/50 p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-800">Secure & Encrypted</div>
            <p className="text-[11px] text-emerald-700/70 leading-relaxed mt-0.5">
              Your health information is protected with enterprise-grade encryption.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
        <div className="text-xs font-bold text-gray-900 mb-3">Need Assistance?</div>
        <div className="space-y-2.5">
          <a href="tel:+919876543210" className="flex items-center gap-2.5 text-xs font-semibold text-emerald-700 hover:text-emerald-600 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Phone size={13} className="text-emerald-600" />
            </div>
            <span>+91 9876543210</span>
          </a>
          <a href="mailto:support@clinic.com" className="flex items-center gap-2.5 text-xs font-semibold text-emerald-700 hover:text-emerald-600 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Mail size={13} className="text-emerald-600" />
            </div>
            <span>support@clinic.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, icon: Icon }: { label: string; value?: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-b-0">
      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-emerald-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</div>
        <div className="text-xs font-bold text-gray-800 truncate mt-0.5">
          {value || (
            <span className="text-gray-300 font-normal italic">Not selected</span>
          )}
        </div>
      </div>
    </div>
  );
}

function StepCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 p-5 sm:p-7", className)}>
      {children}
    </div>
  );
}

function StepHeader({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="mb-8">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Step {step} of {registrationSteps.length + 1}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function StepChooseOption() {
  const { registrationOption, setRegistrationOption, setStep, selectedDoctor, setSelectedDoctor, setSelectedSpecialty } = useAppointmentStore();
  const [hovered, setHovered] = useState<string | null>(null);

  const options = [
    {
      value: "consult" as const,
      title: "Consult a Doctor",
      description: "Choose a doctor from our specialist list and book an appointment",
      icon: (
        <svg viewBox="0 0 64 64" className="w-[52px] h-[52px]">
          <circle cx="32" cy="16" r="12" fill="#e5e7eb" />
          <circle cx="32" cy="14" r="6" fill="#6b7280" />
          <path fill="#6b7280" d="M20 40v4a12 12 0 0 0 24 0v-4H20z" opacity="0.8" />
          <circle cx="32" cy="20" r="4" fill="#fce7f3" fillOpacity="0.5" />
          <rect x="26" y="17" width="12" height="2" rx="1" fill="#374151" opacity="0.6" />
          <circle cx="29" cy="19" r="1.5" fill="none" stroke="#374151" strokeWidth="1" opacity="0.4" />
          <circle cx="35" cy="19" r="1.5" fill="none" stroke="#374151" strokeWidth="1" opacity="0.4" />
          <path d="M28 30c0 4 8 4 8 0" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      value: "submit" as const,
      title: "Submit Without Doctor",
      description: "Submit your medical case and our team will assign the best doctor for you",
      icon: (
        <svg viewBox="0 0 64 64" className="w-[52px] h-[52px]">
          <rect x="14" y="8" width="36" height="44" rx="6" fill="#e5e7eb" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="20" y1="20" x2="44" y2="20" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="28" x2="44" y2="28" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="36" x2="34" y2="36" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="44" cy="44" r="10" fill="#6b7280" />
          <line x1="44" y1="39" x2="44" y2="49" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="39" y1="44" x2="49" y2="44" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-[720px] mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-[6px] px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-semibold mb-3">
          <span className="w-[5px] h-[5px] rounded-full bg-gray-400" />
          Step 1 of 5
        </div>
        <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Choose an Option</h2>
        <p className="text-[13px] text-gray-400 mt-[6px]">Please choose how you want to proceed with your consultation</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = registrationOption === opt.value;
          const isHovered = hovered === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setRegistrationOption(opt.value)}
              onMouseEnter={() => setHovered(opt.value)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "relative flex flex-col items-center text-center px-5 py-6 rounded-[12px] border-2 bg-white transition-all duration-200",
                isSelected
                  ? "border-gray-900 bg-gray-50 shadow-sm"
                  : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
              )}
            >
              {/* Check indicator */}
              <div className={cn(
                "w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-200 mb-4",
                isSelected ? "border-gray-900 bg-gray-900" : "border-gray-300"
              )}>
                {isSelected && (
                  <CheckCircle2 size={12} className="text-white" />
                )}
              </div>

              {/* Icon */}
              <div className={cn(
                "w-[68px] h-[68px] rounded-[14px] flex items-center justify-center mb-3 transition-all duration-200",
                isSelected ? "bg-gray-100" : "bg-gray-50"
              )}>
                {opt.icon}
              </div>

              {/* Title */}
              <h3 className={cn(
                "text-[15px] font-semibold mb-[4px] transition-colors",
                isSelected ? "text-gray-900" : "text-gray-800"
              )}>
                {opt.title}
              </h3>

              {/* Description */}
              <p className="text-[12px] text-gray-400 leading-relaxed mb-5 max-w-[220px]">{opt.description}</p>

              {/* Benefits */}
              <div className={cn(
                "w-full rounded-[10px] py-3 px-3 border transition-all duration-200",
                isSelected
                  ? "bg-white border-gray-200"
                  : "bg-gray-50 border-gray-100"
              )}>
                <ul className="space-y-[6px]">
                  {["✓ Select preferred doctor", "✓ Choose date & time", "✓ Get expert consultation"].map((b, idx) => (
                    <li key={idx} className="text-[11px] font-medium text-gray-500 leading-tight">{b}</li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>

      {/* Doctor Selection - Only when Consult a Doctor is selected */}
      {registrationOption === "consult" && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center shrink-0">
              <Users size={13} className="text-white" />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900">Choose a Doctor</h3>
          </div>
          <p className="text-[12px] text-gray-400 mb-4">Select a doctor from our specialist list</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doctors.map((doc) => {
              const isDocSelected = selectedDoctor?.id === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => { setSelectedSpecialty(doc.specialty); setSelectedDoctor(doc); }}
                  className={cn(
                    "relative flex items-center gap-3 p-3.5 rounded-[12px] border-2 transition-all text-left bg-white",
                    isDocSelected
                      ? "border-gray-900 bg-gray-50 shadow-sm"
                      : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                  )}
                >
                  <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-[10px] bg-gray-50 border border-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-gray-900 truncate">{doc.name}</div>
                    <div className="text-[11px] text-gray-400">{doc.specialty}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-600">
                        <Star size={9} className="fill-amber-400 text-amber-400" />
                        {doc.rating}
                      </span>
                      <span className="text-[10px] text-gray-400">{doc.experience}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[15px] font-bold text-emerald-600">₹{doc.fee}</div>
                    <div className="text-[9px] text-gray-400">consultation</div>
                  </div>
                  {isDocSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center ring-2 ring-white">
                      <CheckCircle2 size={11} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <StepNavigation
        nextDisabled={registrationOption === "consult" ? !selectedDoctor : !registrationOption}
        onNext={() => setStep("details")}
      />
    </div>
  );
}

function StepPersonalInfo() {
  const {
    patientName, setPatientName,
    patientEmail, setPatientEmail,
    patientPhone, setPatientPhone,
    patientAddress, setPatientAddress,
    patientCountry, setPatientCountry,
    patientGender, setPatientGender,
    patientBloodGroup, setPatientBloodGroup,
    setGeneratedPatientId,
    generatedPatientId,
    setStep,
  } = useAppointmentStore();

  const [age, setAge] = useState("");

  const isValid =
    patientName.trim().length >= 2 &&
    patientEmail.includes("@") &&
    patientPhone.trim().length >= 5;

  const handleSubmit = () => {
    if (!isValid) return;
    const id = usePatientStore.getState().addPatient({
      fullName: patientName,
      mobileNumber: patientPhone,
      email: patientEmail,
      gender: patientGender,
      dateOfBirth: age ? `${new Date().getFullYear() - parseInt(age)}-01-01` : "",
      bloodGroup: patientBloodGroup,
      address: patientAddress,
      country: patientCountry,
      state: "",
      district: "",
      city: "",
      pinCode: "",
      latitude: "",
      longitude: "",
      diseaseDetails: "",
      symptoms: "",
      complaint: "",
      medicalHistory: "",
      allergies: "",
      currentMedications: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyRelationship: "",
    });
    setGeneratedPatientId(id);
    toast.success(`Patient registered successfully! ID: ${id}`);
    setStep("medical");
  };

  const f = "w-full h-[38px] rounded-[8px] border border-gray-200 bg-white px-[12px] text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 transition-colors hover:border-gray-300";
  const sel = "appearance-none cursor-pointer pr-[32px]";
  const lbl = "text-[12px] font-medium text-gray-600 mb-[4px] block";

  return (
    <div className="max-w-[880px] mx-auto">
      <StepHeader step={2} title="Personal Information" description="Please provide your basic details to register as a patient" />

      <div className="bg-white rounded-[12px] border border-gray-100 shadow-sm mb-[14px]">
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-0">
          <div className="flex items-center gap-[10px] pb-3 border-b border-gray-50">
            <div className="w-[28px] h-[28px] rounded-[8px] bg-gray-900 flex items-center justify-center shrink-0">
              <UserRound size={14} className="text-white" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-gray-900">Personal Information</h3>
              <p className="text-[11px] text-gray-400 mt-[1px]">Basic details to register you as a patient</p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-[14px]">
            <div className="sm:col-span-3">
              <label className={lbl}>Full Name <span className="text-red-500">*</span></label>
              <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter patient full name" className={f} />
            </div>
            <div>
              <label className={lbl}>Mobile <span className="text-red-500">*</span></label>
              <input type="tel" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="+91 98765-43210" className={f} />
            </div>
            <div>
              <label className={lbl}>Email <span className="text-red-500">*</span></label>
              <input type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} placeholder="patient@example.com" className={f} />
            </div>
            <div>
              <label className={lbl}>Age</label>
              <input type="number" min={0} max={150} value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 30" className={f} />
            </div>
            <div>
              <label className={lbl}>Gender</label>
              <div className="relative">
                <select value={patientGender} onChange={(e) => setPatientGender(e.target.value as any)} className={cn(f, sel)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown size={14} className="absolute right-[10px] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={lbl}>Blood Group</label>
              <div className="relative">
                <select value={patientBloodGroup} onChange={(e) => setPatientBloodGroup(e.target.value)} className={cn(f, sel)}>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-[10px] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label className={lbl}>Address</label>
              <input type="text" value={patientAddress} onChange={(e) => setPatientAddress(e.target.value)} placeholder="Enter street address, apartment, or suite" className={f} />
            </div>
            <div className="sm:col-span-3">
              <label className={lbl}>Country</label>
              <input type="text" value={patientCountry} onChange={(e) => setPatientCountry(e.target.value)} placeholder="India" className={f} />
            </div>
          </div>
        </div>
      </div>

      <StepNavigation
        onBack={() => setStep("option")}
        nextDisabled={!isValid}
        onNext={handleSubmit}
      />
    </div>
  );
}

function StepMedicalDetails() {
  const {
    selectedSpecialty, setSelectedSpecialty,
    selectedDoctor, setSelectedDoctor,
    generatedPatientId,
    setPatientReason,
    setStep,
  } = useAppointmentStore();

  const [symptoms, setSymptoms] = useState("");
  const [complaint, setComplaint] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");

  const handleSpecialtyChange = (spec: string) => {
    setSelectedSpecialty(spec);
    if (selectedDoctor && selectedDoctor.specialty !== spec) setSelectedDoctor(null);
  };

  const isValid = selectedDoctor ? true : selectedSpecialty !== "";

  const handleSubmit = () => {
    if (!isValid || !generatedPatientId) return;
    usePatientStore.getState().updatePatient(generatedPatientId, {
      diseaseDetails: selectedSpecialty,
      symptoms,
      complaint,
      medicalHistory,
    });
    const reasonParts = [`Symptoms: ${symptoms || "None reported"}`, `Complaint: ${complaint || "None reported"}`, `Medical History: ${medicalHistory || "None reported"}`, `Specialty: ${selectedSpecialty}`];
    if (selectedDoctor) reasonParts.push(`Doctor: ${selectedDoctor.name}`);
    setPatientReason(reasonParts.join(" | "));
    toast.success("Medical details saved!");
    setStep("questionnaire");
  };

  const f = "w-full h-[38px] rounded-[8px] border border-gray-200 bg-white px-[12px] text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 transition-colors hover:border-gray-300";
  const lbl = "text-[12px] font-medium text-gray-600 mb-[4px] block";

  return (
    <div className="max-w-[880px] mx-auto">
      <StepHeader step={3} title="Medical Details" description="Help us understand your health concern" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[12px] border border-gray-100 shadow-sm mb-[14px]"
      >
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-0">
          <div className="flex items-center gap-[10px] pb-3 border-b border-gray-50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0"
            >
              <Stethoscope size={16} className="text-white" />
            </motion.div>
            <div>
              <h3 className="text-[14px] font-semibold text-gray-900">Medical Details</h3>
              <p className="text-[11px] text-gray-400 mt-[1px]">Help us understand your health concern</p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4">
          {selectedDoctor && (
            <div className="mb-4 p-3 rounded-[10px] bg-emerald-50 border border-emerald-100 flex items-center gap-3">
              <img src={selectedDoctor.image} alt="" className="w-10 h-10 rounded-[8px] border border-emerald-100 shrink-0" />
              <div>
                <div className="text-[13px] font-bold text-gray-900">Dr. {selectedDoctor.name.replace(/^Dr\.\s*/i, "")}</div>
                <div className="text-[11px] text-emerald-700 font-medium">{selectedDoctor.specialty}</div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-[14px]">
            {!selectedDoctor && (
              <div className="sm:col-span-3">
                <label className={lbl}>Specialty <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-[6px]">
                  {specialties.map((spec, idx) => {
                    const Icon = specialtyIcons[spec] || Stethoscope;
                    const isSelected = selectedSpecialty === spec;
                    const colors = specialtyColors[spec] || { bg: "bg-gray-50", icon: "text-gray-500", border: "border-gray-200" };
                    return (
                      <motion.button
                        key={spec}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: idx * 0.04 }}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSpecialtyChange(spec)}
                        className={cn(
                          "flex flex-col items-center gap-[5px] px-[6px] py-[10px] rounded-[10px] border transition-colors text-center",
                          isSelected
                            ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900/10"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                        )}
                      >
                        <motion.div
                          animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ duration: 0.4 }}
                          className={cn(
                            "w-[32px] h-[32px] rounded-[8px] flex items-center justify-center shrink-0 transition-colors",
                            isSelected ? "bg-gray-900" : colors.bg
                          )}
                        >
                          <Icon size={15} className={isSelected ? "text-white" : colors.icon} />
                        </motion.div>
                        <span className={cn(
                          "text-[10px] font-semibold leading-tight",
                          isSelected ? "text-gray-900" : "text-gray-600"
                        )}>
                          {spec}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className={lbl}>Symptoms</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms..."
                rows={2}
                className="w-full rounded-[8px] border border-gray-200 bg-white px-[12px] py-[8px] text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 transition-colors hover:border-gray-300 resize-none"
              />
            </div>
            <div>
              <label className={lbl}>Complaint</label>
              <textarea
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                placeholder="Main reason for visit?"
                rows={2}
                className="w-full rounded-[8px] border border-gray-200 bg-white px-[12px] py-[8px] text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 transition-colors hover:border-gray-300 resize-none"
              />
            </div>
            <div className="sm:col-span-3">
              <label className={lbl}>Medical History</label>
              <textarea
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="Previous diagnoses, surgeries, allergies, medications"
                rows={2}
                className="w-full rounded-[8px] border border-gray-200 bg-white px-[12px] py-[8px] text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 transition-colors hover:border-gray-300 resize-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <StepNavigation
        onBack={() => setStep("details")}
        nextDisabled={!isValid}
        onNext={handleSubmit}
      />
    </div>
  );
}

function StepQuestionnaire() {
  const {
    selectedSpecialty,
    questionnaireAnswers,
    toggleQuestionnaireAnswer,
    setPatientReason,
    patientReason,
    setStep,
  } = useAppointmentStore();

  const specStoreSpecialties = useSpecialtyStore((s) => s.specialties);
  const matchedSpec = specStoreSpecialties.find((s) => s.name === selectedSpecialty);
  const structuredQuestions = matchedSpec?.questions.filter((q) => q.isActive).sort((a, b) => a.sortOrder - b.sortOrder) || [];
  const hasStructured = structuredQuestions.length > 0;
  const flatQuestions = selectedSpecialty ? specialtyQuestions[selectedSpecialty] || [] : [];
  const questions = hasStructured ? structuredQuestions : flatQuestions;

  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});

  const selectedCount = hasStructured
    ? structuredQuestions.filter((q) => q.questionType === "yes_no" && (questionnaireAnswers[selectedSpecialty] || []).includes(q.question)).length
    : Object.values(questionnaireAnswers).reduce((sum, arr) => sum + arr.length, 0);
  const totalQuestions = questions.length;
  const isValid = selectedSpecialty !== "" && (hasStructured ? structuredQuestions.some((q) => q.questionType === "text" || (questionnaireAnswers[selectedSpecialty] || []).includes(q.question)) : selectedCount > 0);

  const handleContinue = () => {
    const qParts: string[] = [];
    if (hasStructured) {
      const selected = questionnaireAnswers[selectedSpecialty] || [];
      structuredQuestions.forEach((q) => {
        if (q.questionType === "yes_no") {
          qParts.push(`${q.question}: ${selected.includes(q.question) ? "Yes" : "No"}`);
        } else {
          qParts.push(`${q.question}: ${textAnswers[q.id] || "Not answered"}`);
        }
      });
    } else {
      const selected = questionnaireAnswers[selectedSpecialty] || [];
      flatQuestions.forEach((q) => {
        qParts.push(`${q}: ${selected.includes(q) ? "Yes" : "No"}`);
      });
    }
    const existingReason = patientReason || "";
    const questionnaireText = `Questionnaire: ${qParts.join(" | ")}`;
    setPatientReason(existingReason ? `${existingReason} | ${questionnaireText}` : questionnaireText);
    setStep("reports");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <StepHeader step={4} title="Health Questionnaire" description="Tell us about your symptoms related to your selected specialty" />

      {!selectedSpecialty ? (
        <StepCard>
          <div className="text-center py-8">
            <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Specialty Selected</h3>
            <p className="text-sm text-gray-400">Please go back and select a specialty in the previous step.</p>
          </div>
        </StepCard>
      ) : (
        <StepCard>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0"
            >
              <ClipboardList size={20} className="text-white" />
            </motion.div>
            <div>
              <h3 className="text-base font-bold text-gray-900">{selectedSpecialty}</h3>
              <p className="text-xs text-gray-400">{hasStructured ? "Answer all questions below" : "Select all symptoms that apply"}</p>
            </div>
            {!hasStructured && (
              <div className="ml-auto text-xs font-semibold text-gray-400">
                {selectedCount}/{totalQuestions} selected
              </div>
            )}
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } },
            }}
            className="space-y-3"
          >
            {hasStructured ? structuredQuestions.map((q) => {
              if (q.questionType === "text") {
                return (
                  <motion.div
                    key={q.id}
                    variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                    className="w-full"
                  >
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">{q.question}</label>
                    <textarea
                      value={textAnswers[q.id] || ""}
                      onChange={(e) => setTextAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="Type your answer..."
                      rows={2}
                      className="w-full rounded-[8px] border border-gray-200 bg-white px-[12px] py-[8px] text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 transition-colors hover:border-gray-300 resize-none"
                    />
                  </motion.div>
                );
              }
              const checked = (questionnaireAnswers[selectedSpecialty] || []).includes(q.question);
              return (
                <motion.button
                  key={q.id}
                  variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleQuestionnaireAnswer(selectedSpecialty, q.question)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left",
                    checked
                      ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                      : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                  )}
                >
                  <motion.div
                    animate={checked ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.25 }}
                    className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                      checked
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-300 bg-white"
                    )}
                  >
                    {checked && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </motion.svg>
                    )}
                  </motion.div>
                  <span className={cn(
                    "text-sm font-medium",
                    checked ? "text-emerald-800" : "text-gray-700"
                  )}>{q.question}</span>
                </motion.button>
              );
            }) : (
              flatQuestions.map((question) => {
                const checked = (questionnaireAnswers[selectedSpecialty] || []).includes(question);
                return (
                  <motion.button
                    key={question}
                    variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleQuestionnaireAnswer(selectedSpecialty, question)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left",
                      checked
                        ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                    )}
                  >
                    <motion.div
                      animate={checked ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                        checked
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-gray-300 bg-white"
                      )}
                    >
                      {checked && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      )}
                    </motion.div>
                    <span className={cn(
                      "text-sm font-medium",
                      checked ? "text-emerald-800" : "text-gray-700"
                    )}>{question}</span>
                  </motion.button>
                );
              })
            )}
          </motion.div>

          <div className="flex items-center gap-3 mt-8 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setStep("medical")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!isValid}
              className="flex-1 flex items-center justify-center gap-2"
            >
              Continue <ArrowRight size={16} />
            </Button>
          </div>
        </StepCard>
      )}
    </div>
  );
}

function StepReportsRedesigned() {
  const { uploadedReports, addUploadedReport, removeUploadedReport, setStep, registrationOption } = useAppointmentStore();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file) => {
        addUploadedReport(file.name);
      });
    }
  }, [addUploadedReport]);

  const triggerFileBrowser = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.jpg,.jpeg,.png";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach((file) => {
          addUploadedReport(file.name);
        });
      }
    };
    input.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <StepHeader step={5} title="Upload Reports" description="Upload your medical reports to help us better understand your health" />

      <StepCard>
        <div
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-10 sm:p-16 text-center transition-all cursor-pointer bg-gradient-to-b",
            dragActive
              ? "border-emerald-500 bg-emerald-50/30 scale-[1.01]"
              : "border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/10"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileBrowser}
        >
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200">
            <CloudUpload size={30} />
          </div>
          <p className="text-base font-bold text-gray-800 mb-1">
            Click to upload or drag & drop
          </p>
          <p className="text-sm text-gray-400">PDF, JPG, PNG files are allowed (max 10MB each)</p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={triggerFileBrowser}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <PlusCircle size={16} />
            Add More Files
          </button>
          <span className="text-sm font-semibold text-gray-500">
            {uploadedReports.length} file{uploadedReports.length !== 1 ? "s" : ""} uploaded
          </span>
        </div>

        {uploadedReports.length > 0 && (
          <div className="mt-5 space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Uploaded Files</h4>
            {uploadedReports.map((name) => (
              <div key={name} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3.5 border border-gray-100 group hover:bg-gray-100/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-emerald-600" />
                </div>
                <span className="flex-1 text-sm text-gray-700 font-medium truncate">{name}</span>
                <button
                  onClick={() => removeUploadedReport(name)}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </StepCard>

      <StepNavigation
        onBack={() => setStep("questionnaire")}
        onNext={() => setStep(registrationOption === "submit" ? "payment" : "schedule")}
        nextLabel="Next"
      />
    </div>
  );
}

function StepScheduleRedesigned() {
  const {
    selectedDoctor, setSelectedDoctor,
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    setStep,
    getAvailableTimeSlots,
    bookedSlots,
    registrationOption,
  } = useAppointmentStore();

  const dateStr = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";

  const doctorSlots = selectedDoctor && dateStr
    ? getAvailableTimeSlots(selectedDoctor.id, dateStr)
    : [];

  const allSlots = selectedDoctor ? doctorSlots : defaultTimeSlots;

  const getQueueInfo = (slot: string) => {
    if (!selectedDoctor || !dateStr) return null;
    const queueLength = bookedSlots.filter(
      (b) => b.doctorId === selectedDoctor.id && b.date === dateStr && b.time <= slot && b.status !== "cancelled"
    ).length;
    if (queueLength === 0) return null;
    return { queueLength, waitMinutes: queueLength * 20 };
  };

  const getSlotStatus = (slot: string) => {
    const queue = getQueueInfo(slot);
    if (selectedTime === slot) return { badge: { text: "Selected", cls: "bg-emerald-100 text-emerald-700" } };
    if (queue) return { badge: { text: `Waiting (${queue.queueLength})`, cls: "bg-amber-50 text-amber-700" } };
    return { badge: { text: "Available", cls: "bg-emerald-50 text-emerald-600" } };
  };

  const handleDateChange = (val: string) => {
    if (!val) {
      setSelectedDate(undefined);
    } else {
      const [year, month, day] = val.split("-").map(Number);
      setSelectedDate(new Date(year, month - 1, day));
      setSelectedTime("");
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableDatesReady = selectedDate !== undefined;
  const filteredSlots = availableDatesReady
    ? allSlots.filter((s) => formatTime(s).toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const todayStr = new Date().toISOString().split("T")[0];
  const isValid = selectedDate && selectedTime;
  const isConsult = registrationOption === "consult" && selectedDoctor;

  const inputBase = "w-full h-[42px] rounded-[10px] border border-gray-200 bg-white px-[12px] text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 transition-colors hover:border-gray-300";

  return (
    <div className="max-w-[720px] mx-auto">
      <StepHeader step={6} title="Schedule Appointment" description="Pick your preferred consultation date and time." />

      <div className="bg-white rounded-[12px] border border-gray-100 shadow-sm p-[14px] sm:p-[18px]">
        {/* Date + Time row */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1 min-w-0">
            <label className="text-[11px] font-medium text-gray-500 mb-[4px] block">Date</label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => handleDateChange(e.target.value)}
              min={todayStr}
              className={inputBase}
            />
          </div>
          <div className="flex-1 min-w-0 relative" ref={dropdownRef}>
            <label className="text-[11px] font-medium text-gray-500 mb-[4px] block">Time Slot</label>
            <button
              onClick={() => { if (availableDatesReady) setDropdownOpen(!dropdownOpen); }}
              disabled={!availableDatesReady}
              className={cn(inputBase, "flex items-center justify-between text-left cursor-pointer", !availableDatesReady && "bg-gray-50 text-gray-400 cursor-not-allowed")}
            >
              <span className={selectedTime ? "text-gray-900" : "text-gray-400"}>
                {selectedTime ? formatTime(selectedTime) : "Select time"}
              </span>
              <ChevronDown size={14} className={cn("transition-transform text-gray-400 shrink-0", dropdownOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full mt-1 z-50 origin-top"
                >
                  <div className="bg-white rounded-[10px] border border-gray-200 shadow-lg overflow-hidden">
                    <div className="p-2 border-b border-gray-50">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search time..."
                        className="w-full h-[34px] rounded-[8px] bg-gray-50 border border-gray-100 px-[10px] text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-[220px] overflow-y-auto py-1">
                      {filteredSlots.length === 0 ? (
                        <div className="px-3 py-6 text-center text-[12px] text-gray-400">No slots found</div>
                      ) : (
                        filteredSlots.map((slot) => {
                          const status = getSlotStatus(slot);
                          return (
                            <button
                              key={slot}
                              onClick={() => { setSelectedTime(slot); setDropdownOpen(false); setSearchQuery(""); }}
                              className="w-full flex items-center justify-between px-3 py-[10px] text-left hover:bg-gray-50 transition-colors"
                            >
                              <span className={cn("text-[13px] font-medium", selectedTime === slot ? "text-gray-900" : "text-gray-700")}>
                                {formatTime(slot)}
                              </span>
                              {status.badge && (
                                <span className={cn("text-[10px] font-semibold px-[8px] py-[2px] rounded-full", status.badge.cls)}>
                                  {status.badge.text}
                                </span>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Compact Summary Card - shown after both date and time selected */}
        {isValid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 pt-3 border-t border-gray-100"
          >
            <div className="bg-gray-50 rounded-[10px] p-[12px]">
              <div className="flex items-center justify-between mb-[8px]">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Appointment Summary</span>
              </div>
              {isConsult ? (
                <div className="flex items-start gap-3">
                  <img src={selectedDoctor.image} alt="" className="w-[36px] h-[36px] rounded-[8px] border border-gray-100 shrink-0 mt-[2px]" />
                  <div className="flex-1 min-w-0 grid grid-cols-2 gap-x-4 gap-y-[3px] text-[12px]">
                    <div><span className="text-gray-400">Doctor:</span> <span className="font-semibold text-gray-800">{selectedDoctor.name.replace(/^Dr\.\s*/i, "")}</span></div>
                    <div><span className="text-gray-400">Specialty:</span> <span className="font-semibold text-gray-800">{selectedDoctor.specialty}</span></div>
                    <div><span className="text-gray-400">Date:</span> <span className="font-semibold text-gray-800">{selectedDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span></div>
                    <div><span className="text-gray-400">Time:</span> <span className="font-semibold text-gray-800">{formatTime(selectedTime)}</span></div>
                    <div><span className="text-gray-400">Fee:</span> <span className="font-semibold text-emerald-600">₹{selectedDoctor.fee}</span></div>
                    <div><span className="text-gray-400">Mode:</span> <span className="font-semibold text-gray-800">Video Consultation</span></div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-[3px] text-[12px]">
                  <div><span className="text-gray-400">Date:</span> <span className="font-semibold text-gray-800">{selectedDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span></div>
                  <div><span className="text-gray-400">Time:</span> <span className="font-semibold text-gray-800">{formatTime(selectedTime)}</span></div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <StepNavigation
        onBack={() => setStep("reports")}
        nextDisabled={!isValid}
        onNext={() => setStep("payment")}
      />
    </div>
  );
}

function StepPaymentRedesigned() {
  const {
    selectedDoctor,
    selectedDate,
    selectedTime,
    patientName,
    patientEmail,
    patientPhone,
    patientReason,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    bookAppointment,
    registrationOption,
    setStep,
  } = useAppointmentStore();

  const fee = selectedDoctor?.fee || 0;
  const platformFee = 10;
  const total = fee + platformFee;

  const handleSubmitWithoutDoctor = () => {
    useAppointmentStore.setState({ isProcessing: true });
    setTimeout(() => {
      useAppointmentStore.setState({
        currentBooking: {
          id: `APT-${Date.now().toString(36).toUpperCase()}`,
          doctorId: "",
          doctorName: "Pending Assignment",
          specialty: "",
          date: selectedDate ? selectedDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          time: selectedTime || "",
          patientName,
          patientEmail,
          patientPhone,
          patientReason,
          status: "pending" as const,
          paymentStatus: "paid" as const,
          paymentMethod: paymentMethod === "insurance" ? "insurance" : paymentMethod === "upi" ? "upi" : "card",
          fee: platformFee,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        isProcessing: false,
        currentStep: "confirmation",
      });
    }, 1500);
  };

  const amountLabel = `₹${total}`;

  return (
    <div className="max-w-2xl mx-auto">
      <StepHeader step={7} title="Payment" description="Review your booking details and complete the payment" />

      <StepCard className="mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
            <FileText size={18} className="text-emerald-600" />
          </div>
          <h4 className="text-base font-bold text-gray-900">Booking Summary</h4>
        </div>

        <div className="space-y-4">
          {registrationOption === "consult" && selectedDoctor && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <img src={selectedDoctor.image} alt="" className="w-14 h-14 rounded-xl border border-gray-100" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900">{selectedDoctor.name}</div>
                <div className="text-sm text-gray-500">{selectedDoctor.specialty}</div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {registrationOption === "consult" && selectedDoctor && (
              <>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Doctor</div>
                  <div className="font-semibold text-gray-800 mt-0.5">{selectedDoctor.name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Specialty</div>
                  <div className="font-semibold text-gray-800 mt-0.5">{selectedDoctor.specialty}</div>
                </div>
              </>
            )}
            <div>
              <div className="text-xs text-gray-400 font-medium">Patient</div>
              <div className="font-semibold text-gray-800 mt-0.5">{patientName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Mobile</div>
              <div className="font-semibold text-gray-800 mt-0.5">{patientPhone}</div>
            </div>
            {selectedDate && (
              <div>
                <div className="text-xs text-gray-400 font-medium">Date</div>
                <div className="font-semibold text-gray-800 mt-0.5">
                  {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>
            )}
            {selectedTime && (
              <div>
                <div className="text-xs text-gray-400 font-medium">Time</div>
                <div className="font-semibold text-gray-800 mt-0.5">{formatTime(selectedTime)}</div>
              </div>
            )}
          </div>
        </div>
      </StepCard>

      <StepCard className="mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
            <CreditCard size={18} className="text-emerald-600" />
          </div>
          <h4 className="text-base font-bold text-gray-900">Payment Method</h4>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {(
            [
              { key: "card" as const, label: "Credit Card", icon: CreditCard },
              { key: "upi" as const, label: "UPI Payment", icon: Smartphone },
              { key: "insurance" as const, label: "Pay at Clinic", icon: ShieldCheck },
            ] as const
          ).map((method) => {
            const isSelected = paymentMethod === method.key;
            return (
              <button
                key={method.key}
                onClick={() => setPaymentMethod(method.key)}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all bg-white",
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/20 shadow-md ring-1 ring-emerald-500/10"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                  isSelected ? "bg-emerald-100 text-emerald-600" : "bg-gray-50 text-gray-400"
                )}>
                  <method.icon size={22} />
                </div>
                <span className={cn(
                  "text-xs font-bold",
                  isSelected ? "text-emerald-700" : "text-gray-500"
                )}>
                  {method.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-gray-50 rounded-xl p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Consultation Fee</span>
            <span className="font-bold text-gray-800">₹{fee}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Platform Fee</span>
            <span className="font-bold text-gray-800">₹{platformFee}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="font-bold text-2xl text-emerald-600">₹{total}</span>
          </div>
        </div>
      </StepCard>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/60 mb-6">
        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
          <Lock size={16} className="text-emerald-600" />
        </div>
        <p className="text-sm text-emerald-800 font-medium">
          Your payment information is encrypted and secure. We comply with PCI-DSS standards.
        </p>
      </div>

      <StepNavigation
        onBack={() => setStep(registrationOption === "submit" ? "reports" : "schedule")}
        nextLabel={isProcessing ? "Processing..." : `Pay ${amountLabel}`}
        nextDisabled={isProcessing}
        onNext={registrationOption === "submit" ? handleSubmitWithoutDoctor : bookAppointment}
        isNextLoading={isProcessing}
      />
    </div>
  );
}

function StepConfirmation({ onBackToHome }: { onBackToHome: () => void }) {
  const { currentBooking, selectedDoctor, registrationOption, generatedPatientId } = useAppointmentStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success("Redirecting to your dashboard...");
      onBackToHome();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onBackToHome]);

  if (!currentBooking) return null;

  const bookingDate = currentBooking.date
    ? new Date(currentBooking.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const isSubmitOnly = registrationOption === "submit";

  return (
    <div className="max-w-lg mx-auto py-4">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5 ring-8 ring-emerald-50">
          <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg">
            <CheckCircle2 size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isSubmitOnly ? "Registration Submitted!" : "Appointment Confirmed!"}
        </h2>
        <p className="text-gray-500">
          {isSubmitOnly
            ? "Your medical information has been submitted successfully. A doctor will review your reports."
            : `A confirmation email has been sent to ${currentBooking.patientEmail}.`}
        </p>

        {generatedPatientId && (
          <div className="mt-6 inline-block bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-8 py-4">
            <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">Your Patient ID</div>
            <div className="text-3xl font-bold text-emerald-800 font-mono tracking-wider">{generatedPatientId}</div>
            <p className="text-xs text-emerald-500 mt-1">You are now logged in automatically</p>
          </div>
        )}
      </div>

      <StepCard className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          {selectedDoctor ? (
            <>
              <img src={selectedDoctor.image} alt="" className="w-14 h-14 rounded-xl border border-gray-100" />
              <div>
                <div className="font-bold text-gray-900">{selectedDoctor.name}</div>
                <div className="text-sm text-gray-500">{selectedDoctor.specialty}</div>
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <ClipboardList size={24} className="text-emerald-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900">{currentBooking.doctorName}</div>
                <div className="text-sm text-gray-500">{currentBooking.specialty}</div>
              </div>
            </>
          )}
        </div>

        {!isSubmitOnly && bookingDate && (
          <>
            <hr className="border-gray-100 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <CalendarDays size={18} className="text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">Date</div>
                  <div className="text-sm font-bold text-gray-800">{bookingDate}</div>
                </div>
              </div>
              {currentBooking.time && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <Clock size={18} className="text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-semibold uppercase">Time</div>
                    <div className="text-sm font-bold text-gray-800">{formatTime(currentBooking.time)}</div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {currentBooking.meetingLink && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <Video size={16} className="text-emerald-600" />
              <span className="text-sm font-bold text-emerald-900">Video Consultation Link</span>
            </div>
            <p className="text-sm text-emerald-700 break-all font-mono bg-white rounded-lg p-3 border border-emerald-100">
              {currentBooking.meetingLink}
            </p>
          </div>
        )}

        <div className="mt-4 text-center">
          <span className="text-xs text-gray-400">Booking ID: </span>
          <span className="text-xs font-mono font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-md">{currentBooking.id}</span>
        </div>
      </StepCard>

      <StepCard>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Sparkles size={16} className="text-emerald-600" />
          </div>
          <h4 className="text-sm font-bold text-gray-900">What happens next?</h4>
        </div>
        <div className="space-y-3">
          {(isSubmitOnly ? [
            { icon: FileText, text: "Our medical team will review your submitted reports" },
            { icon: Stethoscope, text: "A specialist will be assigned based on your condition" },
            { icon: Mail, text: "You'll receive a notification once a doctor is assigned" },
            { icon: CalendarDays, text: "An appointment will be scheduled automatically" },
          ] : [
            { icon: CalendarPlus, text: "You'll receive an email & SMS confirmation" },
            { icon: Video, text: "Use the meeting link at the scheduled time" },
            { icon: Stethoscope, text: "Consult with your doctor online or in-person" },
            { icon: FileText, text: "Receive your digital prescription after consultation" },
          ]).map((step, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <step.icon size={15} className="text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{step.text}</span>
            </div>
          ))}
        </div>
      </StepCard>

      <div className="mt-8 text-center">
        <Button
          onClick={onBackToHome}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-10 h-12 font-semibold shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
        >
          <LayoutDashboard size={18} className="mr-2" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

function StepNavigation({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Continue",
  isNextLoading = false,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  isNextLoading?: boolean;
}) {
  return (
    <div className="mt-10 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="rounded-xl px-6 h-12 font-semibold border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            Back
          </Button>
        )}
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-12 text-sm font-semibold shadow-md shadow-emerald-200 hover:shadow-lg transition-all flex-1 min-w-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {isNextLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              {nextLabel}
              <ArrowRight size={16} className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
