"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  CreditCard,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { LogIn } from "lucide-react";

const quickLinks = [
  "Home",
  "Find Doctors",
  "Book Appointment",
  "Lab Tests",
  "Medicines",
  "Health Packages",
];

const services = [
  "Video Consultation",
  "In-Person Visit",
  "Lab Testing",
  "Pharmacy",
  "Health Checkup",
  "Emergency Care",
];

const company = [
  "About Us",
  "Careers",
  "Press",
  "Blog",
  "Privacy Policy",
  "Terms of Service",
];

export default function Footer() {
  const { openLoginPage } = useAuthStore();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="bg-teal-dark text-white"
      id="contact"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 lg:pt-16 pb-6 sm:pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-12">
          {/* Column 1: Logo & Description */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/15 flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">G</span>
              </div>
              <div className="leading-tight">
                <span className="font-bold text-sm sm:text-lg block leading-tight">Global Integrative</span>
                <span className="text-white/60 text-[10px] sm:text-xs font-medium tracking-wider uppercase">Clinic</span>
              </div>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
              Your trusted partner in healthcare. Providing comprehensive medical
              services with a patient-first approach since 2015.
            </p>
            <div className="flex gap-2 sm:gap-2.5">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Icon size={14} className="sm:hidden" />
                  <Icon size={16} className="hidden sm:block" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-sm sm:text-base mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/60 text-xs sm:text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
              {/* Login */}
              <li>
                <button
                  onClick={openLoginPage}
                  className="flex items-center gap-2 text-white/60 text-xs sm:text-sm hover:text-white transition-colors"
                >
                  <LogIn size={14} />
                  Login
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-bold text-sm sm:text-base mb-3 sm:mb-4">Services</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {services.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/60 text-xs sm:text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-bold text-sm sm:text-base mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {company.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/60 text-xs sm:text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-bold text-sm sm:text-base mb-3 sm:mb-4">Contact Us</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <li className="flex items-start gap-2 sm:gap-2.5">
                <MapPin size={14} className="text-teal-light mt-0.5 shrink-0 sm:hidden" />
                <MapPin size={16} className="text-teal-light mt-0.5 shrink-0 hidden sm:block" />
                <span className="text-white/60 text-xs sm:text-sm">
                  123 Healthcare Blvd, Suite 400, New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-2.5">
                <Phone size={14} className="text-teal-light shrink-0 sm:hidden" />
                <Phone size={16} className="text-teal-light shrink-0 hidden sm:block" />
                <span className="text-white/60 text-xs sm:text-sm">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-2.5">
                <Mail size={14} className="text-teal-light shrink-0 sm:hidden" />
                <Mail size={16} className="text-teal-light shrink-0 hidden sm:block" />
                <span className="text-white/60 text-xs sm:text-sm break-all">info@globalintegrativeclinic.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-4 sm:pt-6">
          <div className="flex flex-col gap-3 sm:gap-4 items-center text-center">
            <p className="text-white/40 text-xs sm:text-sm">
              © 2026 Global Integrative Clinic. All rights reserved.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="#" className="text-white/40 text-xs sm:text-sm hover:text-white/70 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/40 text-xs sm:text-sm hover:text-white/70 transition-colors">
                Terms of Service
              </a>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <CreditCard size={14} className="text-white/30 sm:hidden" />
              <CreditCard size={16} className="text-white/30 hidden sm:block" />
              {["Visa", "MasterCard", "PayPal", "Stripe"].map((name) => (
                <div
                  key={name}
                  className="bg-white/10 rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1 text-white/50 text-[8px] sm:text-[10px] font-semibold"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
