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
  { icon: Users, value: 12548, suffix: "+", label: "Happy Patients" },
  { icon: Stethoscope, value: 248, suffix: "+", label: "Expert Doctors" },
  { icon: FlaskConical, value: 320, suffix: "+", label: "Partner Labs" },
  { icon: CalendarCheck, value: 15000, suffix: "+", label: "Appointments" },
  { icon: ThumbsUp, value: 98, suffix: "%", label: "Patient Satisfaction" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    // Start animation immediately on mount (visible in viewport on load)
    // Use a small delay to ensure rendering is complete
    const startDelay = setTimeout(() => {
      hasStarted.current = true;
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic for smooth deceleration
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
    <div className="text-3xl md:text-4xl font-bold text-white">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

export default function Statistics() {
  return (
    <section className="py-8 lg:py-10 gradient-dark-green relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border border-white/30" />
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full border border-white/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-white/10" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
                <stat.icon size={20} className="text-white" />
              </div>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-white/80 text-xs mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
