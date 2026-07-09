import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://api.posyandubanjarsari.my.id");

// ─── In-Memory Cache Layer ────────────────────────────────────────────────────
// Cache ini hidup selama process Node.js berjalan.
// Untuk produksi multi-instance, ganti dengan Upstash Redis REST API.
interface CacheEntry {
  valid: boolean;
  role: string;
  expiresAt: number; // Unix timestamp ms
}

const sessionCache = new Map<string, CacheEntry>();

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 menit

// Bersihkan entri yang sudah expired secara periodik (setiap 10 menit)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of sessionCache.entries()) {
      if (entry.expiresAt <= now) {
        sessionCache.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/auth/validate-session
 *
 * Dipanggil oleh middleware.ts untuk memvalidasi session token.
 * Header yang dibutuhkan: X-Session-Token
 *
 * Response:
 *   200: { valid: true, role: string }
 *   200: { valid: false, role: "" }
 */
export async function GET(request: NextRequest) {
  const token = request.headers.get("x-session-token");

  // Jika tidak ada token sama sekali, langsung kembalikan invalid
  if (!token) {
    return NextResponse.json({ valid: false, role: "" });
  }

  // ── 1. Cek Cache ──────────────────────────────────────────────────────────
  const cached = sessionCache.get(token);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ valid: cached.valid, role: cached.role });
  }

  // ── 2. Cache Miss → Validasi ke Backend ──────────────────────────────────
  try {
    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        // Forward cookie agar backend bisa membaca session
        Cookie: `better-auth.session_token=${token}; __Secure-better-auth.session_token=${token}`,
        "Content-Type": "application/json",
        // Spoof origin agar lolos validasi same-origin Better Auth
        Origin: new URL(BACKEND_URL).origin,
        Referer: BACKEND_URL,
        Host: new URL(BACKEND_URL).host,
      },
      // Jangan ikut redirect, kita ingin response mentah
      redirect: "error",
      // Timeout 8 detik agar middleware tidak tergantung lama
      signal: AbortSignal.timeout(8000),
    });

    if (!backendResponse.ok) {
      // Token tidak valid / session expired
      sessionCache.set(token, {
        valid: false,
        role: "",
        expiresAt: Date.now() + 60 * 1000, // Cache "invalid" hanya 1 menit
      });
      return NextResponse.json({ valid: false, role: "" });
    }

    const body = await backendResponse.json();
    const role = body?.data?.user?.role as string | undefined;

    if (!role) {
      // Respons tidak mengandung role — anggap invalid
      return NextResponse.json({ valid: false, role: "" });
    }

    // ── 3. Simpan ke Cache ─────────────────────────────────────────────────
    sessionCache.set(token, {
      valid: true,
      role,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json({ valid: true, role });
  } catch {
    // Timeout atau error koneksi — anggap invalid sementara
    return NextResponse.json({ valid: false, role: "" });
  }
}

/**
 * DELETE /api/auth/validate-session
 *
 * Dipanggil saat logout untuk membersihkan cache token tertentu.
 * Header yang dibutuhkan: X-Session-Token
 */
export async function DELETE(request: NextRequest) {
  const token = request.headers.get("x-session-token");
  if (token) {
    sessionCache.delete(token);
  }
  return NextResponse.json({ cleared: true });
}
