"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

const fallbackReels = [
  { id: "1", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Patient Success Story" },
  { id: "2", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Expert Doctor Consultation" },
  { id: "3", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Advanced Lab Services" },
  { id: "4", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Medicine Delivery" },
  { id: "5", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Patient Testimonial" },
  { id: "6", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Surgery Recovery Journey" },
  { id: "7", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Maternity Care" },
  { id: "8", url: "https://www.youtube.com/embed/5qap5aO4i9A", title: "Wellness Program" },
];

export default function VideoReelsSection() {
  const sectionRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="py-0 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
            Hear From Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              Patients
            </span>
          </h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Real stories from real patients about their healthcare journey
          </p>
        </motion.div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm items-center justify-center hover:border-blue-200 hover:bg-blue-50 transition-all shadow-md"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm items-center justify-center hover:border-blue-200 hover:bg-blue-50 transition-all shadow-md"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`div::-webkit-scrollbar { display: none }`}</style>
          {fallbackReels.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="snap-start shrink-0 w-[260px] sm:w-[300px]"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-900 aspect-[9/16] group">
                <iframe
                  src={reel.url}
                  title={reel.title}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-semibold text-sm drop-shadow-lg">{reel.title}</h4>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
