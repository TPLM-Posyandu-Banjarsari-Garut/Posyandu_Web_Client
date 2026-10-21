import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://api.posyandubanjarsari.my.id");

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth.session_data",
  "__Secure-better-auth.session_data",
  "better-auth.csrf_token",
  "__Secure-better-auth.csrf_token",
] as const;

/**
 * Helper untuk menghapus seluruh cookie sesi autentikasi pada response
 */
function clearSessionCookies(response: NextResponse): void {
  const cookieOptions = {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  for (const cookieName of SESSION_COOKIE_NAMES) {
    response.cookies.set(cookieName, "", cookieOptions);
  }
}

/**
 * POST /api/auth/logout
 *
 * Handler logout terpusat:
 * 1. Menghapus cache token pada in-memory session cache layer
 * 2. Memanggil backend untuk invalidasi sesi server-side (Better Auth)
 * 3. Selalu membersihkan cookies di browser client secara deterministik
 */
export async function POST(request: NextRequest) {
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  // 1. Invalidate cache internal
  if (sessionToken) {
    try {
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
    } catch (_err) {
      // Kegagalan invalidasi cache internal tidak menghentikan alur logout
    }
  }

  // 2. Beritahu backend sign-out
  let backendRes: Response | null = null;
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const apiUrlObj = new URL(BACKEND_URL);

    backendRes = await fetch(`${BACKEND_URL}/api/auth/sign-out`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
        Origin: apiUrlObj.origin,
        Referer: BACKEND_URL,
        Host: apiUrlObj.host,
      },
    });
  } catch (_err) {
    // Jika backend tidak terjangkau atau rate-limited, proses pembersihan client tetap berjalan
  }

  // 3. Buat response dan bersihkan seluruh cookie sesi
  const response = NextResponse.json({ success: true });

  clearSessionCookies(response);

  // Teruskan Set-Cookie dari backend jika tersedia
  if (backendRes) {
    const setCookies = backendRes.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }
  }

  return response;
}
