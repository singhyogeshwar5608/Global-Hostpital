"use client";

import React, { useState } from "react";
import { usePackageStore } from "@/store/package-store";
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Package,
  DollarSign,
  Clock,
  Tag,
  ClipboardList,
  CheckCircle2,
  Users,
  TrendingUp,
} from "lucide-react";

export default function PackagesList({
  onAddPackage,
  onEditPackage,
  onViewBookings,
}: {
  onAddPackage: () => void;
  onEditPackage: (id: string) => void;
  onViewBookings: () => void;
}) {
  const { packages, deletePackage, togglePackageStatus, bookings } = usePackageStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categories = ["all", ...Array.from(new Set(packages.map((p) => p.category)))];

  const filtered = packages.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalRevenue = bookings.filter((b) => b.paymentStatus === "paid").reduce((sum, b) => sum + b.packagePrice, 0);
  const activeCount = packages.filter((p) => p.isActive).length;
  const totalBookings = bookings.length;

  const handleDelete = (id: string) => {
    deletePackage(id);
    setDeleteConfirm(null);
  };

  const getDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Health Packages</h2>
          <p className="text-gray-500 text-sm mt-0.5">{packages.length} packages registered</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onViewBookings}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <ClipboardList size={16} />
            <span className="hidden sm:inline">Bookings</span>
          </button>
          <button
            onClick={onAddPackage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors shadow-lg"
          >
            <Plus size={16} />
            Add Package
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Package size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Total Packages</div>
              <div className="text-lg font-bold text-gray-900">{packages.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Active Packages</div>
              <div className="text-lg font-bold text-gray-900">{activeCount}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Users size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Total Bookings</div>
              <div className="text-lg font-bold text-gray-900">{totalBookings}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Revenue</div>
              <div className="text-lg font-bold text-gray-900">${totalRevenue.toFixed(2)}</div>
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
            placeholder="Search packages by name, description or ID..."
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

      {/* Packages Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Package</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Tests</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pkg) => (
                <tr key={pkg.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-lg border border-blue-100">
                        {pkg.image}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{pkg.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">{pkg.description}</div>
                        <div className="text-xs text-gray-300 mt-0.5">{pkg.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                      {pkg.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-[#1e3a5f]">${pkg.price.toFixed(2)}</div>
                    <div className="text-xs text-gray-400 line-through">${pkg.originalPrice.toFixed(2)}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      {getDiscount(pkg.originalPrice, pkg.price)}% OFF
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1 text-gray-600 text-xs">
                      <Clock size={10} />
                      {pkg.duration}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">{pkg.testsIncluded.length} tests</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => togglePackageStatus(pkg.id)} className="flex items-center gap-1.5">
                      {pkg.isActive ? (
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
                        onClick={() => onEditPackage(pkg.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Edit package"
                      >
                        <Edit3 size={15} />
                      </button>
                      {deleteConfirm === pkg.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(pkg.id)} className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">Yes</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(pkg.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete package">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">
                    {searchQuery ? "No packages found matching your search." : "No packages registered yet. Click 'Add Package' to get started."}
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
