"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/store/admin-store";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  Building2,
  FlaskConical,
  Pill,
  Package,
  FileText,
  ClipboardList,
  CreditCard,
  Megaphone,
  UserCog,
  Settings,
  Globe2,
  Coins,
  Bell,
  Activity,
  Search,
  LogOut,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Gift,
  Upload,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DoctorRegistration from "./DoctorRegistration";
import DoctorsList from "./DoctorsList";
import FieldVisibilitySettings from "./FieldVisibilitySettings";
import MedicinesList from "./MedicinesList";
import MedicineRegistration from "./MedicineRegistration";
import MedicineOrders from "./MedicineOrders";
import PackagesList from "./PackagesList";
import PackageRegistration from "./PackageRegistration";
import PackageBookings from "./PackageBookings";
import LabsList from "./LabsList";
import LabRegistration from "./LabRegistration";

// ─── Page type ───────────────────────────────────────────────
type PageKey =
  | "dashboard"
  | "doctors"
  | "doctor-registration"
  | "field-visibility"
  | "patients"
  | "appointments"
  | "hospitals"
  | "labs"
  | "medicines"
  | "medicine-registration"
  | "medicine-orders"
  | "packages"
  | "package-registration"
  | "package-bookings"
  | "lab-registration"
  | "prescriptions"
  | "lab-reports"
  | "payments"
  | "advertisements"
  | "users"
  | "settings"
  | "countries"
  | "currencies"
  | "notifications"
  | "activity-logs";

// ─── Data ────────────────────────────────────────────────────
const sidebarItems: {
  icon: React.ElementType;
  label: string;
  page: PageKey;
}[] = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
  { icon: Users, label: "Patients", page: "patients" },
  { icon: Stethoscope, label: "Doctors", page: "doctors" },
  { icon: CalendarDays, label: "Appointments", page: "appointments" },
  { icon: Building2, label: "Hospitals", page: "hospitals" },
  { icon: FlaskConical, label: "Labs", page: "labs" },
  { icon: Pill, label: "Medicines", page: "medicines" },
  { icon: Package, label: "Packages", page: "packages" },
  { icon: FileText, label: "Prescriptions", page: "prescriptions" },
  { icon: ClipboardList, label: "Lab Reports", page: "lab-reports" },
  { icon: CreditCard, label: "Payments", page: "payments" },
  { icon: Megaphone, label: "Advertisements", page: "advertisements" },
  { icon: UserCog, label: "Users", page: "users" },
  { icon: Settings, label: "Settings", page: "settings" },
  { icon: Globe2, label: "Countries", page: "countries" },
  { icon: Coins, label: "Currencies", page: "currencies" },
  { icon: Bell, label: "Notifications", page: "notifications" },
  { icon: Activity, label: "Activity Logs", page: "activity-logs" },
];

const appointmentData = [
  { month: "Jan", appointments: 2800 },
  { month: "Feb", appointments: 3200 },
  { month: "Mar", appointments: 3600 },
  { month: "Apr", appointments: 3900 },
  { month: "May", appointments: 4200 },
  { month: "Jun", appointments: 4500 },
  { month: "Jul", appointments: 4785 },
];

const revenueData = [
  { month: "Jan", revenue: 120000 },
  { month: "Feb", revenue: 145000 },
  { month: "Apr", revenue: 180000 },
  { month: "May", revenue: 210000 },
  { month: "Jun", revenue: 235000 },
  { month: "Jul", revenue: 256800 },
];

const serviceData = [
  { name: "Consultation", value: 45, color: "#3b82f6" },
  { name: "Lab Tests", value: 25, color: "#22c55e" },
  { name: "Medicines", value: 15, color: "#8b5cf6" },
  { name: "Packages", value: 10, color: "#f97316" },
  { name: "Others", value: 5, color: "#06b6d4" },
];

const recentAppointments = [
  { id: "PT-1001", patient: "John Doe", doctor: "Dr. Sarah Wilson", date: "25 May, 2024 - 10:00 AM", status: "Confirmed", payment: "Paid" },
  { id: "PT-1002", patient: "Michael Smith", doctor: "Dr. Robert Brown", date: "25 May, 2024 - 11:30 AM", status: "Confirmed", payment: "Paid" },
  { id: "PT-1003", patient: "Emily Johnson", doctor: "Dr. David Lee", date: "25 May, 2024 - 02:00 PM", status: "Pending", payment: "Pending" },
  { id: "PT-1004", patient: "William Davis", doctor: "Dr. Sarah Wilson", date: "25 May, 2024 - 04:00 PM", status: "Confirmed", payment: "Paid" },
];

const recentActivities = [
  { text: "New patient John Doe registered", time: "10 mins ago" },
  { text: "Payment of $50 received from Michael Smith", time: "25 mins ago" },
  { text: "Appointment booked by Emily Johnson", time: "1 hour ago" },
  { text: "Lab report uploaded for William Davis", time: "2 hours ago" },
];

// ─── Dashboard Component ─────────────────────────────────────
export default function AdminDashboard() {
  const { logout, closePanel } = useAdminStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState<PageKey>("dashboard");

  const handleNavClick = (page: PageKey) => {
    setActivePage(page);
  };

  const getPageLabel = (): string => {
    const item = sidebarItems.find((i) => i.page === activePage);
    if (activePage === "doctor-registration") return "Doctor Registration";
    if (activePage === "field-visibility") return "Field Visibility Settings";
    if (activePage === "medicine-registration") return "Medicine Registration";
    if (activePage === "medicine-orders") return "Medicine Orders";
    if (activePage === "package-registration") return "Package Registration";
    if (activePage === "package-bookings") return "Package Bookings";
    if (activePage === "lab-registration") return "Lab Registration";
    return item?.label || "Dashboard";
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#f1f5f9] flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-64"
        } bg-[#1e3a5f] text-white flex flex-col transition-all duration-300 shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          {!sidebarCollapsed && (
            <div className="leading-tight min-w-0">
              <span className="text-sm font-bold block truncate">Global Integrative</span>
              <span className="text-[10px] text-white/50 uppercase tracking-wider">Clinic Admin</span>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {sidebarItems.map((item) => {
            const isActive = activePage === item.page ||
              (item.page === "doctors" && activePage === "doctor-registration") ||
              (item.page === "doctors" && activePage === "field-visibility") ||
              (item.page === "medicines" && activePage === "medicine-registration") ||
              (item.page === "medicines" && activePage === "medicine-orders") ||
              (item.page === "packages" && activePage === "package-registration") ||
              (item.page === "packages" && activePage === "package-bookings") ||
              (item.page === "labs" && activePage === "lab-registration");
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-500/20 text-blue-300"
                    : "text-white/60 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                <item.icon size={18} className="shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center justify-center h-12 border-t border-white/10 text-white/40 hover:text-white/70 transition-colors"
        >
          <ChevronDown
            size={16}
            className={`transition-transform ${sidebarCollapsed ? "rotate-90" : "-rotate-90"}`}
          />
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
            <button className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700">
              <Globe2 size={16} />
              English
            </button>
            <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                SA
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Super Admin</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
            <button
              onClick={closePanel}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-500">
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setActivePage("dashboard")}
              >
                Home
              </span>
              {" > "}
              <span className="text-gray-800 font-medium">{getPageLabel()}</span>
            </div>
          </div>

          {/* ─── Page Router ─── */}
          {activePage === "dashboard" && <DashboardPage />}

          {activePage === "doctors" && (
            <DoctorsList
              onAddDoctor={() => setActivePage("doctor-registration")}
              onFieldSettings={() => setActivePage("field-visibility")}
            />
          )}

          {activePage === "doctor-registration" && (
            <div>
              <button
                onClick={() => setActivePage("doctors")}
                className="inline-flex items-center gap-1.5 text-sm text-[#1e3a5f] font-semibold mb-4 hover:underline"
              >
                <ChevronDown size={14} className="-rotate-90" />
                Back to Doctors
              </button>
              <DoctorRegistration />
            </div>
          )}

          {activePage === "field-visibility" && (
            <div>
              <button
                onClick={() => setActivePage("doctors")}
                className="inline-flex items-center gap-1.5 text-sm text-[#1e3a5f] font-semibold mb-4 hover:underline"
              >
                <ChevronDown size={14} className="-rotate-90" />
                Back to Doctors
              </button>
              <FieldVisibilitySettings />
            </div>
          )}

          {/* ─── Medicines Pages ─── */}
          {activePage === "medicines" && (
            <MedicinesList
              onAddMedicine={() => setActivePage("medicine-registration")}
              onEditMedicine={(id) => setActivePage("medicine-registration")}
              onViewOrders={() => setActivePage("medicine-orders")}
            />
          )}

          {activePage === "medicine-registration" && (
            <div>
              <button
                onClick={() => setActivePage("medicines")}
                className="inline-flex items-center gap-1.5 text-sm text-[#1e3a5f] font-semibold mb-4 hover:underline"
              >
                <ChevronDown size={14} className="-rotate-90" />
                Back to Medicines
              </button>
              <MedicineRegistration onDone={() => setActivePage("medicines")} />
            </div>
          )}

          {activePage === "medicine-orders" && (
            <div>
              <button
                onClick={() => setActivePage("medicines")}
                className="inline-flex items-center gap-1.5 text-sm text-[#1e3a5f] font-semibold mb-4 hover:underline"
              >
                <ChevronDown size={14} className="-rotate-90" />
                Back to Medicines
              </button>
              <MedicineOrders onBack={() => setActivePage("medicines")} />
            </div>
          )}

          {/* ─── Packages Pages ─── */}
          {activePage === "packages" && (
            <PackagesList
              onAddPackage={() => setActivePage("package-registration")}
              onEditPackage={(id) => setActivePage("package-registration")}
              onViewBookings={() => setActivePage("package-bookings")}
            />
          )}

          {activePage === "package-registration" && (
            <div>
              <button
                onClick={() => setActivePage("packages")}
                className="inline-flex items-center gap-1.5 text-sm text-[#1e3a5f] font-semibold mb-4 hover:underline"
              >
                <ChevronDown size={14} className="-rotate-90" />
                Back to Packages
              </button>
              <PackageRegistration onDone={() => setActivePage("packages")} />
            </div>
          )}

          {activePage === "package-bookings" && (
            <div>
              <button
                onClick={() => setActivePage("packages")}
                className="inline-flex items-center gap-1.5 text-sm text-[#1e3a5f] font-semibold mb-4 hover:underline"
              >
                <ChevronDown size={14} className="-rotate-90" />
                Back to Packages
              </button>
              <PackageBookings onBack={() => setActivePage("packages")} />
            </div>
          )}

          {/* ─── Labs Pages ─── */}
          {activePage === "labs" && (
            <LabsList
              onAddLab={() => setActivePage("lab-registration")}
            />
          )}

          {activePage === "lab-registration" && (
            <div>
              <button
                onClick={() => setActivePage("labs")}
                className="inline-flex items-center gap-1.5 text-sm text-[#1e3a5f] font-semibold mb-4 hover:underline"
              >
                <ChevronDown size={14} className="-rotate-90" />
                Back to Labs
              </button>
              <LabRegistration onDone={() => setActivePage("labs")} />
            </div>
          )}

          {/* Placeholder for other pages */}
          {!["dashboard", "doctors", "doctor-registration", "field-visibility", "medicines", "medicine-registration", "medicine-orders", "packages", "package-registration", "package-bookings", "labs", "lab-registration"].includes(activePage) && (
            <PlaceholderPage title={getPageLabel()} />
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard Page ──────────────────────────────────────────
function DashboardPage() {
  return (
    <>
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={<Users size={22} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          label="Total Patients"
          value="12,548"
          change="+12.5%"
          isUp
        />
        <StatCard
          icon={<Stethoscope size={22} />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          label="Total Doctors"
          value="1,248"
          change="+8.2%"
          isUp
        />
        <StatCard
          icon={<FlaskConical size={22} />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          label="Total Labs"
          value="320"
          change="+15.3%"
          isUp
        />
        <StatCard
          icon={<CreditCard size={22} />}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          label="Total Revenue"
          value="$256,800"
          change="+18.7%"
          isUp
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Appointments</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-bold text-gray-900">4,785</span>
                <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                  <TrendingUp size={12} /> +12.5%
                </span>
              </div>
            </div>
            <select className="text-xs bg-gray-100 rounded-lg px-2 py-1 text-gray-600 border-0 focus:outline-none">
              <option>This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Revenue Overview</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-bold text-gray-900">$256,800</span>
                <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                  <TrendingUp size={12} /> +18.7%
                </span>
              </div>
            </div>
            <select className="text-xs bg-gray-100 rounded-lg px-2 py-1 text-gray-600 border-0 focus:outline-none">
              <option>This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Top Services</h3>
            <select className="text-xs bg-gray-100 rounded-lg px-2 py-1 text-gray-600 border-0 focus:outline-none">
              <option>This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard icon={<ShoppingCart size={22} />} iconBg="bg-green-100" iconColor="text-green-600" label="Medicine Sales" value="$58,650" change="+11.3%" isUp />
        <StatCard icon={<Gift size={22} />} iconBg="bg-purple-100" iconColor="text-purple-600" label="Package Sales" value="$48,750" change="+9.2%" isUp />
        <StatCard icon={<Upload size={22} />} iconBg="bg-blue-100" iconColor="text-blue-600" label="Reports Uploaded" value="2,450" change="+14.8%" isUp />
        <StatCard icon={<AlertTriangle size={22} />} iconBg="bg-red-100" iconColor="text-red-600" label="Due Payments" value="$12,650" change="-2.4%" isUp={false} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Recent Appointments</h3>
            <a href="#" className="text-blue-500 text-xs font-semibold hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{apt.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{apt.patient}</td>
                    <td className="px-5 py-3 text-gray-600">{apt.doctor}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{apt.date}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${apt.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{apt.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${apt.payment === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{apt.payment}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Recent Activities</h3>
            <a href="#" className="text-blue-500 text-xs font-semibold hover:underline">View All</a>
          </div>
          <div className="p-5 space-y-4">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">{act.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Placeholder Page ────────────────────────────────────────
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <LayoutDashboard size={32} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">This module is coming soon.</p>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────
function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  change,
  isUp,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  change: string;
  isUp: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500 font-medium">{label}</div>
        <div className="text-xl font-bold text-gray-900">{value}</div>
        <div className={`text-xs font-medium flex items-center gap-0.5 mt-0.5 ${isUp ? "text-green-600" : "text-red-500"}`}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change} from previous month
        </div>
      </div>
    </div>
  );
}
