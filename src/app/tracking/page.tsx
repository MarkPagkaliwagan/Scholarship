"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen pt-28 pb-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-2xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "var(--green-bright)" }}>Application Status</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4"
            style={{ color: "var(--green-deep)" }}>
            Track Your<br /><span className="italic">Application</span>
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
                placeholder="e.g. SCH-2025-0001"
                className="flex-1 px-4 py-3 rounded-xl border text-sm font-body bg-white outline-none focus:ring-2 transition"
                style={{ borderColor: "var(--sand)", color: "var(--ink)" }}
              />
              <button type="submit"
                className="px-6 py-3 rounded-xl text-sm font-medium font-body flex items-center gap-2 transition hover:opacity-90"
                style={{ background: "var(--green-deep)", color: "var(--cream)" }}>
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </form>

          {/* Dummy result */}
          {submitted && code && (
            <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--sand)" }}>
              <p className="font-mono text-xs tracking-widest uppercase mb-4"
                style={{ color: "var(--muted)" }}>Result for "{code}"</p>
              <div className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "var(--cream)", border: "1px solid var(--sand)" }}>
                <div>
                  <p className="font-display text-lg font-semibold" style={{ color: "var(--green-deep)" }}>
                    Lorem Ipsum Scholarship
                  </p>
                  <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
                    Submitted: January 1, 2025
                  </p>
                </div>
                <span className="px-4 py-1.5 rounded-full text-xs font-mono font-medium"
                  style={{ background: "#fef3c7", color: "#92400e" }}>
                  PENDING
                </span>
              </div>
            </div>
          )}

          {submitted && !code && (
            <p className="mt-6 font-body text-sm text-center" style={{ color: "#ef4444" }}>
              Please enter a reference code.
            </p>
          )}
        </div>

        {/* Info note */}
        <p className="font-mono text-xs text-center tracking-wider" style={{ color: "var(--muted)" }}>
          Reference codes follow the format SCH-YYYY-XXXX. Check your email for your code.
        </p>

      </div>
    </main>
  );
}