"use client";

import React, { useState, useMemo } from "react";
import {
  useAppointmentStore,
  specialties,
  doctors,
  formatTime,
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Step Config ─────────────────────────────────────────────
const steps: { key: AppointmentStep; label: string; icon: React.ElementType }[] = [
  { key: "specialty", label: "Specialty", icon: Stethoscope },
  { key: "doctor", label: "Doctor", icon: UserRound },
  { key: "schedule", label: "Schedule", icon: CalendarDays },
  { key: "patient-info", label: "Your Info", icon: FileText },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "confirmation", label: "Confirmed", icon: CheckCircle2 },
];

// ─── Time period classification ──────────────────────────────
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

// ─── Status helpers ──────────────────────────────────────────
const statusConfig: Record<BookedSlot["status"], { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  confirmed: { label: "Confirmed", color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200", icon: CheckCircle },
  pending: { label: "Pending", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200", icon: HourglassIcon },
  completed: { label: "Completed", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200", icon: CircleDot },
  cancelled: { label: "Cancelled", color: "text-red-700", bgColor: "bg-red-50 border-red-200", icon: XCircle },
};

type StatusFilter = "all" | BookedSlot["status"];

// ─── Main Modal ──────────────────────────────────────────────
export default function AppointmentModal() {
  const { isOpen, closeModal, currentStep } = useAppointmentStore();
  const [activeTab, setActiveTab] = useState<"book" | "appointments">("book");
  const [editingAppointment, setEditingAppointment] = useState<BookedSlot | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  const handleCloseModal = () => {
    closeModal();
    setActiveTab("book");
    setEditingAppointment(null);
    setShowCancelConfirm(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseModal()}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] p-0 gap-0 rounded-2xl overflow-hidden flex flex-col"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header with tabs */}
        <div className="sticky top-0 z-10 bg-white border-b rounded-t-2xl">
          <DialogHeader className="px-6 pt-5 pb-0">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Global Integrative Clinic
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Book appointments and manage your health journey
            </DialogDescription>
          </DialogHeader>

          {/* Tab Switcher */}
          <div className="flex px-6 pt-4 gap-1">
            <button
              onClick={() => { setActiveTab("book"); setEditingAppointment(null); }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all relative",
                activeTab === "book"
                  ? "bg-white text-teal border-t-2 border-x-2 border-teal/20 -mb-px"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <CalendarPlus size={16} />
              Book Appointment
            </button>
            <button
              onClick={() => { setActiveTab("appointments"); setEditingAppointment(null); }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all relative",
                activeTab === "appointments"
                  ? "bg-white text-teal border-t-2 border-x-2 border-teal/20 -mb-px"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <CalendarDays size={16} />
              My Appointments
              <AppointmentCountBadge />
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "book" && !editingAppointment && (
            <>
              {/* Step Progress Bar */}
              {currentStep !== "confirmation" && (
                <div className="flex items-center gap-1 px-6 pt-4 pb-2">
                  {steps.slice(0, -1).map((step, i) => (
                    <React.Fragment key={step.key}>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 text-xs font-medium transition-colors",
                          i <= currentIndex ? "text-teal" : "text-gray-400",
                          i === currentIndex && "font-bold"
                        )}
                      >
                        <div
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                            i < currentIndex
                              ? "gradient-teal text-white"
                              : i === currentIndex
                              ? "bg-teal/15 text-teal"
                              : "bg-gray-100 text-gray-400"
                          )}
                        >
                          {i < currentIndex ? <CheckCircle2 size={14} /> : i + 1}
                        </div>
                        <span className="hidden sm:inline">{step.label}</span>
                      </div>
                      {i < steps.length - 2 && (
                        <div
                          className={cn(
                            "flex-1 h-0.5 rounded-full transition-colors",
                            i < currentIndex ? "bg-teal" : "bg-gray-200"
                          )}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              <div className="p-6">
                {currentStep === "specialty" && <StepSpecialty />}
                {currentStep === "doctor" && <StepDoctor />}
                {currentStep === "schedule" && <StepSchedule />}
                {currentStep === "patient-info" && <StepPatientInfo />}
                {currentStep === "payment" && <StepPayment />}
                {currentStep === "confirmation" && <StepConfirmation />}
              </div>
            </>
          )}

          {activeTab === "appointments" && !editingAppointment && (
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
          )}

          {editingAppointment && (
            <EditAppointmentFlow
              appointment={editingAppointment}
              onClose={() => setEditingAppointment(null)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Appointment Count Badge ─────────────────────────────────
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

// ─── Step 1: Specialty ───────────────────────────────────────
function StepSpecialty() {
  const { selectedSpecialty, setSelectedSpecialty, setStep } = useAppointmentStore();

  const specialtyIcons: Record<string, React.ElementType> = {
    Cardiology: Stethoscope,
    Neurology: UserRound,
    Orthopedics: ShieldCheck,
    Dermatology: FlaskConical,
    Pediatrics: UserRound,
    Gynecology: UserRound,
    Ophthalmology: UserRound,
    ENT: UserRound,
    Psychiatry: UserRound,
    "General Medicine": Stethoscope,
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Select Specialty</h3>
        <p className="text-gray-500 text-sm">Choose the medical specialty for your consultation</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {specialties.map((spec) => {
          const Icon = specialtyIcons[spec] || Stethoscope;
          const isSelected = selectedSpecialty === spec;
          const count = doctors.filter((d) => d.specialty === spec).length;
          return (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left group",
                isSelected
                  ? "border-teal bg-teal/5 shadow-premium"
                  : "border-gray-100 hover:border-teal/30 hover:bg-mint-light/50"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  isSelected ? "gradient-teal" : "bg-gray-100 group-hover:bg-teal/10"
                )}
              >
                <Icon size={18} className={isSelected ? "text-white" : "text-gray-500 group-hover:text-teal"} />
              </div>
              <div className="min-w-0">
                <span
                  className={cn(
                    "text-sm font-semibold block",
                    isSelected ? "text-teal" : "text-gray-700"
                  )}
                >
                  {spec}
                </span>
                <span className="text-xs text-gray-400">{count} doctor{count !== 1 ? "s" : ""}</span>
              </div>
            </button>
          );
        })}
      </div>

      <StepNavigation
        nextDisabled={!selectedSpecialty}
        onNext={() => setStep("doctor")}
      />
    </div>
  );
}

// ─── Step 2: Doctor ──────────────────────────────────────────
function StepDoctor() {
  const { selectedSpecialty, selectedDoctor, setSelectedDoctor, setStep } =
    useAppointmentStore();

  const filtered = doctors.filter((d) => d.specialty === selectedSpecialty);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Choose Your Doctor</h3>
        <p className="text-gray-500 text-sm">
          {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} available in{" "}
          {selectedSpecialty}
        </p>
      </div>

      <div className="space-y-3">
        {filtered.map((doc) => {
          const isSelected = selectedDoctor?.id === doc.id;
          return (
            <button
              key={doc.id}
              onClick={() => setSelectedDoctor(doc)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left group",
                isSelected
                  ? "border-teal bg-teal/5 shadow-premium"
                  : "border-gray-100 hover:border-teal/30 hover:bg-mint-light/50"
              )}
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-14 h-14 rounded-xl bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900">{doc.name}</div>
                <div className="text-sm text-gray-500">{doc.specialty}</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-yellow-600">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    {doc.rating}
                  </span>
                  <span className="text-xs text-gray-400">{doc.experience}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-teal">${doc.fee}</div>
                <div className="text-xs text-gray-400">consultation</div>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <AlertCircle size={40} className="mx-auto mb-2" />
          <p>No doctors available for this specialty yet.</p>
        </div>
      )}

      <StepNavigation
        onBack={() => setStep("specialty")}
        nextDisabled={!selectedDoctor}
        onNext={() => setStep("schedule")}
      />
    </div>
  );
}

// ─── Step 3: Enhanced Schedule ───────────────────────────────
function StepSchedule() {
  const {
    selectedDoctor,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    setStep,
    getAvailableTimeSlots,
    bookedSlots,
  } = useAppointmentStore();

  const dateStr = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";

  const availableSlots = selectedDoctor && dateStr
    ? getAvailableTimeSlots(selectedDoctor.id, dateStr)
    : [];

  // Get all slots (including booked ones) for the selected date/doctor
  const allDoctorSlots = selectedDoctor?.availableSlots || [];
  const bookedForDate = useMemo(() => {
    if (!selectedDoctor || !dateStr) return new Set<string>();
    return new Set(
      bookedSlots
        .filter((b) => b.doctorId === selectedDoctor.id && b.date === dateStr && b.status !== "cancelled")
        .map((b) => b.time)
    );
  }, [bookedSlots, selectedDoctor, dateStr]);

  // Group slots by period
  const groupedSlots = useMemo(() => {
    const groups: Record<TimePeriod, string[]> = { morning: [], afternoon: [], evening: [] };
    for (const slot of allDoctorSlots) {
      groups[getTimePeriod(slot)].push(slot);
    }
    return groups;
  }, [allDoctorSlots]);

  const isDayAvailable = (date: Date) => {
    if (!selectedDoctor) return false;
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && selectedDoctor.availableDays.includes(day);
  };

  // Check if a day has any available slots
  const dayHasAvailableSlots = (date: Date) => {
    if (!selectedDoctor) return false;
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;
    if (!selectedDoctor.availableDays.includes(day)) return false;
    const dStr = date.toISOString().split("T")[0];
    const avail = useAppointmentStore.getState().getAvailableTimeSlots(selectedDoctor.id, dStr);
    return avail.length > 0;
  };

  const slotDuration = 30; // minutes

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Select Date & Time</h3>
        <p className="text-gray-500 text-sm">
          Pick a date and choose an available time slot with{" "}
          {selectedDoctor?.name}
        </p>
      </div>

      {/* Doctor mini-card */}
      {selectedDoctor && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-mint-light border border-teal/10">
          <img src={selectedDoctor.image} alt="" className="w-10 h-10 rounded-lg" />
          <div className="flex-1">
            <div className="font-semibold text-sm text-gray-900">{selectedDoctor.name}</div>
            <div className="text-xs text-gray-500">{selectedDoctor.specialty} · ${selectedDoctor.fee}</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-teal font-medium bg-teal/10 px-2 py-1 rounded-lg">
            <Timer size={12} />
            {slotDuration} min
          </div>
        </div>
      )}

      {/* Enhanced Calendar */}
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => !isDayAvailable(date)}
          className="rounded-xl border shadow-sm"
          components={{
            DayButton: (props) => {
              const date = props.day.date;
              const hasSlots = dayHasAvailableSlots(date);
              const isAvailable = isDayAvailable(date);
              return (
                <div className="relative">
                  <button
                    {...props}
                    className={cn(
                      props.className,
                      "relative"
                    )}
                  >
                    {props.children}
                  </button>
                  {/* Green dot indicator for available days */}
                  {isAvailable && hasSlots && !props.modifiers.selected && (
                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal" />
                  )}
                </div>
              );
            },
          }}
        />
      </div>

      {/* Time Slots by Period */}
      {selectedDate && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-teal" />
            <span className="text-sm font-semibold text-gray-900">
              Time Slots for{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-500 px-1">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-teal/20 border border-teal/40" />
              Available
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-200" />
              Booked
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded gradient-teal" />
              Selected
            </div>
          </div>

          {allDoctorSlots.length > 0 ? (
            ["morning", "afternoon", "evening"].map((period) => {
              const periodSlots = groupedSlots[period as TimePeriod];
              if (periodSlots.length === 0) return null;
              const config = periodConfig[period as TimePeriod];
              const PeriodIcon = config.icon;
              return (
                <div key={period} className="space-y-2">
                  <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", config.bgColor)}>
                    <PeriodIcon size={16} className={config.color} />
                    <span className={cn("text-sm font-semibold", config.color)}>
                      {config.label}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">
                      ({period === "morning" ? "9:00 AM - 12:00 PM" : period === "afternoon" ? "2:00 PM - 5:00 PM" : "5:00 PM - 8:00 PM"})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pl-1">
                    {periodSlots.map((slot) => {
                      const isBooked = bookedForDate.has(slot);
                      const isSelected = selectedTime === slot;
                      const isAvailable = !isBooked;
                      return (
                        <button
                          key={slot}
                          onClick={() => isAvailable && setSelectedTime(slot)}
                          disabled={isBooked}
                          className={cn(
                            "relative py-2.5 px-2 rounded-xl text-xs font-medium transition-all border flex flex-col items-center gap-0.5",
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
                            <span className="text-[9px] text-gray-400">{slotDuration} min</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm">
              <Clock size={28} className="mx-auto mb-2 opacity-50" />
              No slots configured for this doctor. Please select another date.
            </div>
          )}

          {availableSlots.length === 0 && allDoctorSlots.length > 0 && (
            <div className="text-center py-4 text-gray-400 text-sm bg-gray-50 rounded-xl">
              <AlertCircle size={20} className="mx-auto mb-1" />
              All slots are booked on this day. Please try another date.
            </div>
          )}
        </div>
      )}

      {!selectedDate && (
        <div className="text-center py-4 text-gray-400 text-sm">
          Please select a date to view available time slots
        </div>
      )}

      <StepNavigation
        onBack={() => setStep("doctor")}
        nextDisabled={!selectedDate || !selectedTime}
        onNext={() => setStep("patient-info")}
      />
    </div>
  );
}

// ─── Step 4: Patient Info ────────────────────────────────────
function StepPatientInfo() {
  const {
    patientName,
    setPatientName,
    patientEmail,
    setPatientEmail,
    patientPhone,
    setPatientPhone,
    patientReason,
    setPatientReason,
    setStep,
  } = useAppointmentStore();

  const isValid =
    patientName.trim().length >= 2 &&
    patientEmail.includes("@") &&
    patientPhone.trim().length >= 7;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Patient Information</h3>
        <p className="text-gray-500 text-sm">
          Fill in your details to complete the booking
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="John Doe"
            className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
            Reason for Visit
          </label>
          <textarea
            value={patientReason}
            onChange={(e) => setPatientReason(e.target.value)}
            placeholder="Briefly describe your symptoms or reason for consultation..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors resize-none"
          />
        </div>
      </div>

      <StepNavigation
        onBack={() => setStep("schedule")}
        nextDisabled={!isValid}
        onNext={() => setStep("payment")}
      />
    </div>
  );
}

// ─── Step 5: Payment ─────────────────────────────────────────
function StepPayment() {
  const {
    selectedDoctor,
    selectedDate,
    selectedTime,
    patientName,
    patientEmail,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    bookAppointment,
    setStep,
  } = useAppointmentStore();

  const fee = selectedDoctor?.fee || 0;
  const platformFee = 10;
  const total = fee + platformFee;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Payment</h3>
        <p className="text-gray-500 text-sm">
          Review your booking and complete payment
        </p>
      </div>

      {/* Booking Summary */}
      <div className="rounded-xl border border-gray-100 p-5 bg-gray-50/50 space-y-3">
        <h4 className="font-semibold text-gray-900 text-sm">Booking Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Doctor</span>
            <span className="font-medium text-gray-900">{selectedDoctor?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Specialty</span>
            <span className="font-medium text-gray-900">{selectedDoctor?.specialty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium text-gray-900">
              {selectedDate?.toLocaleDateString("en-US", {
                weekday: "short",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="font-medium text-gray-900">{formatTime(selectedTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Patient</span>
            <span className="font-medium text-gray-900">{patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900">{patientEmail}</span>
          </div>
        </div>
        <hr className="border-gray-200" />
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Consultation Fee</span>
            <span className="font-medium">${fee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Platform Fee</span>
            <span className="font-medium">${platformFee}</span>
          </div>
          <div className="flex justify-between text-base pt-1">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-teal">${total}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h4 className="font-semibold text-gray-900 text-sm mb-3">Payment Method</h4>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { key: "card" as const, label: "Credit Card", icon: CreditCard },
              { key: "upi" as const, label: "UPI", icon: Lock },
              { key: "insurance" as const, label: "Insurance", icon: ShieldCheck },
            ] as const
          ).map((method) => {
            const isSelected = paymentMethod === method.key;
            return (
              <button
                key={method.key}
                onClick={() => setPaymentMethod(method.key)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  isSelected
                    ? "border-teal bg-teal/5"
                    : "border-gray-100 hover:border-teal/30"
                )}
              >
                <method.icon
                  size={20}
                  className={isSelected ? "text-teal" : "text-gray-400"}
                />
                <span
                  className={cn(
                    "text-xs font-semibold",
                    isSelected ? "text-teal" : "text-gray-500"
                  )}
                >
                  {method.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-teal/5 border border-teal/10">
        <Lock size={16} className="text-teal shrink-0" />
        <span className="text-xs text-teal-dark">
          Your payment information is encrypted and secure. We never store your card details.
        </span>
      </div>

      <StepNavigation
        onBack={() => setStep("patient-info")}
        nextLabel={isProcessing ? "Processing..." : `Pay $${total}`}
        nextDisabled={isProcessing}
        onNext={bookAppointment}
        isNextLoading={isProcessing}
      />
    </div>
  );
}

// ─── Step 6: Confirmation ────────────────────────────────────
function StepConfirmation() {
  const { currentBooking, selectedDoctor, closeModal } = useAppointmentStore();

  if (!currentBooking) return null;

  const bookingDate = new Date(currentBooking.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6 text-center">
      {/* Success Animation */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full gradient-teal flex items-center justify-center shadow-premium">
          <CheckCircle2 size={40} className="text-white" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Appointment Confirmed!
        </h3>
        <p className="text-gray-500 text-sm">
          Your appointment has been booked successfully. A confirmation email has
          been sent to {currentBooking.patientEmail}.
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="rounded-xl border border-teal/20 bg-mint-light p-5 text-left space-y-3">
        <div className="flex items-center gap-3 mb-2">
          {selectedDoctor && (
            <img
              src={selectedDoctor.image}
              alt=""
              className="w-12 h-12 rounded-xl"
            />
          )}
          <div>
            <div className="font-bold text-gray-900">{selectedDoctor?.name}</div>
            <div className="text-xs text-gray-500">{selectedDoctor?.specialty}</div>
          </div>
        </div>

        <hr className="border-teal/10" />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-teal" />
            <div>
              <div className="text-xs text-gray-400">Date</div>
              <div className="font-medium text-gray-900">{bookingDate}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-teal" />
            <div>
              <div className="text-xs text-gray-400">Time</div>
              <div className="font-medium text-gray-900">{formatTime(currentBooking.time)}</div>
            </div>
          </div>
        </div>

        {/* Meeting Link */}
        <div className="mt-3 p-3 rounded-xl bg-teal/10 border border-teal/20">
          <div className="flex items-center gap-2 mb-1.5">
            <Video size={16} className="text-teal" />
            <span className="text-sm font-semibold text-teal-dark">Video Consultation Link</span>
          </div>
          <p className="text-xs text-teal-dark/70 break-all">
            {currentBooking.meetingLink}
          </p>
        </div>
      </div>

      {/* Booking ID */}
      <div className="text-xs text-gray-400">
        Booking ID: <span className="font-mono font-semibold">{currentBooking.id}</span>
      </div>

      {/* Next Steps */}
      <div className="rounded-xl border border-gray-100 p-4 text-left">
        <h4 className="text-sm font-bold text-gray-900 mb-3">What happens next?</h4>
        <div className="space-y-2.5">
          {[
            { icon: CalendarPlus, text: "You'll receive an email & SMS confirmation" },
            { icon: Video, text: "Use the meeting link at the scheduled time" },
            { icon: Stethoscope, text: "Consult with your doctor online or in-person" },
            { icon: FileText, text: "Receive your digital prescription after consultation" },
            { icon: FlaskConical, text: "Lab assignments if tests are recommended" },
            { icon: CalendarDays, text: "Schedule follow-up if needed" },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                <step.icon size={14} className="text-teal" />
              </div>
              <span className="text-sm text-gray-600">{step.text}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={closeModal}
        className="gradient-teal text-white rounded-xl px-8 h-11 font-semibold shadow-premium hover:opacity-90 transition-opacity w-full"
      >
        Done
      </Button>
    </div>
  );
}

// ─── My Appointments Tab ─────────────────────────────────────
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
    <div className="p-6 space-y-4">
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

      {/* Filter pills */}
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

      {/* Appointments list */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <CalendarDays size={48} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium text-gray-500">No appointments found</p>
          <p className="text-sm mt-1">
            {statusFilter !== "all"
              ? "Try a different filter or book a new appointment"
              : "Click 'Book Appointment' to schedule your first visit"}
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
                  {/* Doctor avatar */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal/20 to-teal-light/20 flex items-center justify-center shrink-0">
                    <UserRound size={20} className="text-teal" />
                  </div>

                  {/* Info */}
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

                  {/* Actions */}
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

                {/* Meeting link for confirmed */}
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

// ─── Edit Appointment Flow ───────────────────────────────────
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

  // Get available slots for the doctor on the selected date
  const availableSlots = appointment.doctorId && dateStr
    ? getAvailableTimeSlots(appointment.doctorId, dateStr)
    : [];

  // All doctor slots (including currently booked ones, but exclude the current appointment's slot)
  const allDoctorSlots = doctor?.availableSlots || [];

  // Booked slots for this date, excluding the current appointment being edited
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

  // Group slots by period for edit view
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
    // Check double-booking before saving
    const dateForCheck = editDate.toISOString().split("T")[0];
    const isAvailable = useAppointmentStore.getState().isSlotAvailable(appointment.doctorId, dateForCheck, editTime);
    // Also allow keeping the same slot
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
    <div className="p-6 space-y-5">
      {/* Header */}
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

      {/* Current appointment info */}
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

      {/* Date picker */}
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

      {/* Time slots */}
      {editDate && (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 block">New Time Slot</label>

          {allDoctorSlots.length > 0 ? (
            ["morning", "afternoon", "evening"].map((period) => {
              const periodSlots = groupedSlots[period as TimePeriod];
              if (periodSlots.length === 0) return null;
              const config = periodConfig[period as TimePeriod];
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

      {/* Reason */}
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

      {/* Action Buttons */}
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

// ─── Navigation Component ────────────────────────────────────
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
    <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-gray-100 mt-3 -mx-6 px-6">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="rounded-xl px-6 h-11 font-semibold border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            Back
          </Button>
        )}
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          className={cn(
            "gradient-teal text-white rounded-xl px-6 h-11 font-semibold shadow-premium hover:opacity-90 transition-opacity",
            onBack ? "flex-1" : "w-full"
          )}
        >
          {isNextLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              {nextLabel}
              <ArrowRight size={16} className="ml-1.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
