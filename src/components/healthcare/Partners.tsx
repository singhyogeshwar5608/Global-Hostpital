"use client";

import React from "react";

interface Partner {
  name: string;
  color: string;
  gradient: string;
  icon: React.ReactNode;
}

const partners: Partner[] = [
  {
    name: "LabCorp",
    color: "#1a73e8",
    gradient: "from-blue-400 to-blue-600",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <circle cx="20" cy="14" r="6" stroke="white" strokeWidth="2" />
        <path d="M14 22c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <rect x="12" y="26" width="16" height="3" rx="1.5" fill="white" opacity="0.8" />
        <rect x="14" y="31" width="12" height="2" rx="1" fill="white" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: "Quest Diagnostics",
    color: "#34a853",
    gradient: "from-green-400 to-green-600",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <path d="M20 8l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="white" />
        <circle cx="20" cy="20" r="12" stroke="white" strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
  {
    name: "Bio-Rad",
    color: "#cc0000",
    gradient: "from-red-400 to-red-600",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="2" />
        <circle cx="20" cy="20" r="4" fill="white" />
        <path d="M20 10V6M20 34v-4M10 20H6M34 20h-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "ThermoFisher",
    color: "#0033a0",
    gradient: "from-indigo-400 to-indigo-600",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <path d="M12 28V14l8 7-8 7z" fill="white" />
        <path d="M20 28V14l8 7-8 7z" fill="white" opacity="0.6" />
      </svg>
    ),
  },
  {
    name: "Mayo Clinic",
    color: "#005ca9",
    gradient: "from-sky-400 to-sky-600",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <path d="M20 8v24M8 20h24" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="1.5" opacity="0.4" />
      </svg>
    ),
  },
  {
    name: "Sonic Healthcare",
    color: "#6b21a8",
    gradient: "from-purple-400 to-purple-600",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <path d="M8 20c4-8 8 8 12 0s8 8 12 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="8" cy="20" r="2" fill="white" />
        <circle cx="32" cy="20" r="2" fill="white" />
      </svg>
    ),
  },
  {
    name: "CVS Health",
    color: "#d40000",
    gradient: "from-rose-400 to-rose-600",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <path d="M14 10l6 10-6 10h6l6-10-6-10z" fill="white" />
        <path d="M20 10l6 10-6 10" stroke="white" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
  },
  {
    name: "UnitedHealth",
    color: "#002677",
    gradient: "from-blue-500 to-blue-700",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <path d="M20 8c6 0 12 4 12 12s-6 12-12 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 12c4 0 8 3 8 8s-4 8-8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="20" cy="20" r="3" fill="white" />
      </svg>
    ),
  },
  {
    name: "Pfizer",
    color: "#0082ca",
    gradient: "from-cyan-400 to-cyan-600",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect x="12" y="12" width="16" height="16" rx="3" stroke="white" strokeWidth="2" />
        <path d="M20 12v16M12 20h16" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "Johnson & Johnson",
    color: "#d51900",
    gradient: "from-red-500 to-orange-500",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <circle cx="14" cy="20" r="5" stroke="white" strokeWidth="1.5" />
        <circle cx="26" cy="20" r="5" stroke="white" strokeWidth="1.5" />
        <path d="M19 17c1-2 3-2 4 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Roche",
    color: "#0066b3",
    gradient: "from-blue-500 to-teal-500",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <path d="M10 20h20M20 10v20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="20" r="12" stroke="white" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
  {
    name: "Abbott Labs",
    color: "#009cde",
    gradient: "from-sky-400 to-blue-500",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <path d="M12 14h16M12 20h16M12 26h16" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 10v20" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
];

export default function Partners() {
  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-8 sm:mb-10">
        <span className="inline-block text-teal font-semibold text-[11px] sm:text-xs tracking-[0.15em] uppercase mb-1.5">
          Trusted Partners
        </span>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Our Partners
        </h2>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Row 1 - Left to Right */}
        <div className="flex partners-marquee mb-4">
          {[...partners, ...partners, ...partners].map((partner, i) => (
            <div
              key={`p1-${i}`}
              className="flex-shrink-0 mx-3 sm:mx-5 flex flex-col items-center justify-center"
            >
              {/* Circle Card */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${partner.gradient} flex items-center justify-center mb-3 shadow-lg shadow-gray-200/60 border-4 border-white transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer`}
              >
                {partner.icon}
              </div>
              {/* Name */}
              <span className="text-[11px] sm:text-xs font-semibold text-gray-700 text-center leading-tight max-w-[100px] sm:max-w-[120px]">
                {partner.name}
              </span>
            </div>
          ))}
        </div>

        {/* Scrolling Row 2 - Right to Left (reverse direction) */}
        <div className="flex partners-marquee-reverse">
          {[...partners.slice().reverse(), ...partners.slice().reverse(), ...partners.slice().reverse()].map((partner, i) => (
            <div
              key={`p2-${i}`}
              className="flex-shrink-0 mx-3 sm:mx-5 flex flex-col items-center justify-center"
            >
              {/* Circle Card */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${partner.gradient} flex items-center justify-center mb-3 shadow-lg shadow-gray-200/60 border-4 border-white transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer`}
              >
                {partner.icon}
              </div>
              {/* Name */}
              <span className="text-[11px] sm:text-xs font-semibold text-gray-700 text-center leading-tight max-w-[100px] sm:max-w-[120px]">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
