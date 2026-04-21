import Link from "next/link";
import { GraduationCap, MapPin, CheckCircle, Clock, FileText, Award, CalendarDays, Bell, Search } from "lucide-react";
import TrackApplication from "@/components/TrackApplication";
import FAQAccordion from "@/components/FAQAccordion";

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

          <div className="mt-16 w-full pt-10 border-t" style={{ borderColor: "var(--sand)" }}>
            <p className="font-display font-medium text-lg mb-2" style={{ color: "var(--green-deep)" }}>
              Already applied? Check your status:
            </p>
            <TrackApplication />
          </div>
        </div>
      </section>

      {/* ── Announcements Banner ── */}
      <section className="py-6" style={{ background: "var(--green-deep)" }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-white animate-bounce" />
            <p className="font-body font-medium text-sm text-white">
              Deadline for submission of requirements is on <span className="font-bold text-[#F97316]">May 31, 2026</span>.
            </p>
          </div>
          <Link href="/contacts" className="font-mono text-xs tracking-widest text-white/80 hover:text-white uppercase transition-colors whitespace-nowrap">
            View All Announcements →
          </Link>
        </div>
      </section>

      {/* ── Quick Check Eligibility ── */}
      <section className="py-24" style={{ background: "var(--cream)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-14 text-center">
            <h2 className="font-display text-4xl font-bold mb-4" style={{ color: "var(--green-deep)" }}>
              Are you eligible?
            </h2>
            <p className="font-body text-base max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
              You must meet these basic criteria to qualify for the program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: "Residency", desc: "Must be a bona fide resident of San Pablo City for at least one year." },
              { icon: GraduationCap, title: "Enrollment", desc: "Enrolled or accepted in a CHED/TESDA recognized public or private institution." },
              { icon: CheckCircle, title: "Academic Standing", desc: "Must maintain a GWA of 85% or equivalent, with no failing or dropped subjects." }
            ].map((req, i) => (
              <div key={i} className="p-8 rounded-3xl border bg-white shadow-sm" style={{ borderColor: "var(--sand)" }}>
                <div className="w-12 h-12 rounded-full mb-6 flex items-center justify-center" style={{ background: "var(--parchment)" }}>
                  <req.icon className="w-6 h-6" style={{ color: "var(--green-deep)" }} />
                </div>
                <h3 className="font-display text-xl font-bold mb-3" style={{ color: "var(--green-deep)" }}>{req.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{req.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application Journey ── */}
      <section className="py-24" style={{ background: "var(--parchment)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16 md:mb-20">
            <h2 className="font-display text-4xl font-bold mb-4" style={{ color: "var(--green-deep)" }}>
              The Application Journey
            </h2>
            <p className="font-body text-base max-w-xl" style={{ color: "var(--muted)" }}>
              We have streamlined the process to make it as simple and transparent as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-10 left-10 right-10 h-0.5" style={{ background: "var(--sand)", zIndex: 0 }} />
            
            {steps.map((step, i) => (
              <div key={i} className="relative z-10">
                <div className="w-20 h-20 rounded-2xl mb-6 mx-auto md:mx-0 flex items-center justify-center border shadow-sm transition-transform hover:-translate-y-1" 
                  style={{ background: "var(--cream)", borderColor: "var(--sand)" }}>
                  <step.icon className="w-8 h-8" style={{ color: "var(--green-bright)" }} />
                </div>
                <h3 className="font-display text-xl font-bold mb-3 text-center md:text-left" style={{ color: "var(--green-deep)" }}>
                  {step.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-center md:text-left" style={{ color: "var(--muted)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-24" style={{ background: "var(--cream)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-14 text-center">
            <h2 className="font-display text-4xl font-bold mb-4" style={{ color: "var(--green-deep)" }}>
              Frequently Asked Questions
            </h2>
            <p className="font-body text-base max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
              Got questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
            </p>
          </div>
          
          <FAQAccordion />
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20 border-t" style={{ background: "var(--cream)", borderColor: "var(--sand)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold mb-6" style={{ color: "var(--green-deep)" }}>
            Take the next step in your education.
          </h2>
          <Link href="/apply"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium font-body transition-all hover:opacity-90 focus:ring-2 focus:ring-offset-2"
            style={{ background: "var(--green-deep)", color: "var(--cream)" }}>
            Start Your Application
            <CheckCircle className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
