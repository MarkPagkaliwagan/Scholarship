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
  "Certificate of Residency",
  "School ID or any Government ID"
];

export default function ApplyPage() {
  return (
    <main className="page-shell pt-32 pb-24">
      <div className="page-container">
        <section className="mb-16 max-w-3xl section-divider pt-10">
          <p className="eyebrow mb-4">Application Guide</p>
          <h1 className="page-title text-5xl md:text-7xl mb-7">
            How to apply
          </h1>
          <p className="lead text-lg max-w-xl">
            Follow these simple steps to complete your scholarship application for Iskolar ng San Pablo.
          </p>
        </section>

        <section className="mb-20 space-y-0">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="relative pb-12"
              style={{
                borderLeft: i < steps.length - 1 ? `1px solid var(--sand)` : "none",
                marginLeft: "20px",
                paddingLeft: "40px",
              }}
            >
              {/* Dot */}
              <div
                className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2"
                style={{
                  background: "var(--green-bright)",
                  borderColor: "var(--green-deep)",
                }}
              />

              <div className="flex-1">
                <span className="eyebrow" style={{ color: "var(--green-bright)" }}>
                  {s.step}
                </span>

                <h2
                  className="font-display text-3xl font-semibold mt-2 mb-3"
                  style={{ color: "var(--green-deep)" }}
                >
                  {s.title}
                </h2>

                {/* Changed from <p> to <div> to support lists */}
                <div
                  className="lead text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  {s.body}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="surface-muted p-8 md:p-10 mb-14">
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
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {doc}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link
            href="/contacts"
            className="btn-primary px-10 py-4 text-sm font-body"
          >
            Contact Us for More Info
          </Link>
        </div>

      </div>
    </main>
  );
}
