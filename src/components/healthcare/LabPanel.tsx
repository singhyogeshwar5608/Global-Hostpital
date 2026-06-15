"use client";

import React from "react";
import { useLabStore } from "@/store/lab-store";
import LabDashboard from "./LabDashboard";

export default function LabPanel() {
  const { isLabPanelOpen, isLabLoggedIn } = useLabStore();

  if (!isLabPanelOpen) return null;
  if (!isLabLoggedIn) return null;

  return <LabDashboard />;
}
