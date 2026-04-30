"use client";

import { useState } from "react";
import { Search, Loader2, FileSearch, Clock3, ShieldCheck } from "lucide-react";

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
    <main className="page-shell pt-32 pb-24">
      <div className="page-container">

        <section className="mb-10 grid gap-8 section-divider pt-10 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <div>
            <p className="eyebrow mb-4">Application Status</p>
            <h1 className="page-title text-5xl md:text-7xl mb-5">
              Track Your Application
            </h1>
            <p className="lead text-base max-w-xl">
              Enter your reference code to check your current scholarship status from the official application record.
            </p>
          </div>
          <div className="surface p-5">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <MiniStatus icon={FileSearch} title="Find record" body="Use SPC reference code." />
              <MiniStatus icon={Clock3} title="See status" body="Pending, review, approved, or rejected." />
              <MiniStatus icon={ShieldCheck} title="Official source" body="Data comes from scholarship office records." />
            </div>
          </div>
        </section>

        <section className="surface p-6 md:p-8 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="value-label" style={{ color: "var(--green-deep)" }}>
              Reference Code
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. SPC-AB12CD"
                className="field-control flex-1 px-4 py-3 text-sm font-body"
              />
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="btn-primary px-6 py-3 text-sm font-body disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--sand)" }}>
              <p className="value-label mb-4">Result for &ldquo;{result.applicationId}&rdquo;</p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl"
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
                  <span className="self-start px-4 py-1.5 rounded-full text-xs font-mono font-medium"
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
        </section>

        <div className="surface-muted p-5 text-center">
          <p className="font-mono text-xs tracking-wider" style={{ color: "var(--muted)" }}>
            Reference codes follow the format SPC-XXXXXX. Check your email for your code.
          </p>
        </div>

      </div>
    </main>
  );
}

function MiniStatus({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-[var(--cream)] p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--green-mid)]" />
      <div>
        <p className="text-sm font-semibold text-[var(--green-deep)]">{title}</p>
        <p className="text-xs text-[var(--muted)]">{body}</p>
      </div>
    </div>
  );
}
