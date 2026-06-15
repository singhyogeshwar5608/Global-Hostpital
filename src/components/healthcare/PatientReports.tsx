"use client";

import React, { useState } from "react";
import { usePatientStore, type PatientReport } from "@/store/patient-store";
import {
  FileText,
  Search,
  Upload,
  Trash2,
  Download,
  Share2,
  MessageSquare,
  Paperclip,
  Eye,
  X,
  Check,
  Image,
  File,
  Filter,
} from "lucide-react";

interface Props {
  patientId: string;
  onBack: () => void;
}

const reportTypeLabels: Record<string, string> = {
  blood_test: "Blood Test",
  xray: "X-Ray",
  mri: "MRI",
  ct_scan: "CT Scan",
  ecg: "ECG",
  ultrasound: "Ultrasound",
  prescription: "Prescription",
  medical_doc: "Medical Document",
  insurance: "Insurance",
  other: "Other",
};

const reportTypeIcons: Record<string, React.ElementType> = {
  blood_test: FileText,
  xray: Image,
  mri: Image,
  ct_scan: Image,
  ecg: FileText,
  ultrasound: Image,
  prescription: File,
  medical_doc: File,
  insurance: File,
  other: File,
};

export default function PatientReports({ patientId, onBack }: Props) {
  const { patients, addReport, deleteReport, addDoctorRemarks, toggleShareWithDoctor, toggleAttachToPrescription, maxFileSize } = usePatientStore();
  const patient = patients.find((p) => p.id === patientId);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [remarksModal, setRemarksModal] = useState<string | null>(null);
  const [remarksText, setRemarksText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Upload form
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileType, setUploadFileType] = useState<PatientReport["fileType"]>("blood_test");
  const [uploadFileFormat, setUploadFileFormat] = useState<PatientReport["fileFormat"]>("pdf");
  const [uploadFileSize, setUploadFileSize] = useState(0);

  if (!patient) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Patient not found.</p>
        <button onClick={onBack} className="text-blue-500 text-sm font-semibold mt-2 hover:underline">Go Back</button>
      </div>
    );
  }

  const reports = patient.reports.filter((r) => {
    const matchesSearch = r.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || r.fileType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleUpload = () => {
    if (!uploadFileName.trim()) return;
    addReport(patientId, {
      fileName: uploadFileName.trim(),
      fileType: uploadFileType,
      fileFormat: uploadFileFormat,
      fileSize: uploadFileSize || Math.floor(Math.random() * 3000) + 100,
      fileUrl: `/reports/${uploadFileName.trim().replace(/\s+/g, "_").toLowerCase()}.${uploadFileFormat}`,
    });
    setUploadFileName("");
    setUploadFileType("blood_test");
    setUploadFileFormat("pdf");
    setUploadFileSize(0);
    setShowUpload(false);
  };

  const handleSaveRemarks = (reportId: string) => {
    addDoctorRemarks(patientId, reportId, remarksText);
    setRemarksModal(null);
    setRemarksText("");
  };

  const openRemarks = (report: PatientReport) => {
    setRemarksText(report.doctorRemarks);
    setRemarksModal(report.id);
  };

  const totalSize = patient.reports.reduce((sum, r) => sum + r.fileSize, 0);
  const sharedCount = patient.reports.filter((r) => r.sharedWithDoctor).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{patient.fullName} - Reports</h2>
          <p className="text-sm text-gray-500">{patient.id} | {patient.reports.length} report(s) | {(totalSize / 1024).toFixed(1)} MB total</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] transition-colors shadow-md"
        >
          <Upload size={14} />
          Upload Report
        </button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Upload New Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">File Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                placeholder="e.g., Blood_Test_Report_2024.pdf"
                className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Report Type</label>
              <select
                value={uploadFileType}
                onChange={(e) => setUploadFileType(e.target.value as any)}
                className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
              >
                {Object.entries(reportTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Format</label>
              <select
                value={uploadFileFormat}
                onChange={(e) => setUploadFileFormat(e.target.value as any)}
                className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
              >
                <option value="pdf">PDF</option>
                <option value="jpg">JPG</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="docx">DOCX</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setShowUpload(false)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!uploadFileName.trim()}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                uploadFileName.trim()
                  ? "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Upload Report
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Total Reports</div>
            <div className="text-lg font-bold text-gray-900">{patient.reports.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
            <Share2 size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Shared with Doctor</div>
            <div className="text-lg font-bold text-gray-900">{sharedCount}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Paperclip size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Attached to Prescription</div>
            <div className="text-lg font-bold text-gray-900">{patient.reports.filter((r) => r.attachedToPrescription).length}</div>
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
            placeholder="Search reports..."
            className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
        >
          <option value="all">All Types</option>
          {Object.entries(reportTypeLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {reports.map((report) => {
          const Icon = reportTypeIcons[report.fileType] || File;
          return (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{report.fileName}</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold shrink-0">
                      {reportTypeLabels[report.fileType] || report.fileType}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-semibold uppercase shrink-0">
                      {report.fileFormat}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    {report.fileSize} KB | Uploaded: {new Date(report.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {report.doctorRemarks && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2 mb-2">
                      <div className="text-xs font-semibold text-yellow-700 mb-0.5">Doctor Remarks:</div>
                      <div className="text-xs text-yellow-600">{report.doctorRemarks}</div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => toggleShareWithDoctor(patientId, report.id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                        report.sharedWithDoctor
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <Share2 size={10} />
                      {report.sharedWithDoctor ? "Shared" : "Share with Doctor"}
                    </button>
                    <button
                      onClick={() => toggleAttachToPrescription(patientId, report.id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                        report.attachedToPrescription
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <Paperclip size={10} />
                      {report.attachedToPrescription ? "Attached" : "Attach to Rx"}
                    </button>
                    <button
                      onClick={() => openRemarks(report)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <MessageSquare size={10} />
                      Remarks
                    </button>
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <Download size={10} />
                      Download
                    </button>
                    {deleteConfirm === report.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => { deleteReport(patientId, report.id); setDeleteConfirm(null); }} className="text-xs font-semibold text-red-500">Yes</button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-xs font-semibold text-gray-400">No</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(report.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={10} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-16">
          <FileText size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No reports found.</p>
        </div>
      )}

      {/* Remarks Modal */}
      {remarksModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setRemarksModal(null); setRemarksText(""); }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Add Doctor Remarks</h3>
              <button onClick={() => { setRemarksModal(null); setRemarksText(""); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>
            <textarea
              value={remarksText}
              onChange={(e) => setRemarksText(e.target.value)}
              placeholder="Enter your remarks about this report..."
              rows={4}
              className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none mb-4"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setRemarksModal(null); setRemarksText(""); }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveRemarks(remarksModal)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-md"
              >
                Save Remarks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
