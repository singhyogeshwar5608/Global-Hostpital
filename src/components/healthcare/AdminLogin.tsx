"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/store/admin-store";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const { login, closePanel } = useAdminStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError("Invalid credentials. Try admin / admin123");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={closePanel}
        className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-all z-10"
      >
        <X size={20} />
      </button>

      <div className="relative w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#1e3a5f] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Panel</h1>
          <p className="text-gray-500 text-sm">Global Integrative Clinic</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full h-12 rounded-xl bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-12 rounded-xl bg-gray-50 border border-gray-200 px-4 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-all"
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e3a5f] text-white rounded-xl h-12 font-semibold shadow-lg hover:bg-[#163050] transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={18} />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs">
              Demo: admin / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
