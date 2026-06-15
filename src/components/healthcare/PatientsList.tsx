"use client";

import React, { useState } from "react";
import { usePatientStore } from "@/store/patient-store";
import {
  Users,
  Search,
  Plus,
  FileText,
  Eye,
  ToggleLeft,
  ToggleRight,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Heart,
  AlertCircle,
  ChevronRight,
  X,
  Download,
  Share2,
} from "lucide-react";

interface Props {
  onAddPatient: () => void;
  onEditPatient: (id: string) => void;
  onViewReports: (id: string) => void;
  onViewBookings: () => void;
}

export default function PatientsList({ onAddPatient, onEditPatient, onViewReports, onViewBookings }: Props) {
  const { patients, deletePatient, togglePatientStatus } = usePatientStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const activePatients = patients.filter((p) => p.isActive).length;
  const totalReports = patients.reduce((sum, p) => sum + p.reports.length, 0);
  const inactivePatients = patients.filter((p) => !p.isActive).length;
  const recentCount = patients.filter((p) => {
    const d = new Date(p.registrationDate);
    const now = new Date();
    return now.getTime() - d.getTime() < 30 * 24 * 60 * 60 * 1000;
  }).length;

  const bloodGroups = ["all", ...Array.from(new Set(patients.map((p) => p.bloodGroup)))];

  const filtered = patients.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mobileNumber.includes(searchQuery);
    const matchesGender = genderFilter === "all" || p.gender === genderFilter;
    const matchesBlood = bloodGroupFilter === "all" || p.bloodGroup === bloodGroupFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? p.isActive : !p.isActive);
    return matchesSearch && matchesGender && matchesBlood && matchesStatus;
  });

  const patient = selectedPatient ? patients.find((p) => p.id === selectedPatient) : null;

  return (
    <div>
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Users size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Total Patients</div>
            <div className="text-lg font-bold text-gray-900">{patients.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
            <Heart size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Active Patients</div>
            <div className="text-lg font-bold text-gray-900">{activePatients}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Total Reports</div>
            <div className="text-lg font-bold text-gray-900">{totalReports}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <AlertCircle size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Inactive</div>
            <div className="text-lg font-bold text-gray-900">{inactivePatients}</div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 w-full">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, ID, phone..."
                className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              />
            </div>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
              className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
            >
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg === "all" ? "All Blood Groups" : bg}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onViewBookings}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-[#1e3a5f] bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <Calendar size={14} />
              Bookings
            </button>
            <button
              onClick={onAddPatient}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] transition-colors shadow-md"
            >
              <Plus size={14} />
              Add Patient
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Blood Group</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Reports</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Registered</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {p.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">{p.fullName}</div>
                        <div className="text-xs text-gray-400 font-mono">{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-0.5">
                      <Mail size={10} /> {p.email}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Phone size={10} /> {p.mobileNumber}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                      {p.bloodGroup}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <FileText size={12} className="text-gray-400" />
                      <span className={`text-xs font-medium ${p.reports.length > 0 ? "text-blue-600" : "text-gray-400"}`}>
                        {p.reports.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">
                    {new Date(p.registrationDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => togglePatientStatus(p.id)}
                      className="flex items-center gap-1"
                    >
                      {p.isActive ? (
                        <ToggleRight size={20} className="text-green-500" />
                      ) : (
                        <ToggleLeft size={20} className="text-gray-300" />
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedPatient(p.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => onViewReports(p.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-colors"
                        title="Reports"
                      >
                        <FileText size={14} />
                      </button>
                      <button
                        onClick={() => onEditPatient(p.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal hover:bg-teal/10 transition-colors"
                        title="Edit"
                      >
                        <ChevronRight size={14} />
                      </button>
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { deletePatient(p.id); setDeleteConfirm(null); }}
                            className="text-xs font-semibold text-red-500 hover:text-red-700"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-xs font-semibold text-gray-400 hover:text-gray-600"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Users size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {searchQuery ? "No patients match your search." : "No patients registered yet."}
            </p>
          </div>
        )}
      </div>

      {/* Patient Detail Drawer */}
      {patient && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedPatient(null)} />
          <div className="relative w-full max-w-lg bg-white shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Patient Details</h3>
              <button
                onClick={() => setSelectedPatient(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {patient.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{patient.fullName}</h4>
                  <p className="text-xs text-gray-400 font-mono">{patient.id}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${patient.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {patient.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Basic Information</h5>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Gender</span>
                    <span className="text-gray-900 font-medium capitalize">{patient.gender}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date of Birth</span>
                    <span className="text-gray-900 font-medium">{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Blood Group</span>
                    <span className="text-red-600 font-bold">{patient.bloodGroup}</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact</h5>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={12} className="text-gray-400" />
                    <span className="text-gray-900">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={12} className="text-gray-400" />
                    <span className="text-gray-900">{patient.mobileNumber}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
                    <span className="text-gray-900">{patient.address}, {patient.city}, {patient.state} {patient.pinCode}</span>
                  </div>
                </div>
              </div>

              {/* Medical Info */}
              <div>
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Medical Information</h5>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div>
                    <span className="text-xs text-gray-500 block">Disease Details</span>
                    <span className="text-sm text-gray-900">{patient.diseaseDetails || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Symptoms</span>
                    <span className="text-sm text-gray-900">{patient.symptoms || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Allergies</span>
                    <span className="text-sm text-red-600 font-medium">{patient.allergies || "None known"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Current Medications</span>
                    <span className="text-sm text-gray-900">{patient.currentMedications || "None"}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Emergency Contact</h5>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Name</span>
                    <span className="text-gray-900 font-medium">{patient.emergencyContactName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-gray-900">{patient.emergencyContactNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Relationship</span>
                    <span className="text-gray-900">{patient.emergencyRelationship}</span>
                  </div>
                </div>
              </div>

              {/* Reports */}
              <div>
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Reports ({patient.reports.length})
                </h5>
                {patient.reports.length > 0 ? (
                  <div className="space-y-2">
                    {patient.reports.map((r) => (
                      <div key={r.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <FileText size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{r.fileName}</div>
                          <div className="text-xs text-gray-400">{r.fileType.replace(/_/g, " ")} - {r.fileSize}KB</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {r.sharedWithDoctor && <Share2 size={12} className="text-green-500" />}
                          <Download size={12} className="text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No reports uploaded yet.</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center gap-2">
              <button
                onClick={() => { onViewReports(patient.id); setSelectedPatient(null); }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#1e3a5f] bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <FileText size={14} />
                Manage Reports
              </button>
              <button
                onClick={() => { onEditPatient(patient.id); setSelectedPatient(null); }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] transition-colors shadow-md"
              >
                Edit Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
