"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Star,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { doctors as appointmentDoctors } from "@/store/appointment-store";
import { useDoctorStore } from "@/store/doctor-store";
import { usePageContext } from "@/App";

export default function DoctorsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { setShowRegistrationPage } = usePageContext();
  const adminDoctors = useDoctorStore((s) => s.doctors);

  const displayDoctors = useMemo(() => {
    const adminMap = new Map(adminDoctors.map((d) => [d.name.toLowerCase(), d]));

    const merged = appointmentDoctors.map((doc) => {
      const admin = adminMap.get(doc.name.toLowerCase());
      return {
        ...doc,
        image: admin?.photo || doc.image,
      };
    });

    const existingNames = new Set(appointmentDoctors.map((d) => d.name.toLowerCase()));
    const extra = adminDoctors
      .filter((d) => !existingNames.has(d.name.toLowerCase()) && d.status === "active")
      .map((d) => ({
        id: d.id,
        name: d.name,
        specialty: d.specialty,
        image: d.photo,
        rating: 4.5,
        experience: d.experience,
        fee: d.consultancyFee || 300,
        availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] as string[],
        availableDays: [1, 2, 3, 4, 5, 6] as number[],
      }));

    return [...merged, ...extra];
  }, [appointmentDoctors, adminDoctors]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const handleBook = () => {
    setShowRegistrationPage(true);
  };

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-gradient-to-b from-white to-mint">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
              Meet Our <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Expert Doctors</span>
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              World-class specialists dedicated to your health and well-being
            </p>
          </div>
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
          {displayDoctors.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              className="snap-start shrink-0 w-[280px] sm:w-[300px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer group"
              onClick={() => handleBook()}
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-bold text-yellow-600 flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {doc.rating}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-base font-bold text-gray-900">{doc.name}</h3>
                <p className="text-sm text-blue-600 font-medium flex items-center gap-1.5 mt-0.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  {doc.specialty}
                </p>
                <p className="text-xs text-gray-400 mt-1.5">{doc.experience} experience</p>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">${doc.fee}</span>
                    <span className="text-xs text-gray-400 ml-1">/ visit</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleBook(); }}
                    className="flex items-center gap-1.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-500 rounded-xl px-4 py-2 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    Book
                  </button>
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
