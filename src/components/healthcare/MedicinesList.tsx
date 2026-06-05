"use client";

import React, { useState } from "react";
import { useMedicineStore } from "@/store/medicine-store";
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Pill,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";

export default function MedicinesList({
  onAddMedicine,
  onEditMedicine,
  onViewOrders,
}: {
  onAddMedicine: () => void;
  onEditMedicine: (id: string) => void;
  onViewOrders: () => void;
}) {
  const { medicines, deleteMedicine, toggleMedicineStatus } = useMedicineStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(medicines.map((m) => m.category)))];

  const filtered = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalStock = medicines.reduce((sum, m) => sum + m.stock, 0);
  const lowStock = medicines.filter((m) => m.stock < 50).length;
  const totalValue = medicines.reduce((sum, m) => sum + m.price * m.stock, 0);
  const activeCount = medicines.filter((m) => m.isActive).length;

  const handleDelete = (id: string) => {
    deleteMedicine(id);
    setDeleteConfirm(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Medicines</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {medicines.length} medicines registered
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onViewOrders}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <ClipboardList size={16} />
            <span className="hidden sm:inline">Orders</span>
          </button>
          <button
            onClick={onAddMedicine}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors shadow-lg"
          >
            <Plus size={16} />
            Add Medicine
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Pill size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Total Medicines</div>
              <div className="text-lg font-bold text-gray-900">{medicines.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
              <Package size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Total Stock</div>
              <div className="text-lg font-bold text-gray-900">{totalStock.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <DollarSign size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Inventory Value</div>
              <div className="text-lg font-bold text-gray-900">${totalValue.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${lowStock > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Low Stock</div>
              <div className="text-lg font-bold text-gray-900">{lowStock}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines by name, description or ID..."
            className="w-full h-11 rounded-lg bg-white border border-gray-200 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-11 rounded-lg bg-white border border-gray-200 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all min-w-[160px]"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Medicine
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Qty/Unit
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((med) => (
                <tr
                  key={med.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-lg border border-blue-100">
                        {med.image}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{med.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">
                          {med.description}
                        </div>
                        <div className="text-xs text-gray-300 mt-0.5">{med.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                      {med.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-[#1e3a5f]">${med.price.toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${med.stock < 50 ? "text-red-500" : med.stock < 150 ? "text-amber-500" : "text-green-600"}`}>
                        {med.stock}
                      </span>
                      {med.stock < 50 && (
                        <AlertTriangle size={12} className="text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">
                    {med.quantity} units
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleMedicineStatus(med.id)}
                      className="flex items-center gap-1.5"
                    >
                      {med.isActive ? (
                        <>
                          <ToggleRight size={20} className="text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={20} className="text-gray-400" />
                          <span className="text-xs text-gray-400 font-medium">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-center">
                      <button
                        onClick={() => onEditMedicine(med.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Edit medicine"
                      >
                        <Edit3 size={15} />
                      </button>
                      {deleteConfirm === med.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(med.id)}
                            className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(med.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete medicine"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-gray-400 text-sm"
                  >
                    {searchQuery
                      ? "No medicines found matching your search."
                      : "No medicines registered yet. Click 'Add Medicine' to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
