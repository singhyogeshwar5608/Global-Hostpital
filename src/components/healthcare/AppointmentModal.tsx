"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  useAppointmentStore,
  specialties,
  specialtyQuestions,
  doctors,
  formatTime,
  defaultTimeSlots,
  type AppointmentStep,
  type BookedSlot,
} from "@/store/appointment-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
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
  AlertCircle,
  Sun,
  Moon,
  SunMedium,
  Pencil,
  Trash2,
  X,
  Filter,
  CheckCircle,
  XCircle,
  HourglassIcon,
  CircleDot,
  Timer,
  Copy,
  ChevronDown,
  ChevronUp,
  Upload,
  CloudUpload,
  HelpCircle,
  Phone,
  MessageCircle,
  HeartPulse,
  ClipboardList,
  Users,
  Activity,
  Droplets,
  TestTube2,
  Brain,
  Bone,
  Pill,
  Wind,
  PlusCircle,
  ScanLine,
  Smartphone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePatientStore } from "@/store/patient-store";

const stepConfig: { key: AppointmentStep; label: string; icon: React.ElementType }[] = [
  { key: "option", label: "Choose Option", icon: ClipboardList },
  { key: "details", label: "Personal Details", icon: UserRound },
  { key: "medical", label: "Medical Details", icon: Stethoscope },
  { key: "reports", label: "Upload Reports", icon: CloudUpload },
  { key: "schedule", label: "Appointment", icon: CalendarDays },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "confirmation", label: "Confirmed", icon: CheckCircle2 },
];

const registrationSteps = stepConfig.slice(0, 6);

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

const statusConfig: Record<BookedSlot["status"], { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  confirmed: { label: "Confirmed", color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200", icon: CheckCircle },
  pending: { label: "Pending", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200", icon: HourglassIcon },
  completed: { label: "Completed", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200", icon: CircleDot },
  cancelled: { label: "Cancelled", color: "text-red-700", bgColor: "bg-red-50 border-red-200", icon: XCircle },
};

type StatusFilter = "all" | BookedSlot["status"];

const questionnaireQuestions = [
  "Do you have any known allergies to medications?",
  "Are you currently taking any prescription medications?",
  "Have you undergone any surgical procedures in the past year?",
  "Do you have a family history of chronic illnesses (diabetes, heart disease, cancer)?",
  "Have you experienced chest pain or difficulty breathing recently?",
  "Have you been diagnosed with high blood pressure or diabetes?",
  "Have you been hospitalized in the last 6 months?",
  "Do you smoke or consume tobacco products?",
  "Do you consume alcohol regularly?",
  "Are you pregnant or could you be pregnant?",
];

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

export default function AppointmentModal() {
  const { isOpen, closeModal, currentStep } = useAppointmentStore();
  const [activeTab, setActiveTab] = useState<"book" | "appointments">("book");
  const [editingAppointment, setEditingAppointment] = useState<BookedSlot | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);

  const currentIndex = registrationSteps.findIndex((s) => s.key === currentStep);

  const handleCloseModal = () => {
    closeModal();
    setActiveTab("book");
    setEditingAppointment(null);
    setShowCancelConfirm(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseModal()}>
      <DialogContent
        className="sm:max-w-[1360px] w-[97vw] max-h-[96vh] p-0 gap-0 rounded-[28px] overflow-hidden flex flex-col border border-slate-200 bg-[#f8fbff] shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="sticky top-0 z-10 border-b border-slate-200/80 bg-[#f8fbff]/95 backdrop-blur">
          <DialogHeader className="px-5 pt-5 pb-0 sm:px-8">
            <DialogTitle className="sr-only">Patient Registration</DialogTitle>
            <DialogDescription className="sr-only">
              Patient registration and appointment booking form
            </DialogDescription>
          </DialogHeader>

          <div className="flex px-5 pt-4 gap-1 sm:px-8">
            <button
              onClick={() => { setActiveTab("book"); setEditingAppointment(null); }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-2xl transition-all relative",
                activeTab === "book"
                  ? "bg-white text-blue-700 border border-slate-200 border-b-white -mb-px shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/70"
              )}
            >
              <CalendarPlus size={16} />
              Register & Book
            </button>
            <button
              onClick={() => { setActiveTab("appointments"); setEditingAppointment(null); }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-2xl transition-all relative",
                activeTab === "appointments"
                  ? "bg-white text-blue-700 border border-slate-200 border-b-white -mb-px shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/70"
              )}
            >
              <CalendarDays size={16} />
              My Appointments
              <AppointmentCountBadge />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === "book" && !editingAppointment && (
            <>
              {currentStep !== "confirmation" && (
                <div className="px-5 pb-4 pt-4 sm:px-8">
                  <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:px-8">
                    <div className="mb-6 text-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)]">
                        <HeartPulse className="h-6 w-6" />
                      </div>
                      <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Patient Registration</h2>
                    </div>
                    <div className="flex items-start gap-1 overflow-x-auto pb-1">
                    {registrationSteps.map((step, i) => (
                      <React.Fragment key={step.key}>
                        <div className="min-w-[96px] flex-1 text-center">
                          <div
                            className={cn(
                              "mx-auto flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all",
                              i < currentIndex
                                ? "bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.25)]"
                                : i === currentIndex
                                ? "bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.25)] ring-4 ring-blue-50"
                                : "bg-slate-200 text-slate-700"
                            )}
                          >
                            {i < currentIndex ? <CheckCircle2 size={16} /> : i + 1}
                          </div>
                          <div
                            className={cn(
                              "mt-3 text-xs font-semibold transition-colors",
                              i <= currentIndex ? "text-slate-900" : "text-slate-500"
                            )}
                          >
                            {step.label}
                          </div>
                        </div>
                        {i < registrationSteps.length - 1 && (
                          <div
                            className={cn(
                              "mt-5 hidden h-px flex-1 min-w-[28px] rounded-full md:block",
                              i < currentIndex ? "bg-blue-200" : "bg-slate-200"
                            )}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                </div>
              )}

              <div className="flex flex-1 overflow-hidden px-5 pb-5 sm:px-8 sm:pb-8">
                <div className="flex-1 overflow-y-auto pr-0 pt-0 lg:pr-6">
                  {currentStep === "option" && <StepChooseOption />}
                  {currentStep === "details" && <StepPersonalDetails />}
                  {currentStep === "medical" && <StepMedicalDetails />}
                  {currentStep === "reports" && <StepReportsRedesigned />}
                  {currentStep === "schedule" && <StepScheduleRedesigned />}
                  {currentStep === "payment" && <StepPaymentRedesigned />}
                  {currentStep === "confirmation" && <StepConfirmation />}
                </div>

                <div className="hidden w-[320px] shrink-0 overflow-y-auto lg:block">
                  <RegistrationSidebar />
                </div>
              </div>
            </>
          )}

          {activeTab === "appointments" && !editingAppointment && (
            <div className="overflow-y-auto">
              <MyAppointmentsTab
                onEdit={setEditingAppointment}
                onCancel={setShowCancelConfirm}
                cancelConfirmId={showCancelConfirm}
                onCancelConfirm={(id) => {
                  useAppointmentStore.getState().updateBookingStatus(id, "cancelled");
                  setShowCancelConfirm(null);
                  toast.success("Appointment cancelled successfully");
                }}
                onCancelDismiss={() => setShowCancelConfirm(null)}
              />
            </div>
          )}

          {editingAppointment && (
            <div className="overflow-y-auto">
              <EditAppointmentFlow
                appointment={editingAppointment}
                onClose={() => setEditingAppointment(null)}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AppointmentCountBadge() {
  const bookedSlots = useAppointmentStore((s) => s.bookedSlots);
  const activeCount = bookedSlots.filter((b) => b.status === "confirmed" || b.status === "pending").length;
  if (activeCount === 0) return null;
  return (
    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold gradient-teal text-white rounded-full min-w-[18px] text-center">
      {activeCount}
    </span>
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

  return (
    <div className="sticky top-0 space-y-4">
      <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="rounded-2xl bg-blue-50 px-4 py-3">
          <h3 className="text-lg font-bold text-blue-700">Registration Summary</h3>
        </div>

        <div className="mt-4 space-y-1">
          <SummaryRow
            label="Selected Option"
            value={
              registrationOption === "consult"
                ? "Consult Doctor"
                : registrationOption === "submit"
                ? "Without Doctor"
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
            value={`\u20B9${fee}`}
            icon={CreditCard}
          />
        </div>
      </div>

      <div className="rounded-[22px] border border-emerald-200 bg-emerald-50/80 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-bold text-emerald-800">Secure & Safe</div>
            <p className="mt-1 text-sm leading-6 text-emerald-700/80">
              Your information is secure and encrypted
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="text-[28px] font-bold leading-none text-slate-900">Need Help?</div>
        <div className="mt-4 space-y-3">
          <a href="tel:+919876543210" className="flex items-center gap-3 text-sm font-medium text-slate-700 hover:text-blue-700">
            <Phone size={16} className="text-blue-500" />
            <span>+91 9876543210</span>
          </a>
          <a href="mailto:support@clinic.com" className="flex items-center gap-3 text-sm font-medium text-slate-700 hover:text-blue-700">
            <Mail size={16} className="text-blue-500" />
            <span>support@clinic.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, icon: Icon }: { label: string; value?: string; icon: React.ElementType }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 shrink-0">
        <Icon size={15} className="text-blue-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-slate-500">{label}</div>
        <div className="mt-1 text-base font-semibold text-slate-900 truncate">
          {value || "Not Selected"}
        </div>
      </div>
    </div>
  );
}

function StepChooseOption() {
  const { registrationOption, setRegistrationOption, setStep } = useAppointmentStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Step 1: Choose an Option</h3>
        <p className="text-gray-500 text-sm">Please choose how you want to proceed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: Consult a Doctor */}
        <div
          onClick={() => setRegistrationOption("consult")}
          className={cn(
            "cursor-pointer rounded-2xl border-2 p-6 flex flex-col items-center text-center transition-all bg-white relative",
            registrationOption === "consult"
              ? "border-blue-500 shadow-premium bg-blue-50/5"
              : "border-gray-200 hover:border-blue-200"
          )}
        >
          {/* Radio Button */}
          <div className="absolute top-4 left-4">
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
              registrationOption === "consult" ? "border-blue-500 bg-blue-500" : "border-gray-300"
            )}>
              {registrationOption === "consult" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
          </div>

          {/* Avatar Icon */}
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-4 overflow-hidden border border-blue-100">
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-blue-500 mt-2">
              <path fill="#e0f2fe" d="M50 10a18 18 0 1 0 18 18 18 18 0 0 0-18-18z"/>
              <path fill="#2563eb" d="M50 24a8 8 0 1 0 8 8 8 8 0 0 0-8-8z"/>
              <path fill="#1e3a8a" d="M38 52v4a12 12 0 0 0 24 0v-4H38z"/>
              <circle cx="50" cy="32" r="6" fill="#fbcfe8"/>
              <rect x="42" y="29" width="16" height="2" rx="1" fill="#1e293b"/>
              <circle cx="45" cy="30" r="2.5" fill="none" stroke="#1e293b" strokeWidth="1"/>
              <circle cx="55" cy="30" r="2.5" fill="none" stroke="#1e293b" strokeWidth="1"/>
              <path d="M45 42c0 5 10 5 10 0" fill="none" stroke="#64748b" strokeWidth="2"/>
            </svg>
          </div>

          <h4 className="text-base font-bold text-gray-900 mb-1">Consult a Doctor</h4>
          <p className="text-xs text-gray-500 mb-4 px-2">
            Choose a doctor from our specialist list and book an appointment
          </p>

          {/* Benefit Box */}
          <div className="w-full bg-blue-50/50 rounded-xl p-4 text-left border border-blue-100/50">
            <ul className="text-xs text-blue-800 space-y-2 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                Select preferred doctor
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                Choose date & time
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                Get expert consultation
              </li>
            </ul>
          </div>
        </div>

        {/* Option 2: Submit Without Doctor */}
        <div
          onClick={() => setRegistrationOption("submit")}
          className={cn(
            "cursor-pointer rounded-2xl border-2 p-6 flex flex-col items-center text-center transition-all bg-white relative",
            registrationOption === "submit"
              ? "border-blue-500 shadow-premium bg-blue-50/5"
              : "border-gray-200 hover:border-blue-200"
          )}
        >
          {/* Radio Button */}
          <div className="absolute top-4 left-4">
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
              registrationOption === "submit" ? "border-blue-500 bg-blue-500" : "border-gray-300"
            )}>
              {registrationOption === "submit" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
          </div>

          {/* Document Plus Icon */}
          <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-4 overflow-hidden border border-emerald-100">
            <svg viewBox="0 0 100 100" className="w-16 h-16 text-emerald-600">
              <rect x="25" y="15" width="50" height="70" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="2.5" />
              <path d="M35 30h30M35 45h30M35 60h20" stroke="#a7f3d0" strokeWidth="3" strokeLinecap="round" />
              <circle cx="68" cy="68" r="14" fill="#10b981" />
              <path d="M68 61v14M61 68h14" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <h4 className="text-base font-bold text-gray-900 mb-1">Submit Without Doctor</h4>
          <p className="text-xs text-gray-500 mb-4 px-2">
            Submit your medical case and our team will assign the best doctor for you
          </p>

          {/* Benefit Box */}
          <div className="w-full bg-emerald-50/50 rounded-xl p-4 text-left border border-emerald-100/50">
            <ul className="text-xs text-emerald-800 space-y-2 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Select specialty
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Answer few questions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Our team will assign doctor
              </li>
            </ul>
          </div>
        </div>
      </div>

      <StepNavigation
        nextDisabled={!registrationOption}
        onNext={() => setStep("details")}
      />
    </div>
  );
}

function StepPersonalDetails() {
  const {
    patientName, setPatientName,
    patientEmail, setPatientEmail,
    patientPhone, setPatientPhone,
    patientAddress, setPatientAddress,
    patientCountry, setPatientCountry,
    patientGender, setPatientGender,
    patientDob, setPatientDob,
    patientBloodGroup, setPatientBloodGroup,
    setGeneratedPatientId,
    setStep,
  } = useAppointmentStore();

  const isValid =
    patientName.trim().length >= 2 &&
    patientEmail.includes("@") &&
    patientPhone.trim().length >= 5;

  const handleSubmit = () => {
    if (!isValid) return;
    const id = `PAT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setGeneratedPatientId(id);
    usePatientStore.getState().addPatient({
      fullName: patientName,
      mobileNumber: patientPhone,
      email: patientEmail,
      gender: patientGender,
      dateOfBirth: patientDob,
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
    toast.success(`Patient registered successfully! ID: ${id}`);
    setStep("medical");
  };

  const inputClass = "w-full h-11 rounded-xl bg-white border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClass = "text-xs font-semibold text-gray-700 mb-1.5 block";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Step 2: Personal Details</h3>
        <p className="text-gray-500 text-sm">Please provide your basic information to generate Patient ID</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
            <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter patient full name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label>
            <input type="tel" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="+91 98765-43210" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
            <input type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} placeholder="patient@example.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select value={patientGender} onChange={(e) => setPatientGender(e.target.value as any)} className={inputClass}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input type="date" value={patientDob} onChange={(e) => setPatientDob(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Blood Group</label>
            <select value={patientBloodGroup} onChange={(e) => setPatientBloodGroup(e.target.value)} className={inputClass}>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Address</label>
            <textarea
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              placeholder="Enter street address, apartment, or suite"
              rows={2}
              className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Country</label>
            <input type="text" value={patientCountry} onChange={(e) => setPatientCountry(e.target.value)} placeholder="India" className={inputClass} />
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
    questionnaireAnswers, toggleQuestionnaireAnswer,
    setStep,
  } = useAppointmentStore();

  const questions = selectedSpecialty ? specialtyQuestions[selectedSpecialty] || [] : [];
  const selectedCount = Object.values(questionnaireAnswers).reduce((sum, arr) => sum + arr.length, 0);
  const totalQuestions = questions.length;
  const isValid = selectedSpecialty !== "" && selectedCount > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Step 2: Select Specialty */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Step 2: Select Specialty</h3>
          <p className="text-gray-500 text-sm">Please select the category related to your health concern</p>
        </div>

        {/* Dropdown Selector */}
        <div className="relative max-w-xs">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full h-11 rounded-xl bg-white border border-gray-200 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Specialty</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>{spec} ({specialtyDescriptions[spec] || spec})</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>

        {/* Specialty Button Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {specialties.map((spec, idx) => {
            const Icon = specialtyIcons[spec] || Stethoscope;
            const isSelected = selectedSpecialty === spec;

            let iconColor = "text-gray-400";
            if (spec === "LFT" || spec === "KFT" || spec === "Cardiology" || spec === "Gastroenterology") {
              iconColor = "text-red-500";
            } else if (spec === "Diabetes" || spec === "Orthopedic" || spec === "General Consultation") {
              iconColor = "text-blue-500";
            } else if (spec === "Thyroid") {
              iconColor = "text-purple-500";
            }

            return (
              <motion.button
                key={spec}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedSpecialty(spec)}
                className={cn(
                  "flex items-center gap-3 p-3.5 rounded-xl border-2 transition-colors text-left bg-white",
                  isSelected
                    ? "border-blue-500 bg-blue-50/5 shadow-premium"
                    : "border-gray-100 hover:border-gray-200"
                )}
              >
                <motion.div
                  animate={isSelected ? { scale: [1, 1.1, 1], rotate: [0, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    isSelected ? "bg-blue-100" : "bg-gray-50"
                  )}
                >
                  <Icon size={18} className={isSelected ? "text-blue-600" : iconColor} />
                </motion.div>
                <div className="min-w-0">
                  <div className={cn("text-xs font-bold truncate", isSelected ? "text-blue-600" : "text-gray-700")}>
                    {spec}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {specialtyDescriptions[spec] || spec}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Dynamic Checkbox Questionnaire */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Step 3: Symptom Checklist</h3>
            <p className="text-gray-500 text-sm">Select all symptoms that apply to you</p>
          </div>
          {selectedSpecialty && (
            <div className="text-sm font-semibold text-gray-400">
              {selectedCount}/{totalQuestions} selected
            </div>
          )}
        </div>

        {!selectedSpecialty ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
            <AlertCircle size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-gray-500">Please select a specialty first</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-100"
          >
            {questions.map((question) => {
              const checked = (questionnaireAnswers[selectedSpecialty] || []).includes(question);
              return (
                <motion.button
                  key={question}
                  variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggleQuestionnaireAnswer(selectedSpecialty, question)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-gray-50/50"
                >
                  <div className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                    checked
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300 bg-white"
                  )}>
                    {checked && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className={cn(
                    "text-sm font-semibold",
                    checked ? "text-blue-700" : "text-gray-700"
                  )}>
                    {question}
                  </span>
                </motion.button>
              );
            })}

            <div className="bg-blue-50/50 border-t border-blue-100/50 p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800 font-semibold">
                Select all symptoms you are currently experiencing
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <StepNavigation
        onBack={() => setStep("details")}
        nextDisabled={!isValid}
        onNext={() => setStep("reports")}
      />
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Step 4: Upload Reports</h3>
        <p className="text-gray-500 text-sm">Please upload your medical reports (Max file size: 10MB each)</p>
      </div>

      <div
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer bg-white",
          dragActive
            ? "border-blue-500 bg-blue-50/5 scale-[1.01]"
            : "border-blue-200 hover:border-blue-300"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileBrowser}
      >
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center bg-blue-500 text-white shadow-md">
          <CloudUpload size={28} />
        </div>
        <p className="text-sm font-semibold text-gray-700 mb-1">
          Click to upload or drag & drop
        </p>
        <p className="text-xs text-gray-400">PDF, JPG, PNG files are allowed</p>
      </div>

      {/* Button and Upload Count Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={triggerFileBrowser}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <PlusCircle size={14} className="text-blue-500" />
          Add More Files
        </button>
        <span className="text-xs font-bold text-gray-500">
          Uploaded Files: {uploadedReports.length}
        </span>
      </div>

      {/* Uploaded Files List */}
      {uploadedReports.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
          <h4 className="text-xs font-bold text-gray-900 mb-2">Uploaded Files</h4>
          {uploadedReports.map((name) => (
            <div key={name} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <FileText size={16} className="text-blue-500" />
              <span className="flex-1 text-sm text-gray-700 truncate">{name}</span>
              <button
                onClick={() => removeUploadedReport(name)}
                className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0"
              >
                <Trash2 size={13} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      <StepNavigation
        onBack={() => setStep("medical")}
        onNext={() => {
          if (registrationOption === "submit") {
            setStep("payment");
          } else {
            setStep("schedule");
          }
        }}
        nextLabel="Next"
      />
    </div>
  );
}

function StepScheduleRedesigned() {
  const {
    selectedDoctor, setSelectedDoctor,
    selectedSpecialty,
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    setStep,
    getAvailableTimeSlots,
    registrationOption,
  } = useAppointmentStore();

  const filteredDoctors = doctors.filter((d) => d.specialty === selectedSpecialty);

  const dateStr = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";

  const availableSlots = selectedDoctor && dateStr
    ? getAvailableTimeSlots(selectedDoctor.id, dateStr)
    : registrationOption === "submit"
    ? defaultTimeSlots
    : [];

  const handleDateChange = (val: string) => {
    if (!val) {
      setSelectedDate(undefined);
    } else {
      const [year, month, day] = val.split("-").map(Number);
      setSelectedDate(new Date(year, month - 1, day));
    }
  };

  const inputClass = "w-full h-11 rounded-xl bg-white border border-gray-200 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer";
  const labelClass = "text-xs font-semibold text-gray-700 mb-1.5 block";

  const isValid =
    (registrationOption === "submit" && selectedDate && selectedTime) ||
    (registrationOption === "consult" && selectedDoctor && selectedDate && selectedTime);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Step 5: Select Appointment Date & Time</h3>
        <p className="text-gray-500 text-sm">Please select your preferred date and time slot</p>
      </div>

      {/* Doctor Selection Grid */}
      {registrationOption === "consult" && (
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-900 block">Choose Your Doctor *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map((doc) => {
              const isSelected = selectedDoctor?.id === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left bg-white relative",
                    isSelected
                      ? "border-blue-500 bg-blue-50/5 shadow-premium"
                      : "border-gray-100 hover:border-gray-200"
                  )}
                >
                  <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm">{doc.name}</div>
                    <div className="text-xs text-gray-400 mb-1">{doc.specialty}</div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[11px] text-yellow-600 font-bold">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        {doc.rating}
                      </span>
                      <span className="text-[11px] text-gray-400 font-semibold">{doc.experience}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pr-2">
                    <div className="text-base font-bold text-blue-600">₹{doc.fee}</div>
                    <div className="text-[10px] text-gray-400 font-medium">consultation</div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Date & Time Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div>
          <label className={labelClass}>Select Date *</label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => handleDateChange(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Select Time Slot *</label>
          <div className="relative">
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={!selectedDate || (registrationOption === "consult" && !selectedDoctor)}
              className={cn(
                inputClass,
                "appearance-none",
                (!selectedDate || (registrationOption === "consult" && !selectedDoctor)) && "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100"
              )}
            >
              <option value="">Select time slot</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {formatTime(slot)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      <StepNavigation
        onBack={() => {
          if (registrationOption === "submit") {
            setStep("reports");
          } else {
            setStep("reports");
          }
        }}
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
    <div className="max-w-2xl mx-auto space-y-6 bg-white p-2">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Step 6: Payment</h3>
        <p className="text-gray-500 text-sm">Review your booking and complete payment</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <CreditCard size={16} className="text-blue-600" />
          </div>
          <h4 className="text-sm font-bold text-gray-900">Payment Summary</h4>
        </div>

        <div className="space-y-3 text-sm">
          {registrationOption === "consult" && selectedDoctor && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Doctor</span>
                <span className="font-bold text-gray-900">{selectedDoctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Specialty</span>
                <span className="font-bold text-gray-900">{selectedDoctor.specialty}</span>
              </div>
              {selectedDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Date</span>
                  <span className="font-bold text-gray-900">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {selectedTime && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Time</span>
                  <span className="font-bold text-gray-900">{formatTime(selectedTime)}</span>
                </div>
              )}
            </>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500 font-semibold">Patient Name</span>
            <span className="font-bold text-gray-900">{patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-semibold">Mobile Number</span>
            <span className="font-bold text-gray-900">{patientPhone}</span>
          </div>
        </div>

        <hr className="border-gray-100 my-4" />

        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 font-semibold">Consultation Fee</span>
            <span className="font-bold text-gray-900">₹{fee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-semibold">Platform Fee</span>
            <span className="font-bold text-gray-900">₹{platformFee}</span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex justify-between text-base pt-1">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="font-bold text-blue-600 text-xl">₹{total}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h4 className="text-sm font-bold text-gray-900 mb-4">Payment Method</h4>
        <div className="grid grid-cols-3 gap-3">
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
                  "flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all bg-white",
                  isSelected
                    ? "border-blue-500 bg-blue-50/5 shadow-premium"
                    : "border-gray-100 hover:border-gray-200"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                  isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-50 text-gray-400"
                )}>
                  <method.icon size={20} />
                </div>
                <span className={cn(
                  "text-xs font-bold",
                  isSelected ? "text-blue-600" : "text-gray-500"
                )}>
                  {method.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
        <Lock size={16} className="text-blue-600 shrink-0" />
        <span className="text-xs text-blue-800 font-semibold">
          Your payment information is encrypted and secure. We comply with PCI-DSS standards.
        </span>
      </div>

      <StepNavigation
        onBack={() => {
          if (registrationOption === "submit") {
            setStep("reports");
          } else {
            setStep("schedule");
          }
        }}
        nextLabel={isProcessing ? "Processing..." : `Pay ${amountLabel}`}
        nextDisabled={isProcessing}
        onNext={registrationOption === "submit" ? handleSubmitWithoutDoctor : bookAppointment}
        isNextLoading={isProcessing}
      />
    </div>
  );
}

function StepConfirmation() {
  const { currentBooking, selectedDoctor, closeModal, registrationOption } = useAppointmentStore();

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
    <div className="max-w-lg mx-auto space-y-6 text-center py-4 bg-white">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-premium text-white">
          <CheckCircle2 size={40} />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {isSubmitOnly ? "Registration Submitted!" : "Appointment Confirmed!"}
        </h3>
        <p className="text-gray-500 text-sm">
          {isSubmitOnly
            ? "Your medical information has been submitted successfully. A doctor will review your reports."
            : `Your appointment has been booked successfully. A confirmation email has been sent to ${currentBooking.patientEmail}.`}
        </p>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/20 p-5 text-left space-y-3">
        <div className="flex items-center gap-3 mb-2">
          {selectedDoctor ? (
            <>
              <img src={selectedDoctor.image} alt="" className="w-12 h-12 rounded-xl" />
              <div>
                <div className="font-bold text-gray-900">{selectedDoctor.name}</div>
                <div className="text-xs text-gray-500">{selectedDoctor.specialty}</div>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <ClipboardList size={24} className="text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900">{currentBooking.doctorName}</div>
                <div className="text-xs text-gray-500">{currentBooking.specialty}</div>
              </div>
            </>
          )}
        </div>

        {!isSubmitOnly && bookingDate && (
          <>
            <hr className="border-blue-100/50" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-blue-600" />
                <div>
                  <div className="text-[10px] text-gray-400 font-bold">Date</div>
                  <div className="font-bold text-gray-900">{bookingDate}</div>
                </div>
              </div>
              {currentBooking.time && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-600" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold">Time</div>
                    <div className="font-bold text-gray-900">{formatTime(currentBooking.time)}</div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {currentBooking.meetingLink && (
          <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-800">
            <div className="flex items-center gap-2 mb-1.5">
              <Video size={16} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Video Consultation Link</span>
            </div>
            <p className="text-xs text-blue-700 break-all font-semibold">
              {currentBooking.meetingLink}
            </p>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 font-semibold">
        Booking ID: <span className="font-mono font-bold text-gray-600">{currentBooking.id}</span>
      </div>

      <div className="rounded-2xl border border-gray-100 p-4 text-left shadow-sm">
        <h4 className="text-sm font-bold text-gray-900 mb-3">What happens next?</h4>
        <div className="space-y-2.5">
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
            { icon: FlaskConical, text: "Lab assignments if tests are recommended" },
            { icon: CalendarDays, text: "Schedule follow-up if needed" },
          ]).map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <step.icon size={14} className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-600 font-semibold">{step.text}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={closeModal}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-11 font-semibold shadow-premium transition-opacity w-full"
      >
        Done
      </Button>
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
  const { closeModal } = useAppointmentStore();

  return (
    <div className="sticky bottom-0 -mx-8 mt-6 border-t border-slate-200 bg-white/95 px-8 pb-3 pt-4 backdrop-blur">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="h-11 rounded-xl border-slate-200 px-6 font-medium text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            Back
          </Button>
        )}
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          className="h-11 min-w-0 flex-1 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(37,99,235,0.24)] transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isNextLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              {nextLabel}
              <ArrowRight size={16} className="ml-1.5 shrink-0" />
            </>
          )}
        </Button>
        <button
          type="button"
          onClick={closeModal}
          className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          title="Close"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function MyAppointmentsTab({
  onEdit,
  onCancel,
  cancelConfirmId,
  onCancelConfirm,
  onCancelDismiss,
}: {
  onEdit: (apt: BookedSlot) => void;
  onCancel: (id: string) => void;
  cancelConfirmId: string | null;
  onCancelConfirm: (id: string) => void;
  onCancelDismiss: () => void;
}) {
  const { bookedSlots } = useAppointmentStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAppointments = useMemo(() => {
    if (statusFilter === "all") return bookedSlots;
    return bookedSlots.filter((b) => b.status === statusFilter);
  }, [bookedSlots, statusFilter]);

  const filterOptions: { key: StatusFilter; label: string; icon: React.ElementType }[] = [
    { key: "all", label: "All", icon: Filter },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "pending", label: "Pending", icon: HourglassIcon },
    { key: "completed", label: "Completed", icon: CircleDot },
    { key: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">My Appointments</h3>
          <p className="text-gray-500 text-sm">{filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border",
            statusFilter !== "all"
              ? "border-teal bg-teal/5 text-teal"
              : "border-gray-200 text-gray-500 hover:border-teal/30 hover:text-teal"
          )}
        >
          <Filter size={14} />
          Filter
          {statusFilter !== "all" && (
            <span className="w-1.5 h-1.5 rounded-full bg-teal" />
          )}
          {showFilters ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl">
          {filterOptions.map((opt) => {
            const count = opt.key === "all"
              ? bookedSlots.length
              : bookedSlots.filter((b) => b.status === opt.key).length;
            return (
              <button
                key={opt.key}
                onClick={() => setStatusFilter(opt.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  statusFilter === opt.key
                    ? "gradient-teal text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-teal/30"
                )}
              >
                <opt.icon size={12} />
                {opt.label}
                <span className={cn(
                  "ml-0.5 px-1 py-0.5 rounded text-[10px]",
                  statusFilter === opt.key ? "bg-white/20" : "bg-gray-100"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <CalendarDays size={48} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium text-gray-500">No appointments found</p>
          <p className="text-sm mt-1">
            {statusFilter !== "all"
              ? "Try a different filter or book a new appointment"
              : "Click 'Register & Book' to schedule your first visit"}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
          {filteredAppointments.map((apt) => {
            const sConfig = statusConfig[apt.status];
            const StatusIcon = sConfig.icon;
            const isCancellable = apt.status === "confirmed" || apt.status === "pending";
            const isEditable = apt.status === "confirmed" || apt.status === "pending";
            const aptDate = new Date(apt.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={apt.id}
                className={cn(
                  "rounded-xl border p-4 transition-all",
                  apt.status === "cancelled" ? "border-gray-200 bg-gray-50/50 opacity-70" : "border-gray-100 bg-white hover:shadow-card-hover"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal/20 to-teal-light/20 flex items-center justify-center shrink-0">
                    <UserRound size={20} className="text-teal" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-sm truncate">{apt.doctorName}</span>
                      <Badge
                        className={cn(
                          "text-[10px] px-1.5 py-0 h-5 border rounded-md font-semibold",
                          sConfig.bgColor,
                          sConfig.color
                        )}
                        variant="outline"
                      >
                        <StatusIcon size={10} className="mr-0.5" />
                        {sConfig.label}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">{apt.specialty}</div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={12} className="text-teal" />
                        {aptDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-teal" />
                        {formatTime(apt.time)}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-teal">
                        ${apt.fee}
                      </span>
                    </div>
                    {apt.patientReason && (
                      <div className="mt-1.5 text-xs text-gray-400 italic truncate">
                        &ldquo;{apt.patientReason}&rdquo;
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isEditable && (
                      <button
                        onClick={() => onEdit(apt)}
                        className="w-8 h-8 rounded-lg bg-teal/10 hover:bg-teal/20 flex items-center justify-center transition-colors group"
                        title="Edit appointment"
                      >
                        <Pencil size={14} className="text-teal group-hover:text-teal-dark" />
                      </button>
                    )}
                    {isCancellable && cancelConfirmId === apt.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onCancelConfirm(apt.id)}
                          className="px-2 py-1 rounded-lg bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={onCancelDismiss}
                          className="px-2 py-1 rounded-lg bg-gray-200 text-gray-600 text-[10px] font-bold hover:bg-gray-300 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : isCancellable ? (
                      <button
                        onClick={() => onCancel(apt.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors group"
                        title="Cancel appointment"
                      >
                        <Trash2 size={14} className="text-red-400 group-hover:text-red-600" />
                      </button>
                    ) : null}
                  </div>
                </div>

                {apt.meetingLink && apt.status === "confirmed" && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <Video size={12} className="text-teal shrink-0" />
                    <span className="text-[10px] text-teal-dark/60 truncate flex-1">{apt.meetingLink}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(apt.meetingLink || "");
                        toast.success("Meeting link copied!");
                      }}
                      className="shrink-0 text-[10px] text-teal font-semibold hover:text-teal-dark transition-colors flex items-center gap-0.5"
                    >
                      <Copy size={10} />
                      Copy
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EditAppointmentFlow({
  appointment,
  onClose,
}: {
  appointment: BookedSlot;
  onClose: () => void;
}) {
  const { bookedSlots, editBooking, getAvailableTimeSlots } = useAppointmentStore();

  const [editDate, setEditDate] = useState<Date | undefined>(new Date(appointment.date));
  const [editTime, setEditTime] = useState(appointment.time);
  const [editReason, setEditReason] = useState(appointment.patientReason);
  const [isSaving, setIsSaving] = useState(false);

  const doctor = doctors.find((d) => d.id === appointment.doctorId);
  const dateStr = editDate ? editDate.toISOString().split("T")[0] : "";

  const availableSlots = appointment.doctorId && dateStr
    ? getAvailableTimeSlots(appointment.doctorId, dateStr)
    : [];

  const allDoctorSlots = doctor?.availableSlots || [];

  const bookedForDate = useMemo(() => {
    if (!dateStr) return new Set<string>();
    return new Set(
      bookedSlots
        .filter(
          (b) =>
            b.doctorId === appointment.doctorId &&
            b.date === dateStr &&
            b.status !== "cancelled" &&
            b.id !== appointment.id
        )
        .map((b) => b.time)
    );
  }, [bookedSlots, appointment.doctorId, appointment.id, dateStr]);

  const groupedSlots = useMemo(() => {
    const groups: Record<TimePeriod, string[]> = { morning: [], afternoon: [], evening: [] };
    for (const slot of allDoctorSlots) {
      groups[getTimePeriod(slot)].push(slot);
    }
    return groups;
  }, [allDoctorSlots]);

  const isDayAvailable = (date: Date) => {
    if (!doctor) return false;
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && doctor.availableDays.includes(day);
  };

  const hasChanges =
    (editDate && editDate.toISOString().split("T")[0] !== appointment.date) ||
    editTime !== appointment.time ||
    editReason !== appointment.patientReason;

  const handleSave = () => {
    if (!editDate || !editTime) return;

    setIsSaving(true);
    const dateForCheck = editDate.toISOString().split("T")[0];
    const isAvailable = useAppointmentStore.getState().isSlotAvailable(appointment.doctorId, dateForCheck, editTime);
    const isSameSlot = dateForCheck === appointment.date && editTime === appointment.time;

    if (!isAvailable && !isSameSlot) {
      toast.error("This slot is already booked. Please choose another time.");
      setIsSaving(false);
      return;
    }

    setTimeout(() => {
      editBooking(appointment.id, {
        date: dateForCheck,
        time: editTime,
        patientReason: editReason,
      });
      setIsSaving(false);
      toast.success("Appointment updated successfully!");
      onClose();
    }, 600);
  };

  return (
    <div className="p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Pencil size={18} className="text-teal" />
            Edit Appointment
          </h3>
          <p className="text-gray-500 text-sm mt-0.5">
            Modify date, time, or reason for your appointment
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      <div className="p-4 rounded-xl bg-mint-light border border-teal/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-teal flex items-center justify-center">
            <Stethoscope size={18} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-sm text-gray-900">{appointment.doctorName}</div>
            <div className="text-xs text-gray-500">{appointment.specialty} · ${appointment.fee}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-teal/10 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <CalendarDays size={12} className="text-teal" />
            {new Date(appointment.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-teal" />
            {formatTime(appointment.time)}
          </span>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">New Date</label>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={editDate}
            onSelect={setEditDate}
            disabled={(date) => !isDayAvailable(date)}
            className="rounded-xl border shadow-sm"
          />
        </div>
      </div>

      {editDate && (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 block">New Time Slot</label>

          {allDoctorSlots.length > 0 ? (
            (["morning", "afternoon", "evening"] as TimePeriod[]).map((period) => {
              const periodSlots = groupedSlots[period];
              if (periodSlots.length === 0) return null;
              const config = periodConfig[period];
              const PeriodIcon = config.icon;
              return (
                <div key={period} className="space-y-2">
                  <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg", config.bgColor)}>
                    <PeriodIcon size={14} className={config.color} />
                    <span className={cn("text-xs font-semibold", config.color)}>
                      {config.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pl-1">
                    {periodSlots.map((slot) => {
                      const isBooked = bookedForDate.has(slot);
                      const isSelected = editTime === slot;
                      const isAvailable = !isBooked;
                      return (
                        <button
                          key={slot}
                          onClick={() => isAvailable && setEditTime(slot)}
                          disabled={isBooked}
                          className={cn(
                            "py-2 px-2 rounded-xl text-xs font-medium transition-all border flex flex-col items-center gap-0.5",
                            isSelected
                              ? "gradient-teal text-white border-teal shadow-premium"
                              : isBooked
                              ? "border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-70"
                              : "border-gray-200 text-gray-700 hover:border-teal/40 hover:bg-mint-light"
                          )}
                        >
                          <span className="font-semibold">{formatTime(slot)}</span>
                          {isBooked ? (
                            <span className="text-[9px] text-red-400 font-medium">Booked</span>
                          ) : (
                            <span className="text-[9px] text-gray-400">30 min</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-gray-400 text-sm">
              No slots available for this doctor.
            </div>
          )}
        </div>
      )}

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
          Reason for Visit
        </label>
        <textarea
          value={editReason}
          onChange={(e) => setEditReason(e.target.value)}
          placeholder="Describe your symptoms or reason for consultation..."
          rows={3}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors resize-none"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onClose}
          className="rounded-xl px-6 h-11 font-semibold border-gray-200 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || !editDate || !editTime || !hasChanges}
          className={cn(
            "gradient-teal text-white rounded-xl px-6 h-11 font-semibold shadow-premium hover:opacity-90 transition-opacity flex-1",
            (!hasChanges || isSaving) && "opacity-60 cursor-not-allowed"
          )}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <>
              <CheckCircle2 size={16} className="mr-1.5" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
