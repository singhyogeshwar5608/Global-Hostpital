"use client";

import React, { useState, useMemo } from "react";
import {
  useAppointmentStore,
  formatTime,
  type BookedSlot,
} from "@/store/appointment-store";
import {
  Search,
  Plus,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  Video,
  Edit3,
  Trash2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Stethoscope,
  User,
  Mail,
  Phone,
  FileText,
  MoreVertical,
} from "lucide-react";

export default function AppointmentsList({
  onManageSlots,
}: {
  onManageSlots: () => void;
}) {
  const { bookedSlots, updateBookingStatus, updatePaymentStatus, deleteBooking, editBooking } =
    useAppointmentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewBooking, setViewBooking] = useState<BookedSlot | null>(null);
  const [editBookingId, setEditBookingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BookedSlot>>({});

  // Stats
  const totalAppointments = bookedSlots.length;
  const confirmedCount = bookedSlots.filter((b) => b.status === "confirmed").length;
  const pendingCount = bookedSlots.filter((b) => b.status === "pending").length;
  const cancelledCount = bookedSlots.filter((b) => b.status === "cancelled").length;
  const totalRevenue = bookedSlots
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.fee, 0);

  // Filter
  const filtered = useMemo(() => {
    return bookedSlots.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        b.patientName.toLowerCase().includes(q) ||
        b.doctorName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.specialty.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesDate = !dateFilter || b.date === dateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookedSlots, searchQuery, statusFilter, dateFilter]);

  const handleDelete = (id: string) => {
    deleteBooking(id);
    setDeleteConfirm(null);
  };

  const handleEditSave = (id: string) => {
    editBooking(id, editForm);
    setEditBookingId(null);
    setEditForm({});
  };

  const startEdit = (booking: BookedSlot) => {
    setEditBookingId(booking.id);
    setEditForm({
      patientName: booking.patientName,
      patientEmail: booking.patientEmail,
      patientPhone: booking.patientPhone,
      patientReason: booking.patientReason,
      time: booking.time,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });
  };

  const statusBadge = (status: BookedSlot["status"]) => {
    const configs: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
      confirmed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: AlertCircle },
      cancelled: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
      completed: { bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircle2 },
    };
    const cfg = configs[status] || configs.pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
        <Icon size={10} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const paymentBadge = (status: BookedSlot["paymentStatus"]) => {
    const configs: Record<string, { bg: string; text: string }> = {
      paid: { bg: "bg-green-100", text: "text-green-700" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
      refunded: { bg: "bg-purple-100", text: "text-purple-700" },
    };
    const cfg = configs[status] || configs.pending;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {totalAppointments} appointments booked
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onManageSlots}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <CalendarDays size={16} />
            Manage Slots
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <CalendarDays size={18} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Total</div>
              <div className="text-lg font-bold text-gray-900">{totalAppointments}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Confirmed</div>
              <div className="text-lg font-bold text-green-600">{confirmedCount}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <AlertCircle size={18} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Pending</div>
              <div className="text-lg font-bold text-yellow-600">{pendingCount}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle size={18} className="text-red-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Cancelled</div>
              <div className="text-lg font-bold text-red-600">{cancelledCount}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <DollarSign size={18} className="text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Revenue</div>
              <div className="text-lg font-bold text-purple-600">${totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient, doctor, ID, specialty..."
            className="w-full h-11 rounded-lg bg-white border border-gray-200 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-lg bg-white border border-gray-200 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-11 rounded-lg bg-white border border-gray-200 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
        />
        {dateFilter && (
          <button
            onClick={() => setDateFilter("")}
            className="h-11 px-3 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Appointment
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {booking.patientName}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">{booking.id}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{booking.doctorName}</div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        <Stethoscope size={9} />
                        {booking.specialty}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays size={13} className="text-gray-400" />
                      <span className="text-gray-700">{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <Clock size={11} className="text-gray-400" />
                      {formatTime(booking.time)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">{statusBadge(booking.status)}</td>
                  <td className="px-5 py-3.5">{paymentBadge(booking.paymentStatus)}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-[#1e3a5f]">${booking.fee}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setViewBooking(booking)}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => startEdit(booking)}
                        className="p-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </button>
                      {deleteConfirm === booking.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(booking.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                    <CalendarDays size={32} className="mx-auto mb-2 opacity-50" />
                    {searchQuery || statusFilter !== "all" || dateFilter
                      ? "No appointments found matching your filters."
                      : "No appointments booked yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Booking Detail Modal */}
      {viewBooking && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Appointment Details</h3>
              <button
                onClick={() => setViewBooking(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* ID */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                <FileText size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">ID:</span>
                <span className="font-mono font-semibold text-sm text-gray-900">{viewBooking.id}</span>
                <div className="ml-auto">{statusBadge(viewBooking.status)}</div>
              </div>

              {/* Patient Info */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Patient Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <User size={14} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{viewBooking.patientName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{viewBooking.patientEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{viewBooking.patientPhone}</span>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Doctor Information</h4>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50">
                  <Stethoscope size={18} className="text-blue-500" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{viewBooking.doctorName}</div>
                    <div className="text-xs text-gray-500">{viewBooking.specialty}</div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Schedule</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarDays size={14} className="text-[#1e3a5f]" />
                      <span className="text-xs text-gray-400">Date</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatDate(viewBooking.date)}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={14} className="text-[#1e3a5f]" />
                      <span className="text-xs text-gray-400">Time</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatTime(viewBooking.time)}</span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              {viewBooking.patientReason && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Reason for Visit</h4>
                  <p className="text-sm text-gray-700 p-3 rounded-lg bg-gray-50">{viewBooking.patientReason}</p>
                </div>
              )}

              {/* Payment */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</h4>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <span className="text-sm text-gray-600">Consultation Fee</span>
                    <div className="text-lg font-bold text-[#1e3a5f]">${viewBooking.fee}</div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1">{paymentBadge(viewBooking.paymentStatus)}</div>
                    <span className="text-xs text-gray-400 capitalize">{viewBooking.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Meeting Link */}
              {viewBooking.meetingLink && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Meeting Link</h4>
                  <div className="p-3 rounded-lg bg-teal/5 border border-teal/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Video size={14} className="text-teal" />
                      <span className="text-xs font-semibold text-teal">Video Consultation</span>
                    </div>
                    <p className="text-xs text-teal-dark/70 break-all">{viewBooking.meetingLink}</p>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  {viewBooking.status === "pending" && (
                    <button
                      onClick={() => {
                        updateBookingStatus(viewBooking.id, "confirmed");
                        setViewBooking({ ...viewBooking, status: "confirmed" });
                      }}
                      className="px-3 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={12} /> Confirm
                    </button>
                  )}
                  {(viewBooking.status === "confirmed" || viewBooking.status === "pending") && (
                    <button
                      onClick={() => {
                        updateBookingStatus(viewBooking.id, "cancelled");
                        setViewBooking({ ...viewBooking, status: "cancelled", paymentStatus: "refunded" });
                      }}
                      className="px-3 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors flex items-center gap-1.5"
                    >
                      <XCircle size={12} /> Cancel
                    </button>
                  )}
                  {viewBooking.status === "confirmed" && (
                    <button
                      onClick={() => {
                        updateBookingStatus(viewBooking.id, "completed");
                        setViewBooking({ ...viewBooking, status: "completed" });
                      }}
                      className="px-3 py-2 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={12} /> Mark Completed
                    </button>
                  )}
                  {viewBooking.paymentStatus === "pending" && (
                    <button
                      onClick={() => {
                        updatePaymentStatus(viewBooking.id, "paid");
                        setViewBooking({ ...viewBooking, paymentStatus: "paid" });
                      }}
                      className="px-3 py-2 rounded-lg bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 transition-colors flex items-center gap-1.5"
                    >
                      <DollarSign size={12} /> Mark Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {editBookingId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Edit Appointment</h3>
              <button
                onClick={() => { setEditBookingId(null); setEditForm({}); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Patient Name</label>
                <input
                  type="text"
                  value={editForm.patientName || ""}
                  onChange={(e) => setEditForm({ ...editForm, patientName: e.target.value })}
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={editForm.patientEmail || ""}
                  onChange={(e) => setEditForm({ ...editForm, patientEmail: e.target.value })}
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone</label>
                <input
                  type="tel"
                  value={editForm.patientPhone || ""}
                  onChange={(e) => setEditForm({ ...editForm, patientPhone: e.target.value })}
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Reason</label>
                <textarea
                  value={editForm.patientReason || ""}
                  onChange={(e) => setEditForm({ ...editForm, patientReason: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Appointment Status</label>
                <select
                  value={editForm.status || ""}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as BookedSlot["status"] })}
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Payment Status</label>
                <select
                  value={editForm.paymentStatus || ""}
                  onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value as BookedSlot["paymentStatus"] })}
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => { setEditBookingId(null); setEditForm({}); }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditSave(editBookingId)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
