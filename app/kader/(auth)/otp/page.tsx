"use client";

import React from "react";
import OtpVerificationCard from "@/components/auth/OtpVerificationCard";

export default function KaderOtpPage() {
  return (
    <OtpVerificationCard
      roleName="Kader Posyandu"
      loginPath="/kader/login"
      homePath="/kader/home"
    />
  );
}
