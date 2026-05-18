import {
  Award,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  type LucideIcon,
} from "lucide-react";

export const SCHOLAR_CATEGORIES = [
  { value: "varsity", label: "Varsity", description: "Student-athlete representing the school in sports competitions" },
  { value: "indigency", label: "Indigency", description: "Family belongs to low-income household as per social welfare assessment" },
  { value: "music_and_arts", label: "Music and Arts", description: "Demonstrated talent in music, visual arts, or performing arts" },
  { value: "academic", label: "Academic", description: "Consistently high academic performance and scholastic excellence" },
] as const;

export const CATEGORY_LABELS = Object.fromEntries(SCHOLAR_CATEGORIES.map((c) => [c.value, c.label]));

export type ScholarApplication = {
  id: number;
  applicationId: string;
  scholarCategory: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  schoolName: string;
  course: string;
  yearLevel: number;
  gwa: string;
  monthlyIncome?: string | null;
  numberOfSiblings?: number | null;
  guardianOccupation?: string | null;
  guardianEmploymentStatus?: string | null;
  status: string;
  remarks?: string | null;
  submittedAt: string;
  updatedAt?: string;
};

export const INCOME_OPTIONS = [
  { value: "below_5000",   label: "Below ₱5,000/month" },
  { value: "5000_10000",   label: "₱5,000 – ₱10,000/month" },
  { value: "10000_20000",  label: "₱10,000 – ₱20,000/month" },
  { value: "20000_30000",  label: "₱20,000 – ₱30,000/month" },
  { value: "above_30000",  label: "Above ₱30,000/month" },
] as const;

export const EMPLOYMENT_OPTIONS = [
  { value: "employed",      label: "Employed (Regular/Contractual)" },
  { value: "self_employed", label: "Self-employed / Business" },
  { value: "unemployed",    label: "Unemployed" },
  { value: "ofw",           label: "OFW / Working Abroad" },
  { value: "deceased",      label: "Deceased" },
] as const;

export const INCOME_LABELS = Object.fromEntries(INCOME_OPTIONS.map((o) => [o.value, o.label]));
export const EMPLOYMENT_LABELS = Object.fromEntries(EMPLOYMENT_OPTIONS.map((o) => [o.value, o.label]));

export type StatusMeta = {
  label: string;
  tone: "pending" | "review" | "approved" | "rejected";
  bg: string;
  text: string;
  icon: LucideIcon;
  summary: string;
};

export const DOCUMENT_REQUIREMENTS = [
  "Certificate of Residency",
  "School ID / Enrollment Certificate",
  "Valid Government ID",
  "Recent 2x2 Photo",
];

export const STATUS_STEPS = [
  { key: "pending", label: "Received", icon: Clock },
  { key: "in_review", label: "Committee Review", icon: Search },
  { key: "approved", label: "Award Decision", icon: Award },
];

export function getStatusMeta(status?: string): StatusMeta {
  switch (status) {
    case "approved":
      return {
        label: "Approved",
        tone: "approved",
        bg: "#dcfce7",
        text: "#166534",
        icon: CheckCircle2,
        summary: "Application approved. Watch for official release or signing instructions.",
      };
    case "rejected":
      return {
        label: "Rejected",
        tone: "rejected",
        bg: "#fee2e2",
        text: "#991b1b",
        icon: FileText,
        summary: "Application not approved. Review remarks or contact scholarship office.",
      };
    case "in_review":
      return {
        label: "In Review",
        tone: "review",
        bg: "#dbeafe",
        text: "#1e40af",
        icon: Search,
        summary: "Committee is checking eligibility and submitted requirements.",
      };
    default:
      return {
        label: "Pending",
        tone: "pending",
        bg: "#fef3c7",
        text: "#92400e",
        icon: Clock,
        summary: "Application received. Prepare documents while waiting for review.",
      };
  }
}

export function getProfileCompleteness(application: ScholarApplication | null) {
  if (!application) {
    return { completed: 0, total: 13, percent: 0 };
  }

  const fields = [
    application.scholarCategory,
    application.firstName,
    application.lastName,
    application.email,
    application.phone,
    application.address,
    application.schoolName,
    application.course,
    application.gwa,
    application.monthlyIncome,
    application.guardianOccupation,
    application.guardianEmploymentStatus,
    application.numberOfSiblings != null ? String(application.numberOfSiblings) : null,
  ];
  const completed = fields.filter((field) => String(field ?? "").trim().length > 0).length;
  return {
    completed,
    total: fields.length,
    percent: Math.round((completed / fields.length) * 100),
  };
}

export function getNextAction(application: ScholarApplication | null) {
  if (!application) {
    return {
      label: "Start application",
      href: "/apply",
      description: "Submit your Iskolar ng San Pablo form inside the dashboard workspace.",
    };
  }

  const completeness = getProfileCompleteness(application);
  if (completeness.percent < 100) {
    return {
      label: "Complete profile details",
      href: "/profile",
      description: `${completeness.completed}/${completeness.total} profile fields complete.`,
    };
  }

  if (application.status === "approved") {
    return {
      label: "Review award instructions",
      href: "/profile",
      description: "Keep profile and contact details ready for release steps.",
    };
  }

  return {
    label: "Prepare required documents",
    href: "/profile",
    description: "Uploads are not stored yet; keep requirements ready for office validation.",
  };
}

export function formatDate(value?: string) {
  if (!value) return "Not recorded";
  return new Date(value).toLocaleDateString("en-PH", { dateStyle: "medium" });
}

export function formatYearLevel(yearLevel?: number) {
  if (!yearLevel) return "Not recorded";
  const suffix = ["st", "nd", "rd", "th", "th"][yearLevel - 1] ?? "th";
  return `${yearLevel}${suffix} Year`;
}
