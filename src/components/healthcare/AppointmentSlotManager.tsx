"use client";

import React, { useState } from "react";
import {
  useAppointmentStore,
  dayLabels,
  defaultTimeSlots,
  formatTime,
  type DoctorSchedule,
} from "@/store/appointment-store";
import { useDoctorStore } from "@/store/doctor-store";
import {
  CalendarDays,
  Clock,
  Plus,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  Save,
  ChevronDown,
  Stethoscope,
  User,
  Settings2,
  AlertCircle,
} from "lucide-react";

export default function AppointmentSlotManager({
  onBack,
}: {
  onBack: () => void;
}) {
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useAppointmentStore();
  const { doctors } = useDoctorStore();
  const [editId, setEditId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formDoctorId, setFormDoctorId] = useState("");
  const [formDays, setFormDays] = useState<number[]>([]);
  const [formSlots, setFormSlots] = useState<string[]>([]);
  const [formDuration, setFormDuration] = useState(30);

  const resetForm = () => {
    setFormDoctorId("");
    setFormDays([]);
    setFormSlots([]);
    setFormDuration(30);
    setEditId(null);
    setIsAdding(false);
  };

  const startAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const startEdit = (schedule: DoctorSchedule) => {
    setEditId(schedule.id);
    setFormDoctorId(schedule.doctorId);
    setFormDays([...schedule.availableDays]);
    setFormSlots([...schedule.availableSlots]);
    setFormDuration(schedule.slotDuration);
    setIsAdding(true);
  };

  const toggleDay = (day: number) => {
    setFormDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const toggleSlot = (slot: string) => {
    setFormSlots((prev) => {
      if (prev.includes(slot)) {
        return prev.filter((s) => s !== slot);
      }
      return [...prev, slot].sort();
    });
  };

  const handleSave = () => {
    if (!formDoctorId || formDays.length === 0 || formSlots.length === 0) return;

    const doctor = doctors.find((d) => d.id === formDoctorId);
    if (!doctor) return;

    if (editId) {
      updateSchedule(editId, {
        doctorId: formDoctorId,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        availableDays: formDays,
        availableSlots: formSlots,
        slotDuration: formDuration,
      });
    } else {
      addSchedule({
        doctorId: formDoctorId,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        availableDays: formDays,
        availableSlots: formSlots,
        slotDuration: formDuration,
      });
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteSchedule(id);
    setDeleteConfirm(null);
  };

  // Doctors that don't have schedules yet (for add mode)
  const availableDoctors = doctors.filter(
    (d) => !schedules.find((s) => s.doctorId === d.id) || editId
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Doctor Slot Management</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Define available days and time slots for each doctor
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isAdding && (
            <button
              onClick={startAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors shadow-lg"
            >
              <Plus size={16} />
              Add Schedule
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Settings2 size={18} className="text-[#1e3a5f]" />
              {editId ? "Edit Schedule" : "Create New Schedule"}
            </h3>
            <button
              onClick={resetForm}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-5">
            {/* Doctor Select */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Select Doctor <span className="text-red-400">*</span>
              </label>
              <select
                value={formDoctorId}
                onChange={(e) => setFormDoctorId(e.target.value)}
                disabled={!!editId}
                className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Choose a doctor...</option>
                {availableDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Available Days */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Available Days <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {dayLabels.map((label, index) => {
                  const isSelected = formDays.includes(index);
                  return (
                    <button
                      key={index}
                      onClick={() => toggleDay(index)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                        isSelected
                          ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#1e3a5f]/30 hover:bg-blue-50/50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {formDays.length === 0 && (
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> Select at least one day
                </p>
              )}
            </div>

            {/* Slot Duration */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Slot Duration (minutes)
              </label>
              <select
                value={formDuration}
                onChange={(e) => setFormDuration(Number(e.target.value))}
                className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            {/* Time Slots */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Available Time Slots <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                {defaultTimeSlots.map((slot) => {
                  const isSelected = formSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => toggleSlot(slot)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border-2 ${
                        isSelected
                          ? "bg-teal text-white border-teal shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-teal/30 hover:bg-teal/5"
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => setFormSlots([...defaultTimeSlots])}
                  className="text-xs text-teal font-semibold hover:underline"
                >
                  Select All
                </button>
                <button
                  onClick={() => setFormSlots([])}
                  className="text-xs text-gray-500 font-semibold hover:underline"
                >
                  Clear All
                </button>
                <span className="text-xs text-gray-400 ml-auto">
                  {formSlots.length} slot{formSlots.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              {formSlots.length === 0 && (
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> Select at least one time slot
                </p>
              )}
            </div>

            {/* Preview */}
            {formDoctorId && formDays.length > 0 && formSlots.length > 0 && (
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Schedule Preview</h4>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">{doctors.find((d) => d.id === formDoctorId)?.name}</span>
                  {" is available on "}
                  <span className="font-semibold">{formDays.map((d) => dayLabels[d]).join(", ")}</span>
                  {" with "}
                  <span className="font-semibold">{formSlots.length} slots</span>
                  {` (${formDuration} min each)`}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formSlots.map((slot) => (
                    <span key={slot} className="px-2 py-0.5 rounded-md bg-teal/10 text-teal text-xs font-medium">
                      {formatTime(slot)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Save / Cancel */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formDoctorId || formDays.length === 0 || formSlots.length === 0}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Save size={14} />
                {editId ? "Update Schedule" : "Create Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Schedules */}
      <div className="space-y-4">
        {schedules.length === 0 && !isAdding && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <CalendarDays size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-600 mb-1">No Schedules Yet</h3>
            <p className="text-sm text-gray-400 mb-4">
              Create a schedule to define when doctors are available for appointments.
            </p>
            <button
              onClick={startAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors"
            >
              <Plus size={16} />
              Create First Schedule
            </button>
          </div>
        )}

        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Stethoscope size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{schedule.doctorName}</h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mt-0.5">
                      {schedule.specialty}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(schedule)}
                    className="p-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors"
                    title="Edit Schedule"
                  >
                    <Edit3 size={16} />
                  </button>
                  {deleteConfirm === schedule.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(schedule.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete Schedule"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Available Days */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays size={14} className="text-[#1e3a5f]" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Available Days</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dayLabels.map((label, index) => {
                    const isAvailable = schedule.availableDays.includes(index);
                    return (
                      <span
                        key={index}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          isAvailable
                            ? "bg-[#1e3a5f]/10 text-[#1e3a5f] border border-[#1e3a5f]/20"
                            : "bg-gray-50 text-gray-300 border border-gray-100"
                        }`}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-teal" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Time Slots ({schedule.availableSlots.length} slots, {schedule.slotDuration} min each)
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {schedule.availableSlots.map((slot) => (
                    <span
                      key={slot}
                      className="px-2.5 py-1 rounded-lg bg-teal/10 text-teal text-xs font-semibold border border-teal/10"
                    >
                      {formatTime(slot)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
