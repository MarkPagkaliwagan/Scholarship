"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  UserRoundCheck,
} from "lucide-react";
import ScholarShell from "@/components/ScholarShell";
import { authClient } from "@/lib/auth-client";
import {
  DOCUMENT_REQUIREMENTS,
  STATUS_STEPS,
  type ScholarApplication,
  formatDate,
  formatYearLevel,
  getNextAction,
  getProfileCompleteness,
  getStatusMeta,
} from "@/lib/scholarship-ui";

type ScholarUser = {
  name?: string;
  email?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<ScholarUser | null>(null);
  const [application, setApplication] = useState<ScholarApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScholar = async () => {
      const session = await authClient.getSession();
      const currentUser = session?.data?.user;

      if (!currentUser) {
        router.push("/?login=1");
        return;
      }

      setUser(currentUser);

      try {
        const response = await fetch(`/api/applications?email=${encodeURIComponent(currentUser.email)}`);
        if (response.ok) {
          const applications = (await response.json()) as ScholarApplication[];
          setApplication(applications[0] ?? null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadScholar();
  }, [router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="dashboard-main flex min-h-screen items-center justify-center">
        <div className="flex animate-pulse flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[var(--green-deep)]" />
          <p className="text-sm font-medium text-[var(--muted)]">Loading scholar record...</p>
        </div>
      </div>
    );
  }

  const status = getStatusMeta(application?.status);
  const StatusIcon = status.icon;
  const completeness = getProfileCompleteness(application);
  const nextAction = getNextAction(application);

  return (
    <ScholarShell
      user={user}
      eyebrow="Iskolar ng San Pablo"
      title={`Welcome, ${user?.name?.split(" ")[0] ?? "Scholar"}`}
      description="Track scholarship status, keep your profile complete, and prepare required documents from one workspace."
      onSignOut={handleSignOut}
      actions={
        <>
          <Link href="/profile" className="btn-secondary px-5 py-3 text-sm">
            View Profile
          </Link>
          <Link href={nextAction.href} className="btn-primary px-5 py-3 text-sm">
            {nextAction.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      }
    >
      <div className="grid items-start gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface overflow-hidden p-5 sm:p-6"
        >
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="value-label mb-2">Application Status</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--green-deep)] text-white">
                  <StatusIcon className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="font-display text-3xl font-bold leading-none text-[var(--green-deep)]">
                    {application ? status.label : "No application yet"}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {application ? status.summary : "Start your application to create your scholar record."}
                  </p>
                </div>
              </div>
            </div>

            {application && (
              <span
                className="self-start rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]"
                style={{ background: status.bg, color: status.text }}
              >
                {status.label}
              </span>
            )}
          </div>

          {application ? (
            <>
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <RecordPill label="Reference" value={application.applicationId} mono />
                <RecordPill label="Submitted" value={formatDate(application.submittedAt)} />
                <RecordPill label="Year Level" value={formatYearLevel(application.yearLevel)} />
              </div>

              <div className="rounded-2xl border border-[var(--sand-soft)] bg-[var(--cream)] p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="value-label text-[var(--green-mid)]">Review Timeline</p>
                  <p className="text-xs text-[var(--muted)]">Current: {status.label}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {STATUS_STEPS.map((step) => {
                    const reached = isStepReached(application.status, step.key);
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.key}
                        className="rounded-xl border p-4"
                        style={{
                          borderColor: reached ? "rgba(45,106,79,0.35)" : "var(--sand-soft)",
                          background: reached ? "rgba(64,145,108,0.08)" : "rgba(255,253,248,0.68)",
                        }}
                      >
                        <Icon
                          className="mb-3 h-5 w-5"
                          style={{ color: reached ? "var(--green-mid)" : "var(--muted)" }}
                        />
                        <p className="font-semibold text-[var(--green-deep)]">{step.label}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {reached ? "Reached" : "Pending update"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-2xl border border-dashed border-[var(--sand)] bg-[var(--cream)] p-6 sm:p-8">
                <GraduationCap className="mb-5 h-12 w-12 text-[var(--green-mid)]" />
                <h2 className="font-display text-4xl font-bold leading-none text-[var(--green-deep)]">
                  Create your scholar record
                </h2>
                <p className="lead mt-3 max-w-xl text-sm">
                  Submit core student, school, and contact details first. Your dashboard will become a live status record after submission.
                </p>
                <Link href="/apply" className="btn-primary mt-7 px-6 py-3">
                  Start Application
                </Link>
              </div>
              <div className="grid gap-3">
                {[
                  ["01", "Basic details", "Name, address, phone, and email."],
                  ["02", "Education record", "School, course, year level, and GWA."],
                  ["03", "Reference code", "Use code later for public tracking."],
                ].map(([step, title, body]) => (
                  <div key={step} className="rounded-2xl border border-[var(--sand-soft)] bg-[rgba(255,253,248,0.78)] p-4">
                    <p className="eyebrow mb-2 text-[var(--green-bright)]">{step}</p>
                    <p className="font-semibold text-[var(--green-deep)]">{title}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="space-y-5"
        >
          <section className="surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="value-label mb-1">Next Action</p>
                <h2 className="text-xl font-bold text-[var(--green-deep)]">{nextAction.label}</h2>
              </div>
              <ClipboardList className="h-6 w-6 text-[var(--green-mid)]" />
            </div>
            <p className="mb-5 text-sm leading-relaxed text-[var(--muted)]">{nextAction.description}</p>
            <Link href={nextAction.href} className="btn-primary w-full px-4 py-3 text-sm">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <section className="surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="value-label mb-1">Profile Completeness</p>
                <h2 className="text-3xl font-bold text-[var(--green-deep)]">{completeness.percent}%</h2>
              </div>
              <UserRoundCheck className="h-6 w-6 text-[var(--green-mid)]" />
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--sand-soft)]">
              <div
                className="h-full rounded-full bg-[var(--green-deep)] transition-[width]"
                style={{ width: `${completeness.percent}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {completeness.completed} of {completeness.total} scholar record fields complete.
            </p>
          </section>

          <section className="surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--green-mid)]" />
              <div>
                <p className="value-label">Required Documents</p>
                <p className="text-xs text-[var(--muted)]">Checklist only. Upload storage not enabled yet.</p>
              </div>
            </div>
            <div className="space-y-3">
              {DOCUMENT_REQUIREMENTS.map((document) => (
                <div key={document} className="flex items-start gap-3 rounded-xl bg-[var(--cream)] p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--green-mid)]" />
                  <p className="text-sm font-medium text-[var(--green-deep)]">{document}</p>
                </div>
              ))}
            </div>
          </section>
        </motion.aside>
      </div>

    </ScholarShell>
  );
}

function RecordPill({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--sand-soft)] bg-[rgba(255,253,248,0.76)] p-4">
      <p className="value-label mb-1">{label}</p>
      <p className={`font-semibold text-[var(--green-deep)] ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function isStepReached(status: string, step: string) {
  const order = ["pending", "in_review", "approved"];
  if (status === "rejected") return step !== "approved";
  return order.indexOf(status) >= order.indexOf(step);
}
