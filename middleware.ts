import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Konfigurasi Role ─────────────────────────────────────────────────────────
// Daftar role yang diizinkan masuk ke setiap area
const ADMIN_ROLES = new Set(["admin", "posyandu_admin", "village_admin"]);
const BIDAN_ROLES = new Set(["midwife"]);
const KADER_ROLES = new Set(["cadre"]);
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Memvalidasi session token melalui internal API Route yang memiliki Redis cache layer.
 * Ini adalah jembatan antara Edge Runtime (middleware) dan Node.js Runtime (API Route).
 *
 * @returns { valid: boolean, role: string }
 */
async function validateSessionToken(
  request: NextRequest,
  token: string
): Promise<{ valid: boolean; role: string }> {
  try {
    const validateUrl = new URL("/api/auth/validate-session", request.nextUrl.origin);

    const response = await fetch(validateUrl.toString(), {
      method: "GET",
      headers: {
        "x-session-token": token,
      },
      // Timeout 5 detik — jika API Route tidak merespons, tolak akses (fail-secure)
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return { valid: false, role: "" };
    }

    const data = await response.json();
    return {
      valid: Boolean(data?.valid),
      role: String(data?.role ?? ""),
    };
  } catch {
    // Jika terjadi error (timeout, dll), gunakan prinsip fail-secure: tolak akses
    return { valid: false, role: "" };
  }
}

// ─── Helper: Redirect ke Login dengan Reason ─────────────────────────────────
function redirectToLogin(
  request: NextRequest,
  loginPath: string,
  reason: "no_session" | "session_expired" | "unauthorized",
  currentPath: string
): NextResponse {
  const loginUrl = new URL(loginPath, request.url);
  if (reason !== "no_session") {
    loginUrl.searchParams.set("reason", reason);
  }
  if (reason === "no_session" && currentPath !== loginPath) {
    loginUrl.searchParams.set("callbackUrl", currentPath);
  }
  return NextResponse.redirect(loginUrl);
}
// ─────────────────────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ── Bypass: Jangan proxy internal API Routes kita sendiri ─────────────────
  // API Route /api/auth/validate-session dan /api/auth/logout adalah Next.js handler,
  // bukan proxy ke backend — jangan di-rewrite!
  if (
    pathname === "/api/auth/validate-session" ||
    pathname === "/api/auth/logout"
  ) {
    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Proteksi Halaman Admin (/admin/*)
  //    Role yang diizinkan: admin, posyandu_admin, village_admin
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ??
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    // Tahap 1: Jika tidak ada cookie sama sekali → redirect cepat (tanpa hit backend)
    if (!sessionToken) {
      if (isLoginPage) return NextResponse.next();
      return redirectToLogin(request, "/admin/login", "no_session", pathname);
    }

    // Tahap 2: Ada cookie → validasi token sungguhan ke backend (via cache layer)
    if (!isLoginPage) {
      const { valid, role } = await validateSessionToken(request, sessionToken);

      if (!valid) {
        // Token palsu / expired
        return redirectToLogin(request, "/admin/login", "session_expired", pathname);
      }

      if (!ADMIN_ROLES.has(role)) {
        // Token valid tapi bukan admin (misal: midwife mencoba akses /admin)
        return redirectToLogin(request, "/admin/login", "unauthorized", pathname);
      }
    } else {
      // Sudah login dan mencoba akses halaman login → redirect ke dashboard
      return NextResponse.redirect(new URL("/admin/kelola-buat-akun", request.url));
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. Proteksi Halaman Bidan (/bidan/*)
  //    Role yang diizinkan: midwife
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith("/bidan")) {
    const isLoginPage = pathname === "/bidan/login";

    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ??
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionToken) {
      if (isLoginPage) return NextResponse.next();
      return redirectToLogin(request, "/bidan/login", "no_session", pathname);
    }

    if (!isLoginPage) {
      const { valid, role } = await validateSessionToken(request, sessionToken);

      if (!valid) {
        return redirectToLogin(request, "/bidan/login", "session_expired", pathname);
      }

      if (!BIDAN_ROLES.has(role)) {
        return redirectToLogin(request, "/bidan/login", "unauthorized", pathname);
      }
    } else {
      return NextResponse.redirect(new URL("/bidan/home", request.url));
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Proteksi Halaman Kader (/kader/*)
  //    Role yang diizinkan: cadre
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith("/kader")) {
    const isLoginPage = pathname === "/kader/login";

    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ??
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionToken) {
      if (isLoginPage) return NextResponse.next();
      return redirectToLogin(request, "/kader/login", "no_session", pathname);
    }

    if (!isLoginPage) {
      const { valid, role } = await validateSessionToken(request, sessionToken);

      if (!valid) {
        return redirectToLogin(request, "/kader/login", "session_expired", pathname);
      }

      if (!KADER_ROLES.has(role)) {
        return redirectToLogin(request, "/kader/login", "unauthorized", pathname);
      }
    } else {
      return NextResponse.redirect(new URL("/kader/home", request.url));
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Proteksi Halaman Orang Tua (/orangtua/*)
  //    Tetap cookie-name check (tidak diubah) karena cookie Google OAuth
  //    berada di domain backend, bukan di proxy Next.js.
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith("/orangtua")) {
    const isLoginPage = pathname === "/orangtua/login";
    const isOtpPage = pathname === "/orangtua/otp";

    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ??
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionToken && !isLoginPage && !isOtpPage) {
      const loginUrl = new URL("/orangtua/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Proxy Rute API (/api/*) ke Backend Production
  //    Internal routes (/api/auth/validate-session, /api/auth/logout)
  //    sudah di-bypass di awal fungsi ini.
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith("/api")) {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ??
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://api.posyandubanjarsari.my.id");


    const apiUrlObj = new URL(API_URL);

    // Kloning headers dari request asal
    const requestHeaders = new Headers(request.headers);

    // Jangan ubah Origin dan Referer agar Better Auth menerima origin asli client (misal: http://localhost:3001) yang terdaftar di trustedOrigins
    // requestHeaders.set("origin", apiUrlObj.origin);
    // requestHeaders.set("referer", API_URL);

    // Ubah Host header agar sesuai dengan host backend production
    requestHeaders.set("host", apiUrlObj.host);

    // Buat target URL untuk proxying
    const targetUrl = new URL(pathname + request.nextUrl.search, API_URL);

    // Lakukan rewrite dengan header yang telah dimodifikasi
    const response = NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  }
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/bidan/:path*",
    "/kader/:path*",
    "/orangtua/:path*",
  ],
};
