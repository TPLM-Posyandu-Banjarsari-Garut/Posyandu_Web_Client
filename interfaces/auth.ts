export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  user: AdminUser;
}

export interface BidanUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BidanLoginPayload {
  email: string;
  password: string;
}

export interface BidanLoginResponse {
  token: string;
  user: BidanUser;
}

export interface KaderUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KaderLoginPayload {
  email: string;
  password: string;
}

export interface KaderLoginResponse {
  token: string;
  user: KaderUser;
}

export interface OrangTuaUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrangTuaLoginPayload {
  email: string;
  password: string;
}

export interface OrangTuaRegisterPayload {
  name: string;
  email: string;
  phone_number?: string;
  password: string;
}

export interface OrangTuaLoginResponse {
  token: string;
  user: OrangTuaUser;
}

export interface VerifyOTPPayload {
  email: string;
  otp: string;
}

export interface ResendOTPPayload {
  email: string;
  type: "email-verification" | "sign-in" | "forget-password" | "change-email";
}
