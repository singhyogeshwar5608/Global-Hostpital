"use client";

import React, { useState } from "react";
import { useLabStore } from "@/store/lab-store";
import {
  FlaskConical,
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  X,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  ClipboardList,
  Activity,
  ChevronDown,
} from "lucide-react";

type LabPageKey = "overview" | "patients" | "reports" | "payments" | "settings";

export default function LabDashboard() {
  const { currentLab, labLogout, closeLabPanel } = useLabStore();
  const [activePage, setActivePage] = useState<LabPageKey>("overview");

  if (!currentLab) return null;

  const sidebarItems: { icon: React.ElementType; label: string; page: LabPageKey }[] = [
    { icon: LayoutDashboard, label: "Overview", page: "overview" },
    { icon: Users, label: "Patients", page: "patients" },
    { icon: ClipboardList, label: "Lab Reports", page: "reports" },
    { icon: CreditCard, label: "Payments", page: "payments" },
    { icon: Settings, label: "Settings", page: "settings" },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#f1f5f9] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e3a5f] text-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center shrink-0">
            <FlaskConical size={18} className="text-white" />
          </div>
          <div className="leading-tight min-w-0">
            <span className="text-sm font-bold block truncate">{currentLab.labName}</span>
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Lab Dashboard</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActivePage(item.page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activePage === item.page
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90"
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <div className="px-3 py-2 text-xs text-white/40">
            ID: <span className="font-mono text-white/60">{currentLab.id}</span>
          </div>
          <button
            onClick={labLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search..." className="h-9 w-64 rounded-lg bg-gray-100 pl-9 pr-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {currentLab.labName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">{currentLab.labName}</div>
                <div className="text-[10px] text-gray-400">{currentLab.district}, {currentLab.state}</div>
              </div>
            </div>
            <button onClick={closeLabPanel} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100" title="Close">
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activePage === "overview" && <LabOverviewPage lab={currentLab} />}
          {activePage !== "overview" && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                <LayoutDashboard size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {sidebarItems.find((i) => i.page === activePage)?.label || "Page"}
              </h3>
              <p className="text-gray-500 text-sm">This section is coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function LabOverviewPage({ lab }: { lab: ReturnType<typeof useLabStore.getState>["currentLab"] & {} }) {
  if (!lab) return null;

  const statCards = [
    { icon: <Users size={22} />, bg: "bg-blue-100", color: "text-blue-600", label: "Total Patients", value: "3,456", change: "+8.5%", isUp: true },
    { icon: <ClipboardList size={22} />, bg: "bg-green-100", color: "text-green-600", label: "Reports Generated", value: "1,230", change: "+15.2%", isUp: true },
    { icon: <CreditCard size={22} />, bg: "bg-purple-100", color: "text-purple-600", label: "Revenue", value: "$45,680", change: "+12.3%", isUp: true },
    { icon: <Activity size={22} />, bg: "bg-orange-100", color: "text-orange-600", label: "Pending Reports", value: "28", change: "-5.1%", isUp: false },
  ];

  const recentTests = [
    { id: "RPT-001", patient: "John Doe", test: "Complete Blood Count", status: "Completed", date: "25 May 2024" },
    { id: "RPT-002", patient: "Emily Johnson", test: "Lipid Profile", status: "Processing", date: "25 May 2024" },
    { id: "RPT-003", patient: "Michael Smith", test: "Thyroid Profile", status: "Completed", date: "24 May 2024" },
    { id: "RPT-004", patient: "Sarah Wilson", test: "Liver Function Test", status: "Pending", date: "24 May 2024" },
  ];

  return (
    <>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">Welcome, {lab.labName}</h2>
        <p className="text-gray-500 text-sm">Lab ID: <span className="font-mono font-semibold text-[#1e3a5f]">{lab.id}</span> • {lab.district}, {lab.state}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center ${card.color} shrink-0`}>{card.icon}</div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500 font-medium">{card.label}</div>
              <div className="text-xl font-bold text-gray-900">{card.value}</div>
              <div className={`text-xs font-medium flex items-center gap-0.5 mt-0.5 ${card.isUp ? "text-green-600" : "text-red-500"}`}>
                {card.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {card.change} from last month
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lab Info + Recent Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lab Info */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Lab Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Lab Name</span>
              <span className="font-semibold text-gray-900">{lab.labName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Owner</span>
              <span className="font-medium text-gray-700">{lab.ownerName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Technician</span>
              <span className="font-medium text-gray-700">{lab.technician.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Pathologist</span>
              <span className="font-medium text-gray-700">{lab.pathologist.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Location</span>
              <span className="font-medium text-gray-700">{lab.district}, {lab.state}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500">Status</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${lab.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {lab.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Tests */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Recent Lab Tests</h3>
            <a href="#" className="text-blue-500 text-xs font-semibold hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Test</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map((test) => (
                  <tr key={test.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{test.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{test.patient}</td>
                    <td className="px-5 py-3 text-gray-600">{test.test}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{test.date}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        test.status === "Completed" ? "bg-green-100 text-green-700" :
                        test.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {test.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
