"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Lock, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    setLoading(true);

    const { error: err } = await authClient.resetPassword({
      token,
      newPassword: password,
    });

    if (err) {
      setError(err.message || "Failed to reset password. The link may have expired.");
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md surface p-8 md:p-10 text-center">
        <div className="w-16 h-16 rounded-xl mx-auto mb-5 flex items-center justify-center" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--green-deep)" }}>Invalid Link</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          This reset link is missing or invalid. Please request a new one.
        </p>
        <Link href="/forgot-password" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--green-deep)" }}>
          <ArrowLeft className="w-4 h-4" /> Request new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-md surface p-8 md:p-10 text-center">
        <div className="w-16 h-16 rounded-xl mx-auto mb-5 flex items-center justify-center" style={{ background: "var(--green-deep)", color: "white" }}>
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--green-deep)" }}>Password Reset</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          Your password has been successfully reset.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--green-deep)" }}>
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-6" style={{ color: "var(--green-deep)" }}>
        <ArrowLeft className="w-4 h-4" /> Back to login
      </Link>

      <div className="surface p-8 md:p-10">
        <div className="w-14 h-14 rounded-xl mx-auto mb-5 flex items-center justify-center" style={{ background: "var(--green-deep)", color: "white" }}>
          <Lock className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "var(--green-deep)" }}>Set New Password</h1>
        <p className="text-sm text-center mb-7" style={{ color: "var(--muted)" }}>
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3.5 pr-12 rounded-lg border-2 transition-all border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30 focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--muted)" }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
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
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--paper)" }}>
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--green-deep)" }} />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
