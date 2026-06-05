"use client";

import React, { useState, useRef } from "react";
import { useLabStore } from "@/store/lab-store";
import {
  FlaskConical,
  Building2,
  User,
  GraduationCap,
  MapPin,
  Map,
  Globe2,
  Camera,
  FileText,
  PenTool,
  Hash,
  Save,
  X,
  CheckCircle2,
  ChevronDown,
  Copy,
  Key,
} from "lucide-react";

export default function LabRegistration({ onDone }: { onDone?: () => void }) {
  const { addLab } = useLabStore();
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const techPhotoRef = useRef<HTMLInputElement>(null);
  const pathPhotoRef = useRef<HTMLInputElement>(null);

  // Lab fields
  const [labName, setLabName] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  // Owner fields
  const [ownerName, setOwnerName] = useState("");
  const [ownerQualification, setOwnerQualification] = useState("");

  // Technician fields
  const [techName, setTechName] = useState("");
  const [techPhoto, setTechPhoto] = useState("https://api.dicebear.com/9.x/avataaars/svg?seed=technician&backgroundColor=b6e3f4");
  const [techQualification, setTechQualification] = useState("");
  const [techGstNumber, setTechGstNumber] = useState("");
  const [techRegDocs, setTechRegDocs] = useState("");
  const [techSignature, setTechSignature] = useState("");

  // Pathologist fields
  const [pathName, setPathName] = useState("");
  const [pathPhoto, setPathPhoto] = useState("https://api.dicebear.com/9.x/avataaars/svg?seed=pathologist&backgroundColor=c0aede");
  const [pathQualification, setPathQualification] = useState("");
  const [pathGstNumber, setPathGstNumber] = useState("");
  const [pathRegDocs, setPathRegDocs] = useState("");
  const [pathSignature, setPathSignature] = useState("");

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labName.trim() || !ownerName.trim() || !techName.trim() || !pathName.trim()) return;

    const result = addLab({
      labName: labName.trim(),
      district: district.trim(),
      state: state.trim(),
      country: country.trim(),
      ownerName: ownerName.trim(),
      ownerQualification: ownerQualification.trim(),
      technician: {
        name: techName.trim(),
        photo: techPhoto,
        qualification: techQualification.trim(),
        gstNumber: techGstNumber.trim(),
        registrationDocuments: techRegDocs.trim(),
        signature: techSignature.trim(),
      },
      pathologist: {
        name: pathName.trim(),
        photo: pathPhoto,
        qualification: pathQualification.trim(),
        gstNumber: pathGstNumber.trim(),
        registrationDocuments: pathRegDocs.trim(),
        signature: pathSignature.trim(),
      },
    });

    setGeneratedId(result.id);
    setGeneratedPassword(result.password);
    setSuccess(true);
  };

  const resetForm = () => {
    setLabName(""); setDistrict(""); setState(""); setCountry("");
    setOwnerName(""); setOwnerQualification("");
    setTechName(""); setTechPhoto("https://api.dicebear.com/9.x/avataaars/svg?seed=technician&backgroundColor=b6e3f4"); setTechQualification(""); setTechGstNumber(""); setTechRegDocs(""); setTechSignature("");
    setPathName(""); setPathPhoto("https://api.dicebear.com/9.x/avataaars/svg?seed=pathologist&backgroundColor=c0aede"); setPathQualification(""); setPathGstNumber(""); setPathRegDocs(""); setPathSignature("");
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const isFormValid = labName.trim().length >= 2 && ownerName.trim().length >= 2 && techName.trim().length >= 2 && pathName.trim().length >= 2;

  if (success) {
    return (
      <div className="max-w-lg mx-auto py-10 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Lab Registered!</h3>
        <p className="text-gray-500 text-sm mb-6">The lab has been successfully registered. Credentials are auto-generated below.</p>

        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 mb-6 space-y-4">
          <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Lab Login Credentials</div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-gray-500">Lab ID</div>
                <div className="font-mono text-lg font-bold text-[#1e3a5f]">{generatedId}</div>
              </div>
              <button
                onClick={() => copyToClipboard(generatedId, "id")}
                className={`p-2 rounded-lg transition-colors ${copied === "id" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {copied === "id" ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Password</div>
                <div className="font-mono text-lg font-bold text-[#1e3a5f]">{generatedPassword}</div>
              </div>
              <button
                onClick={() => copyToClipboard(generatedPassword, "pw")}
                className={`p-2 rounded-lg transition-colors ${copied === "pw" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {copied === "pw" ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <p className="text-xs text-blue-600">Please save these credentials. The lab will use them to login.</p>
        </div>

        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={() => { setSuccess(false); resetForm(); }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Register Another
          </button>
          <button
            onClick={() => { if (onDone) onDone(); }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] transition-colors shadow-lg"
          >
            Back to Labs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Lab Registration</h2>
        <p className="text-gray-500 text-sm mt-0.5">Register a new lab. Lab ID & Password will be auto-generated.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lab Information */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FlaskConical size={16} className="text-[#1e3a5f]" />
            Lab Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Lab Name <span className="text-red-500">*</span></label>
              <input type="text" value={labName} onChange={(e) => setLabName(e.target.value)} placeholder="e.g. City Diagnostic Center"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><Map size={14} className="text-[#1e3a5f]" /> District</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Manhattan"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><MapPin size={14} className="text-[#1e3a5f]" /> State</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g. New York"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><Globe2 size={14} className="text-[#1e3a5f]" /> Country</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. USA"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
              <Key size={14} className="text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">Lab ID & Password will be auto-generated after registration</span>
            </div>
          </div>
        </div>

        {/* Lab Owner */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 size={16} className="text-[#1e3a5f]" />
            Lab Owner
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Owner Name <span className="text-red-500">*</span></label>
              <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="e.g. Dr. Robert Anderson"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><GraduationCap size={14} className="text-[#1e3a5f]" /> Qualification</label>
              <input type="text" value={ownerQualification} onChange={(e) => setOwnerQualification(e.target.value)} placeholder="e.g. MBBS, MD Pathology"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
          </div>
        </div>

        {/* Lab Technician */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User size={16} className="text-[#1e3a5f]" />
            Lab Technician
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative group">
              <img src={techPhoto} alt="Technician" className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200" />
              <button type="button" onClick={() => techPhotoRef.current?.click()} className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={18} className="text-white" />
              </button>
              <input ref={techPhotoRef} type="file" accept="image/*" onChange={(e) => handlePhotoChange(e, setTechPhoto)} className="hidden" />
            </div>
            <div>
              <button type="button" onClick={() => techPhotoRef.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e3a5f] text-white text-xs font-semibold hover:bg-[#163050] transition-colors">
                <Camera size={14} /> Upload Photo
              </button>
              <p className="text-[10px] text-gray-400 mt-1">JPG, PNG. Max 2MB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Name <span className="text-red-500">*</span></label>
              <input type="text" value={techName} onChange={(e) => setTechName(e.target.value)} placeholder="e.g. James Wilson"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><GraduationCap size={14} className="text-[#1e3a5f]" /> Qualification</label>
              <input type="text" value={techQualification} onChange={(e) => setTechQualification(e.target.value)} placeholder="e.g. DMLT, BSc MLT"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><Hash size={14} className="text-[#1e3a5f]" /> GST Number</label>
              <input type="text" value={techGstNumber} onChange={(e) => setTechGstNumber(e.target.value)} placeholder="e.g. 12ABCDE3456F1Z5"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><FileText size={14} className="text-[#1e3a5f]" /> Registration Documents</label>
              <input type="text" value={techRegDocs} onChange={(e) => setTechRegDocs(e.target.value)} placeholder="e.g. Reg_Doc_2024.pdf"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><PenTool size={14} className="text-[#1e3a5f]" /> Signature</label>
              <input type="text" value={techSignature} onChange={(e) => setTechSignature(e.target.value)} placeholder="e.g. Sign_Tech.png"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
          </div>
        </div>

        {/* Pathologist */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <GraduationCap size={16} className="text-[#1e3a5f]" />
            Pathologist
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative group">
              <img src={pathPhoto} alt="Pathologist" className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200" />
              <button type="button" onClick={() => pathPhotoRef.current?.click()} className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={18} className="text-white" />
              </button>
              <input ref={pathPhotoRef} type="file" accept="image/*" onChange={(e) => handlePhotoChange(e, setPathPhoto)} className="hidden" />
            </div>
            <div>
              <button type="button" onClick={() => pathPhotoRef.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e3a5f] text-white text-xs font-semibold hover:bg-[#163050] transition-colors">
                <Camera size={14} /> Upload Photo
              </button>
              <p className="text-[10px] text-gray-400 mt-1">JPG, PNG. Max 2MB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Name <span className="text-red-500">*</span></label>
              <input type="text" value={pathName} onChange={(e) => setPathName(e.target.value)} placeholder="e.g. Dr. Sarah Mitchell"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><GraduationCap size={14} className="text-[#1e3a5f]" /> Qualification</label>
              <input type="text" value={pathQualification} onChange={(e) => setPathQualification(e.target.value)} placeholder="e.g. MBBS, MD Pathology"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><Hash size={14} className="text-[#1e3a5f]" /> GST Number</label>
              <input type="text" value={pathGstNumber} onChange={(e) => setPathGstNumber(e.target.value)} placeholder="e.g. 12FGHIJ7890K2L6"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><FileText size={14} className="text-[#1e3a5f]" /> Registration Documents</label>
              <input type="text" value={pathRegDocs} onChange={(e) => setPathRegDocs(e.target.value)} placeholder="e.g. Reg_Path_2024.pdf"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><PenTool size={14} className="text-[#1e3a5f]" /> Signature</label>
              <input type="text" value={pathSignature} onChange={(e) => setPathSignature(e.target.value)} placeholder="e.g. Sign_Path.png"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
              isFormValid ? "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Save size={16} />
            Register Lab
          </button>
          <button
            type="button"
            onClick={() => { resetForm(); if (onDone) onDone(); }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
