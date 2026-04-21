"use client";

import { useState } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";

export default function TrackApplication() {
  const [trackingId, setTrackingId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">("idle");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      if (trackingId.toLowerCase() === "error") {
        setStatus("error");
      } else {
        setStatus("found");
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <form onSubmit={handleTrack} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5" style={{ color: "var(--muted)" }} aria-hidden="true" />
        </div>
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter your Application ID"
          className="block w-full pl-11 pr-32 py-4 rounded-full text-base transition-all outline-none border focus:ring-2 focus:ring-offset-2"
          style={{ 
            background: "var(--cream)", 
            borderColor: "var(--sand)",
            color: "var(--ink)",
            boxShadow: "0 4px 20px -2px rgba(26, 60, 46, 0.05)"
          }}
          aria-label="Track Application ID"
          required
        />
        <button
          type="submit"
          disabled={status === "loading" || !trackingId.trim()}
          className="absolute right-2 top-2 bottom-2 px-6 rounded-full font-medium text-sm transition-all flex items-center gap-2 disabled:opacity-70"
          style={{ background: "var(--green-deep)", color: "var(--cream)" }}
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>Track <ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </form>

      {/* Status Results - Accessible Live Region */}
      <div aria-live="polite" className="mt-4">
        {status === "found" && (
          <div className="p-4 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2"
            style={{ background: "var(--parchment)", borderColor: "var(--sand)", borderWidth: "1px" }}>
            <div className="w-2 h-2 mt-2 rounded-full flex-shrink-0" style={{ background: "#F97316" }} />
            <div>
              <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: "var(--muted)" }}>
                Status: In Review
              </p>
              <p className="font-body text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
                Application <span className="font-semibold">{trackingId}</span> is currently being evaluated by the committee. Please check back next week.
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="p-4 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2"
            style={{ background: "#FEF2F2", borderColor: "#FECACA", borderWidth: "1px" }}>
            <div className="w-2 h-2 mt-2 rounded-full flex-shrink-0" style={{ background: "#EF4444" }} />
            <div>
              <p className="font-mono text-xs tracking-widest uppercase mb-1 text-red-600">
                Application Not Found
              </p>
              <p className="font-body text-sm leading-relaxed text-red-900">
                We couldn't find an application with ID <span className="font-semibold">{trackingId}</span>. Please verify and try again.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
