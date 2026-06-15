"use client";

import React, { useState } from "react";
import {
  useDoctorStore,
  type PatientAccessType,
  type PatientAccessControl,
} from "@/store/doctor-store";
import {
  ShieldCheck,
  Stethoscope,
  Users,
  Globe2,
  Building2,
  MapPin,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const accessTypeConfig: {
  key: PatientAccessType;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  { key: "all", label: "All Patients Access", description: "Doctor can access all patients in the system without any restrictions", icon: Users },
  { key: "assigned", label: "Assigned Patients Only", description: "Doctor can only access patients that have been explicitly assigned to them", icon: ShieldCheck },
  { key: "countryWise", label: "Country Wise Patients", description: "Doctor can access patients from specific countries only", icon: Globe2 },
  { key: "hospitalWise", label: "Hospital Wise Patients", description: "Doctor can access patients from specific hospitals only", icon: Building2 },
  { key: "departmentWise", label: "Department Wise Patients", description: "Doctor can access patients from specific departments only", icon: MapPin },
];

interface Props {
  doctorId: string;
  onBack: () => void;
}

export default function DoctorPatientAccess({ doctorId, onBack }: Props) {
  const { doctors, setPatientAccess } = useDoctorStore();
  const doctor = doctors.find((d) => d.id === doctorId);

  const [accessType, setAccessType] = useState<PatientAccessType>(doctor?.patientAccess.type || "all");
  const [assignedPatientIds, setAssignedPatientIds] = useState<string[]>(doctor?.patientAccess.assignedPatientIds || []);
  const [allowedCountries, setAllowedCountries] = useState<string[]>(doctor?.patientAccess.allowedCountries || []);
  const [allowedHospitals, setAllowedHospitals] = useState<string[]>(doctor?.patientAccess.allowedHospitals || []);
  const [allowedDepartments, setAllowedDepartments] = useState<string[]>(doctor?.patientAccess.allowedDepartments || []);
  const [saved, setSaved] = useState(false);

  // Input fields
  const [countryInput, setCountryInput] = useState("");
  const [hospitalInput, setHospitalInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");
  const [patientInput, setPatientInput] = useState("");

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <ShieldCheck size={40} className="text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Doctor Not Found</h3>
        <button onClick={onBack} className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050]">
          Back to Doctors
        </button>
      </div>
    );
  }

  const handleSave = () => {
    const access: PatientAccessControl = {
      type: accessType,
      assignedPatientIds,
      allowedCountries,
      allowedHospitals,
      allowedDepartments,
    };
    setPatientAccess(doctorId, access);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addToList = (list: string[], setList: (v: string[]) => void, input: string, setInput: (v: string) => void) => {
    if (input.trim() && !list.includes(input.trim())) {
      setList([...list, input.trim()]);
      setInput("");
    }
  };

  const removeFromList = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.filter((i) => i !== item));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Toast */}
      {saved && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500 text-white shadow-lg">
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">Patient access settings saved!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Patient Access Control</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Define which patients {doctor.name} can access
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e3a5f] text-white">
          <ShieldCheck size={16} />
          <span className="text-sm font-semibold">Super Admin</span>
        </div>
      </div>

      {/* Doctor Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-4">
          <img src={doctor.photo} alt={doctor.name} className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100" />
          <div>
            <h3 className="font-bold text-gray-900">{doctor.name}</h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <Stethoscope size={10} /> {doctor.specialty}
            </span>
          </div>
        </div>
      </div>

      {/* Access Type Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Access Type</h3>
        <div className="space-y-2">
          {accessTypeConfig.map((config) => {
            const Icon = config.icon;
            const isSelected = accessType === config.key;
            return (
              <button
                key={config.key}
                onClick={() => setAccessType(config.key)}
                className={`w-full text-left bg-white rounded-xl p-4 border-2 transition-all ${
                  isSelected ? "border-[#1e3a5f] shadow-sm" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? "bg-[#1e3a5f] text-white" : "bg-gray-100 text-gray-400"}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{config.label}</span>
                      {isSelected && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#1e3a5f] text-white text-[10px] font-bold uppercase">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[#1e3a5f]" : "border-gray-300"}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1e3a5f]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional Configuration Sections */}
      {accessType === "assigned" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Assigned Patients</h3>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={patientInput}
              onChange={(e) => setPatientInput(e.target.value)}
              placeholder="Enter Patient ID (e.g. PAT-1001)"
              className="flex-1 h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
              onKeyDown={(e) => { if (e.key === "Enter") addToList(assignedPatientIds, setAssignedPatientIds, patientInput, setPatientInput); }}
            />
            <button
              onClick={() => addToList(assignedPatientIds, setAssignedPatientIds, patientInput, setPatientInput)}
              className="px-4 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050]"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {assignedPatientIds.map((id) => (
              <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                {id}
                <button onClick={() => removeFromList(assignedPatientIds, setAssignedPatientIds, id)} className="text-blue-400 hover:text-red-500">&times;</button>
              </span>
            ))}
            {assignedPatientIds.length === 0 && (
              <p className="text-xs text-gray-400">No patients assigned yet.</p>
            )}
          </div>
        </div>
      )}

      {accessType === "countryWise" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Allowed Countries</h3>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={countryInput}
              onChange={(e) => setCountryInput(e.target.value)}
              placeholder="Enter country name (e.g. USA)"
              className="flex-1 h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
              onKeyDown={(e) => { if (e.key === "Enter") addToList(allowedCountries, setAllowedCountries, countryInput, setCountryInput); }}
            />
            <button
              onClick={() => addToList(allowedCountries, setAllowedCountries, countryInput, setCountryInput)}
              className="px-4 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050]"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allowedCountries.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
                {c}
                <button onClick={() => removeFromList(allowedCountries, setAllowedCountries, c)} className="text-green-400 hover:text-red-500">&times;</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {accessType === "hospitalWise" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Allowed Hospitals</h3>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={hospitalInput}
              onChange={(e) => setHospitalInput(e.target.value)}
              placeholder="Enter hospital name"
              className="flex-1 h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
              onKeyDown={(e) => { if (e.key === "Enter") addToList(allowedHospitals, setAllowedHospitals, hospitalInput, setHospitalInput); }}
            />
            <button
              onClick={() => addToList(allowedHospitals, setAllowedHospitals, hospitalInput, setHospitalInput)}
              className="px-4 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050]"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allowedHospitals.map((h) => (
              <span key={h} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-100">
                {h}
                <button onClick={() => removeFromList(allowedHospitals, setAllowedHospitals, h)} className="text-purple-400 hover:text-red-500">&times;</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {accessType === "departmentWise" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Allowed Departments</h3>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={departmentInput}
              onChange={(e) => setDepartmentInput(e.target.value)}
              placeholder="Enter department name (e.g. Cardiology)"
              className="flex-1 h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
              onKeyDown={(e) => { if (e.key === "Enter") addToList(allowedDepartments, setAllowedDepartments, departmentInput, setDepartmentInput); }}
            />
            <button
              onClick={() => addToList(allowedDepartments, setAllowedDepartments, departmentInput, setDepartmentInput)}
              className="px-4 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050]"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allowedDepartments.map((d) => (
              <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
                {d}
                <button onClick={() => removeFromList(allowedDepartments, setAllowedDepartments, d)} className="text-amber-400 hover:text-red-500">&times;</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Current Access Summary */}
      <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-6">
        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Current Access Summary</h4>
        <div className="text-sm text-gray-700">
          <span className="font-semibold">{doctor.name}</span> has{" "}
          <span className="font-semibold">
            {accessType === "all" ? "full access to all patients" :
             accessType === "assigned" ? `access to ${assignedPatientIds.length} assigned patients` :
             accessType === "countryWise" ? `access to patients from ${allowedCountries.length} countries` :
             accessType === "hospitalWise" ? `access to patients from ${allowedHospitals.length} hospitals` :
             `access to patients from ${allowedDepartments.length} departments`}
          </span>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors flex items-center justify-center gap-1.5"
        >
          <Save size={14} />
          Save Access Settings
        </button>
      </div>
    </div>
  );
}
