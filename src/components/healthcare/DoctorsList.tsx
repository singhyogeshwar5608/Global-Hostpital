"use client";

import React, { useState } from "react";
import {
  useDoctorStore,
  type FieldKey,
} from "@/store/doctor-store";
import {
  Search,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Building2,
  DollarSign,
  GraduationCap,
  MapPin,
  Stethoscope,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function DoctorsList({
  onAddDoctor,
  onFieldSettings,
}: {
  onAddDoctor: () => void;
  onFieldSettings: () => void;
}) {
  const { doctors, deleteDoctor, fieldVisibility } = useDoctorStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteDoctor(id);
    setDeleteConfirm(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Doctors</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {doctors.length} doctors registered
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onFieldSettings}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
            title="Field Visibility Settings (Super Admin)"
          >
            <Eye size={16} />
            <span className="hidden sm:inline">Field Settings</span>
          </button>
          <button
            onClick={onAddDoctor}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors shadow-lg"
          >
            <Plus size={16} />
            Add Doctor
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, specialty or hospital..."
            className="w-full h-11 rounded-lg bg-white border border-gray-200 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
          />
        </div>
      </div>

      {/* Hidden fields notice */}
      {Object.values(fieldVisibility).some((v) => !v) && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200 mb-5">
          <EyeOff size={14} className="text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">
            Some fields are hidden:{" "}
            {(
              [
                { key: "mobile" as FieldKey, label: "Mobile" },
                { key: "email" as FieldKey, label: "Email" },
                { key: "specialty" as FieldKey, label: "Specialty" },
                { key: "hospitalName" as FieldKey, label: "Hospital" },
                { key: "consultancyFee" as FieldKey, label: "Fee" },
              ].filter((f) => !fieldVisibility[f.key]) as { label: string }[]
            )
              .map((f) => f.label)
              .join(", ")}
          </span>
        </div>
      )}

      {/* Doctors Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Qualification
                </th>
                {fieldVisibility.specialty && (
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <GraduationCap size={12} /> Specialty
                    </span>
                  </th>
                )}
                {fieldVisibility.mobile && (
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Phone size={12} /> Mobile
                    </span>
                  </th>
                )}
                {fieldVisibility.email && (
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> Email
                    </span>
                  </th>
                )}
                {fieldVisibility.hospitalName && (
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Building2 size={12} /> Hospital
                    </span>
                  </th>
                )}
                {fieldVisibility.consultancyFee && (
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <DollarSign size={12} /> Fee
                    </span>
                  </th>
                )}
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {doc.name}
                        </div>
                        <div className="text-xs text-gray-400">{doc.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-gray-700 text-sm">{doc.qualification}</div>
                    <div className="text-xs text-gray-400">{doc.degree}</div>
                  </td>
                  {fieldVisibility.specialty && (
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        <Stethoscope size={10} />
                        {doc.specialty}
                      </span>
                    </td>
                  )}
                  {fieldVisibility.mobile && (
                    <td className="px-5 py-3.5 text-gray-600 text-xs">
                      {doc.mobile}
                    </td>
                  )}
                  {fieldVisibility.email && (
                    <td className="px-5 py-3.5 text-gray-600 text-xs">
                      {doc.email}
                    </td>
                  )}
                  {fieldVisibility.hospitalName && (
                    <td className="px-5 py-3.5 text-gray-600 text-xs">
                      {doc.hospitalName}
                    </td>
                  )}
                  {fieldVisibility.consultancyFee && (
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-[#1e3a5f]">${doc.consultancyFee}</span>
                    </td>
                  )}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={10} />
                      {doc.district}, {doc.state}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {deleteConfirm === doc.id ? (
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(doc.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete doctor"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-gray-400 text-sm"
                  >
                    {searchQuery
                      ? "No doctors found matching your search."
                      : "No doctors registered yet. Click 'Add Doctor' to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
