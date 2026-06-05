"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const partners = [
  { name: "LabCorp", color: "#1a73e8" },
  { name: "Quest Diagnostics", color: "#34a853" },
  { name: "Bio-Rad", color: "#cc0000" },
  { name: "ThermoFisher Scientific", color: "#0033a0" },
  { name: "Mayo Clinic", color: "#005ca9" },
  { name: "Sonic Healthcare", color: "#6b21a8" },
];

export default function Partners() {
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
    const cardWidth = 160;
    el.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header - Left Aligned */}
        <div className="mb-4 sm:mb-6">
          <span className="inline-block text-teal font-semibold text-[10px] sm:text-[11px] tracking-widest uppercase">
            Trusted Partners
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
            Our Partners
          </h2>
        </div>

        {/* Logo Row with Arrows */}
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-teal hover:border-teal/30 hover:shadow-md transition-all mr-2 sm:mr-3"
            style={{ display: canScrollLeft ? "flex" : "none" }}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Logos Scrollable Row */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-5 overflow-x-auto scroll-smooth flex-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {partners.map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex-shrink-0 w-32 sm:w-44 h-16 sm:h-20 bg-white flex items-center justify-center cursor-pointer"
              >
                <span
                  className="text-xs sm:text-sm font-medium tracking-wide text-center leading-tight"
                  style={{ color: partner.color }}
                >
                  {partner.name}
                </span>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-teal hover:border-teal/30 hover:shadow-md transition-all ml-2 sm:ml-3"
            style={{ display: canScrollRight ? "flex" : "none" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
