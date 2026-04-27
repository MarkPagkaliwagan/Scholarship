"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { GraduationCap, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How to Apply", href: "/howtoapply" },
  { label: "Track", href: "/tracking" },
  { label: "Contact", href: "/contacts" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authClient.getSession();
      setUser(session?.data?.user ?? null);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await authClient.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(248,245,239,0.97)" : "rgba(248,245,239,0.80)",
        backdropFilter: "blur(14px)",
        borderBottom: scrolled ? "1px solid var(--sand)" : "1px solid transparent",
      }}
    >
      <div className="w-full h-0.5" style={{ background: "var(--green-deep)" }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-4 group">
            <div
              className="w-12 h-12 flex items-center justify-center rounded-xl transition-opacity group-hover:opacity-90"
              style={{ background: "var(--green-deep)" }}
            >
              <GraduationCap className="w-6 h-6" style={{ color: "var(--cream)" }} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold tracking-tight" style={{ color: "var(--green-deep)" }}>
                Scholarship Office
              </span>
              <span className="font-mono text-[9px] tracking-[0.18em] uppercase mt-0.5" style={{ color: "var(--muted)" }}>
                City Government of San Pablo
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-6 font-body text-[10.5px] tracking-[0.13em] uppercase font-medium transition-colors duration-200"
                  style={{ color: isActive ? "var(--green-deep)" : "var(--muted)" }}
                >
                  {link.label}
                  <span
                    className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-all duration-300 origin-center"
                    style={{
                      background: "var(--green-bright)",
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg" onClick={() => setMenuOpen(!menuOpen)} style={{ color: "var(--green-deep)" }}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t" style={{ background: "var(--cream)", borderColor: "var(--sand)" }}>
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className="px-3 py-2.5 rounded-lg font-body text-sm" style={{ color: isActive ? "var(--green-deep)" : "var(--muted)", background: isActive ? "rgba(45,106,79,0.07)" : "transparent", fontWeight: isActive ? 600 : 400 }}>
                  {link.label}
                </Link>
              );
            })}
            {user ? (
              <>
                <Link href="/dashboard" className="px-3 py-2.5 rounded-lg font-body text-sm" style={{ color: "var(--green-deep)" }}>Dashboard</Link>
                <Link href="/profile" className="px-3 py-2.5 rounded-lg font-body text-sm" style={{ color: "var(--green-deep)" }}>My Profile</Link>
                <button onClick={handleSignOut} className="px-3 py-2.5 rounded-lg font-body text-sm text-left" style={{ color: "#dc2626" }}>Sign Out</button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}