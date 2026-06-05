"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  UserSearch,
  CalendarPlus,
  Video,
  FlaskConical,
  Pill,
  Package,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppointmentStore } from "@/store/appointment-store";

const services = [
  {
    icon: UserSearch,
    title: "Find Doctors",
    description: "Search verified doctors.",
    color: "bg-teal/10",
    iconColor: "text-teal",
    borderColor: "hover:border-teal/25",
    ctaBg: "bg-teal/10 group-hover:bg-teal",
    ctaColor: "text-teal group-hover:text-white",
    action: "booking" as const,
  },
  {
    icon: CalendarPlus,
    title: "Book Appointment",
    description: "Book appointments online.",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
    borderColor: "hover:border-blue-300/30",
    ctaBg: "bg-blue-50 group-hover:bg-blue-500",
    ctaColor: "text-blue-500 group-hover:text-white",
    action: "booking" as const,
  },
  {
    icon: Video,
    title: "Video Consultation",
    description: "Consult doctors via video.",
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    borderColor: "hover:border-purple-300/30",
    ctaBg: "bg-purple-50 group-hover:bg-purple-500",
    ctaColor: "text-purple-500 group-hover:text-white",
    action: "booking" as const,
  },
  {
    icon: FlaskConical,
    title: "Lab Tests",
    description: "Book tests and view reports.",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
    borderColor: "hover:border-orange-300/30",
    ctaBg: "bg-orange-50 group-hover:bg-orange-500",
    ctaColor: "text-orange-500 group-hover:text-white",
    action: "link" as const,
  },
  {
    icon: Pill,
    title: "Medicines",
    description: "Order medicines online.",
    color: "bg-emerald-50",
    iconColor: "text-emerald-500",
    borderColor: "hover:border-emerald-300/30",
    ctaBg: "bg-emerald-50 group-hover:bg-emerald-500",
    ctaColor: "text-emerald-500 group-hover:text-white",
    action: "link" as const,
  },
  {
    icon: Package,
    title: "Health Packages",
    description: "Explore health packages.",
    color: "bg-rose-50",
    iconColor: "text-rose-500",
    borderColor: "hover:border-rose-300/30",
    ctaBg: "bg-rose-50 group-hover:bg-rose-500",
    ctaColor: "text-rose-500 group-hover:text-white",
    action: "link" as const,
  },
];

export default function Services() {
  const { openModal } = useAppointmentStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLDivElement>("[data-card]")?.offsetWidth || 220;
    el.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28 bg-white" id="services">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-teal font-semibold text-sm mb-3 tracking-wider uppercase">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Healthcare Solutions for Everyone
          </h2>
          <p className="text-gray-500 text-base">
            From finding the right doctor to ordering medicines, we provide
            end-to-end healthcare services tailored to your needs.
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative">
          {/* Scroll Arrows — tablet/mobile */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-teal hover:shadow-xl transition-all lg:hidden -ml-1"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-teal hover:shadow-xl transition-all lg:hidden -mr-1"
            >
              <ChevronRight size={18} />
            </button>
          )}

          {/* Cards Row */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 lg:overflow-visible"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {services.map((service) => (
              <div
                key={service.title}
                data-card
                onClick={service.action === "booking" ? openModal : undefined}
                className={`
                  group flex-shrink-0 w-[200px] sm:w-[220px] lg:w-auto lg:flex-1
                  bg-white border border-gray-100 ${service.borderColor}
                  rounded-2xl p-6 pt-7 pb-5
                  shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)]
                  hover:shadow-[0_8px_25px_rgba(0,0,0,0.07),0_2px_6px_rgba(0,0,0,0.03)]
                  hover:-translate-y-1.5
                  transition-all duration-300 ease-out
                  cursor-pointer snap-start
                  flex flex-col items-center text-center
                `}
              >
                {/* Icon — centered */}
                <div
                  className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon size={22} className={service.iconColor} />
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 mb-1.5 leading-tight">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">
                  {service.description}
                </p>

                {/* CTA Button */}
                <span
                  className={`inline-flex items-center gap-1 ${service.ctaBg} ${service.ctaColor} text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-300`}
                >
                  {service.action === "booking" ? "Book Now" : "Learn More"}
                  <ArrowRight size={12} />
                </span>
              </div>
            ))}
          </div>

          {/* Mobile dots */}
          <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
            {services.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
