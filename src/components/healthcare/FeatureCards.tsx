"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { usePageContext } from "@/App";

const cards = [
  {
    image: "/top-doctors.png",
    title: "Top Doctors",
    description: "Expert doctors across 50+ specialties.",
    btn: "Find Doctors",
    borderColor: "hover:border-teal/25",
    ctaBg: "bg-teal/10 group-hover:bg-teal",
    ctaColor: "text-teal group-hover:text-white",
    isBooking: true,
  },
  {
    image: "/health-packages.png",
    title: "Health Packages",
    description: "Full-body checkups at affordable rates.",
    btn: "View Packages",
    borderColor: "hover:border-rose-300/30",
    ctaBg: "bg-rose-50 group-hover:bg-rose-500",
    ctaColor: "text-rose-500 group-hover:text-white",
    isBooking: false,
  },
  {
    image: "/order-medicines.png",
    title: "Order Medicines",
    description: "Fast delivery with best discounts.",
    btn: "Order Now",
    borderColor: "hover:border-emerald-300/30",
    ctaBg: "bg-emerald-50 group-hover:bg-emerald-500",
    ctaColor: "text-emerald-500 group-hover:text-white",
    isBooking: false,
  },
  {
    image: "/partner-labs.png",
    title: "Partner Labs",
    description: "320+ NABL-accredited labs near you.",
    btn: "Book Lab Test",
    borderColor: "hover:border-orange-300/30",
    ctaBg: "bg-orange-50 group-hover:bg-orange-500",
    ctaColor: "text-orange-500 group-hover:text-white",
    isBooking: true,
  },
];

export default function FeatureCards() {
  const { setShowRegistrationPage } = usePageContext();
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
    const cardWidth = el.querySelector<HTMLDivElement>("[data-card]")?.offsetWidth || 260;
    el.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="py-0 bg-mint-light"
      id="features"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="inline-block text-teal font-semibold text-[11px] sm:text-sm mb-2 sm:mb-3 tracking-wider uppercase">
            Featured
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Explore Our Key Services
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Everything you need for a healthier life, all in one place.
          </p>
        </div>

        {/* Cards */}
        <div className="relative">
          {/* Scroll Arrows — tablet/mobile */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-teal hover:shadow-xl transition-all lg:hidden -ml-1"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-teal hover:shadow-xl transition-all lg:hidden -mr-1"
            >
              <ChevronRight size={16} />
            </button>
          )}

          {/* Cards Row */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 lg:overflow-visible"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {cards.map((card) => (
              <div
                key={card.title}
                data-card
                onClick={card.isBooking ? () => setShowRegistrationPage(true) : undefined}
                className={`
                  group flex-shrink-0 w-[220px] sm:w-[240px] lg:w-auto lg:flex-1
                  bg-white border border-gray-100 ${card.borderColor}
                  rounded-xl sm:rounded-2xl overflow-hidden
                  shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)]
                  hover:shadow-[0_8px_25px_rgba(0,0,0,0.07),0_2px_6px_rgba(0,0,0,0.03)]
                  hover:-translate-y-1.5
                  transition-all duration-300 ease-out
                  cursor-pointer snap-start
                  flex flex-col
                `}
              >
                {/* Image */}
                <div className="h-24 sm:h-32 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 pt-3 sm:pt-4 flex flex-col items-center text-center flex-1">
                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 leading-tight">
                    {card.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed mb-2 sm:mb-3 flex-1">
                    {card.description}
                  </p>

                  {/* CTA Button */}
                  <span
                    className={`inline-flex items-center gap-1 ${card.ctaBg} ${card.ctaColor} text-[10px] sm:text-xs font-semibold px-3 py-1.5 sm:px-3.5 rounded-lg transition-all duration-300`}
                  >
                    {card.btn}
                    <ArrowRight size={10} className="sm:hidden" />
                    <ArrowRight size={12} className="hidden sm:block" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile dots */}
          <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
            {cards.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.section>
  );
}
