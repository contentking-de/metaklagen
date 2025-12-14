import Link from "next/link";
import { Logo } from "@/components/ui";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg
                width={36}
                height={36}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 4L6 10V22C6 33.05 13.68 43.22 24 46C34.32 43.22 42 33.05 42 22V10L24 4Z"
                  fill="#ffffff"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 8L10 13V22C10 30.84 16.16 38.94 24 41.5C31.84 38.94 38 30.84 38 22V13L24 8Z"
                  fill="#1e3a5f"
                />
                <text
                  x="24"
                  y="30"
                  textAnchor="middle"
                  fill="#c9a227"
                  fontSize="20"
                  fontWeight="bold"
                  fontFamily="DM Sans, sans-serif"
                >
                  §
                </text>
              </svg>
              <div className="font-bold text-xl leading-tight">
                <span className="text-white">META</span>{" "}
                <span className="text-accent">Datenschutzklage</span>
              </div>
            </div>
            <p className="text-white/70 max-w-md">
              Wir vertreten Ihre Interessen bei Datenschutzklagen gegen META.
              Professionelle Rechtsberatung mit maximaler Erfolgsquote.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Schnellzugriff</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-accent transition-colors"
                >
                  Startseite
                </Link>
              </li>
              <li>
                <Link
                  href="/formular"
                  className="text-white/70 hover:text-accent transition-colors"
                >
                  Mandat erteilen
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-white/70 hover:text-accent transition-colors"
                >
                  Häufige Fragen
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Rechtliches</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/impressum"
                  className="text-white/70 hover:text-accent transition-colors"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-white/70 hover:text-accent transition-colors"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/agb"
                  className="text-white/70 hover:text-accent transition-colors"
                >
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-white/50 text-sm">
            © {currentYear} META Datenschutzklage. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}

