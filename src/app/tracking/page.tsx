"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

type ApplicationResult = {
  applicationId: string;
  firstName: string;
  lastName: string;
  status: string;
  remarks: string | null;
  submittedAt: string;
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#fef3c7", text: "#92400e" },
  in_review: { bg: "#dbeafe", text: "#1e40af" },
  approved: { bg: "#dcfce7", text: "#166534" },
  rejected: { bg: "#fee2e2", text: "#991b1b" },
};

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      const res = await fetch(`/api/applications/track?id=${encodeURIComponent(code.trim())}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = result ? (STATUS_COLORS[result.status] ?? STATUS_COLORS.pending) : null;

  return (
    <main className="min-h-screen pt-28 pb-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-2xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "var(--green-bright)" }}>Application Status</p>
          <h1 className="h1 font-display text-5xl md:text-6xl font-bold mb-4"
            style={{ color: "var(--green-deep)" }}>
            Track Your Application
          </h1>
          <p className="font-body text-base leading-relaxed" style={{ color: "var(--muted)" }}>
            Enter your reference code to check your current application status.
          </p>
        </div>

        {/* Search box */}
        <div className="p-10 rounded-2xl border mb-10"
          style={{ background: "var(--parchment)", borderColor: "var(--sand)" }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="font-mono text-xs tracking-widest uppercase"
              style={{ color: "var(--green-deep)" }}>
              Reference Code
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. SPC-AB12CD"
                className="flex-1 px-4 py-3 rounded-xl border text-sm font-body bg-white outline-none focus:ring-2 transition"
                style={{ borderColor: "var(--sand)", color: "var(--ink)" }}
              />
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="px-6 py-3 rounded-xl text-sm font-medium font-body flex items-center gap-2 transition hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--green-deep)", color: "var(--cream)" }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--sand)" }}>
              <p className="font-mono text-xs tracking-widest uppercase mb-4"
                style={{ color: "var(--muted)" }}>Result for &ldquo;{result.applicationId}&rdquo;</p>
              <div className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "var(--cream)", border: "1px solid var(--sand)" }}>
                <div>
                  <p className="font-display text-lg font-semibold" style={{ color: "var(--green-deep)" }}>
                    {result.lastName}, {result.firstName}
                  </p>
                  <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
                    {result.applicationId} · Submitted:{" "}
                    {new Date(result.submittedAt).toLocaleDateString("en-PH", { dateStyle: "long" })}
                  </p>
                  {result.remarks && (
                    <p className="font-body text-sm mt-1" style={{ color: "var(--ink)" }}>
                      {result.remarks}
                    </p>
                  )}
                </div>
                {statusColor && (
                  <span className="px-4 py-1.5 rounded-full text-xs font-mono font-medium"
                    style={{ background: statusColor.bg, color: statusColor.text }}>
                    {STATUS_LABELS[result.status] ?? result.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          )}

          {notFound && (
            <p className="mt-6 font-body text-sm text-center" style={{ color: "#ef4444" }}>
              No application found for &ldquo;{code}&rdquo;. Please check your reference code.
            </p>
          )}
        </div>

        {/* Info note */}
        <p className="font-mono text-xs text-center tracking-wider" style={{ color: "var(--muted)" }}>
          Reference codes follow the format SPC-XXXXXX. Check your email for your code.
        </p>

      </div>
    </main>
  );
}
