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
    description: "Search from 248+ specialist doctors across various medical fields with verified reviews.",
    color: "bg-teal/10",
    iconColor: "text-teal",
    gradient: "from-teal/5 to-teal/0",
    borderColor: "hover:border-teal/30",
    action: "booking" as const,
  },
  {
    icon: CalendarPlus,
    title: "Book Appointment",
    description: "Schedule in-person or online appointments instantly with your preferred healthcare provider.",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
    gradient: "from-blue-500/5 to-blue-500/0",
    borderColor: "hover:border-blue-300/40",
    action: "booking" as const,
  },
  {
    icon: Video,
    title: "Video Consultation",
    description: "Connect with certified doctors from the comfort of your home through secure video calls.",
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    gradient: "from-purple-500/5 to-purple-500/0",
    borderColor: "hover:border-purple-300/40",
    action: "booking" as const,
  },
  {
    icon: FlaskConical,
    title: "Lab Tests",
    description: "Book lab tests online and get accurate results from 320+ NABL-accredited partner labs.",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
    gradient: "from-orange-500/5 to-orange-500/0",
    borderColor: "hover:border-orange-300/40",
    action: "link" as const,
  },
  {
    icon: Pill,
    title: "Medicines",
    description: "Order genuine medicines online and get them delivered to your doorstep at the best prices.",
    color: "bg-emerald-50",
    iconColor: "text-emerald-500",
    gradient: "from-emerald-500/5 to-emerald-500/0",
    borderColor: "hover:border-emerald-300/40",
    action: "link" as const,
  },
  {
    icon: Package,
    title: "Health Packages",
    description: "Choose from comprehensive health checkup packages tailored for every age and lifestyle.",
    color: "bg-rose-50",
    iconColor: "text-rose-500",
    gradient: "from-rose-500/5 to-rose-500/0",
    borderColor: "hover:border-rose-300/40",
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
    const cardWidth = el.querySelector<HTMLDivElement>("[data-card]")?.offsetWidth || 280;
    el.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28 bg-white" id="services">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-teal font-semibold text-sm mb-3 tracking-wider uppercase">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Healthcare Solutions for Everyone
          </h2>
          <p className="text-gray-500 text-lg">
            From finding the right doctor to ordering medicines, we provide
            end-to-end healthcare services tailored to your needs.
          </p>
        </div>

        {/* Desktop: Single row 6 cards | Tablet/Mobile: Horizontal scroll */}
        <div className="relative">
          {/* Scroll Arrows — visible on tablet/mobile only */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-teal hover:shadow-xl transition-all lg:hidden -ml-2"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-teal hover:shadow-xl transition-all lg:hidden -mr-2"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Cards Container */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2 lg:overflow-visible lg:snap-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {services.map((service) => (
              <div
                key={service.title}
                data-card
                onClick={service.action === "booking" ? openModal : undefined}
                className={`
                  group relative flex-shrink-0 w-[260px] sm:w-[280px] lg:w-auto lg:flex-1
                  bg-white/80 backdrop-blur-sm
                  border border-gray-100 ${service.borderColor}
                  rounded-3xl p-7
                  shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]
                  hover:shadow-[0_8px_30px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]
                  hover:-translate-y-2
                  transition-all duration-300 ease-out
                  cursor-pointer snap-start
                  lg:snap-align-none
                `}
              >
                {/* Gradient bg on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <service.icon size={26} className={service.iconColor} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <span
                    className="inline-flex items-center gap-1.5 text-teal font-semibold text-sm group-hover:gap-2.5 transition-all"
                  >
                    {service.action === "booking" ? "Book Now" : "Learn More"} <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile scroll indicator dots */}
          <div className="flex justify-center gap-1.5 mt-5 lg:hidden">
            {services.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar utility */}
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
