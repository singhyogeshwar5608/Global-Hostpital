"use client";

import React, { useState, useEffect } from "react";
import { usePatientStore } from "@/store/patient-store";
import {
  User,
  MapPin,
  Heart,
  Phone,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

interface Props {
  editId?: string | null;
  onDone?: () => void;
}

export default function PatientRegistration({ editId, onDone }: Props) {
  const { patients, addPatient, updatePatient } = usePatientStore();
  const [showSuccess, setShowSuccess] = useState(false);

  // Basic Information
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");

  // Address Information
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Medical Information
  const [diseaseDetails, setDiseaseDetails] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [complaint, setComplaint] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");

  // Emergency Contact
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");

  useEffect(() => {
    if (editId) {
      const p = patients.find((pat) => pat.id === editId);
      if (p) {
        setFullName(p.fullName);
        setMobileNumber(p.mobileNumber);
        setEmail(p.email);
        setGender(p.gender);
        setDateOfBirth(p.dateOfBirth);
        setBloodGroup(p.bloodGroup);
        setAddress(p.address);
        setCountry(p.country);
        setState(p.state);
        setDistrict(p.district);
        setCity(p.city);
        setPinCode(p.pinCode);
        setLatitude(p.latitude);
        setLongitude(p.longitude);
        setDiseaseDetails(p.diseaseDetails);
        setSymptoms(p.symptoms);
        setComplaint(p.complaint);
        setMedicalHistory(p.medicalHistory);
        setAllergies(p.allergies);
        setCurrentMedications(p.currentMedications);
        setEmergencyContactName(p.emergencyContactName);
        setEmergencyContactNumber(p.emergencyContactNumber);
        setEmergencyRelationship(p.emergencyRelationship);
      }
    }
  }, [editId, patients]);

  const resetForm = () => {
    setFullName(""); setMobileNumber(""); setEmail(""); setGender("male");
    setDateOfBirth(""); setBloodGroup("O+"); setAddress(""); setCountry("");
    setState(""); setDistrict(""); setCity(""); setPinCode(""); setLatitude("");
    setLongitude(""); setDiseaseDetails(""); setSymptoms(""); setComplaint("");
    setMedicalHistory(""); setAllergies(""); setCurrentMedications("");
    setEmergencyContactName(""); setEmergencyContactNumber(""); setEmergencyRelationship("");
  };

  const isFormValid = fullName.trim().length >= 2 && mobileNumber.trim().length >= 5 && email.includes("@");

  const handleSubmit = () => {
    if (!isFormValid) return;

    const data = {
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      gender,
      dateOfBirth,
      bloodGroup,
      address,
      country,
      state,
      district,
      city,
      pinCode,
      latitude,
      longitude,
      diseaseDetails,
      symptoms,
      complaint,
      medicalHistory,
      allergies,
      currentMedications,
      emergencyContactName,
      emergencyContactNumber,
      emergencyRelationship,
    };

    if (editId) {
      updatePatient(editId, data);
    } else {
      addPatient(data);
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      resetForm();
      onDone?.();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {editId ? "Patient Updated!" : "Patient Registered!"}
        </h3>
        <p className="text-gray-500 text-sm">
          {editId ? "Patient information has been updated successfully." : "New patient has been registered successfully."}
        </p>
      </div>
    );
  }

  const inputClass = "w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all";
  const labelClass = "text-xs font-semibold text-gray-700 mb-1 block";
  const sectionTitleClass = "flex items-center gap-2 text-sm font-bold text-gray-900 mb-4";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className={sectionTitleClass}>
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <User size={16} />
          </div>
          Basic Information
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter patient full name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label>
            <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="+1 (555) 000-0000" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email <span className="text-red-500">*</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="patient@email.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as any)} className={inputClass}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Blood Group</label>
            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={inputClass}>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className={sectionTitleClass}>
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <MapPin size={16} />
          </div>
          Address Information
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address, apartment, suite" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="United States" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="New York" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>District</label>
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Manhattan" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="New York City" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Pin Code</label>
            <input type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="10001" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Latitude</label>
            <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="40.7128" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="-74.0060" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className={sectionTitleClass}>
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
            <Heart size={16} />
          </div>
          Medical Information
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Disease Details</label>
            <input type="text" value={diseaseDetails} onChange={(e) => setDiseaseDetails(e.target.value)} placeholder="Primary disease or condition" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Symptoms</label>
            <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="List current symptoms" rows={2} className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all resize-none" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Complaint</label>
            <textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="Patient's chief complaint" rows={2} className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all resize-none" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Medical History</label>
            <textarea value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} placeholder="Previous diagnoses, surgeries, hospitalizations" rows={2} className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all resize-none" />
          </div>
          <div>
            <label className={labelClass}>Allergies</label>
            <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Drug allergies, food allergies" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Current Medications</label>
            <input type="text" value={currentMedications} onChange={(e) => setCurrentMedications(e.target.value)} placeholder="List current medications and dosages" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className={sectionTitleClass}>
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <Phone size={16} />
          </div>
          Emergency Contact
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Contact Name</label>
            <input type="text" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} placeholder="Emergency contact name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Contact Number</label>
            <input type="tel" value={emergencyContactNumber} onChange={(e) => setEmergencyContactNumber(e.target.value)} placeholder="+1 (555) 000-0000" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Relationship</label>
            <select value={emergencyRelationship} onChange={(e) => setEmergencyRelationship(e.target.value)} className={inputClass}>
              <option value="">Select Relationship</option>
              <option value="Spouse">Spouse</option>
              <option value="Parent">Parent</option>
              <option value="Child">Child</option>
              <option value="Sibling">Sibling</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => { resetForm(); onDone?.(); }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
            isFormValid
              ? "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {editId ? "Update Patient" : "Register Patient"}
        </button>
      </div>
    </div>
  );
}
