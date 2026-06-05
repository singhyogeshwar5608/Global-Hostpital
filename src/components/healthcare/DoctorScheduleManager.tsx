"use client";

import React, { useState, useEffect } from "react";
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
  ArrowRight,
  Sun,
  Moon,
  Timer,
  PlusCircle,
  MinusCircle,
  Building2,
  DollarSign,
} from "lucide-react";

interface Props {
  doctorId: string;
  onBack: () => void;
}

export default function DoctorScheduleManager({ doctorId, onBack }: Props) {
  const { schedules, addSchedule, updateSchedule, deleteSchedule, bookedSlots } = useAppointmentStore();
  const { doctors } = useDoctorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [formDays, setFormDays] = useState<number[]>([]);
  const [formSlots, setFormSlots] = useState<string[]>([]);
  const [formDuration, setFormDuration] = useState(30);
  const [formStartTime, setFormStartTime] = useState("09:00");
  const [formEndTime, setFormEndTime] = useState("17:00");
  const [useCustomSlots, setUseCustomSlots] = useState(false);

  // Custom time slot
  const [customHour, setCustomHour] = useState("09");
  const [customMinute, setCustomMinute] = useState("00");
  const [customPeriod, setCustomPeriod] = useState<"AM" | "PM">("AM");

  const doctor = doctors.find((d) => d.id === doctorId);
  const existingSchedule = schedules.find((s) => s.doctorId === doctorId);

  // Booked slots for this doctor
  const doctorBookings = bookedSlots.filter(
    (b) => b.doctorId === doctorId && b.status !== "cancelled"
  );

  // Load existing schedule data when component mounts
  useEffect(() => {
    if (existingSchedule) {
      setFormDays([...existingSchedule.availableDays]);
      setFormSlots([...existingSchedule.availableSlots]);
      setFormDuration(existingSchedule.slotDuration);
      if (existingSchedule.availableSlots.length > 0) {
        setFormStartTime(existingSchedule.availableSlots[0]);
        setFormEndTime(existingSchedule.availableSlots[existingSchedule.availableSlots.length - 1]);
      }
    }
  }, [existingSchedule]);

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <AlertCircle size={40} className="text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Doctor Not Found</h3>
        <p className="text-gray-500 text-sm">The selected doctor could not be found.</p>
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors"
        >
          <ChevronDown size={14} className="-rotate-90" />
          Back to Doctors
        </button>
      </div>
    );
  }

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

  const addCustomSlot = () => {
    const h24 = customPeriod === "PM" && Number(customHour) !== 12
      ? Number(customHour) + 12
      : customPeriod === "AM" && Number(customHour) === 12
        ? 0
        : Number(customHour);
    const timeStr = `${h24.toString().padStart(2, "0")}:${customMinute}`;
    if (!formSlots.includes(timeStr)) {
      setFormSlots((prev) => [...prev, timeStr].sort());
    }
  };

  const removeSlot = (slot: string) => {
    setFormSlots((prev) => prev.filter((s) => s !== slot));
  };

  const generateSlotsFromRange = () => {
    const slots: string[] = [];
    const [startH, startM] = formStartTime.split(":").map(Number);
    const [endH, endM] = formEndTime.split(":").map(Number);

    let currentH = startH;
    let currentM = startM;

    while (currentH < endH || (currentH === endH && currentM < endM)) {
      slots.push(`${currentH.toString().padStart(2, "0")}:${currentM.toString().padStart(2, "0")}`);
      currentM += formDuration;
      if (currentM >= 60) {
        currentH += Math.floor(currentM / 60);
        currentM = currentM % 60;
      }
    }

    setFormSlots(slots);
  };

  const handleSave = () => {
    if (formDays.length === 0 || formSlots.length === 0) return;

    const scheduleData = {
      doctorId,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      availableDays: formDays,
      availableSlots: formSlots,
      slotDuration: formDuration,
    };

    if (existingSchedule) {
      updateSchedule(existingSchedule.id, scheduleData);
    } else {
      addSchedule(scheduleData);
    }

    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDelete = () => {
    if (existingSchedule) {
      deleteSchedule(existingSchedule.id);
    }
    setShowDeleteConfirm(false);
  };

  const startEditing = () => {
    if (existingSchedule) {
      setFormDays([...existingSchedule.availableDays]);
      setFormSlots([...existingSchedule.availableSlots]);
      setFormDuration(existingSchedule.slotDuration);
    }
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (existingSchedule) {
      setFormDays([...existingSchedule.availableDays]);
      setFormSlots([...existingSchedule.availableSlots]);
      setFormDuration(existingSchedule.slotDuration);
    } else {
      setFormDays([]);
      setFormSlots([]);
      setFormDuration(30);
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500 text-white shadow-lg animate-fade-in">
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">Schedule saved successfully!</span>
        </div>
      )}

      {/* Doctor Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  <Stethoscope size={10} />
                  {doctor.specialty}
                </span>
                <span className="text-xs text-gray-400">{doctor.qualification}</span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-400">{doctor.experience}</span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Building2 size={10} /> {doctor.hospitalName}</span>
                <span className="flex items-center gap-1"><DollarSign size={10} /> ${doctor.consultancyFee}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={startEditing}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors shadow-lg"
                >
                  <Edit3 size={16} />
                  {existingSchedule ? "Edit Schedule" : "Set Schedule"}
                </button>
                {existingSchedule && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-gray-200"
                    title="Delete Schedule"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Schedule?</h3>
              <p className="text-sm text-gray-500 mb-6">
                This will remove all availability slots for {doctor.name}. Patients won&apos;t be able to book appointments until a new schedule is created.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editing Form */}
      {isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Settings2 size={18} className="text-[#1e3a5f]" />
              {existingSchedule ? "Edit Availability Schedule" : "Create Availability Schedule"}
            </h3>
            <button
              onClick={cancelEditing}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Working Days */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                <CalendarDays size={14} className="inline mr-1.5 text-[#1e3a5f]" />
                Working Days <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {dayLabels.map((label, index) => {
                  const isSelected = formDays.includes(index);
                  return (
                    <button
                      key={index}
                      onClick={() => toggleDay(index)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                        isSelected
                          ? "bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-sm"
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
                  <AlertCircle size={12} /> Select at least one working day
                </p>
              )}
            </div>

            {/* Slot Duration */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                <Timer size={14} className="inline mr-1.5 text-[#1e3a5f]" />
                Appointment Duration (minutes)
              </label>
              <select
                value={formDuration}
                onChange={(e) => setFormDuration(Number(e.target.value))}
                className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes (Recommended)</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            {/* Time Slot Selection Method */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                <Clock size={14} className="inline mr-1.5 text-[#1e3a5f]" />
                Time Slots <span className="text-red-400">*</span>
              </label>

              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => setUseCustomSlots(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    !useCustomSlots
                      ? "bg-[#1e3a5f] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Quick Select
                </button>
                <button
                  onClick={() => setUseCustomSlots(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    useCustomSlots
                      ? "bg-[#1e3a5f] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Custom Add
                </button>
              </div>

              {!useCustomSlots ? (
                <>
                  {/* Quick Select - Generate from time range */}
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 mb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Sun size={14} className="text-blue-600" />
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Auto-Generate Slots</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Start Time</label>
                        <select
                          value={formStartTime}
                          onChange={(e) => setFormStartTime(e.target.value)}
                          className="w-full h-9 rounded-lg border border-gray-200 px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                        >
                          {defaultTimeSlots.map((slot) => (
                            <option key={slot} value={slot}>{formatTime(slot)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">End Time</label>
                        <select
                          value={formEndTime}
                          onChange={(e) => setFormEndTime(e.target.value)}
                          className="w-full h-9 rounded-lg border border-gray-200 px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                        >
                          {defaultTimeSlots.map((slot) => (
                            <option key={slot} value={slot}>{formatTime(slot)}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={generateSlotsFromRange}
                        className="h-9 px-3 rounded-lg bg-teal text-white text-xs font-semibold hover:bg-teal/90 transition-colors flex items-center gap-1 justify-center"
                      >
                        <ArrowRight size={12} />
                        Generate
                      </button>
                    </div>
                  </div>

                  {/* Or manually select from predefined slots */}
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
                  <div className="flex items-center gap-3 mt-2">
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
                </>
              ) : (
                <>
                  {/* Custom slot adder */}
                  <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 mb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <PlusCircle size={14} className="text-purple-600" />
                      <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Add Custom Time</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Hour</label>
                        <select
                          value={customHour}
                          onChange={(e) => setCustomHour(e.target.value)}
                          className="h-9 rounded-lg border border-gray-200 px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 w-16"
                        >
                          {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map((h) => (
                            <option key={h} value={h.padStart(2, "0")}>{h}</option>
                          ))}
                        </select>
                      </div>
                      <span className="text-gray-400 font-bold pb-2">:</span>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Min</label>
                        <select
                          value={customMinute}
                          onChange={(e) => setCustomMinute(e.target.value)}
                          className="h-9 rounded-lg border border-gray-200 px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 w-16"
                        >
                          <option value="00">00</option>
                          <option value="15">15</option>
                          <option value="30">30</option>
                          <option value="45">45</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">AM/PM</label>
                        <select
                          value={customPeriod}
                          onChange={(e) => setCustomPeriod(e.target.value as "AM" | "PM")}
                          className="h-9 rounded-lg border border-gray-200 px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 w-16"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                      <button
                        onClick={addCustomSlot}
                        className="h-9 px-4 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors flex items-center gap-1"
                      >
                        <PlusCircle size={12} />
                        Add
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Selected Slots Display */}
              {formSlots.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Selected Slots</span>
                    <span className="text-xs text-teal font-semibold">{formSlots.length} slots</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formSlots.map((slot) => (
                      <span
                        key={slot}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal/10 text-teal text-xs font-semibold border border-teal/10 group"
                      >
                        {formatTime(slot)}
                        <button
                          onClick={() => removeSlot(slot)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-teal/60 hover:text-red-500"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formSlots.length === 0 && (
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> Select at least one time slot
                </p>
              )}
            </div>

            {/* Schedule Preview */}
            {formDays.length > 0 && formSlots.length > 0 && (
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Schedule Preview</h4>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">{doctor.name}</span>
                  {" is available on "}
                  <span className="font-semibold">{formDays.map((d) => dayLabels[d]).join(", ")}</span>
                  {" with "}
                  <span className="font-semibold">{formSlots.length} slots</span>
                  {` (${formDuration} min each)`}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Total available time: ~{Math.round((formSlots.length * formDuration) / 60 * 10) / 10} hours per day
                </div>
              </div>
            )}

            {/* Save / Cancel */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={cancelEditing}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={formDays.length === 0 || formSlots.length === 0}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Save size={14} />
                {existingSchedule ? "Update Schedule" : "Create Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Schedule Display */}
      {existingSchedule && !isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <CalendarDays size={18} className="text-[#1e3a5f]" />
                Current Schedule
              </h3>
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} />
                Active
              </span>
            </div>

            {/* Available Days */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays size={14} className="text-[#1e3a5f]" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Working Days</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {dayLabels.map((label, index) => {
                  const isAvailable = existingSchedule.availableDays.includes(index);
                  return (
                    <span
                      key={index}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold ${
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

            {/* Slot Duration */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Timer size={14} className="text-[#1e3a5f]" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Appointment Duration
                </span>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100">
                {existingSchedule.slotDuration} minutes per appointment
              </span>
            </div>

            {/* Time Slots */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-teal" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Available Time Slots ({existingSchedule.availableSlots.length} slots)
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {existingSchedule.availableSlots.map((slot) => {
                  // Check if this slot has any bookings today
                  const todayStr = new Date().toISOString().split("T")[0];
                  const isBookedToday = doctorBookings.some(
                    (b) => b.date === todayStr && b.time === slot
                  );
                  return (
                    <div
                      key={slot}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold text-center relative ${
                        isBookedToday
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-teal/10 text-teal border border-teal/10"
                      }`}
                    >
                      {formatTime(slot)}
                      {isBookedToday && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Schedule Summary Bar */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={12} />
                {existingSchedule.availableDays.length} days/week
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                {existingSchedule.availableSlots.length} slots/day
              </span>
              <span className="flex items-center gap-1.5">
                <Timer size={12} />
                {existingSchedule.slotDuration} min each
              </span>
              <span className="flex items-center gap-1.5 ml-auto text-green-600 font-semibold">
                <CheckCircle2 size={12} />
                ~{Math.round((existingSchedule.availableSlots.length * existingSchedule.slotDuration) / 60 * 10) / 10} hrs/day
              </span>
            </div>
          </div>
        </div>
      )}

      {/* No Schedule Message */}
      {!existingSchedule && !isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Schedule Set</h3>
          <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
            {doctor.name} doesn&apos;t have an availability schedule yet. Create one to allow patients to book appointments.
          </p>
          <button
            onClick={startEditing}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors shadow-lg"
          >
            <Plus size={16} />
            Create Schedule
          </button>
        </div>
      )}

      {/* Upcoming Bookings for this Doctor */}
      {doctorBookings.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
              <CalendarDays size={16} className="text-[#1e3a5f]" />
              Upcoming Bookings ({doctorBookings.filter((b) => b.status !== "cancelled").length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Time</th>
                  <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {doctorBookings
                  .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
                  .slice(0, 10)
                  .map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-gray-700 text-xs">{booking.date}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal/10 text-teal text-xs font-semibold">
                          <Clock size={10} />
                          {formatTime(booking.time)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-700 text-xs">{booking.patientName}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed" ? "bg-green-50 text-green-700" :
                          booking.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                          booking.status === "completed" ? "bg-blue-50 text-blue-700" :
                          "bg-red-50 text-red-700"
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
