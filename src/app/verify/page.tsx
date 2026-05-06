"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Loader2, RefreshCw } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    authClient.getSession().then((s) => {
      if (!s?.data?.user) {
        router.replace("/?login=1");
        return;
      }
      setEmail(s.data.user.email);
      sendOtp();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function sendOtp() {
    setSending(true);
    setError(null);
    const res = await fetch("/api/auth/send-otp", { method: "POST" });
    setSending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to send code.");
      return;
    }
    setCountdown(60);
    inputRefs.current[0]?.focus();
  }

  function handleChange(index: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError(null);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    digits.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    inputRefs.current[Math.min(digits.length, 5)]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Enter all 6 digits.");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Verification failed.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      return;
    }
    router.replace("/dashboard");
  }

  const inputBase =
    "w-12 h-14 text-center text-2xl font-bold rounded-xl outline-none transition-all duration-200 caret-transparent";

  return (
    <main className="page-shell min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "#ffffff", boxShadow: "0 8px 40px rgba(0,0,0,0.10)", border: "1px solid #e5e7eb" }}
      >
        {/* Top accent */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #1a3c2e 0%, #2d6a4f 50%, #40916c 100%)" }} />

        <div className="px-8 py-10">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#1a3c2e" }}>
              <GraduationCap className="w-5 h-5" style={{ color: "#d8f3dc" }} />
            </div>
            <div>
              <p className="font-display text-[16px] font-bold leading-none" style={{ color: "#1a3c2e" }}>Iskolar ng San Pablo</p>
              <p className="font-body text-[11px] tracking-wider uppercase mt-0.5" style={{ color: "#7a9485" }}>City Government of San Pablo</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-display text-[26px] font-bold leading-tight mb-2" style={{ color: "#111827" }}>
              Check your email
            </h1>
            <p className="font-body text-[14px] leading-relaxed" style={{ color: "#6b7280" }}>
              {email
                ? <>We sent a 6-digit code to <strong style={{ color: "#374151" }}>{email}</strong>.</>
                : "We sent a 6-digit verification code to your email."}
            </p>
          </div>

          {/* Mail icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
            style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
          >
            <Mail className="w-6 h-6" style={{ color: "#2d6a4f" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP inputs */}
            <div className="flex gap-2 justify-between" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={inputBase}
                  style={{
                    background: digit ? "#f0fdf4" : "#f9fafb",
                    color: "#111827",
                    border: error
                      ? "1.5px solid #ef4444"
                      : digit
                      ? "1.5px solid #2d6a4f"
                      : "1.5px solid #d1d5db",
                  }}
                  onFocus={(e) => {
                    if (!error) {
                      e.target.style.borderColor = "#2d6a4f";
                      e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,0.10)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!digit && !error) {
                      e.target.style.borderColor = "#d1d5db";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center font-body">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || otp.join("").length < 6}
              className="relative w-full py-3.5 rounded-xl font-body text-[14px] font-semibold transition-all duration-200 disabled:opacity-50"
              style={{ background: "#1a3c2e", color: "#ffffff", boxShadow: "0 4px 16px -4px rgba(26,60,46,0.4)" }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#2d6a4f"; }}
              onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#1a3c2e"; }}
            >
              {loading
                ? <span className="flex items-center justify-center"><Loader2 className="w-4 h-4 animate-spin" /></span>
                : "Verify & Continue"}
            </button>

            {/* Resend */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="font-body text-[13px]" style={{ color: "#9ca3af" }}>
                  Resend code in <strong style={{ color: "#374151" }}>{countdown}s</strong>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={sending}
                  className="inline-flex items-center gap-1.5 font-body text-[13px] font-medium hover:underline underline-offset-2 disabled:opacity-50"
                  style={{ color: "#2d6a4f" }}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${sending ? "animate-spin" : ""}`} />
                  {sending ? "Sending…" : "Resend code"}
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 rounded-lg px-4 py-3" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
            <p className="font-body text-[11px] leading-relaxed text-center" style={{ color: "#9ca3af" }}>
              <span className="font-semibold" style={{ color: "#6b7280" }}>Iskolar ng San Pablo</span><br />
              City Government of San Pablo · (049) 562-0000<br />
              For official use only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
