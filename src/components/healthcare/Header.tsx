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
import { usePackageStore } from "@/store/package-store";
import { usePatientStore } from "@/store/patient-store";
import { Pill, Package, Users } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Find Doctors", href: "#services" },
  { label: "Services", href: "#services" },
  { label: "Labs", href: "#features" },
  { label: "About Us", href: "#why-us" },
  { label: "Contact Us", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openModal } = useAppointmentStore();
  const { openShop, getCartItemCount } = useMedicineStore();
  const { openShop: openPackageShop } = usePackageStore();
  const { openPortal: openPatientPortal } = usePatientStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full z-50">
      {/* Top Bar */}
      <div className="bg-teal-dark text-white text-sm hidden lg:block">
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
            ? "fixed top-0 left-0 shadow-md py-2"
            : "relative shadow-sm py-3"
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div className="leading-tight">
              <span className="text-teal-dark font-bold text-lg block leading-tight">Global Integrative</span>
              <span className="text-teal text-xs font-medium tracking-wider uppercase">Clinic</span>
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
            <button
              onClick={openShop}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal hover:bg-mint rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Pill size={14} />
              Medicines
            </button>
            <button
              onClick={openPackageShop}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal hover:bg-mint rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Package size={14} />
              Packages
            </button>
            <button
              onClick={openPatientPortal}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal hover:bg-mint rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Users size={14} />
              Patient Portal
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-teal hover:bg-mint transition-colors">
              <Search size={20} />
            </button>
            <button
              onClick={openShop}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-teal hover:bg-mint transition-colors relative"
            >
              <ShoppingCart size={20} />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-teal text-white text-[10px] font-bold flex items-center justify-center">{getCartItemCount()}</span>
              )}
            </button>
            <Button
              onClick={openModal}
              className="hidden md:flex gradient-teal text-white rounded-xl px-5 h-10 font-semibold shadow-premium hover:opacity-90 transition-opacity"
            >
              Book Appointment
            </Button>
            <button
              className="xl:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-teal hover:bg-mint transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="xl:hidden bg-white border-t mt-2 px-6 py-4 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-2.5 text-gray-700 hover:text-teal font-medium border-b border-gray-50 last:border-0"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { openShop(); setMobileOpen(false); }}
              className="block w-full text-left py-2.5 text-gray-700 hover:text-teal font-medium border-b border-gray-50 flex items-center gap-1.5"
            >
              <Pill size={14} /> Medicines
            </button>
            <button
              onClick={() => { openPackageShop(); setMobileOpen(false); }}
              className="block w-full text-left py-2.5 text-gray-700 hover:text-teal font-medium border-b border-gray-50 flex items-center gap-1.5"
            >
              <Package size={14} /> Packages
            </button>
            <button
              onClick={() => { openPatientPortal(); setMobileOpen(false); }}
              className="block w-full text-left py-2.5 text-gray-700 hover:text-teal font-medium border-b border-gray-50 flex items-center gap-1.5"
            >
              <Users size={14} /> Patient Portal
            </button>
            <Button
              onClick={() => { openModal(); setMobileOpen(false); }}
              className="gradient-teal text-white rounded-xl px-5 h-10 font-semibold w-full mt-4"
            >
              Book Appointment
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
