"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { GraduationCap, Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How to Apply", href: "/howtoapply" },
  { label: "Track", href: "/tracking" },
  { label: "Contact", href: "/contacts" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,253,248,0.96)" : "rgba(255,253,248,0.76)",
          backdropFilter: scrolled ? "blur(14px)" : "blur(14px)",
          borderBottom: scrolled ? "1px solid var(--sand-soft)" : "1px solid rgba(212,201,176,0.36)",
        }}
      >
        <div className="w-full h-0.5" style={{ background: "var(--green-deep)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: "var(--green-deep)" }}>
                <GraduationCap className="w-5 h-5" style={{ color: "var(--cream)" }} />
              </div>
              <div className="flex flex-col leading-none min-w-0">
                <span className="font-display text-base font-bold tracking-tight truncate" style={{ color: "var(--green-deep)" }}>Iskolar ng San Pablo</span>
                <span className="font-mono text-[8px] tracking-[0.15em] uppercase mt-0.5 truncate" style={{ color: "var(--muted)" }}>City Government of San Pablo</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} className="relative px-4 py-6 font-body text-[10.5px] tracking-[0.13em] uppercase font-medium transition-colors duration-200" style={{ color: isActive ? "var(--green-deep)" : "var(--muted)" }}>
                    {link.label}
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-all duration-300 origin-center" style={{ background: "var(--green-bright)", transform: isActive ? "scaleX(1)" : "scaleX(0)", opacity: isActive ? 1 : 0 }} />
                  </Link>
                );
              })}
            </nav>

            <button
              className="md:hidden p-3 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ color: "var(--green-deep)" }}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Menu - Slides down below navbar */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        className={`fixed left-0 right-0 z-50 md:hidden transition-all duration-300 ease-out`}
        style={{
          background: "var(--paper)",
          top: "64px",
          maxHeight: menuOpen ? "calc(100vh - 64px)" : "0",
          overflowY: "auto",
          boxShadow: menuOpen ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
        }}
      >
        <nav className="px-4 py-3 space-y-1" role="navigation" aria-label="Mobile menu links">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200"
                style={{ background: isActive ? "rgba(45,106,79,0.07)" : "transparent", color: isActive ? "var(--green-deep)" : "var(--muted)" }}
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-sm font-medium">{link.label}</span>
                {isActive && <ChevronRight className="w-4 h-4" style={{ color: "var(--green-bright)" }} />}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
