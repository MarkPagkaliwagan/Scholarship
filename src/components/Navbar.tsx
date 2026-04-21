"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home",            href: "/" },
  { label: "About",           href: "/about" },
  { label: "How to Apply",    href: "/howtoapply" },
  { label: "Track Application", href: "/tracking" },
  { label: "Contact",         href: "/contacts" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
      style={{ background: "rgba(248,245,239,0.92)", borderColor: "var(--sand)" }}>
      <nav className="max-w-6xl mx-auto px-6 py-0 flex items-center justify-between h-20">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl transition-colors"
            style={{ background: "var(--green-deep)" }}>
            <GraduationCap className="w-6 h-6" style={{ color: "var(--cream)" }} />
          </div>
          <div className="flex flex-col justify-center leading-none">
            <span className="font-display text-sm font-bold tracking-tight"
              style={{ color: "var(--green-deep)" }}>Scholarship Office</span>
            <span className="font-mono text-[10px] tracking-wider uppercase"
              style={{ color: "var(--muted)" }}>City Government of San Pablo</span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-xs tracking-widest uppercase transition-colors relative group"
                  style={{ color: isActive ? "var(--green-deep)" : "var(--muted)" }}>
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                    style={{
                      background: "var(--green-bright)",
                      width: isActive ? "100%" : "0",
                    }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ color: "var(--green-deep)" }}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-6 py-4"
          style={{ background: "var(--cream)", borderColor: "var(--sand)" }}>
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm font-medium transition-colors"
                    style={{ color: isActive ? "var(--green-deep)" : "var(--muted)" }}
                    onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}