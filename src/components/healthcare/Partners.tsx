"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const partners = [
  { name: "LabCorp", color: "#1a73e8" },
  { name: "Quest Diagnostics", color: "#34a853" },
  { name: "Bio-Rad", color: "#cc0000" },
  { name: "Thermo Fisher", color: "#0033a0" },
  { name: "Mayo Clinic", color: "#005ca9" },
  { name: "Sonic Healthcare", color: "#6b21a8" },
  { name: "LabCorp", color: "#1a73e8" },
  { name: "Quest Diagnostics", color: "#34a853" },
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
    <section className="py-14 lg:py-16 bg-white border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block text-teal font-semibold text-[11px] mb-2 tracking-widest uppercase">
            Trusted Partners
          </span>
          <h2 className="text-2xl font-bold text-gray-900">
            Our Partners
          </h2>
        </div>

        {/* Logo Row with Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal hover:border-teal/30 hover:shadow-md transition-all shadow-sm -ml-1"
            style={{ display: canScrollLeft ? "flex" : "none" }}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal hover:border-teal/30 hover:shadow-md transition-all shadow-sm -mr-1"
            style={{ display: canScrollRight ? "flex" : "none" }}
          >
            <ChevronRight size={16} />
          </button>

          {/* Logos Scrollable Row */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-1 px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {partners.map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex-shrink-0 w-36 h-16 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-teal/20 hover:shadow-md transition-all cursor-pointer group"
              >
                <span
                  className="text-sm font-bold tracking-wide opacity-30 group-hover:opacity-70 transition-opacity"
                  style={{ color: partner.color }}
                >
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
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
