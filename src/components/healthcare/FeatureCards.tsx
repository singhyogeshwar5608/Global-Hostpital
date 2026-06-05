"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const cards = [
  {
    image: "/top-doctors.png",
    title: "Top Doctors",
    description:
      "Access a network of highly qualified and experienced doctors across 50+ specialties. Read verified patient reviews and choose the best healthcare provider for your needs.",
    btn: "Find Doctors",
  },
  {
    image: "/health-packages.png",
    title: "Health Packages",
    description:
      "Comprehensive health checkup packages designed for all ages and lifestyles. Get preventive screenings and full-body diagnostics at affordable rates with home sample collection.",
    btn: "View Packages",
  },
  {
    image: "/order-medicines.png",
    title: "Order Medicines",
    description:
      "Order genuine prescription and OTC medicines online. Enjoy fast doorstep delivery, attractive discounts, and automatic refill reminders for your regular medications.",
    btn: "Order Now",
  },
  {
    image: "/partner-labs.png",
    title: "Partner Labs",
    description:
      "Get tested at 320+ NABL-accredited labs near you. Book lab tests online, enjoy home sample collection, and receive accurate digital reports within 24 hours.",
    btn: "Book Lab Test",
  },
];

export default function FeatureCards() {
  return (
    <section className="py-20 lg:py-28 bg-mint-light" id="features">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-teal font-semibold text-sm mb-3 tracking-wider uppercase">
            Featured
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Key Services
          </h2>
          <p className="text-gray-500 text-lg">
            Everything you need for a healthier life, all in one place.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {card.description}
                </p>
                <Button className="gradient-teal text-white rounded-xl px-6 h-10 font-semibold hover:opacity-90 transition-opacity group/btn">
                  {card.btn}
                  <ArrowRight size={16} className="ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
