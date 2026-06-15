"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const staggerItem = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
});

const words1 = "Your Health, Our Priority".split(" ");
const words2 = "Access world-class healthcare anytime, anywhere. Book appointments, consult doctors online, order medicines, book lab tests, and manage your health from one platform.".split(" ");

const cardImages = [
  "https://cdn.prod.website-files.com/6929c116366a14507fc8424d/69a5007e9793bec9aef0bae6_card.avif",
  "https://cdn.prod.website-files.com/6929c116366a14507fc8424d/69a5007db9ab99a268357410_card-3.avif",
  "https://cdn.prod.website-files.com/6929c116366a14507fc8424d/69a5007d21f950db130e28c9_card-6.avif",
  "https://cdn.prod.website-files.com/6929c116366a14507fc8424d/69a5007eb87553c5aa32934f_card-1.avif",
  "https://cdn.prod.website-files.com/6929c116366a14507fc8424d/69a5007e27ef20e6e3edd02e_card-4.avif",
  "https://cdn.prod.website-files.com/6929c116366a14507fc8424d/69a5007e9468539ba66cdd61_card-7.avif",
  "https://cdn.prod.website-files.com/6929c116366a14507fc8424d/69a5007dd38878bbefc784aa_card-8.avif",
  "https://cdn.prod.website-files.com/6929c116366a14507fc8424d/69a5007d920bdd6882dc8eb7_card-2.avif",
  "https://cdn.prod.website-files.com/6929c116366a14507fc8424d/69a5007d1354bb8698409c38_card-5.avif",
];

export default function HeroShowcase() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-900 py-20 lg:py-28">
      {/* Background Image */}
      <img
        src="https://cdn.prod.website-files.com/6929c116366a14507fc8424d/6929d3408e9ff6a515b9eee8_ai-hero%20(1).avif"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-4xl">
            {words1.map((word, i) => (
              <motion.span
                key={i}
                {...staggerItem(i)}
                className="inline-block mr-2"
              >
                {i === 2 ? (
                  <span className="bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>

          {/* Spacer */}
          <div className="h-6 sm:h-8" />

          {/* Subheading */}
          <motion.p
            {...staggerItem(5)}
            className="text-base sm:text-lg md:text-xl text-blue-100/80 max-w-2xl leading-relaxed"
          >
            {words2.map((word, i) => (
              <motion.span
                key={i}
                {...staggerItem(5 + i * 0.02)}
                className="inline-block mr-1"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          {/* Spacer */}
          <div className="h-10 sm:h-14" />

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button className="bg-white text-blue-900 hover:bg-blue-50 rounded-2xl px-8 h-12 text-sm font-semibold shadow-lg transition-all">
              View Demo
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 rounded-2xl px-8 h-12 text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all group">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Spacer */}
          <div className="h-16 sm:h-20" />

          {/* 3D Card Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1, duration: 0.7 }}
            className="relative w-full max-w-[600px] mx-auto"
          >
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                {[0, 1, 2].map((groupIdx) => (
                  <motion.div
                    key={groupIdx}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${-104 + groupIdx * 15}deg)` }}
                    animate={{ rotate: [-104 + groupIdx * 15, -104 + groupIdx * 15 + 360] }}
                    transition={{ duration: 20 + groupIdx * 5, repeat: Infinity, ease: "linear" }}
                  >
                    {cardImages.slice(groupIdx * 3, groupIdx * 3 + 3).map((src, j) => (
                      <div
                        key={j}
                        className="absolute w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden shadow-xl border border-white/10"
                        style={{
                          transform: `rotate(${j * 120}deg) translateX(${80 + groupIdx * 10}px)`,
                        }}
                      >
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Spacer */}
          <div className="h-12 sm:h-16" />

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-blue-100/70 text-sm font-medium">
              Rated 4.9/5 by 4,900+ patients
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
