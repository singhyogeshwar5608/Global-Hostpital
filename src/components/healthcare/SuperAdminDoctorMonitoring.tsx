"use client";

import React from "react";
import { useDoctorStore } from "@/store/doctor-store";
import {
  Stethoscope,
  Users,
  UserCheck,
  UserX,
  Wifi,
  WifiOff,
  CalendarDays,
  DollarSign,
  Star,
  TrendingUp,
  Activity,
  Eye,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

export default function SuperAdminDoctorMonitoring() {
  const { doctors, auditLogs } = useDoctorStore();

  const totalDoctors = doctors.length;
  const activeDoctors = doctors.filter((d) => d.status === "active").length;
  const inactiveDoctors = doctors.filter((d) => d.status === "inactive").length;
  const suspendedDoctors = doctors.filter((d) => d.status === "suspended").length;
  const onlineDoctors = doctors.filter((d) => d.isOnline).length;
  const totalConsultations = doctors.reduce((sum, d) => sum + d.totalConsultations, 0);
  const totalRevenue = doctors.reduce((sum, d) => sum + d.totalRevenue, 0);
  const avgRating = totalDoctors > 0 ? (doctors.reduce((sum, d) => sum + d.rating, 0) / totalDoctors).toFixed(1) : "0";

  // Recent audit logs
  const recentLogs = auditLogs.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Doctor Monitoring Dashboard</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Super Admin overview of all doctor activities and performance
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e3a5f] text-white">
          <ShieldCheck size={16} />
          <span className="text-sm font-semibold">Super Admin</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Stethoscope size={20} />} bg="bg-blue-100" color="text-blue-600" label="Total Doctors" value={String(totalDoctors)} />
        <StatCard icon={<UserCheck size={20} />} bg="bg-green-100" color="text-green-600" label="Active Doctors" value={String(activeDoctors)} />
        <StatCard icon={<UserX size={20} />} bg="bg-red-100" color="text-red-600" label="Suspended" value={String(suspendedDoctors)} />
        <StatCard icon={<Wifi size={20} />} bg="bg-emerald-100" color="text-emerald-600" label="Online Now" value={String(onlineDoctors)} />
        <StatCard icon={<CalendarDays size={20} />} bg="bg-purple-100" color="text-purple-600" label="Total Consultations" value={totalConsultations.toLocaleString()} />
        <StatCard icon={<DollarSign size={20} />} bg="bg-amber-100" color="text-amber-600" label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
        <StatCard icon={<Star size={20} />} bg="bg-yellow-100" color="text-yellow-600" label="Avg. Rating" value={`${avgRating} / 5`} />
        <StatCard icon={<Activity size={20} />} bg="bg-cyan-100" color="text-cyan-600" label="Audit Logs" value={String(auditLogs.length)} />
      </div>

      {/* Doctor Performance Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <BarChart3 size={16} className="text-[#1e3a5f]" />
            Doctor Performance & Revenue
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Doctor</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase">Online</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase">Consultations</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase">Revenue</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase">Rating</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase">Permissions</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => {
                const enabledPerms = Object.values(doc.permissions).filter(Boolean).length;
                const totalPerms = Object.keys(doc.permissions).length;
                return (
                  <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={doc.photo} alt={doc.name} className="w-8 h-8 rounded-lg object-cover border border-gray-100" />
                        <div>
                          <div className="font-semibold text-gray-900 text-xs">{doc.name}</div>
                          <div className="text-[10px] text-gray-400">{doc.specialty}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        doc.status === "active" ? "bg-green-50 text-green-700" :
                        doc.status === "suspended" ? "bg-red-50 text-red-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {doc.isOnline ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold">
                          <Wifi size={12} /> Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                          <WifiOff size={12} /> Offline
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-900 text-xs">{doc.totalConsultations}</td>
                    <td className="px-4 py-3 text-center font-semibold text-[#1e3a5f] text-xs">${doc.totalRevenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-semibold text-gray-900">{doc.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(enabledPerms / totalPerms) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500">{enabledPerms}/{totalPerms}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {doc.lastLogin ? new Date(doc.lastLogin).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Logs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Activity size={16} className="text-[#1e3a5f]" />
            Recent Doctor Activities
          </h3>
        </div>
        <div className="p-5 space-y-3">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{log.doctorName}</span> — {log.details}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {log.date} at {log.time} | {log.device} | {log.ipAddress}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  bg,
  color,
  label,
  value,
}: {
  icon: React.ReactNode;
  bg: string;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center ${color} shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] text-gray-500 font-medium">{label}</div>
        <div className="text-lg font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}
