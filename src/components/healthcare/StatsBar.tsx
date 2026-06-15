"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Stethoscope, Building2, FlaskConical, Globe } from "lucide-react";

const stats = [
  { value: 25000, label: "Happy Patients", suffix: "+", icon: Users },
  { value: 248, label: "Expert Doctors", suffix: "+", icon: Stethoscope },
  { value: 150, label: "Partner Hospitals", suffix: "+", icon: Building2 },
  { value: 320, label: "Lab Partners", suffix: "+", icon: FlaskConical },
  { value: 50, label: "Countries Served", suffix: "+", icon: Globe },
];

function AnimatedCount({ target, suffix, started }: { target: number; suffix: string; started: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target]);

  return <>{count.toLocaleString()}{suffix}</>;
}

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8"
      style={{ marginTop: "5px" }}
    >
      <div className="bg-white border border-gray-100 rounded-2xl lg:rounded-3xl shadow-xl shadow-gray-200/50 px-2 py-4 sm:px-4 sm:py-6 lg:px-10 lg:py-8">
        <div className="flex flex-row justify-between items-start gap-1 sm:hidden w-full">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center gap-0.5 flex-1 min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-[11px] font-bold text-gray-900 whitespace-nowrap">
                  <AnimatedCount target={stat.value} suffix={stat.suffix} started={inView} />
                </span>
                <span className="text-[9px] text-gray-500 whitespace-nowrap">{stat.label}</span>
              </motion.div>
            );
          })}
        </div>
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center text-center gap-1.5"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  <AnimatedCount target={stat.value} suffix={stat.suffix} started={inView} />
                </span>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
