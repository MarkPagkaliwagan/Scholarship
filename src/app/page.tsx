import Link from "next/link";
import { GraduationCap, MapPin, CheckCircle, Clock, FileText, Award, CalendarDays, Bell, Search } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "1. Prepare Documents",
    desc: "Gather your grades, certificate of residency, and other required documents.",
  },
  {
    icon: Clock,
    title: "2. Submit Online",
    desc: "Fill out the online application form and upload your compiled documents before the deadline.",
  },
  {
    icon: Search,
    title: "3. Evaluation",
    desc: "The committee will review your application. You can track your status anytime.",
  },
  {
    icon: Award,
    title: "4. Awarding",
    desc: "Qualified scholars will be notified for the official contract signing and distribution.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">

      {/* ── Hero & Tracking ── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-16"
        style={{ background: "linear-gradient(135deg, #f8f5ef 0%, #e8f5ee 60%, #d4eade 100%)" }}>

        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px]"
          style={{ background: "var(--green-mid)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-[80px]"
          style={{ background: "var(--green-bright)" }} />

        <div className="max-w-5xl mx-auto px-6 relative z-10 w-full flex flex-col items-center text-center mt-12">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: "rgba(64, 145, 108, 0.1)", border: "1px solid rgba(64, 145, 108, 0.2)" }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--green-bright)" }}></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: "var(--green-bright)" }}></span>
            </span>
            <span className="font-mono text-xs tracking-wider font-semibold uppercase" style={{ color: "var(--green-deep)" }}>
              A.Y. 2026 Applications Now Open
            </span>
          </div>

          <h1 className="h1 font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
            style={{ color: "var(--green-deep)" }}>
            Empowering San Pablo's<br />
            <span style={{ color: "var(--green-bright)" }}>Future Leaders</span>
          </h1>

          <p className="font-body text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
            style={{ color: "var(--muted)" }}>
            The City Government of San Pablo is committed to supporting deserving students through the City Scholarship Program. Accessible, transparent, and fair.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center w-full max-w-md">
            <Link href="/apply"
              className="px-8 py-4 w-full sm:w-auto text-center rounded-full text-base font-medium font-body transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-offset-2"
              style={{ background: "var(--green-deep)", color: "var(--cream)", boxShadow: "0 10px 25px -5px rgba(26, 60, 46, 0.3)" }}>
              Apply for Scholarship
            </Link>
          </div>
        </div>
      </section>

     

    </main>
  );
}
