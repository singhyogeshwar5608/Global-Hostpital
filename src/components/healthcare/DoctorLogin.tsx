"use client";

import React, { useState } from "react";
import { useDoctorPortalStore } from "@/store/doctor-portal-store";
import { useDoctorStore } from "@/store/doctor-store";
import {
  Stethoscope,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  X,
  Lock,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorLogin() {
  const { doctorLogin, closePanel } = useDoctorPortalStore();
  const { doctors, addAuditLog } = useDoctorStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const doctor = doctors.find(
        (d) =>
          d.email.toLowerCase() === email.toLowerCase() &&
          d.password === password
      );

      if (!doctor) {
        setError("Invalid email or password.");
        setIsLoading(false);
        return;
      }

      if (doctor.status === "suspended") {
        setError("Your account has been suspended by Super Admin. Contact administration for assistance.");
        setIsLoading(false);
        return;
      }

      if (doctor.status === "inactive") {
        setError("Your account is inactive. Contact Super Admin to activate your account.");
        setIsLoading(false);
        return;
      }

      // Success - log in
      addAuditLog({
        doctorId: doctor.id,
        doctorName: doctor.name,
        action: "login",
        details: "Logged in via Doctor Portal",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().split(" ")[0],
        ipAddress: "192.168.1." + Math.floor(Math.random() * 255),
        device: typeof navigator !== "undefined" && navigator.userAgent.includes("Chrome")
          ? "Chrome"
          : typeof navigator !== "undefined" && navigator.userAgent.includes("Firefox")
          ? "Firefox"
          : typeof navigator !== "undefined" && navigator.userAgent.includes("Safari")
          ? "Safari"
          : "Browser",
        location: doctor.country || "Unknown",
      });

      doctorLogin(doctor.id, doctor.name);
      setIsLoading(false);
    }, 800);
  };

  const fillCredentials = (docEmail: string, docPassword: string) => {
    setEmail(docEmail);
    setPassword(docPassword);
    setShowDoctors(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={closePanel}
        className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-10"
      >
        <X size={20} />
      </button>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal to-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-teal/20">
            <Stethoscope size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Doctor Portal</h1>
          <p className="text-white/50 text-sm">Global Integrative Clinic</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-200 text-sm">
                {error.includes("suspended") ? (
                  <Lock size={16} className="shrink-0 mt-0.5" />
                ) : error.includes("inactive") ? (
                  <XCircle size={16} className="shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                )}
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-white/80 mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.com"
                className="w-full h-12 rounded-xl bg-white/10 border border-white/20 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal/50 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-white/80 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-12 rounded-xl bg-white/10 border border-white/20 px-4 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal to-emerald-500 text-white rounded-xl h-12 font-semibold shadow-lg shadow-teal/25 hover:shadow-teal/40 transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={18} />
                  Sign In to Portal
                </span>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowDoctors(!showDoctors)}
              className="w-full text-center text-white/40 text-xs hover:text-white/60 transition-colors flex items-center justify-center gap-1"
            >
              {showDoctors ? "Hide" : "Show"} Demo Credentials
              <ArrowRight
                size={10}
                className={`transition-transform ${showDoctors ? "rotate-90" : ""}`}
              />
            </button>

            {showDoctors && (
              <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto">
                {doctors
                  .filter((d) => d.status === "active")
                  .map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => fillCredentials(doc.email, doc.password)}
                      className="w-full text-left flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-white/80 text-xs font-semibold truncate">
                          {doc.name}
                        </div>
                        <div className="text-white/30 text-[10px] truncate">
                          {doc.email} / {doc.password}
                        </div>
                      </div>
                      <ArrowRight
                        size={12}
                        className="text-white/20 group-hover:text-teal transition-colors"
                      />
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-6 text-center">
          <p className="text-white/30 text-xs">
            Only active doctors can login. Contact Super Admin for account access.
          </p>
        </div>
      </div>
    </div>
  );
}
