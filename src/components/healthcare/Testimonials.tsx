"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4",
    rating: 5,
    text: "Global Integrative Clinic has been a game-changer for my family. Booking appointments is incredibly easy, and the doctors are truly exceptional. The video consultation feature saved me hours of travel time. I highly recommend this platform to anyone looking for quality healthcare.",
  },
  {
    name: "Michael Chen",
    location: "San Francisco, USA",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=michael&backgroundColor=c0aede",
    rating: 5,
    text: "I was skeptical about online healthcare at first, but the experience was outstanding. The lab test booking was seamless, and I received my results within 24 hours. The entire process from appointment to prescription was smooth and professional. Truly a world-class service!",
  },
  {
    name: "Emily Williams",
    location: "Chicago, USA",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=emily&backgroundColor=ffd5dc",
    rating: 5,
    text: "The health packages offered here are comprehensive and affordable. I got a full-body checkup done at half the price I would have paid elsewhere. The follow-up consultation with the doctor was very thorough and they took time to explain every detail of my report.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="py-20 lg:py-28 bg-mint-light"
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-teal font-semibold text-sm mb-3 tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-gray-500 text-lg">
            Real stories from real patients who trust us with their healthcare
            journey.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-card relative">
            {/* Quote icon */}
            <div className="absolute -top-5 left-10 w-10 h-10 gradient-teal rounded-xl flex items-center justify-center shadow-premium">
              <Quote size={20} className="text-white" />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-5 pt-2">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-gray-600 text-lg leading-relaxed mb-7 min-h-[80px]">
              &ldquo;{testimonials[current].text}&rdquo;
            </p>

            {/* Patient Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  className="w-12 h-12 rounded-full bg-gray-100"
                />
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonials[current].name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonials[current].location}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal hover:border-teal/30 hover:bg-teal/5 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal hover:border-teal/30 hover:bg-teal/5 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-8 bg-teal" : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
