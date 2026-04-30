"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { GraduationCap, Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

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
  const [user, setUser] = useState<null | { name?: string; email?: string }>(null);

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

  const handleSignOut = async () => {
    await authClient.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,253,248,0.96)" : "rgba(255,253,248,0.76)",
        backdropFilter: scrolled ? "blur(14px)" : "blur(14px)",
        borderBottom: scrolled ? "1px solid var(--sand-soft)" : "1px solid rgba(212,201,176,0.36)",
      }}
    >
      <div className="w-full h-0.5" style={{ background: "var(--green-deep)" }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-4 group">
            <div
              className="w-11 h-11 flex items-center justify-center rounded-lg transition-opacity group-hover:opacity-90"
              style={{ background: "var(--green-deep)" }}
            >
              <GraduationCap className="w-6 h-6" style={{ color: "var(--cream)" }} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold tracking-tight" style={{ color: "var(--green-deep)" }}>
                Iskolar ng San Pablo
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

      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        navLinks={navLinks}
        pathname={pathname}
        user={user}
        handleSignOut={handleSignOut}
      />
    </header>
  );
}
