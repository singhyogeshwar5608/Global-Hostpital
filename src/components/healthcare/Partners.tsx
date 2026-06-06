"use client";

import React from "react";

const partners = [
  { name: "LabCorp", color: "#1a73e8", bg: "#e8f0fe", initial: "LC" },
  { name: "Quest Diagnostics", color: "#34a853", bg: "#e6f4ea", initial: "QD" },
  { name: "Bio-Rad", color: "#cc0000", bg: "#fce8e6", initial: "BR" },
  { name: "ThermoFisher Scientific", color: "#0033a0", bg: "#e8eaef", initial: "TF" },
  { name: "Mayo Clinic", color: "#005ca9", bg: "#e3eef8", initial: "MC" },
  { name: "Sonic Healthcare", color: "#6b21a8", bg: "#f3e8fd", initial: "SH" },
  { name: "CVS Health", color: "#d40000", bg: "#fce4e4", initial: "CV" },
  { name: "UnitedHealth", color: "#002677", bg: "#e0e7f5", initial: "UH" },
  { name: "Pfizer", color: "#0082ca", bg: "#e3f2fd", initial: "PF" },
  { name: "Johnson & Johnson", color: "#d51900", bg: "#fce8e6", initial: "JJ" },
  { name: "Roche", color: "#0066b3", bg: "#e3f0fa", initial: "RC" },
  { name: "Abbott Labs", color: "#009cde", bg: "#e3f5fc", initial: "AL" },
];

export default function Partners() {
  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-gray-50 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header - Left Aligned */}
        <div className="mb-6 sm:mb-8">
          <span className="inline-block text-teal font-semibold text-[10px] sm:text-[11px] tracking-widest uppercase">
            Trusted Partners
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
            Our Partners
          </h2>
        </div>
      </div>

      {/* Marquee Row */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        {/* Scrolling container */}
        <div className="flex animate-marquee">
          {/* Duplicate the list for seamless loop */}
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={`partner-${i}`}
              className="flex-shrink-0 mx-2.5 sm:mx-4 flex flex-col items-center justify-center w-28 sm:w-36 py-4 sm:py-5"
            >
              {/* Circle Logo Card */}
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2.5 shadow-sm border border-white/60 transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: partner.bg }}
              >
                <span
                  className="text-sm sm:text-base font-bold"
                  style={{ color: partner.color }}
                >
                  {partner.initial}
                </span>
              </div>
              {/* Name */}
              <span
                className="text-[10px] sm:text-xs font-semibold text-center leading-tight"
                style={{ color: partner.color }}
              >
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
