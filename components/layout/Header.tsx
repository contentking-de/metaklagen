"use client";

import Link from "next/link";
import { Logo, Button } from "@/components/ui";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#vorteile"
              className="text-text-muted hover:text-primary transition-colors font-medium"
            >
              Vorteile
            </Link>
            <Link
              href="/#ablauf"
              className="text-text-muted hover:text-primary transition-colors font-medium"
            >
              Ablauf
            </Link>
            <Link
              href="/#faq"
              className="text-text-muted hover:text-primary transition-colors font-medium"
            >
              FAQ
            </Link>
            <Link href="/formular">
              <Button variant="primary" size="sm">
                Jetzt Mandat erteilen
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-primary"
            aria-label="Menü öffnen"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              <Link
                href="/#vorteile"
                className="text-text-muted hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Vorteile
              </Link>
              <Link
                href="/#ablauf"
                className="text-text-muted hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Ablauf
              </Link>
              <Link
                href="/#faq"
                className="text-text-muted hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link href="/formular" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Jetzt Mandat erteilen
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

