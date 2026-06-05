"use client";

import React, { useState } from "react";
import { usePatientStore, type PatientBooking } from "@/store/patient-store";
import {
  CalendarDays,
  Search,
  CreditCard,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  X,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface Props {
  onBack: () => void;
}

const statusLabels: Record<string, string> = {
  registered: "Registered",
  reports_uploaded: "Reports Uploaded",
  payment_done: "Payment Done",
  appointment_booked: "Appointment Booked",
  meeting_link_generated: "Meeting Link Generated",
  doctor_reviewing: "Doctor Reviewing",
  in_consultation: "In Consultation",
  prescription_generated: "Prescription Generated",
  follow_up: "Follow-up",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusColors: Record<string, string> = {
  registered: "bg-blue-100 text-blue-700",
  reports_uploaded: "bg-cyan-100 text-cyan-700",
  payment_done: "bg-green-100 text-green-700",
  appointment_booked: "bg-indigo-100 text-indigo-700",
  meeting_link_generated: "bg-purple-100 text-purple-700",
  doctor_reviewing: "bg-yellow-100 text-yellow-700",
  in_consultation: "bg-teal-100 text-teal-700",
  prescription_generated: "bg-emerald-100 text-emerald-700",
  follow_up: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const flowSteps = [
  "registered",
  "reports_uploaded",
  "payment_done",
  "appointment_booked",
  "meeting_link_generated",
  "doctor_reviewing",
  "in_consultation",
  "prescription_generated",
  "follow_up",
  "completed",
];

export default function PatientBookings({ onBack }: Props) {
  const { bookings, patients, updateBookingStatus, updatePaymentStatus } = usePatientStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const booking = selectedBooking ? bookings.find((b) => b.id === selectedBooking) : null;
  const patient = booking ? patients.find((p) => p.id === booking.patientId) : null;

  const currentStepIndex = booking ? flowSteps.indexOf(booking.bookingStatus) : -1;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Patient Bookings</h2>
          <p className="text-sm text-gray-500">{bookings.length} total bookings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <CalendarDays size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Total Bookings</div>
            <div className="text-lg font-bold text-gray-900">{bookings.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Completed</div>
            <div className="text-lg font-bold text-gray-900">{bookings.filter((b) => b.bookingStatus === "completed").length}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">In Progress</div>
            <div className="text-lg font-bold text-gray-900">{bookings.filter((b) => !["completed", "cancelled"].includes(b.bookingStatus)).length}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertCircle size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Cancelled</div>
            <div className="text-lg font-bold text-gray-900">{bookings.filter((b) => b.bookingStatus === "cancelled").length}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings..."
            className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm text-gray-600 focus:outline-none"
        >
          <option value="all">All Status</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Booking</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Package</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="text-xs font-mono text-gray-400">{b.id}</div>
                    <div className="text-xs text-gray-400">{new Date(b.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{b.patientName}</div>
                    <div className="text-xs text-gray-400">{b.patientEmail}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{b.packageName}</td>
                  <td className="px-5 py-3 font-semibold text-[#1e3a5f]">${b.packagePrice.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[b.bookingStatus] || "bg-gray-100 text-gray-500"}`}>
                      {statusLabels[b.bookingStatus] || b.bookingStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      b.paymentStatus === "paid" ? "bg-green-100 text-green-700" : b.paymentStatus === "failed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {b.paymentStatus.charAt(0).toUpperCase() + b.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setSelectedBooking(b.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <CalendarDays size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No bookings found.</p>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {booking && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedBooking(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-gray-900">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Patient & Package Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Patient</div>
                  <div className="text-sm font-bold text-gray-900">{booking.patientName}</div>
                  <div className="text-xs text-gray-400">{booking.patientEmail}</div>
                  <div className="text-xs text-gray-400">{booking.patientPhone}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Package</div>
                  <div className="text-sm font-bold text-gray-900">{booking.packageName}</div>
                  <div className="text-lg font-bold text-[#1e3a5f]">${booking.packagePrice.toFixed(2)}</div>
                </div>
              </div>

              {/* Doctor & Meeting */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Assigned Doctor</div>
                  <div className="text-sm font-bold text-gray-900">{booking.doctorName || "Not assigned yet"}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Appointment</div>
                  <div className="text-sm font-bold text-gray-900">
                    {booking.appointmentDate
                      ? new Date(booking.appointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
                      : "Not scheduled yet"}
                  </div>
                </div>
              </div>

              {booking.meetingLink && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                  <Video size={18} className="text-blue-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-blue-500 font-medium">Meeting Link</div>
                    <div className="text-sm text-blue-700 font-medium truncate">{booking.meetingLink}</div>
                  </div>
                </div>
              )}

              {/* Flow Progress */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Booking Flow Progress</h4>
                <div className="space-y-2">
                  {flowSteps.map((step, i) => {
                    const isCompleted = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    return (
                      <div key={step} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                        } ${isCurrent ? "ring-2 ring-green-300" : ""}`}>
                          {isCompleted ? <CheckCircle2 size={12} /> : i + 1}
                        </div>
                        <span className={`text-sm ${isCompleted ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                          {statusLabels[step]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {flowSteps.map((step) => (
                    <button
                      key={step}
                      onClick={() => updateBookingStatus(booking.id, step as PatientBooking["bookingStatus"])}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        booking.bookingStatus === step
                          ? "bg-[#1e3a5f] text-white shadow-md"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
                      }`}
                    >
                      {statusLabels[step]}
                    </button>
                  ))}
                  <button
                    onClick={() => updateBookingStatus(booking.id, "cancelled")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      booking.bookingStatus === "cancelled"
                        ? "bg-red-500 text-white"
                        : "bg-white border border-red-200 text-red-500 hover:bg-red-50"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                  <div className="text-xs font-semibold text-yellow-700 mb-1">Notes</div>
                  <div className="text-sm text-yellow-600">{booking.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
