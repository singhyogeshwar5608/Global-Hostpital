"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Ambulance } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmergencySupport() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="py-20 lg:py-28 bg-white"
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="gradient-dark-green rounded-3xl overflow-hidden relative">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 p-10 md:p-16">
            {/* Text Content */}
            <div className="flex-1 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Ambulance size={32} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                24/7 Emergency Support
              </h2>
              <p className="text-white/80 text-lg leading-relaxed max-w-lg">
                Our emergency medical team is available around the clock. Whether
                it&apos;s a medical emergency or urgent consultation, we&apos;re
                just a call away. Don&apos;t hesitate to reach out when you need
                us most.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button className="bg-white text-teal-dark rounded-2xl px-8 h-12 font-bold text-base hover:bg-white/90 shadow-lg">
                  <Phone size={18} className="mr-2" />
                  +1 (800) 123-4567
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white rounded-2xl px-8 h-12 font-semibold hover:bg-white/10"
                >
                  Request Ambulance
                </Button>
              </div>
            </div>

            {/* Illustration */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <Phone size={48} className="text-white mx-auto mb-2" />
                    <div className="text-white font-bold text-lg">24/7</div>
                    <div className="text-white/70 text-xs">Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
