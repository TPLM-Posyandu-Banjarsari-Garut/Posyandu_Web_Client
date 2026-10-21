"use client";

import React from "react";
import OtpVerificationCard from "@/components/auth/OtpVerificationCard";

export default function AdminOtpPage() {
  return (
    <OtpVerificationCard
      roleName="Administrator"
      loginPath="/admin/login"
      homePath="/admin/kelola-buat-akun"
    />
  );
}
