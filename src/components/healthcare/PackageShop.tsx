"use client";

import React, { useState } from "react";
import { usePackageStore } from "@/store/package-store";
import {
  Search,
  Package,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  ArrowLeft,
  Clock,
  DollarSign,
  Sparkles,
  CalendarDays,
  MapPin,
  User,
  Phone,
  Mail,
  X,
  Tag,
} from "lucide-react";
import type { HealthPackage } from "@/store/package-store";

type ShopStep = "browse" | "details" | "booking" | "payment" | "confirmation";

export default function PackageShop() {
  const {
    packages,
    isShopOpen,
    closeShop,
    selectedPackage,
    setSelectedPackage,
    placeBooking,
  } = usePackageStore();

  const [step, setStep] = useState<ShopStep>("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Booking form
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("Male");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "cod">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const activePackages = packages.filter((p) => p.isActive);
  const categories = ["all", ...Array.from(new Set(activePackages.map((p) => p.category)))];

  const filtered = activePackages.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const handleSelectPackage = (pkg: HealthPackage) => {
    setSelectedPackage(pkg);
    setStep("details");
  };

  const handlePlaceBooking = () => {
    if (!selectedPackage || !patientName.trim() || !patientEmail.trim() || !patientPhone.trim() || !preferredDate || !preferredTime) return;
    setIsProcessing(true);
    setTimeout(() => {
      const booking = placeBooking({
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price,
        patientName: patientName.trim(),
        patientEmail: patientEmail.trim(),
        patientPhone: patientPhone.trim(),
        patientAge: patientAge || "N/A",
        patientGender,
        bookingDate: new Date().toISOString().split("T")[0],
        preferredDate,
        preferredTime,
        address: address.trim(),
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        bookingStatus: "confirmed",
      });
      setBookingId(booking.id);
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
    setPatientAge("");
    setPatientGender("Male");
    setPreferredDate("");
    setPreferredTime("");
    setAddress("");
    setPaymentMethod("card");
    setBookingId("");
  };

  const handleClose = () => {
    resetShop();
    setSelectedPackage(null);
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
            <Package size={22} />
            <div>
              <h1 className="text-sm font-bold">Health Packages</h1>
              <p className="text-[10px] text-white/60">Global Integrative Clinic</p>
            </div>
          </div>
        </div>

        {step !== "confirmation" && (
          <div className="hidden md:flex items-center gap-1">
            {(["browse", "details", "booking", "payment"] as ShopStep[]).map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <ChevronRight size={12} className="text-white/30" />}
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${step === s ? "bg-white/20 text-white" : "text-white/40"}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="text-xs text-white/50">{activePackages.length} packages</div>
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
                  placeholder="Search health packages..."
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

            {/* Package Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden cursor-pointer"
                  onClick={() => handleSelectPackage(pkg)}
                >
                  {/* Top Banner */}
                  <div className="bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6] p-5 text-white relative">
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {getDiscount(pkg.originalPrice, pkg.price)}% OFF
                      </span>
                    </div>
                    <div className="text-3xl mb-2">{pkg.image}</div>
                    <h3 className="font-bold text-base mb-1">{pkg.name}</h3>
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                      <Clock size={12} />
                      {pkg.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{pkg.description}</p>

                    {/* Benefits Preview */}
                    <div className="space-y-1 mb-4">
                      {pkg.benefits.slice(0, 4).map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                          <span className="line-clamp-1">{benefit}</span>
                        </div>
                      ))}
                      {pkg.benefits.length > 4 && (
                        <div className="text-xs text-blue-500 font-medium">
                          +{pkg.benefits.length - 4} more benefits
                        </div>
                      )}
                    </div>

                    {/* Tests */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {pkg.testsIncluded.slice(0, 3).map((test, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">
                          {test}
                        </span>
                      ))}
                      {pkg.testsIncluded.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">
                          +{pkg.testsIncluded.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-400 line-through">${pkg.originalPrice.toFixed(2)}</span>
                        <span className="text-xl font-bold text-[#1e3a5f] ml-1">${pkg.price.toFixed(2)}</span>
                      </div>
                      <button className="px-4 py-2 rounded-xl bg-[#1e3a5f] text-white text-xs font-semibold hover:bg-[#163050] transition-colors shadow-md">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <Package size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No packages found.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── DETAILS STEP ─── */}
        {step === "details" && selectedPackage && (
          <div className="max-w-4xl mx-auto p-6">
            <button
              onClick={() => setStep("browse")}
              className="inline-flex items-center gap-1.5 text-sm text-[#1e3a5f] font-semibold mb-5 hover:underline"
            >
              <ChevronLeft size={14} />
              Back to Packages
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Package Details */}
              <div className="lg:col-span-2 space-y-5">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6] rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    {getDiscount(selectedPackage.originalPrice, selectedPackage.price)}% OFF
                  </div>
                  <div className="text-4xl mb-3">{selectedPackage.image}</div>
                  <h2 className="text-2xl font-bold mb-2">{selectedPackage.name}</h2>
                  <p className="text-white/80 text-sm mb-3">{selectedPackage.description}</p>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span className="flex items-center gap-1"><Clock size={14} /> {selectedPackage.duration}</span>
                    <span className="flex items-center gap-1"><Tag size={14} /> {selectedPackage.category}</span>
                    <span className="flex items-center gap-1"><Sparkles size={14} /> {selectedPackage.testsIncluded.length} Tests</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles size={16} className="text-[#1e3a5f]" />
                    Benefits Included
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedPackage.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tests Included */}
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign size={16} className="text-[#1e3a5f]" />
                    Tests Included
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPackage.testsIncluded.map((test, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                        {test}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg sticky top-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Book This Package</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Original Price</span>
                      <span className="text-sm text-gray-400 line-through">${selectedPackage.originalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Discount</span>
                      <span className="text-sm text-green-600 font-semibold">-${(selectedPackage.originalPrice - selectedPackage.price).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">Price</span>
                      <span className="text-2xl font-bold text-[#1e3a5f]">${selectedPackage.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-gray-500 mb-5">
                    <div className="flex items-center gap-2"><Clock size={12} /> Duration: {selectedPackage.duration}</div>
                    <div className="flex items-center gap-2"><Sparkles size={12} /> {selectedPackage.benefits.length} Benefits</div>
                    <div className="flex items-center gap-2"><Tag size={12} /> {selectedPackage.testsIncluded.length} Tests</div>
                  </div>
                  <button
                    onClick={() => setStep("booking")}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] transition-colors shadow-lg"
                  >
                    Book Now
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── BOOKING STEP ─── */}
        {step === "booking" && selectedPackage && (
          <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Book Package</h2>
              <span className="text-sm text-gray-500">{selectedPackage.name} - ${selectedPackage.price.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><User size={14} className="text-[#1e3a5f]" /> Patient Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter your full name"
                        className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Email <span className="text-red-500">*</span></label>
                        <input type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} placeholder="Email address"
                          className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Phone <span className="text-red-500">*</span></label>
                        <input type="tel" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="Phone number"
                          className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Age</label>
                        <input type="text" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} placeholder="e.g. 35"
                          className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Gender</label>
                        <select value={patientGender} onChange={(e) => setPatientGender(e.target.value)}
                          className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><CalendarDays size={14} className="text-[#1e3a5f]" /> Schedule</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Preferred Date <span className="text-red-500">*</span></label>
                      <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                        className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Preferred Time <span className="text-red-500">*</span></label>
                      <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full h-11 rounded-lg bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all">
                        <option value="">Select Time</option>
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={14} className="text-[#1e3a5f]" /> Address</h3>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your full address" rows={3}
                    className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all resize-none" />
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm sticky top-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Booking Summary</h3>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl border border-blue-100">
                      {selectedPackage.image}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{selectedPackage.name}</div>
                      <div className="text-xs text-gray-400">{selectedPackage.category} • {selectedPackage.duration}</div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Original Price</span>
                      <span className="text-gray-400 line-through">${selectedPackage.originalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-green-600 font-semibold">-${(selectedPackage.originalPrice - selectedPackage.price).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-[#1e3a5f]">${selectedPackage.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setStep("details")} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                <ChevronLeft size={16} /> Back to Details
              </button>
              <button
                onClick={() => setStep("payment")}
                disabled={!patientName.trim() || !patientEmail.trim() || !patientPhone.trim() || !preferredDate || !preferredTime}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  patientName.trim() && patientEmail.trim() && patientPhone.trim() && preferredDate && preferredTime
                    ? "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Proceed to Payment <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─── PAYMENT STEP ─── */}
        {step === "payment" && selectedPackage && (
          <div className="max-w-lg mx-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment</h2>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">{selectedPackage.name}</span>
                  <span className="text-sm text-gray-900 font-medium">Total Amount</span>
                </div>
                <span className="text-2xl font-bold text-[#1e3a5f]">${selectedPackage.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { key: "card" as const, icon: <CreditCard size={18} />, label: "Credit / Debit Card", desc: "Visa, MasterCard, American Express" },
                { key: "upi" as const, icon: <Smartphone size={18} />, label: "UPI Payment", desc: "Google Pay, PhonePe, Paytm" },
                { key: "netbanking" as const, icon: <Building size={18} />, label: "Net Banking", desc: "All major banks supported" },
                { key: "cod" as const, icon: <CalendarDays size={18} />, label: "Pay at Center", desc: "Pay when you visit the clinic" },
              ].map((method) => (
                <button
                  key={method.key}
                  onClick={() => setPaymentMethod(method.key)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === method.key
                      ? "border-[#1e3a5f] bg-blue-50/50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${paymentMethod === method.key ? "bg-[#1e3a5f] text-white" : "bg-gray-100 text-gray-500"}`}>
                    {method.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">{method.label}</div>
                    <div className="text-xs text-gray-400">{method.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setStep("booking")} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={handlePlaceBooking}
                disabled={isProcessing}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isProcessing ? "bg-gray-300 text-gray-500 cursor-wait" : "bg-[#1e3a5f] text-white hover:bg-[#163050] shadow-lg"
                }`}
              >
                {isProcessing ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                ) : (
                  <>Pay ${selectedPackage.price.toFixed(2)} <ChevronRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─── CONFIRMATION STEP ─── */}
        {step === "confirmation" && selectedPackage && (
          <div className="max-w-lg mx-auto p-6 text-center">
            <div className="py-10">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-500 text-sm mb-6">Your health package has been booked successfully.</p>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 inline-block">
                <div className="text-xs text-gray-500 font-medium">Booking ID</div>
                <div className="text-lg font-bold text-[#1e3a5f] font-mono">{bookingId}</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="text-sm font-semibold text-blue-900">{selectedPackage.name}</div>
                <div className="text-xs text-blue-600 mt-1">
                  {preferredDate} at {preferredTime}
                </div>
                <div className="text-lg font-bold text-[#1e3a5f] mt-2">${selectedPackage.price.toFixed(2)}</div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-8">
                <p>A confirmation email has been sent to <strong>{patientEmail}</strong></p>
                <p>Please arrive 15 minutes before your scheduled time.</p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <button onClick={resetShop} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                  Browse More
                </button>
                <button onClick={handleClose} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] transition-colors shadow-lg">
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
