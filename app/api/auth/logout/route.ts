import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://api.posyandubanjarsari.my.id");

/**
 * POST /api/auth/logout
 *
 * Proper logout handler yang:
 * 1. Membaca session token dari cookie request
 * 2. Menghapus cache token dari validate-session cache layer
 * 3. Memanggil backend untuk sign-out server-side
 * 4. Menghapus cookie di browser dengan Set-Cookie maxAge=0
 */
export async function POST(request: NextRequest) {
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  // ── 1. Hapus cache dari validate-session layer ─────────────────────────────
  if (sessionToken) {
    try {
      // Panggil internal API Route kita sendiri untuk hapus cache
      const internalUrl = new URL(
        "/api/auth/validate-session",
        request.nextUrl.origin
      );
      await fetch(internalUrl.toString(), {
        method: "DELETE",
        headers: {
          "x-session-token": sessionToken,
        },
      });
    } catch {
      // Gagal hapus cache tidak critical, lanjutkan proses logout
    }
  }

  // ── 2. Panggil backend sign-out (server-side session invalidation) ─────────
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const apiUrlObj = new URL(BACKEND_URL);

    await fetch(`${BACKEND_URL}/api/auth/sign-out`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
        Origin: apiUrlObj.origin,
        Referer: BACKEND_URL,
        Host: apiUrlObj.host,
      },
    });
  } catch {
    // Jika backend tidak terjangkau, tetap lanjutkan logout di client-side
  }

  // ── 3. Buat response dan hapus semua cookie session di browser ─────────────
  const response = NextResponse.json({ success: true });

  const cookieOptions = {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };

  // Hapus kedua varian cookie (http dan https)
  response.cookies.set("better-auth.session_token", "", cookieOptions);
  response.cookies.set(
    "__Secure-better-auth.session_token",
    "",
    cookieOptions
  );

  return response;
}
