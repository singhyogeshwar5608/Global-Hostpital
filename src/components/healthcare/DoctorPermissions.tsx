"use client";

import React from "react";
import {
  useDoctorStore,
  type PermissionKey,
  type DoctorPermissions,
} from "@/store/doctor-store";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
  FileText,
  FlaskConical,
  Download,
  Video,
  CreditCard,
  DollarSign,
  CalendarDays,
  MessageSquare,
  Upload,
  Clock,
  Stethoscope,
  ClipboardList,
  ToggleLeft,
} from "lucide-react";

const permissionConfig: {
  key: PermissionKey;
  label: string;
  description: string;
  icon: React.ElementType;
  category: string;
}[] = [
  { key: "viewPatients", label: "View Patients", description: "Allow doctor to view patient records and profiles", icon: Users, category: "Patient Management" },
  { key: "editPatients", label: "Edit Patients", description: "Allow doctor to edit patient information and medical records", icon: ClipboardList, category: "Patient Management" },
  { key: "createPrescription", label: "Create Prescription", description: "Allow doctor to create new prescriptions for patients", icon: FileText, category: "Prescriptions" },
  { key: "editPrescription", label: "Edit Prescription", description: "Allow doctor to modify existing prescriptions", icon: FileText, category: "Prescriptions" },
  { key: "assignLabTests", label: "Assign Lab Tests", description: "Allow doctor to order and assign lab tests for patients", icon: FlaskConical, category: "Lab & Reports" },
  { key: "viewLabReports", label: "View Lab Reports", description: "Allow doctor to view completed lab test reports", icon: FlaskConical, category: "Lab & Reports" },
  { key: "downloadReports", label: "Download Reports", description: "Allow doctor to download and export reports", icon: Download, category: "Lab & Reports" },
  { key: "generateMeetingLinks", label: "Generate Meeting Links", description: "Allow doctor to generate video consultation meeting links", icon: Video, category: "Consultations" },
  { key: "videoConsultation", label: "Video Consultation", description: "Allow doctor to conduct video consultations with patients", icon: Video, category: "Consultations" },
  { key: "viewPayments", label: "View Payments", description: "Allow doctor to view patient payment records and history", icon: CreditCard, category: "Financial" },
  { key: "viewRevenue", label: "View Revenue", description: "Allow doctor to view revenue reports and analytics", icon: DollarSign, category: "Financial" },
  { key: "manageSchedule", label: "Manage Schedule", description: "Allow doctor to manage their own availability schedule", icon: CalendarDays, category: "Schedule" },
  { key: "manageFollowUps", label: "Manage Follow-Ups", description: "Allow doctor to schedule and manage follow-up appointments", icon: Clock, category: "Schedule" },
  { key: "chatSystem", label: "Chat System", description: "Allow doctor to use the chat messaging system with patients", icon: MessageSquare, category: "Communication" },
  { key: "uploadMedicalDocuments", label: "Upload Medical Documents", description: "Allow doctor to upload medical documents and files", icon: Upload, category: "Documents" },
];

interface Props {
  doctorId: string;
  onBack: () => void;
}

export default function DoctorPermissions({ doctorId, onBack }: Props) {
  const { doctors, setDoctorPermission, setAllPermissions } = useDoctorStore();
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

  const enabledCount = Object.values(doctor.permissions).filter(Boolean).length;
  const totalCount = Object.keys(doctor.permissions).length;

  const categories = [...new Set(permissionConfig.map((p) => p.category))];

  const handleEnableAll = () => {
    const allEnabled: DoctorPermissions = Object.keys(doctor.permissions).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as DoctorPermissions
    );
    setAllPermissions(doctorId, allEnabled);
  };

  const handleDisableAll = () => {
    const allDisabled: DoctorPermissions = Object.keys(doctor.permissions).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as DoctorPermissions
    );
    setAllPermissions(doctorId, allDisabled);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Doctor Permission Control</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage permissions for {doctor.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e3a5f] text-white">
            <ShieldCheck size={16} />
            <span className="text-sm font-semibold">Super Admin</span>
          </div>
        </div>
      </div>

      {/* Doctor Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-4">
          <img src={doctor.photo} alt={doctor.name} className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{doctor.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                <Stethoscope size={10} /> {doctor.specialty}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                doctor.status === "active" ? "bg-green-50 text-green-700" :
                doctor.status === "suspended" ? "bg-red-50 text-red-700" :
                "bg-gray-100 text-gray-600"
              }`}>
                {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#1e3a5f]">{enabledCount}/{totalCount}</div>
            <div className="text-xs text-gray-400">Permissions Enabled</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleEnableAll}
          className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
        >
          Enable All
        </button>
        <button
          onClick={handleDisableAll}
          className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
        >
          Disable All
        </button>
        <div className="flex-1" />
        <div className="h-2 flex-1 max-w-[200px] rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(enabledCount / totalCount) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 font-semibold">{Math.round((enabledCount / totalCount) * 100)}%</span>
      </div>

      {/* Permission Categories */}
      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ToggleLeft size={14} className="text-[#1e3a5f]" />
            {category}
          </h3>
          <div className="space-y-2">
            {permissionConfig
              .filter((p) => p.category === category)
              .map((perm) => {
                const isEnabled = doctor.permissions[perm.key];
                const Icon = perm.icon;
                return (
                  <div
                    key={perm.key}
                    className={`bg-white rounded-xl p-4 border-2 transition-all ${
                      isEnabled ? "border-green-200" : "border-red-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isEnabled ? "bg-green-100" : "bg-red-50"}`}>
                          <Icon size={18} className={isEnabled ? "text-green-600" : "text-red-300"} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm">{perm.label}</span>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isEnabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                            }`}>
                              {isEnabled ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        onClick={() => setDoctorPermission(doctorId, perm.key, !isEnabled)}
                        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                          isEnabled ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${
                          isEnabled ? "left-7" : "left-1"
                        }`}>
                          {isEnabled ? <Eye size={12} className="text-green-500" /> : <EyeOff size={12} className="text-gray-400" />}
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {/* Security Note */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-800">Security Notice</h4>
            <p className="text-xs text-amber-600 mt-1">
              Permission changes take effect immediately. When a permission is disabled, the corresponding module will be completely hidden from the doctor&apos;s dashboard. All changes are tracked in the audit logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
