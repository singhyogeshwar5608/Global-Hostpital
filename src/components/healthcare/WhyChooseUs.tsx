"use client";

import React from "react";
import {
  ShieldCheck,
  Award,
  Lock,
  BadgeDollarSign,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Award, label: "Qualified Doctors", desc: "Board-certified specialists with years of clinical experience" },
  { icon: ShieldCheck, label: "Advanced Facilities", desc: "State-of-the-art medical equipment and modern infrastructure" },
  { icon: Lock, label: "Secure & Confidential", desc: "Your health data is protected with enterprise-grade encryption" },
  { icon: BadgeDollarSign, label: "Affordable Pricing", desc: "Transparent pricing with no hidden costs or surprise bills" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-white" id="why-us">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-premium">
              <img
                src="/doctor-patient.png"
                alt="Doctor with patient"
                className="w-full h-[480px] object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-4 md:right-8 glass rounded-2xl p-4 shadow-premium">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">15,000+</div>
                  <div className="text-gray-500 text-xs">Successful Treatments</div>
                </div>
              </div>
            </div>
            {/* Decorative blob */}
            <div className="absolute -z-10 -top-6 -left-6 w-32 h-32 rounded-full bg-teal/10" />
          </div>

          {/* Right Content */}
          <div className="space-y-7">
            <span className="inline-block text-teal font-semibold text-sm tracking-wider uppercase">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Your Health is Our Mission
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              We are committed to providing exceptional healthcare services with
              a patient-first approach. Our integrated platform combines
              cutting-edge technology with compassionate care to ensure the best
              outcomes for you and your family.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex gap-3.5 p-4 rounded-2xl border border-gray-100 hover:border-teal/20 hover:bg-mint-light/50 transition-all group cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center shrink-0 group-hover:bg-teal/20 transition-colors">
                    <f.icon size={20} className="text-teal" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm mb-0.5">
                      {f.label}
                    </div>
                    <div className="text-gray-500 text-xs leading-relaxed">
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="gradient-teal text-white rounded-2xl px-8 h-12 font-semibold shadow-premium hover:opacity-90 transition-opacity">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
