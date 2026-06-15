"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Eye,
  EyeOff,
  Stethoscope,
  CalendarPlus,
  Video,
  FlaskConical,
  Pill,
  Package,
} from "lucide-react";
import { useServicesStore, type Service } from "@/store/services-store";
import { Button } from "@/components/ui/button";

const iconOptions = [
  { value: "Stethoscope", label: "Find Doctors", icon: Stethoscope },
  { value: "CalendarPlus", label: "Book Appointment", icon: CalendarPlus },
  { value: "Video", label: "Video Consultation", icon: Video },
  { value: "FlaskConical", label: "Lab Tests", icon: FlaskConical },
  { value: "Pill", label: "Medicines", icon: Pill },
  { value: "Package", label: "Health Packages", icon: Package },
];

export default function ServicesManager() {
  const { services, addService, updateService, deleteService } = useServicesStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", icon: "Stethoscope" });

  const resetForm = () => {
    setForm({ name: "", description: "", icon: "Stethoscope" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (s: Service) => {
    setForm({ name: s.name, description: s.description, icon: s.icon });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      updateService(editingId, form);
    } else {
      addService({ ...form, isActive: true });
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Services Manager</h2>
          <p className="text-sm text-gray-500 mt-1">Manage healthcare services shown on the website</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 h-10 text-sm font-semibold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{editingId ? "Edit Service" : "New Service"}</h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Service Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Online Pharmacy"
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the service..."
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Icon</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {iconOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = form.icon === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setForm({ ...form, icon: opt.value })}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                        <span className={`text-[10px] font-medium text-center leading-tight ${isSelected ? "text-blue-600" : "text-gray-500"}`}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-10 text-sm font-semibold">
                  <Check className="w-4 h-4 mr-1.5" />
                  {editingId ? "Update" : "Save"}
                </Button>
                <Button onClick={resetForm} variant="outline" className="rounded-xl px-6 h-10 text-sm font-semibold border-gray-200">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-3">
        {services.map((s, i) => {
          const Icon = iconOptions.find((o) => o.value === s.icon)?.icon || Package;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                s.isActive ? "bg-gradient-to-br from-blue-50 to-emerald-50" : "bg-gray-100"
              }`}>
                <Icon className={`w-6 h-6 ${s.isActive ? "text-blue-600" : "text-gray-400"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm">{s.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {s.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{s.description}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => updateService(s.id, { isActive: !s.isActive })}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    s.isActive ? "bg-amber-50 text-amber-500 hover:bg-amber-100" : "bg-green-50 text-green-500 hover:bg-green-100"
                  }`}
                  title={s.isActive ? "Deactivate" : "Activate"}
                >
                  {s.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(s)}
                  className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteService(s.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
