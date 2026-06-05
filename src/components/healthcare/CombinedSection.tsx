"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  Award,
  Lock,
  BadgeDollarSign,
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Phone,
  Ambulance,
} from "lucide-react";

const whyFeatures = [
  { icon: Award, label: "Qualified Doctors", desc: "Board-certified specialists" },
  { icon: ShieldCheck, label: "Advanced Facilities", desc: "State-of-the-art equipment" },
  { icon: Lock, label: "Secure & Confidential", desc: "Enterprise-grade encryption" },
  { icon: BadgeDollarSign, label: "Affordable Pricing", desc: "No hidden costs or bills" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4",
    rating: 5,
    text: "Global Integrative Clinic has been a game-changer for my family. Booking appointments is incredibly easy, and the doctors are truly exceptional.",
  },
  {
    name: "Michael Chen",
    location: "San Francisco, USA",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=michael&backgroundColor=c0aede",
    rating: 5,
    text: "I was skeptical about online healthcare at first, but the experience was outstanding. The lab test booking was seamless and results came within 24 hours.",
  },
  {
    name: "Emily Williams",
    location: "Chicago, USA",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=emily&backgroundColor=ffd5dc",
    rating: 5,
    text: "The health packages are comprehensive and affordable. I got a full-body checkup at half the price. The follow-up consultation was very thorough.",
  },
];

export default function CombinedSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
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
    const cardWidth = el.querySelector<HTMLDivElement>("[data-card]")?.offsetWidth || 380;
    el.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  const nextTestimonial = () => setCurrentTestimonial((p) => (p + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 lg:py-28 bg-white" id="why-us">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-teal font-semibold text-sm mb-3 tracking-wider uppercase">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Health is Our Mission
          </h2>
          <p className="text-gray-500 text-base">
            Trusted by thousands of patients for exceptional healthcare, real experiences, and round-the-clock emergency support.
          </p>
        </div>

        {/* 3 Cards Horizontal */}
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

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 lg:overflow-visible"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* ═══════════ CARD 1: Why Choose Us ═══════════ */}
            <div
              data-card
              className="flex-shrink-0 w-[340px] sm:w-[380px] lg:w-auto lg:flex-1 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.07),0_2px_6px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300 snap-start"
            >
              {/* Image */}
              <div className="h-40 overflow-hidden relative">
                <img
                  src="/doctor-patient.png"
                  alt="Doctor with patient"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-3 left-4 glass rounded-xl px-3 py-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg gradient-teal flex items-center justify-center">
                    <Award size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">15,000+</div>
                    <div className="text-white/70 text-[9px]">Treatments</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="text-teal font-semibold text-[10px] tracking-wider uppercase">Why Choose Us</span>
                <h3 className="text-base font-bold text-gray-900 mb-3 mt-1">Your Health is Our Mission</h3>

                <div className="grid grid-cols-2 gap-2.5">
                  {whyFeatures.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.label} className="flex gap-2 p-2.5 rounded-xl border border-gray-50 hover:border-teal/15 hover:bg-teal/5 transition-all group cursor-default">
                        <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 group-hover:bg-teal/20 transition-colors">
                          <Icon size={14} className="text-teal" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 text-[11px] leading-tight">{f.label}</div>
                          <div className="text-gray-400 text-[9px] leading-snug mt-0.5">{f.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ═══════════ CARD 2: Testimonials ═══════════ */}
            <div
              data-card
              className="flex-shrink-0 w-[340px] sm:w-[380px] lg:w-auto lg:flex-1 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.07),0_2px_6px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300 snap-start"
            >
              {/* Header image strip */}
              <div className="h-40 overflow-hidden relative">
                <img
                  src="https://api.dicebear.com/9.x/avataaars/svg?seed=clinic-team&backgroundColor=b6e3f4"
                  alt="Happy patients"
                  className="w-full h-full object-cover bg-teal/5"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-3 left-4 glass rounded-xl px-3 py-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center">
                    <Star size={14} className="text-white fill-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">4.9/5</div>
                    <div className="text-white/70 text-[9px]">Patient Rating</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="text-teal font-semibold text-[10px] tracking-wider uppercase">Testimonials</span>
                <h3 className="text-base font-bold text-gray-900 mb-3 mt-1">What Our Patients Say</h3>

                {/* Quote card */}
                <div className="bg-gray-50 rounded-xl p-4 relative">
                  <Quote size={16} className="text-teal/30 absolute top-3 left-3" />
                  <div className="pt-3">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                        <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>

                    <p className="text-gray-600 text-xs leading-relaxed mb-3">
                      &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={testimonials[currentTestimonial].image}
                          alt={testimonials[currentTestimonial].name}
                          className="w-8 h-8 rounded-full bg-gray-200"
                        />
                        <div>
                          <div className="font-bold text-gray-900 text-[11px]">{testimonials[currentTestimonial].name}</div>
                          <div className="text-gray-400 text-[9px]">{testimonials[currentTestimonial].location}</div>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button onClick={prevTestimonial} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal hover:border-teal/30 hover:bg-teal/5 transition-colors">
                          <ChevronLeft size={12} />
                        </button>
                        <button onClick={nextTestimonial} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal hover:border-teal/30 hover:bg-teal/5 transition-colors">
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-1.5 mt-3">
                      {testimonials.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentTestimonial(i)}
                          className={`h-1.5 rounded-full transition-all ${i === currentTestimonial ? "w-5 bg-teal" : "w-1.5 bg-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════ CARD 3: 24/7 Emergency Support ═══════════ */}
            <div
              data-card
              className="flex-shrink-0 w-[340px] sm:w-[380px] lg:w-auto lg:flex-1 bg-gradient-to-br from-[#0a6b5f] via-[#0a8a7a] to-[#065a50] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 snap-start relative"
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />

              {/* Header area with illustration */}
              <div className="h-40 flex items-center justify-center relative">
                <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                    <div className="text-center">
                      <Ambulance size={32} className="text-white mx-auto mb-1" />
                      <div className="text-white font-bold text-sm">24/7</div>
                      <div className="text-white/70 text-[9px]">Available</div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-3 left-4 glass rounded-xl px-3 py-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-400 flex items-center justify-center">
                    <Phone size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">Emergency</div>
                    <div className="text-white/70 text-[9px]">Always Ready</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 relative z-10">
                <span className="text-white/60 font-semibold text-[10px] tracking-wider uppercase">Emergency</span>
                <h3 className="text-base font-bold text-white mb-3 mt-1">24/7 Emergency Support</h3>

                <p className="text-white/70 text-xs leading-relaxed mb-4">
                  Our emergency medical team is available around the clock. Whether it&apos;s a medical emergency or urgent consultation, we&apos;re just a call away.
                </p>

                <div className="flex flex-col gap-2">
                  <button className="w-full bg-white text-teal-dark rounded-xl h-10 font-bold text-sm hover:bg-white/90 shadow-lg transition-colors flex items-center justify-center gap-2">
                    <Phone size={16} />
                    +1 (800) 123-4567
                  </button>
                  <button className="w-full border border-white/30 text-white rounded-xl h-10 font-semibold text-sm hover:bg-white/10 transition-colors">
                    Request Ambulance
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile dots */}
          <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
            {[0, 1, 2].map((i) => (
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
