"use client";

import React, { useState, useEffect } from "react";
import { useMedicineStore } from "@/store/medicine-store";
import {
  Pill,
  DollarSign,
  Package,
  FileText,
  Layers,
  Save,
  X,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

const categories = [
  "Pain Relief",
  "Antibiotics",
  "Gastrointestinal",
  "Allergy",
  "Diabetes",
  "Cardiovascular",
  "Respiratory",
  "Dermatology",
  "Neurology",
  "Supplements",
  "Vitamins",
  "Eye Care",
  "Dental",
  "Other",
];

export default function MedicineRegistration({
  editId,
  onDone,
}: {
  editId?: string | null;
  onDone?: () => void;
}) {
  const { medicines, addMedicine, updateMedicine } = useMedicineStore();
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("💊");

  // If editing, load existing data
  useEffect(() => {
    if (editId) {
      const med = medicines.find((m) => m.id === editId);
      if (med) {
        setName(med.name);
        setPrice(med.price.toString());
        setStock(med.stock.toString());
        setDescription(med.description);
        setQuantity(med.quantity.toString());
        setCategory(med.category);
        setImage(med.image);
      }
    }
  }, [editId, medicines]);

  const medicineIcons = ["💊", "💉", "🧴", "🩹", "🫧", "🧪", "🩺", "💉"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim() || !stock.trim()) return;

    if (editId) {
      updateMedicine(editId, {
        name: name.trim(),
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        description: description.trim(),
        quantity: parseInt(quantity) || 0,
        category,
        image,
      });
    } else {
      addMedicine({
        name: name.trim(),
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        description: description.trim(),
        quantity: parseInt(quantity) || 0,
        category,
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
    setPrice("");
    setStock("");
    setDescription("");
    setQuantity("");
    setCategory("");
    setImage("💊");
  };

  const isFormValid =
    name.trim().length >= 2 && parseFloat(price) > 0 && parseInt(stock) >= 0;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {editId ? "Medicine Updated!" : "Medicine Added!"}
        </h3>
        <p className="text-gray-500 text-sm">
          The medicine has been successfully {editId ? "updated" : "added"} to the system.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {editId ? "Edit Medicine" : "Medicine Registration"}
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {editId ? "Update medicine information" : "Add a new medicine to the inventory"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Pill size={16} className="text-[#1e3a5f]" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Medicine Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Paracetamol 500mg"
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Icon
              </label>
              <div className="flex items-center gap-2">
                {medicineIcons.map((icon) => (
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
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter medicine description, usage, side effects..."
                rows={3}
                className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign size={16} className="text-[#1e3a5f]" />
            Pricing & Stock
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
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
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Package
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Quantity per Unit
              </label>
              <div className="relative">
                <Layers
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 10 tablets"
                  min="1"
                  className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                />
              </div>
            </div>
          </div>
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
            {editId ? "Update Medicine" : "Add Medicine"}
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
