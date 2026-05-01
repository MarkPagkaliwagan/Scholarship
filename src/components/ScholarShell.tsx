"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  FileText,
  GraduationCap,
  Home,
  Key,
  LogOut,
  User,
  type LucideIcon,
} from "lucide-react";

type ScholarShellUser = {
  name?: string;
  email?: string;
};

type ScholarShellProps = {
  user: ScholarShellUser | null;
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  onSignOut: () => void;
  children: React.ReactNode;
};

const scholarNav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/apply", label: "Apply", icon: FileText },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/account", label: "Account Settings", icon: Key },
];

export default function ScholarShell({
  user,
  eyebrow,
  title,
  description,
  actions,
  onSignOut,
  children,
}: ScholarShellProps) {
  const pathname = usePathname();

  return (
    <div className="dashboard-main min-h-screen">
      <aside
        className="fixed left-0 top-0 bottom-0 z-40 hidden w-[248px] flex-col border-r lg:flex"
        style={{
          background:
            "radial-gradient(circle at 28% 0%, rgba(116,198,157,0.14), transparent 30%), linear-gradient(180deg, #10291f 0%, #173629 100%)",
          color: "var(--cream)",
          borderColor: "rgba(255,255,255,0.12)",
          boxShadow: "12px 0 34px rgba(26,60,46,0.14)",
        }}
      >
        <div className="p-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--cream)] text-[var(--green-deep)] shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl font-bold leading-none">Iskolar ng San Pablo</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">
                San Pablo Scholars
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-1">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/34">Records</p>
          <div className="space-y-1">
            {scholarNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 transition-all duration-150 ${
                    isActive ? "bg-white/[0.13] text-white" : "text-white/58 hover:bg-white/[0.07] hover:text-white"
                  }`}
                  title={item.label}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[var(--green-light)]" />
                  )}
                  <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-[var(--green-light)]" : ""}`} />
                  <span className="whitespace-nowrap text-sm font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl bg-black/12 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/38">Signed in</p>
            <p className="mt-1 truncate text-xs text-white/54">{user?.email}</p>
          </div>
          <button
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/58 transition-all hover:bg-white/[0.08] hover:text-white"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="min-h-screen pb-24 pt-6 lg:ml-[248px] lg:pb-0">
        <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[96rem] flex-col px-4 sm:px-6 lg:px-8">
          <header className="mb-6 overflow-hidden rounded-[1.35rem] border border-[var(--sand-soft)] bg-[rgba(255,253,248,0.86)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="eyebrow">{eyebrow}</span>
                </div>
                <h1 className="page-title text-4xl sm:text-5xl">
                  {title}
                </h1>
                <p className="lead mt-3 max-w-2xl text-sm">{description}</p>
              </div>
              {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
            </div>
          </header>

          {children}

          <footer className="mt-auto flex flex-col items-center gap-1 border-t border-[var(--sand-soft)] py-5 text-center text-xs text-[var(--muted)]">
            <span>San Pablo Scholars · Iskolar ng San Pablo</span>
            <span className="inline-flex items-center gap-1.5 font-semibold tracking-[0.08em] text-[var(--green-mid)]">
              <BadgeCheck className="h-3.5 w-3.5" />
              Powered by iGAT
            </span>
          </footer>
        </div>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl lg:hidden"
        style={{
          background: "rgba(255,253,248,0.96)",
          borderColor: "var(--sand-soft)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="grid grid-cols-5 px-3 py-2">
          {scholarNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold"
                style={{ color: isActive ? "var(--green-deep)" : "var(--muted)" }}
              >
                {isActive && (
                  <span className="absolute top-0 h-1 w-8 rounded-full bg-[var(--green-bright)]" />
                )}
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={onSignOut}
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold text-[var(--muted)]"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </nav>
    </div>
  );
}
