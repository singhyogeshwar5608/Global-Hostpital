"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  useDoctorStore,
  type PermissionKey,
  type DoctorStatus,
} from "@/store/doctor-store";
import { usePatientStore, type ReferralStatus } from "@/store/patient-store";
import { useLabStore, testCatalog, labTestAvailability } from "@/store/lab-store";
import { useAppointmentStore } from "@/store/appointment-store";
import { useCaseStore } from "@/store/case-store";
import { useMedicineStore } from "@/store/medicine-store";
import {
  LayoutDashboard, Users, FileText, FlaskConical, Video, CreditCard, DollarSign,
  CalendarDays, MessageSquare, Upload, Clock, Stethoscope, Settings, LogOut, X,
  ChevronDown, ShieldCheck, ShieldOff, Eye, EyeOff, Bell, Search, Wifi, WifiOff,
  CheckCircle2, XCircle, AlertTriangle, Lock, Star, User, Phone, Mail, MapPin,
  Calendar, ClipboardList, Pill, Activity, PlusCircle, ArrowRight, BadgeCheck,
  AlertCircle, TestTube2, Heart, HeartPulse, Download, ArrowLeft, ChevronRight,
  Send, FilePlus, Circle, CheckCircle, UserPlus, Award, Zap, TrendingUp, TrendingDown,
  Camera,
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
    { icon: CreditCard, label: "Payments", section: "payments", permKey: "viewPayments" },
    { icon: DollarSign, label: "Revenue", section: "revenue", permKey: "viewRevenue" },
    { icon: Settings, label: "Settings", section: "settings" },
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
          {activeSection === "dashboard" && <DoctorDashboardPage doctor={doctor} onNavigate={setActiveSection} />}
          {activeSection === "patients" && <PatientsPage doctor={doctor} onSelectPatient={() => setActiveSection("patient-detail")} />}
          {activeSection === "patient-detail" && <PatientDetailPage doctor={doctor} onBack={() => setActiveSection("patients")} />}
          {activeSection === "prescriptions" && <PrescriptionsPage doctor={doctor} onSelectPatient={() => setActiveSection("patient-detail")} />}
          {activeSection === "settings" && <SettingsPage doctor={doctor} />}

          {/* Disabled Permission Pages */}
          {activeSection !== "dashboard" && activeSection !== "patients" && activeSection !== "patient-detail" && activeSection !== "prescriptions" && activeSection !== "settings" && (() => {
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
function DoctorDashboardPage({ doctor, onNavigate }: { doctor: ReturnType<typeof useDoctorStore.getState>["doctors"][0]; onNavigate?: (section: string) => void }) {
  const { patients, labReferrals, pharmacyReferrals } = usePatientStore();
  const { submissions } = useCaseStore();
  const { bookedSlots } = useAppointmentStore();
  const today = new Date().toISOString().split("T")[0];

  const doctorPatients = patients.filter((p) =>
    doctor.assignedPatientIds.includes(p.id) ||
    submissions.some((s) => s.patientId === p.id && s.doctorId === doctor.id)
  );

  const doctorAppts = bookedSlots.filter((b) => b.doctorId === doctor.id);
  const todaysAppts = doctorAppts.filter((b) => b.date === today);
  const doctorCases = submissions.filter((s) => s.doctorId === doctor.id);
  const doctorLabRefs = labReferrals.filter((r) => r.doctorId === doctor.id);
  const doctorPharmRefs = pharmacyReferrals.filter((r) => r.doctorId === doctor.id);

  const pendingConsults = doctorAppts.filter((b) => b.status === "pending" || b.status === "confirmed");
  const completedConsults = doctorAppts.filter((b) => b.status === "completed");
  const activeLabRefs = doctorLabRefs.filter((r) => r.status === "referred" || r.status === "accepted" || r.status === "in_progress");
  const activePharmRefs = doctorPharmRefs.filter((r) => r.status === "referred" || r.status === "processing");
  const reportsAwaiting = doctorLabRefs.filter((r) => r.status === "report_uploaded" || (r.status === "completed" && !r.reportId));
  const todaysPrescriptions = doctorPharmRefs.filter((r) => r.createdAt.startsWith(today));
  const todaysRegistrations = patients.filter((p) => p.createdAt.startsWith(today) && (doctor.assignedPatientIds.includes(p.id) || submissions.some((s) => s.patientId === p.id && s.doctorId === doctor.id)));
  const todaysUploads = doctorLabRefs.filter((r) => r.reportUploadedAt?.startsWith(today));

  // Activity feed
  const activityFeed = [
    ...doctorAppts.map((b) => ({ time: b.updatedAt, text: `${b.patientName} - ${b.status === "confirmed" ? "Appointment confirmed" : b.status === "completed" ? "Consultation completed" : "Appointment booked"}`, type: "appointment" as const, patient: b.patientName })),
    ...doctorLabRefs.map((r) => ({ time: r.updatedAt, text: `${r.patientName} - Lab referral ${r.status === "completed" ? "completed" : r.status === "accepted" ? "accepted" : "sent to " + r.labName}`, type: "lab" as const, patient: r.patientName })),
    ...doctorPharmRefs.map((r) => ({ time: r.updatedAt, text: `${r.patientName} - Prescription ${r.status === "completed" ? "fulfilled" : "sent to " + r.storeName}`, type: "pharmacy" as const, patient: r.patientName })),
    ...doctorCases.filter((s) => s.status === "completed").map((s) => ({ time: s.updatedAt, text: `${s.patientId} - Case completed: ${s.specialtyName}`, type: "case" as const, patient: s.patientId })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 20);

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now"; if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60); if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24); if (days < 7) return `${days}d ago`;
    return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Top medicines
  const medCount: Record<string, { count: number; last: string }> = {};
  doctorPharmRefs.forEach((r) => r.medicineNames.forEach((m) => {
    if (!medCount[m]) medCount[m] = { count: 0, last: r.createdAt };
    medCount[m].count++; if (r.createdAt > medCount[m].last) medCount[m].last = r.createdAt;
  }));
  const topMeds = Object.entries(medCount).sort((a, b) => b[1].count - a[1].count).slice(0, 10);

  // Top tests
  const testCount: Record<string, number> = {};
  doctorLabRefs.forEach((r) => r.selectedTests.forEach((t) => { testCount[t] = (testCount[t] || 0) + 1; }));
  const topTests = Object.entries(testCount).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div className="space-y-5">
      {/* ═══ SECTION 1: Welcome + KPI Cards ═══ */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0f172a] rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4">
          <img src={doctor.photo} alt={doctor.name} className="w-12 h-12 rounded-xl border-2 border-white/20" />
          <div>
            <h2 className="text-lg font-bold">Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {doctor.name.split(" ")[0]}!</h2>
            <p className="text-white/50 text-xs">{doctor.specialty} | {doctor.hospitalName}</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-bold">{doctor.totalConsultations}</div>
            <div className="text-white/40 text-[10px]">Total Consultations</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        <div onClick={() => onNavigate?.("patients")} className="cursor-pointer"><MiniStat icon={<Users size={15} />} bg="bg-blue-50" color="text-blue-600" label="Total Patients" value={String(doctorPatients.length)} /></div>
        <MiniStat icon={<Calendar size={15} />} bg="bg-teal-50" color="text-teal-600" label="Today's Appts" value={String(todaysAppts.length)} />
        <MiniStat icon={<Clock size={15} />} bg="bg-yellow-50" color="text-yellow-600" label="Pending Consults" value={String(pendingConsults.length)} />
        <MiniStat icon={<CheckCircle2 size={15} />} bg="bg-green-50" color="text-green-600" label="Completed" value={String(completedConsults.length)} />
        <div onClick={() => onNavigate?.("patients")} className="cursor-pointer"><MiniStat icon={<FlaskConical size={15} />} bg="bg-purple-50" color="text-purple-600" label="Active Lab Ref." value={String(activeLabRefs.length)} /></div>
        <div onClick={() => onNavigate?.("patients")} className="cursor-pointer"><MiniStat icon={<Pill size={15} />} bg="bg-rose-50" color="text-rose-600" label="Active Pharm Ref." value={String(activePharmRefs.length)} /></div>
        <MiniStat icon={<FileText size={15} />} bg="bg-orange-50" color="text-orange-600" label="Reports Awaiting" value={String(reportsAwaiting.length)} />
        <div onClick={() => onNavigate?.("prescriptions")} className="cursor-pointer"><MiniStat icon={<FilePlus size={15} />} bg="bg-indigo-50" color="text-indigo-600" label="Rx Today" value={String(todaysPrescriptions.length)} /></div>
      </div>

      {/* ═══ SECTION 2: Today's Workflow Summary ═══ */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5"><Activity size={14} className="text-blue-600" /> Today's Workflow</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: UserPlus, label: "Registered", value: todaysRegistrations.length, color: "text-blue-600", bg: "bg-blue-50" },
            { icon: CheckCircle2, label: "Consulted", value: completedConsults.length, color: "text-green-600", bg: "bg-green-50" },
            { icon: FilePlus, label: "Prescriptions", value: todaysPrescriptions.length, color: "text-purple-600", bg: "bg-purple-50" },
            { icon: FlaskConical, label: "Lab Referred", value: doctorLabRefs.filter((r) => r.createdAt.startsWith(today)).length, color: "text-orange-600", bg: "bg-orange-50" },
            { icon: Upload, label: "Reports Uploaded", value: todaysUploads.length, color: "text-teal-600", bg: "bg-teal-50" },
            { icon: Pill, label: "Pharm Referred", value: doctorPharmRefs.filter((r) => r.createdAt.startsWith(today)).length, color: "text-rose-600", bg: "bg-rose-50" },
            { icon: Award, label: "Completed", value: doctorCases.filter((s) => s.status === "completed" && s.updatedAt.startsWith(today)).length, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((w) => (
            <div key={w.label} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 bg-white min-w-[120px]">
              <div className={`w-7 h-7 rounded-lg ${w.bg} flex items-center justify-center ${w.color} shrink-0`}><w.icon size={14} /></div>
              <div className="leading-tight"><div className="text-sm font-bold text-gray-900">{w.value}</div><div className="text-[9px] text-gray-400 whitespace-nowrap">{w.label}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 3: Main Grid (Appointments + Activity + Reports) ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5"><Calendar size={13} className="text-blue-600" /> Today's Appointments</h3>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{todaysAppts.length}</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
            {todaysAppts.length === 0 ? (
              <div className="p-6 text-center"><p className="text-xs text-gray-400">No appointments today</p></div>
            ) : todaysAppts.sort((a, b) => a.time.localeCompare(b.time)).map((appt) => {
              const statusCls = appt.status === "confirmed" ? "bg-green-100 text-green-700" : appt.status === "pending" ? "bg-yellow-100 text-yellow-700" : appt.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700";
              return (
                <div key={appt.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[8px] font-bold shrink-0">
                    {appt.patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0 leading-tight">
                    <div className="text-xs font-semibold text-gray-900 truncate">{appt.patientName}</div>
                    <div className="flex items-center gap-2 text-[9px] text-gray-400">
                      <span>{appt.time}</span>
                      <span>|</span>
                      <span>{appt.specialty || "Consultation"}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${statusCls}`}>{appt.status}</span>
                  <button className="w-6 h-6 rounded flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors shrink-0"><Eye size={11} /></button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5"><Activity size={13} className="text-blue-600" /> Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
            {activityFeed.length === 0 ? (
              <div className="p-6 text-center"><p className="text-xs text-gray-400">No recent activity</p></div>
            ) : activityFeed.map((act, i) => {
              const typeColor = act.type === "appointment" ? "text-blue-500" : act.type === "lab" ? "text-purple-500" : act.type === "pharmacy" ? "text-green-500" : "text-gray-500";
              return (
                <div key={i} className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${typeColor}`} />
                  <div className="flex-1 min-w-0 leading-tight">
                    <p className="text-[11px] text-gray-700 truncate">{act.text}</p>
                    <p className="text-[9px] text-gray-400">{timeAgo(act.time)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reports Awaiting Review */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5"><FileText size={13} className="text-orange-600" /> Reports Awaiting Review</h3>
            <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{reportsAwaiting.length}</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
            {reportsAwaiting.length === 0 ? (
              <div className="p-6 text-center"><p className="text-xs text-gray-400">No pending reports</p></div>
            ) : reportsAwaiting.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0"><FileText size={13} /></div>
                <div className="flex-1 min-w-0 leading-tight">
                  <div className="text-xs font-semibold text-gray-900 truncate">{r.patientName}</div>
                  <div className="text-[9px] text-gray-400">{r.labName} | {new Date(r.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
                <button className="px-2 py-1 rounded text-[9px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors shrink-0">Review</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SECTION 4: Active Referrals Grid ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Active Lab Referrals */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5"><FlaskConical size={13} className="text-purple-600" /> Active Lab Referrals</h3>
            <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{activeLabRefs.length}</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-[240px] overflow-y-auto">
            {activeLabRefs.length === 0 ? (
              <div className="p-6 text-center"><p className="text-xs text-gray-400">No active lab referrals</p></div>
            ) : activeLabRefs.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 shrink-0"><FlaskConical size={13} /></div>
                <div className="flex-1 min-w-0 leading-tight">
                  <div className="text-xs font-semibold text-gray-900 truncate">{r.patientName}</div>
                  <div className="text-[9px] text-gray-400">{r.labName} | {r.selectedTests.length} test{(r.selectedTests.length > 1 ? "s" : "")}</div>
                </div>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 whitespace-nowrap">{r.status.replace(/_/g, " ")}</span>
                <button className="w-6 h-6 rounded flex items-center justify-center text-purple-500 hover:bg-purple-50 transition-colors shrink-0"><Eye size={11} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Pharmacy Referrals */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5"><Pill size={13} className="text-rose-600" /> Active Medical Store Referrals</h3>
            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{activePharmRefs.length}</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-[240px] overflow-y-auto">
            {activePharmRefs.length === 0 ? (
              <div className="p-6 text-center"><p className="text-xs text-gray-400">No active pharmacy referrals</p></div>
            ) : activePharmRefs.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0"><Pill size={13} /></div>
                <div className="flex-1 min-w-0 leading-tight">
                  <div className="text-xs font-semibold text-gray-900 truncate">{r.patientName}</div>
                  <div className="text-[9px] text-gray-400">{r.storeName} | {r.medicineNames.length} medicine{r.medicineNames.length > 1 ? "s" : ""}</div>
                </div>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 whitespace-nowrap">{r.status}</span>
                <button className="w-6 h-6 rounded flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors shrink-0"><Eye size={11} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SECTION 5: Pipeline + Top Meds + Top Tests Grid ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Patient Pipeline */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5"><Activity size={13} className="text-blue-600" /> Patient Pipeline</h3>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { label: "Registered", count: doctorPatients.length, pct: 100, color: "bg-blue-500" },
              { label: "Consulted", count: completedConsults.length, pct: Math.round((completedConsults.length / Math.max(doctorPatients.length, 1)) * 100), color: "bg-green-500" },
              { label: "Rx Created", count: doctorPharmRefs.length, pct: Math.round((doctorPharmRefs.length / Math.max(doctorPatients.length, 1)) * 100), color: "bg-purple-500" },
              { label: "Lab Referred", count: doctorLabRefs.length, pct: Math.round((doctorLabRefs.length / Math.max(doctorPatients.length, 1)) * 100), color: "bg-orange-500" },
              { label: "Reports", count: doctorLabRefs.filter((r) => r.reportId || r.status === "completed").length, pct: Math.round((doctorLabRefs.filter((r) => r.reportId || r.status === "completed").length / Math.max(doctorPatients.length, 1)) * 100), color: "bg-teal-500" },
              { label: "Pharm Ref.", count: doctorPharmRefs.filter((r) => r.status === "completed").length, pct: Math.round((doctorPharmRefs.filter((r) => r.status === "completed").length / Math.max(doctorPatients.length, 1)) * 100), color: "bg-rose-500" },
              { label: "Completed", count: doctorCases.filter((s) => s.status === "completed").length, pct: Math.round((doctorCases.filter((s) => s.status === "completed").length / Math.max(doctorPatients.length, 1)) * 100), color: "bg-emerald-500" },
            ].map((stage) => (
              <div key={stage.label} className="flex flex-col items-center gap-1 min-w-[60px]">
                <div className={`w-8 h-8 rounded-full ${stage.color} text-white flex items-center justify-center text-[9px] font-bold shadow-sm`}>{stage.count}</div>
                <div className="text-[8px] text-gray-400 font-medium text-center leading-tight">{stage.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Prescribed Medicines */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50"><h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5"><Pill size={13} className="text-purple-600" /> Top Prescribed Medicines</h3></div>
          <div className="divide-y divide-gray-50 max-h-[220px] overflow-y-auto">
            {topMeds.length === 0 ? (
              <div className="p-6 text-center"><p className="text-xs text-gray-400">No prescriptions yet</p></div>
            ) : topMeds.map(([name, data], i) => (
              <div key={name} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                <span className="w-4 text-[9px] font-semibold text-gray-400 text-right">{i + 1}.</span>
                <div className="flex-1 min-w-0 leading-tight">
                  <div className="text-xs font-medium text-gray-900 truncate">{name}</div>
                  <div className="text-[9px] text-gray-400">Last: {timeAgo(data.last)}</div>
                </div>
                <span className="text-xs font-bold text-gray-900">{data.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recommended Tests */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50"><h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5"><FlaskConical size={13} className="text-orange-600" /> Top Recommended Tests</h3></div>
          <div className="divide-y divide-gray-50 max-h-[220px] overflow-y-auto">
            {topTests.length === 0 ? (
              <div className="p-6 text-center"><p className="text-xs text-gray-400">No lab referrals yet</p></div>
            ) : topTests.map(([name, count], i) => (
              <div key={name} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                <span className="w-4 text-[9px] font-semibold text-gray-400 text-right">{i + 1}.</span>
                <div className="flex-1 min-w-0"><div className="text-xs font-medium text-gray-900 truncate">{name}</div></div>
                <span className="text-xs font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SECTION 6: Quick Actions ═══ */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5"><Zap size={13} className="text-yellow-500" /> Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { icon: Users, label: "View Patients", section: "patients", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: FilePlus, label: "Create Prescription", section: "prescriptions", color: "text-purple-600", bg: "bg-purple-50" },
            { icon: FlaskConical, label: "Lab Referrals", section: "patients", color: "text-rose-600", bg: "bg-rose-50" },
            { icon: Pill, label: "Medical Store Ref.", section: "patients", color: "text-green-600", bg: "bg-green-50" },
          ].map((action) => (
            <button key={action.label} onClick={() => onNavigate?.(action.section)} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-semibold ${action.bg} ${action.color} hover:opacity-80 transition-all border border-transparent hover:border-current cursor-pointer`}>
              <action.icon size={13} /> {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 7: Recent Patients Table ═══ */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5"><Users size={13} className="text-blue-600" /> Recent Patients</h3>
          <button onClick={() => onNavigate?.("patients")} className="text-[10px] font-semibold text-blue-600 hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-3 py-2 font-semibold text-gray-500">Patient</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-500">ID</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-500">Latest Appointment</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-500">Status</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-500">Activity</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {doctorPatients.slice(0, 10).map((p) => {
                const appt = doctorAppts.filter((b) => b.patientName.toLowerCase() === p.fullName.toLowerCase()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                const status = appt?.status || "no_appointment";
                const statusCls = status === "completed" ? "bg-green-100 text-green-700" : status === "confirmed" ? "bg-blue-100 text-blue-700" : status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500";
                return (
                  <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-3 py-2"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[7px] font-bold shrink-0">{p.fullName.charAt(0)}</div><span className="font-medium text-gray-900">{p.fullName}</span></div></td>
                    <td className="px-3 py-2 text-gray-400 font-mono">{p.id}</td>
                    <td className="px-3 py-2 text-gray-600">{appt ? new Date(appt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</td>
                    <td className="px-3 py-2"><span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold ${statusCls}`}>{status.replace(/_/g, " ")}</span></td>
                    <td className="px-3 py-2 text-gray-400 text-[10px]">{timeAgo(p.updatedAt)}</td>
                  </tr>
                );
              })}
              {doctorPatients.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-400 text-xs">No patients assigned yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
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

// ─── Patients Page ──────────────────────────────────────────
function PatientsPage({ doctor, onSelectPatient }: { doctor: ReturnType<typeof useDoctorStore.getState>["doctors"][0]; onSelectPatient: () => void }) {
  const { patients, labReferrals, pharmacyReferrals } = usePatientStore();
  const { submissions } = useCaseStore();
  const { bookedSlots } = useAppointmentStore();
  const today = new Date().toISOString().split("T")[0];

  const [searchQ, setSearchQ] = useState("");
  const [filterConsultStatus, setFilterConsultStatus] = useState("");
  const [filterLabStatus, setFilterLabStatus] = useState("");
  const [filterPharmStatus, setFilterPharmStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [labReferralDetail, setLabReferralDetail] = useState<typeof labReferrals[0] | null>(null);
  const [pharmReferralDetail, setPharmReferralDetail] = useState<typeof pharmacyReferrals[0] | null>(null);

  const doctorPatients = patients.filter((p) =>
    doctor.assignedPatientIds.includes(p.id) ||
    submissions.some((s) => s.patientId === p.id && s.doctorId === doctor.id)
  );

  const patientRows = doctorPatients.map((p) => {
    const pSubs = submissions.filter((s) => s.patientId === p.id);
    const pAppts = bookedSlots.filter(
      (b) => b.doctorId === doctor.id && b.patientName.toLowerCase() === p.fullName.toLowerCase()
    );
    const latestAppt = pAppts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const pLabRefs = labReferrals.filter((r) => r.patientId === p.id && r.doctorId === doctor.id);
    const lastLab = pLabRefs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    const pPharmRefs = pharmacyReferrals.filter((r) => r.patientId === p.id && r.doctorId === doctor.id);
    const lastPharm = pPharmRefs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    const latestSub = pSubs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

    const consultStatus = latestAppt?.status || (latestSub ? "pending_review" : "no_appointment");
    const prescriptionStatus = pPharmRefs.length > 0 ? "sent" : "not_created";
    const labStatus = pLabRefs.length > 0 ? lastLab?.status || "referred" : "not_referred";
    const pharmStatus = pPharmRefs.length > 0 ? lastPharm?.status || "referred" : "not_referred";
    const reportCount = p.reports.length;
    const lastActivity = latestSub?.updatedAt || latestAppt?.updatedAt || p.updatedAt;

    const progress = [
      latestSub ? "done" : "todo",
      consultStatus === "completed" || consultStatus === "confirmed" ? "done" : consultStatus === "pending" || consultStatus === "pending_review" ? "pending" : "todo",
      prescriptionStatus === "sent" ? "done" : prescriptionStatus === "not_created" ? "todo" : "pending",
      labStatus === "completed" ? "done" : labStatus === "referred" || labStatus === "accepted" || labStatus === "in_progress" || labStatus === "report_uploaded" ? "pending" : "todo",
      labStatus === "report_uploaded" || labStatus === "completed" ? "done" : labStatus !== "not_referred" ? "pending" : "todo",
      pharmStatus === "completed" ? "done" : pharmStatus === "referred" || pharmStatus === "processing" ? "pending" : "todo",
    ];

    const age = p.dateOfBirth ? Math.floor((new Date().getTime() - new Date(p.dateOfBirth).getTime()) / 31557600000) : null;

    const timeAgo = (ts: string) => {
      const diff = Date.now() - new Date(ts).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins} min ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
      const days = Math.floor(hrs / 24);
      if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
      return new Date(ts).toLocaleDateString();
    };

    return {
      patient: p, subs: pSubs, appts: pAppts, latestAppt,
      consultStatus, prescriptionStatus, labStatus, pharmStatus,
      lastLabStatus: lastLab?.status || "", lastPharmStatus: lastPharm?.status || "",
      reportCount, lastActivity: timeAgo(lastActivity), lastActivityRaw: lastActivity,
      progress, pLabRefs, pPharmRefs, age,
    };
  });

  let filtered = patientRows.filter((r) => {
    const q = searchQ.toLowerCase();
    if (q && !r.patient.fullName.toLowerCase().includes(q) && !r.patient.id.toLowerCase().includes(q) && !r.patient.mobileNumber.includes(q)) return false;
    if (filterConsultStatus && r.consultStatus !== filterConsultStatus) return false;
    if (filterLabStatus && r.labStatus !== filterLabStatus) return false;
    if (filterPharmStatus && r.pharmStatus !== filterPharmStatus) return false;
    if (filterDateFrom && r.latestAppt && r.latestAppt.date < filterDateFrom) return false;
    if (filterDateTo && r.latestAppt && r.latestAppt.date > filterDateTo) return false;
    return true;
  });

  filtered.sort((a, b) => {
    let cmp = 0;
    if (sortField === "name") cmp = a.patient.fullName.localeCompare(b.patient.fullName);
    else if (sortField === "id") cmp = a.patient.id.localeCompare(b.patient.id);
    else if (sortField === "date") cmp = (a.latestAppt?.date || "").localeCompare(b.latestAppt?.date || "");
    else if (sortField === "status") cmp = a.consultStatus.localeCompare(b.consultStatus);
    else if (sortField === "activity") cmp = a.lastActivityRaw.localeCompare(b.lastActivityRaw);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const todayAppts = patientRows.filter((r) => r.latestAppt?.date === today);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const resetFilters = () => {
    setSearchQ(""); setFilterConsultStatus(""); setFilterLabStatus(""); setFilterPharmStatus("");
    setFilterDateFrom(""); setFilterDateTo(""); setPage(0);
  };

  const SortIcon = ({ field }: { field: string }) => (
    <span className="inline-block ml-1 text-[9px] text-gray-300">
      {sortField === field ? (sortDir === "asc" ? "\u25B2" : "\u25BC") : "\u25B4\u25BE"}
    </span>
  );

  const badge = (s: string, m: Record<string, { label: string; cls: string }>, fallback: string) => {
    const c = m[s] || { label: fallback, cls: "bg-gray-100 text-gray-500" };
    return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.cls}`}>{c.label}</span>;
  };

  const consultMap: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "In Consultation", cls: "bg-blue-100 text-blue-700" },
    completed: { label: "Completed", cls: "bg-green-100 text-green-700" },
    pending: { label: "Pending Review", cls: "bg-orange-100 text-orange-700" },
    pending_review: { label: "Pending Review", cls: "bg-orange-100 text-orange-700" },
    cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-700" },
    no_appointment: { label: "No Appointment", cls: "bg-gray-100 text-gray-500" },
  };

  const statusDot = (s: string, doneLbl: string, pendingLbl: string, todoLbl: string) => {
    const done = ["completed", "sent", "done", "report_uploaded"];
    const pend = ["pending", "referred", "accepted", "in_progress", "processing", "draft"];
    if (done.includes(s)) return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200"><CheckCircle2 size={10} />{doneLbl}</span>;
    if (pend.includes(s)) return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200"><Clock size={10} />{pendingLbl}</span>;
    return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200"><XCircle size={10} />{todoLbl}</span>;
  };

  const progressSteps = [
    { key: "R", label: "Registration" },
    { key: "C", label: "Consultation" },
    { key: "P", label: "Prescription" },
    { key: "L", label: "Lab Referral" },
    { key: "RP", label: "Report Upload" },
    { key: "PH", label: "Pharmacy" },
  ];

  const getUnifiedStatus = (r: any) => {
    const statusMap: [string, string, string][] = [
      ["completed", "Completed", "bg-green-100 text-green-700 border-green-200"],
      ["completed", "Completed", "bg-green-100 text-green-700 border-green-200"],
      ["sent", "Medical Store Referred", "bg-rose-100 text-rose-700 border-rose-200"],
      ["report_uploaded", "Report Uploaded", "bg-purple-100 text-purple-700 border-purple-200"],
      ["referred", "Lab Referred", "bg-blue-100 text-blue-700 border-blue-200"],
      ["accepted", "Lab Referred", "bg-blue-100 text-blue-700 border-blue-200"],
      ["in_progress", "Lab In Progress", "bg-indigo-100 text-indigo-700 border-indigo-200"],
      ["processing", "Pharmacy Processing", "bg-amber-100 text-amber-700 border-amber-200"],
      ["sent", "Prescription Created", "bg-teal-100 text-teal-700 border-teal-200"],
      ["confirmed", "In Consultation", "bg-blue-100 text-blue-700 border-blue-200"],
      ["pending", "In Consultation", "bg-blue-100 text-blue-700 border-blue-200"],
      ["pending_review", "Pending Review", "bg-orange-100 text-orange-700 border-orange-200"],
      ["draft", "Draft", "bg-gray-100 text-gray-600 border-gray-200"],
    ];
    for (const [key, label, cls] of statusMap) {
      if (r.consultStatus === key || r.pharmStatus === key || r.labStatus === key || r.prescriptionStatus === key) {
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls}`}>{label}</span>;
      }
    }
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">Pending</span>;
  };

  if (selectedPatientId) {
    return <PatientDetailPage doctor={doctor} patientId={selectedPatientId} onBack={() => setSelectedPatientId(null)} />;
  }

  return (
    <div>
      {/* ═══ Page Header ═══ */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Patients</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage and monitor all your patients</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all">
          <PlusCircle size={16} /> Add New Patient
        </button>
      </div>

      {/* ═══ KPI Cards ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          { icon: Users, label: "Total Patients", value: String(doctorPatients.length), growth: "+2", sub: "This month", bg: "bg-blue-50", color: "text-blue-600" },
          { icon: Calendar, label: "Today's Appointments", value: String(todayAppts.length), growth: todayAppts.length > 0 ? "+" + todayAppts.length : "0", sub: "Scheduled", bg: "bg-teal-50", color: "text-teal-600" },
          { icon: Clock, label: "Pending Consultations", value: String(patientRows.filter((r) => r.consultStatus === "pending" || r.consultStatus === "pending_review").length), growth: "", sub: "Awaiting review", bg: "bg-orange-50", color: "text-orange-600" },
          { icon: FlaskConical, label: "Lab Referrals Pending", value: String(patientRows.filter((r) => r.labStatus === "referred" || r.labStatus === "accepted" || r.labStatus === "in_progress").length), growth: "", sub: "In progress", bg: "bg-purple-50", color: "text-purple-600" },
          { icon: Pill, label: "Pharmacy Ref. Pending", value: String(patientRows.filter((r) => r.pharmStatus === "referred" || r.pharmStatus === "processing").length), growth: "", sub: "Awaiting pickup", bg: "bg-rose-50", color: "text-rose-600" },
          { icon: CheckCircle2, label: "Completed Consultations", value: String(patientRows.filter((r) => r.consultStatus === "completed").length), growth: "+5", sub: "This week", bg: "bg-green-50", color: "text-green-600" },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>
                <card.icon size={18} />
              </div>
              {card.growth && <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{card.growth}</span>}
            </div>
            <div className="text-xl font-bold text-gray-900">{card.value}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{card.label}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* ═══ Filters ═══ */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQ} onChange={(e) => { setSearchQ(e.target.value); setPage(0); }} placeholder="Search by name, ID or mobile..." className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <select value={filterConsultStatus} onChange={(e) => { setFilterConsultStatus(e.target.value); setPage(0); }} className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[140px]">
            <option value="">Consultation Status</option>
            <option value="pending_review">Pending Review</option>
            <option value="confirmed">In Consultation</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={filterLabStatus} onChange={(e) => { setFilterLabStatus(e.target.value); setPage(0); }} className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[130px]">
            <option value="">Lab Status</option>
            <option value="not_referred">Not Referred</option>
            <option value="referred">Referred</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select value={filterPharmStatus} onChange={(e) => { setFilterPharmStatus(e.target.value); setPage(0); }} className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[130px]">
            <option value="">Pharmacy Status</option>
            <option value="not_referred">Not Referred</option>
            <option value="referred">Referred</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
          <input type="date" value={filterDateFrom} onChange={(e) => { setFilterDateFrom(e.target.value); setPage(0); }} className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-[130px]" title="From date" />
          <input type="date" value={filterDateTo} onChange={(e) => { setFilterDateTo(e.target.value); setPage(0); }} className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-[130px]" title="To date" />
          <button onClick={resetFilters} className="h-10 px-4 rounded-lg text-xs font-semibold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">Reset</button>
        </div>
      </div>

      {/* ═══ Table ═══ */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-[11px] border-collapse" style={{ tableLayout: "auto" }}>
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="w-px px-1 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider select-none cursor-pointer hover:text-gray-900 border-r border-gray-200" onClick={() => toggleSort("name")}>Patient</th>
                <th className="w-px px-1 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider select-none cursor-pointer hover:text-gray-900 border-r border-gray-200" onClick={() => toggleSort("date")}>Appointment Date</th>
                <th className="w-px px-1 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider select-none border-r border-gray-200">Prescription</th>
                <th className="w-px px-1 py-1 text-center text-xs font-bold text-gray-700 uppercase tracking-wider select-none border-r border-gray-200">Lab Referral</th>
                <th className="w-px px-1 py-1 text-center text-xs font-bold text-gray-700 uppercase tracking-wider select-none border-r border-gray-200">Medical Store</th>
                <th className="w-px px-1 py-1 text-center text-xs font-bold text-gray-700 uppercase tracking-wider select-none border-r border-gray-200">Reports</th>
                <th className="w-px px-1 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider select-none cursor-pointer hover:text-gray-900 border-r border-gray-200" onClick={() => toggleSort("activity")}>Last Activity</th>
                <th className="w-px px-1 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider select-none border-r border-gray-200">Status</th>
                <th className="w-px px-1 py-1 text-center text-xs font-bold text-gray-700 uppercase tracking-wider select-none">View / Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((r, idx) => (
                <tr key={r.patient.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"} hover:bg-blue-50/30 border-b border-gray-100`}>
                  <td className="px-1 py-1 whitespace-nowrap border-r border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[7px] font-bold shrink-0 shadow-sm">
                        {r.patient.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="leading-tight">
                        <div className="text-[11px] font-semibold text-gray-900 leading-none">{r.patient.fullName}</div>
                        <div className="text-[9px] text-gray-400 leading-tight">{r.patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-1 py-1 text-[11px] text-gray-800 font-medium whitespace-nowrap border-r border-gray-100">{r.latestAppt ? new Date(r.latestAppt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                  <td className="px-1 py-1 whitespace-nowrap border-r border-gray-100">{statusDot(r.prescriptionStatus, "Sent", "Draft", "—")}</td>
                  <td className="px-1 py-1 text-center whitespace-nowrap border-r border-gray-100">
                    {r.pLabRefs.length > 0 ? (
                      <button onClick={() => setLabReferralDetail(r.pLabRefs[0])} className="w-5 h-5 rounded inline-flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors mx-auto" title="View Lab Referral"><Eye size={12} /></button>
                    ) : <span className="text-[10px] text-gray-300">—</span>}
                  </td>
                  <td className="px-1 py-1 text-center whitespace-nowrap border-r border-gray-100">
                    {r.pPharmRefs.length > 0 ? (
                      <button onClick={() => setPharmReferralDetail(r.pPharmRefs[0])} className="w-5 h-5 rounded inline-flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors mx-auto" title="View Pharmacy Referral"><Eye size={12} /></button>
                    ) : <span className="text-[10px] text-gray-300">—</span>}
                  </td>
                  <td className="px-1 py-1 text-center text-[11px] text-gray-800 font-medium whitespace-nowrap border-r border-gray-100">{r.reportCount}</td>
                  <td className="px-1 py-1 text-[9px] text-gray-400 whitespace-nowrap border-r border-gray-100">{r.lastActivity}</td>
                  <td className="px-1 py-1 whitespace-nowrap border-r border-gray-100">{getUnifiedStatus(r)}</td>
                  <td className="px-1 py-1 whitespace-nowrap text-center">
                    <div className="inline-flex items-center justify-center gap-1">
                      <button onClick={() => { setSelectedPatientId(r.patient.id); }} className="w-6 h-6 rounded flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200" title="View Patient"><Eye size={13} /></button>
                      <button onClick={() => { setSelectedPatientId(r.patient.id); }} className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200" title="Edit Patient"><FileText size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paged.length === 0 && (
          <div className="text-center py-12">
            <Users size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">No patients match your filters</p>
          </div>
        )}

        {/* ═══ Pagination & Progress Legend ═══ */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4 text-[10px] text-gray-500">
            <span className="font-medium text-gray-600">Progress:</span>
            {progressSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-bold text-white ${i === 0 ? "bg-green-500" : "bg-gray-300"}`}>{i === 0 ? "\u2713" : step.key}</div>
                <span>{step.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{filtered.length} patients</span>
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0); }} className="h-7 rounded-lg bg-white border border-gray-200 px-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value={10}>10 / page</option>
              <option value={15}>15 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <div className="flex items-center gap-0.5">
              <button onClick={() => setPage(0)} disabled={page === 0} className="w-7 h-7 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 disabled:opacity-20 transition-colors">{"<<"}</button>
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="w-7 h-7 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 disabled:opacity-20 transition-colors">{"<"}</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(0, Math.min(page - 2, totalPages - 5));
                const p = start + i;
                if (p >= totalPages) return null;
                return <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${page === p ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}>{p + 1}</button>;
              })}
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="w-7 h-7 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 disabled:opacity-20 transition-colors">{">"}</button>
              <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="w-7 h-7 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 disabled:opacity-20 transition-colors">{">>"}</button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Lab Referral Detail Modal ═══ */}
      {labReferralDetail && (
        <div className="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4" onClick={() => setLabReferralDetail(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FlaskConical size={18} className="text-purple-600" />
                <h3 className="text-base font-bold text-gray-900">Lab Referral Details</h3>
              </div>
              <button onClick={() => setLabReferralDetail(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Patient</p><p className="font-medium text-gray-900">{labReferralDetail.patientName}</p></div>
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Lab</p><p className="font-medium text-gray-900">{labReferralDetail.labName}</p></div>
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Doctor</p><p className="font-medium text-gray-900">{labReferralDetail.doctorName}</p></div>
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Status</p><StatusBadge status={labReferralDetail.status} /></div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase mb-2">Selected Tests</p>
                <div className="flex flex-wrap gap-1.5">
                  {labReferralDetail.selectedTests.map((test, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200"><Activity size={12} />{test}</span>
                  ))}
                </div>
              </div>
              {labReferralDetail.testInstructions && (
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase mb-1">Instructions</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{labReferralDetail.testInstructions}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 pt-2 border-t border-gray-50">
                <p>Created: {new Date(labReferralDetail.createdAt).toLocaleDateString()}</p>
                <p>ID: {labReferralDetail.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Pharmacy Referral Detail Modal ═══ */}
      {pharmReferralDetail && (
        <div className="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4" onClick={() => setPharmReferralDetail(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Pill size={18} className="text-rose-600" />
                <h3 className="text-base font-bold text-gray-900">Pharmacy Referral Details</h3>
              </div>
              <button onClick={() => setPharmReferralDetail(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Patient</p><p className="font-medium text-gray-900">{pharmReferralDetail.patientName}</p></div>
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Store</p><p className="font-medium text-gray-900">{pharmReferralDetail.storeName}</p></div>
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Doctor</p><p className="font-medium text-gray-900">{pharmReferralDetail.doctorName}</p></div>
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Status</p><StatusBadge status={pharmReferralDetail.status} /></div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase mb-2">Prescribed Medicines</p>
                <div className="space-y-1.5">
                  {pharmReferralDetail.medicineNames.map((med, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50">
                      <Pill size={14} className="text-rose-500 shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{med}</span>
                    </div>
                  ))}
                </div>
              </div>
              {pharmReferralDetail.prescriptionNotes && (
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase mb-1">Notes</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{pharmReferralDetail.prescriptionNotes}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 pt-2 border-t border-gray-50">
                <p>Created: {new Date(pharmReferralDetail.createdAt).toLocaleDateString()}</p>
                <p>ID: {pharmReferralDetail.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Status Badge Helper ═══ */}
    </div>
  );
}

// ═══ Referral Status Badge ═══
function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700", accepted: "bg-blue-100 text-blue-700",
    in_progress: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls[status] || "bg-gray-100 text-gray-600"}`}>{status.replace(/_/g, " ")}</span>;
}

// ─── Patient Detail Page ─────────────────────────────────────
function PatientDetailPage({ doctor, patientId, onBack }: { doctor: ReturnType<typeof useDoctorStore.getState>["doctors"][0]; patientId?: string; onBack: () => void }) {
  const { patients, labReferrals, pharmacyReferrals, createLabReferral, createPharmacyReferral } = usePatientStore();
  const { labs } = useLabStore();
  const { medicines, medicalStores } = useMedicineStore();
  const { bookedSlots } = useAppointmentStore();

  const [selectedPatient, setSelectedPatient] = useState(() => patients.find((p) => p.id === patientId));
  const [searchP, setSearchP] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const filteredPatients = patients.filter((p) =>
    p.fullName.toLowerCase().includes(searchP.toLowerCase()) || p.id.toLowerCase().includes(searchP.toLowerCase())
  );

  const [showLabForm, setShowLabForm] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState("");
  const [labInstructions, setLabInstructions] = useState("");
  const [labSearch, setLabSearch] = useState("");
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [testSearch, setTestSearch] = useState("");
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const [labAssignments, setLabAssignments] = useState<Record<string, string[]>>({});
  const [showSummary, setShowSummary] = useState(false);
  const testDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (testDropdownRef.current && !testDropdownRef.current.contains(e.target as Node)) {
        setShowTestDropdown(false);
      }
      if (medSearchRef.current && !medSearchRef.current.contains(e.target as Node)) {
        setMedSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const [showPharmForm, setShowPharmForm] = useState(false);
  const [selectedMedIds, setSelectedMedIds] = useState<string[]>([]);
  const [rxNotes, setRxNotes] = useState("");
  const [pharmSearch, setPharmSearch] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [dosages, setDosages] = useState<Record<string, string>>({});
  const [frequencies, setFrequencies] = useState<Record<string, string>>({});
  const [durations, setDurations] = useState<Record<string, string>>({});
  const [customMeds, setCustomMeds] = useState<{ id: string; name: string; dosage: string; frequency: string; duration: string }[]>([]);
  const [customMedInput, setCustomMedInput] = useState("");
  const [medSearchFocused, setMedSearchFocused] = useState(false);
  const medSearchRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showNewMedModal, setShowNewMedModal] = useState(false);
  const [newMedName, setNewMedName] = useState("");
  const [newMedDosageType, setNewMedDosageType] = useState("Tablet");
  const [newMedStrength, setNewMedStrength] = useState("");
  const [newMedNotes, setNewMedNotes] = useState("");
  const [showNewTestModal, setShowNewTestModal] = useState(false);
  const [newTestName, setNewTestName] = useState("");
  const [newTestCategory, setNewTestCategory] = useState("");
  const [newTestDesc, setNewTestDesc] = useState("");
  const [newTestInstructions, setNewTestInstructions] = useState("");

  const getPersonalMeds = (): { id: string; name: string }[] => {
    try { return JSON.parse(localStorage.getItem(`dr_meds_${doctor.id}`) || "[]"); } catch { return []; }
  };
  const savePersonalMed = (name: string) => {
    const list = getPersonalMeds();
    if (!list.some((m) => m.name.toLowerCase() === name.toLowerCase())) {
      list.push({ id: `CUST-MED-${Date.now()}`, name });
      localStorage.setItem(`dr_meds_${doctor.id}`, JSON.stringify(list));
    }
  };
  const getPersonalTests = (): { id: string; name: string; category: string }[] => {
    try { return JSON.parse(localStorage.getItem(`dr_tests_${doctor.id}`) || "[]"); } catch { return []; }
  };
  const savePersonalTest = (name: string, category: string) => {
    const list = getPersonalTests();
    if (!list.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      list.push({ id: `CUST-TEST-${Date.now()}`, name, category });
      localStorage.setItem(`dr_tests_${doctor.id}`, JSON.stringify(list));
    }
  };

  if (!selectedPatient) {
    return (
      <div>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-blue-600 font-semibold mb-4 hover:underline"><ArrowRight size={14} className="rotate-180" /> Back</button>
        <div className="relative w-full max-w-xs mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchP} onChange={(e) => setSearchP(e.target.value)} placeholder="Search patient..." className="w-full h-10 rounded-lg bg-white border border-gray-200 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="space-y-2">
          {filteredPatients.map((p) => (
            <button key={p.id} onClick={() => setSelectedPatient(p)} className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all text-left">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold shrink-0">{p.fullName.charAt(0)}</div>
              <div><div className="text-sm font-semibold text-gray-900">{p.fullName}</div><div className="text-xs text-gray-400 font-mono">{p.id}</div></div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const patientLabRefs = labReferrals.filter((r) => r.patientId === selectedPatient.id && r.doctorId === doctor.id);
  const patientPharmRefs = pharmacyReferrals.filter((r) => r.patientId === selectedPatient.id && r.doctorId === doctor.id);
  const patientBookings = bookedSlots.filter((b) => b.patientName.toLowerCase() === selectedPatient.fullName.toLowerCase());
  const filteredLabs = labs.filter((l) => l.isActive && (!labSearch || l.labName.toLowerCase().includes(labSearch.toLowerCase()) || l.district.toLowerCase().includes(labSearch.toLowerCase())));
  const filteredTests = [...testCatalog, ...getPersonalTests()].filter((t) => !testSearch || t.name.toLowerCase().includes(testSearch.toLowerCase()) || t.category.toLowerCase().includes(testSearch.toLowerCase()));
  const toggleTest = (testId: string) => setSelectedTestIds((p) => p.includes(testId) ? p.filter((x) => x !== testId) : [...p, testId]);
  const personalMeds = getPersonalMeds();
  const filteredMeds = [...medicines.filter((m) => m.isActive), ...personalMeds].filter((m) => !pharmSearch || m.name.toLowerCase().includes(pharmSearch.toLowerCase()));
  const filteredStores = medicalStores.filter((s) => s.isActive && (!storeSearch || s.name.toLowerCase().includes(storeSearch.toLowerCase()) || s.city.toLowerCase().includes(storeSearch.toLowerCase())));
  const nearbyStores = medicalStores.filter((s) => s.isActive && s.state === selectedPatient.state);
  const currentBooking = patientBookings[0];
  const nearbyLabs = labs.filter((l) => l.isActive && l.state === selectedPatient.state);

  const handleLabReferral = () => {
    if (!selectedLabId || selectedTestIds.length === 0) return;
    const lab = labs.find((l) => l.id === selectedLabId);
    if (!lab) return;
    const getTestName = (tid: string) => [...testCatalog, ...getPersonalTests()].find((t) => t.id === tid)?.name || tid;
    const testNames = selectedTestIds.map(getTestName).join(", ");
    createLabReferral({ patientId: selectedPatient.id, patientName: selectedPatient.fullName, doctorId: doctor.id, doctorName: doctor.name, labId: selectedLabId, labName: lab.labName, selectedTests: selectedTestIds, testInstructions: `Tests: ${testNames}` });
    setShowLabForm(false); setSelectedTestIds([]); setSelectedLabId(""); setTestSearch(""); setLabSearch("");
  };

  const handlePharmReferral = () => {
    if ((selectedMedIds.length === 0 && customMeds.length === 0) || !selectedStoreId) return;
    const selectedMeds = medicines.filter((m) => selectedMedIds.includes(m.id));
    const store = medicalStores.find((s) => s.id === selectedStoreId);
    const allMedNames = [...selectedMeds.map((m) => m.name), ...customMeds.map((m) => `${m.name} (Custom)`)];

    let notes = `Dosages: ${Object.entries(dosages).map(([k, v]) => `${k}=${v}`).join(", ")}`;
    notes += ` | Frequencies: ${Object.entries(frequencies).map(([k, v]) => `${k}=${v}`).join(", ")}`;
    notes += ` | Durations: ${Object.entries(durations).map(([k, v]) => `${k}=${v}`).join(", ")}`;
    if (customMeds.length) notes += ` | Custom: ${customMeds.map((m) => `${m.name} (${m.dosage}/${m.frequency}/${m.duration})`).join("; ")}`;
    notes += ` | Notes: ${rxNotes}`;

    createPharmacyReferral({ patientId: selectedPatient.id, patientName: selectedPatient.fullName, doctorId: doctor.id, doctorName: doctor.name, medicineIds: selectedMedIds, medicineNames: allMedNames, prescriptionNotes: notes, storeId: selectedStoreId, storeName: store?.name || "" });
    setShowPharmForm(false); setSelectedMedIds([]); setCustomMeds([]); setRxNotes(""); setSelectedStoreId(""); setDosages({}); setFrequencies({}); setDurations({}); setPharmSearch(""); setStoreSearch("");
  };

  const toggleMed = (id: string) => setSelectedMedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const statusBadge = (status: string) => {
    const m: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", accepted: "bg-blue-100 text-blue-700", in_progress: "bg-purple-100 text-purple-700", completed: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };
    return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m[status] || m.pending}`}>{status.replace(/_/g, " ")}</span>;
  };

  const openPrescriptionPDF = (refId: string) => {
    const ref = pharmacyReferrals.find((r) => r.id === refId) || patientPharmRefs.find((r) => r.id === refId);
    if (!ref) return;
    const p = selectedPatient;
    const getTestName2 = (tid: string) => [...testCatalog, ...getPersonalTests()].find((t) => t.id === tid)?.name || tid;
    const label = (l: string, v: string) => `<div style="font-size:8px;color:#888;text-transform:uppercase;letter-spacing:0.5px">${l}</div><div style="font-size:11px;font-weight:600;color:#222">${v}</div>`;
    const medRows = ref.medicineNames.map((name, i) => `<tr><td style="padding:3px 6px;border:1px solid #d0d0d0;font-size:10px;color:#555;width:20px;text-align:center">${i + 1}</td><td style="padding:3px 6px;border:1px solid #d0d0d0;font-size:11px;font-weight:500;color:#222">${name}</td></tr>`).join("");
    const labRefRows = patientLabRefs.map((r) => `<tr><td style="padding:3px 6px;border:1px solid #d0d0d0;font-size:11px;font-weight:500;color:#1e3a5f">${r.labName}</td><td style="padding:3px 6px;border:1px solid #d0d0d0;font-size:10px;color:#444">${r.selectedTests.map((t) => getTestName2(t)).join(", ")}</td></tr>`).join("");
    const pharmRefRows = patientPharmRefs.map((r) => `<tr><td style="padding:3px 6px;border:1px solid #d0d0d0;font-size:11px;font-weight:500;color:#1e3a5f">${r.storeName}</td><td style="padding:3px 6px;border:1px solid #d0d0d0;font-size:10px;color:#444">${r.medicineNames.join(", ")}</td></tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Consultation - ${p.id}</title><style>
      @page{size:A4;margin:18mm 15mm 12mm 15mm}
      body{font-family:'Segoe UI',Arial,Helvetica,sans-serif;color:#222;font-size:11px;line-height:1.45;max-width:740px;margin:0 auto;padding:0}
      .letterhead{text-align:center;padding-bottom:12px;border-bottom:2.5px solid #1e3a5f;margin-bottom:14px}
      .letterhead h1{font-size:20px;margin:0;color:#1e3a5f;letter-spacing:1.5px;font-weight:700}
      .letterhead p{font-size:9.5px;color:#777;margin:2px 0}
      .doc-row{display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid #eee}
      .doc-id{font-size:9px;color:#999;margin-top:2px}
      .section-title{font-size:10px;font-weight:700;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;border-bottom:1.5px solid #e0e7ef;padding-bottom:4px;margin:12px 0 8px 0}
      .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-bottom:6px}
      .chip{display:inline-block;background:#f0f4f9;padding:2px 8px;border-radius:10px;font-size:10px;color:#1e3a5f;margin:2px 3px 2px 0;border:1px solid #dce3ec}
      table{width:100%;border-collapse:collapse;margin-bottom:10px}
      th{background:#f5f7fa;padding:4px 6px;border:1px solid #d0d0d0;font-size:9px;font-weight:700;color:#444;text-align:left;text-transform:uppercase;letter-spacing:0.3px}
      td{padding:3px 6px;border:1px solid #d0d0d0;font-size:11px}
      .assessment-box{background:#f7faff;border:1.5px solid #c5d5e8;border-radius:5px;padding:10px 12px;margin-bottom:10px;border-left:4px solid #1e3a5f}
      .assessment-box div{font-size:11px;color:#222;margin:3px 0}
      .assessment-box .alabel{font-size:9px;color:#1e3a5f;font-weight:700;text-transform:uppercase;letter-spacing:0.3px}
      .signature-area{text-align:right;padding-top:14px;border-top:1px solid #ddd;margin-top:16px}
      .signature-line{display:inline-block;width:170px;border-top:1.5px solid #555;margin:8px 0 4px 0}
      .qr-placeholder{display:inline-flex;align-items:center;gap:8px;font-size:9px;color:#999;border:1px dashed #ccc;padding:6px 10px;border-radius:4px;margin-top:6px}
      .footer-note{text-align:center;font-size:8px;color:#bbb;margin-top:12px;border-top:1px solid #eee;padding-top:6px}
    </style></head><body>
      <div class="letterhead"><h1>Global Integrative Clinic</h1><p>123 Healthcare Boulevard, Suite 400, New York, NY 10001</p><p>Phone: +1 (800) 123-4567 | Email: info@globalintegrativeclinic.com</p></div>
      <div class="doc-row"><div><strong style="font-size:13px;color:#1e3a5f">${doctor.name}</strong><br><span style="font-size:10px;color:#555">${doctor.qualification} | ${doctor.specialty}</span><br><span style="font-size:9px;color:#777">${doctor.hospitalName}</span><div class="doc-id">Reg. No: ${doctor.id} | Email: ${doctor.email}</div></div><div style="text-align:right"><div style="font-size:10px;color:#555"><strong>Date:</strong> ${new Date().toLocaleDateString("en-US",{day:"numeric",month:"long",year:"numeric"})}</div><div style="font-size:9px;color:#888">Consultation ID: ${ref.id}</div></div></div>
      <div style="background:#f5f8fc;border-radius:5px;padding:8px 12px;margin-bottom:10px;border:1px solid #e0e7ef">
        <div style="font-size:9px;font-weight:700;color:#1e3a5f;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">Patient Snapshot</div>
        <div class="grid-2">${label("Name", p.fullName)}${label("ID", p.id)}${label("Age / Gender", `${age ?? "—"} yrs / ${p.gender}`)}${label("Blood Group", p.bloodGroup || "—")}${label("Mobile", p.mobileNumber)}${label("Email", p.email)}</div>
        <div style="font-size:10px;color:#555;margin-top:2px"><strong>Address:</strong> ${p.address}, ${p.city}, ${p.state} ${p.pinCode}</div>
      </div>
      <div class="section-title">Chief Complaint</div><div class="assessment-box">${p.symptoms ? `<div class="alabel">Symptoms</div><div>${p.symptoms}</div>` : ""}${p.complaint ? `<div class="alabel" style="margin-top:4px">Complaint</div><div>${p.complaint}</div>` : ""}${p.diseaseDetails ? `<div class="alabel" style="margin-top:4px">Diagnosis / Reason</div><div>${p.diseaseDetails}</div>` : ""}</div>
      ${p.medicalHistory || p.allergies || p.currentMedications ? `<div class="section-title">Medical History</div><div style="margin-bottom:8px">${p.medicalHistory ? `<div style="margin:2px 0;font-size:10.5px"><strong>Past History:</strong> ${p.medicalHistory}</div>` : ""}${p.allergies ? `<span class="chip">Allergies: ${p.allergies}</span>` : ""}${p.currentMedications ? `<span class="chip">Current Meds: ${p.currentMedications}</span>` : ""}</div>` : ""}
      <div class="section-title">Doctor Assessment</div>
      <div class="assessment-box"><div class="alabel">Diagnosis</div><div style="font-size:12px;font-weight:600;color:#1e3a5f;margin-bottom:6px">${p.diseaseDetails || "Not specified"}</div>${rxNotes ? `<div class="alabel" style="margin-top:6px">Recommendations</div><div>${rxNotes}</div>` : ""}</div>
      ${medRows ? `<div class="section-title">Prescribed Medicines</div><table><thead><tr><th style="width:24px">#</th><th>Medicine</th></tr></thead><tbody>${medRows}</tbody></table>` : ""}
      ${patientLabRefs.length > 0 ? `<div class="section-title">Lab Referral</div><table><thead><tr><th>Lab</th><th>Assigned Tests</th></tr></thead><tbody>${labRefRows}</tbody></table>` : ""}
      ${patientPharmRefs.length > 0 ? `<div class="section-title">Medical Store Referral</div><table><thead><tr><th>Store</th><th>Medicines</th></tr></thead><tbody>${pharmRefRows}</tbody></table>` : ""}
      ${ref.prescriptionNotes ? `<div style="background:#f9f9f9;padding:8px 10px;border-radius:4px;font-size:10.5px;margin-bottom:8px;border-left:3px solid #1e3a5f"><strong style="font-size:9px;color:#1e3a5f;text-transform:uppercase">Additional Notes</strong><br>${ref.prescriptionNotes.replace(/\|/g, "<br>")}</div>` : ""}
      <div class="signature-area"><div><strong style="font-size:12px;color:#222">${doctor.name}</strong></div><div class="signature-line"></div><div style="font-size:10px;color:#888">Doctor's Signature</div><div style="font-size:9px;color:#aaa;margin-top:6px">Digitally Generated Document</div><div class="qr-placeholder"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Verify at: clinic.example.com/verify/${ref.id}</div></div>
      <div class="footer-note">This is a computer-generated consultation document. No signature required for electronic validation. | Consultation ID: ${ref.id}</div>
    </body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); }
  };

  const downloadPrescriptionPDF = (refId: string) => {
    const ref = pharmacyReferrals.find((r) => r.id === refId) || patientPharmRefs.find((r) => r.id === refId);
    if (!ref) return;
    const p = selectedPatient;
    const getTestName2 = (tid: string) => [...testCatalog, ...getPersonalTests()].find((t) => t.id === tid)?.name || tid;
    const label = (l: string, v: string) => `<div style="font-size:8px;color:#888;text-transform:uppercase;letter-spacing:0.5px">${l}</div><div style="font-size:11px;font-weight:600;color:#222">${v}</div>`;
    const medRows = ref.medicineNames.map((name, i) => `<tr><td style="padding:3px 6px;border:1px solid #d0d0d0;font-size:10px;color:#555;width:20px;text-align:center">${i + 1}</td><td style="padding:3px 6px;border:1px solid #d0d0d0;font-size:11px;font-weight:500;color:#222">${name}</td></tr>`).join("");
    const labRefRows = patientLabRefs.map((r) => `<tr><td style="padding:3px 6px;border:1px solid #d0d0d0;font-size:11px;font-weight:500;color:#1e3a5f">${r.labName}</td><td style="padding:3px 6px;border:1px solid #d0d0d0;font-size:10px;color:#444">${r.selectedTests.map((t) => getTestName2(t)).join(", ")}</td></tr>`).join("");
    const pharmRefRows = patientPharmRefs.map((r) => `<tr><td style="padding:3px 6px;border:1px solid #d0d0d0;font-size:11px;font-weight:500;color:#1e3a5f">${r.storeName}</td><td style="padding:3px 6px;border:1px solid #d0d0d0;font-size:10px;color:#444">${r.medicineNames.join(", ")}</td></tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Consultation - ${p.id}</title><style>
      @page{size:A4;margin:18mm 15mm 12mm 15mm}
      body{font-family:'Segoe UI',Arial,Helvetica,sans-serif;color:#222;font-size:11px;line-height:1.45;max-width:740px;margin:0 auto;padding:0}
      .letterhead{text-align:center;padding-bottom:12px;border-bottom:2.5px solid #1e3a5f;margin-bottom:14px}
      .letterhead h1{font-size:20px;margin:0;color:#1e3a5f;letter-spacing:1.5px;font-weight:700}
      .letterhead p{font-size:9.5px;color:#777;margin:2px 0}
      .doc-row{display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid #eee}
      .doc-id{font-size:9px;color:#999;margin-top:2px}
      .section-title{font-size:10px;font-weight:700;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;border-bottom:1.5px solid #e0e7ef;padding-bottom:4px;margin:12px 0 8px 0}
      .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-bottom:6px}
      .chip{display:inline-block;background:#f0f4f9;padding:2px 8px;border-radius:10px;font-size:10px;color:#1e3a5f;margin:2px 3px 2px 0;border:1px solid #dce3ec}
      table{width:100%;border-collapse:collapse;margin-bottom:10px}
      th{background:#f5f7fa;padding:4px 6px;border:1px solid #d0d0d0;font-size:9px;font-weight:700;color:#444;text-align:left;text-transform:uppercase;letter-spacing:0.3px}
      td{padding:3px 6px;border:1px solid #d0d0d0;font-size:11px}
      .assessment-box{background:#f7faff;border:1.5px solid #c5d5e8;border-radius:5px;padding:10px 12px;margin-bottom:10px;border-left:4px solid #1e3a5f}
      .assessment-box div{font-size:11px;color:#222;margin:3px 0}
      .assessment-box .alabel{font-size:9px;color:#1e3a5f;font-weight:700;text-transform:uppercase;letter-spacing:0.3px}
      .signature-area{text-align:right;padding-top:14px;border-top:1px solid #ddd;margin-top:16px}
      .signature-line{display:inline-block;width:170px;border-top:1.5px solid #555;margin:8px 0 4px 0}
      .qr-placeholder{display:inline-flex;align-items:center;gap:8px;font-size:9px;color:#999;border:1px dashed #ccc;padding:6px 10px;border-radius:4px;margin-top:6px}
      .footer-note{text-align:center;font-size:8px;color:#bbb;margin-top:12px;border-top:1px solid #eee;padding-top:6px}
      @media print{body{padding:0}}
    </style></head><body>
      <div class="letterhead"><h1>Global Integrative Clinic</h1><p>123 Healthcare Boulevard, Suite 400, New York, NY 10001</p><p>Phone: +1 (800) 123-4567 | Email: info@globalintegrativeclinic.com</p></div>
      <div class="doc-row"><div><strong style="font-size:13px;color:#1e3a5f">${doctor.name}</strong><br><span style="font-size:10px;color:#555">${doctor.qualification} | ${doctor.specialty}</span><br><span style="font-size:9px;color:#777">${doctor.hospitalName}</span><div class="doc-id">Reg. No: ${doctor.id} | Email: ${doctor.email}</div></div><div style="text-align:right"><div style="font-size:10px;color:#555"><strong>Date:</strong> ${new Date().toLocaleDateString("en-US",{day:"numeric",month:"long",year:"numeric"})}</div><div style="font-size:9px;color:#888">Consultation ID: ${ref.id}</div></div></div>
      <div style="background:#f5f8fc;border-radius:5px;padding:8px 12px;margin-bottom:10px;border:1px solid #e0e7ef">
        <div style="font-size:9px;font-weight:700;color:#1e3a5f;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">Patient Snapshot</div>
        <div class="grid-2">${label("Name", p.fullName)}${label("ID", p.id)}${label("Age / Gender", `${age ?? "—"} yrs / ${p.gender}`)}${label("Blood Group", p.bloodGroup || "—")}${label("Mobile", p.mobileNumber)}${label("Email", p.email)}</div>
        <div style="font-size:10px;color:#555;margin-top:2px"><strong>Address:</strong> ${p.address}, ${p.city}, ${p.state} ${p.pinCode}</div>
      </div>
      <div class="section-title">Chief Complaint</div><div class="assessment-box">${p.symptoms ? `<div class="alabel">Symptoms</div><div>${p.symptoms}</div>` : ""}${p.complaint ? `<div class="alabel" style="margin-top:4px">Complaint</div><div>${p.complaint}</div>` : ""}${p.diseaseDetails ? `<div class="alabel" style="margin-top:4px">Diagnosis / Reason</div><div>${p.diseaseDetails}</div>` : ""}</div>
      ${p.medicalHistory || p.allergies || p.currentMedications ? `<div class="section-title">Medical History</div><div style="margin-bottom:8px">${p.medicalHistory ? `<div style="margin:2px 0;font-size:10.5px"><strong>Past History:</strong> ${p.medicalHistory}</div>` : ""}${p.allergies ? `<span class="chip">Allergies: ${p.allergies}</span>` : ""}${p.currentMedications ? `<span class="chip">Current Meds: ${p.currentMedications}</span>` : ""}</div>` : ""}
      <div class="section-title">Doctor Assessment</div>
      <div class="assessment-box"><div class="alabel">Diagnosis</div><div style="font-size:12px;font-weight:600;color:#1e3a5f;margin-bottom:6px">${p.diseaseDetails || "Not specified"}</div>${rxNotes ? `<div class="alabel" style="margin-top:6px">Recommendations</div><div>${rxNotes}</div>` : ""}</div>
      ${medRows ? `<div class="section-title">Prescribed Medicines</div><table><thead><tr><th style="width:24px">#</th><th>Medicine</th></tr></thead><tbody>${medRows}</tbody></table>` : ""}
      ${patientLabRefs.length > 0 ? `<div class="section-title">Lab Referral</div><table><thead><tr><th>Lab</th><th>Assigned Tests</th></tr></thead><tbody>${labRefRows}</tbody></table>` : ""}
      ${patientPharmRefs.length > 0 ? `<div class="section-title">Medical Store Referral</div><table><thead><tr><th>Store</th><th>Medicines</th></tr></thead><tbody>${pharmRefRows}</tbody></table>` : ""}
      ${ref.prescriptionNotes ? `<div style="background:#f9f9f9;padding:8px 10px;border-radius:4px;font-size:10.5px;margin-bottom:8px;border-left:3px solid #1e3a5f"><strong style="font-size:9px;color:#1e3a5f;text-transform:uppercase">Additional Notes</strong><br>${ref.prescriptionNotes.replace(/\|/g, "<br>")}</div>` : ""}
      <div class="signature-area"><div><strong style="font-size:12px;color:#222">${doctor.name}</strong></div><div class="signature-line"></div><div style="font-size:10px;color:#888">Doctor's Signature</div><div style="font-size:9px;color:#aaa;margin-top:6px">Digitally Generated Document</div><div class="qr-placeholder"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Verify at: clinic.example.com/verify/${ref.id}</div></div>
      <div class="footer-note">This is a computer-generated consultation document. No signature required for electronic validation. | Consultation ID: ${ref.id}</div>
    </body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `Consultation_${p.id}_${new Date().toISOString().split("T")[0]}.html`;
    a.click(); URL.revokeObjectURL(url);
  };

  const age = selectedPatient.dateOfBirth ? Math.floor((new Date().getTime() - new Date(selectedPatient.dateOfBirth).getTime()) / 31557600000) : null;

  const tabs = [
    { key: "overview", label: "Overview", icon: User },
    { key: "history", label: "Medical History", icon: ClipboardList },
    { key: "questionnaire", label: "Questionnaire", icon: FileText },
    { key: "reports", label: "Reports", icon: Upload },
    { key: "prescriptions", label: "Prescriptions", icon: Pill },
    { key: "notes", label: "Notes", icon: MessageSquare },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">Patients</button>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-gray-800 font-medium">{selectedPatient.fullName}</span>
          <span className="text-xs text-gray-400 font-mono">({selectedPatient.id})</span>
        </div>
      </div>

      {/* ═══ TOP ROW: Patient Summary + Appointment Summary ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Patient Summary Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-sm shrink-0">
              {selectedPatient.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-bold text-gray-900">{selectedPatient.fullName}</h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1.5 text-sm">
                <div><span className="text-gray-400 text-[11px]">Patient ID</span><p className="font-semibold text-gray-800 font-mono text-[13px]">{selectedPatient.id}</p></div>
                <div><span className="text-gray-400 text-[11px]">Age / Gender</span><p className="font-semibold text-gray-800 text-[13px]">{age ?? "—"} yrs / {selectedPatient.gender}</p></div>
                <div><span className="text-gray-400 text-[11px]">Mobile</span><p className="font-semibold text-gray-800 text-[13px]">{selectedPatient.mobileNumber}</p></div>
                <div><span className="text-gray-400 text-[11px]">Email</span><p className="font-semibold text-gray-800 text-[13px] truncate">{selectedPatient.email}</p></div>
                <div className="col-span-2"><span className="text-gray-400 text-[11px]">Address</span><p className="font-semibold text-gray-800 text-[13px]">{selectedPatient.city}, {selectedPatient.state} {selectedPatient.pinCode}</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays size={15} className="text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">Appointment</h3>
          </div>
          {currentBooking ? (
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-400 text-[11px]">Date</span><span className="font-semibold text-gray-800 text-[12px]">{new Date(currentBooking.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 text-[11px]">Time</span><span className="font-semibold text-gray-800 text-[12px]">{currentBooking.time}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 text-[11px]">Type</span><span className="font-semibold text-gray-800 text-[12px]">Video Consultation</span></div>
              <div className="flex justify-between"><span className="text-gray-400 text-[11px]">Payment</span><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentBooking.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{currentBooking.paymentStatus}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400 text-[11px]">Status</span>{statusBadge(currentBooking.status)}</div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No appointment</p>
          )}
        </div>
      </div>

      {/* ═══ QUICK ACTIONS TOOLBAR ═══ */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4 p-2 bg-white rounded-xl border border-gray-100 shadow-sm sticky top-0 z-20">
        <button onClick={() => setShowPharmForm(true)} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg text-[10px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors border border-transparent hover:border-blue-200"><User size={12} /> Edit Patient</button>
        <div className="w-px h-5 bg-gray-200" />
        <button onClick={() => document.getElementById("section-medical")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg text-[10px] font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"><ClipboardList size={12} /> Medical History</button>
        <button onClick={() => document.getElementById("section-questionnaire")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg text-[10px] font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"><FileText size={12} /> Questionnaire</button>
        <button onClick={() => document.getElementById("section-prescriptions")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg text-[10px] font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"><Pill size={12} /> Prescription</button>
        <div className="w-px h-5 bg-gray-200" />
        <button onClick={() => setShowNewTestModal(true)} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg text-[10px] font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors"><FlaskConical size={12} /> Add Test</button>
        <button onClick={() => document.getElementById("section-lab")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg text-[10px] font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors"><FlaskConical size={12} /> Refer Lab</button>
        <button onClick={() => setShowNewMedModal(true)} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg text-[10px] font-semibold text-green-600 bg-green-50 hover:bg-green-100 transition-colors"><PlusCircle size={12} /> Add Medicine</button>
        <button onClick={() => document.getElementById("section-pharmacy")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg text-[10px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"><Pill size={12} /> Refer Store</button>
        <div className="w-px h-5 bg-gray-200" />
        <button onClick={() => document.getElementById("section-notes")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg text-[10px] font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 transition-colors"><MessageSquare size={12} /> Notes</button>
        <div className="flex-1" />
        {submitted && (
          <>
            <button onClick={() => openPrescriptionPDF(patientPharmRefs[0]?.id || "")} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg text-[10px] font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"><FileText size={12} /> View Letterhead</button>
            <button onClick={() => downloadPrescriptionPDF(patientPharmRefs[0]?.id || "")} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg text-[10px] font-semibold text-green-600 bg-green-100 hover:bg-green-200 transition-colors"><Download size={12} /> Download PDF</button>
          </>
        )}
      </div>

      {/* ═══ SECOND ROW: Medical Overview Grid ═══ */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
        {[
          { label: "Blood Group", value: selectedPatient.bloodGroup || "—", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
          { label: "Age", value: age ? `${age} yrs` : "—", icon: User, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Gender", value: selectedPatient.gender, icon: User, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Allergies", value: selectedPatient.allergies || "None", icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Conditions", value: selectedPatient.diseaseDetails || "—", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-50" },
          { label: "Last Visit", value: currentBooking ? new Date(currentBooking.date).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : "—", icon: Calendar, color: "text-teal-500", bg: "bg-teal-50" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
            <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center ${item.color} mb-2`}><item.icon size={14} /></div>
            <div className="text-[10px] text-gray-400 font-medium">{item.label}</div>
            <div className="text-[13px] font-bold text-gray-800 truncate">{item.value}</div>
          </div>
        ))}
      </div>

      {/* ═══ THIRD ROW: Tabs + Content ═══ */}
      <div id="section-medical" className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5">
        <div className="flex items-center gap-1 px-5 pt-4 pb-0 overflow-x-auto border-b border-gray-100">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all whitespace-nowrap ${activeTab === tab.key ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40" : "text-gray-500 hover:text-gray-700"}`}>
              <tab.icon size={13} /> {tab.label}
            </button>
          ))}
        </div>
        <div className="p-5">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><span className="text-[11px] text-gray-400 font-medium">Symptoms</span><p className="text-sm font-medium text-gray-800 mt-0.5">{selectedPatient.symptoms || "None reported"}</p></div>
              <div><span className="text-[11px] text-gray-400 font-medium">Diagnosis</span><p className="text-sm font-medium text-gray-800 mt-0.5">{selectedPatient.diseaseDetails || "Not diagnosed"}</p></div>
              <div className="md:col-span-2"><span className="text-[11px] text-gray-400 font-medium">Current Complaints</span><p className="text-sm font-medium text-gray-800 mt-0.5">{selectedPatient.complaint || "None reported"}</p></div>
            </div>
          )}
          {activeTab === "history" && (
            <div>
              {patientBookings.length > 0 ? (
                <div className="space-y-2">
                  {patientBookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                      <div><span className="font-semibold text-gray-800">{b.doctorName}</span><span className="text-xs text-gray-400 ml-2">{new Date(b.date).toLocaleDateString()}</span></div>
                      {statusBadge(b.status)}
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400">No prior appointments</p>}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl"><span className="text-[11px] text-gray-400 font-medium">Medical History</span><p className="text-sm text-gray-800 mt-0.5">{selectedPatient.medicalHistory || "None recorded"}</p></div>
            </div>
          )}
          {activeTab === "questionnaire" && (
            <div className="space-y-2">
              {selectedPatient.symptoms ? (
                <div className="p-3 bg-gray-50 rounded-xl"><span className="text-[11px] text-gray-400 font-medium">Reported Symptoms</span><p className="text-sm text-gray-800 mt-0.5">{selectedPatient.symptoms}</p></div>
              ) : <p className="text-sm text-gray-400">No questionnaire responses</p>}
            </div>
          )}
          {activeTab === "reports" && (
            <div>
              {selectedPatient.reports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPatient.reports.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                      <div><span className="font-semibold text-gray-800">{r.fileName}</span><span className="text-xs text-gray-400 ml-2">{(r.fileSize / 1024).toFixed(1)} MB</span></div>
                      <button className="text-blue-600 hover:text-blue-800"><Download size={14} /></button>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400">No reports uploaded</p>}
            </div>
          )}
          {activeTab === "prescriptions" && (
            <div>
              {selectedPatient.currentMedications ? (
                <div className="p-3 bg-gray-50 rounded-xl"><span className="text-[11px] text-gray-400 font-medium">Current Medications</span><p className="text-sm text-gray-800 mt-0.5">{selectedPatient.currentMedications}</p></div>
              ) : <p className="text-sm text-gray-400">No prescriptions</p>}
              {patientPharmRefs.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-[11px] text-gray-400 font-medium">Referred Prescriptions</p>
                  {patientPharmRefs.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                      <span className="font-semibold text-gray-800">{r.medicineNames.join(", ").substring(0, 40)}</span>
                      {statusBadge(r.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "notes" && (
            <textarea id="section-notes" placeholder="Add clinical notes for this patient..." rows={4} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
          )}
        </div>
      </div>

      {/* ═══ FOURTH ROW: 2-Column Referral Layout ═══ */}
      <div id="section-lab" className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Lab Referral - Multi-Step */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><FlaskConical size={16} className="text-blue-600" /> Refer to Lab</h3>
            {!showLabForm && <button onClick={() => setShowLabForm(true)} className="text-xs font-semibold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">+ New Referral</button>}
          </div>

          {!showLabForm && nearbyLabs.length > 0 && (
            <div className="mb-3"><p className="text-[10px] text-gray-400 font-medium mb-1.5">Nearby Labs ({selectedPatient.state})</p>
              <div className="flex flex-wrap gap-1.5">{nearbyLabs.slice(0, 4).map((l) => (
                <button key={l.id} onClick={() => { setShowLabForm(true); setLabSearch(l.labName); }} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">{l.labName}</button>
              ))}</div>
            </div>
          )}

          {showLabForm && (
            <div className="space-y-4">
              {/* Step 1: Select Tests */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Step 1: Select Required Tests</label>
                <div className="flex gap-2">
                  <div className="relative flex-1" ref={testDropdownRef}>
                    <input type="text" value={testSearch} onChange={(e) => setTestSearch(e.target.value)} onFocus={() => setShowTestDropdown(true)} placeholder="Search and select tests..." className="w-full h-9 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    {showTestDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-[120] bg-white rounded-xl border border-gray-200 shadow-lg max-h-[200px] overflow-y-auto">
                      {filteredTests.map((t) => (
                        <button key={t.id} type="button" onClick={() => { toggleTest(t.id); setShowTestDropdown(false); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-sm text-left">
                          <input type="checkbox" checked={selectedTestIds.includes(t.id)} onChange={() => {}} className="rounded accent-blue-600 pointer-events-none" />
                          <div className="flex-1 min-w-0"><span className="font-medium text-gray-900">{t.name}</span><span className="text-[10px] text-gray-400 ml-2">{t.category}</span>{getPersonalTests().some((pt) => pt.id === t.id) && <span className="text-[9px] text-yellow-600 font-medium ml-1">Personal</span>}</div>
                        </button>
                      ))}
                      {testSearch.trim().length > 1 && !testCatalog.some((t) => t.name.toLowerCase().includes(testSearch.toLowerCase())) && !getPersonalTests().some((t) => t.name.toLowerCase().includes(testSearch.toLowerCase())) && (
                        <button type="button" onClick={() => { setShowNewTestModal(true); setNewTestName(testSearch.trim()); setShowTestDropdown(false); }} className="w-full px-3 py-2 text-sm text-left text-blue-600 font-semibold hover:bg-blue-50 border-t border-gray-50">
                          + Add "{testSearch.trim()}" as new test
                        </button>
                      )}
                    </div>
                  )}
                </div>
                  <button onClick={() => { setShowNewTestModal(true); setNewTestName(""); setNewTestCategory(""); setNewTestDesc(""); setNewTestInstructions(""); }} className="h-9 px-3 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0">
                    <PlusCircle size={14} /> Add Test
                  </button>
                </div>
                {selectedTestIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedTestIds.map((tid) => {
                      const allTests = [...testCatalog, ...getPersonalTests()];
                      const test = allTests.find((t) => t.id === tid);
                      return (
                        <span key={tid} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {test?.name || tid}
                          <button onClick={() => toggleTest(tid)} className="text-blue-400 hover:text-blue-700">✕</button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 2: Matching Labs (auto-filtered) */}
              {selectedTestIds.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Step 2: Select Lab</label>
                  <p className="text-[10px] text-gray-400 mb-2">Showing only labs that support <strong>all</strong> selected tests.</p>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {(() => {
                      const allTestIds = Object.values(labTestAvailability).flat();
                      const hasCustomTests = selectedTestIds.some((tid) => !allTestIds.includes(tid));
                      const compatibleLabs = labs.filter((l) => {
                        if (!l.isActive) return false;
                        if (hasCustomTests) return true;
                        const avail = labTestAvailability[l.id] || [];
                        return selectedTestIds.every((tid) => avail.includes(tid));
                      });
                      if (compatibleLabs.length === 0) {
                        return (
                          <div className="p-4 bg-gray-50 rounded-xl text-center">
                            <p className="text-sm text-gray-500">No nearby labs currently support all selected tests.</p>
                            <button onClick={() => { setSelectedTestIds([]); }} className="mt-2 text-xs font-semibold text-blue-600 hover:underline">Change Tests</button>
                          </div>
                        );
                      }
                      return compatibleLabs.map((l) => {
                        const avail = labTestAvailability[l.id]?.filter((tid) => selectedTestIds.includes(tid)) || [];
                        const isSelected = selectedLabId === l.id;
                        return (
                          <label key={l.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? "border-blue-300 bg-blue-50/50" : "border-gray-100 hover:border-gray-200"}`}>
                            <input type="radio" name="referralLab" checked={isSelected} onChange={() => setSelectedLabId(l.id)} className="accent-blue-600 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-gray-900">{l.labName}</div>
                                <span className="text-[10px] text-gray-400">{l.district}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {avail.map((tid) => {
                                  const allTests = [...testCatalog, ...getPersonalTests()];
                                  const test = allTests.find((t) => t.id === tid);
                                  return (
                                    <span key={tid} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-medium bg-green-50 text-green-700 border border-green-100">
                                      ✓ {test?.name || tid}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </label>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

              {/* Step 3: Summary */}
              {selectedLabId && selectedTestIds.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-900">Referral Summary</span>
                  </div>
                  {(() => {
                    const lab = labs.find((l) => l.id === selectedLabId);
                    const testNames = selectedTestIds.map((tid) => {
                      const allTests = [...testCatalog, ...getPersonalTests()];
                      return allTests.find((t) => t.id === tid)?.name || tid;
                    });
                    return (
                      <div className="text-[11px]">
                        <span className="font-semibold text-gray-800">{lab?.labName || selectedLabId}</span>
                        <div className="text-gray-600 mt-0.5">{testNames.join(", ")}</div>
                      </div>
                    );
                  })()}
                  <button onClick={handleLabReferral} disabled={!selectedLabId} className="w-full mt-2 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Refer Patient to Lab</button>
                </div>
              )}

              <button onClick={() => { setShowLabForm(false); setSelectedTestIds([]); setSelectedLabId(""); setTestSearch(""); }} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
            </div>
          )}

          {patientLabRefs.length > 0 && !showLabForm && (
            <div className="space-y-2 mt-3">{patientLabRefs.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                <div className="min-w-0"><div className="font-semibold text-gray-800">{r.labName}</div><div className="text-xs text-gray-400">{r.selectedTests?.length || 0} test(s)</div></div>
                {statusBadge(r.status)}
              </div>
            ))}</div>
          )}
        </div>

        {/* Pharmacy Referral + Prescription Builder */}
        <div id="section-pharmacy" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Pill size={16} className="text-green-600" /> Refer to Medical Store</h3>
            <button onClick={() => setShowPharmForm(!showPharmForm)} className="text-xs font-semibold text-white bg-green-600 px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">{showPharmForm ? "Cancel" : "+ New Prescription"}</button>
          </div>

          {showPharmForm && (
            <div className="mb-4 space-y-4">
              {/* Step 1: Medicine Selection */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Step 1: Prescribed Medicines</label>
                <div className="flex gap-2">
                  <div className="relative flex-1" ref={medSearchRef}>
                    <input type="text" value={pharmSearch} onChange={(e) => setPharmSearch(e.target.value)} onFocus={() => setMedSearchFocused(true)} placeholder="Search or type medicine name..." className="w-full h-9 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                    {medSearchFocused && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-[120] bg-white rounded-xl border border-gray-200 shadow-lg max-h-[220px] overflow-y-auto">
                      {filteredMeds.map((m) => (
                        <button key={m.id} type="button" onClick={() => { toggleMed(m.id); setPharmSearch(""); }} className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 text-sm text-left">
                          <span className="font-medium text-gray-900">{m.name}</span>
                          {medicines.some((med) => med.id === m.id) ? <span className="text-[10px] text-gray-400">Stock: {medicines.find((med) => med.id === m.id)?.stock || "—"}</span> : <span className="text-[10px] text-yellow-600 font-medium">Personal</span>}
                        </button>
                      ))}
                      {pharmSearch.trim().length > 1 && !medicines.some((m) => m.name.toLowerCase().includes(pharmSearch.toLowerCase())) && !personalMeds.some((m) => m.name.toLowerCase().includes(pharmSearch.toLowerCase())) && (
                        <>
                          <button type="button" onClick={() => { const id = `CUST-${Date.now()}`; setCustomMeds((p) => [...p, { id, name: pharmSearch.trim(), dosage: "", frequency: "", duration: "" }]); savePersonalMed(pharmSearch.trim()); setPharmSearch(""); setMedSearchFocused(false); }} className="w-full px-3 py-2 text-sm text-left text-green-600 font-semibold hover:bg-green-50 border-t border-gray-50">
                            + Add "{pharmSearch.trim()}" as custom medicine
                          </button>
                          <button type="button" onClick={() => { setShowNewMedModal(true); setNewMedName(pharmSearch.trim()); }} className="w-full px-3 py-2 text-sm text-left text-blue-600 font-semibold hover:bg-blue-50 border-t border-gray-50">
                            + Add New Medicine with details
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                  <button onClick={() => { setShowNewMedModal(true); setNewMedName(""); setNewMedDosageType("Tablet"); setNewMedStrength(""); setNewMedNotes(""); }} className="h-9 px-3 rounded-lg text-xs font-semibold text-green-600 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0">
                    <PlusCircle size={14} /> Add Medicine
                  </button>
                </div>

                {/* Smart Suggestions based on patient condition */}
                {selectedPatient.diseaseDetails && selectedMedIds.length === 0 && customMeds.length === 0 && (
                  <div className="mt-2">
                    <p className="text-[10px] text-gray-400 font-medium mb-1">Suggestions based on: {selectedPatient.diseaseDetails}</p>
                    <div className="flex flex-wrap gap-1">
                      {medicines.filter((m) => {
                        const cond = selectedPatient.diseaseDetails.toLowerCase();
                        return m.name.toLowerCase().includes("paracetamol") || m.name.toLowerCase().includes("metformin") || m.name.toLowerCase().includes("amlodipine") || m.name.toLowerCase().includes("telmisartan") || m.name.toLowerCase().includes("vitamin") || (cond.includes("diabetes") && m.name.toLowerCase().includes("metformin")) || (cond.includes("bp") || cond.includes("blood pressure") || cond.includes("hyperten")) && (m.name.toLowerCase().includes("amlodipine") || m.name.toLowerCase().includes("telmisartan") || m.name.toLowerCase().includes("losartan"));
                      }).slice(0, 5).map((m) => (
                        <button key={m.id} onClick={() => toggleMed(m.id)} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors border border-green-100">+ {m.name}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Medicine Cards */}
                {selectedMedIds.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {medicines.filter((m) => selectedMedIds.includes(m.id)).map((m) => (
                      <div key={m.id} className="p-3 rounded-xl border border-green-200 bg-green-50/30">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">{m.name}</span>
                              <button onClick={() => toggleMed(m.id)} className="text-[10px] text-red-500 hover:text-red-700 font-medium">✕ Remove</button>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div><input type="text" value={dosages[m.id] || ""} onChange={(e) => setDosages((p) => ({ ...p, [m.id]: e.target.value }))} placeholder="Dosage" className="w-full h-8 rounded-md border border-gray-200 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500/20" /></div>
                              <div><input type="text" value={frequencies[m.id] || ""} onChange={(e) => setFrequencies((p) => ({ ...p, [m.id]: e.target.value }))} placeholder="Frequency" className="w-full h-8 rounded-md border border-gray-200 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500/20" /></div>
                              <div><input type="text" value={durations[m.id] || ""} onChange={(e) => setDurations((p) => ({ ...p, [m.id]: e.target.value }))} placeholder="Duration" className="w-full h-8 rounded-md border border-gray-200 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500/20" /></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Custom Medicine Cards */}
                {customMeds.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {customMeds.map((cm) => (
                      <div key={cm.id} className="p-3 rounded-xl border border-green-200 bg-green-50/30">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">{cm.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">Custom</span>
                              <button onClick={() => setCustomMeds((p) => p.filter((x) => x.id !== cm.id))} className="text-[10px] text-red-500 hover:text-red-700 font-medium">✕ Remove</button>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <input type="text" value={cm.dosage} onChange={(e) => setCustomMeds((p) => p.map((x) => x.id === cm.id ? { ...x, dosage: e.target.value } : x))} placeholder="Dosage" className="w-full h-8 rounded-md border border-gray-200 px-2 text-xs" />
                              <input type="text" value={cm.frequency} onChange={(e) => setCustomMeds((p) => p.map((x) => x.id === cm.id ? { ...x, frequency: e.target.value } : x))} placeholder="Frequency" className="w-full h-8 rounded-md border border-gray-200 px-2 text-xs" />
                              <input type="text" value={cm.duration} onChange={(e) => setCustomMeds((p) => p.map((x) => x.id === cm.id ? { ...x, duration: e.target.value } : x))} placeholder="Duration" className="w-full h-8 rounded-md border border-gray-200 px-2 text-xs" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: Medical Store Selection (shown after medicines added) */}
              {(selectedMedIds.length > 0 || customMeds.length > 0) && (
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Step 2: Select Medical Store</label>
                  <input type="text" value={storeSearch} onChange={(e) => setStoreSearch(e.target.value)} placeholder="Search stores..." className="w-full h-9 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                  <div className="max-h-[180px] overflow-y-auto space-y-1.5">
                    {nearbyStores.length > 0 && !storeSearch && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {nearbyStores.slice(0, 4).map((s) => (
                          <button key={s.id} onClick={() => setSelectedStoreId(s.id)} className={`text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors border ${selectedStoreId === s.id ? "bg-green-100 text-green-700 border-green-200" : "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"}`}>{s.name}</button>
                        ))}
                      </div>
                    )}
                    {filteredStores.map((s) => (
                      <label key={s.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedStoreId === s.id ? "border-green-300 bg-green-50/50" : "border-gray-100 hover:border-gray-200"}`}>
                        <input type="radio" name="store" checked={selectedStoreId === s.id} onChange={() => setSelectedStoreId(s.id)} className="accent-green-600" />
                        <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-gray-900">{s.name}</div><div className="text-xs text-gray-400">{s.city}, {s.state} | ⭐ {s.rating}</div></div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <textarea value={rxNotes} onChange={(e) => setRxNotes(e.target.value)} placeholder="Additional instructions, diagnosis notes..." rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none" />

              <button onClick={handlePharmReferral} disabled={(selectedMedIds.length === 0 && customMeds.length === 0) || !selectedStoreId} className="w-full py-2.5 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Submit Prescription to Store</button>

              <button onClick={() => { setShowPharmForm(false); setSelectedMedIds([]); setCustomMeds([]); setSelectedStoreId(""); setRxNotes(""); setDosages({}); setFrequencies({}); setDurations({}); setPharmSearch(""); setStoreSearch(""); }} className="text-xs text-gray-400 hover:text-gray-600 block">Cancel</button>
            </div>
          )}

          {patientPharmRefs.length > 0 && !showPharmForm && (
            <div className="space-y-2 mt-3">{patientPharmRefs.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                <div className="min-w-0"><div className="font-semibold text-gray-800">{r.storeName || r.medicineNames.slice(0, 2).join(", ")}</div><div className="text-xs text-gray-400">{r.medicineNames.length} medicines</div></div>
                {statusBadge(r.status)}
              </div>
            ))}</div>
          )}
        </div>
      </div>

      {/* ═══ PRESCRIPTION LETTERHEAD PREVIEW (after submission) ═══ */}
      {submitted && (patientPharmRefs.length > 0) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-600" />
              <h3 className="text-base font-bold text-gray-900">Consultation Submitted Successfully</h3>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => openPrescriptionPDF(patientPharmRefs[0]?.id || "")} className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"><FileText size={16} /> View Letterhead</button>
            <button onClick={() => downloadPrescriptionPDF(patientPharmRefs[0]?.id || "")} className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"><Download size={16} /> Download PDF</button>
          </div>
        </div>
      )}

      {/* ═══ SUBMIT CONSULTATION ═══ */}
      {!submitted && (patientPharmRefs.length > 0 || patientLabRefs.length > 0) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5 text-center">
          <button onClick={() => setSubmitted(true)} className="px-10 py-3 rounded-xl text-base font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl inline-flex items-center gap-2">
            <CheckCircle2 size={20} /> Submit Consultation
          </button>
          <p className="text-xs text-gray-400 mt-2">Lab and/or pharmacy referrals will be sent after submission.</p>
        </div>
      )}

      {/* ═══ BOTTOM ROW: Timeline + Quick Actions ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Activity Timeline */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Activity size={15} className="text-blue-600" /> Patient Activity</h3>
          <div className="space-y-0">
            {[
              { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Registration Completed", time: selectedPatient.registrationDate ? new Date(selectedPatient.registrationDate).toLocaleDateString() : "" },
              { icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", label: "Appointment Booked", time: currentBooking ? new Date(currentBooking.date).toLocaleDateString() : "" },
              { icon: Video, color: "text-purple-600", bg: "bg-purple-100", label: "Consultation Started", time: "Today" },
              ...patientPharmRefs.filter(r => r.status !== "pending").map(r => ({ icon: Pill, color: "text-green-600", bg: "bg-green-100", label: `Pharmacy Referred: ${r.medicineNames.slice(0, 2).join(", ")}`, time: new Date(r.createdAt).toLocaleDateString() })),
              ...patientLabRefs.filter(r => r.status !== "pending").map(r => ({ icon: FlaskConical, color: "text-teal-600", bg: "bg-teal-100", label: `Lab Referred: ${r.labName}`, time: new Date(r.createdAt).toLocaleDateString() })),
            ].filter(t => t.time).map((item, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 relative ml-1">
                <div className={`w-7 h-7 rounded-full ${item.bg} flex items-center justify-center ${item.color} shrink-0 z-10`}><item.icon size={13} /></div>
                {i < 5 && <div className="absolute left-3.5 top-7 bottom-0 w-px bg-gray-200" />}
                <div className="flex-1 min-w-0 pt-0.5"><div className="text-sm font-medium text-gray-800">{item.label}</div><div className="text-[11px] text-gray-400">{item.time}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Activity size={15} className="text-blue-600" /> Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: FilePlus, label: "Create Prescription", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Upload, label: "Upload Report", color: "text-purple-600", bg: "bg-purple-50" },
              { icon: MessageSquare, label: "Add Notes", color: "text-teal-600", bg: "bg-teal-50" },
              { icon: Send, label: "Send Message", color: "text-orange-600", bg: "bg-orange-50" },
              { icon: CheckCircle2, label: "Mark Complete", color: "text-green-600", bg: "bg-green-50" },
            ].map((action) => (
              <button key={action.label} className={`w-full flex items-center gap-3 p-3 rounded-xl ${action.bg} hover:opacity-80 transition-all text-left`}>
                <div className={`w-8 h-8 rounded-lg ${action.bg} flex items-center justify-center ${action.color}`}><action.icon size={15} /></div>
                <span className="text-sm font-semibold text-gray-800">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Prescriptions Page ─────────────────────────────────────
function PrescriptionsPage({ doctor, onSelectPatient }: { doctor: ReturnType<typeof useDoctorStore.getState>["doctors"][0]; onSelectPatient: () => void }) {
  const { patients, pharmacyReferrals, labReferrals } = usePatientStore();
  const { submissions } = useCaseStore();
  const { bookedSlots } = useAppointmentStore();
  const today = new Date().toISOString().split("T")[0];

  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterStore, setFilterStore] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [detailRef, setDetailRef] = useState<typeof pharmacyReferrals[0] | null>(null);

  const myPrescriptions = pharmacyReferrals.filter((r) => r.doctorId === doctor.id);

  const prescriptionRows = myPrescriptions.map((r) => {
    const patient = patients.find((p) => p.id === r.patientId);
    const pSubs = submissions.filter((s) => s.patientId === r.patientId);
    const pAppts = bookedSlots.filter(
      (b) => b.doctorId === doctor.id && b.patientName.toLowerCase() === r.patientName.toLowerCase()
    );
    const latestAppt = pAppts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const latestSub = pSubs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
    return { ref: r, patient, latestAppt, latestSub };
  });

  let filtered = prescriptionRows.filter((r) => {
    const q = searchQ.toLowerCase();
    if (q && !r.ref.patientName.toLowerCase().includes(q) && !r.ref.id.toLowerCase().includes(q)) return false;
    if (filterStatus && r.ref.status !== filterStatus) return false;
    if (filterStore && !r.ref.storeName.toLowerCase().includes(filterStore.toLowerCase())) return false;
    if (filterDateFrom && r.ref.createdAt < filterDateFrom) return false;
    if (filterDateTo && r.ref.createdAt > filterDateTo) return false;
    return true;
  });

  filtered.sort((a, b) => {
    let cmp = 0;
    if (sortField === "name") cmp = a.ref.patientName.localeCompare(b.ref.patientName);
    else if (sortField === "status") cmp = a.ref.status.localeCompare(b.ref.status);
    else if (sortField === "store") cmp = a.ref.storeName.localeCompare(b.ref.storeName);
    else cmp = new Date(b.ref.createdAt).getTime() - new Date(a.ref.createdAt).getTime();
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const todayRx = myPrescriptions.filter((r) => r.createdAt.startsWith(today));
  const pendingRx = myPrescriptions.filter((r) => r.status === "pending" || r.status === "referred");

  const toggleSort = (f: string) => {
    if (sortField === f) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(f); setSortDir("asc"); }
  };

  const stores = [...new Set(myPrescriptions.map((r) => r.storeName))];

  const rxStatusBadge = (s: string) => {
    const m: Record<string, { label: string; cls: string }> = {
      pending: { label: "Pending", cls: "bg-yellow-100 text-yellow-700" },
      referred: { label: "Referred", cls: "bg-blue-100 text-blue-700" },
      processing: { label: "Processing", cls: "bg-purple-100 text-purple-700" },
      completed: { label: "Completed", cls: "bg-green-100 text-green-700" },
      cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-700" },
    };
    const c = m[s] || { label: s, cls: "bg-gray-100 text-gray-600" };
    return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.cls}`}>{c.label}</span>;
  };

  const resetFilters = () => {
    setSearchQ(""); setFilterStatus(""); setFilterDateFrom(""); setFilterDateTo(""); setFilterStore(""); setPage(0);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Prescriptions</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage all pharmacy referrals and prescriptions</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all">
          <PlusCircle size={16} /> Create Prescription
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Pill, label: "Total Prescriptions", value: String(myPrescriptions.length), growth: "", sub: "All time", bg: "bg-blue-50", color: "text-blue-600" },
          { icon: Calendar, label: "Today's Prescriptions", value: String(todayRx.length), growth: "", sub: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), bg: "bg-teal-50", color: "text-teal-600" },
          { icon: Clock, label: "Pending", value: String(pendingRx.length), growth: "", sub: "Awaiting fulfillment", bg: "bg-yellow-50", color: "text-yellow-600" },
          { icon: CheckCircle2, label: "Completed", value: String(myPrescriptions.filter((r) => r.status === "completed").length), growth: "", sub: "Delivered", bg: "bg-green-50", color: "text-green-600" },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}><card.icon size={18} /></div>
            </div>
            <div className="text-xl font-bold text-gray-900">{card.value}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{card.label}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQ} onChange={(e) => { setSearchQ(e.target.value); setPage(0); }} placeholder="Search by patient or ID..." className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }} className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[130px]">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="referred">Referred</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={filterStore} onChange={(e) => { setFilterStore(e.target.value); setPage(0); }} className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[150px]">
            <option value="">All Stores</option>
            {stores.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={filterDateFrom} onChange={(e) => { setFilterDateFrom(e.target.value); setPage(0); }} className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-[130px]" title="From" />
          <input type="date" value={filterDateTo} onChange={(e) => { setFilterDateTo(e.target.value); setPage(0); }} className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-[130px]" title="To" />
          <button onClick={resetFilters} className="h-10 px-4 rounded-lg text-xs font-semibold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">Reset</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  { key: "name", label: "Patient", w: "min-w-[160px]" },
                  { key: "meds", label: "Medicines", w: "" },
                  { key: "store", label: "Pharmacy Store", w: "w-[140px]" },
                  { key: "status", label: "Status", w: "w-[95px]" },
                  { key: "date", label: "Date", w: "w-[100px]" },
                  { key: "actions", label: "", w: "w-[50px]" },
                ].map((col) => (
                  <th key={col.key} className={`${col.w} px-1.5 py-1.5 text-left text-[9px] font-semibold text-gray-500 uppercase tracking-wider select-none ${col.key !== "meds" && col.key !== "actions" ? "cursor-pointer hover:text-gray-800" : "cursor-default"}`}
                    onClick={() => col.key !== "meds" && col.key !== "actions" && toggleSort(col.key)}
                  >
                    <span className="flex items-center gap-1">{col.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.map((r, idx) => (
                <tr key={r.ref.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"} hover:bg-blue-50/50 transition-colors`}>
                  <td className="px-1.5 py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0 shadow-sm">
                        {r.ref.patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0 leading-tight">
                        <div className="text-[11px] font-semibold text-gray-900 truncate leading-none">{r.ref.patientName}</div>
                        <div className="text-[9px] text-gray-400 font-mono leading-tight">{r.patient?.id || ""}</div>
                        <div className="text-[9px] text-gray-400 leading-tight">{r.patient?.mobileNumber || ""}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-1.5 py-1">
                    <div className="flex flex-wrap gap-0.5">
                      {r.ref.medicineNames.slice(0, 3).map((m, i) => (
                        <span key={i} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-purple-50 text-purple-700 border border-purple-200 leading-tight">
                          {m.length > 20 ? m.slice(0, 18) + "..." : m}
                        </span>
                      ))}
                      {r.ref.medicineNames.length > 3 && <span className="text-[9px] text-gray-400">+{r.ref.medicineNames.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-1.5 py-1 text-[10px] text-gray-700">{r.ref.storeName}</td>
                  <td className="px-1.5 py-1">{rxStatusBadge(r.ref.status)}</td>
                  <td className="px-1.5 py-1 text-[10px] text-gray-500 whitespace-nowrap">{new Date(r.ref.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-1.5 py-1">
                    <button onClick={(e) => { e.stopPropagation(); setDetailRef(r.ref); }} className="w-6 h-6 rounded flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors" title="View Details">
                      <Eye size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paged.length === 0 && (
          <div className="text-center py-10">
            <Pill size={32} className="mx-auto text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">No prescriptions found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-gray-400">{filtered.length} prescriptions</span>
          <div className="flex items-center gap-3">
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0); }} className="h-7 rounded-lg bg-white border border-gray-200 px-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value={10}>10 / page</option>
              <option value={15}>15 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <div className="flex items-center gap-0.5">
              <button onClick={() => setPage(0)} disabled={page === 0} className="w-7 h-7 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 disabled:opacity-20 transition-colors">{"<<"}</button>
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="w-7 h-7 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 disabled:opacity-20 transition-colors">{"<"}</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(0, Math.min(page - 2, totalPages - 5));
                const p = start + i;
                if (p >= totalPages) return null;
                return <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${page === p ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}>{p + 1}</button>;
              })}
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="w-7 h-7 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 disabled:opacity-20 transition-colors">{">"}</button>
              <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="w-7 h-7 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 disabled:opacity-20 transition-colors">{">>"}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Detail Modal */}
      {detailRef && (
        <div className="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4" onClick={() => setDetailRef(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-purple-600" />
                <h3 className="text-base font-bold text-gray-900">Prescription Details</h3>
              </div>
              <button onClick={() => setDetailRef(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Patient</p><p className="font-medium text-gray-900">{detailRef.patientName}</p></div>
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Store</p><p className="font-medium text-gray-900">{detailRef.storeName}</p></div>
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Doctor</p><p className="font-medium text-gray-900">{detailRef.doctorName}</p></div>
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Status</p><StatusBadge status={detailRef.status} /></div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase mb-2">Prescribed Medicines</p>
                <div className="space-y-1.5">
                  {detailRef.medicineNames.map((med, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50">
                      <Pill size={14} className="text-purple-500 shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{med}</span>
                    </div>
                  ))}
                </div>
              </div>
              {detailRef.prescriptionNotes && (
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase mb-1">Notes</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{detailRef.prescriptionNotes}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 pt-2 border-t border-gray-50">
                <p>Created: {new Date(detailRef.createdAt).toLocaleDateString()}</p>
                <p>ID: {detailRef.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings Page ──────────────────────────────────────────
function SettingsPage({ doctor }: { doctor: ReturnType<typeof useDoctorStore.getState>["doctors"][0] }) {
  const [tab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  // Load from localStorage
  const lsKey = (key: string) => `dr_settings_${doctor.id}_${key}`;
  const load = (key: string, def: string) => { try { return JSON.parse(localStorage.getItem(lsKey(key)) || JSON.stringify(def)); } catch { return def; } };
  const save = (key: string, val: any) => { localStorage.setItem(lsKey(key), JSON.stringify(val)); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const [profile, setProfile] = useState({ name: doctor.name, qual: doctor.qualification || "", spec: doctor.specialty, regNo: "", exp: doctor.experience, bio: "", mobile: doctor.mobile || "", email: doctor.email || "", hospital: doctor.hospitalName || "", address: "" });
  const [fees, setFees] = useState({ consult: doctor.consultancyFee || 0, video: load("videoFee", 0), physical: load("physicalFee", 0), followup: load("followupFee", 0) });
  const [workingDays, setWorkingDays] = useState<string[]>(load("workingDays", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]));
  const [hours, setHours] = useState<Record<string, { start1: string; end1: string; start2: string; end2: string }>>(load("hours", {}));
  const [slotDuration, setSlotDuration] = useState(load("slotDuration", 15));
  const [breakTime, setBreakTime] = useState(load("breakTime", 5));
  const [blockedDates, setBlockedDates] = useState<string[]>(load("blockedDates", []));
  const [blockDateInput, setBlockDateInput] = useState("");
  const [notifPrefs, setNotifPrefs] = useState(load("notifPrefs", { appt: true, lab: true, pharm: true, reg: true }));
  const [letterhead, setLetterhead] = useState({ clinicName: load("lh_clinic", doctor.hospitalName || "Global Integrative Clinic"), logo: "", signature: "", regNo: "", footer: "" });
  const [vacation, setVacation] = useState(load("vacation", false));
  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const tabs = [
    { key: "profile", label: "Doctor Profile" },
    { key: "fees", label: "Consultation Settings" },
    { key: "schedule", label: "Availability & Schedule" },
    { key: "letterhead", label: "Letterhead" },
    { key: "notifications", label: "Notifications" },
  ];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage your profile, schedule and preferences</p>
        </div>
        {saved && <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1"><CheckCircle2 size={12} /> Saved</span>}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all ${tab === t.key ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>{t.label}</button>
        ))}
      </div>

      {/* ═══ TAB 1: Profile ═══ */}
      {tab === "profile" && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <img src={doctor.photo} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] border-2 border-white shadow-sm hover:bg-blue-700 transition-colors"><Camera size={11} /></button>
              </div>
              <div><h3 className="text-sm font-bold text-gray-900">{profile.name}</h3><p className="text-xs text-gray-400">{profile.spec}</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{ key: "name", label: "Full Name", val: profile.name, set: (v: string) => setProfile({ ...profile, name: v }) },
                { key: "qual", label: "Qualification", val: profile.qual, set: (v: string) => setProfile({ ...profile, qual: v }) },
                { key: "spec", label: "Specialty", val: profile.spec, set: (v: string) => setProfile({ ...profile, spec: v }) },
                { key: "regNo", label: "Registration Number", val: profile.regNo, set: (v: string) => setProfile({ ...profile, regNo: v }) },
                { key: "exp", label: "Experience (years)", val: profile.exp, set: (v: string) => setProfile({ ...profile, exp: v }) },
                { key: "mobile", label: "Mobile Number", val: profile.mobile, set: (v: string) => setProfile({ ...profile, mobile: v }) },
                { key: "email", label: "Email", val: profile.email, set: (v: string) => setProfile({ ...profile, email: v }) },
                { key: "hospital", label: "Clinic / Hospital Name", val: profile.hospital, set: (v: string) => setProfile({ ...profile, hospital: v }) },
              ].map((f) => (
                <div key={f.key}><label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label><input type="text" value={f.val} onChange={(e) => f.set(e.target.value)} className="w-full h-9 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></div>
              ))}
              <div className="sm:col-span-2"><label className="text-xs font-semibold text-gray-600 mb-1 block">Bio / About</label><textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={2} className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-semibold text-gray-600 mb-1 block">Clinic Address</label><textarea value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} rows={2} className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" /></div>
            </div>
            <button onClick={() => save("profile", profile)} className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">Save Profile</button>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: Fees ═══ */}
      {tab === "fees" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Consultation Fees</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ key: "consult", label: "Consultation Fee ($)", val: fees.consult, set: (v: number) => setFees({ ...fees, consult: v }) },
              { key: "video", label: "Video Consultation Fee ($)", val: fees.video, set: (v: number) => setFees({ ...fees, video: v }) },
              { key: "physical", label: "Physical Consultation Fee ($)", val: fees.physical, set: (v: number) => setFees({ ...fees, physical: v }) },
              { key: "followup", label: "Follow-up Fee ($)", val: fees.followup, set: (v: number) => setFees({ ...fees, followup: v }) },
            ].map((f) => (
              <div key={f.key}><label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label><input type="number" min={0} value={f.val} onChange={(e) => f.set(Number(e.target.value))} className="w-full h-9 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></div>
            ))}
          </div>
          <button onClick={() => { save("videoFee", fees.video); save("physicalFee", fees.physical); save("followupFee", fees.followup); }} className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">Update Fees</button>
        </div>
      )}

      {/* ═══ TAB 3: Schedule ═══ */}
      {tab === "schedule" && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Working Days</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {allDays.map((d) => {
                const isOn = workingDays.includes(d);
                return (
                  <button key={d} onClick={() => setWorkingDays(isOn ? workingDays.filter((x) => x !== d) : [...workingDays, d])}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${isOn ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                    {d.substring(0, 3)}
                  </button>
                );
              })}
            </div>
            <div className="space-y-3">
              {allDays.filter((d) => workingDays.includes(d)).map((d) => {
                const h = hours[d] || { start1: "09:00", end1: "13:00", start2: "16:00", end2: "20:00" };
                return (
                  <div key={d} className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-gray-50">
                    <span className="text-xs font-semibold text-gray-700 w-20">{d}</span>
                    <input type="time" value={h.start1} onChange={(e) => setHours({ ...hours, [d]: { ...h, start1: e.target.value } })} className="h-8 rounded-md border border-gray-200 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20 w-24 bg-white" />
                    <span className="text-xs text-gray-400">to</span>
                    <input type="time" value={h.end1} onChange={(e) => setHours({ ...hours, [d]: { ...h, end1: e.target.value } })} className="h-8 rounded-md border border-gray-200 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20 w-24 bg-white" />
                    <span className="text-xs text-gray-300 mx-1">|</span>
                    <input type="time" value={h.start2} onChange={(e) => setHours({ ...hours, [d]: { ...h, start2: e.target.value } })} className="h-8 rounded-md border border-gray-200 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20 w-24 bg-white" />
                    <span className="text-xs text-gray-400">to</span>
                    <input type="time" value={h.end2} onChange={(e) => setHours({ ...hours, [d]: { ...h, end2: e.target.value } })} className="h-8 rounded-md border border-gray-200 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20 w-24 bg-white" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Appointment Slot Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Slot Duration</label>
                <select value={slotDuration} onChange={(e) => setSlotDuration(Number(e.target.value))} className="w-full h-9 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option value={10}>10 Minutes</option><option value={15}>15 Minutes</option><option value={20}>20 Minutes</option><option value={30}>30 Minutes</option>
                </select></div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Break Time Between Slots</label>
                <select value={breakTime} onChange={(e) => setBreakTime(Number(e.target.value))} className="w-full h-9 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option value={0}>No Break</option><option value={5}>5 Minutes</option><option value={10}>10 Minutes</option><option value={15}>15 Minutes</option>
                </select></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Block Dates & Vacation</h3>
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={vacation} onChange={(e) => setVacation(e.target.checked)} className="accent-blue-600" /> Vacation Mode
              </label>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <input type="date" value={blockDateInput} onChange={(e) => setBlockDateInput(e.target.value)} className="h-9 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <button onClick={() => { if (blockDateInput && !blockedDates.includes(blockDateInput)) { setBlockedDates([...blockedDates, blockDateInput]); setBlockDateInput(""); } }} className="h-9 px-3 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">Block Date</button>
            </div>
            {blockedDates.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {blockedDates.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-600 border border-red-200">
                    {new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    <button onClick={() => setBlockedDates(blockedDates.filter((x) => x !== d))} className="text-red-400 hover:text-red-700">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => { save("workingDays", workingDays); save("hours", hours); save("slotDuration", slotDuration); save("breakTime", breakTime); save("blockedDates", blockedDates); save("vacation", vacation); }} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">Save Schedule</button>
        </div>
      )}

      {/* ═══ TAB 4: Letterhead ═══ */}
      {tab === "letterhead" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Letterhead Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ key: "clinicName", label: "Clinic Name", val: letterhead.clinicName, set: (v: string) => setLetterhead({ ...letterhead, clinicName: v }) },
              { key: "regNo", label: "Registration Number", val: letterhead.regNo, set: (v: string) => setLetterhead({ ...letterhead, regNo: v }) },
            ].map((f) => (
              <div key={f.key}><label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label><input type="text" value={f.val} onChange={(e) => f.set(e.target.value)} className="w-full h-9 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></div>
            ))}
            <div className="sm:col-span-2"><label className="text-xs font-semibold text-gray-600 mb-1 block">Footer Information</label><textarea value={letterhead.footer} onChange={(e) => setLetterhead({ ...letterhead, footer: e.target.value })} rows={2} placeholder="e.g. Address, phone, email, website" className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Logo</label><div className="h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors"><Camera size={14} className="mr-1" /> Upload Logo</div></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Signature</label><div className="h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors"><Camera size={14} className="mr-1" /> Upload Signature</div></div>
          </div>
          <button onClick={() => { save("lh_clinic", letterhead.clinicName); }} className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">Save Letterhead</button>
        </div>
      )}

      {/* ═══ TAB 5: Notifications ═══ */}
      {tab === "notifications" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { key: "appt", label: "New Appointment Alerts", desc: "Get notified when a new appointment is booked" },
              { key: "lab", label: "Lab Report Alerts", desc: "Receive alerts when lab reports are uploaded" },
              { key: "pharm", label: "Medical Store Alerts", desc: "Get notified on pharmacy referral updates" },
              { key: "reg", label: "Patient Registration Alerts", desc: "Alert when a new patient registers" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between py-2">
                <div><p className="text-sm font-medium text-gray-900">{n.label}</p><p className="text-xs text-gray-400">{n.desc}</p></div>
                <div onClick={() => setNotifPrefs({ ...notifPrefs, [n.key]: !notifPrefs[n.key as keyof typeof notifPrefs] })} className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${notifPrefs[n.key as keyof typeof notifPrefs] ? "bg-blue-600" : "bg-gray-200"} relative shrink-0`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${notifPrefs[n.key as keyof typeof notifPrefs] ? "left-5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => save("notifPrefs", notifPrefs)} className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">Save Preferences</button>
        </div>
      )}
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
