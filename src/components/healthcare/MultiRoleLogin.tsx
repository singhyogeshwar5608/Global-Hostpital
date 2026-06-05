"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore, type PortalRole } from "@/store/auth-store";
import { useAdminStore } from "@/store/admin-store";
import { useDoctorPortalStore } from "@/store/doctor-portal-store";
import { useLabStore } from "@/store/lab-store";
import {
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  X,
  Heart,
  Clock,
  CalendarDays,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const roleConfig: Record<PortalRole, {
  icon: React.ElementType;
  label: string;
  loginText: string;
  color: string;
  activeColor: string;
  bgColor: string;
}> = {
  admin: {
    icon: ShieldCheck,
    label: "Admin Portal",
    loginText: "Login to Admin Portal",
    color: "text-blue-600",
    activeColor: "bg-blue-500",
    bgColor: "bg-blue-50",
  },
  doctor: {
    icon: Stethoscope,
    label: "Doctor Portal",
    loginText: "Login to Doctor Portal",
    color: "text-teal-600",
    activeColor: "bg-teal",
    bgColor: "bg-teal-50",
  },
  lab: {
    icon: FlaskConical,
    label: "Lab Portal",
    loginText: "Login to Lab Portal",
    color: "text-purple-600",
    activeColor: "bg-purple-500",
    bgColor: "bg-purple-50",
  },
};

const features = [
  { icon: Heart, title: "Expert Care", desc: "World-class medical professionals" },
  { icon: ShieldCheck, title: "Secure & Private", desc: "HIPAA compliant systems" },
  { icon: Clock, title: "24/7 Support", desc: "Always available for you" },
  { icon: CalendarDays, title: "Easy Appointment", desc: "Book in seconds" },
];

export default function MultiRoleLogin() {
  const {
    isLoginPageOpen,
    closeLoginPage,
    selectedRole,
    setSelectedRole,
    isLoggingIn,
    setIsLoggingIn,
    loginError,
    setLoginError,
    login,
  } = useAuthStore();

  const { openPanel: openAdminPanel } = useAdminStore();
  const { openPanel: openDoctorPanel, doctorLogin } = useDoctorPortalStore();
  const { openLabPanel, setLabLoggedIn, labs } = useLabStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered credentials
  useEffect(() => {
    if (isLoginPageOpen) {
      const saved = localStorage.getItem("gic_remembered");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setEmail(parsed.email || "");
          setPassword(parsed.password || "");
          setRememberMe(true);
          if (parsed.role) setSelectedRole(parsed.role as PortalRole);
        } catch {
          // ignore
        }
      }
    }
  }, [isLoginPageOpen, setSelectedRole]);

  // Reset form when page opens
  useEffect(() => {
    if (isLoginPageOpen) {
      setLoginError("");
    }
  }, [isLoginPageOpen, setLoginError]);

  if (!isLoginPageOpen) return null;

  const currentConfig = roleConfig[selectedRole];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!email.trim() || !password.trim()) {
      setLoginError("Please enter both email and password");
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      const success = login(email, password, selectedRole);

      if (success) {
        // Remember me
        if (rememberMe) {
          localStorage.setItem(
            "gic_remembered",
            JSON.stringify({ email, password, role: selectedRole })
          );
        } else {
          localStorage.removeItem("gic_remembered");
        }

        // Dispatch to the correct portal store
        const state = useAuthStore.getState();
        if (state.authenticatedRole === "admin") {
          openAdminPanel();
        } else if (state.authenticatedRole === "doctor") {
          const docId = state.authenticatedUser?.id || "DOC-1001";
          const docName = state.authenticatedUser?.name || "Dr. Raj Sharma";
          openDoctorPanel();
          doctorLogin(docId, docName);
        } else if (state.authenticatedRole === "lab") {
          const labId = state.authenticatedUser?.id || "LAB-1001";
          const lab = labs.find((l) => l.id === labId);
          openLabPanel();
          if (lab) {
            setLabLoggedIn(lab);
          }
        }
      }

      setIsLoggingIn(false);
    }, 1000);
  };

  const fillDemoCredentials = (role: PortalRole) => {
    const creds: Record<PortalRole, { email: string; password: string }> = {
      admin: { email: "admin@globalclinic.com", password: "Admin@123" },
      doctor: { email: "doctor@globalclinic.com", password: "Doctor@123" },
      lab: { email: "lab@globalclinic.com", password: "Lab@123" },
    };
    setSelectedRole(role);
    setEmail(creds[role].email);
    setPassword(creds[role].password);
    setLoginError("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* ═══════════════════ LEFT SIDE (40%) ═══════════════════ */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden bg-gradient-to-br from-[#0a6b5f] via-[#0a8a7a] to-[#065a50]">
        {/* Hexagonal pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-40 h-40 rounded-full bg-teal-300/10 blur-2xl" />

        {/* EKG line decoration */}
        <svg className="absolute bottom-20 left-0 w-full h-16 opacity-10" viewBox="0 0 400 50" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="white"
            strokeWidth="2"
            points="0,25 50,25 60,25 70,10 80,40 90,5 100,45 110,25 120,25 200,25 210,25 220,10 230,40 240,5 250,45 260,25 270,25 400,25"
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Heart size={24} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-white block leading-tight">Global Integrative</span>
              <span className="text-white/50 text-xs font-semibold tracking-[0.2em] uppercase">Clinic</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-white leading-tight mb-3">
            Comprehensive Care for a{" "}
            <span className="text-teal-200">Better Life</span>
          </h1>
          <p className="text-white/60 text-base mb-10 leading-relaxed">
            One Platform. One Mission. Better Health For Everyone.
          </p>

          {/* Features */}
          <div className="space-y-4 mb-12">
            {features.map((feat) => (
              <div key={feat.title} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 shrink-0">
                  <feat.icon size={18} className="text-teal-200" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-teal-300" />
                    {feat.title}
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom doctor image area */}
          <div className="relative rounded-2xl overflow-hidden h-44 bg-gradient-to-t from-teal-900/50 to-teal-800/30 border border-white/10">
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-5 bg-gradient-to-t from-black/40 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Stethoscope size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">Trusted Healthcare</div>
                    <div className="text-white/50 text-xs">Serving 50,000+ patients worldwide</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative medical illustration */}
            <div className="absolute top-3 right-3 opacity-20">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="2" />
                <path d="M40 20v40M20 40h40" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ RIGHT SIDE (60%) ═══════════════════ */}
      <div className="w-full lg:w-[60%] bg-gradient-to-br from-slate-50 to-white flex items-center justify-center relative overflow-y-auto">
        {/* Close button */}
        <button
          onClick={closeLoginPage}
          className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

        {/* Small plus signs decoration */}
        <div className="absolute top-32 right-20 opacity-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4v16M4 12h16" stroke="#0a8a7a" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <div className="absolute bottom-40 left-16 opacity-10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#0a8a7a"/></svg>
        </div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md px-6 py-8 lg:px-0 lg:py-0">
          {/* Mobile logo (shown only on mobile) */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a8a7a] to-[#065a50] flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Global Integrative Clinic</span>
          </div>

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back!</h2>
            <p className="text-gray-500 text-sm">Login to access your portal</p>
          </div>

          {/* Role Tabs */}
          <div className="flex gap-2 mb-8 p-1.5 bg-gray-100 rounded-xl">
            {(Object.keys(roleConfig) as PortalRole[]).map((role) => {
              const config = roleConfig[role];
              const isActive = selectedRole === role;
              const Icon = config.icon;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    setLoginError("");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#0a8a7a] shadow-md shadow-teal/10"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-[#0a8a7a]" : ""} />
                  <span className="hidden sm:inline">{config.label}</span>
                  <span className="sm:hidden">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                </button>
              );
            })}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error */}
            {loginError && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-shake">
                <AlertCircle size={16} className="shrink-0" />
                <span className="font-medium">{loginError}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                User ID / Email
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  placeholder="Enter your email"
                  className="w-full h-12 rounded-xl bg-gray-50 border border-gray-200 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a8a7a]/30 focus:border-[#0a8a7a] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  placeholder="Enter your password"
                  className="w-full h-12 rounded-xl bg-gray-50 border border-gray-200 pl-10 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a8a7a]/30 focus:border-[#0a8a7a] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      rememberMe
                        ? "bg-[#0a8a7a] border-[#0a8a7a]"
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}
                  >
                    {rememberMe && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600 select-none">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm font-semibold text-[#0a8a7a] hover:text-[#065a50] transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full h-12 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                selectedRole === "admin"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/25"
                  : selectedRole === "doctor"
                  ? "bg-gradient-to-r from-[#0a8a7a] to-[#065a50] hover:from-[#065a50] hover:to-[#044a40] shadow-teal/25"
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-purple-500/25"
              } disabled:opacity-70`}
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={18} />
                  {currentConfig.loginText}
                  <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-50 px-3 text-gray-400 font-medium">DEMO CREDENTIALS</span>
            </div>
          </div>

          {/* Quick Demo Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {([
              { role: "admin" as PortalRole, icon: ShieldCheck, label: "Admin", color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" },
              { role: "doctor" as PortalRole, icon: Stethoscope, label: "Doctor", color: "bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100" },
              { role: "lab" as PortalRole, icon: FlaskConical, label: "Lab", color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100" },
            ]).map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => fillDemoCredentials(item.role)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${item.color}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Secure Login Info */}
          <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-50 border border-gray-100">
            <Lock size={14} className="text-gray-400" />
            <span className="text-xs text-gray-400 font-medium">SSL Protected | 256-bit Encrypted</span>
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center ml-1">
              <CheckCircle2 size={10} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
