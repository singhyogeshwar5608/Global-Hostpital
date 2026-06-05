"use client";

import React, { useState, useEffect } from "react";
import { useHospitalStore, type Hospital } from "@/store/hospital-store";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe2,
  Save,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  FileText,
  BedDouble,
  Stethoscope,
  Plus,
} from "lucide-react";

const hospitalLogos = ["🏥", "🏨", "🏥", "⚕️", "🩺", "💊", "🔬", "🧬"];

const specialtyOptions = [
  "Cardiology", "Neurology", "Orthopedics", "Dermatology",
  "Pediatrics", "Gynecology", "Ophthalmology", "ENT",
  "Psychiatry", "General Medicine", "Oncology", "Urology",
  "Nephrology", "Gastroenterology", "Pulmonology", "Endocrinology",
  "Rheumatology", "Dental", "Emergency Medicine", "Cosmetology",
  "Cardiac Surgery", "Neurosurgery", "Interventional Cardiology",
  "Plastic Surgery", "Radiology", "Pathology", "Anesthesiology",
];

interface FormData {
  name: string;
  logo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phone: string;
  email: string;
  website: string;
  emergencyNumber: string;
  registrationNumber: string;
  registrationDocuments: string[];
  type: Hospital["type"];
  specialty: string[];
  bedCapacity: number;
  isActive: boolean;
}

const emptyForm: FormData = {
  name: "",
  logo: "🏥",
  address: "",
  city: "",
  state: "",
  country: "",
  pinCode: "",
  phone: "",
  email: "",
  website: "",
  emergencyNumber: "",
  registrationNumber: "",
  registrationDocuments: [],
  type: "private",
  specialty: [],
  bedCapacity: 100,
  isActive: true,
};

export default function HospitalRegistration({
  editId,
  onDone,
}: {
  editId: string | null;
  onDone: () => void;
}) {
  const { hospitals, addHospital, updateHospital } = useHospitalStore();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [docInput, setDocInput] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (editId) {
      const hospital = hospitals.find((h) => h.id === editId);
      if (hospital) {
        setForm({
          name: hospital.name,
          logo: hospital.logo,
          address: hospital.address,
          city: hospital.city,
          state: hospital.state,
          country: hospital.country,
          pinCode: hospital.pinCode,
          phone: hospital.phone,
          email: hospital.email,
          website: hospital.website,
          emergencyNumber: hospital.emergencyNumber,
          registrationNumber: hospital.registrationNumber,
          registrationDocuments: [...hospital.registrationDocuments],
          type: hospital.type,
          specialty: [...hospital.specialty],
          bedCapacity: hospital.bedCapacity,
          isActive: hospital.isActive,
        });
      }
    } else {
      setForm(emptyForm);
    }
  }, [editId, hospitals]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Hospital name is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!form.email.includes("@")) errs.email = "Invalid email address";
    if (!form.registrationNumber.trim()) errs.registrationNumber = "Registration number is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (editId) {
      updateHospital(editId, {
        name: form.name,
        logo: form.logo,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        pinCode: form.pinCode,
        phone: form.phone,
        email: form.email,
        website: form.website,
        emergencyNumber: form.emergencyNumber,
        registrationNumber: form.registrationNumber,
        registrationDocuments: form.registrationDocuments,
        type: form.type,
        specialty: form.specialty,
        bedCapacity: form.bedCapacity,
        isActive: form.isActive,
      });
    } else {
      addHospital({
        name: form.name,
        logo: form.logo,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        pinCode: form.pinCode,
        phone: form.phone,
        email: form.email,
        website: form.website,
        emergencyNumber: form.emergencyNumber,
        registrationNumber: form.registrationNumber,
        registrationDocuments: form.registrationDocuments,
        type: form.type,
        specialty: form.specialty,
        bedCapacity: form.bedCapacity,
        isActive: form.isActive,
      });
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onDone();
    }, 1500);
  };

  const toggleSpecialty = (spec: string) => {
    setForm((prev) => ({
      ...prev,
      specialty: prev.specialty.includes(spec)
        ? prev.specialty.filter((s) => s !== spec)
        : [...prev.specialty, spec],
    }));
  };

  const addDocument = () => {
    if (docInput.trim()) {
      setForm((prev) => ({
        ...prev,
        registrationDocuments: [...prev.registrationDocuments, docInput.trim()],
      }));
      setDocInput("");
    }
  };

  const removeDocument = (index: number) => {
    setForm((prev) => ({
      ...prev,
      registrationDocuments: prev.registrationDocuments.filter((_, i) => i !== index),
    }));
  };

  const inputClass = (field: string) =>
    `w-full h-11 rounded-xl border ${
      errors[field] ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
    } px-4 text-sm bg-white focus:outline-none focus:ring-2 transition-colors`;

  return (
    <div className="max-w-4xl">
      {/* Success Toast */}
      {saved && (
        <div className="fixed top-4 right-4 z-[300] flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl shadow-lg animate-fade-in">
          <CheckCircle2 size={18} />
          <span className="font-semibold text-sm">
            Hospital {editId ? "updated" : "added"} successfully!
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {editId ? "Edit Hospital" : "Add New Hospital"}
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {editId ? "Update hospital information" : "Register a new hospital in the system"}
        </p>
      </div>

      <div className="space-y-6">
        {/* ─── Basic Information ─── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Building2 size={16} className="text-[#1e3a5f]" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Logo */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Hospital Logo</label>
              <div className="flex flex-wrap gap-2">
                {hospitalLogos.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setForm({ ...form, logo: emoji })}
                    className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${
                      form.logo === emoji
                        ? "border-[#1e3a5f] bg-[#1e3a5f]/5 shadow-sm"
                        : "border-gray-100 hover:border-[#1e3a5f]/30 hover:bg-gray-50"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Hospital Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                placeholder="e.g. City Heart Center"
                className={inputClass("name")}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.name}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Hospital Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Hospital["type"] })}
                className={inputClass("type")}
              >
                <option value="government">Government</option>
                <option value="private">Private</option>
                <option value="semi-government">Semi-Government</option>
                <option value="trust">Trust</option>
                <option value="ngo">NGO</option>
              </select>
            </div>

            {/* Bed Capacity */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Bed Capacity</label>
              <div className="relative">
                <BedDouble size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={form.bedCapacity}
                  onChange={(e) => setForm({ ...form, bedCapacity: Number(e.target.value) })}
                  min={0}
                  className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Status</label>
              <div className="flex items-center gap-3 h-11">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: true })}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    form.isActive ? "bg-green-100 text-green-700 border-2 border-green-200" : "bg-gray-50 text-gray-400 border-2 border-gray-100"
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: false })}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    !form.isActive ? "bg-red-100 text-red-700 border-2 border-red-200" : "bg-gray-50 text-gray-400 border-2 border-gray-100"
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Address Information ─── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-[#1e3a5f]" />
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => { setForm({ ...form, address: e.target.value }); setErrors({ ...errors, address: "" }); }}
                placeholder="e.g. 456 Cardiology Lane, Manhattan"
                className={inputClass("address")}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.address}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                City <span className="text-red-400">*</span>
              </label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="New York" className={inputClass("city")} />
              {errors.city && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.city}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                State <span className="text-red-400">*</span>
              </label>
              <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="New York" className={inputClass("state")} />
              {errors.state && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.state}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Country</label>
              <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="USA" className={inputClass("country")} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Pin Code</label>
              <input type="text" value={form.pinCode} onChange={(e) => setForm({ ...form, pinCode: e.target.value })} placeholder="10001" className={inputClass("pinCode")} />
            </div>
          </div>
        </div>

        {/* ─── Contact Details ─── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Phone size={16} className="text-[#1e3a5f]" />
            Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Phone <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (212) 555-0101" className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.phone}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="info@hospital.com" className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Emergency Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400" />
                <input type="tel" value={form.emergencyNumber} onChange={(e) => setForm({ ...form, emergencyNumber: e.target.value })} placeholder="+1 (212) 911-0101" className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Website</label>
              <div className="relative">
                <Globe2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="www.hospital.com" className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Registration & Documents ─── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#1e3a5f]" />
            Registration & Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Registration Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.registrationNumber}
                onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                placeholder="e.g. REG-NYC-2024-1234"
                className={inputClass("registrationNumber")}
              />
              {errors.registrationNumber && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.registrationNumber}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Registration Documents</label>
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={docInput}
                    onChange={(e) => setDocInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDocument())}
                    placeholder="e.g. registration_certificate.pdf"
                    className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                  />
                </div>
                <button
                  type="button"
                  onClick={addDocument}
                  className="h-11 px-4 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              {form.registrationDocuments.length > 0 && (
                <div className="space-y-1.5">
                  {form.registrationDocuments.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <FileText size={14} className="text-blue-500 shrink-0" />
                      <span className="text-sm text-gray-700 flex-1">{doc}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(i)}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {form.registrationDocuments.length === 0 && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Upload size={12} /> No documents added yet. Type a filename and click Add.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ─── Specialty ─── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Stethoscope size={16} className="text-[#1e3a5f]" />
            Specialties
          </h3>
          <div className="flex flex-wrap gap-2">
            {specialtyOptions.map((spec) => {
              const isSelected = form.specialty.includes(spec);
              return (
                <button
                  key={spec}
                  type="button"
                  onClick={() => toggleSpecialty(spec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border-2 ${
                    isSelected
                      ? "bg-teal/10 text-teal border-teal/30"
                      : "bg-white text-gray-500 border-gray-100 hover:border-teal/20 hover:bg-gray-50"
                  }`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, specialty: [...specialtyOptions] })}
              className="text-xs text-teal font-semibold hover:underline"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, specialty: [] })}
              className="text-xs text-gray-500 font-semibold hover:underline"
            >
              Clear All
            </button>
            <span className="text-xs text-gray-400 ml-auto">
              {form.specialty.length} selected
            </span>
          </div>
        </div>

        {/* ─── Submit ─── */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onDone}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors shadow-lg flex items-center justify-center gap-1.5"
          >
            <Save size={14} />
            {editId ? "Update Hospital" : "Add Hospital"}
          </button>
        </div>
      </div>
    </div>
  );
}
