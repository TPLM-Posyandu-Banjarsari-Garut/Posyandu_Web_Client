"use client";

import React from "react";
import OtpVerificationCard from "@/components/auth/OtpVerificationCard";

export default function BidanOtpPage() {
  return (
    <OtpVerificationCard
      roleName="Bidan"
      loginPath="/bidan/login"
      homePath="/bidan/home"
    />
  );
}
