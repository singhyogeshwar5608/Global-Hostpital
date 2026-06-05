"use client";

import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ShieldCheck,
  FlaskConical,
  Stethoscope,
} from "lucide-react";
import { useAdminStore } from "@/store/admin-store";
import { useLabStore } from "@/store/lab-store";
import { useDoctorPortalStore } from "@/store/doctor-portal-store";

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
  const { openPanel } = useAdminStore();
  const { openLabPanel } = useLabStore();
  const { openPanel: openDoctorPanel } = useDoctorPortalStore();

  return (
    <footer className="bg-teal-dark text-white" id="contact">
      <div className="max-w-[1440px] mx-auto px-6 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Column 1: Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div className="leading-tight">
                <span className="font-bold text-lg block leading-tight">Global Integrative</span>
                <span className="text-white/60 text-xs font-medium tracking-wider uppercase">Clinic</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Your trusted partner in healthcare. Providing comprehensive medical
              services with a patient-first approach since 2015.
            </p>
            <div className="flex gap-2.5">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
              {/* Admin Panel Button - below Health Packages */}
              <li className="pt-3">
                <button
                  onClick={openPanel}
                  className="group flex items-center gap-2 text-white/50 text-sm hover:text-white transition-all duration-300 rounded-lg px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
                  title="Admin Access"
                >
                  <ShieldCheck size={16} className="text-white/50 group-hover:text-white transition-colors" />
                  <span className="font-medium">Admin Panel</span>
                </button>
              </li>
              <li>
                <button
                  onClick={openLabPanel}
                  className="group flex items-center gap-2 text-white/50 text-sm hover:text-white transition-all duration-300 rounded-lg px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
                  title="Lab Portal"
                >
                  <FlaskConical size={16} className="text-white/50 group-hover:text-white transition-colors" />
                  <span className="font-medium">Lab Login</span>
                </button>
              </li>
              <li>
                <button
                  onClick={openDoctorPanel}
                  className="group flex items-center gap-2 text-white/50 text-sm hover:text-teal-light transition-all duration-300 rounded-lg px-3 py-2 bg-gradient-to-r from-teal/20 to-emerald-500/20 hover:from-teal/30 hover:to-emerald-500/30 border border-teal/30 hover:border-teal/50 shadow-sm hover:shadow-teal/10"
                  title="Doctor Portal"
                >
                  <Stethoscope size={16} className="text-teal-light/70 group-hover:text-teal-light transition-colors" />
                  <span className="font-medium">Doctor Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-bold text-base mb-4">Services</h4>
            <ul className="space-y-2.5">
              {services.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-bold text-base mb-4">Company</h4>
            <ul className="space-y-2.5">
              {company.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div>
            <h4 className="font-bold text-base mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-teal-light mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">
                  123 Healthcare Blvd, Suite 400, New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-teal-light shrink-0" />
                <span className="text-white/60 text-sm">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-teal-light shrink-0" />
                <span className="text-white/60 text-sm">info@globalintegrativeclinic.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2026 Global Integrative Clinic. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-white/40 text-sm hover:text-white/70 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/40 text-sm hover:text-white/70 transition-colors">
                Terms of Service
              </a>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-white/30" />
              {["Visa", "MasterCard", "PayPal", "Stripe"].map((name) => (
                <div
                  key={name}
                  className="bg-white/10 rounded-md px-2 py-1 text-white/50 text-[10px] font-semibold"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
