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
  { icon: Users, value: 12548, suffix: "+", label: "Happy Patients", color: "#5eead4", iconBg: "rgba(255,255,255,0.15)" },
  { icon: Stethoscope, value: 248, suffix: "+", label: "Expert Doctors", color: "#c4b5fd", iconBg: "rgba(255,255,255,0.15)" },
  { icon: FlaskConical, value: 320, suffix: "+", label: "Partner Labs", color: "#fdba74", iconBg: "rgba(255,255,255,0.15)" },
  { icon: CalendarCheck, value: 15000, suffix: "+", label: "Appointments", color: "#93c5fd", iconBg: "rgba(255,255,255,0.15)" },
  { icon: ThumbsUp, value: 98, suffix: "%", label: "Satisfaction", color: "#fda4af", iconBg: "rgba(255,255,255,0.15)" },
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
    <div className="text-xl sm:text-2xl md:text-3xl font-extrabold" style={{ color }}>
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

export default function Statistics() {
  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-gradient-to-r from-[#065a50] via-[#0a7a6a] to-[#065a50]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center bg-white/10 backdrop-blur-sm hover:-translate-y-1 hover:bg-white/15 hover:shadow-lg transition-all duration-300 cursor-default"
              >
                <div
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3"
                  style={{ backgroundColor: stat.iconBg }}
                >
                  <Icon size={18} className="sm:hidden" style={{ color: stat.color }} />
                  <Icon size={22} className="hidden sm:block" style={{ color: stat.color }} />
                </div>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} color={stat.color} />
                <p className="text-white/70 text-[10px] sm:text-xs mt-1 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
