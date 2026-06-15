"use client";

import React from "react";
import { usePatientStore } from "@/store/patient-store";
import { useCaseStore } from "@/store/case-store";
import { useAppointmentStore } from "@/store/appointment-store";
import {
  User, Calendar, FileText, ClipboardList, CreditCard, Package,
  Bell, Pill, Stethoscope, ShieldCheck, Clock, MapPin, ChevronRight,
  Heart, PlusCircle, Lock, FlaskConical, TestTube2, Activity,
} from "lucide-react";

interface Props {
  patientId: string;
  onNewCase?: () => void;
  onNavigate?: (view: string) => void;
}

export default function PatientDashboard({ patientId, onNewCase, onNavigate }: Props) {
  const { patients } = usePatientStore();
  const { submissions } = useCaseStore();
  const { bookedSlots } = useAppointmentStore();
  const patient = patients.find((p) => p.id === patientId);
  const patientName = patient?.fullName || "Patient";
  const patientCases = submissions.filter((c) => c.patientId === patientId);
  const patientBookings = bookedSlots.filter(
    (b) => b.patientName.toLowerCase() === patientName.toLowerCase()
  );
  const upcomingAppt = patientBookings.find((b) => b.status === "confirmed" || b.status === "pending");
  const meds = patient?.currentMedications?.split(",").map(m => m.trim()).filter(Boolean) || [];

  return (
    <div className="space-y-8">
      {/* Profile Summary */}
      <div className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0">
          {patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 truncate">{patientName}</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
              <ShieldCheck size={10} /> Verified
            </span>
          </div>
          <p className="text-sm text-gray-400 font-mono">{patientId}</p>
          <p className="text-xs text-gray-400">{patient?.email}</p>
        </div>
      </div>

      {/* Upcoming Appointment Summary */}
      {upcomingAppt && (
        <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><Calendar size={18} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Upcoming Appointment</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{upcomingAppt.doctorName}</p>
              <p className="text-xs text-gray-500">{upcomingAppt.specialty}</p>
              <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock size={11} />{new Date(upcomingAppt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at {upcomingAppt.time}</span>
                <span className="flex items-center gap-1"><MapPin size={11} />Main Clinic</span>
              </div>
            </div>
            <button onClick={() => onNavigate?.("appointments")} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 transition-colors shrink-0 cursor-pointer">View</button>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {patientCases.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {patientCases.slice(0, 3).map((c) => (
              <div key={c.id} onClick={() => onNavigate?.("records")} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 text-sm cursor-pointer hover:shadow-sm transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0"><FileText size={14} /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{c.caseId}</p>
                  <p className="text-xs text-gray-400">{c.specialtyName} {c.appointmentDate ? `- ${new Date(c.appointmentDate).toLocaleDateString()}` : ""}</p>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Grid — Amazon-style "Your Account" cards */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Your Account</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard icon={User} title="Profile Information" desc="View and update your personal details, medical info, and emergency contacts" onClick={() => onNavigate?.("profile")} />
          <ActionCard icon={Calendar} title="Appointments" desc="View upcoming and past appointments. Book or reschedule visits." onClick={() => onNavigate?.("appointments")} />
          <ActionCard icon={ClipboardList} title="Medical Records" desc="Access your case history, diagnoses, and treatment records." onClick={() => onNavigate?.("records")} />
          <ActionCard icon={Pill} title="Prescriptions" desc="View current medications and prescription history." onClick={() => onNavigate?.("prescriptions")} />
          <ActionCard icon={FileText} title="Lab Reports" desc="Download and review your lab test results and reports." onClick={() => onNavigate?.("reports")} />
          <ActionCard icon={CreditCard} title="Payments & Billing" desc="View payment history, invoices, and billing statements." onClick={() => onNavigate?.("payments")} />
          <ActionCard icon={Package} title="Health Packages" desc="Browse and manage your health checkup packages." onClick={() => onNavigate?.("packages")} />
          <ActionCard icon={Bell} title="Notifications" desc="View appointment reminders, alerts, and updates." onClick={() => onNavigate?.("notifications")} />
          <ActionCard
            icon={PlusCircle}
            title="New Medical Case"
            desc="Submit a new case for consultation with our specialists."
            onClick={onNewCase}
            highlight
          />
        </div>
      </div>

      {/* Referral Status */}
      <ReferralStatus patientId={patientId} patientName={patientName} />
    </div>
  );
}

function ReferralStatus({ patientId, patientName }: { patientId: string; patientName: string }) {
  const { labReferrals, pharmacyReferrals } = usePatientStore();
  const myLabRefs = labReferrals.filter((r) => r.patientId === patientId);
  const myPharmRefs = pharmacyReferrals.filter((r) => r.patientId === patientId);

  if (myLabRefs.length === 0 && myPharmRefs.length === 0) return null;

  const statusBadge = (status: string) => {
    const m: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", accepted: "bg-blue-100 text-blue-700", in_progress: "bg-purple-100 text-purple-700", completed: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };
    return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m[status] || m.pending}`}>{status.replace(/_/g, " ")}</span>;
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Referrals & Tests</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {myLabRefs.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical size={16} className="text-teal-600" />
              <h4 className="text-sm font-bold text-gray-900">Lab Referrals ({myLabRefs.length})</h4>
            </div>
            <div className="space-y-2">
              {myLabRefs.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg text-sm">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 text-[12px]">{r.labName}</div>
                    <div className="text-[10px] text-gray-400 truncate">{r.testInstructions.substring(0, 30)}</div>
                  </div>
                  {statusBadge(r.status)}
                </div>
              ))}
            </div>
          </div>
        )}
        {myPharmRefs.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Pill size={16} className="text-green-600" />
              <h4 className="text-sm font-bold text-gray-900">Prescriptions ({myPharmRefs.length})</h4>
            </div>
            <div className="space-y-2">
              {myPharmRefs.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg text-sm">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 text-[12px]">{r.medicineNames.slice(0, 2).join(", ")}{r.medicineNames.length > 2 ? "..." : ""}</div>
                    <div className="text-[10px] text-gray-400">Dr. {r.doctorName}</div>
                  </div>
                  {statusBadge(r.status)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionCard({
  icon: Icon, title, desc, onClick, highlight,
}: {
  icon: React.ElementType; title: string; desc: string; onClick?: () => void; highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left w-full p-5 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5 ${
        highlight ? "bg-blue-50 border-blue-200 hover:bg-blue-100" : "bg-white border-gray-100 hover:border-gray-200"
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
        highlight ? "bg-blue-100 text-blue-600" : "bg-gray-50 text-gray-400"
      }`}>
        <Icon size={20} />
      </div>
      <h3 className={`text-sm font-bold mb-1 ${highlight ? "text-blue-700" : "text-gray-900"}`}>{title}</h3>
      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
    </button>
  );
}
