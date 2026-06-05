"use client";

import React from "react";
import {
  Stethoscope,
  ShieldCheck,
  Headphones,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppointmentStore } from "@/store/appointment-store";

const features = [
  { icon: Stethoscope, label: "Expert Doctors" },
  { icon: ShieldCheck, label: "Secure & Private" },
  { icon: Headphones, label: "24/7 Support" },
  { icon: CalendarCheck, label: "Easy Booking" },
];

export default function Hero() {
  const { openModal } = useAppointmentStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-mint-light to-mint">
      <div className="max-w-[1440px] mx-auto px-6 pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-teal/20 rounded-full px-4 py-1.5 text-teal font-semibold text-sm shadow-sm">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              Your Health, Our Priority
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-tight text-gray-900">
              Comprehensive Care for a{" "}
              <span className="text-gradient-teal">Better Life</span>
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
              Consult top doctors, book appointments, order medicines, take lab
              tests and manage your health from one platform.
            </p>

            {/* Feature Icons */}
            <div className="flex flex-wrap gap-5">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center">
                    <f.icon size={18} className="text-teal" />
                  </div>
                  <span className="font-medium">{f.label}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                onClick={openModal}
                className="gradient-teal text-white rounded-2xl px-8 h-12 text-base font-semibold shadow-premium hover:opacity-90 transition-all"
              >
                Book Appointment
              </Button>
              <Button
                onClick={openModal}
                variant="outline"
                className="rounded-2xl px-8 h-12 text-base font-semibold border-teal/30 text-teal hover:bg-teal/5"
              >
                Consult Online
              </Button>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-premium">
              <img
                src="/hero-family.png"
                alt="Healthcare family"
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/20 to-transparent" />
            </div>

            {/* Floating Appointment Card - Now clickable */}
            <div
              className="absolute -left-8 bottom-12 glass rounded-2xl p-5 shadow-premium w-[300px] cursor-pointer hover:shadow-card-hover transition-all group"
              onClick={openModal}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-base">
                  Book Appointment
                </h3>
                <CalendarCheck size={18} className="text-teal group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-2.5">
                <div className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm text-gray-400 bg-white flex items-center">
                  Select Specialty
                </div>
                <div className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm text-gray-400 bg-white flex items-center">
                  Select Doctor
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm text-gray-400 bg-white flex items-center">
                    Select Date
                  </div>
                  <div className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm text-gray-400 bg-white flex items-center">
                    Select Time
                  </div>
                </div>
                <Button className="w-full gradient-teal text-white rounded-xl h-10 font-semibold mt-1 hover:opacity-90 transition-opacity">
                  Find Available Slots
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-teal/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-teal/5 blur-3xl" />
    </section>
  );
}
