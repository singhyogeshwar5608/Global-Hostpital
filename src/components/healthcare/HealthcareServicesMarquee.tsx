"use client";

import React from "react";
import { motion } from "framer-motion";

// ─── SVG Icon Components ───

const OnlineConsultationIcon = () => (
  <svg width="72" height="72" viewBox="0 0 64 64" fill="none">
    <rect x="10" y="14" width="36" height="26" rx="3" stroke="#0A2E7A" strokeWidth="2.5" />
    <line x1="28" y1="40" x2="28" y2="48" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="18" y1="48" x2="38" y2="48" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="28" cy="24" r="5" stroke="#0A2E7A" strokeWidth="2" />
    <path d="M20 38c0-4 3.6-8 8-8s8 4 8 8" stroke="#0A2E7A" strokeWidth="2" strokeLinecap="round" />
    <path d="M52 30c4 0 7 2 7 5.5s-3 5.5-7 5.5h-2l-3 2 1.2-3C46 39 45 37 45 35.5c0-3.5 3-5.5 7-5.5z" stroke="#16A34A" strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);

const LabTestsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
    <path d="M36 12v16l12 16c2 2.5 2 6 0 8s-5 2-8 2H24c-3 0-6 0-8-2s-2-5.5 0-8l12-16V12" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="24" y1="12" x2="40" y2="12" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="20" y1="32" x2="44" y2="32" stroke="#0A2E7A" strokeWidth="2" strokeLinecap="round" />
    <circle cx="44" cy="50" r="8" stroke="#16A34A" strokeWidth="2.5" />
    <line x1="44" y1="46" x2="44" y2="54" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="50" x2="48" y2="50" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MedicinesDeliveryIcon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
    <rect x="22" y="8" width="20" height="36" rx="4" stroke="#0A2E7A" strokeWidth="2.5" />
    <line x1="32" y1="44" x2="32" y2="52" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="52" x2="40" y2="52" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="28" y1="16" x2="36" y2="16" stroke="#0A2E7A" strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="22" x2="34" y2="22" stroke="#0A2E7A" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="28" x2="36" y2="28" stroke="#0A2E7A" strokeWidth="2" strokeLinecap="round" />
    <circle cx="52" cy="46" r="10" stroke="#16A34A" strokeWidth="2.5" />
    <line x1="52" y1="40" x2="52" y2="52" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <line x1="46" y1="46" x2="58" y2="46" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DigitalPrescriptionIcon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
    <rect x="18" y="6" width="28" height="52" rx="3" stroke="#0A2E7A" strokeWidth="2.5" />
    <line x1="24" y1="16" x2="40" y2="16" stroke="#0A2E7A" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="24" x2="36" y2="24" stroke="#0A2E7A" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="32" x2="32" y2="32" stroke="#0A2E7A" strokeWidth="2" strokeLinecap="round" />
    <circle cx="46" cy="48" r="12" stroke="#16A34A" strokeWidth="2.5" />
    <path d="M41 48l3.5 3.5 5-6" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SecureConfidentialIcon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
    <path d="M32 8L12 16v12c0 14 8 22 20 28 12-6 20-14 20-28V16L32 8z" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="26" y="28" width="12" height="14" rx="2" stroke="#16A34A" strokeWidth="2.5" />
    <circle cx="32" cy="34" r="2" stroke="#16A34A" strokeWidth="2" />
    <line x1="32" y1="36" x2="32" y2="38" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const BookAppointmentIcon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
    <rect x="10" y="12" width="44" height="44" rx="4" stroke="#0A2E7A" strokeWidth="2.5" />
    <line x1="10" y1="26" x2="54" y2="26" stroke="#0A2E7A" strokeWidth="2" />
    <line x1="22" y1="6" x2="22" y2="18" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="42" y1="6" x2="42" y2="18" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="42" cy="42" r="10" stroke="#16A34A" strokeWidth="2.5" />
    <line x1="42" y1="38" x2="42" y2="46" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="42" x2="46" y2="42" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const HealthCheckupIcon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
    <rect x="16" y="6" width="24" height="30" rx="3" stroke="#0A2E7A" strokeWidth="2.5" />
    <line x1="16" y1="24" x2="40" y2="24" stroke="#0A2E7A" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="6" x2="28" y2="10" stroke="#0A2E7A" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 38l10-6 4 6 6-10 4 6 8-4" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="36" cy="38" r="2" fill="#16A34A" />
    <circle cx="48" cy="38" r="2" fill="#16A34A" />
    <line x1="36" y1="38" x2="48" y2="38" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <path d="M38 42c1 2 3 2 4 0" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChronicDiseaseIcon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
    <path d="M32 52C20 44 10 36 10 26c0-6 5-12 12-12 4 0 7 2 10 5 3-3 6-5 10-5 7 0 12 6 12 12 0 10-10 18-22 26z" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="8,28 18,28 22,34 28,22 34,30 40,22" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DoorstepDeliveryIcon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
    <path d="M12 34V26l20-14 20 14v8" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="14" y="34" width="14" height="22" rx="2" stroke="#0A2E7A" strokeWidth="2.5" />
    <rect x="8" y="44" width="26" height="8" rx="2" stroke="#16A34A" strokeWidth="2.5" />
    <rect x="46" y="38" width="14" height="14" rx="2" stroke="#16A34A" strokeWidth="2.5" />
    <line x1="53" y1="42" x2="53" y2="48" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="45" x2="56" y2="45" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Support247Icon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
    <path d="M12 28c0-10 8-18 20-18s20 8 20 18-8 18-20 18c-2 0-4-0.2-6-0.5L16 52l6-6c-6-3-10-10-10-18z" stroke="#0A2E7A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="32" cy="28" r="4" fill="#16A34A" />
    <line x1="32" y1="32" x2="32" y2="36" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="22" cy="28" r="2" fill="#16A34A" opacity="0.5" />
    <circle cx="42" cy="28" r="2" fill="#16A34A" opacity="0.5" />
  </svg>
);

const AffordablePricingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
    <rect x="10" y="16" width="44" height="32" rx="6" stroke="#0A2E7A" strokeWidth="2.5" />
    <line x1="10" y1="26" x2="54" y2="26" stroke="#0A2E7A" strokeWidth="2" />
    <circle cx="32" cy="38" r="6" stroke="#16A34A" strokeWidth="2.5" />
    <line x1="32" y1="35" x2="32" y2="41" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <line x1="29" y1="38" x2="35" y2="38" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="34" x2="20" y2="34" stroke="#0A2E7A" strokeWidth="2" strokeLinecap="round" />
    <line x1="44" y1="34" x2="44" y2="34" stroke="#0A2E7A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ─── Services Data ───

interface Service {
  id: number;
  title: string;
  icon: React.FC;
}

const services: Service[] = [
  { id: 1, title: "Online Consultation", icon: OnlineConsultationIcon },
  { id: 2, title: "Lab Tests", icon: LabTestsIcon },
  { id: 3, title: "Medicines Delivery", icon: MedicinesDeliveryIcon },
  { id: 4, title: "Digital Prescription", icon: DigitalPrescriptionIcon },
  { id: 5, title: "Secure & Confidential", icon: SecureConfidentialIcon },
  { id: 6, title: "Book Appointment", icon: BookAppointmentIcon },
  { id: 7, title: "Health Checkup", icon: HealthCheckupIcon },
  { id: 8, title: "Chronic Disease Management", icon: ChronicDiseaseIcon },
  { id: 9, title: "Doorstep Delivery", icon: DoorstepDeliveryIcon },
  { id: 10, title: "24/7 Support", icon: Support247Icon },
  { id: 11, title: "Affordable Pricing", icon: AffordablePricingIcon },
];

// ─── Main Component ───

export default function HealthcareServicesMarquee() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="py-12 lg:py-20 bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-10 lg:mb-14 text-center">
        <span className="inline-block text-[11px] sm:text-xs font-semibold text-blue-600 uppercase tracking-[0.15em] mb-2">
          Our Services
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A2E7A]">
          Comprehensive{" "}
          <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
            Healthcare Services
          </span>
        </h2>
        <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
          Everything you need for your health journey, all in one place
        </p>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="services-marquee-container">
          <div className="services-marquee-track">
            {/* First copy */}
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.id} className="flex flex-col items-center gap-3 sm:gap-4 shrink-0 mx-3 sm:mx-4">
                  <div className="w-[80px] h-[80px] sm:w-[95px] sm:h-[95px] lg:w-[110px] lg:h-[110px] rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] group cursor-pointer">
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      <Icon />
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs lg:text-sm font-semibold text-gray-800 text-center leading-tight max-w-[80px] sm:max-w-[95px] lg:max-w-[110px]">
                    {service.title}
                  </p>
                </div>
              );
            })}
            {/* Duplicate for seamless loop */}
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={`dup-${service.id}`} className="flex flex-col items-center gap-3 sm:gap-4 shrink-0 mx-3 sm:mx-4">
                  <div className="w-[80px] h-[80px] sm:w-[95px] sm:h-[95px] lg:w-[110px] lg:h-[110px] rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] group cursor-pointer">
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      <Icon />
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs lg:text-sm font-semibold text-gray-800 text-center leading-tight max-w-[80px] sm:max-w-[95px] lg:max-w-[110px]">
                    {service.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .services-marquee-container {
          overflow: hidden;
          width: 100%;
        }
        .services-marquee-track {
          display: flex;
          width: fit-content;
          animation: servicesMarquee 30s linear infinite;
        }
        .services-marquee-container:hover .services-marquee-track {
          animation-play-state: paused;
        }
        @keyframes servicesMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </motion.section>
  );
}
