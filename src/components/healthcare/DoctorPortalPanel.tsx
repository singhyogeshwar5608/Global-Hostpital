"use client";

import React from "react";
import { useDoctorPortalStore } from "@/store/doctor-portal-store";
import DoctorPortal from "./DoctorPortal";

export default function DoctorPortalPanel() {
  const { isPanelOpen, isLoggedIn, doctorId, closePanel } = useDoctorPortalStore();

  if (!isPanelOpen) return null;
  if (!isLoggedIn || !doctorId) return null;

  return <DoctorPortal doctorId={doctorId} onClose={closePanel} />;
}
