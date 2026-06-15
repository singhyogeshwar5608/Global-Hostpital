"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Video,
  Pill,
  FileText,
  HeartPulse,
  Smartphone,
} from "lucide-react";

const appFeatures = [
  { icon: CalendarCheck, label: "Book Appointments", color: "#0d9488", bg: "#f0fdfa" },
  { icon: Video, label: "Consult Online", color: "#7c3aed", bg: "#f5f3ff" },
  { icon: Pill, label: "Order Medicines", color: "#ea580c", bg: "#fff7ed" },
  { icon: FileText, label: "View Reports", color: "#2563eb", bg: "#eff6ff" },
  { icon: HeartPulse, label: "Track Health", color: "#e11d48", bg: "#fff1f2" },
];

export default function MobileApp() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="py-10 sm:py-16 lg:py-24 bg-white"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
          {/* Left - Phone Mockup */}
          <div className="flex-shrink-0 relative">
            {/* Subtle background circle */}
            <div className="absolute -inset-4 sm:-inset-8 bg-gray-50 rounded-full -z-10" />

            <div className="w-52 h-[340px] sm:w-60 sm:h-[400px] bg-gray-900 rounded-[2rem] sm:rounded-[2.5rem] p-2 sm:p-2.5 shadow-2xl relative">
              <div className="w-full h-full rounded-[1.5rem] sm:rounded-[2rem] bg-white overflow-hidden relative">
                {/* App Header - Green */}
                <div className="bg-gradient-to-r from-teal to-teal-light px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex gap-1 sm:gap-1.5">
                      <div className="w-3 sm:w-4 h-0.5 bg-white/60 rounded-full" />
                      <div className="w-3 sm:w-4 h-0.5 bg-white/60 rounded-full" />
                      <div className="w-3 sm:w-4 h-0.5 bg-white/60 rounded-full" />
                    </div>
                    <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-white/20" />
                  </div>
                  <div className="text-white font-bold text-xs sm:text-sm">Dashboard</div>
                  <div className="text-white/70 text-[8px] sm:text-[10px]">Good Morning!</div>
                </div>

                {/* App Content */}
                <div className="px-2 sm:px-3 pt-2 sm:pt-3">
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {appFeatures.slice(0, 4).map((f) => (
                      <div
                        key={f.label}
                        className="bg-teal/5 border border-teal/10 rounded-lg sm:rounded-xl p-2 sm:p-2.5 text-center"
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-teal/10 flex items-center justify-center mx-auto mb-0.5 sm:mb-1">
                          <f.icon size={12} className="sm:hidden" />
                          <f.icon size={16} className="hidden sm:block" />
                        </div>
                        <div className="text-gray-700 text-[7px] sm:text-[8px] font-medium leading-tight">{f.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Upcoming Appointment */}
                  <div className="mt-2 sm:mt-2.5 bg-gray-50 border border-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-2.5">
                    <div className="text-[7px] sm:text-[8px] text-gray-400 mb-1 sm:mb-1.5 font-medium uppercase tracking-wider">Upcoming</div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-teal/10 flex items-center justify-center">
                        <CalendarCheck size={10} className="sm:hidden" />
                        <CalendarCheck size={12} className="hidden sm:block" />
                      </div>
                      <div>
                        <div className="text-[8px] sm:text-[9px] font-semibold text-gray-800">Dr. Sarah Wilson</div>
                        <div className="text-[6px] sm:text-[7px] text-gray-400">10:00 AM Today</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-0.5 sm:h-1 bg-gray-200 rounded-full" />
              </div>
            </div>

            {/* Floating notification - hidden on very small screens */}
            <div className="hidden sm:block absolute -right-2 sm:-right-4 top-10 sm:top-14 bg-white rounded-lg sm:rounded-xl p-2 sm:p-2.5 shadow-lg border border-gray-100 w-28 sm:w-36">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-green-50 flex items-center justify-center">
                  <CalendarCheck size={11} className="sm:hidden" />
                  <CalendarCheck size={13} className="hidden sm:block" />
                </div>
                <div>
                  <div className="text-[8px] sm:text-[9px] font-semibold text-gray-800">Appointment</div>
                  <div className="text-[6px] sm:text-[7px] text-green-500 font-medium">Confirmed!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-teal/5 rounded-full px-3 sm:px-4 py-1.5 text-teal text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              <Smartphone size={13} className="sm:hidden" />
              <Smartphone size={14} className="hidden sm:block" />
              Mobile App
            </div>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-2 sm:mb-3">
              Healthcare at Your Fingertips
            </h2>

            <p className="text-gray-500 text-xs sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 mb-5 sm:mb-8">
              Download our mobile app for a better healthcare experience. Book appointments, consult doctors, order medicines, and view reports — anytime, anywhere.
            </p>

            {/* Feature Icons - Circular with Colors */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-5 mb-6 sm:mb-8">
              {appFeatures.map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-1 sm:gap-1.5 group cursor-default">
                  <div
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: f.bg }}
                  >
                    <f.icon size={14} style={{ color: f.color }} className="sm:hidden" />
                    <f.icon size={20} style={{ color: f.color }} className="hidden sm:block" />
                  </div>
                  <span
                    className="text-[8px] sm:text-[10px] font-semibold text-center leading-tight max-w-[56px] sm:max-w-[72px]"
                    style={{ color: f.color }}
                  >
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 sm:gap-3">
              <button className="flex items-center gap-2 sm:gap-2.5 bg-black rounded-lg sm:rounded-xl px-3 sm:px-5 h-9 sm:h-11 hover:bg-gray-800 transition-all shadow-sm">
                <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5 sm:w-5 sm:h-5">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left">
                  <div className="text-[6px] sm:text-[8px] text-gray-300 leading-none">Download on the</div>
                  <div className="text-[9px] sm:text-xs font-semibold text-white leading-tight">App Store</div>
                </div>
              </button>

              <button className="flex items-center gap-2 sm:gap-2.5 bg-black rounded-lg sm:rounded-xl px-3 sm:px-5 h-9 sm:h-11 hover:bg-gray-800 transition-all shadow-sm">
                <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5 sm:w-5 sm:h-5">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 9.479l2.71-2.712 5.156 2.98a1.003 1.003 0 0 1 0 1.738l-5.156 2.98-2.71-2.712zm-1.414 1.414L2.908 22.882l10.177-5.877 2.71-2.71-2.71-2.688zM2.908 1.118l10.177 5.877-2.71 2.688-10.177-5.22z" />
                </svg>
                <div className="text-left">
                  <div className="text-[6px] sm:text-[8px] text-gray-300 leading-none">Get it on</div>
                  <div className="text-[9px] sm:text-xs font-semibold text-white leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
