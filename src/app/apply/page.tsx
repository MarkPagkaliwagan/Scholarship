import ApplicationForm from "@/components/ApplicationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Apply | San Pablo Scholarship Portal",
  description: "Apply for the San Pablo City Scholarship Program.",
};

export default function ApplyPage() {
  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--cream)" }}>
      {/* Decorative Header Background */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] z-0 overflow-hidden" style={{ background: "var(--green-deep)" }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px]"
          style={{ background: "var(--green-light)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-[80px]"
          style={{ background: "var(--green-bright)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-32 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--green-light)] mb-3">
            Academic Year 2026
          </p>
          <h1 className="h1 font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Scholarship Application
          </h1>
          <p className="font-body text-lg text-white/80 max-w-2xl">
            Complete the form below to apply for the San Pablo City Scholarship Program. Ensure all information is accurate and matches your supporting documents.
          </p>
        </div>

        <ApplicationForm />
      </div>
    </main>
  );
}
