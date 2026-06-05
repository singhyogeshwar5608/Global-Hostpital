"use client";

import React from "react";
import { useDoctorPortalStore } from "@/store/doctor-portal-store";
import DoctorLogin from "./DoctorLogin";
import DoctorPortal from "./DoctorPortal";

export default function DoctorPortalPanel() {
  const { isPanelOpen, isLoggedIn, doctorId, closePanel } = useDoctorPortalStore();

  if (!isPanelOpen) return null;

  if (!isLoggedIn || !doctorId) {
    return <DoctorLogin />;
  }

  return <DoctorPortal doctorId={doctorId} onClose={closePanel} />;
}
