"use client";

import ApplicationForm from "@/components/ApplicationForm";
import Link from "next/link";
import { useState } from "react";
import { RiArrowLeftSLine } from "react-icons/ri";

export default function ApplyPage() {
  const [backHovered, setBackHovered] = useState(false);

  return (
    <main
      className="page-shell"
    >
      <div className="pt-20" />

      <div className="page-container pb-16">
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
              background: backHovered ? "var(--paper)" : "rgba(255,253,248,0.74)",
              border: "1px solid var(--sand-soft)",
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

        <section className="text-center mb-10 section-divider pt-10">
          <p className="eyebrow mb-3">
            Iskolar ng San Pablo
          </p>
          <h1 className="page-title text-4xl md:text-5xl mb-4">
            Scholarship Application
          </h1>
          <p className="lead text-sm max-w-xl mx-auto">
            Fill out all required fields accurately. Fields marked with <span style={{ color: "#dc2626" }}>*</span> are required.
          </p>
        </section>

        <ApplicationForm />
      </div>
    </main>
  );
}
