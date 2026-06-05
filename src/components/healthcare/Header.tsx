"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  Clock,
  Globe,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Search,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppointmentStore } from "@/store/appointment-store";
import { useMedicineStore } from "@/store/medicine-store";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Find Doctors", href: "#services" },
  { label: "Services", href: "#services" },
  { label: "Labs", href: "#features" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openModal } = useAppointmentStore();
  const { getCartItemCount } = useMedicineStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className="w-full z-50">
      {/* Top Bar */}
      <div className="bg-teal-dark text-white text-xs sm:text-sm hidden lg:block">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between h-10">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone size={13} />
              +1 (800) 123-4567
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={13} />
              info@globalintegrativeclinic.com
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              Mon - Sat: 8:00 AM - 8:00 PM
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Globe size={13} />
              <span>EN</span>
              <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              🇺🇸 <span>USA</span>
              <ChevronDown size={12} />
            </button>
            <div className="flex items-center gap-3 ml-2">
              <a href="#" className="hover:opacity-80 transition-opacity"><Facebook size={14} /></a>
              <a href="#" className="hover:opacity-80 transition-opacity"><Twitter size={14} /></a>
              <a href="#" className="hover:opacity-80 transition-opacity"><Instagram size={14} /></a>
              <a href="#" className="hover:opacity-80 transition-opacity"><Linkedin size={14} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={cn(
          "w-full transition-all duration-300 bg-white",
          isScrolled
            ? "fixed top-0 left-0 shadow-md py-1.5 sm:py-2"
            : "relative shadow-sm py-2 sm:py-3"
        )}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl gradient-teal flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">G</span>
            </div>
            <div className="leading-tight">
              <span className="text-teal-dark font-bold text-sm sm:text-lg block leading-tight">Global Integrative</span>
              <span className="text-teal text-[10px] sm:text-xs font-medium tracking-wider uppercase">Clinic</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal hover:bg-mint rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-gray-500 hover:text-teal hover:bg-mint transition-colors">
              <Search size={18} className="sm:hidden" />
              <Search size={20} className="hidden sm:block" />
            </button>
            <button
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-gray-500 hover:text-teal hover:bg-mint transition-colors relative"
            >
              <ShoppingCart size={18} className="sm:hidden" />
              <ShoppingCart size={20} className="hidden sm:block" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-teal text-white text-[8px] sm:text-[10px] font-bold flex items-center justify-center">{getCartItemCount()}</span>
              )}
            </button>
            <Button
              onClick={openModal}
              className="hidden md:flex gradient-teal text-white rounded-xl px-5 h-9 sm:h-10 font-semibold text-sm shadow-premium hover:opacity-90 transition-opacity"
            >
              Book Appointment
            </Button>
            <button
              className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-gray-500 hover:text-teal hover:bg-mint transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} className="sm:hidden" /> : <Menu size={20} className="sm:hidden" />}
              {mobileOpen ? <X size={22} className="hidden sm:block" /> : <Menu size={22} className="hidden sm:block" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="xl:hidden bg-white border-t px-4 sm:px-6 py-4 shadow-lg fixed inset-x-0 top-[52px] sm:top-[60px] bottom-0 overflow-y-auto z-50">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-2.5 text-gray-700 hover:text-teal font-medium text-sm border-b border-gray-50 last:border-0"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button
              onClick={() => { openModal(); setMobileOpen(false); }}
              className="gradient-teal text-white rounded-xl px-5 h-10 font-semibold w-full mt-4 text-sm"
            >
              Book Appointment
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
