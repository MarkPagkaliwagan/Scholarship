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
  "School ID or any Government ID",
  "Enrollment certificate or current registration form",
  "Latest grade record / GWA reference",
];

export default function ApplyPage() {
  return (
    <main className="page-shell pt-32 pb-24">
      <div className="page-container">
        <section className="mb-12 grid gap-8 section-divider pt-10 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <div>
            <p className="eyebrow mb-4">Application Guide</p>
            <h1 className="page-title text-5xl md:text-7xl mb-7">
              How to apply
            </h1>
            <p className="lead text-lg max-w-xl">
              Follow these steps to complete your San Pablo Scholars application for Iskolar ng San Pablo.
            </p>
          </div>
          <div className="surface p-6">
            <p className="value-label mb-3">Before you start</p>
            <p className="lead text-sm">
              Use a valid email, active mobile number, and exact school details. Your reference code appears after submission.
            </p>
          </div>
        </section>

        <section className="mb-14 grid gap-5 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="surface relative overflow-hidden p-6"
            >
              <div
                className="absolute right-4 top-4 font-display text-6xl font-bold opacity-10"
                style={{
                  color: "var(--green-deep)",
                }}
              >
                {i + 1}
              </div>

              <div className="relative">
                <span className="eyebrow" style={{ color: "var(--green-bright)" }}>
                  {s.step}
                </span>

                <h2
                  className="font-display text-3xl font-semibold mt-2 mb-3"
                  style={{ color: "var(--green-deep)" }}
                >
                  {s.title}
                </h2>

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

        <section className="surface-muted p-8 md:p-10 mb-10">
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

        <div className="flex flex-col gap-3 text-center sm:flex-row sm:justify-center">
          <Link
            href="/apply"
            className="btn-primary px-10 py-4 text-sm font-body"
          >
            Create Account to Apply
          </Link>
          <Link
            href="/contacts"
            className="btn-secondary px-10 py-4 text-sm font-body"
          >
            Contact Us for More Info
          </Link>
        </div>

      </div>
    </main>
  );
}
