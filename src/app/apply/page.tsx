"use client";

import ApplicationForm from "@/components/ApplicationForm";
import ScholarShell from "@/components/ScholarShell";
import { authClient } from "@/lib/auth-client";
import type { ScholarApplication } from "@/lib/scholarship-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, Loader2, Lock, Mail, Search, User } from "lucide-react";

export default function ApplyPage() {
  const router = useRouter();
  const [user, setUser] = useState<null | { name?: string; email?: string }>(null);
  const [existingApplication, setExistingApplication] = useState<ScholarApplication | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const session = await authClient.getSession();
      const currentUser = session?.data?.user ?? null;
      if (!currentUser) {
        setCheckingSession(false);
        return;
      }
      setUser(currentUser);
      const response = await fetch(`/api/applications?email=${encodeURIComponent(currentUser.email)}`);
      if (response.ok) {
        const applications = (await response.json()) as ScholarApplication[];
        setExistingApplication(applications[0] ?? null);
      }
      setCheckingSession(false);
    };
    loadSession();
  }, [router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setSignupLoading(true);
    setSignupError(null);

    const signupName = `${signupFirstName.trim()} ${signupLastName.trim()}`.trim();
    const { error } = await authClient.signUp.email({
      email: signupEmail,
      password: signupPassword,
      name: signupName,
      firstName: signupFirstName.trim(),
      lastName: signupLastName.trim(),
    });

    if (error) {
      setSignupError(error.message ?? "Unable to create account.");
      setSignupLoading(false);
      return;
    }

    await authClient.signIn.email({
      email: signupEmail,
      password: signupPassword,
    });

    const session = await authClient.getSession();
    const signupName = `${signupFirstName.trim()} ${signupLastName.trim()}`.trim();
    setUser(session?.data?.user ?? { name: signupName, email: signupEmail });
    setSignupLoading(false);
  };

  if (checkingSession) {
    return (
      <main className="dashboard-main flex min-h-screen items-center justify-center">
        <div className="flex animate-pulse flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[var(--green-deep)]" />
          <p className="text-sm font-medium text-[var(--muted)]">Preparing application...</p>
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <ScholarShell
        user={user}
        eyebrow="Iskolar ng San Pablo"
        title="Apply for Iskolar ng San Pablo"
        description="Submit your scholarship application without leaving your dashboard workspace."
        onSignOut={handleSignOut}
        actions={
          <Link href="/dashboard" className="btn-secondary px-5 py-3 text-sm">
            Back to Dashboard
          </Link>
        }
      >
        {existingApplication ? (
          <section className="surface mx-auto max-w-3xl p-8 text-center sm:p-12">
            <CheckCircle2 className="mx-auto mb-5 h-16 w-16 text-[var(--green-mid)]" />
            <p className="eyebrow mb-3">Application Already Submitted</p>
            <h2 className="font-display text-4xl font-bold text-[var(--green-deep)]">Your scholar record exists</h2>
            <p className="lead mx-auto mt-3 max-w-lg text-sm">
              Reference code {existingApplication.applicationId} is already connected to this account. Use dashboard or profile for next steps.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/dashboard" className="btn-primary px-7 py-3">
                Go to Dashboard
              </Link>
              <Link href="/profile" className="btn-secondary px-7 py-3">
                View Profile
              </Link>
            </div>
          </section>
        ) : (
          <section className="surface p-5 sm:p-7">
            <div className="mb-8 grid gap-4 border-b border-[var(--sand-soft)] pb-6 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <p className="value-label mb-2">Application Form</p>
                <h2 className="font-display text-3xl font-bold text-[var(--green-deep)]">Create scholar record</h2>
                <p className="lead mt-2 text-sm">
                  Your account email is locked to keep dashboard, profile, and tracking connected.
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--cream)] p-4 text-sm text-[var(--muted)]">
                Fields marked <span className="font-bold text-red-600">*</span> are required. Keep document files ready; upload storage is not enabled in this release.
              </div>
            </div>
            <ApplicationForm
              initialEmail={user.email}
              lockEmail
              onSubmitted={() => router.push("/dashboard")}
            />
          </section>
        )}
      </ScholarShell>
    );
  }

  return (
    <main className="page-shell min-h-screen">
      {/* ── HERO ── */}
      <section className="relative flex min-h-[52vh] flex-col items-center justify-center overflow-hidden pb-16 pt-36 text-center">
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
            Apply for Iskolar<br />ng San Pablo
          </h1>
          <p className="lead mx-auto mt-5 max-w-lg text-base md:text-lg">
            Create your account once. Your login owns your application, profile, and dashboard status.
          </p>
        </div>
      </section>

      {/* ── FORM + STEPS ── */}
      <div className="page-container pb-24">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">

          {/* Steps panel */}
          <div className="space-y-4">
            <div className="surface p-6">
              <p className="value-label mb-5">How it works</p>
              <div className="space-y-4">
                {[
                  { n: "01", icon: User,          title: "Create account",    body: "Register with your name, email, and password." },
                  { n: "02", icon: ClipboardList, title: "Fill application",  body: "Submit student, school, and contact details." },
                  { n: "03", icon: Search,        title: "Track in dashboard",body: "Use your SPC reference code to check status anytime." },
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
                You choose your own password. No generated credentials. Keep your login details safe — it links to your official scholar record.
              </p>
            </div>
          </div>

          {/* Signup form */}
          <form onSubmit={handleSignup} className="surface overflow-hidden p-0">
            <div className="border-b p-6 md:p-8" style={{ borderColor: "var(--sand-soft)" }}>
              <p className="eyebrow mb-2">Iskolar ng San Pablo</p>
              <h2 className="font-display text-3xl font-bold leading-tight" style={{ color: "var(--green-deep)" }}>
                Create Your Account
              </h2>
              <p className="lead mt-2 text-sm">Start your application after signing up.</p>
            </div>

            <div className="space-y-4 p-6 md:p-8">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="value-label mb-2 block">First Name</span>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      value={signupFirstName}
                      onChange={(event) => setSignupFirstName(event.target.value)}
                      required
                      minLength={2}
                      className="field-control px-11 py-3 text-sm"
                      placeholder="Juan"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="value-label mb-2 block">Last Name</span>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      value={signupLastName}
                      onChange={(event) => setSignupLastName(event.target.value)}
                      required
                      minLength={2}
                      className="field-control px-11 py-3 text-sm"
                      placeholder="dela Cruz"
                    />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="value-label mb-2 block">Email Address</span>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(event) => setSignupEmail(event.target.value)}
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
                    value={signupPassword}
                    onChange={(event) => setSignupPassword(event.target.value)}
                    required
                    minLength={8}
                    className="field-control px-11 py-3 text-sm"
                    placeholder="At least 8 characters"
                  />
                </div>
              </label>

              {signupError && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {signupError}
                </p>
              )}

              <button type="submit" disabled={signupLoading} className="btn-primary w-full px-6 py-3.5 text-sm">
                {signupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
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
