import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.posyandubanjarsari.my.id";

const isDev = process.env.NODE_ENV === "development";

// Susun directive CSP
const cspDirectives = [
  `default-src 'self'`,
  // script: izinkan self, inline (Next.js butuhkan), dan Cloudflare Turnstile
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  `script-src-elem 'self' 'unsafe-inline' https://challenges.cloudflare.com`,
  // style: izinkan self, inline (TailwindCSS), dan Google Fonts
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  // font Google Fonts
  `font-src 'self' https://fonts.gstatic.com`,
  // gambar: self, data URI, blob, dan semua HTTPS (untuk avatar, dll)
  `img-src 'self' data: blob: https:`,
  // koneksi: self dan backend API
  `connect-src 'self' ${API_URL} https://challenges.cloudflare.com wss:`,
  // iframe: izinkan Cloudflare Turnstile widget
  `frame-src 'self' https://challenges.cloudflare.com`,
  // melarang embed halaman ini di frame lain (anti-clickjacking)
  `frame-ancestors 'none'`,
  // melarang plugin object/embed
  `object-src 'none'`,
  // worker untuk PWA Service Worker
  `worker-src 'self' blob:`,
  // base URI hanya self
  `base-uri 'self'`,
  // form action hanya self
  `form-action 'self'`,
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  // Anti-clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Cegah MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Kebijakan Referrer
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Batasi fitur browser yang tidak diperlukan
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // HSTS: paksa browser gunakan HTTPS selama 1 tahun (production only dihandle oleh browser cache)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // CSP utama
  { key: "Content-Security-Policy", value: cspDirectives },
];

const nextConfig: NextConfig = {
  /*
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
  */
  turbopack: {},

  async headers() {
    return [
      {
        // Terapkan ke semua route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withPWA(nextConfig);

