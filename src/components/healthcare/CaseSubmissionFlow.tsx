"use client";

import React, { useState } from "react";
import { useSpecialtyStore } from "@/store/specialty-store";
import { useCaseStore, type CaseAnswer } from "@/store/case-store";
import { doctors, formatTime, defaultTimeSlots } from "@/store/appointment-store";
import { usePatientStore } from "@/store/patient-store";
import DynamicQuestionnaire from "./DynamicQuestionnaire";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Upload, CalendarDays, Clock, CreditCard,
  User, FileText, Stethoscope, AlertCircle, Package, Smartphone, Building, Truck,
  Star, Users,
} from "lucide-react";

type FlowStep = "specialty" | "questionnaire" | "reports" | "schedule" | "payment" | "registration" | "confirmation";

interface Props {
  onBack?: () => void;
  onDone?: () => void;
}

export default function CaseSubmissionFlow({ onBack, onDone }: Props) {
  const { specialties } = useSpecialtyStore();
  const { createSubmission } = useCaseStore();
  const { addPatient, patients } = usePatientStore();

  const [step, setStep] = useState<FlowStep>("specialty");
  const [answers, setAnswers] = useState<CaseAnswer[]>([]);
  const [reportIds, setReportIds] = useState<string[]>([]);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadedReports, setUploadedReports] = useState<string[]>([]);
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptDoctor, setApptDoctor] = useState<typeof doctors[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "cod">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPatientId, setGeneratedPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientMobile, setPatientMobile] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientGender, setPatientGender] = useState<"male" | "female" | "other">("male");
  const [patientDob, setPatientDob] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [patientCountry, setPatientCountry] = useState("");
  const [submissionResult, setSubmissionResult] = useState<{ caseId: string; patientId: string } | null>(null);

  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);

  const selectedSpec = selectedSpecId ? specialties.find((s) => s.id === selectedSpecId) : null;

  const handleQuestionnaireComplete = (qs: CaseAnswer[]) => {
    setAnswers(qs);
    setStep("reports");
  };

  const handleAddReport = () => {
    if (!uploadFileName.trim()) return;
    setUploadedReports((prev) => [...prev, uploadFileName.trim()]);
    setUploadFileName("");
  };

  const handleRemoveReport = (name: string) => {
    setUploadedReports((prev) => prev.filter((r) => r !== name));
  };

  const handleRegisterPatient = () => {
    if (!patientName.trim() || !patientMobile.trim() || !patientEmail.includes("@")) return;
    addPatient({
      fullName: patientName.trim(),
      mobileNumber: patientMobile.trim(),
      email: patientEmail.trim(),
      gender: patientGender,
      dateOfBirth: patientDob,
      bloodGroup: "O+",
      address: patientAddress,
      country: patientCountry,
      state: "", district: "", city: "", pinCode: "",
      latitude: "", longitude: "",
      diseaseDetails: selectedSpec?.description || "",
      symptoms: "", complaint: "", medicalHistory: "", allergies: "", currentMedications: "",
      emergencyContactName: "", emergencyContactNumber: "", emergencyRelationship: "",
    });
    const newPatient = patients[patients.length - 1];
    if (newPatient) {
      const pId = `PAT-${1000 + patients.length}`;
      setGeneratedPatientId(pId);
      return newPatient;
    }
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newPatient = handleRegisterPatient();
      const patientId = newPatient?.id || `PAT-${1000 + patients.length + 1}`;

      const sub = createSubmission({
        patientId,
        specialtyId: selectedSpecId,
        specialtyName: selectedSpec?.name || "",
        answers,
        reportIds: uploadedReports,
        appointmentDate: apptDate,
        appointmentTime: apptTime,
      });

      // Update payment status and case status after payment
      useCaseStore.getState().updateSubmission(sub.id, {
        paymentStatus: "paid",
        status: "payment_completed",
      });

      setSubmissionResult({ caseId: sub.caseId, patientId });
      setGeneratedPatientId(patientId);
      setIsProcessing(false);
      setStep("confirmation");
    }, 2000);
  };

  const filteredDoctors = selectedSpec ? doctors.filter((d) => d.specialty === selectedSpec.name) : [];

  return (
    <div className="p-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {(["specialty", "questionnaire", "reports", "schedule", "payment", "registration", "confirmation"] as FlowStep[]).map((s, i, arr) => {
          const stepIndex = ["specialty", "questionnaire", "reports", "schedule", "payment", "registration", "confirmation"].indexOf(step);
          const currentIdx = ["specialty", "questionnaire", "reports", "schedule", "payment", "registration", "confirmation"].indexOf(s);
          return (
            <React.Fragment key={s}>
              {i > 0 && <div className={`w-6 h-0.5 ${currentIdx <= stepIndex ? "bg-[#1e3a5f]" : "bg-gray-200"}`} />}
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                currentIdx === stepIndex ? "bg-[#1e3a5f] text-white" : currentIdx < stepIndex ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
              }`}>
                {currentIdx < stepIndex ? <CheckCircle2 size={12} /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{s === "questionnaire" ? "Questions" : s.charAt(0).toUpperCase() + s.slice(1)}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Step: Specialty Selection */}
      {step === "specialty" && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Select Specialty</h2>
          <p className="text-gray-500 text-sm mb-6">Choose your health concern area to begin your case submission</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {specialties.filter((s) => s.isActive).map((spec) => (
              <button
                key={spec.id}
                onClick={() => { setSelectedSpecId(spec.id); setStep("questionnaire"); }}
                className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-[#1e3a5f]/30 hover:bg-blue-50/50 transition-all text-left group"
              >
                <span className="text-3xl">{spec.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{spec.name}</h3>
                  <p className="text-xs text-gray-400">{spec.description} &middot; {spec.questions.length} questions</p>
                </div>
              </button>
            ))}
          </div>
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
              <ChevronLeft size={16} /> Back
            </button>
          )}
        </div>
      )}

      {/* Step: Questionnaire */}
      {step === "questionnaire" && selectedSpec && (
        <DynamicQuestionnaire
          specialty={selectedSpec}
          onComplete={handleQuestionnaireComplete}
          onBack={() => setStep("specialty")}
        />
      )}

      {/* Step: Reports Upload */}
      {step === "reports" && (
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Reports</h2>
          <p className="text-gray-500 text-sm mb-6">Upload your medical reports (optional, you can upload multiple)</p>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <input value={uploadFileName} onChange={(e) => setUploadFileName(e.target.value)} placeholder="e.g., Blood_Test_Report.pdf" className="flex-1 h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                onKeyDown={(e) => e.key === "Enter" && handleAddReport()} />
              <button onClick={handleAddReport} disabled={!uploadFileName.trim()} className="h-10 px-4 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] disabled:bg-gray-200 disabled:text-gray-400">
                <Upload size={14} className="inline mr-1" /> Add
              </button>
            </div>

            {uploadedReports.length > 0 && (
              <div className="space-y-2">
                {uploadedReports.map((name) => (
                  <div key={name} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
                    <FileText size={14} className="text-blue-500" />
                    <span className="flex-1 text-sm text-gray-700 truncate">{name}</span>
                    <button onClick={() => handleRemoveReport(name)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setStep("questionnaire")} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">
              <ChevronLeft size={16} className="inline mr-1" /> Back
            </button>
            <button onClick={() => setStep("schedule")} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-md">
              Continue <ChevronRight size={16} className="inline ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Step: Schedule */}
      {step === "schedule" && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Schedule Appointment</h2>
          <p className="text-gray-500 text-sm mb-6">Pick your preferred doctor, date, and time slot</p>

          {/* Doctor Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4">
              <Users size={12} />
              Select Doctor
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Choose Your Doctor</h3>
            <p className="text-sm text-gray-500 mb-4">Select a doctor or pick date directly</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredDoctors.map((doc) => {
                const isSelected = apptDoctor?.id === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setApptDoctor(doc)}
                    className={`relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left bg-white ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/20 shadow-sm"
                        : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm">{doc.name}</div>
                      <div className="text-xs text-gray-400">{doc.specialty}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          {doc.rating}
                        </span>
                        <span className="text-xs text-gray-400">{doc.experience}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-emerald-600">₹{doc.fee}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredDoctors.length > 0 && (
              <button
                onClick={() => setApptDoctor(null)}
                className={`w-full mt-3 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed transition-all text-sm font-medium ${
                  !apptDoctor
                    ? "border-emerald-400 bg-emerald-50/40 text-emerald-700"
                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                }`}
              >
                {!apptDoctor ? <CheckCircle2 size={16} className="text-emerald-500" /> : <ChevronRight size={16} />}
                {!apptDoctor ? "I'll choose date & time directly" : "Skip — choose date directly"}
              </button>
            )}
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-4">
              <CalendarDays size={12} />
              Date & Time
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Select Date & Time</h3>
            <p className="text-sm text-gray-500 mb-4">Pick a convenient date and time slot</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Select Date *</label>
                <input type="date" value={apptDate} onChange={(e) => setApptDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                  className="w-full h-11 rounded-xl bg-gray-50 border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Select Time Slot *</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {defaultTimeSlots.map((slot) => {
                    const isSelected = apptTime === slot;
                    const queueLength = apptDoctor && apptDate
                      ? useCaseStore.getState().submissions.filter(
                          (s) => s.specialtyName === selectedSpec?.name && s.appointmentDate === apptDate && s.appointmentTime <= slot
                        ).length
                      : 0;
                    return (
                      <button
                        key={slot}
                        onClick={() => setApptTime(slot)}
                        disabled={!apptDate}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/40 shadow-sm"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                        } ${!apptDate ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span className={`text-sm font-semibold ${isSelected ? "text-emerald-800" : "text-gray-700"}`}>
                          {formatTime(slot)}
                        </span>
                        {queueLength > 0 ? (
                          <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            ~{queueLength * 20}min wait ({queueLength} ahead)
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-medium">Available</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setStep("reports")} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">
              <ChevronLeft size={16} className="inline mr-1" /> Back
            </button>
            <button onClick={() => setStep("payment")} disabled={!apptDate || !apptTime} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] disabled:bg-gray-200 disabled:text-gray-400 shadow-md">
              Continue <ChevronRight size={16} className="inline ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Step: Payment */}
      {step === "payment" && (
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment</h2>
          <p className="text-gray-500 text-sm mb-6">Complete payment for your case submission</p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Consultation Fee ({selectedSpec?.name})</span>
              <span className="text-2xl font-bold text-[#1e3a5f]">$50.00</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {([
              { method: "card" as const, icon: CreditCard, title: "Credit / Debit Card" },
              { method: "upi" as const, icon: Smartphone, title: "UPI Payment" },
              { method: "netbanking" as const, icon: Building, title: "Net Banking" },
              { method: "cod" as const, icon: Truck, title: "Pay at Clinic" },
            ]).map(({ method, icon: Icon, title }) => (
              <button key={method} onClick={() => setPaymentMethod(method)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === method ? "border-[#1e3a5f] bg-blue-50/50" : "border-gray-200 bg-white hover:border-gray-300"
                }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === method ? "bg-[#1e3a5f] text-white" : "bg-gray-100 text-gray-500"}`}>
                  <Icon size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-900">{title}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setStep("schedule")} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">Back</button>
            <button onClick={() => setStep("registration")} disabled={isProcessing} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] disabled:bg-gray-200 disabled:text-gray-400 shadow-md">
              Pay $50.00 <ChevronRight size={16} className="inline ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Step: Registration */}
      {step === "registration" && (
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Patient Registration</h2>
          <p className="text-gray-500 text-sm mb-6">Complete your registration to generate your Patient ID</p>

          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Full Name *</label>
                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter your name" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Mobile *</label>
                <input type="tel" value={patientMobile} onChange={(e) => setPatientMobile(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Email *</label>
                <input type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} placeholder="your@email.com" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Gender</label>
                <select value={patientGender} onChange={(e) => setPatientGender(e.target.value as any)} className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm">
                  <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Date of Birth</label>
                <input type="date" value={patientDob} onChange={(e) => setPatientDob(e.target.value)} className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Address</label>
                <input type="text" value={patientAddress} onChange={(e) => setPatientAddress(e.target.value)} placeholder="Your address" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Country</label>
                <input type="text" value={patientCountry} onChange={(e) => setPatientCountry(e.target.value)} placeholder="Your country" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button onClick={() => setStep("payment")} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">Back</button>
            <button onClick={handleSubmit} disabled={!patientName.trim() || !patientMobile.trim() || !patientEmail.includes("@") || isProcessing}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                patientName.trim() && patientMobile.trim() && patientEmail.includes("@") && !isProcessing
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
              {isProcessing ? "Processing..." : "Submit & Generate Patient ID"}
            </button>
          </div>
        </div>
      )}

      {/* Step: Confirmation */}
      {step === "confirmation" && (
        <div className="max-w-lg mx-auto text-center py-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Case Submitted Successfully!</h2>
          <p className="text-gray-500 text-sm mb-6">Your case has been submitted. A doctor will be assigned shortly.</p>

          <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-3 text-left">
            {submissionResult && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Case ID</span>
                <span className="text-sm font-bold text-[#1e3a5f] font-mono">{submissionResult.caseId}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Patient ID</span>
              <span className="text-sm font-bold text-[#1e3a5f] font-mono">{generatedPatientId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Specialty</span>
              <span className="text-sm font-semibold text-gray-900">{selectedSpec?.name}</span>
            </div>
            {apptDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Appointment</span>
                <span className="text-sm font-semibold text-gray-900">{apptDate} at {apptTime}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Payment Completed</span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <p>Your Patient ID has been generated. Please save it for future access.</p>
            <p>A doctor will be assigned to your case within 24 hours.</p>
          </div>

          <div className="flex items-center gap-3 justify-center">
            {onDone && (
              <button onClick={onDone} className="px-6 py-3 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] shadow-lg">
                View My Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
