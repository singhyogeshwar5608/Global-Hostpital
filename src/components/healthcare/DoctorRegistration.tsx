"use client";

import React, { useState, useRef } from "react";
import {
  useDoctorStore,
  type FieldKey,
} from "@/store/doctor-store";
import {
  Camera,
  User,
  GraduationCap,
  Award,
  Stethoscope,
  Clock,
  Phone,
  Mail,
  Building2,
  MapPin,
  Map,
  Globe2,
  Home,
  DollarSign,
  Save,
  X,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function DoctorRegistration() {
  const { addDoctor, fieldVisibility } = useDoctorStore();
  const [photoPreview, setPhotoPreview] = useState<string>(
    "https://api.dicebear.com/9.x/avataaars/svg?seed=newdoctor&backgroundColor=b6e3f4"
  );
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [degree, setDegree] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [consultancyFee, setConsultancyFee] = useState("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !qualification.trim() || !degree.trim()) {
      return;
    }

    addDoctor({
      photo: photoPreview,
      name: name.trim(),
      qualification: qualification.trim(),
      degree: degree.trim(),
      specialty: specialty.trim(),
      experience: experience.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      hospitalName: hospitalName.trim(),
      district: district.trim(),
      state: state.trim(),
      country: country.trim(),
      address: address.trim(),
      consultancyFee: Number(consultancyFee) || 0,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      resetForm();
    }, 2500);
  };

  const resetForm = () => {
    setName("");
    setQualification("");
    setDegree("");
    setSpecialty("");
    setExperience("");
    setMobile("");
    setEmail("");
    setHospitalName("");
    setDistrict("");
    setState("");
    setCountry("");
    setAddress("");
    setConsultancyFee("");
    setPhotoPreview(
      "https://api.dicebear.com/9.x/avataaars/svg?seed=newdoctor&backgroundColor=b6e3f4"
    );
  };

  const isFormValid =
    name.trim().length >= 2 &&
    qualification.trim().length >= 2 &&
    degree.trim().length >= 2;

  // Field visibility info
  const hiddenFields: { key: FieldKey; label: string }[] = [];
  if (!fieldVisibility.mobile) hiddenFields.push({ key: "mobile", label: "Mobile" });
  if (!fieldVisibility.email) hiddenFields.push({ key: "email", label: "Email" });
  if (!fieldVisibility.specialty) hiddenFields.push({ key: "specialty", label: "Specialty" });
  if (!fieldVisibility.hospitalName) hiddenFields.push({ key: "hospitalName", label: "Hospital Name" });
  if (!fieldVisibility.consultancyFee) hiddenFields.push({ key: "consultancyFee", label: "Consultancy Fee" });

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Doctor Registered!</h3>
        <p className="text-gray-500 text-sm">The doctor has been successfully added to the system.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Doctor Registration</h2>
          <p className="text-gray-500 text-sm mt-0.5">Add a new doctor to the system</p>
        </div>
        {hiddenFields.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
            <EyeOff size={14} className="text-amber-600" />
            <span className="text-xs text-amber-700 font-medium">
              Hidden: {hiddenFields.map((f) => f.label).join(", ")}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Camera size={16} className="text-[#1e3a5f]" />
            Profile Photo
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img
                src={photoPreview}
                alt="Doctor photo"
                className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Camera size={20} className="text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors"
              >
                <Camera size={16} />
                Upload Photo
              </button>
              <p className="text-xs text-gray-400 mt-2">
                JPG, PNG or SVG. Max 2MB. Click photo or button to upload.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User size={16} className="text-[#1e3a5f]" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Doctor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Sarah Johnson"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Qualification <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. MBBS, MD"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. Cardiology"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              />
            </div>
            {fieldVisibility.specialty ? (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-[#1e3a5f]" />
                  Specialty
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                >
                  <option value="">Select Specialty</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Ophthalmologist">Ophthalmologist</option>
                  <option value="ENT Specialist">ENT Specialist</option>
                  <option value="Psychiatrist">Psychiatrist</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Surgeon">Surgeon</option>
                  <option value="Urologist">Urologist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Pulmonologist">Pulmonologist</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-dashed border-gray-300">
                <EyeOff size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400 italic">Specialty field is hidden by Admin</span>
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Experience
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 15 years"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Phone size={16} className="text-[#1e3a5f]" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldVisibility.mobile ? (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                  <Phone size={14} className="text-[#1e3a5f]" />
                  Mobile
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. +1 (555) 123-4567"
                  className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-dashed border-gray-300 h-11">
                <EyeOff size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400 italic">Mobile field is hidden by Admin</span>
              </div>
            )}
            {fieldVisibility.email ? (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                  <Mail size={14} className="text-[#1e3a5f]" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. doctor@hospital.com"
                  className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-dashed border-gray-300 h-11">
                <EyeOff size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400 italic">Email field is hidden by Admin</span>
              </div>
            )}
          </div>
        </div>

        {/* Hospital & Location */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 size={16} className="text-[#1e3a5f]" />
            Hospital & Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldVisibility.hospitalName ? (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#1e3a5f]" />
                  Hospital Name
                </label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="e.g. City Heart Center"
                  className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-dashed border-gray-300 h-11">
                <EyeOff size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400 italic">Hospital Name field is hidden by Admin</span>
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                <Map size={14} className="text-[#1e3a5f]" />
                District
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Manhattan"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                <MapPin size={14} className="text-[#1e3a5f]" />
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. New York"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                <Globe2 size={14} className="text-[#1e3a5f]" />
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. USA"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                <Home size={14} className="text-[#1e3a5f]" />
                Full Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 456 Cardiology Lane, Manhattan, NY 10001"
                rows={3}
                className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Fee Information */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign size={16} className="text-[#1e3a5f]" />
            Fee Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldVisibility.consultancyFee ? (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                  <DollarSign size={14} className="text-[#1e3a5f]" />
                  Consultancy Fee ($)
                </label>
                <input
                  type="number"
                  value={consultancyFee}
                  onChange={(e) => setConsultancyFee(e.target.value)}
                  placeholder="e.g. 500"
                  min="0"
                  className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-dashed border-gray-300 h-11">
                <EyeOff size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400 italic">Consultancy Fee field is hidden by Admin</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
              isFormValid
                ? "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Save size={16} />
            Register Doctor
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
