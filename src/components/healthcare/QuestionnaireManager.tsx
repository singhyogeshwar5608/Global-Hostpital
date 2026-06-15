"use client";

import React, { useState } from "react";
import { useSpecialtyStore } from "@/store/specialty-store";
import {
  Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronRight,
  ToggleLeft, ToggleRight, GripVertical,
} from "lucide-react";

export default function QuestionnaireManager() {
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
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editQText, setEditQText] = useState("");

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
    addQuestion(specId, {
      question: newQ.trim(),
      questionType: "yes_no",
      sortOrder: specialties.find(s => s.id === specId)?.questions.length ?? 0 + 1,
      isActive: true,
    });
    setNewQ("");
  };

  const toggleQuestionActive = (specId: string, qId: string, current: boolean) => {
    updateQuestion(specId, qId, { isActive: !current });
  };

  const startEditQuestion = (q: typeof specialties[0]['questions'][0]) => {
    setEditingQuestion(q.id);
    setEditQText(q.question);
  };

  const saveEditQuestion = (specId: string, qId: string) => {
    if (!editQText.trim()) return;
    updateQuestion(specId, qId, { question: editQText.trim() });
    setEditingQuestion(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Questionnaire Manager</h2>
          <p className="text-sm text-gray-500 mt-0.5">{specialties.length} categories</p>
        </div>
      </div>

      {/* Add Category */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Add New Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={newSpecName} onChange={(e) => setNewSpecName(e.target.value)} placeholder="Category name (e.g., LFT)" className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
          <input value={newSpecDesc} onChange={(e) => setNewSpecDesc(e.target.value)} placeholder="Description" className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
          <input value={newSpecIcon} onChange={(e) => setNewSpecIcon(e.target.value)} placeholder="Icon (emoji)" className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
          <button onClick={handleAdd} disabled={!newSpecName.trim()} className="h-10 px-4 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] disabled:bg-gray-200 disabled:text-gray-400">
            <Plus size={16} className="inline mr-1" /> Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {specialties.map((spec) => {
          const isExpanded = expandedSpec === spec.id;
          const isEditing = editingSpec === spec.id;
          const activeQuestions = spec.questions.filter((q) => q.isActive);
          return (
            <div key={spec.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Category Header */}
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
                      <p className="text-xs text-gray-400">{spec.description} &middot; {spec.questions.length} questions ({activeQuestions.length} active)</p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(spec)} className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50"><Edit3 size={15} /></button>
                  <button onClick={() => deleteSpecialty(spec.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
                </div>
              </div>

              {/* Questions Section */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="pt-3 space-y-2">
                    {spec.questions.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">No questions yet. Add one below.</p>
                    )}
                    {spec.questions
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((q) => {
                        const isEditingQ = editingQuestion === q.id;
                        return (
                          <div key={q.id} className="flex items-center gap-2 bg-white rounded-lg p-2.5 border border-gray-100 group hover:border-gray-200 transition-colors">
                            <GripVertical size={14} className="text-gray-300 shrink-0" />
                            <span className="text-xs text-gray-400 w-6 shrink-0">{q.sortOrder}.</span>
                            {isEditingQ ? (
                              <div className="flex-1 flex items-center gap-2">
                                <input value={editQText} onChange={(e) => setEditQText(e.target.value)}
                                  className="flex-1 h-8 rounded border border-gray-200 px-2 text-sm"
                                  onKeyDown={(e) => e.key === 'Enter' && saveEditQuestion(spec.id, q.id)} />
                                <button onClick={() => saveEditQuestion(spec.id, q.id)} className="p-1 rounded text-green-600 hover:bg-green-50"><Save size={13} /></button>
                                <button onClick={() => setEditingQuestion(null)} className="p-1 rounded text-gray-400 hover:bg-gray-100"><X size={13} /></button>
                              </div>
                            ) : (
                              <>
                                <span className={`flex-1 text-sm ${q.isActive ? 'text-gray-700' : 'text-gray-400 line-through'}`}>{q.question}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium shrink-0">{q.questionType}</span>
                                <button
                                  onClick={() => toggleQuestionActive(spec.id, q.id, q.isActive)}
                                  className={`p-1 rounded ${q.isActive ? 'text-green-500 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-100'}`}
                                  title={q.isActive ? 'Deactivate' : 'Activate'}
                                >
                                  {q.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                </button>
                                <button onClick={() => startEditQuestion(q)} className="p-1 rounded text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"><Edit3 size={12} /></button>
                                <button onClick={() => deleteQuestion(spec.id, q.id)} className="p-1 rounded text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    {/* Add Question */}
                    <div className="flex items-center gap-2 pt-2">
                      <input value={newQ} onChange={(e) => setNewQ(e.target.value)} placeholder="Type a Yes/No question and press Enter..." className="flex-1 h-10 rounded-lg bg-white border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                        onKeyDown={(e) => e.key === "Enter" && handleAddQ(spec.id)} />
                      <button onClick={() => handleAddQ(spec.id)} disabled={!newQ.trim()} className="h-10 px-4 rounded-lg bg-[#1e3a5f] text-white text-xs font-semibold hover:bg-[#163050] disabled:bg-gray-200 disabled:text-gray-400">
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
