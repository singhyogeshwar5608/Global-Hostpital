"use client";

import React from "react";
import {
  useDoctorStore,
  type FieldKey,
} from "@/store/doctor-store";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  DollarSign,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const fieldConfig: {
  key: FieldKey;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    key: "mobile",
    label: "Mobile Number",
    description: "Show or hide the mobile number field in doctor registration and list view.",
    icon: Phone,
  },
  {
    key: "email",
    label: "Email Address",
    description: "Show or hide the email address field in doctor registration and list view.",
    icon: Mail,
  },
  {
    key: "specialty",
    label: "Specialty",
    description: "Show or hide the specialty dropdown in doctor registration and list view.",
    icon: GraduationCap,
  },
  {
    key: "hospitalName",
    label: "Hospital Name",
    description: "Show or hide the hospital name field in doctor registration and list view.",
    icon: Building2,
  },
  {
    key: "consultancyFee",
    label: "Consultancy Fee",
    description: "Show or hide the consultancy fee field in doctor registration and list view.",
    icon: DollarSign,
  },
];

export default function FieldVisibilitySettings() {
  const { fieldVisibility, toggleFieldVisibility } = useDoctorStore();

  const visibleCount = Object.values(fieldVisibility).filter(Boolean).length;
  const hiddenCount = Object.values(fieldVisibility).filter((v) => !v).length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Field Visibility Settings</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Super Admin controls for doctor form fields
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e3a5f] text-white">
          <ShieldCheck size={16} />
          <span className="text-sm font-semibold">Super Admin</span>
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

      {/* Toggle Cards */}
      <div className="space-y-3">
        {fieldConfig.map((field) => {
          const isVisible = fieldVisibility[field.key];
          const Icon = field.icon;
          return (
            <div
              key={field.key}
              className={`bg-white rounded-xl p-5 border-2 transition-all ${
                isVisible
                  ? "border-green-200 shadow-sm"
                  : "border-red-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      isVisible ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={isVisible ? "text-green-600" : "text-red-400"}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {field.label}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isVisible
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {isVisible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {field.description}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleFieldVisibility(field.key)}
                  className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                    isVisible ? "bg-green-500" : "bg-gray-300"
                  }`}
                  title={isVisible ? "Click to hide" : "Click to show"}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${
                      isVisible ? "left-7" : "left-1"
                    }`}
                  >
                    {isVisible ? (
                      <Eye size={12} className="text-green-500" />
                    ) : (
                      <EyeOff size={12} className="text-gray-400" />
                    )}
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
              These visibility controls are only accessible to Super Admin. When a field is hidden, it will not appear in the doctor registration form or the doctors list table. Hidden fields will show a notice indicating they are controlled by admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
