"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  GraduationCap,
  FileText,
  Award,
  Clock,
  Search,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  LogIn,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// ─── Data ───────────────────────────────────────────────────────────────────

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Prepare Documents",
    desc: "Gather your grades, certificate of residency, and all required supporting documents.",
  },
  {
    icon: Clock,
    step: "02",
    title: "Submit Online",
    desc: "Complete the application form and upload your compiled documents before the deadline.",
  },
  {
    icon: Search,
    step: "03",
    title: "Evaluation",
    desc: "The committee reviews your application. Track your status anytime via the portal.",
  },
  {
    icon: Award,
    step: "04",
    title: "Awarding",
    desc: "Qualified scholars are notified for official contract signing and distribution.",
  },
];

const stats = [
  { value: "2,400+", label: "Active Scholars" },
  { value: "₱18M", label: "Disbursed This Year" },
  { value: "94%", label: "Graduation Rate" },
  { value: "12", label: "Partner Universities" },
];

// ─── Desktop Slide-In Login Panel ────────────────────────────────────────────

interface LoginPanelProps {
  open: boolean;
  onClose: () => void;
}

function LoginPanel({ open, onClose }: LoginPanelProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    const { error } = await authClient.signIn.email({ email, password });
    setIsLoading(false);
    if (error) {
      setLoginError(error.message ?? "Invalid email or password.");
      return;
    }
    onClose();
    router.push("/dashboard");
  };

  const inputBase =
    "w-full py-3.5 rounded-xl font-body text-sm outline-none transition-all duration-200 placeholder:text-[#9aab9e]";

  return (
    <>
      {/* ── DESKTOP SLIDE-IN PANEL ──────────────────────────── */}
      <div className="hidden md:block">
        {/* Backdrop — subtle dark overlay on the left content */}
        <div
          className={`fixed inset-0 z-[100] transition-all duration-500 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{ background: "rgba(15, 23, 42, 0.40)", backdropFilter: open ? "blur(3px)" : "blur(0px)" }}
          onClick={onClose}
        />

        {/* Slide panel — comes from right */}
        <div
          className={`fixed top-0 right-0 h-full z-[110] flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ width: "min(520px, 48vw)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Sign in"
        >
          {/* Decorative left edge tab */}
          <div
            className={`absolute -left-[52px] top-1/2 -translate-y-1/2 transition-all duration-500 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={onClose}
              className="w-[52px] h-[52px] flex items-center justify-center rounded-l-2xl transition-colors hover:bg-gray-100"
              style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRight: "none" }}
              aria-label="Close login panel"
            >
              <X className="w-5 h-5" style={{ color: "#374151" }} />
            </button>
          </div>

          {/* Panel body */}
          <div
            className="w-full h-full flex flex-col overflow-y-auto"
            style={{
              background: "#ffffff",
              boxShadow: "-24px 0 80px rgba(0,0,0,0.18)",
            }}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full flex-shrink-0" style={{ background: "linear-gradient(90deg, #1a3c2e 0%, #2d6a4f 50%, #40916c 100%)" }} />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full px-10 py-10">

              {/* Header brand */}
              <div className="flex items-center gap-3 mb-10 pb-8" style={{ borderBottom: "1px solid #e8ece9" }}>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#1a3c2e" }}
                >
                  <GraduationCap className="w-5 h-5" style={{ color: "#d8f3dc" }} />
                </div>
                <div>
                  <p className="font-display text-[15px] font-bold leading-none" style={{ color: "#1a3c2e" }}>
                    San Pablo City Government
                  </p>
                  <p className="font-body text-[11px] tracking-wider uppercase mt-0.5" style={{ color: "#7a9485" }}>
                    Scholarship Management Portal
                  </p>
                </div>
              </div>

              {/* Headline */}
              <div className="mb-8">
                <h2
                  className="font-display text-[28px] font-bold leading-tight mb-2"
                  style={{ color: "#111827" }}
                >
                  Sign in to your account
                </h2>
                <p className="font-body text-[14px] leading-relaxed" style={{ color: "#6b7280" }}>
                  Access your scholarship dashboard and application status.
                </p>
              </div>

              {/* Status badge */}
              <div
                className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-md mb-7"
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75"
                    style={{ background: "#22c55e" }}
                  />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#22c55e" }} />
                </span>
                <span className="font-body text-[11px] font-medium" style={{ color: "#15803d" }}>
                  A.Y. 2026 — Applications currently open
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="flex flex-col gap-5 flex-1">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email-panel"
                    className="block font-body text-[12px] font-semibold mb-1.5"
                    style={{ color: "#374151" }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "#9ca3af" }}
                    />
                    <input
                      id="email-panel"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                      required
                      className={`${inputBase} pl-10 pr-4`}
                      style={{
                        background: "#f9fafb",
                        color: "#111827",
                        border: "1.5px solid #d1d5db",
                        borderRadius: "10px",
                      }}
                      onFocus={(e) => {
                        e.target.style.background = "#ffffff";
                        e.target.style.borderColor = "#2d6a4f";
                        e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,0.10)";
                      }}
                      onBlur={(e) => {
                        e.target.style.background = "#f9fafb";
                        e.target.style.borderColor = "#d1d5db";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password-panel"
                    className="block font-body text-[12px] font-semibold mb-1.5"
                    style={{ color: "#374151" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "#9ca3af" }}
                    />
                    <input
                      id="password-panel"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className={`${inputBase} pl-10 pr-12`}
                      style={{
                        background: "#f9fafb",
                        color: "#111827",
                        border: "1.5px solid #d1d5db",
                        borderRadius: "10px",
                      }}
                      onFocus={(e) => {
                        e.target.style.background = "#ffffff";
                        e.target.style.borderColor = "#2d6a4f";
                        e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,0.10)";
                      }}
                      onBlur={(e) => {
                        e.target.style.background = "#f9fafb";
                        e.target.style.borderColor = "#d1d5db";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded transition-colors hover:bg-gray-100"
                      style={{ color: "#9ca3af" }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer"
                      style={{ accentColor: "#2d6a4f" }}
                    />
                    <span className="font-body text-[13px]" style={{ color: "#6b7280" }}>
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="font-body text-[13px] font-medium hover:underline underline-offset-2 transition-colors"
                    style={{ color: "#2d6a4f" }}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full py-3.5 rounded-xl font-body text-[14px] font-semibold transition-all duration-200 overflow-hidden hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 mt-1"
                  style={{
                    background: "#1a3c2e",
                    color: "#ffffff",
                    boxShadow: "0 4px 16px -4px rgba(26,60,46,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = "#2d6a4f";
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = "#1a3c2e";
                  }}
                >
                  <span
                    className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${
                      isLoading ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In to Dashboard
                  </span>
                  {isLoading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </span>
                  )}
                </button>

                {loginError && (
                  <p className="text-red-500 text-xs text-center -mt-2">{loginError}</p>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
                  <span className="font-body text-[12px]" style={{ color: "#9ca3af" }}>or</span>
                  <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
                </div>

                <p className="text-center font-body text-[13px]" style={{ color: "#6b7280" }}>
                  No account yet?{" "}
                  <Link
                    href="/apply"
                    className="font-semibold hover:underline underline-offset-2 transition-colors"
                    style={{ color: "#2d6a4f" }}
                  >
                    Apply for a Scholarship
                  </Link>
                </p>

                {/* Bottom spacer */}
                <div className="flex-1" />

                {/* Footer note */}
                <div
                  className="rounded-lg px-4 py-3 mt-2"
                  style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
                >
                  <p className="font-body text-[11px] leading-relaxed text-center" style={{ color: "#9ca3af" }}>
                    <span className="font-semibold" style={{ color: "#6b7280" }}>City Government of San Pablo</span>
                    <br />
                    Scholarship Office · (049) 562-0000
                    <br />
                    For official use only. Unauthorized access is prohibited.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM SHEET ──────────────────────────────── */}
      <div
        className={`md:hidden fixed inset-0 z-[200] transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(10, 28, 20, 0.72)", backdropFilter: "blur(10px)" }}
          onClick={onClose}
        />

        {/* Sheet */}
        <div className="absolute inset-0 flex items-end justify-center">
          <div
            className={`w-full transition-all duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
            style={{ background: "#faf8f3", borderRadius: "28px 28px 0 0", padding: "32px 24px 40px" }}
          >
            <div className="mx-auto w-10 h-1 rounded-full mb-7" style={{ background: "#d8d4cc" }} />

            <div className="flex items-center gap-3 mb-7">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "#1a3c2e" }}
              >
                <GraduationCap className="w-5 h-5" style={{ color: "#d8f3dc" }} />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold" style={{ color: "#1a3c2e" }}>
                  Welcome back
                </h2>
                <p className="font-body text-xs mt-0.5" style={{ color: "#7a9485" }}>
                  Sign in to your account
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "#9aab9e" }}
                />
                <input
                  id="email-mobile"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  className={`${inputBase} pl-11 pr-4`}
                  style={{ background: "#f0ede6", color: "#1a3c2e", border: "2px solid transparent" }}
                  onFocus={(e) => {
                    e.target.style.background = "#fff";
                    e.target.style.borderColor = "#2d6a4f";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "#f0ede6";
                    e.target.style.borderColor = "transparent";
                  }}
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "#9aab9e" }}
                />
                <input
                  id="password-mobile"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  className={`${inputBase} pl-11 pr-12`}
                  style={{ background: "#f0ede6", color: "#1a3c2e", border: "2px solid transparent" }}
                  onFocus={(e) => {
                    e.target.style.background = "#fff";
                    e.target.style.borderColor = "#2d6a4f";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "#f0ede6";
                    e.target.style.borderColor = "transparent";
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: "#9aab9e" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                    style={{ accentColor: "#2d6a4f" }}
                  />
                  <span className="font-body text-xs" style={{ color: "#7a9485" }}>
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="font-body text-xs font-medium hover:underline"
                  style={{ color: "#2d6a4f" }}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-4 rounded-xl font-body text-[15px] font-semibold transition-all duration-200 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #2d6a4f 0%, #1a3c2e 100%)",
                  color: "#f0faf4",
                  boxShadow: "0 6px 20px -4px rgba(26,60,46,0.4)",
                }}
              >
                <span
                  className={`flex items-center justify-center gap-2 transition-opacity ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </span>
                {isLoading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  </span>
                )}
              </button>

              {loginError && (
                <p className="text-red-500 text-xs text-center">{loginError}</p>
              )}

              <p className="text-center font-body text-[13px]" style={{ color: "#7a9485" }}>
                Don&apos;t have an account?{" "}
                <Link href="/apply" className="font-semibold hover:underline" style={{ color: "#2d6a4f" }}>
                  Apply now
                </Link>
              </p>
            </form>

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-5 right-5 p-2"
              style={{ color: "#9aab9e" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function LoginAutoOpen({ onOpen }: { onOpen: () => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("login") === "1") onOpen();
  }, [searchParams, onOpen]);
  return null;
}

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <Suspense fallback={null}>
        <LoginAutoOpen onOpen={() => setLoginOpen(true)} />
      </Suspense>
      <LoginPanel open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main
        className="min-h-screen transition-all duration-500"
        style={{ background: "#faf8f3" }}
      >
        {/* ── HERO ─────────────────────────────────────────── */}
        <section
          className={`relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-20 transition-all duration-500 ${
            loginOpen ? "md:mr-[min(520px,48vw)]" : ""
          }`}
        >
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 70% 30%, rgba(64,145,108,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(82,183,136,0.08) 0%, transparent 50%), #faf8f3",
            }}
          />
          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(circle, #c8d8cc 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Decorative arc */}
          <div
            className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-[0.06] pointer-events-none"
            style={{ background: "#1a3c2e", transform: "translate(30%, -30%)" }}
          />

          <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-10"
                style={{
                  background: "rgba(45,106,79,0.09)",
                  border: "1px solid rgba(45,106,79,0.2)",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                    style={{ background: "#40916c" }}
                  />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#40916c" }} />
                </span>
                <span
                  className="font-mono text-[11.5px] tracking-widest font-semibold uppercase"
                  style={{ color: "#2d6a4f" }}
                >
                  A.Y. 2026 Applications Now Open
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-display text-[52px] md:text-[72px] font-bold leading-[1.05] tracking-tight mb-6"
                style={{ color: "#1a3c2e" }}
              >
                Empowering
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  San Pablo&apos;s Future
                </span>
              </h1>

              <p
                className="font-body text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
                style={{ color: "#5a7a6a" }}
              >
                The City Government of San Pablo is committed to supporting deserving students through the City
                Scholarship Program — accessible, transparent, and fair.
              </p>

              {/* CTA Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/apply"
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-body text-[15px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    background: "linear-gradient(135deg, #2d6a4f 0%, #1a3c2e 100%)",
                    color: "#f0faf4",
                    boxShadow: "0 12px 30px -6px rgba(26,60,46,0.35)",
                  }}
                >
                  Apply for Scholarship
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <button
                  onClick={() => setLoginOpen(true)}
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-body text-[15px] font-medium transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    background: loginOpen ? "rgba(45,106,79,0.08)" : "transparent",
                    color: "#2d6a4f",
                    border: `2px solid ${loginOpen ? "#2d6a4f" : "rgba(45,106,79,0.35)"}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!loginOpen) {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(45,106,79,0.06)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#2d6a4f";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loginOpen) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(45,106,79,0.35)";
                    }
                  }}
                >
                  {loginOpen ? "Panel Open" : "Sign In to Portal"}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-300 ${
                      loginOpen ? "rotate-180" : "group-hover:translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}