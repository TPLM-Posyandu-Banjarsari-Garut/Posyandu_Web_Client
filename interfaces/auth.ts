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
