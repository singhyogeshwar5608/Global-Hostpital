"use client";

import React from "react";
import { useAdminStore } from "@/store/admin-store";
import AdminDashboard from "./AdminDashboard";

export default function AdminPanel() {
  const { isPanelOpen, isLoggedIn } = useAdminStore();

  if (!isPanelOpen) return null;
  if (!isLoggedIn) return null;

  return <AdminDashboard />;
}
