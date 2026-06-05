"use client";

import React, { useState, useMemo } from "react";
import { useHospitalStore, type Hospital } from "@/store/hospital-store";
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  Eye,
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe2,
  BedDouble,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";

export default function HospitalsList({
  onAddHospital,
  onEditHospital,
}: {
  onAddHospital: () => void;
  onEditHospital: (id: string) => void;
}) {
  const { hospitals, deleteHospital, toggleHospitalStatus } = useHospitalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewHospital, setViewHospital] = useState<Hospital | null>(null);

  // Stats
  const totalHospitals = hospitals.length;
  const activeCount = hospitals.filter((h) => h.isActive).length;
  const inactiveCount = hospitals.filter((h) => !h.isActive).length;
  const totalBeds = hospitals.reduce((sum, h) => sum + h.bedCapacity, 0);

  // Filter
  const filtered = useMemo(() => {
    return hospitals.filter((h) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.state.toLowerCase().includes(q) ||
        h.registrationNumber.toLowerCase().includes(q) ||
        h.specialty.some((s) => s.toLowerCase().includes(q));
      const matchesType = typeFilter === "all" || h.type === typeFilter;
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && h.isActive) ||
        (statusFilter === "inactive" && !h.isActive);
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [hospitals, searchQuery, typeFilter, statusFilter]);

  const handleDelete = (id: string) => {
    deleteHospital(id);
    setDeleteConfirm(null);
  };

  const typeBadge = (type: Hospital["type"]) => {
    const configs: Record<string, { bg: string; text: string }> = {
      government: { bg: "bg-blue-100", text: "text-blue-700" },
      private: { bg: "bg-purple-100", text: "text-purple-700" },
      "semi-government": { bg: "bg-cyan-100", text: "text-cyan-700" },
      trust: { bg: "bg-orange-100", text: "text-orange-700" },
      ngo: { bg: "bg-green-100", text: "text-green-700" },
    };
    const cfg = configs[type] || configs.private;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
        {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hospitals</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {hospitals.length} hospitals registered
          </p>
        </div>
        <button
          onClick={onAddHospital}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors shadow-lg"
        >
          <Plus size={16} />
          Add Hospital
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 size={18} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Total</div>
              <div className="text-lg font-bold text-gray-900">{totalHospitals}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Active</div>
              <div className="text-lg font-bold text-green-600">{activeCount}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle size={18} className="text-red-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Inactive</div>
              <div className="text-lg font-bold text-red-600">{inactiveCount}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <BedDouble size={18} className="text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Total Beds</div>
              <div className="text-lg font-bold text-purple-600">{totalBeds.toLocaleString()}</div>
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
            placeholder="Search by name, city, specialty, registration..."
            className="w-full h-11 rounded-lg bg-white border border-gray-200 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-11 rounded-lg bg-white border border-gray-200 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
        >
          <option value="all">All Types</option>
          <option value="government">Government</option>
          <option value="private">Private</option>
          <option value="semi-government">Semi-Government</option>
          <option value="trust">Trust</option>
          <option value="ngo">NGO</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-lg bg-white border border-gray-200 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Hospitals Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Hospital
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Beds
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((hospital) => (
                <tr
                  key={hospital.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-lg shrink-0">
                        {hospital.logo}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{hospital.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{hospital.id}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {hospital.specialty.slice(0, 2).map((s) => (
                            <span key={s} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-teal/10 text-teal text-[10px] font-semibold">
                              {s}
                            </span>
                          ))}
                          {hospital.specialty.length > 2 && (
                            <span className="text-[10px] text-gray-400 font-medium">+{hospital.specialty.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">{typeBadge(hospital.type)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <MapPin size={12} className="text-gray-400 shrink-0" />
                      <span>{hospital.city}, {hospital.state}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{hospital.country} - {hospital.pinCode}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Phone size={10} className="text-gray-400" />
                      {hospital.phone}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <Mail size={10} className="text-gray-400" />
                      {hospital.email}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-[#1e3a5f]">{hospital.bedCapacity}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleHospitalStatus(hospital.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        hospital.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {hospital.isActive ? (
                        <><CheckCircle2 size={10} /> Active</>
                      ) : (
                        <><XCircle size={10} /> Inactive</>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setViewHospital(hospital)}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => onEditHospital(hospital.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors"
                        title="Edit Hospital"
                      >
                        <Edit3 size={15} />
                      </button>
                      {deleteConfirm === hospital.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(hospital.id)}
                            className="px-2 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(hospital.id)}
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
                    <Building2 size={32} className="mx-auto mb-2 opacity-50" />
                    {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                      ? "No hospitals found matching your filters."
                      : "No hospitals registered yet. Click 'Add Hospital' to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Hospital Detail Modal */}
      {viewHospital && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Hospital Details</h3>
              <button
                onClick={() => setViewHospital(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Hospital Header */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#1e3a5f]/5 to-blue-50/50 border border-[#1e3a5f]/10">
                <div className="w-14 h-14 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-2xl shadow-sm">
                  {viewHospital.logo}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{viewHospital.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {typeBadge(viewHospital.type)}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${viewHospital.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {viewHospital.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-1">{viewHospital.id} · REG: {viewHospital.registrationNumber}</div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Address</h4>
                <div className="p-3 rounded-lg bg-gray-50 flex items-start gap-3">
                  <MapPin size={16} className="text-[#1e3a5f] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900 font-medium">{viewHospital.address}</p>
                    <p className="text-sm text-gray-600">{viewHospital.city}, {viewHospital.state} - {viewHospital.pinCode}</p>
                    <p className="text-xs text-gray-400">{viewHospital.country}</p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-2">
                    <Phone size={14} className="text-[#1e3a5f]" />
                    <div>
                      <div className="text-[10px] text-gray-400">Phone</div>
                      <div className="text-sm text-gray-900 font-medium">{viewHospital.phone}</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-2">
                    <Phone size={14} className="text-red-500" />
                    <div>
                      <div className="text-[10px] text-gray-400">Emergency</div>
                      <div className="text-sm text-red-600 font-medium">{viewHospital.emergencyNumber}</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-2">
                    <Mail size={14} className="text-[#1e3a5f]" />
                    <div>
                      <div className="text-[10px] text-gray-400">Email</div>
                      <div className="text-sm text-gray-900">{viewHospital.email}</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-2">
                    <Globe2 size={14} className="text-[#1e3a5f]" />
                    <div>
                      <div className="text-[10px] text-gray-400">Website</div>
                      <div className="text-sm text-blue-600">{viewHospital.website}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specialty & Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewHospital.specialty.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-teal/10 text-teal text-xs font-semibold">
                        <Stethoscope size={10} />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Capacity</h4>
                  <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-3">
                    <BedDouble size={20} className="text-[#1e3a5f]" />
                    <div>
                      <div className="text-lg font-bold text-gray-900">{viewHospital.bedCapacity}</div>
                      <div className="text-xs text-gray-400">Bed Capacity</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Documents */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Registration Documents</h4>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Reg. No: {viewHospital.registrationNumber}</span>
                </div>
                <div className="space-y-1.5">
                  {viewHospital.registrationDocuments.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <FileText size={14} className="text-blue-500" />
                      <span className="text-sm text-gray-700">{doc}</span>
                      <span className="ml-auto text-xs text-gray-400">PDF</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => { onEditHospital(viewHospital.id); setViewHospital(null); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 size={14} /> Edit Hospital
                </button>
                <button
                  onClick={() => setViewHospital(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
