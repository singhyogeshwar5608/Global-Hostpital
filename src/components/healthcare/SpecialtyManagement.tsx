"use client";

import React, { useState } from "react";
import { useSpecialtyStore } from "@/store/specialty-store";
import {
  Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronRight,
} from "lucide-react";

export default function SpecialtyManagement() {
  const { specialties, addSpecialty, updateSpecialty, deleteSpecialty, addQuestion, updateQuestion, deleteQuestion } = useSpecialtyStore();
  const [newSpecName, setNewSpecName] = useState("");
  const [newSpecDesc, setNewSpecDesc] = useState("");
  const [newSpecIcon, setNewSpecIcon] = useState("");
  const [editingSpec, setEditingSpec] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [expandedSpec, setExpandedSpec] = useState<string | null>(null);
  const [newQ, setNewQ] = useState("");

  const handleAdd = () => {
    if (!newSpecName.trim()) return;
    addSpecialty({
      name: newSpecName.trim(),
      description: newSpecDesc.trim(),
      icon: newSpecIcon.trim() || "🏥",
      isActive: true,
    });
    setNewSpecName(""); setNewSpecDesc(""); setNewSpecIcon("");
  };

  const handleEdit = (spec: typeof specialties[0]) => {
    setEditingSpec(spec.id);
    setEditName(spec.name);
    setEditDesc(spec.description);
    setEditIcon(spec.icon);
  };

  const handleSaveEdit = (id: string) => {
    updateSpecialty(id, { name: editName, description: editDesc, icon: editIcon });
    setEditingSpec(null);
  };

  const handleAddQ = (specId: string) => {
    if (!newQ.trim()) return;
    addQuestion(specId, { question: newQ.trim(), questionType: "yes_no", sortOrder: Date.now(), isActive: true });
    setNewQ("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Specialty Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{specialties.length} specialties</p>
        </div>
      </div>

      {/* Add Specialty */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Add New Specialty</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={newSpecName} onChange={(e) => setNewSpecName(e.target.value)} placeholder="Specialty name (e.g., LFT)" className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
          <input value={newSpecDesc} onChange={(e) => setNewSpecDesc(e.target.value)} placeholder="Description" className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
          <input value={newSpecIcon} onChange={(e) => setNewSpecIcon(e.target.value)} placeholder="Icon (emoji)" className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
          <button onClick={handleAdd} disabled={!newSpecName.trim()} className="h-10 px-4 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] disabled:bg-gray-200 disabled:text-gray-400">
            <Plus size={16} className="inline mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Specialties List */}
      <div className="space-y-3">
        {specialties.map((spec) => {
          const isExpanded = expandedSpec === spec.id;
          const isEditing = editingSpec === spec.id;
          return (
            <div key={spec.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <button onClick={() => setExpandedSpec(isExpanded ? null : spec.id)} className="text-gray-400 hover:text-gray-600">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                <span className="text-2xl">{spec.icon}</span>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 rounded border border-gray-200 px-2 text-sm w-40" />
                      <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="h-8 rounded border border-gray-200 px-2 text-sm w-60" />
                      <input value={editIcon} onChange={(e) => setEditIcon(e.target.value)} className="h-8 rounded border border-gray-200 px-2 text-sm w-16" />
                      <button onClick={() => handleSaveEdit(spec.id)} className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"><Save size={14} /></button>
                      <button onClick={() => setEditingSpec(null)} className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"><X size={14} /></button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-gray-900 text-sm">{spec.name}</h3>
                      <p className="text-xs text-gray-400">{spec.description} &middot; {spec.questions.length} questions</p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(spec)} className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50"><Edit3 size={15} /></button>
                  <button onClick={() => deleteSpecialty(spec.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="pt-3 space-y-2">
                    {spec.questions.map((q) => (
                      <div key={q.id} className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-100">
                        <span className="text-xs text-gray-400 w-6">{q.sortOrder}.</span>
                        <span className="flex-1 text-sm text-gray-700">{q.question}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">{q.questionType}</span>
                        <button onClick={() => deleteQuestion(spec.id, q.id)} className="p-1 rounded text-gray-400 hover:text-red-500"><X size={12} /></button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <input value={newQ} onChange={(e) => setNewQ(e.target.value)} placeholder="Add a yes/no question..." className="flex-1 h-9 rounded-lg bg-white border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                        onKeyDown={(e) => e.key === "Enter" && handleAddQ(spec.id)} />
                      <button onClick={() => handleAddQ(spec.id)} disabled={!newQ.trim()} className="h-9 px-3 rounded-lg bg-[#1e3a5f] text-white text-xs font-semibold hover:bg-[#163050] disabled:bg-gray-200 disabled:text-gray-400">
                        <Plus size={14} className="inline" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
