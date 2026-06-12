import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Proteksi Halaman Admin (/admin/*)
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // Ambil session token dari cookie better-auth
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ??
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    // Jika pengguna belum login dan mencoba mengakses halaman admin selain login
    if (!sessionToken && !isLoginPage) {
      const loginUrl = new URL("/admin/login", request.url);
      // Simpan URL asal untuk redirect setelah login berhasil (optional)
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Jika pengguna sudah login dan mencoba mengakses halaman login kembali
    if (sessionToken && isLoginPage) {
      return NextResponse.redirect(new URL("/admin/kelola-buat-akun", request.url));
    }
  }

  // 2. Proxy Rute API (/api/*) ke Backend Production
  if (pathname.startsWith("/api")) {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ?? "https://api.posyandubanjarsari.my.id";

    const apiUrlObj = new URL(API_URL);

    // Kloning headers dari request asal
    const requestHeaders = new Headers(request.headers);

    // Ubah Origin dan Referer ke URL API agar lolos validasi keamanan Better Auth (Same-Origin)
    requestHeaders.set("origin", apiUrlObj.origin);
    requestHeaders.set("referer", API_URL);
    
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

    // Jika melakukan sign-out, paksa hapus cookie session di browser lokal
    if (pathname === "/api/auth/sign-out") {
      response.cookies.set("better-auth.session_token", "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
      });
      response.cookies.set("__Secure-better-auth.session_token", "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
      });
    }

    return response;
  }
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
