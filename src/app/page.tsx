import Link from "next/link";
import { GraduationCap, FileText, Search, CheckCircle } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Easy Application",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia.",
  },
  {
    icon: Search,
    title: "Track Progress",
    desc: "Quisque vehicula magna at libero tincidunt, sit amet dignissim erat efficitur vitae.",
  },
  {
    icon: CheckCircle,
    title: "Document Upload",
    desc: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  },
];

const stats = [
  { value: "500+", label: "Active Scholarships" },
  { value: "10k+", label: "Applications" },
  { value: "₱2M+", label: "Awards Distributed" },
  { value: "95%",  label: "Success Rate" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f8f5ef 0%, #e8f5ee 60%, #d4eade 100%)" }}>

        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--green-mid)" }} />
        <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--green-bright)" }} />

        <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 relative z-10">
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-6"
            style={{ color: "var(--green-bright)" }}>
            ✦ City Government of San Pablo
          </p>

          <h1 className="font-display text-6xl md:text-8xl font-bold leading-tight mb-6"
            style={{ color: "var(--green-deep)" }}>
            San Pablo<br />
            <span className="italic" style={{ color: "var(--green-bright)" }}>Scholarship</span>
          </h1>

          <p className="font-body text-lg max-w-xl leading-relaxed mb-10"
            style={{ color: "var(--muted)" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula magna
            at libero tincidunt, sit amet dignissim erat efficitur.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/apply"
              className="px-8 py-3.5 rounded-full text-sm font-medium font-body transition-all duration-200 hover:opacity-90"
              style={{ background: "var(--green-deep)", color: "var(--cream)" }}>
              Apply Now →
            </Link>
            <Link href="/track"
              className="px-8 py-3.5 rounded-full text-sm font-medium font-body border transition-all duration-200 hover:bg-white/60"
              style={{ borderColor: "var(--sand)", color: "var(--green-deep)" }}>
              Track Application
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <div className="w-px h-10 rounded-full" style={{ background: "var(--green-mid)" }} />
          <span className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: "var(--green-mid)" }}>scroll</span>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-28" style={{ background: "var(--cream)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16">
            <p className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "var(--green-bright)" }}>What We Offer</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold"
              style={{ color: "var(--green-deep)" }}>
              Everything in<br /><span className="italic">One Platform</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-8 rounded-2xl border group transition-all duration-300 hover:-translate-y-1"
                style={{ borderColor: "var(--sand)", background: "var(--parchment)" }}>
                <div className="mb-4 w-10 h-10 flex items-center justify-center rounded-xl"
                  style={{ background: "var(--green-deep)" }}>
                  <f.icon className="w-5 h-5" style={{ color: "var(--cream)" }} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3"
                  style={{ color: "var(--green-deep)" }}>{f.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 border-y" style={{ background: "var(--green-deep)", borderColor: "var(--green-mid)" }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="font-display text-5xl font-bold mb-2"
                style={{ color: "var(--green-light)" }}>{s.value}</div>
              <div className="font-mono text-xs tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28" style={{ background: "var(--parchment)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "var(--green-bright)" }}>Ready to Begin?</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--green-deep)" }}>
            Start Your<br /><span className="italic">Journey Today</span>
          </h2>
          <p className="font-body text-base leading-relaxed mb-10" style={{ color: "var(--muted)" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi
            tristique senectus et netus et malesuada fames ac turpis egestas.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/apply"
              className="px-8 py-3.5 rounded-full text-sm font-medium font-body transition-all hover:opacity-90"
              style={{ background: "var(--green-deep)", color: "var(--cream)" }}>
              Explore Scholarships →
            </Link>
            <Link href="/about"
              className="px-8 py-3.5 rounded-full text-sm font-medium font-body border transition-all hover:bg-white/60"
              style={{ borderColor: "var(--sand)", color: "var(--green-deep)" }}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}