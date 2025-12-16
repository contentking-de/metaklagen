import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // CSP für Signing-Seite anpassen, um PandaDoc zu erlauben
        source: "/signing/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self' 'unsafe-eval' 'unsafe-inline' 'unsafe-hashes' data: blob: https://*.pandadoc.com https://*.pandadoc.eu https://*.pandadoc-static.com https://cdn.pandadoc.com https://p.typekit.net https://sentry.infrastructure.pandadoc.com",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'unsafe-hashes' https://*.pandadoc.com https://*.pandadoc.eu https://*.pandadoc-static.com https://cdn.pandadoc.com https://p.typekit.net",
              "style-src 'self' 'unsafe-inline' https://*.pandadoc.com https://*.pandadoc.eu https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.pandadoc.com https://*.pandadoc.eu https://*.pandadoc-static.com https://p.typekit.net",
              "font-src 'self' data: https://*.pandadoc.com https://*.pandadoc.eu https://fonts.gstatic.com https://p.typekit.net",
              "connect-src 'self' https://*.pandadoc.com https://*.pandadoc.eu https://api.pandadoc.com https://*.pandadoc-static.com https://p.typekit.net https://sentry.infrastructure.pandadoc.com",
              "frame-src 'self' https://*.pandadoc.com https://*.pandadoc.eu https://app.pandadoc.com https://app.pandadoc.eu",
              "frame-ancestors 'self' https://*.pandadoc.com https://*.pandadoc.eu",
              "worker-src 'self' blob: https://*.pandadoc.com https://*.pandadoc.eu",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
