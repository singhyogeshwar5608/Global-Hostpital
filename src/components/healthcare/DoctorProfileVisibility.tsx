"use client";

import React from "react";
import {
  useDoctorStore,
  type ProfileFieldKey,
  type DoctorProfileVisibility,
} from "@/store/doctor-store";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Phone,
  Mail,
  GraduationCap,
  Award,
  Stethoscope,
  Clock,
  Building2,
  DollarSign,
  MapPin,
  FileBadge,
  Star,
} from "lucide-react";

const profileFieldConfig: {
  key: ProfileFieldKey;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  { key: "mobile", label: "Doctor Mobile Number", description: "Show or hide doctor's mobile number on profile and listings", icon: Phone },
  { key: "email", label: "Doctor Email", description: "Show or hide doctor's email address on profile and listings", icon: Mail },
  { key: "qualification", label: "Doctor Qualification", description: "Show or hide doctor's qualification (MBBS, MD, etc.)", icon: GraduationCap },
  { key: "degree", label: "Doctor Degree", description: "Show or hide doctor's degree specialization", icon: Award },
  { key: "specialty", label: "Doctor Specialty", description: "Show or hide doctor's specialty area", icon: Stethoscope },
  { key: "experience", label: "Doctor Experience", description: "Show or hide doctor's years of experience", icon: Clock },
  { key: "hospitalName", label: "Hospital Name", description: "Show or hide the hospital name the doctor is associated with", icon: Building2 },
  { key: "consultancyFee", label: "Consultation Fees", description: "Show or hide doctor's consultation fee amount", icon: DollarSign },
  { key: "address", label: "Address", description: "Show or hide doctor's full address", icon: MapPin },
  { key: "certificates", label: "Certificates", description: "Show or hide doctor's certificates and credentials", icon: FileBadge },
  { key: "reviewsRatings", label: "Reviews & Ratings", description: "Show or hide patient reviews and star ratings", icon: Star },
];

interface Props {
  doctorId: string;
  onBack: () => void;
}

export default function DoctorProfileVisibility({ doctorId, onBack }: Props) {
  const { doctors, setProfileVisibility, setAllProfileVisibility } = useDoctorStore();
  const doctor = doctors.find((d) => d.id === doctorId);

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

  const visibleCount = Object.values(doctor.profileVisibility).filter(Boolean).length;
  const hiddenCount = Object.values(doctor.profileVisibility).filter((v) => !v).length;

  const handleShowAll = () => {
    const allVisible: DoctorProfileVisibility = Object.keys(doctor.profileVisibility).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as DoctorProfileVisibility
    );
    setAllProfileVisibility(doctorId, allVisible);
  };

  const handleHideAll = () => {
    const allHidden: DoctorProfileVisibility = Object.keys(doctor.profileVisibility).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as DoctorProfileVisibility
    );
    setAllProfileVisibility(doctorId, allHidden);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Profile Visibility Control</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Control what information is visible for {doctor.name}
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

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Eye size={18} className="text-green-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-green-700">{visibleCount}</div>
            <div className="text-xs text-green-600 font-medium">Visible Fields</div>
          </div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <EyeOff size={18} className="text-red-500" />
          </div>
          <div>
            <div className="text-xl font-bold text-red-600">{hiddenCount}</div>
            <div className="text-xs text-red-500 font-medium">Hidden Fields</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={handleShowAll} className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors">
          Show All
        </button>
        <button onClick={handleHideAll} className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
          Hide All
        </button>
      </div>

      {/* Toggle Cards */}
      <div className="space-y-2">
        {profileFieldConfig.map((field) => {
          const isVisible = doctor.profileVisibility[field.key];
          const Icon = field.icon;
          return (
            <div
              key={field.key}
              className={`bg-white rounded-xl p-4 border-2 transition-all ${
                isVisible ? "border-green-200" : "border-red-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isVisible ? "bg-green-100" : "bg-red-50"}`}>
                    <Icon size={18} className={isVisible ? "text-green-600" : "text-red-300"} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{field.label}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isVisible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                        {isVisible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{field.description}</p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => setProfileVisibility(doctorId, field.key, !isVisible)}
                  className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                    isVisible ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${
                    isVisible ? "left-7" : "left-1"
                  }`}>
                    {isVisible ? <Eye size={12} className="text-green-500" /> : <EyeOff size={12} className="text-gray-400" />}
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-800">Super Admin Only</h4>
            <p className="text-xs text-blue-600 mt-1">
              These visibility controls determine what profile information is shown to patients and other users. Hidden fields will not appear on the doctor&apos;s public profile or in search results. This is separate from the global field visibility settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
