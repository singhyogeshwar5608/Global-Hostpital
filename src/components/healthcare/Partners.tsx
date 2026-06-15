"use client";

import React from "react";
import { motion } from "framer-motion";

interface Partner {
  name: string;
  img: string;
}

const partners: Partner[] = [
  { name: "LabCorp", img: "/banner/1.png" },
  { name: "Quest Diagnostics", img: "/banner/2.png" },
  { name: "Bio-Rad", img: "/banner/3.png" },
  { name: "ThermoFisher", img: "/banner/4.png" },
  { name: "Mayo Clinic", img: "/banner/5.png" },
  { name: "Sonic Healthcare", img: "/banner/6.png" },
  { name: "CVS Health", img: "/banner/7.png" },
  { name: "UnitedHealth", img: "/banner/8.png" },
  { name: "Pfizer", img: "/banner/9.png" },
  { name: "Johnson & Johnson", img: "/banner/10.png" },
  { name: "Roche", img: "/banner/11.png" },
  { name: "Abbott Labs", img: "/banner/12.png" },
];

export default function Partners() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="py-10 sm:py-14 lg:py-16 bg-gray-50 overflow-hidden"
    >
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-8 sm:mb-10 text-center">
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

        {/* Scrolling Row */}
        <div className="flex partners-marquee">
          {[...partners, ...partners, ...partners].map((partner, i) => (
            <div
              key={`p1-${i}`}
              className="flex-shrink-0 mx-3 sm:mx-5 flex flex-col items-center justify-center"
            >
              {/* Circle Card */}
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center shadow-lg shadow-gray-200/60 border-2 border-gray-100 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer overflow-hidden"
              >
                <img
                  src={partner.img}
                  alt={partner.name}
                  className="w-full h-full object-contain p-3"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
