"use client";

import ApplicationForm from "@/components/ApplicationForm";
import Link from "next/link";
import { useState } from "react";
import { RiArrowLeftSLine } from "react-icons/ri";

export default function ApplyPage() {
  const [backHovered, setBackHovered] = useState(false);

  return (
    <main
      className="min-h-screen"
      style={{ background: "#faf8f3", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="pt-20" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center gap-3 py-6">
          <Link
            href="/"
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            aria-label="Back to home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 12px 6px 8px",
              borderRadius: 8,
              background: backHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
              border: "1px solid rgba(0,0,0,0.08)",
              color: "var(--green-deep)",
              fontSize: 13,
              fontWeight: 500,
              transition: "all 0.18s ease",
              textDecoration: "none",
            }}
          >
            <RiArrowLeftSLine style={{ width: 17, height: 17 }} />
            Back
          </Link>
          <span style={{ color: "rgba(0,0,0,0.3)", fontSize: 12 }}>/</span>
          <span style={{ color: "var(--muted)", fontSize: 12 }}>Programs</span>
          <span style={{ color: "rgba(0,0,0,0.3)", fontSize: 12 }}>/</span>
          <span style={{ color: "var(--green-deep)", fontSize: 12, fontWeight: 500 }}>Apply</span>
        </div>

        <div className="text-center mb-10">
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--green-mid)",
              marginBottom: 8,
            }}
          >
            Iskolar ng San Pablo
          </p>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 700,
              color: "var(--green-deep)",
              marginBottom: 8,
            }}
          >
            Scholarship Application
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 480, margin: "0 auto" }}>
            Fill out all required fields accurately. Fields marked with <span style={{ color: "#dc2626" }}>*</span> are required.
          </p>
        </div>

        <ApplicationForm />
      </div>
    </main>
  );
}