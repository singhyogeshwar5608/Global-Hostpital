"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const crossIcons = [
  { top: "12%", right: "18%", size: 20, opacity: 0.08 },
  { bottom: "30%", left: "8%", size: 16, opacity: 0.06 },
  { top: "55%", right: "10%", size: 14, opacity: 0.05 },
  { bottom: "18%", right: "35%", size: 12, opacity: 0.04 },
  { top: "25%", left: "50%", size: 10, opacity: 0.04 },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative bg-white bg-no-repeat aspect-[4/5] lg:aspect-[2.75/1]">

      {/* Mobile Banner */}
      <div className="absolute inset-0 bg-[url('/banner/banner1.png')] bg-cover bg-center lg:hidden" />

      {/* Desktop Banner */}
      <div className="absolute inset-0 bg-[url('/banner/banner.png')] bg-cover bg-center hidden lg:block" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] rounded-full bg-gradient-to-br from-blue-100/50 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[250px] lg:w-[500px] h-[250px] lg:h-[500px] rounded-full bg-gradient-to-tr from-emerald-100/50 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-32 lg:w-64 h-32 lg:h-64 rounded-full bg-blue-50/30 blur-2xl" />
        <div className="absolute bottom-1/3 right-1/4 w-24 lg:w-48 h-24 lg:h-48 rounded-full bg-emerald-50/30 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[800px] h-[400px] lg:h-[800px] rounded-full bg-gradient-to-br from-blue-50/20 via-transparent to-emerald-50/20 blur-3xl" />

        {crossIcons.map((c, i) => (
          <svg
            key={i}
            className="absolute text-blue-600"
            style={{
              top: c.top,
              right: c.right,
              bottom: c.bottom,
              left: c.left,
              opacity: c.opacity,
            }}
            width={c.size}
            height={c.size}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
        ))}

        <div className="absolute top-[15%] right-[22%] w-2 h-2 rounded-full bg-blue-300/30" />
        <div className="absolute top-[35%] right-[28%] w-1.5 h-1.5 rounded-full bg-emerald-300/30" />
        <div className="absolute bottom-[35%] left-[12%] w-2 h-2 rounded-full bg-blue-300/20" />
        <div className="absolute bottom-[20%] left-[22%] w-1.5 h-1.5 rounded-full bg-emerald-300/20" />
      </div>
    </section>
  );
}
