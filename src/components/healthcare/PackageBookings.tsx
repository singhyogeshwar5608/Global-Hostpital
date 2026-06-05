"use client";

import React, { useState } from "react";
import { usePackageStore } from "@/store/package-store";
import {
  Search,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Eye,
  X,
  DollarSign,
  Package,
} from "lucide-react";
import type { PackageBooking } from "@/store/package-store";

export default function PackageBookings({ onBack }: { onBack: () => void }) {
  const { bookings, updateBookingStatus, updatePaymentStatus } = usePackageStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<PackageBooking | null>(null);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-700";
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-purple-100 text-purple-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle2 size={12} />;
      case "scheduled": return <CalendarDays size={12} />;
      case "completed": return <CheckCircle2 size={12} />;
      case "cancelled": return <XCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.bookingStatus === "confirmed").length,
    scheduled: bookings.filter((b) => b.bookingStatus === "scheduled").length,
    completed: bookings.filter((b) => b.bookingStatus === "completed").length,
    totalRevenue: bookings.filter((b) => b.paymentStatus === "paid").reduce((sum, b) => sum + b.packagePrice, 0),
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Package Bookings</h2>
          <p className="text-gray-500 text-sm mt-0.5">{bookings.length} total bookings</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">Total Bookings</div>
          <div className="text-lg font-bold text-gray-900">{bookingStats.total}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 size={12} /> Confirmed</div>
          <div className="text-lg font-bold text-gray-900">{bookingStats.confirmed}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-xs text-blue-600 font-medium flex items-center gap-1"><CalendarDays size={12} /> Scheduled</div>
          <div className="text-lg font-bold text-gray-900">{bookingStats.scheduled}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-xs text-purple-600 font-medium flex items-center gap-1"><CheckCircle2 size={12} /> Completed</div>
          <div className="text-lg font-bold text-gray-900">{bookingStats.completed}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-xs text-orange-600 font-medium flex items-center gap-1"><DollarSign size={12} /> Revenue</div>
          <div className="text-lg font-bold text-gray-900">${bookingStats.totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by booking ID, patient name or package..."
            className="w-full h-11 rounded-lg bg-white border border-gray-200 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-lg bg-white border border-gray-200 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all min-w-[160px]"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Package</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Preferred Date</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{booking.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-900 text-sm">{booking.patientName}</div>
                    <div className="text-xs text-gray-400">{booking.patientEmail}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700 text-xs">{booking.packageName}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-[#1e3a5f]">${booking.packagePrice.toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getPaymentColor(booking.paymentStatus)}`}>
                      <CreditCard size={10} />
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={booking.bookingStatus}
                      onChange={(e) => updateBookingStatus(booking.id, e.target.value as PackageBooking["bookingStatus"])}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${getStatusColor(booking.bookingStatus)}`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(booking.preferredDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                      title="View details"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-medium">Booking ID</div>
                  <div className="text-sm font-semibold text-gray-900 font-mono">{selectedBooking.id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Booked On</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {new Date(selectedBooking.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Patient</div>
                  <div className="text-sm font-semibold text-gray-900">{selectedBooking.patientName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Phone</div>
                  <div className="text-sm text-gray-700">{selectedBooking.patientPhone}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Age</div>
                  <div className="text-sm text-gray-700">{selectedBooking.patientAge} years</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Gender</div>
                  <div className="text-sm text-gray-700">{selectedBooking.patientGender}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">Package</div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50">
                  <Package size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">{selectedBooking.packageName}</span>
                  <span className="text-sm font-bold text-[#1e3a5f] ml-auto">${selectedBooking.packagePrice.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">Preferred Schedule</div>
                <div className="text-sm text-gray-700">{selectedBooking.preferredDate} at {selectedBooking.preferredTime}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">Address</div>
                <div className="text-sm text-gray-700">{selectedBooking.address}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">Payment</div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getPaymentColor(selectedBooking.paymentStatus)}`}>
                    {selectedBooking.paymentMethod.toUpperCase()} - {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">Status</div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(selectedBooking.bookingStatus)}`}>
                    {getStatusIcon(selectedBooking.bookingStatus)}
                    {selectedBooking.bookingStatus.charAt(0).toUpperCase() + selectedBooking.bookingStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
