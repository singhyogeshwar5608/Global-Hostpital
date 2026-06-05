"use client";

import React, { useState } from "react";
import {
  useDoctorStore,
  type AuditAction,
} from "@/store/doctor-store";
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Monitor,
  MapPin,
  Clock,
  User,
  LogIn,
  LogOut,
  Eye,
  Edit3,
  FileText,
  FlaskConical,
  Video,
  CreditCard,
  CalendarDays,
  Settings,
  Stethoscope,
} from "lucide-react";

const actionLabels: Record<AuditAction, { label: string; icon: React.ElementType; color: string }> = {
  login: { label: "Login", icon: LogIn, color: "bg-green-100 text-green-700" },
  logout: { label: "Logout", icon: LogOut, color: "bg-gray-100 text-gray-600" },
  patientViewed: { label: "Patient Viewed", icon: Eye, color: "bg-blue-100 text-blue-700" },
  patientEdited: { label: "Patient Edited", icon: Edit3, color: "bg-amber-100 text-amber-700" },
  prescriptionCreated: { label: "Prescription Created", icon: FileText, color: "bg-purple-100 text-purple-700" },
  reportViewed: { label: "Report Viewed", icon: FlaskConical, color: "bg-teal/10 text-teal" },
  meetingCreated: { label: "Meeting Created", icon: Video, color: "bg-indigo-100 text-indigo-700" },
  paymentViewed: { label: "Payment Viewed", icon: CreditCard, color: "bg-yellow-100 text-yellow-700" },
  profileUpdated: { label: "Profile Updated", icon: Settings, color: "bg-pink-100 text-pink-700" },
  scheduleUpdated: { label: "Schedule Updated", icon: CalendarDays, color: "bg-cyan-100 text-cyan-700" },
  permissionChanged: { label: "Permission Changed", icon: ShieldCheck, color: "bg-red-100 text-red-700" },
  statusChanged: { label: "Status Changed", icon: User, color: "bg-orange-100 text-orange-700" },
};

export default function DoctorAuditLogs() {
  const { auditLogs, doctors } = useDoctorStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterAction, setFilterAction] = useState("");

  const filtered = auditLogs.filter((log) => {
    const matchesSearch = log.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);
    const matchesDoctor = !filterDoctor || log.doctorId === filterDoctor;
    const matchesAction = !filterAction || log.action === filterAction;
    return matchesSearch && matchesDoctor && matchesAction;
  });

  const uniqueActions = [...new Set(auditLogs.map((l) => l.action))];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Doctor Audit Logs</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Track all doctor activities and access ({auditLogs.length} entries)
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e3a5f] text-white">
          <ShieldCheck size={16} />
          <span className="text-sm font-semibold">Super Admin</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <LogIn size={14} className="text-green-500" />
            <span className="text-xs text-gray-500 font-medium">Logins</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{auditLogs.filter((l) => l.action === "login").length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={14} className="text-blue-500" />
            <span className="text-xs text-gray-500 font-medium">Patients Viewed</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{auditLogs.filter((l) => l.action === "patientViewed").length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={14} className="text-purple-500" />
            <span className="text-xs text-gray-500 font-medium">Prescriptions</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{auditLogs.filter((l) => l.action === "prescriptionCreated").length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Monitor size={14} className="text-amber-500" />
            <span className="text-xs text-gray-500 font-medium">Total Activities</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{auditLogs.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor, details, IP..."
            className="w-full h-11 rounded-lg bg-white border border-gray-200 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
          />
        </div>
        <select
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
          className="h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
        >
          <option value="">All Doctors</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
        >
          <option value="">All Actions</option>
          {uniqueActions.map((a) => (
            <option key={a} value={a}>{actionLabels[a]?.label || a}</option>
          ))}
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Device</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                const actionInfo = actionLabels[log.action];
                const ActionIcon = actionInfo?.icon || Monitor;
                return (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Stethoscope size={12} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-xs">{log.doctorName}</div>
                          <div className="text-[10px] text-gray-400">{log.doctorId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${actionInfo?.color || "bg-gray-100 text-gray-600"}`}>
                        <ActionIcon size={10} />
                        {actionInfo?.label || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px] truncate">{log.details}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-700">{log.date}</div>
                      <div className="text-[10px] text-gray-400">{log.time}</div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{log.device}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={10} />
                        {log.location}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No audit logs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
