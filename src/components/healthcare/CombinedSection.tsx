"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Award,
  Lock,
  BadgeDollarSign,
  Star,
  ChevronLeft,
  ChevronRight,
  Phone,
  CheckCircle,
} from "lucide-react";

const whyFeatures = [
  { icon: Award, label: "Qualified & Experienced Doctors", desc: "Board-certified specialists with years of clinical experience" },
  { icon: ShieldCheck, label: "Advanced Technology & Facilities", desc: "State-of-the-art medical equipment and modern infrastructure" },
  { icon: Lock, label: "Secure & Confidential", desc: "Your health data is protected with enterprise-grade encryption" },
  { icon: BadgeDollarSign, label: "Affordable & Transparent Pricing", desc: "Transparent pricing with no hidden costs or surprise bills" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4",
    rating: 5,
    text: "Global Integrative Clinic has made healthcare so accessible and convenient. Highly recommended!",
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

  const nextTestimonial = () => setCurrentTestimonial((p) => (p + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 lg:py-20 bg-gray-50" id="why-us">
      <div className="max-w-[1320px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ═══════════ COLUMN 1: Why Choose Us ═══════════ */}
          <div className="bg-white rounded-2xl p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300">
            <span className="text-teal font-semibold text-[11px] tracking-widest uppercase">
              Why Choose Us
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-1.5 mb-5 leading-snug">
              Your Health is Our Mission
            </h3>

            <div className="space-y-4">
              {whyFeatures.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex gap-3 items-start group cursor-default">
                    <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-teal/20 transition-colors">
                      <CheckCircle size={14} className="text-teal" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm leading-tight">
                        {f.label}
                      </div>
                      <div className="text-gray-400 text-xs leading-relaxed mt-0.5">
                        {f.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══════════ COLUMN 2: Testimonials ═══════════ */}
          <div className="bg-white rounded-2xl p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300">
            <span className="text-teal font-semibold text-[11px] tracking-widest uppercase">
              Testimonials
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-1.5 mb-5 leading-snug">
              What Our Patients Say
            </h3>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-gray-600 text-sm leading-relaxed mb-5 min-h-[60px]">
              &ldquo;{testimonials[currentTestimonial].text}&rdquo;
            </p>

            {/* Patient Info */}
            <div className="flex items-center gap-3 mb-5">
              <img
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-10 h-10 rounded-full bg-gray-100"
              />
              <div>
                <div className="font-bold text-gray-900 text-sm">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-400 text-xs">
                  {testimonials[currentTestimonial].location}
                </div>
              </div>
            </div>

            {/* Navigation Arrows + Dots */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentTestimonial ? "w-5 bg-teal" : "w-1.5 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal hover:border-teal/30 hover:bg-teal/5 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal hover:border-teal/30 hover:bg-teal/5 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* ═══════════ COLUMN 3: 24/7 Emergency Support ═══════════ */}
          <div className="bg-gradient-to-br from-[#0a6b5f] via-[#0a8a7a] to-[#065a50] rounded-2xl p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-shadow duration-300 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />

            <div className="relative z-10">
              <span className="text-white/50 font-semibold text-[11px] tracking-widest uppercase">
                Emergency
              </span>
              <div className="mt-1.5 mb-1">
                <span className="text-white text-4xl font-extrabold leading-none">24/7</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug mb-2">
                Emergency Support
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                We are always here for you
              </p>

              {/* Phone Number */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <Phone size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-base">1-234-567-890</div>
                  <div className="text-white/50 text-xs">Emergency Hotline</div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2.5">
                <button className="w-full bg-white text-teal-dark rounded-xl h-10 font-bold text-sm hover:bg-white/90 shadow-lg transition-colors flex items-center justify-center gap-2">
                  <Phone size={15} />
                  Call Now
                </button>
                <button className="w-full border border-white/30 text-white rounded-xl h-10 font-semibold text-sm hover:bg-white/10 transition-colors">
                  Request Ambulance
                </button>
              </div>

              {/* Heartbeat / ECG Line */}
              <div className="mt-5">
                <svg viewBox="0 0 300 40" className="w-full h-8" preserveAspectRatio="none">
                  <path
                    d="M0,20 L60,20 L70,20 L80,5 L90,35 L100,10 L110,30 L120,20 L140,20 L150,20 L160,5 L170,35 L180,10 L190,30 L200,20 L220,20 L230,20 L240,5 L250,35 L260,10 L270,30 L280,20 L300,20"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0,20 L60,20 L70,20 L80,5 L90,35 L100,10 L110,30 L120,20 L140,20"
                    fill="none"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <animate
                      attributeName="d"
                      values="M0,20 L60,20 L70,20 L80,5 L90,35 L100,10 L110,30 L120,20 L140,20;M60,20 L120,20 L130,20 L140,5 L150,35 L160,10 L170,30 L180,20 L200,20;M120,20 L180,20 L190,20 L200,5 L210,35 L220,10 L230,30 L240,20 L260,20;M0,20 L60,20 L70,20 L80,5 L90,35 L100,10 L110,30 L120,20 L140,20"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
