"use client";

import React from "react";
import {
  UserSearch,
  CalendarPlus,
  Video,
  FlaskConical,
  Pill,
  Package,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: UserSearch,
    title: "Find Doctors",
    description: "Search from 248+ specialist doctors across various medical fields with verified reviews.",
    color: "bg-teal/10",
    iconColor: "text-teal",
  },
  {
    icon: CalendarPlus,
    title: "Book Appointment",
    description: "Schedule in-person or online appointments instantly with your preferred healthcare provider.",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    icon: Video,
    title: "Video Consultation",
    description: "Connect with certified doctors from the comfort of your home through secure video calls.",
    color: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    icon: FlaskConical,
    title: "Lab Tests",
    description: "Book lab tests online and get accurate results from 320+ NABL-accredited partner labs.",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: Pill,
    title: "Medicines",
    description: "Order genuine medicines online and get them delivered to your doorstep at the best prices.",
    color: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    icon: Package,
    title: "Health Packages",
    description: "Choose from comprehensive health checkup packages tailored for every age and lifestyle.",
    color: "bg-rose-50",
    iconColor: "text-rose-500",
  },
];

export default function Services() {
  return (
    <section className="py-20 lg:py-28 bg-white" id="services">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-teal font-semibold text-sm mb-3 tracking-wider uppercase">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Healthcare Solutions for Everyone
          </h2>
          <p className="text-gray-500 text-lg">
            From finding the right doctor to ordering medicines, we provide
            end-to-end healthcare services tailored to your needs.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <service.icon size={26} className={service.iconColor} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 text-teal font-semibold text-sm group-hover:gap-2.5 transition-all"
              >
                Learn More <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
