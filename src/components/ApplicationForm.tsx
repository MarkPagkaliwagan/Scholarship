"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, ChevronRight, ChevronLeft, FileText, AlertCircle, Loader2, User, GraduationCap, FolderOpen, ClipboardCheck, Badge, Users, Upload, X, FileCheck, Award } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { INCOME_OPTIONS, EMPLOYMENT_OPTIONS, SCHOLAR_CATEGORIES, CATEGORY_LABELS } from "@/lib/scholarship-ui";

const categorySchema = z.object({
  scholarCategory: z.string().min(1, "Please select a scholar category"),
});

const personalSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^09\d{9}$/, "Please enter a valid 11-digit Philippine mobile number starting with 09"),
  address: z.string().min(10, "Please enter your full address in San Pablo City"),
});

const educationSchema = z.object({
  schoolName: z.string().min(3, "School name is required"),
  course: z.string().min(2, "Course or program is required"),
  yearLevel: z.string().min(1, "Year level is required"),
  gwa: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid GWA (e.g., 1.50 or 92)"),
});

const familySchema = z.object({
  monthlyIncome: z.string().min(1, "Please select household income range"),
  numberOfSiblings: z.string().regex(/^\d+$/, "Enter a number (0 or more)"),
  guardianOccupation: z.string().min(2, "Occupation is required"),
  guardianEmploymentStatus: z.string().min(1, "Please select employment status"),
});

const formSchema = z.object({
  ...categorySchema.shape,
  ...personalSchema.shape,
  ...educationSchema.shape,
  ...familySchema.shape,
});

type FormData = z.infer<typeof formSchema>;

interface FormStep {
  id: string;
  title: string;
  icon: React.ElementType;
}

const steps: FormStep[] = [
  { id: "category",  title: "Category",  icon: Award },
  { id: "personal",  title: "Personal",  icon: User },
  { id: "education", title: "Education", icon: GraduationCap },
  { id: "family",    title: "Family",    icon: Users },
  { id: "documents", title: "Documents", icon: FolderOpen },
  { id: "review",    title: "Review",    icon: ClipboardCheck },
];

type ApplicationFormProps = {
  initialEmail?: string;
  lockEmail?: boolean;
  onSubmitted?: (applicationId: string) => void;
};

export default function ApplicationForm({ initialEmail = "", lockEmail = false, onSubmitted }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: { fileName: string; fileSize: number; id: number } }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: initialEmail,
    },
  });

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 0) {
      isValid = await trigger(["scholarCategory"]);
    } else if (currentStep === 1) {
      isValid = await trigger(["firstName", "lastName", "email", "phone", "address"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["schoolName", "course", "yearLevel", "gwa"]);
    } else if (currentStep === 3) {
      isValid = await trigger(["monthlyIncome", "numberOfSiblings", "guardianOccupation", "guardianEmploymentStatus"]);
    } else if (currentStep === 4) {
      const requiredDocs = ["residency", "school-id", "gov-id"];
      const allUploaded = requiredDocs.every((docId) => uploadedFiles[docId]);
      if (!allUploaded) {
        setUploadError("Please upload all required documents before proceeding.");
        return;
      }
      isValid = true;
    } else {
      isValid = true;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docId: string, docLabel: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit");
      return;
    }

    const isPhoto = docId === "photo";
    const allowedTypes = isPhoto
      ? ["image/jpeg", "image/png", "image/jpg"]
      : ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(isPhoto ? "Invalid file type. Only JPEG and PNG images are allowed for 2x2 photo." : "Invalid file type. Only PDF, JPEG, and PNG are allowed");
      return;
    }

    setUploadingDoc(docId);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentName", docLabel);

      const res = await fetch("/api/applications/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }

      const { document } = await res.json();
      setUploadedFiles((prev) => ({
        ...prev,
        [docId]: { fileName: file.name, fileSize: file.size, id: document.id },
      }));
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file");
    } finally {
      setUploadingDoc(null);
      if (e.target) e.target.value = "";
    }
  };

  const removeUploadedFile = (docId: string) => {
    setUploadedFiles((prev) => {
      const updated = { ...prev };
      delete updated[docId];
      return updated;
    });
  };

  const allRequiredUploaded = () => {
    const requiredDocs = ["residency", "school-id", "gov-id"];
    return requiredDocs.every((docId) => uploadedFiles[docId]);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const documentIds = Object.values(uploadedFiles).map((f) => f.id);
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, documentIds }),
      });
      if (!res.ok) throw new Error("Submission failed");
      const { applicationId: id } = await res.json();
      setApplicationId(id);
      setIsSuccess(true);
      onSubmitted?.(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="surface w-full max-w-2xl mx-auto p-8 md:p-12 text-center"
      >
        <div className="w-20 h-20 rounded-lg mx-auto mb-6 flex items-center justify-center" style={{ background: "var(--green-deep)", color: "white" }}>
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <p className="eyebrow mb-3">
          Application Received
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--green-deep)" }}>
          Thank You!
        </h2>
        <p className="lead text-base mb-8 max-w-md mx-auto">
          Your application has been submitted. Our scholarship committee will review your documents and get back to you within 2-4 weeks.
        </p>
        <div className="inline-flex items-center gap-4 px-8 py-4 rounded-lg mb-8" style={{ background: "var(--cream)" }}>
          <div className="text-left">
            <p className="value-label mb-1" style={{ color: "var(--green-mid)" }}>Application ID</p>
            <p className="text-2xl font-bold" style={{ color: "var(--green-deep)" }}>{applicationId}</p>
          </div>
          <div className="w-px h-12" style={{ background: "var(--sand)" }} />
          <Badge className="w-8 h-8" style={{ color: "var(--green-bright)" }} />
        </div>
        <div className="space-y-2 mb-8 p-6 rounded-lg text-left" style={{ background: "var(--parchment)" }}>
          <p className="text-sm font-medium mb-3" style={{ color: "var(--green-deep)" }}>What&apos;s Next?</p>
          <ul className="text-sm space-y-2" style={{ color: "var(--muted)" }}>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: "var(--green-bright)" }} /> Check your email for confirmation</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: "var(--green-bright)" }} /> Track status using your Application ID</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: "var(--green-bright)" }} /> Keep your contact information updated</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary px-8 py-3 font-medium">
            Return to Homepage
          </Link>
          <Link href="/dashboard" className="btn-secondary px-8 py-3 font-medium">
            Go to Dashboard
          </Link>
          <Link href="/howtoapply" className="btn-secondary px-8 py-3 font-medium">
            View Application Guide
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      <div className="mb-8">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const Icon = step.icon;
            
            return (
              <button
                key={step.id}
                onClick={() => index < currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
                className="flex-1 flex flex-col items-center gap-2 py-3 px-1 rounded-lg transition-all"
                style={{
                  background: isCurrent ? "rgba(45, 106, 79, 0.08)" : "transparent",
                  cursor: index > currentStep ? "default" : "pointer",
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: isCompleted || isCurrent ? "var(--green-deep)" : "#f3f4f6",
                    color: isCompleted || isCurrent ? "white" : "#9ca3af",
                    boxShadow: isCurrent ? "0 0 0 4px rgba(45, 106, 79, 0.15)" : "none",
                  }}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-center"
                  style={{
                    color: isCurrent ? "var(--green-deep)" : isCompleted ? "var(--green-mid)" : "#9ca3af",
                  }}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "var(--sand)" }}>
          <motion.div 
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            style={{ background: "var(--green-deep)" }}
          />
        </div>
      </div>

      <motion.div 
        className="surface p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--green-deep)", color: "white" }}>
                    <Award className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--green-deep)" }}>
                    Category of Scholar
                  </h2>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Select the category that best describes your scholarship eligibility.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SCHOLAR_CATEGORIES.map((cat) => {
                    const selected = watch("scholarCategory") === cat.value;
                    return (
                      <div
                        key={cat.value}
                        onClick={() => {
                          setValue("scholarCategory", cat.value, { shouldValidate: true });
                        }}
                        className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                          selected
                            ? "border-[var(--green-deep)] bg-[var(--cream)]"
                            : "border-gray-100 bg-gray-50/30 hover:border-[var(--green-bright)] hover:bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 transition-all ${
                              selected ? "border-[var(--green-deep)]" : "border-gray-300"
                            }`}
                          >
                            {selected && (
                              <div className="w-3 h-3 rounded-full" style={{ background: "var(--green-deep)" }} />
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${selected ? "text-[var(--green-deep)]" : "text-gray-700"}`}>
                              {cat.label}
                            </p>
                            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
                              {cat.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.scholarCategory && (
                  <p className="text-red-500 text-xs flex items-center gap-1 mt-4 justify-center">
                    <AlertCircle className="w-3 h-3" /> {errors.scholarCategory.message}
                  </p>
                )}
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="firstName" 
                      {...register("firstName")} 
                      placeholder="Enter your first name"
                      className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all ${
                        errors.firstName 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30'
                      } focus:bg-white focus:outline-none`} 
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="lastName" 
                      {...register("lastName")} 
                      placeholder="Enter your last name"
                      className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all ${
                        errors.lastName 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30'
                      } focus:bg-white focus:outline-none`} 
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="email" 
                      type="email" 
                      {...register("email")} 
                      placeholder="your.email@example.com"
                      readOnly={lockEmail}
                      className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all ${
                        errors.email 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : lockEmail
                            ? 'border-[var(--sand-soft)] bg-[var(--cream)]'
                            : 'border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30'
                      } focus:bg-white focus:outline-none`}
                    />
                    {lockEmail && (
                      <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                        Email comes from your San Pablo Scholars account.
                      </p>
                    )}
                    {errors.email && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="phone" 
                      type="tel" 
                      placeholder="09XX XXX XXXX"
                      {...register("phone")} 
                      className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all ${
                        errors.phone 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30'
                      } focus:bg-white focus:outline-none`} 
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <label htmlFor="address" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                    Full Address in San Pablo City <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    id="address" 
                    rows={3} 
                    {...register("address")} 
                    placeholder="House No., Street, Barangay, City"
                    className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all resize-none ${
                      errors.address 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30'
                    } focus:bg-white focus:outline-none`} 
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.address.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <label htmlFor="schoolName" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                    Name of School / University <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="schoolName" 
                    {...register("schoolName")} 
                    placeholder="e.g., Laguna State Polytechnic University"
                    className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all ${
                      errors.schoolName 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30'
                    } focus:bg-white focus:outline-none`} 
                  />
                  {errors.schoolName && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.schoolName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <label htmlFor="course" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      Course / Program <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="course" 
                      {...register("course")} 
                      placeholder="e.g., Bachelor of Science in Information Technology"
                      className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all ${
                        errors.course 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30'
                      } focus:bg-white focus:outline-none`} 
                    />
                    {errors.course && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.course.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="yearLevel" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      Year Level <span className="text-red-500">*</span>
                    </label>
                    <select 
                      id="yearLevel" 
                      {...register("yearLevel")} 
                      className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all appearance-none ${
                        errors.yearLevel 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30'
                      } focus:bg-white focus:outline-none`}
                      style={{ WebkitAppearance: "none", MozAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: "right 1rem center", backgroundSize: "1.25rem", backgroundRepeat: "no-repeat" }}
                    >
                      <option value="">Select year level...</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                    </select>
                    {errors.yearLevel && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.yearLevel.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <label htmlFor="gwa" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                    Latest GWA <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="gwa" 
                    placeholder="e.g., 1.50 or 92"
                    {...register("gwa")} 
                    className={`w-full md:w-1/2 px-4 py-3.5 rounded-lg border-2 transition-all ${
                      errors.gwa 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30'
                    } focus:bg-white focus:outline-none`} 
                  />
                  {errors.gwa && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.gwa.message}
                    </p>
                  )}
                  <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>Decimal (1.00-5.00) or percentage (60-100)</p>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="monthlyIncome" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      Monthly Household Income <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="monthlyIncome"
                      {...register("monthlyIncome")}
                      className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all appearance-none ${
                        errors.monthlyIncome
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : "border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30"
                      } focus:bg-white focus:outline-none`}
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: "right 1rem center", backgroundSize: "1.25rem", backgroundRepeat: "no-repeat" }}
                    >
                      <option value="">Select income range...</option>
                      {INCOME_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    {errors.monthlyIncome && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.monthlyIncome.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="numberOfSiblings" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      Number of Siblings <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="numberOfSiblings"
                      type="number"
                      min={0}
                      max={20}
                      {...register("numberOfSiblings")}
                      placeholder="e.g., 3"
                      className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all ${
                        errors.numberOfSiblings
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : "border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30"
                      } focus:bg-white focus:outline-none`}
                    />
                    {errors.numberOfSiblings && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.numberOfSiblings.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="guardianOccupation" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      Parent / Guardian Occupation <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="guardianOccupation"
                      {...register("guardianOccupation")}
                      placeholder="e.g., Farmer, Vendor, Driver"
                      className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all ${
                        errors.guardianOccupation
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : "border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30"
                      } focus:bg-white focus:outline-none`}
                    />
                    {errors.guardianOccupation && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.guardianOccupation.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="guardianEmploymentStatus" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      Employment Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="guardianEmploymentStatus"
                      {...register("guardianEmploymentStatus")}
                      className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all appearance-none ${
                        errors.guardianEmploymentStatus
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : "border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30"
                      } focus:bg-white focus:outline-none`}
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: "right 1rem center", backgroundSize: "1.25rem", backgroundRepeat: "no-repeat" }}
                    >
                      <option value="">Select status...</option>
                      {EMPLOYMENT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    {errors.guardianEmploymentStatus && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.guardianEmploymentStatus.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 p-4 rounded-lg flex items-center gap-3" style={{ background: "var(--parchment)" }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--green-bright)" }} />
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    This information is used only for eligibility assessment and is kept confidential.
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  {[
                    { label: "Certificate of Residency", desc: "Issued by Barangay (last 3 months)", required: true, id: "residency" },
                    { label: "School ID / Enrollment Certificate", desc: "Current semester enrollment", required: true, id: "school-id" },
                    { label: "Valid Government ID", desc: "PSA, Passport, or any gov't-issued ID", required: true, id: "gov-id" },
                    { label: "Recent 2x2 Photo", desc: "White background, professional attire", required: false, id: "photo" },
                  ].map((doc) => (
                    <div 
                      key={doc.id} 
                      className="border-2 rounded-lg p-5 transition-all"
                      style={{ borderColor: "var(--sand)", background: "var(--cream)" }}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "var(--green-deep)", color: "white" }}
                          >
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: "var(--green-deep)" }}>
                              {doc.label} {doc.required && <span className="text-red-500">*</span>}
                            </p>
                            <p className="text-sm" style={{ color: "var(--muted)" }}>{doc.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {uploadingDoc === doc.id ? (
                            <div className="px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2" style={{ background: "var(--paper)", color: "var(--green-deep)" }}>
                              <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                            </div>
                          ) : (
                            <>
                              <input
                                type="file"
                                ref={(el) => { fileInputRefs.current[doc.id] = el; }}
                                className="hidden"
                                accept={doc.id === "photo" ? ".jpg,.jpeg,.png" : ".pdf,.jpg,.jpeg,.png"}
                                onChange={(e) => handleFileUpload(e, doc.id, doc.label)}
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRefs.current[doc.id]?.click()}
                                className="px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all hover:opacity-90"
                                style={{ background: "var(--green-deep)", color: "white" }}
                              >
                                <Upload className="w-4 h-4" /> Upload File
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {uploadedFiles[doc.id] && (
                        <div className="mt-4 p-3 rounded-lg flex items-center gap-3" style={{ background: "var(--parchment)" }}>
                          <FileCheck className="w-5 h-5 flex-shrink-0" style={{ color: "var(--green-bright)" }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: "var(--green-deep)" }}>
                              {uploadedFiles[doc.id].fileName}
                            </p>
                            <p className="text-xs" style={{ color: "var(--muted)" }}>
                              {(uploadedFiles[doc.id].fileSize / 1024).toFixed(1)} KB • Uploaded
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeUploadedFile(doc.id)}
                            className="p-1 rounded hover:bg-red-100 transition-colors"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {uploadError && (
                  <div className="mt-4 p-4 rounded-lg flex items-center gap-3" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                    <p className="text-sm text-red-600">{uploadError}</p>
                  </div>
                )}
                {Object.keys(uploadedFiles).length > 0 && (
                  <div className="mt-6 rounded-lg overflow-hidden" style={{ border: "1px solid var(--sand)" }}>
                    <div className="p-4" style={{ background: "var(--cream)" }}>
                      <h4 className="font-medium text-sm" style={{ color: "var(--green-deep)" }}>Uploaded Documents</h4>
                    </div>
                    <table className="w-full text-sm">
                      <thead style={{ background: "var(--parchment)" }}>
                        <tr>
                          <th className="text-left p-3 text-xs font-medium" style={{ color: "var(--muted)" }}>Document</th>
                          <th className="text-left p-3 text-xs font-medium" style={{ color: "var(--muted)" }}>File Name</th>
                          <th className="text-left p-3 text-xs font-medium" style={{ color: "var(--muted)" }}>Size</th>
                          <th className="text-left p-3 text-xs font-medium" style={{ color: "var(--muted)" }}>Status</th>
                          <th className="text-center p-3 text-xs font-medium" style={{ color: "var(--muted)" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(uploadedFiles).map(([docId, file]) => {
                          const doc = [
                            { id: "residency", label: "Certificate of Residency" },
                            { id: "school-id", label: "School ID / Enrollment Certificate" },
                            { id: "gov-id", label: "Valid Government ID" },
                            { id: "photo", label: "Recent 2x2 Photo" },
                          ].find(d => d.id === docId);
                          return (
                            <tr key={docId} className="border-t" style={{ borderColor: "var(--sand)" }}>
                              <td className="p-3 font-medium" style={{ color: "var(--green-deep)" }}>{doc?.label || docId}</td>
                              <td className="p-3 truncate max-w-[200px]" style={{ color: "var(--muted)" }}>{file.fileName}</td>
                              <td className="p-3" style={{ color: "var(--muted)" }}>{(file.fileSize / 1024).toFixed(1)} KB</td>
                              <td className="p-3">
                                <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: "#dcfce7", color: "#166534" }}>Uploaded</span>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeUploadedFile(docId)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div 
                  className="mt-5 p-4 rounded-lg flex items-center gap-3"
                  style={{ background: "var(--parchment)" }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--green-bright)" }} />
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Accepted formats: PDF, JPEG, PNG (Max 5MB per file). Required documents must be uploaded before submission.
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="rounded-lg p-6 md:p-8 space-y-6"
                  style={{ background: "var(--cream)", border: "1px solid var(--sand)" }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-4 h-4" style={{ color: "var(--green-bright)" }} />
                      <h3 className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--green-mid)" }}>
                        Scholar Category
                      </h3>
                    </div>
                    <div className="p-4 rounded-lg bg-white border text-sm" style={{ borderColor: "var(--sand)" }}>
                      <p className="font-medium" style={{ color: "var(--green-deep)" }}>
                        {CATEGORY_LABELS[getValues("scholarCategory") as keyof typeof CATEGORY_LABELS] || getValues("scholarCategory") || "—"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-4 h-4" style={{ color: "var(--green-bright)" }} />
                      <h3 className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--green-mid)" }}>
                        Personal Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 rounded-lg bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Full Name</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>
                          {getValues("firstName")} {getValues("lastName")}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Email Address</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("email") || "—"}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Mobile Number</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("phone") || "—"}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white border sm:col-span-2" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Address</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("address") || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap className="w-4 h-4" style={{ color: "var(--green-bright)" }} />
                      <h3 className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--green-mid)" }}>
                        Educational Background
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 rounded-lg bg-white border sm:col-span-2" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>School / University</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("schoolName") || "—"}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Course / Program</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("course") || "—"}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Year Level</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>
                          {getValues("yearLevel") ? `${getValues("yearLevel")}${getValues("yearLevel") === "1" ? "st" : getValues("yearLevel") === "2" ? "nd" : getValues("yearLevel") === "3" ? "rd" : "th"} Year` : "—"}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>GWA</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("gwa") || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4" style={{ color: "var(--green-bright)" }} />
                      <h3 className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--green-mid)" }}>
                        Family Background
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 rounded-lg bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Monthly Household Income</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>
                          {INCOME_OPTIONS.find((o) => o.value === getValues("monthlyIncome"))?.label || "—"}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Number of Siblings</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("numberOfSiblings") || "—"}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Guardian Occupation</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("guardianOccupation") || "—"}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Employment Status</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>
                          {EMPLOYMENT_OPTIONS.find((o) => o.value === getValues("guardianEmploymentStatus"))?.label || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-4 p-5 rounded-lg" style={{ background: "var(--parchment)", border: "1px solid rgba(45, 106, 79, 0.1)" }}>
                  <input 
                    type="checkbox" 
                    id="terms" 
                    required 
                    className="mt-0.5 w-4 h-4 rounded cursor-pointer"
                    style={{ 
                      accentColor: "var(--green-deep)",
                    }} 
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer" style={{ color: "var(--muted)" }}>
                    <span className="font-medium" style={{ color: "var(--green-deep)" }}>Declaration:</span> I certify that all information provided is true and correct. False information may lead to rejection or revocation of the scholarship.
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 flex items-center justify-between gap-4" style={{ borderTop: "1px solid var(--sand)" }}>
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
              style={{
                background: currentStep === 0 ? "transparent" : "#f9fafb",
                color: currentStep === 0 ? "transparent" : "var(--green-deep)",
                border: currentStep === 0 ? "none" : "1px solid #e5e7eb",
                cursor: currentStep === 0 ? "default" : "pointer",
              }}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary px-8 py-3 font-medium"
                style={{ background: "var(--green-deep)", color: "white" }}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-3 rounded-lg font-medium transition-all flex items-center gap-2 hover:opacity-90 disabled:opacity-70 shadow-md"
                style={{ background: "#b45309", color: "white" }}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Submit Application</>
                )}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
