"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  Users,
  X,
} from "lucide-react";
import { INCOME_LABELS, INCOME_OPTIONS, EMPLOYMENT_LABELS, EMPLOYMENT_OPTIONS } from "@/lib/scholarship-ui";
import ScholarShell from "@/components/ScholarShell";
import { authClient } from "@/lib/auth-client";
import {
  DOCUMENT_REQUIREMENTS,
  type ScholarApplication,
  formatDate,
  formatYearLevel,
  getProfileCompleteness,
  getStatusMeta,
} from "@/lib/scholarship-ui";

type ScholarUser = {
  name?: string;
  email?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<ScholarUser | null>(null);
  const [application, setApplication] = useState<ScholarApplication | null>(null);
  const [formData, setFormData] = useState<ScholarApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadProfile = async () => {
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
          const currentApplication = applications[0] ?? null;
          setApplication(currentApplication);
          setFormData(currentApplication);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => (current ? { ...current, [name]: value } : current));
    setSaveError(null);
  };

  const handleCancel = () => {
    setFormData(application);
    setEditing(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!formData || !user?.email) return;

    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(`/api/applications?email=${encodeURIComponent(user.email)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          schoolName: formData.schoolName,
          course: formData.course,
          yearLevel: Number(formData.yearLevel),
          gwa: formData.gwa,
          monthlyIncome: formData.monthlyIncome ?? undefined,
          numberOfSiblings: formData.numberOfSiblings != null ? Number(formData.numberOfSiblings) : undefined,
          guardianOccupation: formData.guardianOccupation ?? undefined,
          guardianEmploymentStatus: formData.guardianEmploymentStatus ?? undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save profile changes.");
      }

      setApplication(formData);
      setEditing(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-main flex min-h-screen items-center justify-center">
        <div className="flex animate-pulse flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[var(--green-deep)]" />
          <p className="text-sm font-medium text-[var(--muted)]">Loading scholar profile...</p>
        </div>
      </div>
    );
  }

  const status = getStatusMeta(application?.status);
  const StatusIcon = status.icon;
  const completeness = getProfileCompleteness(application);

  return (
    <ScholarShell
      user={user}
      eyebrow="Iskolar ng San Pablo"
      title="My Profile"
      description="Maintain the official scholarship record used for status updates, eligibility review, and office coordination."
      onSignOut={handleSignOut}
      actions={
        application ? (
          editing ? (
            <>
              <button onClick={handleCancel} className="btn-secondary px-5 py-3 text-sm" disabled={saving}>
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary px-5 py-3 text-sm" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Record
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-primary px-5 py-3 text-sm">
              Edit Record
            </button>
          )
        ) : (
          <Link href="/apply" className="btn-primary px-5 py-3 text-sm">
            Start Application
          </Link>
        )
      }
    >
      {application && formData ? (
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.35fr]">
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <section className="surface overflow-hidden">
              <div className="bg-[var(--green-deep)] p-6 text-[var(--cream)]">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/12 text-xl font-bold ring-1 ring-white/15">
                    {getInitials(`${application.firstName} ${application.lastName}`)}
                  </div>
                  <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">
                    San Pablo Scholar
                  </span>
                </div>
                <p className="value-label mb-2 text-white/56">Scholar Identity</p>
                <h2 className="font-display text-4xl font-bold leading-none">
                  {application.firstName} {application.lastName}
                </h2>
                <p className="mt-3 font-mono text-sm text-white/70">{application.applicationId}</p>
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="value-label mb-1">Status</p>
                    <p className="font-semibold text-[var(--green-deep)]">{status.label}</p>
                  </div>
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: status.bg, color: status.text }}
                  >
                    <StatusIcon className="h-5 w-5" />
                  </span>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-[var(--green-deep)]">Profile completeness</span>
                    <span className="font-bold text-[var(--green-mid)]">{completeness.percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--sand-soft)]">
                    <div className="h-full rounded-full bg-[var(--green-deep)]" style={{ width: `${completeness.percent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {completeness.completed} of {completeness.total} core fields complete.
                  </p>
                </div>
              </div>
            </section>

            <section className="surface p-5">
              <p className="value-label mb-4">Application Snapshot</p>
              <div className="space-y-4">
                <SnapshotRow icon={CalendarDays} label="Submitted" value={formatDate(application.submittedAt)} />
                <SnapshotRow icon={GraduationCap} label="Year Level" value={formatYearLevel(application.yearLevel)} />
                <SnapshotRow icon={Award} label="Latest GWA" value={application.gwa} />
              </div>
            </section>

            <section className="surface p-5">
              <p className="value-label mb-1">Document Readiness</p>
              <p className="mb-4 text-xs leading-relaxed text-[var(--muted)]">
                Tick what you have ready. Upload not enabled yet — bring originals to the office.
              </p>
              <div className="space-y-2">
                {DOCUMENT_REQUIREMENTS.map((doc) => {
                  const checked = checkedDocs.has(doc);
                  return (
                    <button
                      key={doc}
                      type="button"
                      onClick={() =>
                        setCheckedDocs((prev) => {
                          const next = new Set(prev);
                          checked ? next.delete(doc) : next.add(doc);
                          return next;
                        })
                      }
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                      style={{
                        background: checked ? "rgba(45,106,79,0.08)" : "var(--cream)",
                        border: `1px solid ${checked ? "rgba(45,106,79,0.25)" : "transparent"}`,
                      }}
                    >
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 transition-colors"
                        style={{ color: checked ? "var(--green-mid)" : "var(--sand)" }}
                      />
                      <span
                        className="text-sm font-medium transition-colors"
                        style={{ color: checked ? "var(--green-deep)" : "var(--muted)" }}
                      >
                        {doc}
                      </span>
                    </button>
                  );
                })}
              </div>
              {checkedDocs.size > 0 && (
                <p className="mt-3 text-xs font-semibold" style={{ color: "var(--green-mid)" }}>
                  {checkedDocs.size} of {DOCUMENT_REQUIREMENTS.length} documents marked ready
                </p>
              )}
            </section>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-5"
          >
            {saveError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {saveError}
              </div>
            )}

            <RecordSection
              icon={User}
              title="Personal Information"
              description="Primary contact details used by scholarship staff."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="First Name">
                  {editing ? (
                    <input name="firstName" value={formData.firstName} onChange={handleChange} className="field-control px-3 py-2.5" />
                  ) : (
                    <ReadValue value={application.firstName} />
                  )}
                </Field>
                <Field label="Last Name">
                  {editing ? (
                    <input name="lastName" value={formData.lastName} onChange={handleChange} className="field-control px-3 py-2.5" />
                  ) : (
                    <ReadValue value={application.lastName} />
                  )}
                </Field>
                <Field label="Email" icon={Mail}>
                  <ReadValue value={application.email} />
                </Field>
                <Field label="Mobile Number" icon={Phone}>
                  {editing ? (
                    <input name="phone" value={formData.phone} onChange={handleChange} className="field-control px-3 py-2.5" />
                  ) : (
                    <ReadValue value={application.phone} />
                  )}
                </Field>
                <Field label="San Pablo Address" icon={MapPin} wide>
                  {editing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="field-control px-3 py-2.5"
                    />
                  ) : (
                    <ReadValue value={application.address} />
                  )}
                </Field>
              </div>
            </RecordSection>

            <RecordSection
              icon={BookOpen}
              title="Educational Background"
              description="School details used for eligibility review."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="School / University">
                  {editing ? (
                    <input name="schoolName" value={formData.schoolName} onChange={handleChange} className="field-control px-3 py-2.5" />
                  ) : (
                    <ReadValue value={application.schoolName} />
                  )}
                </Field>
                <Field label="Course / Program">
                  {editing ? (
                    <input name="course" value={formData.course} onChange={handleChange} className="field-control px-3 py-2.5" />
                  ) : (
                    <ReadValue value={application.course} />
                  )}
                </Field>
                <Field label="Year Level">
                  {editing ? (
                    <select name="yearLevel" value={formData.yearLevel} onChange={handleChange} className="field-control px-3 py-2.5">
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                      <option value={5}>5th Year</option>
                    </select>
                  ) : (
                    <ReadValue value={formatYearLevel(application.yearLevel)} />
                  )}
                </Field>
                <Field label="Latest GWA">
                  {editing ? (
                    <input name="gwa" value={formData.gwa} onChange={handleChange} className="field-control px-3 py-2.5" />
                  ) : (
                    <ReadValue value={application.gwa} />
                  )}
                </Field>
              </div>
            </RecordSection>

            <RecordSection
              icon={Users}
              title="Family Background"
              description="Household income and guardian details used for eligibility assessment."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Monthly Household Income">
                  {editing ? (
                    <select name="monthlyIncome" value={formData.monthlyIncome ?? ""} onChange={handleChange} className="field-control px-3 py-2.5">
                      <option value="">Select income range...</option>
                      {INCOME_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <ReadValue value={INCOME_LABELS[application.monthlyIncome ?? ""] ?? "Not recorded"} />
                  )}
                </Field>
                <Field label="Number of Siblings">
                  {editing ? (
                    <input
                      type="number"
                      name="numberOfSiblings"
                      value={formData.numberOfSiblings ?? ""}
                      onChange={handleChange}
                      min={0}
                      max={20}
                      className="field-control px-3 py-2.5"
                    />
                  ) : (
                    <ReadValue value={application.numberOfSiblings != null ? String(application.numberOfSiblings) : "Not recorded"} />
                  )}
                </Field>
                <Field label="Guardian Occupation">
                  {editing ? (
                    <input name="guardianOccupation" value={formData.guardianOccupation ?? ""} onChange={handleChange} className="field-control px-3 py-2.5" placeholder="e.g. Farmer, Vendor, Driver" />
                  ) : (
                    <ReadValue value={application.guardianOccupation || "Not recorded"} />
                  )}
                </Field>
                <Field label="Employment Status">
                  {editing ? (
                    <select name="guardianEmploymentStatus" value={formData.guardianEmploymentStatus ?? ""} onChange={handleChange} className="field-control px-3 py-2.5">
                      <option value="">Select status...</option>
                      {EMPLOYMENT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <ReadValue value={EMPLOYMENT_LABELS[application.guardianEmploymentStatus ?? ""] ?? "Not recorded"} />
                  )}
                </Field>
              </div>
            </RecordSection>

            <RecordSection
              icon={FileText}
              title="Workflow Notes"
              description="Transparent v1 boundaries so users do not assume unsupported upload state."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <WorkflowNote title="Status source" body="Status comes from existing scholarship application record." />
                <WorkflowNote title="Documents" body="Dashboard shows required list only; no files are stored in this release." />
                <WorkflowNote title="Workspace" body="Dashboard and profile use one consistent scholar workspace." />
                <WorkflowNote title="Office updates" body="Keep contact and school details current for committee follow-up." />
              </div>
            </RecordSection>
          </motion.div>
        </div>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface mx-auto max-w-3xl p-8 text-center sm:p-12"
        >
          <FileText className="mx-auto mb-5 h-16 w-16 text-[var(--muted)]" />
          <p className="eyebrow mb-3">No San Pablo Scholar Record</p>
          <h2 className="font-display text-4xl font-bold text-[var(--green-deep)]">No application found</h2>
          <p className="lead mx-auto mt-3 max-w-lg text-sm">
            Submit an application first. Your profile hub will appear once a scholarship record exists.
          </p>
          <Link href="/apply" className="btn-primary mt-8 px-7 py-3">
            Start Application
          </Link>
        </motion.section>
      )}
    </ScholarShell>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SnapshotRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--cream)] text-[var(--green-mid)]">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="value-label">{label}</p>
        <p className="text-sm font-semibold text-[var(--green-deep)]">{value}</p>
      </div>
    </div>
  );
}

function RecordSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--cream)] text-[var(--green-mid)]">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold leading-none text-[var(--green-deep)]">{title}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  icon: Icon,
  wide = false,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <p className="value-label mb-2 flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </p>
      {children}
    </div>
  );
}

function ReadValue({ value }: { value: string }) {
  return <p className="rounded-xl bg-[var(--cream)] px-3 py-2.5 font-semibold text-[var(--green-deep)]">{value}</p>;
}

function WorkflowNote({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[var(--sand-soft)] bg-[var(--cream)] p-4">
      <p className="font-semibold text-[var(--green-deep)]">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
    </div>
  );
}
