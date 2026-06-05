"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Users,
  Stethoscope,
  FlaskConical,
  CalendarCheck,
  ThumbsUp,
} from "lucide-react";

const stats = [
  { icon: Users, value: 12548, suffix: "+", label: "Happy Patients", color: "#0d9488", bg: "#f0fdfa", iconBg: "#ccfbf1" },
  { icon: Stethoscope, value: 248, suffix: "+", label: "Expert Doctors", color: "#7c3aed", bg: "#f5f3ff", iconBg: "#ede9fe" },
  { icon: FlaskConical, value: 320, suffix: "+", label: "Partner Labs", color: "#ea580c", bg: "#fff7ed", iconBg: "#ffedd5" },
  { icon: CalendarCheck, value: 15000, suffix: "+", label: "Appointments", color: "#2563eb", bg: "#eff6ff", iconBg: "#dbeafe" },
  { icon: ThumbsUp, value: 98, suffix: "%", label: "Patient Satisfaction", color: "#e11d48", bg: "#fff1f2", iconBg: "#fce7f3" },
];

function AnimatedCounter({ target, suffix, color }: { target: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      requestAnimationFrame(animate);
    }, 300);

    return () => clearTimeout(startDelay);
  }, [target]);

  return (
    <div className="text-2xl md:text-3xl font-extrabold" style={{ color }}>
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

export default function Statistics() {
  return (
    <section className="py-10 lg:py-12 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl p-5 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-default"
                style={{ backgroundColor: stat.bg }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: stat.iconBg }}
                >
                  <Icon size={22} style={{ color: stat.color }} />
                </div>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} color={stat.color} />
                <p className="text-gray-500 text-xs mt-1.5 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
