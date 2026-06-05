"use client";

import React, { useState } from "react";
import { useMedicineStore } from "@/store/medicine-store";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  ChevronDown,
  Eye,
  X,
  DollarSign,
} from "lucide-react";
import type { MedicineOrder } from "@/store/medicine-store";

export default function MedicineOrders({ onBack }: { onBack: () => void }) {
  const { orders, updateOrderStatus, updatePaymentStatus } = useMedicineStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<MedicineOrder | null>(null);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.patientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock size={12} />;
      case "shipped":
        return <Truck size={12} />;
      case "delivered":
        return <CheckCircle2 size={12} />;
      case "cancelled":
        return <XCircle size={12} />;
      default:
        return <Package size={12} />;
    }
  };

  const orderStats = {
    total: orders.length,
    processing: orders.filter((o) => o.orderStatus === "processing").length,
    shipped: orders.filter((o) => o.orderStatus === "shipped").length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    totalRevenue: orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Medicine Orders</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {orders.length} total orders
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">Total Orders</div>
          <div className="text-lg font-bold text-gray-900">{orderStats.total}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-xs text-yellow-600 font-medium flex items-center gap-1">
            <Clock size={12} /> Processing
          </div>
          <div className="text-lg font-bold text-gray-900">{orderStats.processing}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-xs text-blue-600 font-medium flex items-center gap-1">
            <Truck size={12} /> Shipped
          </div>
          <div className="text-lg font-bold text-gray-900">{orderStats.shipped}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-xs text-green-600 font-medium flex items-center gap-1">
            <CheckCircle2 size={12} /> Delivered
          </div>
          <div className="text-lg font-bold text-gray-900">{orderStats.delivered}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-xs text-purple-600 font-medium flex items-center gap-1">
            <DollarSign size={12} /> Revenue
          </div>
          <div className="text-lg font-bold text-gray-900">
            ${orderStats.totalRevenue.toFixed(2)}
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
            placeholder="Search orders by ID, patient name or email..."
            className="w-full h-11 rounded-lg bg-white border border-gray-200 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-lg bg-white border border-gray-200 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all min-w-[160px]"
        >
          <option value="all">All Status</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">
                    {order.id}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-900 text-sm">
                      {order.patientName}
                    </div>
                    <div className="text-xs text-gray-400">{order.patientEmail}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">
                    {order.items.length} item(s)
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-[#1e3a5f]">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getPaymentColor(order.paymentStatus)}`}
                    >
                      <CreditCard size={10} />
                      {order.paymentStatus.charAt(0).toUpperCase() +
                        order.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          e.target.value as MedicineOrder["orderStatus"]
                        )
                      }
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${getStatusColor(order.orderStatus)}`}
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                      title="View details"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-gray-400 text-sm"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-medium">Order ID</div>
                  <div className="text-sm font-semibold text-gray-900 font-mono">
                    {selectedOrder.id}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Date</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Patient</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {selectedOrder.patientName}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Phone</div>
                  <div className="text-sm text-gray-700">{selectedOrder.patientPhone}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">Shipping Address</div>
                <div className="text-sm text-gray-700">{selectedOrder.shippingAddress}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 font-medium mb-2">Items</div>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.medicine.image}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.medicine.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            ${item.medicine.price.toFixed(2)} x {item.quantity}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#1e3a5f]">
                        ${(item.medicine.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-[#1e3a5f]">
                  ${selectedOrder.totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">Payment</div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getPaymentColor(selectedOrder.paymentStatus)}`}
                  >
                    {selectedOrder.paymentMethod.toUpperCase()} -{" "}
                    {selectedOrder.paymentStatus.charAt(0).toUpperCase() +
                      selectedOrder.paymentStatus.slice(1)}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">Order Status</div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.orderStatus)}`}
                  >
                    {getStatusIcon(selectedOrder.orderStatus)}
                    {selectedOrder.orderStatus.charAt(0).toUpperCase() +
                      selectedOrder.orderStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
