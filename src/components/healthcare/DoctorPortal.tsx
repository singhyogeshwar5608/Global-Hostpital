"use client";

import React, { useState } from "react";
import {
  useDoctorStore,
  type PermissionKey,
  type DoctorStatus,
} from "@/store/doctor-store";
import {
  LayoutDashboard,
  Users,
  FileText,
  FlaskConical,
  Video,
  CreditCard,
  DollarSign,
  CalendarDays,
  MessageSquare,
  Upload,
  Clock,
  Stethoscope,
  Settings,
  LogOut,
  X,
  ChevronDown,
  ShieldCheck,
  ShieldOff,
  Eye,
  EyeOff,
  Bell,
  Search,
  Wifi,
  WifiOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
} from "lucide-react";

interface Props {
  doctorId: string;
  onClose: () => void;
}

export default function DoctorPortal({ doctorId, onClose }: Props) {
  const { doctors } = useDoctorStore();
  const doctor = doctors.find((d) => d.id === doctorId);
  const [activeSection, setActiveSection] = useState("dashboard");

  if (!doctor) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#f1f5f9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={40} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Doctor Not Found</h3>
          <button onClick={onClose} className="mt-4 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050]">
            Close
          </button>
        </div>
      </div>
    );
  }

  // Check if doctor is suspended/inactive
  if (doctor.status === "suspended") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#f1f5f9] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
            <Lock size={48} className="text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Suspended</h3>
          <p className="text-gray-500 text-sm mb-2">
            Your account has been suspended by the Super Admin.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Please contact the administration for further assistance.
          </p>
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (doctor.status === "inactive") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#f1f5f9] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-5">
            <XCircle size={48} className="text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Inactive</h3>
          <p className="text-gray-500 text-sm mb-6">
            Your account is currently inactive. Please contact the Super Admin to activate your account.
          </p>
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    );
  }

  const perm = doctor.permissions;
  const pv = doctor.profileVisibility;

  // Sidebar items based on permissions
  const sidebarItems: { icon: React.ElementType; label: string; section: string; permKey?: PermissionKey }[] = [
    { icon: LayoutDashboard, label: "Dashboard", section: "dashboard" },
    { icon: Users, label: "Patients", section: "patients", permKey: "viewPatients" },
    { icon: FileText, label: "Prescriptions", section: "prescriptions", permKey: "createPrescription" },
    { icon: FlaskConical, label: "Lab Tests", section: "lab-tests", permKey: "assignLabTests" },
    { icon: Video, label: "Consultations", section: "consultations", permKey: "videoConsultation" },
    { icon: CalendarDays, label: "Schedule", section: "schedule", permKey: "manageSchedule" },
    { icon: Clock, label: "Follow-Ups", section: "follow-ups", permKey: "manageFollowUps" },
    { icon: CreditCard, label: "Payments", section: "payments", permKey: "viewPayments" },
    { icon: DollarSign, label: "Revenue", section: "revenue", permKey: "viewRevenue" },
    { icon: MessageSquare, label: "Chat", section: "chat", permKey: "chatSystem" },
    { icon: Upload, label: "Documents", section: "documents", permKey: "uploadMedicalDocuments" },
  ];

  // Filter items by permission
  const visibleItems = sidebarItems.filter(
    (item) => !item.permKey || perm[item.permKey]
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#f1f5f9] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center shrink-0">
            <Stethoscope size={18} className="text-white" />
          </div>
          <div className="leading-tight min-w-0">
            <span className="text-sm font-bold block truncate">Doctor Portal</span>
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Global Integrative</span>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={doctor.photo} alt={doctor.name} className="w-10 h-10 rounded-lg object-cover border border-white/20" />
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{doctor.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-white/50">{doctor.specialty}</span>
                {doctor.isOnline ? (
                  <span className="flex items-center gap-0.5 text-[10px] text-green-400"><Wifi size={8} /> Online</span>
                ) : (
                  <span className="flex items-center gap-0.5 text-[10px] text-white/40"><WifiOff size={8} /> Offline</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {visibleItems.map((item) => {
            const isActive = activeSection === item.section;
            return (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-teal/20 text-teal-300"
                    : "text-white/60 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                <item.icon size={18} className="shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.permKey && !perm[item.permKey] && (
                  <Lock size={10} className="text-red-400 ml-auto" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={onClose}
          className="flex items-center justify-center h-12 border-t border-white/10 text-white/40 hover:text-white/70 transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          <span className="text-sm">Exit Portal</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search here..."
                className="h-9 w-64 rounded-lg bg-gray-100 pl-9 pr-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-xs font-bold">
                {doctor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">{doctor.name}</div>
                <div className="text-[10px] text-gray-400">{doctor.specialty}</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === "dashboard" && <DoctorDashboardPage doctor={doctor} />}

          {/* Disabled Permission Pages */}
          {activeSection !== "dashboard" && (() => {
            const item = sidebarItems.find((i) => i.section === activeSection);
            if (item?.permKey && !perm[item.permKey]) {
              return <DisabledModulePage label={item.label} />;
            }
            return <ModulePlaceholder label={item?.label || activeSection} doctor={doctor} />;
          })()}
        </main>
      </div>
    </div>
  );
}

// ─── Doctor Dashboard Page ──────────────────────────────────
function DoctorDashboardPage({ doctor }: { doctor: ReturnType<typeof useDoctorStore.getState>["doctors"][0] }) {
  const perm = doctor.permissions;

  return (
    <>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0f172a] rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          <img src={doctor.photo} alt={doctor.name} className="w-16 h-16 rounded-xl border-2 border-white/20" />
          <div>
            <h2 className="text-xl font-bold">Welcome back, {doctor.name}!</h2>
            <p className="text-white/60 text-sm mt-0.5">{doctor.specialty} | {doctor.hospitalName}</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-bold">{doctor.totalConsultations}</div>
            <div className="text-white/60 text-xs">Total Consultations</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {perm.viewPatients && (
          <MiniStat icon={<Users size={18} />} bg="bg-blue-100" color="text-blue-600" label="My Patients" value={String(doctor.assignedPatientIds.length)} />
        )}
        {perm.viewRevenue && (
          <MiniStat icon={<DollarSign size={18} />} bg="bg-green-100" color="text-green-600" label="Revenue" value={`$${doctor.totalRevenue.toLocaleString()}`} />
        )}
        <MiniStat icon={<Star size={18} />} bg="bg-yellow-100" color="text-yellow-600" label="Rating" value={`${doctor.rating}/5`} />
        <MiniStat icon={<CalendarDays size={18} />} bg="bg-purple-100" color="text-purple-600" label="Consultations" value={String(doctor.totalConsultations)} />
      </div>

      {/* Permission Status */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#1e3a5f]" />
          Your Permissions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {Object.entries(perm).map(([key, value]) => (
            <div
              key={key}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                value ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
              }`}
            >
              {value ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
              {key.replace(/([A-Z])/g, " $1").trim()}
            </div>
          ))}
        </div>
      </div>

      {/* Profile Visibility */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
          <Eye size={16} className="text-[#1e3a5f]" />
          Profile Visibility (Controlled by Super Admin)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {Object.entries(doctor.profileVisibility).map(([key, value]) => (
            <div
              key={key}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                value ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-gray-50 text-gray-400 border border-gray-100"
              }`}
            >
              {value ? <Eye size={10} /> : <EyeOff size={10} />}
              {key.replace(/([A-Z])/g, " $1").trim()}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Disabled Module Page ───────────────────────────────────
function DisabledModulePage({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-5">
        <Lock size={36} className="text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{label} - Access Denied</h3>
      <p className="text-gray-500 text-sm mb-2 max-w-md text-center">
        This module has been disabled by the Super Admin. You do not have permission to access this section.
      </p>
      <p className="text-gray-400 text-xs">
        Contact the Super Admin to request access to this module.
      </p>
    </div>
  );
}

// ─── Module Placeholder ─────────────────────────────────────
function ModulePlaceholder({ label, doctor }: { label: string; doctor: ReturnType<typeof useDoctorStore.getState>["doctors"][0] }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{label}</h2>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{label} Module</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Welcome to the {label} module, {doctor.name}. This module is enabled by the Super Admin. Full functionality coming soon.
        </p>
      </div>
    </div>
  );
}

// ─── Mini Stat Card ─────────────────────────────────────────
function MiniStat({ icon, bg, color, label, value }: { icon: React.ReactNode; bg: string; color: string; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color} shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] text-gray-500 font-medium">{label}</div>
        <div className="text-lg font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}
