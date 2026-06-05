"use client";

import React from "react";

const partners = [
  "LabCorp",
  "Quest Diagnostics",
  "Bio-Rad",
  "Thermo Fisher",
  "Mayo Clinic",
  "Sonic Healthcare",
];

export default function Partners() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-10">
          <span className="inline-block text-teal font-semibold text-sm mb-2 tracking-wider uppercase">
            Trusted Partners
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Our Lab Partners
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div
              key={partner}
              className="flex items-center justify-center h-16 px-8 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-teal/20 hover:bg-mint-light transition-all cursor-pointer group"
            >
              <span className="text-lg font-bold text-gray-300 group-hover:text-teal transition-colors tracking-wide">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
