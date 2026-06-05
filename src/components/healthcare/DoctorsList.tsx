"use client";

import React, { useState } from "react";
import {
  useDoctorStore,
  type FieldKey,
  type DoctorStatus,
} from "@/store/doctor-store";
import {
  useAppointmentStore,
  dayLabels,
  formatTime,
} from "@/store/appointment-store";
import {
  Search,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Building2,
  DollarSign,
  GraduationCap,
  MapPin,
  Stethoscope,
  X,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Clock,
  CalendarDays,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Shield,
  Lock,
  Unlock,
  ToggleLeft,
  UserCheck,
  UserX,
  KeyRound,
  ExternalLink,
  EyeOff as EyeOffIcon,
  Star,
  Users,
} from "lucide-react";

export default function DoctorsList({
  onAddDoctor,
  onFieldSettings,
  onEditDoctor,
  onScheduleDoctor,
  onPermissions,
  onProfileVisibility,
  onPatientAccess,
  onDoctorPortal,
}: {
  onAddDoctor: () => void;
  onFieldSettings: () => void;
  onEditDoctor: (id: string) => void;
  onScheduleDoctor: (id: string) => void;
  onPermissions: (id: string) => void;
  onProfileVisibility: (id: string) => void;
  onPatientAccess: (id: string) => void;
  onDoctorPortal: (id: string) => void;
}) {
  const { doctors, deleteDoctor, fieldVisibility, setDoctorStatus, resetDoctorPassword } = useDoctorStore();
  const { schedules } = useAppointmentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusMenu, setStatusMenu] = useState<string | null>(null);
  const [passwordReset, setPasswordReset] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteDoctor(id);
    setDeleteConfirm(null);
  };

  const handleStatusChange = (id: string, status: DoctorStatus) => {
    setDoctorStatus(id, status);
    setStatusMenu(null);
  };

  const handleResetPassword = (id: string) => {
    resetDoctorPassword(id, "newTempPass123");
    setPasswordReset(null);
  };

  const getDoctorScheduleStatus = (doctorId: string) => {
    const schedule = schedules.find((s) => s.doctorId === doctorId);
    if (!schedule) return null;
    return schedule;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Doctors</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {doctors.length} doctors registered | {doctors.filter((d) => d.status === "active").length} active | {doctors.filter((d) => d.isOnline).length} online
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onFieldSettings}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
            title="Field Visibility Settings (Super Admin)"
          >
            <Eye size={16} />
            <span className="hidden sm:inline">Field Settings</span>
          </button>
          <button
            onClick={onAddDoctor}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors shadow-lg"
          >
            <Plus size={16} />
            Add Doctor
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, specialty or hospital..."
            className="w-full h-11 rounded-lg bg-white border border-gray-200 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
          />
        </div>
      </div>

      {/* Hidden fields notice */}
      {Object.values(fieldVisibility).some((v) => !v) && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200 mb-5">
          <EyeOff size={14} className="text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">
            Some fields are hidden:{" "}
            {(
              [
                { key: "mobile" as FieldKey, label: "Mobile" },
                { key: "email" as FieldKey, label: "Email" },
                { key: "specialty" as FieldKey, label: "Specialty" },
                { key: "hospitalName" as FieldKey, label: "Hospital" },
                { key: "consultancyFee" as FieldKey, label: "Fee" },
              ].filter((f) => !fieldVisibility[f.key]) as { label: string }[]
            )
              .map((f) => f.label)
              .join(", ")}
          </span>
        </div>
      )}

      {/* Doctors Cards */}
      <div className="space-y-3">
        {filtered.map((doc) => {
          const scheduleStatus = getDoctorScheduleStatus(doc.id);
          const enabledPerms = Object.values(doc.permissions).filter(Boolean).length;
          const totalPerms = Object.keys(doc.permissions).length;
          const isExpanded = expandedRow === doc.id;

          return (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-4">
                  {/* Doctor Photo & Info */}
                  <img src={doc.photo} alt={doc.name} className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{doc.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === "active" ? "bg-green-50 text-green-700" :
                        doc.status === "suspended" ? "bg-red-50 text-red-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {doc.status === "active" ? <CheckCircle2 size={8} /> : <XCircle size={8} />}
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                      {doc.isOnline && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                          Online
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold">
                        <Stethoscope size={8} /> {doc.specialty}
                      </span>
                      <span className="text-[10px] text-gray-400">{doc.qualification}</span>
                      {fieldVisibility.hospitalName && <span className="text-[10px] text-gray-400">| {doc.hospitalName}</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-[10px] text-gray-500">
                      {fieldVisibility.consultancyFee && <span className="flex items-center gap-1"><DollarSign size={8} /> ${doc.consultancyFee}</span>}
                      <span className="flex items-center gap-1"><Star size={8} className="text-yellow-500" /> {doc.rating}</span>
                      <span className="flex items-center gap-1"><CalendarDays size={8} /> {doc.totalConsultations} consultations</span>
                      <span className="flex items-center gap-1">
                        <Shield size={8} /> {enabledPerms}/{totalPerms} permissions
                      </span>
                      <span className="flex items-center gap-1">
                        {scheduleStatus ? (
                          <span className="text-green-600"><CheckCircle2 size={8} /> Schedule set</span>
                        ) : (
                          <span className="text-red-500"><XCircle size={8} /> No schedule</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditDoctor(doc.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                      title="Edit doctor"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => onScheduleDoctor(doc.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-teal hover:bg-teal/5 transition-colors"
                      title="Schedule & timing"
                    >
                      <Clock size={15} />
                    </button>
                    <button
                      onClick={() => onPermissions(doc.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-colors"
                      title="Permissions"
                    >
                      <Shield size={15} />
                    </button>
                    <button
                      onClick={() => setExpandedRow(isExpanded ? null : doc.id)}
                      className={`p-2 rounded-lg transition-colors ${isExpanded ? "text-[#1e3a5f] bg-blue-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
                      title="More actions"
                    >
                      <ChevronRight size={15} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Row - Additional Actions */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-3">
                    <button
                      onClick={() => onProfileVisibility(doc.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                    >
                      <Eye size={12} /> Visibility
                    </button>
                    <button
                      onClick={() => onPatientAccess(doc.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors"
                    >
                      <Users size={12} /> Patient Access
                    </button>
                    <button
                      onClick={() => onDoctorPortal(doc.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors"
                    >
                      <ExternalLink size={12} /> Doctor Portal
                    </button>

                    {/* Status Controls */}
                    <div className="relative">
                      <button
                        onClick={() => setStatusMenu(statusMenu === doc.id ? null : doc.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                          doc.status === "active" ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" :
                          doc.status === "suspended" ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" :
                          "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {doc.status === "active" ? <Unlock size={12} /> : <Lock size={12} />}
                        Status: {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </button>
                      {statusMenu === doc.id && (
                        <div className="absolute top-full mt-1 left-0 z-10 bg-white rounded-lg border border-gray-200 shadow-lg py-1 w-40">
                          <button
                            onClick={() => handleStatusChange(doc.id, "active")}
                            className="w-full text-left px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 flex items-center gap-1.5"
                          >
                            <UserCheck size={12} /> Activate
                          </button>
                          <button
                            onClick={() => handleStatusChange(doc.id, "inactive")}
                            className="w-full text-left px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
                          >
                            <UserX size={12} /> Deactivate
                          </button>
                          <button
                            onClick={() => handleStatusChange(doc.id, "suspended")}
                            className="w-full text-left px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 flex items-center gap-1.5"
                          >
                            <Lock size={12} /> Suspend
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setPasswordReset(doc.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-colors"
                    >
                      <KeyRound size={12} /> Reset Password
                    </button>

                    {deleteConfirm === doc.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="px-3 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(doc.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>

                  {/* Permission Summary */}
                  <div className="mt-3 p-3 rounded-lg bg-white border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck size={12} className="text-[#1e3a5f]" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Permission Summary</span>
                      <span className="ml-auto text-[10px] text-gray-400">{enabledPerms} of {totalPerms} enabled</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(doc.permissions).map(([key, value]) => (
                        <span
                          key={key}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                            value ? "bg-green-50 text-green-600" : "bg-red-50 text-red-400"
                          }`}
                        >
                          {value ? "✓" : "✗"} {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <Search size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-600 mb-1">
              {searchQuery ? "No doctors found matching your search." : "No doctors registered yet."}
            </h3>
            <p className="text-sm text-gray-400">Click 'Add Doctor' to get started.</p>
          </div>
        )}
      </div>

      {/* Password Reset Confirmation Modal */}
      {passwordReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <KeyRound size={24} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reset Password?</h3>
              <p className="text-sm text-gray-500 mb-6">
                This will reset the password for {doctors.find((d) => d.id === passwordReset)?.name}. A new temporary password will be assigned.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setPasswordReset(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleResetPassword(passwordReset)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
