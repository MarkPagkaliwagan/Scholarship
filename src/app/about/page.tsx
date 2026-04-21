const pillars = [
  {
    number: "01",
    title: "Our Mission",
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Transparent and accountable governance</li>
        <li>Sustainable environmental protection</li>
        <li>Inclusive economic development</li>
      </ul>
    ),
  },
  {
    number: "02",
    title: "Our Vision",
    body: "Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Quisque vehicula magna at libero tincidunt dignissim.",
  },
  {
    number: "03",
    title: "Who We Serve",
    body: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28 pb-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="mb-20 border-b pb-16" style={{ borderColor: "var(--sand)" }}>
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "var(--green-bright)" }}>About Us</p>
          <h1 className="font-display text-6xl md:text-7xl font-bold leading-tight mb-8"
            style={{ color: "var(--green-deep)" }}>
            Empowering<br /><span className="italic">Students</span>
          </h1>
          <p className="font-body text-lg max-w-2xl leading-relaxed" style={{ color: "var(--muted)" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel
            ultricies lacinia. Quisque vehicula magna at libero tincidunt, sit amet dignissim
            erat efficitur vitae aliquam est.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
          {pillars.map((p) => (
            <div key={p.number}>
              <span className="font-mono text-xs tracking-widest"
                style={{ color: "var(--green-light)" }}>{p.number}</span>
              <h2 className="font-display text-2xl font-semibold mt-2 mb-3"
                style={{ color: "var(--green-deep)" }}>{p.title}</h2>
              <p className="font-body text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{p.body}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="border-l-2 pl-8 py-2" style={{ borderColor: "var(--green-bright)" }}>
          <blockquote className="font-display text-3xl italic mb-3"
            style={{ color: "var(--green-deep)" }}>
            "Education is the most powerful weapon which you can use to change the world."
          </blockquote>
          <cite className="font-mono text-xs tracking-wider not-italic" style={{ color: "var(--muted)" }}>
            — City Government of San Pablo
          </cite>
        </div>

      </div>
    </main>
  );
}