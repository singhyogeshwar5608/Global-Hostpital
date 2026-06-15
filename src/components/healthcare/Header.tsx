"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  ChevronDown,
  Menu,
  X,
  UserPlus,
  LogIn,
  HeartPulse,
  User,
  LayoutDashboard,
  FileText,
  LogOut,
  Calendar,
  ClipboardList,
  Pill,
  CreditCard,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppointmentStore } from "@/store/appointment-store";
import { useAuthStore } from "@/store/auth-store";
import { usePatientStore } from "@/store/patient-store";
import { usePageContext } from "@/App";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Doctors", href: "#doctors" },
  { label: "Services", href: "#services" },
  { label: "Packages", href: "#packages" },
  { label: "About Us", href: "#about" },
  { label: "Contact Us", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openModal } = useAppointmentStore();
  const { openLoginPage, isAuthenticated, authenticatedUser, authenticatedRole, logout } = useAuthStore();
  const { openPortal } = usePatientStore();
  const { setShowRegistrationPage } = usePageContext();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isPatient = isAuthenticated && authenticatedRole === "patient";

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    usePatientStore.getState().closePortal();
    logout();
  };

  const handleOpenDashboard = () => {
    setProfileDropdownOpen(false);
    usePatientStore.getState().setPatientViewingHomepage(false);
    usePatientStore.getState().setPortalTargetView("account");
  };

  const handleOpenNewCase = () => {
    setProfileDropdownOpen(false);
    usePatientStore.getState().setPortalTargetView("new-case");
  };

  const handleNavigateTo = (view: string) => {
    setProfileDropdownOpen(false);
    usePatientStore.getState().setPatientViewingHomepage(false);
    usePatientStore.getState().setPortalTargetView(view);
  };

  const handleHomeClick = () => {
    setActiveNav("Home");
    if (isPatient) {
      usePatientStore.getState().setPatientViewingHomepage(true);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="w-full z-50"
    >
      {/* Main Navbar */}
      <nav
        className={cn(
          "w-full transition-all duration-300 bg-white",
          isScrolled
            ? "fixed top-0 left-0 shadow-md py-2"
            : "relative shadow-sm py-3"
        )}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Logo + Branding */}
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center shadow-sm">
              <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="leading-none">
              <span className="text-emerald-700 font-bold text-sm sm:text-base md:text-lg block leading-tight">
                Global Integrative Clinic
              </span>
              <span className="text-gray-400 text-[10px] sm:text-xs font-medium tracking-wider block mt-0.5">
                Healing Beyond Boundaries
              </span>
            </div>
          </a>

          {/* Center: Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeNav === link.label;
              return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); setActiveNav(link.label); if (link.label === "Home" && isPatient) { usePatientStore.getState().setPatientViewingHomepage(true); } }}
                    className={cn(
                    "relative px-3 xl:px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-500 rounded-full" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language */}
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50">
              <Globe className="w-4 h-4" />
              <span>EN</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Divider */}
            {!isPatient && <div className="hidden sm:block w-px h-6 bg-gray-200" />}

            {/* Auth buttons (shown when NOT logged in) */}
            {!isPatient && (
              <>
                <Button
                  onClick={openLoginPage}
                  variant="outline"
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 h-9 text-sm font-semibold border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>

                <Button
                  onClick={() => setShowRegistrationPage(true)}
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 h-9 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Button>
              </>
            )}

            {/* Profile dropdown (shown when patient is logged in) */}
            {isPatient && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                    {authenticatedUser?.name?.charAt(0)?.toUpperCase() || "P"}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {authenticatedUser?.name || "Patient"}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{authenticatedUser?.name}</p>
                      <p className="text-xs text-gray-400">{authenticatedUser?.id}</p>
                    </div>

                    <button onClick={handleOpenDashboard} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <LayoutDashboard size={16} className="text-emerald-600" /> Dashboard
                    </button>
                    <button onClick={() => handleNavigateTo("profile")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User size={16} className="text-blue-600" /> My Profile
                    </button>
                    <button onClick={() => handleNavigateTo("appointments")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Calendar size={16} className="text-purple-600" /> Appointments
                    </button>
                    <button onClick={() => handleNavigateTo("records")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <ClipboardList size={16} className="text-orange-600" /> Medical Records
                    </button>
                    <button onClick={() => handleNavigateTo("prescriptions")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Pill size={16} className="text-green-600" /> Prescriptions
                    </button>
                    <button onClick={() => handleNavigateTo("reports")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <FileText size={16} className="text-rose-600" /> Lab Reports
                    </button>
                    <button onClick={() => handleNavigateTo("payments")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <CreditCard size={16} className="text-teal-600" /> Payments
                    </button>
                    <button onClick={() => handleNavigateTo("settings")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings size={16} className="text-gray-600" /> Settings
                    </button>

                    <hr className="border-gray-100 my-1" />

                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 sm:px-6 py-5 shadow-lg fixed inset-x-0 top-[57px] bottom-0 overflow-y-auto z-50">
            {/* Language in mobile */}
            <button className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors w-full mb-2">
              <Globe className="w-4 h-4" />
              <span>English</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>

            <hr className="border-gray-100 mb-2" />

            {navLinks.map((link) => {
              const isActive = activeNav === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => { setActiveNav(link.label); setMobileOpen(false); if (link.label === "Home" && isPatient) { usePatientStore.getState().setPatientViewingHomepage(true); } }}
                  className={cn(
                    "block py-3 px-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "text-emerald-600 bg-emerald-50 border-l-2 border-emerald-500"
                      : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                  )}
                >
                  {link.label}
                </a>
              );
            })}

            <hr className="border-gray-100 my-3" />

            {/* Patient logged-in menu (mobile) */}
            {isPatient ? (
              <div className="flex flex-col gap-2 px-3">
                <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 border-b border-gray-100 mb-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                    {authenticatedUser?.name?.charAt(0)?.toUpperCase() || "P"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{authenticatedUser?.name}</p>
                    <p className="text-xs text-gray-400">{authenticatedUser?.id}</p>
                  </div>
                </div>
                <Button onClick={() => { setMobileOpen(false); usePatientStore.getState().setPatientViewingHomepage(true); }} className="w-full justify-start rounded-xl h-10 text-sm font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100">
                  <Globe className="w-4 h-4 mr-2" /> Home
                </Button>
                <Button onClick={() => { setMobileOpen(false); usePatientStore.getState().setPatientViewingHomepage(false); usePatientStore.getState().setPortalTargetView("account"); }} className="w-full justify-start rounded-xl h-10 text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </Button>
                <Button onClick={() => { setMobileOpen(false); usePatientStore.getState().setPatientViewingHomepage(false); usePatientStore.getState().setPortalTargetView("profile"); }} className="w-full justify-start rounded-xl h-10 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100">
                  <User className="w-4 h-4 mr-2" /> My Profile
                </Button>
                <Button onClick={() => { setMobileOpen(false); usePatientStore.getState().setPatientViewingHomepage(false); usePatientStore.getState().setPortalTargetView("appointments"); }} className="w-full justify-start rounded-xl h-10 text-sm font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100">
                  <Calendar className="w-4 h-4 mr-2" /> Appointments
                </Button>
                <Button onClick={() => { setMobileOpen(false); usePatientStore.getState().setPatientViewingHomepage(false); usePatientStore.getState().setPortalTargetView("records"); }} className="w-full justify-start rounded-xl h-10 text-sm font-semibold bg-orange-50 text-orange-700 hover:bg-orange-100">
                  <ClipboardList className="w-4 h-4 mr-2" /> Medical Records
                </Button>
                <Button onClick={() => { setMobileOpen(false); usePatientStore.getState().setPatientViewingHomepage(false); usePatientStore.getState().setPortalTargetView("prescriptions"); }} className="w-full justify-start rounded-xl h-10 text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100">
                  <Pill className="w-4 h-4 mr-2" /> Prescriptions
                </Button>
                <Button onClick={() => { setMobileOpen(false); usePatientStore.getState().setPatientViewingHomepage(false); usePatientStore.getState().setPortalTargetView("reports"); }} className="w-full justify-start rounded-xl h-10 text-sm font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100">
                  <FileText className="w-4 h-4 mr-2" /> Lab Reports
                </Button>
                <Button onClick={() => { setMobileOpen(false); usePatientStore.getState().setPatientViewingHomepage(false); usePatientStore.getState().setPortalTargetView("payments"); }} className="w-full justify-start rounded-xl h-10 text-sm font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100">
                  <CreditCard className="w-4 h-4 mr-2" /> Payments
                </Button>
                <Button onClick={() => { setMobileOpen(false); usePatientStore.getState().setPatientViewingHomepage(false); usePatientStore.getState().setPortalTargetView("settings"); }} className="w-full justify-start rounded-xl h-10 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </Button>
                <hr className="border-gray-100 my-1" />
                <Button onClick={() => { setMobileOpen(false); logout(); }} variant="outline" className="w-full justify-start rounded-xl h-10 text-sm font-semibold border-red-200 text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-3">
                <Button
                  onClick={() => { openLoginPage(); setMobileOpen(false); }}
                  variant="outline"
                  className="w-full justify-center rounded-xl h-10 text-sm font-semibold border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button
                  onClick={() => { setShowRegistrationPage(true); setMobileOpen(false); }}
                  className="w-full justify-center rounded-xl h-10 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </Button>
              </div>
            )}
          </div>
        )}
      </nav>
    </motion.header>
  );
}
