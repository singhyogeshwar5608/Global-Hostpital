"use client";

import React, { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Stethoscope, Package, Pill, FlaskConical } from "lucide-react";
import { useAppointmentStore } from "@/store/appointment-store";

const cards = [
  {
    icon: Stethoscope,
    title: "Top Doctors",
    description: "Expert doctors across 50+ specialties.",
    btn: "Find Doctors",
    color: "bg-teal/10",
    iconColor: "text-teal",
    borderColor: "hover:border-teal/25",
    ctaBg: "bg-teal/10 group-hover:bg-teal",
    ctaColor: "text-teal group-hover:text-white",
    isBooking: true,
  },
  {
    icon: Package,
    title: "Health Packages",
    description: "Full-body checkups at affordable rates.",
    btn: "View Packages",
    color: "bg-rose-50",
    iconColor: "text-rose-500",
    borderColor: "hover:border-rose-300/30",
    ctaBg: "bg-rose-50 group-hover:bg-rose-500",
    ctaColor: "text-rose-500 group-hover:text-white",
    isBooking: false,
  },
  {
    icon: Pill,
    title: "Order Medicines",
    description: "Fast delivery with best discounts.",
    btn: "Order Now",
    color: "bg-emerald-50",
    iconColor: "text-emerald-500",
    borderColor: "hover:border-emerald-300/30",
    ctaBg: "bg-emerald-50 group-hover:bg-emerald-500",
    ctaColor: "text-emerald-500 group-hover:text-white",
    isBooking: false,
  },
  {
    icon: FlaskConical,
    title: "Partner Labs",
    description: "320+ NABL-accredited labs near you.",
    btn: "Book Lab Test",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
    borderColor: "hover:border-orange-300/30",
    ctaBg: "bg-orange-50 group-hover:bg-orange-500",
    ctaColor: "text-orange-500 group-hover:text-white",
    isBooking: true,
  },
];

export default function FeatureCards() {
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
    const cardWidth = el.querySelector<HTMLDivElement>("[data-card]")?.offsetWidth || 240;
    el.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28 bg-mint-light" id="features">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-teal font-semibold text-sm mb-3 tracking-wider uppercase">
            Featured
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Key Services
          </h2>
          <p className="text-gray-500 text-base">
            Everything you need for a healthier life, all in one place.
          </p>
        </div>

        {/* Cards */}
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
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  data-card
                  onClick={card.isBooking ? openModal : undefined}
                  className={`
                    group flex-shrink-0 w-[220px] sm:w-[240px] lg:w-auto lg:flex-1
                    bg-white border border-gray-100 ${card.borderColor}
                    rounded-2xl p-6 pt-7 pb-5
                    shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)]
                    hover:shadow-[0_8px_25px_rgba(0,0,0,0.07),0_2px_6px_rgba(0,0,0,0.03)]
                    hover:-translate-y-1.5
                    transition-all duration-300 ease-out
                    cursor-pointer snap-start
                    flex flex-col items-center text-center
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={22} className={card.iconColor} />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5 leading-tight">
                    {card.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">
                    {card.description}
                  </p>

                  {/* CTA Button */}
                  <span
                    className={`inline-flex items-center gap-1 ${card.ctaBg} ${card.ctaColor} text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-300`}
                  >
                    {card.btn}
                    <ArrowRight size={12} />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile dots */}
          <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
            {cards.map((_, i) => (
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
