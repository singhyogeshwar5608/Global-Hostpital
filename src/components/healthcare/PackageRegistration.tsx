"use client";

import React, { useState, useEffect } from "react";
import { usePackageStore } from "@/store/package-store";
import {
  Package,
  DollarSign,
  Clock,
  FileText,
  Tag,
  Save,
  X,
  CheckCircle2,
  Plus,
  Layers,
  Sparkles,
} from "lucide-react";

const categories = [
  "Basic", "Cardiac", "Diabetes", "Women", "Premium", "Senior", "Pediatric", "Cancer Screening", "Eye Care", "Dental", "Other",
];

const packageIcons = ["🩺", "❤️", "🩸", "👩", "🏆", "👴", "👶", "🦷", "👁️", "💊"];

export default function PackageRegistration({
  editId,
  onDone,
}: {
  editId?: string | null;
  onDone?: () => void;
}) {
  const { packages, addPackage, updatePackage } = usePackageStore();
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [testsIncluded, setTestsIncluded] = useState("");
  const [image, setImage] = useState("🩺");

  // If editing, load existing data
  useEffect(() => {
    if (editId) {
      const pkg = packages.find((p) => p.id === editId);
      if (pkg) {
        setName(pkg.name);
        setDescription(pkg.description);
        setBenefits(pkg.benefits.join("\n"));
        setPrice(pkg.price.toString());
        setOriginalPrice(pkg.originalPrice.toString());
        setCategory(pkg.category);
        setDuration(pkg.duration);
        setTestsIncluded(pkg.testsIncluded.join(", "));
        setImage(pkg.image);
      }
    }
  }, [editId, packages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) return;

    const benefitsList = benefits.split("\n").map((b) => b.trim()).filter((b) => b.length > 0);
    const testsList = testsIncluded.split(",").map((t) => t.trim()).filter((t) => t.length > 0);

    if (editId) {
      updatePackage(editId, {
        name: name.trim(),
        description: description.trim(),
        benefits: benefitsList,
        price: parseFloat(price) || 0,
        originalPrice: parseFloat(originalPrice) || parseFloat(price) || 0,
        category,
        duration,
        testsIncluded: testsList,
        image,
      });
    } else {
      addPackage({
        name: name.trim(),
        description: description.trim(),
        benefits: benefitsList,
        price: parseFloat(price) || 0,
        originalPrice: parseFloat(originalPrice) || parseFloat(price) || 0,
        category,
        duration,
        testsIncluded: testsList,
        image,
        isActive: true,
      });
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      if (onDone) onDone();
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setBenefits("");
    setPrice("");
    setOriginalPrice("");
    setCategory("");
    setDuration("");
    setTestsIncluded("");
    setImage("🩺");
  };

  const isFormValid = name.trim().length >= 2 && parseFloat(price) > 0;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{editId ? "Package Updated!" : "Package Added!"}</h3>
        <p className="text-gray-500 text-sm">The health package has been successfully {editId ? "updated" : "added"}.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{editId ? "Edit Package" : "Package Registration"}</h2>
          <p className="text-gray-500 text-sm mt-0.5">{editId ? "Update package information" : "Add a new health package"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={16} className="text-[#1e3a5f]" />
            Package Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Package Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Basic Health Checkup"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Duration</label>
              <div className="relative">
                <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 4-6 hours"
                  className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Icon</label>
              <div className="flex items-center gap-2 flex-wrap">
                {packageIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setImage(icon)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                      image === icon
                        ? "bg-[#1e3a5f]/10 border-2 border-[#1e3a5f] shadow-sm"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the health package, target audience, and what makes it special..."
                rows={3}
                className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-[#1e3a5f]" />
            Benefits
          </h3>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Benefits (one per line)
            </label>
            <textarea
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder={"Complete Blood Count (CBC)\nBlood Sugar (Fasting)\nLipid Profile\nECG\nGeneral Physician Consultation"}
              rows={6}
              className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all resize-none"
            />
            <p className="text-xs text-gray-400 mt-1.5">Enter each benefit on a new line. These will be displayed as a checklist.</p>
          </div>
        </div>

        {/* Tests Included */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Layers size={16} className="text-[#1e3a5f]" />
            Tests Included
          </h3>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Test Names (comma-separated)
            </label>
            <input
              type="text"
              value={testsIncluded}
              onChange={(e) => setTestsIncluded(e.target.value)}
              placeholder="e.g. CBC, Fasting Sugar, Lipid Profile, ECG, Urine Routine"
              className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
            />
            <p className="text-xs text-gray-400 mt-1.5">Separate test names with commas.</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign size={16} className="text-[#1e3a5f]" />
            Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Package Price ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Original Price ($)
              </label>
              <div className="relative">
                <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="e.g. 79.99"
                  min="0"
                  step="0.01"
                  className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Set higher to show discount badge.</p>
            </div>
          </div>
          {originalPrice && price && parseFloat(originalPrice) > parseFloat(price) && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-green-50 border border-green-200 inline-flex items-center gap-1.5">
              <span className="text-xs text-green-700 font-semibold">
                {Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
              isFormValid
                ? "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Save size={16} />
            {editId ? "Update Package" : "Add Package"}
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              if (onDone) onDone();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
