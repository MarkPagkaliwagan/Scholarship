import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Check Eligibility",
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Resident of San Pablo City</li>
        <li>Currently enrolled or an incoming college student</li>
        <li>No failing grades / meets the required grade criteria</li>
      </ul>
    ),
  },
  {
    step: "02",
    title: "Prepare Documents",
    body: "Prepare all required documents such as academic records, proof of enrollment, valid ID, and other supporting requirements.",
  },
  {
    step: "03",
    title: "Submit Application",
    body: "Complete the application form and submit all required documents to the online portal.",
  },
  {
    step: "04",
    title: "Track Your Status",
    body: "Wait for updates and announcements regarding your application status from the scholarship office.",
  },
];

const documents = [
  "Government-issued ID/School ID",
  "Barangay Certificate of Parent/Guardian",
  "BarangayCertificate of Scholar"
];

export default function ApplyPage() {
  return (
    <main className="min-h-screen pt-28 pb-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="mb-20">
          <p
            className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "var(--green-bright)" }}
          >
            Application Guide
          </p>
          <h1
            className="h1 font-display text-6xl md:text-7xl font-bold leading-tight mb-6"
            style={{ color: "var(--green-deep)" }}
          >
            How to Apply<br />
          </h1>
          <p
            className="font-body text-lg max-w-xl leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Follow these simple steps to complete your scholarship application for Iskolar ng San Pablo.
          </p>
        </div>

        {/* Steps */}
        <div className="mb-24 space-y-0">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="flex gap-8 pb-12 relative"
              style={{
                borderLeft: i < steps.length - 1 ? `1px solid var(--sand)` : "none",
                marginLeft: "20px",
                paddingLeft: "40px",
              }}
            >
              {/* Dot */}
              <div
                className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2"
                style={{
                  background: "var(--green-bright)",
                  borderColor: "var(--green-deep)",
                }}
              />

              <div className="flex-1">
                <span
                  className="font-mono text-xs tracking-widest"
                  style={{ color: "var(--green-light)" }}
                >
                  {s.step}
                </span>

                <h2
                  className="font-display text-2xl font-semibold mt-1 mb-2"
                  style={{ color: "var(--green-deep)" }}
                >
                  {s.title}
                </h2>

                {/* Changed from <p> to <div> to support lists */}
                <div
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {s.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Documents */}
        <div
          className="p-10 rounded-2xl border mb-16"
          style={{ background: "var(--parchment)", borderColor: "var(--sand)" }}
        >
          <h2
            className="font-display text-2xl font-bold mb-6"
            style={{ color: "var(--green-deep)" }}
          >
            Required Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "var(--green-bright)" }}
                />
                <span
                  className="font-body text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  {doc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/contact"
            className="px-10 py-4 rounded-full text-sm font-medium font-body transition-all hover:opacity-90"
            style={{ background: "var(--green-deep)", color: "var(--cream)" }}
          >
            Contact Us for More Info →
          </Link>
        </div>

      </div>
    </main>
  );
}