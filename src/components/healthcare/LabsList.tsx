"use client";

import React, { useState } from "react";
import { useLabStore } from "@/store/lab-store";
import {
  Search,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  FlaskConical,
  MapPin,
  Eye,
  X,
  Copy,
  CheckCircle2,
  Key,
  User,
  Building2,
} from "lucide-react";

export default function LabsList({
  onAddLab,
}: {
  onAddLab: () => void;
}) {
  const { labs, deleteLab, toggleLabStatus } = useLabStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewLab, setViewLab] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = labs.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.labName.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q) ||
      l.district.toLowerCase().includes(q) ||
      l.state.toLowerCase().includes(q) ||
      l.ownerName.toLowerCase().includes(q)
    );
  });

  const handleDelete = (id: string) => {
    deleteLab(id);
    setDeleteConfirm(null);
  };

  const copyToClipboard = (text: string, labId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(labId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedLab = viewLab ? labs.find((l) => l.id === viewLab) : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Labs</h2>
          <p className="text-gray-500 text-sm mt-0.5">{labs.length} labs registered</p>
        </div>
        <button
          onClick={onAddLab}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors shadow-lg"
        >
          <Plus size={16} />
          Register Lab
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <FlaskConical size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Total Labs</div>
              <div className="text-lg font-bold text-gray-900">{labs.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Active Labs</div>
              <div className="text-lg font-bold text-gray-900">{labs.filter((l) => l.isActive).length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Building2 size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Districts</div>
              <div className="text-lg font-bold text-gray-900">{new Set(labs.map((l) => l.district)).size}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <User size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Technicians</div>
              <div className="text-lg font-bold text-gray-900">{labs.length}</div>
            </div>
          </div>
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
            placeholder="Search labs by name, ID, district, owner..."
            className="w-full h-11 rounded-lg bg-white border border-gray-200 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
          />
        </div>
      </div>

      {/* Labs Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Lab</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Lab ID / Password</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Pathologist</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lab) => (
                <tr key={lab.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                        <FlaskConical size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{lab.labName}</div>
                        <div className="text-xs text-gray-400">{lab.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Key size={10} className="text-gray-400" />
                        <span className="font-mono text-xs text-gray-700">{lab.id}</span>
                        <button
                          onClick={() => copyToClipboard(lab.id, lab.id + "-id")}
                          className="p-0.5 rounded text-gray-400 hover:text-blue-500 transition-colors"
                          title="Copy Lab ID"
                        >
                          {copiedId === lab.id + "-id" ? <CheckCircle2 size={10} className="text-green-500" /> : <Copy size={10} />}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Key size={10} className="text-gray-400" />
                        <span className="font-mono text-xs text-gray-500">{lab.password}</span>
                        <button
                          onClick={() => copyToClipboard(lab.password, lab.id + "-pw")}
                          className="p-0.5 rounded text-gray-400 hover:text-blue-500 transition-colors"
                          title="Copy Password"
                        >
                          {copiedId === lab.id + "-pw" ? <CheckCircle2 size={10} className="text-green-500" /> : <Copy size={10} />}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-medium text-gray-900">{lab.ownerName}</div>
                    <div className="text-xs text-gray-400">{lab.ownerQualification}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <MapPin size={10} />
                      {lab.district}, {lab.state}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{lab.country}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <img src={lab.technician.photo} alt="" className="w-7 h-7 rounded-full border border-gray-200" />
                      <div>
                        <div className="text-xs font-medium text-gray-900">{lab.technician.name}</div>
                        <div className="text-[10px] text-gray-400">{lab.technician.qualification}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <img src={lab.pathologist.photo} alt="" className="w-7 h-7 rounded-full border border-gray-200" />
                      <div>
                        <div className="text-xs font-medium text-gray-900">{lab.pathologist.name}</div>
                        <div className="text-[10px] text-gray-400">{lab.pathologist.qualification}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggleLabStatus(lab.id)} className="flex items-center gap-1.5">
                      {lab.isActive ? (
                        <><ToggleRight size={20} className="text-green-500" /><span className="text-xs text-green-600 font-medium">Active</span></>
                      ) : (
                        <><ToggleLeft size={20} className="text-gray-400" /><span className="text-xs text-gray-400 font-medium">Inactive</span></>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-center">
                      <button onClick={() => setViewLab(lab.id)} className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="View details">
                        <Eye size={15} />
                      </button>
                      {deleteConfirm === lab.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(lab.id)} className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600">Yes</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(lab.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">No labs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lab Detail Modal */}
      {selectedLab && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FlaskConical size={20} className="text-[#1e3a5f]" />
                {selectedLab.labName}
              </h3>
              <button onClick={() => setViewLab(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Lab Info */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Lab Information</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedLab.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {selectedLab.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Name:</span> <span className="font-semibold text-gray-900">{selectedLab.labName}</span></div>
                  <div><span className="text-gray-500">District:</span> <span className="font-medium text-gray-700">{selectedLab.district}</span></div>
                  <div><span className="text-gray-500">State:</span> <span className="font-medium text-gray-700">{selectedLab.state}</span></div>
                  <div><span className="text-gray-500">Country:</span> <span className="font-medium text-gray-700">{selectedLab.country}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200 grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-gray-500">Lab ID</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-sm font-bold text-[#1e3a5f]">{selectedLab.id}</span>
                      <button onClick={() => copyToClipboard(selectedLab.id, "detail-id")} className="p-1 rounded text-gray-400 hover:text-blue-500">
                        {copiedId === "detail-id" ? <CheckCircle2 size={12} className="text-green-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Password</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-sm font-bold text-[#1e3a5f]">{selectedLab.password}</span>
                      <button onClick={() => copyToClipboard(selectedLab.password, "detail-pw")} className="p-1 rounded text-gray-400 hover:text-blue-500">
                        {copiedId === "detail-pw" ? <CheckCircle2 size={12} className="text-green-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner */}
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-xs text-gray-500 font-semibold uppercase">Lab Owner</span>
                <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                  <div><span className="text-gray-500">Name:</span> <span className="font-semibold text-gray-900">{selectedLab.ownerName}</span></div>
                  <div><span className="text-gray-500">Qualification:</span> <span className="font-medium text-gray-700">{selectedLab.ownerQualification}</span></div>
                </div>
              </div>

              {/* Technician */}
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-xs text-gray-500 font-semibold uppercase">Lab Technician</span>
                <div className="flex items-center gap-3 mt-2 mb-3">
                  <img src={selectedLab.technician.photo} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-gray-200" />
                  <div>
                    <div className="font-semibold text-gray-900">{selectedLab.technician.name}</div>
                    <div className="text-xs text-gray-500">{selectedLab.technician.qualification}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">GST Number:</span> <span className="font-mono text-xs text-gray-700">{selectedLab.technician.gstNumber || "N/A"}</span></div>
                  <div><span className="text-gray-500">Documents:</span> <span className="text-xs text-gray-700">{selectedLab.technician.registrationDocuments || "N/A"}</span></div>
                  <div><span className="text-gray-500">Signature:</span> <span className="text-xs text-gray-700">{selectedLab.technician.signature || "N/A"}</span></div>
                </div>
              </div>

              {/* Pathologist */}
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-xs text-gray-500 font-semibold uppercase">Pathologist</span>
                <div className="flex items-center gap-3 mt-2 mb-3">
                  <img src={selectedLab.pathologist.photo} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-gray-200" />
                  <div>
                    <div className="font-semibold text-gray-900">{selectedLab.pathologist.name}</div>
                    <div className="text-xs text-gray-500">{selectedLab.pathologist.qualification}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">GST Number:</span> <span className="font-mono text-xs text-gray-700">{selectedLab.pathologist.gstNumber || "N/A"}</span></div>
                  <div><span className="text-gray-500">Documents:</span> <span className="text-xs text-gray-700">{selectedLab.pathologist.registrationDocuments || "N/A"}</span></div>
                  <div><span className="text-gray-500">Signature:</span> <span className="text-xs text-gray-700">{selectedLab.pathologist.signature || "N/A"}</span></div>
                </div>
              </div>

              {/* Created Date */}
              <div className="text-xs text-gray-400 text-center">
                Registered on {new Date(selectedLab.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
