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
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'unsafe-hashes' https://*.pandadoc.com https://*.pandadoc.eu https://cdn.pandadoc.com https://p.typekit.net",
              "style-src 'self' 'unsafe-inline' https://*.pandadoc.com https://*.pandadoc.eu https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.pandadoc.com https://*.pandadoc.eu https://*.pandadoc-static.com https://p.typekit.net",
              "font-src 'self' data: https://*.pandadoc.com https://*.pandadoc.eu https://fonts.gstatic.com https://p.typekit.net",
              "connect-src 'self' https://*.pandadoc.com https://*.pandadoc.eu https://api.pandadoc.com https://api-eu.pandadoc.com https://p.typekit.net",
              "frame-src 'self' https://*.pandadoc.com https://*.pandadoc.eu https://app.pandadoc.com https://app.pandadoc.eu",
              "frame-ancestors 'self'",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
