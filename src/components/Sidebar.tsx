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
      <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t border-white/10 lg:hidden" style={{ background: "#0d1117", paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="flex items-center justify-around px-4 py-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon as React.ComponentType<{ className?: string }>;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg relative"
                style={{ color: isActive ? "#10b981" : "rgba(255,255,255,0.6)" }}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500" />
                )}
                {Icon && <Icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" : ""}`} />}
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
        className="fixed top-0 right-0 z-50 h-full w-64 shadow-2xl transform transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          background: "#0d1117",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          opacity: menuOpen ? 1 : 0,
        }}
      >
        {/* Header with pulse dot */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
            <span className="font-mono text-[10px] font-medium text-green-400 tracking-wider">SYSTEM ONLINE</span>
          </div>
          <button onClick={() => setMenuOpen(false)} className="opacity-50 hover:opacity-100 transition-opacity">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-6 mb-2">
            <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">PAGES</span>
          </div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon as React.ComponentType<{ className?: string }>;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center gap-3 px-6 py-3 transition-all duration-200"
                style={{ color: isActive ? "white" : "rgba(255,255,255,0.6)" }}
                onClick={() => setMenuOpen(false)}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-green-400 to-blue-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                )}

                {/* Hover gradient wash */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                {Icon && <Icon className="w-5 h-5 relative z-10" />}
                <span className="text-sm font-medium relative z-10">{item.label}</span>

                {/* Chevron on hover */}
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-green-400" />
              </Link>
            );
          })}

          {isDashboard && (
            <>
              <div className="px-6 mt-6 mb-2">
                <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">ACCOUNT</span>
              </div>

              <button
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
                className="group relative flex items-center gap-3 px-6 py-3 w-full transition-all duration-200 text-red-400 hover:bg-red-500/10"
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
