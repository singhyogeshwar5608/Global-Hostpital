"use client";

import React, { useState } from "react";
import { useMedicineStore } from "@/store/medicine-store";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Pill,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Smartphone,
  Building,
  Truck,
  CheckCircle2,
  ArrowLeft,
  Package,
  Filter,
  Tag,
} from "lucide-react";
import type { Medicine } from "@/store/medicine-store";

type ShopStep = "browse" | "cart" | "checkout" | "payment" | "confirmation";

export default function MedicineShop() {
  const {
    medicines,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    placeOrder,
    isShopOpen,
    closeShop,
  } = useMedicineStore();

  const [step, setStep] = useState<ShopStep>("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [addedNotif, setAddedNotif] = useState<string | null>(null);

  // Checkout form
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "cod">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());

  const activeMedicines = medicines.filter((m) => m.isActive);
  const categories = ["all", ...Array.from(new Set(activeMedicines.map((m) => m.category)))];

  const filtered = activeMedicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = getCartTotal();
  const cartItemCount = getCartItemCount();

  const handleAddToCart = (medicine: Medicine) => {
    addToCart(medicine, 1);
    setAddedToCart((prev) => new Set(prev).add(medicine.id));
    setTimeout(() => {
      setAddedToCart((prev) => {
        const next = new Set(prev);
        next.delete(medicine.id);
        return next;
      });
    }, 1500);
  };

  const handlePlaceOrder = () => {
    if (!patientName.trim() || !patientEmail.trim() || !patientPhone.trim() || !shippingAddress.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const order = placeOrder({
        items: cart,
        totalAmount: cartTotal,
        patientName: patientName.trim(),
        patientEmail: patientEmail.trim(),
        patientPhone: patientPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        orderStatus: "processing",
      });
      setOrderId(order.id);
      setIsProcessing(false);
      setStep("confirmation");
    }, 2000);
  };

  const resetShop = () => {
    setStep("browse");
    setSearchQuery("");
    setCategoryFilter("all");
    setPatientName("");
    setPatientEmail("");
    setPatientPhone("");
    setShippingAddress("");
    setPaymentMethod("card");
    setOrderId("");
  };

  const handleClose = () => {
    resetShop();
    closeShop();
  };

  if (!isShopOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-white flex flex-col">
      {/* Shop Header */}
      <header className="h-16 bg-[#1e3a5f] text-white flex items-center justify-between px-6 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={handleClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Pill size={22} />
            <div>
              <h1 className="text-sm font-bold">Medicine Shop</h1>
              <p className="text-[10px] text-white/60">Global Integrative Clinic</p>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        {step !== "confirmation" && (
          <div className="hidden md:flex items-center gap-1">
            {(["browse", "cart", "checkout", "payment"] as ShopStep[]).map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <ChevronRight size={12} className="text-white/30" />}
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${step === s ? "bg-white/20 text-white" : "text-white/40"}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        <button
          onClick={() => step === "browse" ? setStep("cart") : setStep("browse")}
          className="relative w-10 h-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ShoppingCart size={20} />
          {cartItemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      </header>

      {/* Step Content */}
      <main className="flex-1 overflow-y-auto">
        {/* ─── BROWSE STEP ─── */}
        {step === "browse" && (
          <div className="max-w-6xl mx-auto p-6">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medicines..."
                  className="w-full h-11 rounded-xl bg-gray-50 border border-gray-200 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      categoryFilter === cat
                        ? "bg-[#1e3a5f] text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat === "all" ? "All" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Medicine Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((med) => {
                const inCart = cart.find((item) => item.medicine.id === med.id);
                const justAdded = addedToCart.has(med.id);
                return (
                  <div
                    key={med.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group overflow-hidden"
                  >
                    {/* Top colored banner */}
                    <div className="h-2 bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6]" />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl border border-blue-100">
                          {med.image}
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold">
                          <Tag size={8} />
                          {med.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                        {med.name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                        {med.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-[#1e3a5f]">
                          ${med.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Package size={10} />
                          {med.quantity} units
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${med.stock < 50 ? "text-red-500" : "text-green-600"}`}>
                          {med.stock < 50 ? `Only ${med.stock} left` : `${med.stock} in stock`}
                        </span>
                        {inCart ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateCartQuantity(med.id, inCart.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-[#1e3a5f]">
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(med.id, inCart.quantity + 1)}
                              disabled={inCart.quantity >= med.stock}
                              className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(med)}
                            disabled={med.stock === 0}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              justAdded
                                ? "bg-green-500 text-white"
                                : med.stock === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-md"
                            }`}
                          >
                            {justAdded ? "Added!" : med.stock === 0 ? "Out of Stock" : "Add to Cart"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <Pill size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No medicines found.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── CART STEP ─── */}
        {step === "cart" && (
          <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <span className="text-sm text-gray-500">{cartItemCount} item(s)</span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingCart size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-4">Your cart is empty</p>
                <button
                  onClick={() => setStep("browse")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050] transition-colors"
                >
                  Browse Medicines
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.medicine.id}
                      className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                    >
                      <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-2xl border border-blue-100 shrink-0">
                        {item.medicine.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {item.medicine.name}
                        </h4>
                        <p className="text-xs text-gray-400">{item.medicine.category}</p>
                        <p className="text-sm font-semibold text-[#1e3a5f] mt-1">
                          ${item.medicine.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.medicine.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.medicine.id, item.quantity + 1)}
                          disabled={item.quantity >= item.medicine.stock}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right shrink-0 w-20">
                        <div className="text-sm font-bold text-[#1e3a5f]">
                          ${(item.medicine.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.medicine.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Delivery</span>
                    <span className="text-sm font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-[#1e3a5f]">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => setStep("browse")}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => setStep("checkout")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] transition-colors shadow-lg"
                  >
                    Proceed to Checkout
                    <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── CHECKOUT STEP ─── */}
        {step === "checkout" && (
          <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
              <span className="text-sm text-gray-500">{cartItemCount} item(s) - ${cartTotal.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Form */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Patient Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Shipping Address</h3>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your full shipping address"
                    rows={3}
                    className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm sticky top-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.medicine.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 line-clamp-1 flex-1 mr-2">
                          {item.medicine.name} x{item.quantity}
                        </span>
                        <span className="text-gray-900 font-semibold shrink-0">
                          ${(item.medicine.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Delivery</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-[#1e3a5f]">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setStep("cart")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} />
                Back to Cart
              </button>
              <button
                onClick={() => setStep("payment")}
                disabled={!patientName.trim() || !patientEmail.trim() || !patientPhone.trim() || !shippingAddress.trim()}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  patientName.trim() && patientEmail.trim() && patientPhone.trim() && shippingAddress.trim()
                    ? "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Proceed to Payment
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─── PAYMENT STEP ─── */}
        {step === "payment" && (
          <div className="max-w-lg mx-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment</h2>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="text-2xl font-bold text-[#1e3a5f]">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "card"
                    ? "border-[#1e3a5f] bg-blue-50/50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${paymentMethod === "card" ? "bg-[#1e3a5f] text-white" : "bg-gray-100 text-gray-500"}`}>
                  <CreditCard size={18} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">Credit / Debit Card</div>
                  <div className="text-xs text-gray-400">Visa, MasterCard, American Express</div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("upi")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "upi"
                    ? "border-[#1e3a5f] bg-blue-50/50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${paymentMethod === "upi" ? "bg-[#1e3a5f] text-white" : "bg-gray-100 text-gray-500"}`}>
                  <Smartphone size={18} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">UPI Payment</div>
                  <div className="text-xs text-gray-400">Google Pay, PhonePe, Paytm</div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("netbanking")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "netbanking"
                    ? "border-[#1e3a5f] bg-blue-50/50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${paymentMethod === "netbanking" ? "bg-[#1e3a5f] text-white" : "bg-gray-100 text-gray-500"}`}>
                  <Building size={18} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">Net Banking</div>
                  <div className="text-xs text-gray-400">All major banks supported</div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("cod")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "cod"
                    ? "border-[#1e3a5f] bg-blue-50/50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${paymentMethod === "cod" ? "bg-[#1e3a5f] text-white" : "bg-gray-100 text-gray-500"}`}>
                  <Truck size={18} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">Cash on Delivery</div>
                  <div className="text-xs text-gray-400">Pay when you receive your order</div>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep("checkout")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} />
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isProcessing
                    ? "bg-gray-300 text-gray-500 cursor-wait"
                    : "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg"
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ${cartTotal.toFixed(2)}
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─── CONFIRMATION STEP ─── */}
        {step === "confirmation" && (
          <div className="max-w-lg mx-auto p-6 text-center">
            <div className="py-10">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your medicine order has been placed successfully.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 inline-block">
                <div className="text-xs text-gray-500 font-medium">Order ID</div>
                <div className="text-lg font-bold text-[#1e3a5f] font-mono">{orderId}</div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-8">
                <p>A confirmation email has been sent to <strong>{patientEmail}</strong></p>
                <p>You will receive updates on your order status.</p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <button
                  onClick={resetShop}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] transition-colors shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
