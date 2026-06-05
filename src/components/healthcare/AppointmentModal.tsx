"use client";

import React from "react";
import {
  useAppointmentStore,
  specialties,
  doctors,
  formatTime,
  type AppointmentStep,
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Step Config ─────────────────────────────────────────────
const steps: { key: AppointmentStep; label: string; icon: React.ElementType }[] = [
  { key: "specialty", label: "Specialty", icon: Stethoscope },
  { key: "doctor", label: "Doctor", icon: UserRound },
  { key: "schedule", label: "Schedule", icon: CalendarDays },
  { key: "patient-info", label: "Your Info", icon: FileText },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "confirmation", label: "Confirmed", icon: CheckCircle2 },
];

// ─── Main Modal ──────────────────────────────────────────────
export default function AppointmentModal() {
  const { isOpen, closeModal, currentStep } = useAppointmentStore();
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent
        className="sm:max-w-[640px] max-h-[90vh] p-0 gap-0 rounded-2xl overflow-hidden flex flex-col"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header with progress */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 rounded-t-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Book Appointment
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Follow the steps to schedule your consultation
            </DialogDescription>
          </DialogHeader>

          {/* Step Progress Bar */}
          <div className="flex items-center gap-1 mt-4">
            {steps.map((step, i) => (
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
                {i < steps.length - 1 && (
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
        </div>

        {/* Step Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {currentStep === "specialty" && <StepSpecialty />}
          {currentStep === "doctor" && <StepDoctor />}
          {currentStep === "schedule" && <StepSchedule />}
          {currentStep === "patient-info" && <StepPatientInfo />}
          {currentStep === "payment" && <StepPayment />}
          {currentStep === "confirmation" && <StepConfirmation />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Step 1: Specialty ───────────────────────────────────────
function StepSpecialty() {
  const { selectedSpecialty, setSelectedSpecialty, setStep } = useAppointmentStore();

  const specialtyIcons: Record<string, React.ElementType> = {
    Cardiology: Stethoscope,
    Neurology: UserRound,
    Orthopedics: ShieldCheck,
    Dermatology: UserRound,
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
          return (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                isSelected
                  ? "border-teal bg-teal/5 shadow-premium"
                  : "border-gray-100 hover:border-teal/30 hover:bg-mint-light/50"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  isSelected ? "gradient-teal" : "bg-gray-100"
                )}
              >
                <Icon size={18} className={isSelected ? "text-white" : "text-gray-500"} />
              </div>
              <span
                className={cn(
                  "text-sm font-semibold",
                  isSelected ? "text-teal" : "text-gray-700"
                )}
              >
                {spec}
              </span>
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
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
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

// ─── Step 3: Schedule ────────────────────────────────────────
function StepSchedule() {
  const {
    selectedDoctor,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    setStep,
    getAvailableTimeSlots,
  } = useAppointmentStore();

  const dateStr = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";
  const availableSlots = selectedDoctor && dateStr
    ? getAvailableTimeSlots(selectedDoctor.id, dateStr)
    : [];
  const isDayAvailable = (date: Date) => {
    if (!selectedDoctor) return false;
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && selectedDoctor.availableDays.includes(day);
  };

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
          <div>
            <div className="font-semibold text-sm text-gray-900">{selectedDoctor.name}</div>
            <div className="text-xs text-gray-500">{selectedDoctor.specialty} · ${selectedDoctor.fee}</div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => !isDayAvailable(date)}
          className="rounded-xl border shadow-sm"
          classNames={{
            day: "relative w-full h-full p-0 text-center aspect-square select-none",
            disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
          }}
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-teal" />
            <span className="text-sm font-semibold text-gray-900">
              Available Slots for{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={cn(
                      "py-2.5 px-3 rounded-xl text-sm font-medium transition-all border",
                      isSelected
                        ? "gradient-teal text-white border-teal shadow-premium"
                        : "border-gray-200 text-gray-700 hover:border-teal/40 hover:bg-mint-light"
                    )}
                  >
                    {formatTime(slot)}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm">
              <Clock size={28} className="mx-auto mb-2 opacity-50" />
              No available slots on this day. Please select another date.
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
        <div className="w-20 h-20 rounded-full gradient-teal flex items-center justify-center shadow-premium animate-bounce-once">
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
