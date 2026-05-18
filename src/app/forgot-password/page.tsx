"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--paper)" }}>
        <div className="w-full max-w-md surface p-8 md:p-10 text-center">
          <div className="w-16 h-16 rounded-xl mx-auto mb-5 flex items-center justify-center" style={{ background: "var(--green-deep)", color: "white" }}>
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--green-deep)" }}>Check Your Email</h1>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            If an account exists with <strong>{email}</strong>, we&apos;ve sent password reset instructions.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--green-deep)" }}>
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--paper)" }}>
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-6" style={{ color: "var(--green-deep)" }}>
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>

        <div className="surface p-8 md:p-10">
          <div className="w-14 h-14 rounded-xl mx-auto mb-5 flex items-center justify-center" style={{ background: "var(--green-deep)", color: "white" }}>
            <Mail className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "var(--green-deep)" }}>Forgot Password?</h1>
          <p className="text-sm text-center mb-7" style={{ color: "var(--muted)" }}>
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3.5 rounded-lg border-2 transition-all border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30 focus:bg-white focus:outline-none"
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg flex items-center gap-3" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70"
              style={{ background: "var(--green-deep)", color: "white" }}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
