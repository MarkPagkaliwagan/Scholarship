"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { ClipboardList, Loader2, Lock, Mail, Search, User } from "lucide-react";
import MovingCircleBg from "@/components/MovingCircleBg";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signupError } = await authClient.signUp.email({ email, password, name });
    if (signupError) {
      setError(signupError.message ?? "Unable to create account.");
      setLoading(false);
      return;
    }

    await authClient.signIn.email({ email, password });
    router.push("/apply");
  };

  return (
    <main className="page-shell min-h-screen">
      {/* ── HERO ── */}
      <section className="relative flex min-h-[46vh] flex-col items-center justify-center overflow-hidden pb-12 pt-36 text-center">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(64,145,108,0.12) 0%, transparent 65%), #faf8f3",
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: "radial-gradient(circle, #b8ccbc 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <MovingCircleBg />

        <div className="relative z-10 px-6">
          <p className="eyebrow mb-5">City Government of San Pablo</p>
          <div
            className="mx-auto mb-8 inline-flex items-center gap-2.5 rounded-lg px-4 py-2"
            style={{ background: "rgba(45,106,79,0.09)", border: "1px solid rgba(45,106,79,0.22)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "#40916c" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#40916c" }} />
            </span>
            <span className="font-body text-[11.5px] font-semibold uppercase tracking-widest" style={{ color: "#2d6a4f" }}>
              A.Y. 2026 Applications Now Open
            </span>
          </div>

          <h1 className="page-title mx-auto mb-4 text-[52px] leading-[0.96] sm:text-[68px] md:text-[80px]">
            Create Your<br />Account
          </h1>
          <p className="lead mx-auto mt-5 max-w-lg text-base md:text-lg">
            One account links your application, profile, and scholarship status — all in one place.
          </p>
        </div>
      </section>

      {/* ── FORM + STEPS ── */}
      <div className="page-container pb-24">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">

          {/* Steps */}
          <div className="space-y-4">
            <div className="surface p-6">
              <p className="value-label mb-5">How it works</p>
              <div className="space-y-5">
                {[
                  { n: "01", icon: User,          title: "Create account",     body: "Register with your name, email, and password." },
                  { n: "02", icon: ClipboardList, title: "Fill application",   body: "Submit student, school, and contact details." },
                  { n: "03", icon: Search,        title: "Track in dashboard", body: "Use your SPC reference code to check status anytime." },
                ].map(({ n, icon: Icon, title, body }) => (
                  <div key={n} className="flex items-start gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: "var(--green-soft)", color: "var(--green-deep)" }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="eyebrow" style={{ color: "var(--green-bright)" }}>{n}</span>
                        <p className="font-body text-sm font-semibold" style={{ color: "var(--green-deep)" }}>{title}</p>
                      </div>
                      <p className="mt-0.5 font-body text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-muted rounded-lg p-4">
              <p className="font-body text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                You choose your own password. No generated credentials. Your login is tied to your official scholar record.
              </p>
            </div>
          </div>

          {/* Form card */}
          <form onSubmit={handleSubmit} className="surface overflow-hidden p-0">
            <div className="border-b p-6 md:p-8" style={{ borderColor: "var(--sand-soft)" }}>
              <p className="eyebrow mb-2">Iskolar ng San Pablo</p>
              <h2 className="font-display text-3xl font-bold leading-tight" style={{ color: "var(--green-deep)" }}>
                Sign Up
              </h2>
              <p className="lead mt-2 text-sm">
                Your application opens inside the dashboard after sign up.
              </p>
            </div>

            <div className="space-y-4 p-6 md:p-8">
              <label className="block">
                <span className="value-label mb-2 block">Full Name</span>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    className="field-control px-11 py-3 text-sm"
                    placeholder="Juan dela Cruz"
                  />
                </div>
              </label>

              <label className="block">
                <span className="value-label mb-2 block">Email Address</span>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="field-control px-11 py-3 text-sm"
                    placeholder="juan@email.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="value-label mb-2 block">Password</span>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="field-control px-11 py-3 text-sm"
                    placeholder="At least 8 characters"
                  />
                </div>
              </label>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full px-6 py-3.5 text-sm">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Create Account and Continue
              </button>

              <p className="text-center font-body text-sm" style={{ color: "var(--muted)" }}>
                Already have an account?{" "}
                <Link href="/?login=1" className="font-semibold underline-offset-4 hover:underline" style={{ color: "var(--green-deep)" }}>
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
