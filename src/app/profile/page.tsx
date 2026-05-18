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
  ExternalLink,
  Download,
} from "lucide-react";
import { INCOME_LABELS, INCOME_OPTIONS, EMPLOYMENT_LABELS, EMPLOYMENT_OPTIONS } from "@/lib/scholarship-ui";
import ScholarShell from "@/components/ScholarShell";
import { authClient } from "@/lib/auth-client";
import {
  DOCUMENT_REQUIREMENTS,
  CATEGORY_LABELS,
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
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

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

          if (currentApplication) {
            setLoadingDocs(true);
            const docsResponse = await fetch("/api/applications/documents");
            if (docsResponse.ok) {
              const docs = await docsResponse.json();
              setDocuments(docs);
              const photoDoc = docs.find((d: any) => d.documentName?.toLowerCase().includes("photo"));
              if (photoDoc?.filePath) {
                setProfilePhoto(photoDoc.filePath);
              }
            }
            setLoadingDocs(false);
          }
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

  const SnapshotRow = ({ icon: Icon, label, value }: any) => {
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
  };

  const RecordSection = ({ icon: Icon, title, description, children }: any) => {
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
  };

  const Field = ({ label, icon: Icon, wide = false, children }: any) => {
    return (
      <div className={wide ? "md:col-span-2" : ""}>
        <p className="value-label mb-2 flex items-center gap-1.5">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {label}
        </p>
        {children}
      </div>
    );
  };

  const ReadValue = ({ value }: { value: string }) => {
    return <p className="rounded-xl bg-[var(--cream)] px-3 py-2.5 font-semibold text-[var(--green-deep)]">{value}</p>;
  };

  const WorkflowNote = ({ title, body }: { title: string; body: string }) => {
    return (
      <div className="rounded-xl border border-[var(--sand-soft)] bg-[var(--cream)] p-4">
        <p className="font-semibold text-[var(--green-deep)]">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
      </div>
    );
  };

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
                  {profilePhoto ? (
                    <img 
                      src={profilePhoto} 
                      alt="Profile" 
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/30" 
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/12 text-xl font-bold ring-1 ring-white/15">
                      {application.firstName?.[0]}{application.lastName?.[0]}
                    </div>
                  )}
                  <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">
                    San Pablo Scholar
                  </span>
                </div>
                <p className="value-label mb-2 text-white/56">Scholar Identity</p>
                <h2 className="font-display text-4xl font-bold leading-none">
                  {application.firstName} {application.lastName}
                </h2>
                <p className="mt-3 font-mono text-sm text-white/70">{application.applicationId}</p>
                {application.scholarCategory && (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
                    <Award className="w-3.5 h-3.5" />
                    {CATEGORY_LABELS[application.scholarCategory as keyof typeof CATEGORY_LABELS] || application.scholarCategory}
                  </p>
                )}
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
                <SnapshotRow icon={Award} label="Category" value={CATEGORY_LABELS[application.scholarCategory as keyof typeof CATEGORY_LABELS] || application.scholarCategory || "—"} />
                <SnapshotRow icon={GraduationCap} label="Year Level" value={formatYearLevel(application.yearLevel)} />
                <SnapshotRow icon={Award} label="Latest GWA" value={application.gwa} />
              </div>
            </section>

            <section className="surface p-5">
              <p className="value-label mb-1">Document Status</p>
              <p className="mb-4 text-xs leading-relaxed text-[var(--muted)]">
                Overview of your submitted documents.
              </p>
              <div className="space-y-2">
                {[
                  { name: "Certificate of Residency", key: "residency" },
                  { name: "School ID / Enrollment Certificate", key: "school" },
                  { name: "Valid Government ID", key: "gov" },
                  { name: "Recent 2x2 Photo", key: "photo" },
                ].map((doc) => {
                  const uploadedDoc = documents.find((d: any) => 
                    d.documentName?.toLowerCase().includes(doc.key)
                  );
                  const isUploaded = !!uploadedDoc;
                  return (
                    <div
                      key={doc.key}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5"
                      style={{
                        background: isUploaded ? "rgba(45,106,79,0.08)" : "var(--cream)",
                        border: `1px solid ${isUploaded ? "rgba(45,106,79,0.25)" : "var(--sand-soft)"}`,
                      }}
                    >
                      <CheckCircle2
                        className="h-4 w-4 shrink-0"
                        style={{ color: isUploaded ? "#16a34a" : "var(--sand)" }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: isUploaded ? "var(--green-deep)" : "var(--muted)" }}
                      >
                        {doc.name}
                      </span>
                      {isUploaded && (
                        <span className="ml-auto text-xs px-2 py-1 rounded" style={{ background: "#dcfce7", color: "#166534" }}>
                          Uploaded
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs font-semibold" style={{ color: "var(--green-mid)" }}>
                {documents.length} of {4} documents uploaded
              </p>
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
              title="Uploaded Documents"
              description="View all documents you have submitted for your scholarship application."
            >
              {loadingDocs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[var(--green-mid)]" />
                </div>
              ) : documents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "var(--sand)" }}>
                        <th className="text-left p-3 text-xs font-medium" style={{ color: "var(--muted)" }}>Document</th>
                        <th className="text-left p-3 text-xs font-medium" style={{ color: "var(--muted)" }}>File Name</th>
                        <th className="text-left p-3 text-xs font-medium" style={{ color: "var(--muted)" }}>Size</th>
                        <th className="text-left p-3 text-xs font-medium" style={{ color: "var(--muted)" }}>Status</th>
                        <th className="text-center p-3 text-xs font-medium" style={{ color: "var(--muted)" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id} className="border-b" style={{ borderColor: "var(--sand-soft)" }}>
                          <td className="p-3 font-medium" style={{ color: "var(--green-deep)" }}>{doc.documentName}</td>
                          <td className="p-3 truncate max-w-[200px]" style={{ color: "var(--muted)" }}>{doc.fileName || "—"}</td>
                          <td className="p-3" style={{ color: "var(--muted)" }}>
                            {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : "—"}
                          </td>
                          <td className="p-3">
                            <span 
                              className="inline-block px-2 py-1 rounded text-xs font-medium"
                              style={{ 
                                background: doc.status === 'approved' ? '#dcfce7' : doc.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                                color: doc.status === 'approved' ? '#166534' : doc.status === 'rejected' ? '#991b1b' : '#92400e'
                              }}
                            >
                              {doc.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {doc.filePath && (
                              <a 
                                href={doc.filePath} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[var(--green-deep)] hover:underline text-xs"
                              >
                                <ExternalLink className="h-3 w-3" /> View
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)] py-4">No documents uploaded yet.</p>
              )}
            </RecordSection>

            <RecordSection
              icon={FileText}
              title="Workflow Notes"
              description="Important information about your scholarship application process."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <WorkflowNote title="Status source" body="Status comes from existing scholarship application record." />
                <WorkflowNote title="Documents" body="Uploaded documents are stored and can be viewed in the Documents section." />
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
