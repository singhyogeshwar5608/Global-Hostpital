"use client";

import React, { useState, useEffect } from "react";
import { usePatientStore } from "@/store/patient-store";
import { useAuthStore } from "@/store/auth-store";
import { useCaseStore } from "@/store/case-store";
import { useAppointmentStore } from "@/store/appointment-store";
import PatientDashboard from "./PatientDashboard";
import CaseSubmissionFlow from "./CaseSubmissionFlow";
import {
  User, Calendar, FileText, ClipboardList, CreditCard, Package,
  Bell, Settings, Pill, ShieldCheck, Clock, MapPin, Stethoscope,
  ChevronRight, Eye, Download, PlusCircle, Heart, ChevronLeft,
  AlertCircle, Phone, Mail, Droplets, Scale, Zap, Activity,
  LogOut,
} from "lucide-react";

type View =
  | "account" | "profile" | "appointments" | "records"
  | "prescriptions" | "reports" | "payments" | "packages"
  | "notifications" | "settings" | "new-case";

const tabs: { key: View; label: string }[] = [
  { key: "account", label: "Account" },
  { key: "appointments", label: "Appointments" },
  { key: "records", label: "Records" },
  { key: "prescriptions", label: "Prescriptions" },
  { key: "payments", label: "Payments" },
  { key: "settings", label: "Settings" },
];

export default function PatientPortal() {
  const { patients, bookings, portalTargetView, setPortalTargetView } = usePatientStore();
  const { authenticatedUser, logout } = useAuthStore();
  const { submissions } = useCaseStore();
  const { bookedSlots } = useAppointmentStore();
  const [view, setView] = useState<View>("account");

  useEffect(() => {
    if (portalTargetView && portalTargetView !== view) {
      setView(portalTargetView as View);
      setPortalTargetView("");
    }
  }, [portalTargetView, view, setPortalTargetView]);

  const patientId = authenticatedUser?.id || "";
  const patient = patients.find((p) => p.id === patientId);
  const patientName = patient?.fullName || authenticatedUser?.name || "";
  const patientCases = submissions.filter((c) => c.patientId === patientId);
  const patientBookings = bookedSlots.filter(
    (b) => b.patientName.toLowerCase() === patientName.toLowerCase()
  );
  const patientPkgBookings = bookings.filter((b) => b.patientId === patientId);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <a href="#" onClick={(e) => { e.preventDefault(); usePatientStore.getState().setPatientViewingHomepage(true); }} className="hover:text-blue-600 transition-colors">Home</a>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium">My Account</span>
          {view !== "account" && (
            <>
              <ChevronRight size={12} />
              <span className="text-gray-700 font-medium capitalize">{view.replace("-", " ")}</span>
            </>
          )}
        </nav>
      </div>

      {/* Horizontal Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Account</h1>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                view === tab.key
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {view === "account" && (
          <PatientDashboard patientId={patientId} onNewCase={() => setView("new-case")} onNavigate={(v) => setView(v as View)} />
        )}

        {view === "new-case" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setView("account")} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-bold text-gray-900">New Medical Case</h2>
            </div>
            <CaseSubmissionFlow onBack={() => setView("account")} onDone={() => setView("account")} />
          </div>
        )}

        {view === "profile" && patient && <ProfileView patient={patient} />}
        {view === "appointments" && (
          <AppointmentsView patientBookings={patientBookings} patientPkgBookings={patientPkgBookings} />
        )}
        {view === "records" && <RecordsView patientCases={patientCases} />}
        {view === "prescriptions" && <PrescriptionsView patientCases={patientCases} patient={patient} />}
        {view === "reports" && patient && <ReportsView patient={patient} />}
        {view === "payments" && (
          <PaymentsView patientBookings={patientBookings} patientPkgBookings={patientPkgBookings} />
        )}
        {view === "packages" && <PackagesView patientPkgBookings={patientPkgBookings} />}
        {view === "notifications" && <NotificationsView />}
        {view === "settings" && <SettingsView patient={patient} />}
      </div>
    </div>
  );
}

/* ════════════════════════════════════ SUB-VIEWS ════════════════════════════════════ */

function ProfileView({ patient }: { patient: NonNullable<ReturnType<typeof usePatientStore.getState>["patients"][0]> }) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard title="Basic Info" icon={<User size={16} />}>
          {[["Full Name", patient.fullName], ["Gender", patient.gender], ["Date of Birth", patient.dateOfBirth || "N/A"], ["Blood Group", patient.bloodGroup], ["Email", patient.email], ["Phone", patient.mobileNumber]].map(([l, v]) => (
            <Row key={l as string} label={l as string} value={v as string} />
          ))}
        </SectionCard>
        <SectionCard title="Address" icon={<MapPin size={16} />}>
          {[["Address", patient.address], ["City", patient.city], ["State", patient.state], ["Country", patient.country], ["Pin Code", patient.pinCode]].map(([l, v]) => (
            <Row key={l as string} label={l as string} value={v as string || "N/A"} />
          ))}
        </SectionCard>
        <SectionCard title="Medical Information" icon={<Heart size={16} />} span={2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[["Disease Details", patient.diseaseDetails], ["Symptoms", patient.symptoms], ["Medical History", patient.medicalHistory], ["Allergies", patient.allergies || "None"], ["Current Medications", patient.currentMedications || "None"]].map(([l, v]) => (
              <div key={l as string} className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-400 font-medium mb-0.5">{l}</p>
                <p className="text-sm font-medium text-gray-900">{v || "N/A"}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function AppointmentsView({ patientBookings, patientPkgBookings }: {
  patientBookings: ReturnType<typeof useAppointmentStore.getState>["bookedSlots"];
  patientPkgBookings: ReturnType<typeof usePatientStore.getState>["bookings"];
}) {
  const all = [
    ...patientBookings.map((b) => ({ id: b.id, type: "appointment", doctor: b.doctorName, specialty: b.specialty, date: b.date, time: b.time, status: b.status, location: "Main Clinic" })),
    ...patientPkgBookings.filter(b => b.appointmentDate).map((b) => ({ id: b.id, type: "package", doctor: b.doctorName || "To be assigned", specialty: b.packageName, date: b.appointmentDate, time: "", status: b.bookingStatus === "payment_done" ? "confirmed" : "pending", location: "Main Clinic" })),
  ].sort((a, b) => (a.date || "").localeCompare(b.date || ""));

  if (!all.length) return <EmptyState icon={Calendar} text="No appointments yet" />;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-5">Appointments</h2>
      <div className="space-y-3">
        {all.map((a) => {
          const statusColor: Record<string, string> = { confirmed: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", cancelled: "bg-red-100 text-red-700", completed: "bg-blue-100 text-blue-700" };
          return (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><Stethoscope size={18} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{a.doctor}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[a.status] || "bg-gray-100 text-gray-600"}`}>{a.status}</span>
                  </div>
                  <p className="text-xs text-gray-500">{a.specialty}</p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                    {a.date && <span className="flex items-center gap-1"><Calendar size={11} />{new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
                    {a.time && <span className="flex items-center gap-1"><Clock size={11} />{a.time}</span>}
                    <span className="flex items-center gap-1"><MapPin size={11} />{a.location}</span>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors shrink-0">View Details</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecordsView({ patientCases }: { patientCases: ReturnType<typeof useCaseStore.getState>["submissions"] }) {
  if (!patientCases.length) return <EmptyState icon={ClipboardList} text="No medical records yet" />;
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-5">Medical Records</h2>
      <div className="space-y-3">
        {patientCases.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0"><ClipboardList size={18} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{c.caseId}</p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{c.specialtyName || "General"}</span>
                </div>
                <p className="text-xs text-gray-500">{c.doctorName ? `Dr. ${c.doctorName}` : "Doctor not assigned"}</p>
                {c.notes && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{c.notes}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1"><Eye size={12} /> View</button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-1"><Download size={12} /> PDF</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrescriptionsView({ patientCases, patient }: {
  patientCases: ReturnType<typeof useCaseStore.getState>["submissions"];
  patient: ReturnType<typeof usePatientStore.getState>["patients"][0] | undefined;
}) {
  const meds = patient?.currentMedications?.split(",").map(m => m.trim()).filter(Boolean) || [];
  const rx = patientCases.filter(c => c.status === "prescription_generated" || c.status === "completed");
  if (!meds.length && !rx.length) return <EmptyState icon={Pill} text="No prescriptions yet" />;
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-5">Prescriptions</h2>
      {meds.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Medications</h3>
          <div className="space-y-2">
            {meds.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                <Pill size={15} className="text-blue-600 shrink-0" /><span className="text-sm text-gray-900">{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-3">
        {rx.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0"><FileText size={18} /></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Prescription - {c.caseId}</p>
                <p className="text-xs text-gray-400">{c.doctorName ? `Dr. ${c.doctorName}` : "Doctor TBD"} {c.appointmentDate ? `| ${new Date(c.appointmentDate).toLocaleDateString()}` : ""}</p>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1"><Eye size={12} /> View</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsView({ patient }: { patient: NonNullable<ReturnType<typeof usePatientStore.getState>["patients"][0]> }) {
  const reports = patient.reports;
  if (!reports.length) return <EmptyState icon={FileText} text="No reports uploaded yet" />;
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-5">Lab Reports</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm hover:-translate-y-0.5 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0"><FileText size={18} /></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{r.fileName}</p>
                <p className="text-xs text-gray-400">{r.fileFormat.toUpperCase()} | {(r.fileSize / 1024).toFixed(1)} MB</p>
                <p className="text-xs text-gray-400">{new Date(r.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
              <button className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"><Eye size={12} /> View</button>
              <button className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"><Download size={12} /> Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsView({ patientBookings, patientPkgBookings }: {
  patientBookings: ReturnType<typeof useAppointmentStore.getState>["bookedSlots"];
  patientPkgBookings: ReturnType<typeof usePatientStore.getState>["bookings"];
}) {
  const all = [
    ...patientBookings.map((b) => ({ id: b.id, desc: `Appointment - ${b.doctorName}`, amount: b.fee || 0, status: b.paymentStatus, date: b.date, method: b.paymentMethod })),
    ...patientPkgBookings.map((b) => ({ id: b.id, desc: `Package - ${b.packageName}`, amount: b.packagePrice, status: b.paymentStatus, date: b.appointmentDate, method: b.paymentMethod })),
  ];
  const paid = all.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = all.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  if (!all.length) return <EmptyState icon={CreditCard} text="No payment records" />;
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Payments</h2>
        <div className="flex items-center gap-4 text-sm">
          <span>Paid: <strong className="text-green-600">${paid.toFixed(2)}</strong></span>
          <span>Pending: <strong className="text-yellow-600">${pending.toFixed(2)}</strong></span>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr><th className="text-left px-4 py-3 font-semibold text-gray-600">Description</th><th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th><th className="text-left px-4 py-3 font-semibold text-gray-600">Method</th><th className="text-right px-4 py-3 font-semibold text-gray-600">Amount</th><th className="text-right px-4 py-3 font-semibold text-gray-600">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {all.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{p.desc}</td>
                <td className="px-4 py-3 text-gray-500">{p.date ? new Date(p.date).toLocaleDateString() : "N/A"}</td>
                <td className="px-4 py-3 text-gray-500 capitalize">{p.method || "card"}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">${p.amount.toFixed(2)}</td>
                <td className="px-4 py-3 text-right"><span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.status === "paid" ? "bg-green-100 text-green-700" : p.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PackagesView({ patientPkgBookings }: {
  patientPkgBookings: ReturnType<typeof usePatientStore.getState>["bookings"];
}) {
  if (!patientPkgBookings.length) return <EmptyState icon={Package} text="No packages booked" />;
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-5">Health Packages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {patientPkgBookings.map((b) => (
          <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm hover:-translate-y-0.5 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3"><Package size={18} /></div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{b.packageName}</h3>
            <p className="text-xl font-bold text-gray-900 mb-2">${b.packagePrice.toFixed(2)}</p>
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2 py-0.5 rounded-full font-semibold ${b.bookingStatus === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{b.bookingStatus.replace(/_/g, " ")}</span>
              <span className="text-gray-400">{b.appointmentDate ? new Date(b.appointmentDate).toLocaleDateString() : ""}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsView() {
  const items = [
    { id: "1", title: "Appointment Reminder", msg: "You have an appointment with Dr. Sarah Wilson tomorrow at 10:00 AM.", time: "2 hours ago", type: "appointment" },
    { id: "2", title: "Lab Results Available", msg: "Your blood test results are now available.", time: "1 day ago", type: "lab" },
    { id: "3", title: "Prescription Refill", msg: "Your prescription for Amlodipine 5mg is due for a refill.", time: "2 days ago", type: "rx" },
  ];
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-5">Notifications</h2>
      <div className="space-y-3">
        {items.map((n) => (
          <div key={n.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${n.type === "appointment" ? "bg-blue-50 text-blue-600" : n.type === "lab" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}`}>
              {n.type === "appointment" ? <Calendar size={18} /> : n.type === "lab" ? <FileText size={18} /> : <Pill size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{n.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{n.msg}</p>
              <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors shrink-0">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView({ patient }: {
  patient: ReturnType<typeof usePatientStore.getState>["patients"][0] | undefined;
}) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Settings</h2>
      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-4">
            {[
              { label: "Email Notifications", desc: "Receive appointment reminders via email", on: true },
              { label: "SMS Alerts", desc: "Get SMS for important updates", on: true },
              { label: "Appointment Reminders", desc: "Remind me 24 hours before", on: true },
              { label: "Marketing", desc: "Health tips and offers", on: false },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-2">
                <div><p className="text-sm font-medium text-gray-900">{s.label}</p><p className="text-xs text-gray-400">{s.desc}</p></div>
                <div className={`w-10 h-5 rounded-full transition-colors ${s.on ? "bg-blue-600" : "bg-gray-200"} relative cursor-pointer shrink-0`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${s.on ? "left-5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Account</h3>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Email: {patient?.email || "N/A"}</p>
            <p>Phone: {patient?.mobileNumber || "N/A"}</p>
            <p>Member since: {patient?.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════ HELPERS ════════════════════════════════════ */

function SectionCard({ title, icon, span, children }: { title: string; icon: React.ReactNode; span?: number; children: React.ReactNode }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 ${span === 2 ? "md:col-span-2" : ""}`}>
      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">{icon} {title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-50 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
      <Icon size={36} className="text-gray-300 mx-auto mb-3" />
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}
