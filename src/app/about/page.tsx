const pillars = [
  {
    number: "01",
    title: "Mission",
    body: (
      <ul className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        <li>Support qualified San Pablo students through clear scholarship access.</li>
        <li>Keep application review transparent, fair, and accountable.</li>
        <li>Help families stay informed from application to award release.</li>
      </ul>
    ),
  },
  {
    number: "02",
    title: "Vision",
    body: "A city where capable students can continue college with dependable local government support.",
  },
  {
    number: "03",
    title: "Who We Serve",
    body: "Residents of San Pablo City who meet scholarship requirements and need a reliable path to apply, track, and complete their records.",
  },
];

export default function AboutPage() {
  return (
    <main className="page-shell pt-32 pb-24">
      <div className="page-container">
        <section className="mb-16 max-w-4xl section-divider pt-10">
          <p className="eyebrow mb-4">About Us</p>
          <h1 className="page-title text-5xl md:text-7xl mb-7">
            Built for San Pablo students
          </h1>
          <p className="lead text-lg max-w-2xl">
            The Scholarship Office helps residents apply for city scholarship support, track requirements, and stay updated through one official portal.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {pillars.map((p) => (
            <div key={p.number} className="surface p-7">
              <span className="eyebrow" style={{ color: "var(--green-bright)" }}>{p.number}</span>
              <h2 className="font-display text-2xl font-semibold mt-3 mb-4"
                style={{ color: "var(--green-deep)" }}>{p.title}</h2>
              {typeof p.body === 'string' 
                ? <p className="lead text-sm">{p.body}</p>
                : p.body
              }
            </div>
          ))}
        </section>

        <section className="surface-muted p-8 md:p-10">
          <blockquote className="font-display text-3xl md:text-4xl italic mb-4"
            style={{ color: "var(--green-deep)" }}>
            &quot;Education is the most powerful weapon which you can use to change the world.&quot;
          </blockquote>
          <cite className="eyebrow not-italic" style={{ color: "var(--muted)" }}>
            City Government of San Pablo
          </cite>
        </section>
      </div>
    </main>
  );
}
