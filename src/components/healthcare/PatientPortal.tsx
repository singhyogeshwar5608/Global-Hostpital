"use client";

import React, { useState } from "react";
import { usePatientStore, type PatientReport } from "@/store/patient-store";
import { usePackageStore } from "@/store/package-store";
import {
  User,
  MapPin,
  Heart,
  Phone,
  Search,
  Upload,
  Trash2,
  Download,
  Share2,
  FileText,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Smartphone,
  Building,
  Truck,
  X,
  Package,
  CalendarDays,
  Video,
  Clock,
  Users,
  Plus,
  Minus,
} from "lucide-react";

type PortalStep = "landing" | "register" | "profile" | "reports" | "upload" | "packages" | "checkout" | "payment" | "confirmation";

const reportTypeLabels: Record<string, string> = {
  blood_test: "Blood Test",
  xray: "X-Ray",
  mri: "MRI",
  ct_scan: "CT Scan",
  ecg: "ECG",
  ultrasound: "Ultrasound",
  prescription: "Previous Prescription",
  medical_doc: "Medical Document",
  insurance: "Insurance Document",
  other: "Other Report",
};

export default function PatientPortal() {
  const {
    patients,
    addPatient,
    addReport,
    deleteReport,
    toggleShareWithDoctor,
    isPortalOpen,
    closePortal,
    bookings,
    addBooking,
    maxFileSize,
  } = usePatientStore();
  const { packages: healthPackages } = usePackageStore();

  const [step, setStep] = useState<PortalStep>("landing");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Registration form
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [diseaseDetails, setDiseaseDetails] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [complaint, setComplaint] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");

  // Upload form
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileType, setUploadFileType] = useState<PatientReport["fileType"]>("blood_test");
  const [uploadFileFormat, setUploadFileFormat] = useState<PatientReport["fileFormat"]>("pdf");

  // Booking form
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "cod">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const selectedPatient = selectedPatientId ? patients.find((p) => p.id === selectedPatientId) : null;
  const selectedPkg = selectedPackageId ? healthPackages.find((p) => p.id === selectedPackageId) : null;

  const handleRegister = () => {
    if (!fullName.trim() || !mobileNumber.trim() || !email.includes("@")) return;
    addPatient({
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      gender,
      dateOfBirth,
      bloodGroup,
      address,
      country,
      state,
      district,
      city,
      pinCode,
      latitude,
      longitude,
      diseaseDetails,
      symptoms,
      complaint,
      medicalHistory,
      allergies,
      currentMedications,
      emergencyContactName,
      emergencyContactNumber,
      emergencyRelationship,
    });
    // Find the newly added patient
    const newPatient = patients[patients.length - 1];
    if (newPatient) {
      setSelectedPatientId(newPatient.id);
    }
    setStep("profile");
  };

  const handleUploadReport = () => {
    if (!selectedPatientId || !uploadFileName.trim()) return;
    addReport(selectedPatientId, {
      fileName: uploadFileName.trim(),
      fileType: uploadFileType,
      fileFormat: uploadFileFormat,
      fileSize: Math.floor(Math.random() * 3000) + 100,
      fileUrl: `/reports/${uploadFileName.trim().replace(/\s+/g, "_").toLowerCase()}.${uploadFileFormat}`,
    });
    setUploadFileName("");
    setUploadFileType("blood_test");
    setUploadFileFormat("pdf");
    setStep("reports");
  };

  const handleBookPackage = () => {
    if (!selectedPatient || !selectedPkg) return;
    setIsProcessing(true);
    setTimeout(() => {
      const booking = addBooking({
        patientId: selectedPatient.id,
        patientName: selectedPatient.fullName,
        patientEmail: selectedPatient.email,
        patientPhone: selectedPatient.mobileNumber,
        packageId: selectedPkg.id,
        packageName: selectedPkg.name,
        packagePrice: selectedPkg.price,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        bookingStatus: paymentMethod === "cod" ? "registered" : "payment_done",
        meetingLink: "",
        doctorId: "",
        doctorName: "",
        appointmentDate: "",
        notes: "",
      });
      setBookingId(booking.id);
      setIsProcessing(false);
      setStep("confirmation");
    }, 2000);
  };

  const resetPortal = () => {
    setStep("landing");
    setSelectedPatientId(null);
    setFullName(""); setMobileNumber(""); setEmail(""); setGender("male");
    setDateOfBirth(""); setBloodGroup("O+"); setAddress(""); setCountry("");
    setState(""); setDistrict(""); setCity(""); setPinCode(""); setLatitude("");
    setLongitude(""); setDiseaseDetails(""); setSymptoms(""); setComplaint("");
    setMedicalHistory(""); setAllergies(""); setCurrentMedications("");
    setEmergencyContactName(""); setEmergencyContactNumber(""); setEmergencyRelationship("");
    setSelectedPackageId(null); setPaymentMethod("card"); setBookingId("");
  };

  const handleClose = () => {
    resetPortal();
    closePortal();
  };

  if (!isPortalOpen) return null;

  const activePackages = healthPackages.filter((p) => p.isActive);

  return (
    <div className="fixed inset-0 z-[90] bg-white flex flex-col">
      {/* Header */}
      <header className="h-16 bg-[#1e3a5f] text-white flex items-center justify-between px-6 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={handleClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Users size={22} />
            <div>
              <h1 className="text-sm font-bold">Patient Portal</h1>
              <p className="text-[10px] text-white/60">Global Integrative Clinic</p>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="hidden md:flex items-center gap-1">
          {["landing", "register", "reports", "packages", "payment", "confirmation"].filter((s) => {
            if (s === "register" && selectedPatientId) return false;
            return true;
          }).map((s, i, arr) => (
            <React.Fragment key={s}>
              {i > 0 && <ChevronRight size={12} className="text-white/30" />}
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${step === s ? "bg-white/20 text-white" : "text-white/40"}`}>
                {s === "landing" ? "Home" : s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className="w-10" /> {/* spacer */}
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* ─── LANDING STEP ─── */}
        {step === "landing" && (
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Patient Portal</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">Register as a patient, upload your medical reports, book health packages, and consult with doctors online.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <button
                onClick={() => setStep("register")}
                className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                  <User size={18} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Register</h3>
                <p className="text-xs text-gray-400">Create your patient profile</p>
              </button>
              <button
                onClick={() => {
                  if (selectedPatientId) {
                    setStep("reports");
                  } else {
                    // Show patient picker
                    setStep("landing");
                  }
                }}
                className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-md hover:border-purple-200 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform">
                  <FileText size={18} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Upload Reports</h3>
                <p className="text-xs text-gray-400">Upload medical reports</p>
              </button>
              <button
                onClick={() => setStep("packages")}
                className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-md hover:border-green-200 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-3 group-hover:scale-110 transition-transform">
                  <Package size={18} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Book Package</h3>
                <p className="text-xs text-gray-400">Browse health packages</p>
              </button>
              <button
                onClick={() => {
                  if (selectedPatientId) setStep("profile");
                }}
                className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-md hover:border-orange-200 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                  <CalendarDays size={18} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">My Profile</h3>
                <p className="text-xs text-gray-400">View your profile & bookings</p>
              </button>
            </div>

            {/* Select Patient (for existing) */}
            {!selectedPatientId && patients.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Select Existing Patient</h3>
                <div className="relative mb-3">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or ID..."
                    className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                  />
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {patients
                    .filter((p) => p.isActive && (
                      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.id.toLowerCase().includes(searchQuery.toLowerCase())
                    ))
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedPatientId(p.id); setSearchQuery(""); }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {p.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">{p.fullName}</div>
                          <div className="text-xs text-gray-400">{p.id} | {p.email}</div>
                        </div>
                        <ChevronRight size={14} className="text-gray-300 ml-auto shrink-0" />
                      </button>
                    ))}
                </div>
              </div>
            )}

            {selectedPatientId && selectedPatient && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {selectedPatient.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{selectedPatient.fullName}</div>
                    <div className="text-xs text-gray-500">{selectedPatient.id} | {selectedPatient.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStep("profile")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1e3a5f] bg-white border border-blue-200 hover:bg-blue-50"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => { setSelectedPatientId(null); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"
                  >
                    Switch
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── REGISTER STEP ─── */}
        {step === "register" && (
          <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Patient Registration</h2>

            {/* Basic Information */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-5">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><User size={14} /></div>
                Basic Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Full Name *</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Mobile Number *</label>
                  <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Email *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20">
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Date of Birth</label>
                  <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Blood Group</label>
                  <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20">
                    {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (<option key={bg} value={bg}>{bg}</option>))}
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-5">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-green-600"><MapPin size={14} /></div>
                Address Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
                </div>
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Country</label><input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" /></div>
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">State</label><input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" /></div>
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">District</label><input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="District" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" /></div>
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">City</label><input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" /></div>
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Pin Code</label><input type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="Pin Code" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" /></div>
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Latitude</label><input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g., 40.7128" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" /></div>
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Longitude</label><input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g., -74.0060" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" /></div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-5">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600"><Heart size={14} /></div>
                Medical Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2"><label className="text-xs font-semibold text-gray-700 mb-1 block">Disease Details</label><input type="text" value={diseaseDetails} onChange={(e) => setDiseaseDetails(e.target.value)} placeholder="Primary disease or condition" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" /></div>
                <div className="md:col-span-2"><label className="text-xs font-semibold text-gray-700 mb-1 block">Symptoms</label><textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="List current symptoms" rows={2} className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 resize-none" /></div>
                <div className="md:col-span-2"><label className="text-xs font-semibold text-gray-700 mb-1 block">Complaint</label><textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="Your chief complaint" rows={2} className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 resize-none" /></div>
                <div className="md:col-span-2"><label className="text-xs font-semibold text-gray-700 mb-1 block">Medical History</label><textarea value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} placeholder="Previous diagnoses, surgeries" rows={2} className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 resize-none" /></div>
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Allergies</label><input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Drug/food allergies" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" /></div>
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Current Medications</label><input type="text" value={currentMedications} onChange={(e) => setCurrentMedications(e.target.value)} placeholder="Current medications" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" /></div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-5">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600"><Phone size={14} /></div>
                Emergency Contact
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Name</label><input type="text" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} placeholder="Contact name" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" /></div>
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Number</label><input type="tel" value={emergencyContactNumber} onChange={(e) => setEmergencyContactNumber(e.target.value)} placeholder="Contact number" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" /></div>
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Relationship</label><select value={emergencyRelationship} onChange={(e) => setEmergencyRelationship(e.target.value)} className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"><option value="">Select</option><option value="Spouse">Spouse</option><option value="Parent">Parent</option><option value="Child">Child</option><option value="Sibling">Sibling</option><option value="Friend">Friend</option><option value="Other">Other</option></select></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setStep("landing")} className="px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">
                <ChevronLeft size={16} className="inline mr-1" /> Back
              </button>
              <button
                onClick={handleRegister}
                disabled={!fullName.trim() || !mobileNumber.trim() || !email.includes("@")}
                className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  fullName.trim() && mobileNumber.trim() && email.includes("@")
                    ? "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Register Now
              </button>
            </div>
          </div>
        )}

        {/* ─── PROFILE STEP ─── */}
        {step === "profile" && selectedPatient && (
          <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {selectedPatient.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedPatient.fullName}</h2>
                <p className="text-sm text-gray-400 font-mono">{selectedPatient.id}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 mt-1">Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Basic Information</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Gender</span><span className="text-gray-900 font-medium capitalize">{selectedPatient.gender}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">DOB</span><span className="text-gray-900 font-medium">{selectedPatient.dateOfBirth || "N/A"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Blood Group</span><span className="text-red-600 font-bold">{selectedPatient.bloodGroup}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Contact</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2"><Mail size={12} className="text-gray-400" /><span className="text-gray-900">{selectedPatient.email}</span></div>
                  <div className="flex items-center gap-2"><Phone size={12} className="text-gray-400" /><span className="text-gray-900">{selectedPatient.mobileNumber}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Medical Info</h4>
                <div className="space-y-1.5 text-sm">
                  <div><span className="text-gray-500 text-xs">Disease:</span> <span className="text-gray-900">{selectedPatient.diseaseDetails || "N/A"}</span></div>
                  <div><span className="text-gray-500 text-xs">Allergies:</span> <span className="text-red-600 font-medium">{selectedPatient.allergies || "None"}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Emergency Contact</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="text-gray-900 font-medium">{selectedPatient.emergencyContactName || "N/A"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="text-gray-900">{selectedPatient.emergencyContactNumber || "N/A"}</span></div>
                </div>
              </div>
            </div>

            {/* My Bookings */}
            {selectedPatientId && (
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-5">
                <h4 className="text-sm font-bold text-gray-900 mb-3">My Bookings</h4>
                {bookings.filter((b) => b.patientId === selectedPatientId).length > 0 ? (
                  <div className="space-y-3">
                    {bookings.filter((b) => b.patientId === selectedPatientId).map((b) => (
                      <div key={b.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                          <Package size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900">{b.packageName}</div>
                          <div className="text-xs text-gray-400">{b.id} | {new Date(b.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-[#1e3a5f]">${b.packagePrice.toFixed(2)}</div>
                          <div className={`text-[10px] font-semibold ${b.bookingStatus === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                            {b.bookingStatus.replace(/_/g, " ")}
                          </div>
                        </div>
                        {b.meetingLink && (
                          <a href={b.meetingLink} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors shrink-0">
                            <Video size={14} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No bookings yet.</p>
                )}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button onClick={() => setStep("landing")} className="px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">
                <ChevronLeft size={16} className="inline mr-1" /> Back
              </button>
              <button onClick={() => setStep("reports")} className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-[#1e3a5f] bg-blue-50 hover:bg-blue-100">
                <FileText size={14} className="inline mr-1" /> My Reports
              </button>
              <button onClick={() => setStep("packages")} className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg">
                <Package size={14} className="inline mr-1" /> Book Package
              </button>
            </div>
          </div>
        )}

        {/* ─── REPORTS STEP ─── */}
        {step === "reports" && selectedPatient && (
          <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Reports</h2>
              <button
                onClick={() => setStep("upload")}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-md"
              >
                <Upload size={14} /> Upload Report
              </button>
            </div>

            {selectedPatient.reports.length > 0 ? (
              <div className="space-y-3 mb-6">
                {selectedPatient.reports.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{r.fileName}</h4>
                      <div className="text-xs text-gray-400">{reportTypeLabels[r.fileType]} | {r.fileFormat.toUpperCase()} | {r.fileSize}KB</div>
                      {r.doctorRemarks && (
                        <div className="text-xs text-yellow-600 mt-1">Doctor: {r.doctorRemarks}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleShareWithDoctor(selectedPatient.id, r.id)}
                        className={`px-2 py-1 rounded text-xs font-medium ${r.sharedWithDoctor ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        <Share2 size={10} className="inline mr-1" />{r.sharedWithDoctor ? "Shared" : "Share"}
                      </button>
                      <button className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200">
                        <Download size={10} className="inline mr-1" />Download
                      </button>
                      <button
                        onClick={() => { deleteReport(selectedPatient.id, r.id); }}
                        className="px-2 py-1 rounded text-xs font-medium text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 mb-6">
                <FileText size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No reports uploaded yet.</p>
              </div>
            )}

            <button onClick={() => setStep("profile")} className="px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">
              <ChevronLeft size={16} className="inline mr-1" /> Back to Profile
            </button>
          </div>
        )}

        {/* ─── UPLOAD STEP ─── */}
        {step === "upload" && selectedPatient && (
          <div className="max-w-lg mx-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Report</h2>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">File Name *</label>
                <input type="text" value={uploadFileName} onChange={(e) => setUploadFileName(e.target.value)} placeholder="e.g., Blood_Test_Report.pdf" className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Report Type</label>
                <select value={uploadFileType} onChange={(e) => setUploadFileType(e.target.value as any)} className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20">
                  {Object.entries(reportTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Format</label>
                <select value={uploadFileFormat} onChange={(e) => setUploadFileFormat(e.target.value as any)} className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20">
                  <option value="pdf">PDF</option><option value="jpg">JPG</option><option value="jpeg">JPEG</option><option value="png">PNG</option><option value="docx">DOCX</option>
                </select>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Max file size: {maxFileSize}MB</p>
                <p className="text-xs text-gray-400">Supported: PDF, JPG, JPEG, PNG, DOCX</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <button onClick={() => setStep("reports")} className="px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleUploadReport}
                disabled={!uploadFileName.trim()}
                className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  uploadFileName.trim()
                    ? "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Upload Report
              </button>
            </div>
          </div>
        )}

        {/* ─── PACKAGES STEP ─── */}
        {step === "packages" && (
          <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Health Packages</h2>
              <button onClick={() => setStep(selectedPatientId ? "profile" : "landing")} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">
                <ChevronLeft size={14} className="inline mr-1" /> Back
              </button>
            </div>

            {!selectedPatientId && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-6 flex items-center gap-3">
                <AlertCircle size={18} className="text-yellow-600 shrink-0" />
                <p className="text-sm text-yellow-700">Please register or select a patient profile first to book a package.</p>
                <button onClick={() => setStep("landing")} className="px-3 py-1 rounded-lg text-xs font-semibold bg-yellow-200 text-yellow-800 hover:bg-yellow-300 shrink-0">
                  Select Patient
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6]" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl border border-green-100">
                        {pkg.icon || "🏥"}
                      </div>
                      <span className="text-xl font-bold text-[#1e3a5f]">${pkg.price.toFixed(2)}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{pkg.name}</h3>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{pkg.description}</p>
                    {pkg.benefits && (
                      <div className="text-xs text-gray-500 mb-4">
                        {pkg.benefits.split(",").slice(0, 3).map((b, i) => (
                          <div key={i} className="flex items-center gap-1 mb-0.5">
                            <CheckCircle2 size={10} className="text-green-500 shrink-0" />
                            <span>{b.trim()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => { setSelectedPackageId(pkg.id); setStep("payment"); }}
                      disabled={!selectedPatientId}
                      className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        selectedPatientId
                          ? "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-md"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Book Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {activePackages.length === 0 && (
              <div className="text-center py-16">
                <Package size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No packages available.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── PAYMENT STEP ─── */}
        {step === "payment" && selectedPkg && (
          <div className="max-w-lg mx-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment</h2>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-sm font-semibold text-gray-900 mb-1">{selectedPkg.name}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Package Price</span>
                <span className="text-2xl font-bold text-[#1e3a5f]">${selectedPkg.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {([
                { method: "card" as const, icon: CreditCard, title: "Credit / Debit Card", desc: "Visa, MasterCard, American Express" },
                { method: "upi" as const, icon: Smartphone, title: "UPI Payment", desc: "Google Pay, PhonePe, Paytm" },
                { method: "netbanking" as const, icon: Building, title: "Net Banking", desc: "All major banks supported" },
                { method: "cod" as const, icon: Truck, title: "Pay at Clinic", desc: "Pay when you visit the clinic" },
              ]).map(({ method, icon: Icon, title, desc }) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === method
                      ? "border-[#1e3a5f] bg-blue-50/50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${paymentMethod === method ? "bg-[#1e3a5f] text-white" : "bg-gray-100 text-gray-500"}`}>
                    <Icon size={18} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">{title}</div>
                    <div className="text-xs text-gray-400">{desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setStep("packages")} className="px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">
                Back
              </button>
              <button
                onClick={handleBookPackage}
                disabled={isProcessing}
                className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isProcessing
                    ? "bg-gray-300 text-gray-500 cursor-wait"
                    : "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg"
                }`}
              >
                {isProcessing ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2" />Processing...</>
                ) : (
                  <>Pay ${selectedPkg.price.toFixed(2)}</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─── CONFIRMATION STEP ─── */}
        {step === "confirmation" && (
          <div className="max-w-lg mx-auto p-6 text-center">
            <div className="py-10">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your health package has been booked successfully.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 inline-block">
                <div className="text-xs text-gray-500 font-medium">Booking ID</div>
                <div className="text-lg font-bold text-[#1e3a5f] font-mono">{bookingId}</div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-8">
                <p>You will receive a confirmation email shortly.</p>
                <p>A doctor will be assigned and a meeting link will be generated.</p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <button
                  onClick={() => setStep("profile")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
                >
                  View Profile
                </button>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
