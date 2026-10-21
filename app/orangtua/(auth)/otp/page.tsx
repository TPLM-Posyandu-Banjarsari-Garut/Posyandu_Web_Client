"use client";

import React from "react";
import OtpVerificationCard from "@/components/auth/OtpVerificationCard";

export default function OrangTuaOtpPage() {
  return (
    <OtpVerificationCard
      roleName="Orang Tua"
      loginPath="/orangtua/login"
      homePath="/orangtua/home"
    />
  );
}
