"use client";

import React from "react";
import { useLabStore } from "@/store/lab-store";
import LabLogin from "./LabLogin";
import LabDashboard from "./LabDashboard";

export default function LabPanel() {
  const { isLabPanelOpen, isLabLoggedIn } = useLabStore();

  if (!isLabPanelOpen) return null;

  if (!isLabLoggedIn) {
    return <LabLogin />;
  }

  return <LabDashboard />;
}
