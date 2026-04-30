"use client";

import Link from "next/link";
import { X, ChevronRight, User, LogOut, Home } from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  navLinks?: { label: string; href: string; icon?: React.ComponentType<{ className?: string }> }[];
  pathname: string;
  user: { name?: string; email?: string } | null;
  handleSignOut: () => void;
  isDashboard?: boolean;
}

const dashboardMenuItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/profile", label: "My Profile", icon: User },
];

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Sidebar({ menuOpen, setMenuOpen, navLinks, pathname, user, handleSignOut, isDashboard = false }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = isDashboard ? dashboardMenuItems : navLinks || [];

  // Mobile Bottom Navigation (Dashboard only, ≤640px)
  if (isMobile && isDashboard) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t lg:hidden" style={{ background: "rgba(255,253,248,0.96)", borderColor: "var(--sand-soft)", paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="flex items-center justify-around px-4 py-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon as React.ComponentType<{ className?: string }>;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg relative"
                style={{ color: isActive ? "var(--green-deep)" : "var(--muted)" }}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full" style={{ background: "var(--green-bright)" }} />
                )}
                {Icon && <Icon className="w-5 h-5" />}
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  // Desktop/Tablet Drawer (hidden on mobile, hidden for dashboard on desktop)
  if (isMobile || isDashboard) return null;

  // Don't render drawer if menu is closed (for non-dashboard)
  if (!menuOpen) return null;

  // Desktop/Tablet Drawer
  return (
    <>
      <div
        className="fixed inset-0 z-40 backdrop-blur-sm"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className="fixed top-0 right-0 z-50 h-full w-64 shadow-2xl transform transition-all duration-300 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]"
        style={{
          background: "var(--paper)",
          borderLeft: "1px solid var(--sand-soft)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--sand-soft)" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--green-deep)" }}>
              <Home className="w-4 h-4" style={{ color: "var(--cream)" }} />
            </div>
            <span className="font-display text-base font-bold" style={{ color: "var(--green-deep)" }}>Scholarship Office</span>
          </div>
          <button onClick={() => setMenuOpen(false)} className="opacity-50 hover:opacity-100 transition-opacity">
            <X className="w-5 h-5" style={{ color: "var(--green-deep)" }} />
          </button>
        </div>

        {user && (
          <div className="p-6 border-b" style={{ borderColor: "var(--sand-soft)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--green-deep)" }}>
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--green-deep)" }}>{user.name}</p>
                <p className="text-xs truncate" style={{ color: "var(--muted)" }}>{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-6 mb-2">
            <span className="value-label">Pages</span>
          </div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon as React.ComponentType<{ className?: string }>;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center gap-3 px-6 py-3 transition-all duration-200"
                style={{ color: isActive ? "var(--green-deep)" : "var(--muted)" }}
                onClick={() => setMenuOpen(false)}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full" style={{ background: "var(--green-bright)" }} />
                )}

                <div className="absolute inset-x-3 inset-y-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "rgba(45,106,79,0.07)" }} />

                {Icon && <Icon className="w-5 h-5 relative z-10" />}
                <span className="text-sm font-medium relative z-10">{item.label}</span>

                <ChevronRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 relative z-10" style={{ color: "var(--green-bright)" }} />
              </Link>
            );
          })}

          {isDashboard && (
            <>
              <div className="px-6 mt-6 mb-2">
                <span className="value-label">Account</span>
              </div>

              <button
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
                className="group relative flex items-center gap-3 px-6 py-3 w-full transition-all duration-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
