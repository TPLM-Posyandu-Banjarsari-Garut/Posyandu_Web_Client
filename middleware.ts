import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Konfigurasi Role & Akses Portal ──────────────────────────────────────────
const ADMIN_ROLES = new Set(["admin", "posyandu_admin", "village_admin"]);
const BIDAN_ROLES = new Set(["midwife"]);
const KADER_ROLES = new Set(["cadre"]);

/**
 * Mendapatkan URL beranda resmi sesuai role pengguna yang sedang login.
 * Mencegah redirect loop ketika pengguna mengakses halaman login / portal role lain.
 */
function getHomePathForRole(role: string): string {
  if (ADMIN_ROLES.has(role)) return "/admin/kelola-buat-akun";
  if (BIDAN_ROLES.has(role)) return "/bidan/home";
  if (KADER_ROLES.has(role)) return "/kader/home";
  if (role === "parent") return "/orangtua/home";
  return "/";
}

/**
 * Memvalidasi session token melalui internal API Route yang memiliki cache layer.
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
      // Timeout 5 detik (fail-secure)
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
    return { valid: false, role: "" };
  }
}

/**
 * Helper untuk mengarahkan pengguna yang belum terautentikasi ke halaman login yang tepat.
 */
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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ── 1. Bypass: Internal API Routes ──────────────────────────────────────────
  if (
    pathname === "/api/auth/validate-session" ||
    pathname === "/api/auth/logout"
  ) {
    return NextResponse.next();
  }

  // Ambil token session dari cookie (support nama dev dan __Secure- di production)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  // ── 2. Auto Redirect Root (/) ke Portal Sesuai Role ─────────────────────────
  if (pathname === "/") {
    if (sessionToken) {
      const { valid, role } = await validateSessionToken(request, sessionToken);
      if (valid && role) {
        return NextResponse.redirect(new URL(getHomePathForRole(role), request.url));
      }
    }
    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Proteksi Portal Admin (/admin/*)
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith("/admin")) {
    const isAuthPage = pathname === "/admin/login" || pathname.startsWith("/admin/lupa-password");

    if (!sessionToken) {
      if (isAuthPage) return NextResponse.next();
      return redirectToLogin(request, "/admin/login", "no_session", pathname);
    }

    const { valid, role } = await validateSessionToken(request, sessionToken);

    if (!valid) {
      if (isAuthPage) return NextResponse.next();
      return redirectToLogin(request, "/admin/login", "session_expired", pathname);
    }

    // Jika sudah login dan membuka halaman login/auth
    if (isAuthPage) {
      return NextResponse.redirect(new URL(getHomePathForRole(role), request.url));
    }

    // Jika membuka halaman terlindungi tapi bukan admin
    if (!ADMIN_ROLES.has(role)) {
      return NextResponse.redirect(new URL(getHomePathForRole(role), request.url));
    }

    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Proteksi Portal Bidan (/bidan/*)
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith("/bidan")) {
    const isAuthPage = pathname === "/bidan/login" || pathname.startsWith("/bidan/lupa-password");

    if (!sessionToken) {
      if (isAuthPage) return NextResponse.next();
      return redirectToLogin(request, "/bidan/login", "no_session", pathname);
    }

    const { valid, role } = await validateSessionToken(request, sessionToken);

    if (!valid) {
      if (isAuthPage) return NextResponse.next();
      return redirectToLogin(request, "/bidan/login", "session_expired", pathname);
    }

    // Jika sudah login dan membuka halaman login/auth
    if (isAuthPage) {
      return NextResponse.redirect(new URL(getHomePathForRole(role), request.url));
    }

    // Jika membuka halaman terlindungi tapi bukan bidan
    if (!BIDAN_ROLES.has(role)) {
      return NextResponse.redirect(new URL(getHomePathForRole(role), request.url));
    }

    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Proteksi Portal Kader (/kader/*)
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith("/kader")) {
    const isAuthPage = pathname === "/kader/login" || pathname.startsWith("/kader/lupa-password");

    if (!sessionToken) {
      if (isAuthPage) return NextResponse.next();
      return redirectToLogin(request, "/kader/login", "no_session", pathname);
    }

    const { valid, role } = await validateSessionToken(request, sessionToken);

    if (!valid) {
      if (isAuthPage) return NextResponse.next();
      return redirectToLogin(request, "/kader/login", "session_expired", pathname);
    }

    // Jika sudah login dan membuka halaman login/auth
    if (isAuthPage) {
      return NextResponse.redirect(new URL(getHomePathForRole(role), request.url));
    }

    // Jika membuka halaman terlindungi tapi bukan kader
    if (!KADER_ROLES.has(role)) {
      return NextResponse.redirect(new URL(getHomePathForRole(role), request.url));
    }

    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. Proteksi Portal Orang Tua (/orangtua/*)
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith("/orangtua")) {
    const isAuthPage =
      pathname === "/orangtua/login" ||
      pathname === "/orangtua/otp" ||
      pathname.startsWith("/orangtua/lupa-password");

    if (!sessionToken) {
      if (isAuthPage) return NextResponse.next();
      return redirectToLogin(request, "/orangtua/login", "no_session", pathname);
    }

    const { valid, role } = await validateSessionToken(request, sessionToken);

    if (!valid) {
      if (isAuthPage) return NextResponse.next();
      return redirectToLogin(request, "/orangtua/login", "session_expired", pathname);
    }

    // Jika sudah login dan membuka halaman auth
    if (isAuthPage) {
      return NextResponse.redirect(new URL(getHomePathForRole(role), request.url));
    }

    // Jika membuka halaman terlindungi orang tua tapi bukan parent
    if (role !== "parent") {
      return NextResponse.redirect(new URL(getHomePathForRole(role), request.url));
    }

    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. Proxy Rute API (/api/*) ke Backend Production
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith("/api")) {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ??
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://api.posyandubanjarsari.my.id");

    const apiUrlObj = new URL(API_URL);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("host", apiUrlObj.host);

    const targetUrl = new URL(pathname + request.nextUrl.search, API_URL);

    return NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }
}

export const config = {
  matcher: [
    "/",
    "/api/:path*",
    "/admin/:path*",
    "/bidan/:path*",
    "/kader/:path*",
    "/orangtua/:path*",
  ],
};
