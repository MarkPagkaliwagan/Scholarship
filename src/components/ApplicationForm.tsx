"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import * as z from "zod";
import { CheckCircle2, ChevronRight, ChevronLeft, UploadCloud, FileText, AlertCircle, Loader2, User, GraduationCap, FolderOpen, UserCog, ClipboardCheck, Shield, Badge, Copy, Check } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

const formSchema = z.object({
  ...personalSchema.shape,
  ...educationSchema.shape,
});

type FormData = z.infer<typeof formSchema>;

interface FormStep {
  id: string;
  title: string;
  icon: React.ElementType;
}

const steps: FormStep[] = [
  { id: "personal", title: "Personal", icon: User },
  { id: "education", title: "Education", icon: GraduationCap },
  { id: "documents", title: "Documents", icon: FolderOpen },
  { id: "account", title: "Account", icon: UserCog },
  { id: "review", title: "Review", icon: ClipboardCheck },
];

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [accountUsername, setAccountUsername] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  });

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 0) {
      isValid = await trigger(["firstName", "lastName", "email", "phone", "address"]);
    } else if (currentStep === 1) {
      isValid = await trigger(["schoolName", "course", "yearLevel", "gwa"]);
    } else if (currentStep === 3) {
      if (!accountUsername.trim()) { setAccountError("Username is required."); return; }
      if (!accountPassword) { setAccountError("Password is required."); return; }
      if (!accountCreated) {
        setIsSubmitting(true);
        setAccountError(null);
        const { error } = await authClient.signUp.email({
          email: getValues("email"),
          password: accountPassword,
          name: accountUsername,
        });
        setIsSubmitting(false);
        if (error) { setAccountError(error.message ?? "Account creation failed."); return; }
        setAccountCreated(true);
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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      const { applicationId: id } = await res.json();
      setApplicationId(id);
      setIsSuccess(true);
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
        className="w-full max-w-2xl mx-auto p-8 md:p-12 text-center bg-white rounded-3xl shadow-sm border"
        style={{ borderColor: "var(--sand)" }}
      >
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "var(--green-deep)", color: "white" }}>
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "var(--green-bright)" }}>
          Application Received
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--green-deep)" }}>
          Thank You!
        </h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "var(--muted)" }}>
          Your application has been submitted. Our scholarship committee will review your documents and get back to you within 2-4 weeks.
        </p>
        <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl mb-8" style={{ background: "var(--cream)" }}>
          <div className="text-left">
            <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--green-mid)" }}>Application ID</p>
            <p className="text-2xl font-bold" style={{ color: "var(--green-deep)" }}>{applicationId}</p>
          </div>
          <div className="w-px h-12" style={{ background: "var(--sand)" }} />
          <Badge className="w-8 h-8" style={{ color: "var(--green-bright)" }} />
        </div>
        <div className="space-y-2 mb-8 p-6 rounded-2xl text-left" style={{ background: "var(--parchment)" }}>
          <p className="text-sm font-medium mb-3" style={{ color: "var(--green-deep)" }}>What&apos;s Next?</p>
          <ul className="text-sm space-y-2" style={{ color: "var(--muted)" }}>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: "var(--green-bright)" }} /> Check your email for confirmation</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: "var(--green-bright)" }} /> Track status using your Application ID</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: "var(--green-bright)" }} /> Keep your contact information updated</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-8 py-3 rounded-full font-medium transition-all hover:opacity-90" style={{ background: "var(--green-deep)", color: "white" }}>
            Return to Homepage
          </Link>
          <Link href="/howtoapply" className="px-8 py-3 rounded-full font-medium border-2 transition-all hover:bg-gray-50" style={{ borderColor: "var(--green-deep)", color: "var(--green-deep)" }}>
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
                className="flex-1 flex flex-col items-center gap-2 py-3 px-1 rounded-xl transition-all"
                style={{
                  background: isCurrent ? "rgba(45, 106, 79, 0.08)" : "transparent",
                  cursor: index > currentStep ? "default" : "pointer",
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
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
        className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border"
        style={{ borderColor: "var(--sand)" }}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="firstName" 
                      {...register("firstName")} 
                      placeholder="Enter your first name"
                      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all ${
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
                      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all ${
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
                      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all ${
                        errors.email 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30'
                      } focus:bg-white focus:outline-none`} 
                    />
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
                      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all ${
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
                    className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all resize-none ${
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

            {currentStep === 1 && (
              <motion.div
                key="step-1"
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
                    className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all ${
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
                      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all ${
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
                      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all appearance-none ${
                        errors.yearLevel 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30'
                      } focus:bg-white focus:outline-none`}
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: "right 1rem center", backgroundSize: "1.25rem" }}
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
                    className={`w-full md:w-1/2 px-4 py-3.5 rounded-xl border-2 transition-all ${
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

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  {[
                    { label: "Certificate of Residency", desc: "Issued by Barangay (last 3 months)", required: true },
                    { label: "School ID / Enrollment Certificate", desc: "Current semester enrollment", required: true },
                    { label: "Valid Government ID", desc: "PSA, Passport, or any gov't-issued ID", required: true },
                    { label: "Recent 2x2 Photo", desc: "White background, professional attire", required: false },
                  ].map((doc, idx) => (
                    <div 
                      key={idx} 
                      className="border-2 border-dashed rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:border-[var(--green-bright)] cursor-pointer"
                      style={{ borderColor: "var(--sand)", background: "var(--cream)" }}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
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
                      <div 
                        className="px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all hover:opacity-80"
                        style={{ background: "var(--green-deep)", color: "white" }}
                      >
                        <UploadCloud className="w-4 h-4" /> Upload
                      </div>
                    </div>
                  ))}
                </div>
                <div 
                  className="mt-5 p-4 rounded-xl flex items-center gap-3"
                  style={{ background: "var(--parchment)" }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--green-bright)" }} />
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Accepted: PDF, JPG, PNG (max 10MB per file)
                  </p>
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
                <div 
                  className="p-5 rounded-2xl mb-6 flex items-start gap-4"
                  style={{ background: "rgba(45, 106, 79, 0.06)", border: "1px solid rgba(45, 106, 79, 0.1)" }}
                >
                  <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--green-mid)" }} />
                  <div>
                    <p className="font-medium mb-1" style={{ color: "var(--green-deep)" }}>Create Your Account</p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>Track your application status and receive updates.</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={accountUsername}
                      onChange={(e) => { setAccountUsername(e.target.value); setAccountError(null); }}
                      placeholder="Choose a username"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-[var(--green-bright)] bg-gray-50/30 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={accountPassword}
                        readOnly
                        placeholder="Click Generate Password"
                        className="flex-1 px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/30 focus:outline-none"
                        style={{ color: accountPassword ? "var(--green-deep)" : "var(--muted)" }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const pwd = "Sp" + Math.random().toString(36).slice(-4).toUpperCase() + Math.random().toString(36).slice(-4) + "!@#$"[0] + Math.floor(Math.random() * 999) + 1;
                          setAccountPassword(pwd);
                          setAccountError(null);
                        }}
                        className="px-4 py-3 rounded-xl font-medium transition-all"
                        style={{ background: "var(--green-deep)", color: "white" }}
                      >
                        Generate
                      </button>
                      {accountPassword && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(accountPassword);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="px-4 py-3 rounded-xl font-medium transition-all"
                          style={{ background: "var(--cream)", color: "var(--green-deep)" }}
                        >
                          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                      )}
                    </div>
                  </div>
                  {accountError && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {accountError}
                    </p>
                  )}
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
                <div 
                  className="rounded-2xl p-6 md:p-8 space-y-6"
                  style={{ background: "var(--cream)", border: "1px solid var(--sand)" }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-4 h-4" style={{ color: "var(--green-bright)" }} />
                      <h3 className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--green-mid)" }}>
                        Personal Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 rounded-xl bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Full Name</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>
                          {getValues("firstName")} {getValues("lastName")}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Email Address</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("email") || "—"}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Mobile Number</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("phone") || "—"}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white border sm:col-span-2" style={{ borderColor: "var(--sand)" }}>
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
                      <div className="p-4 rounded-xl bg-white border sm:col-span-2" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>School / University</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("schoolName") || "—"}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Course / Program</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("course") || "—"}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Year Level</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>
                          {getValues("yearLevel") ? `${getValues("yearLevel")}${getValues("yearLevel") === "1" ? "st" : getValues("yearLevel") === "2" ? "nd" : getValues("yearLevel") === "3" ? "rd" : "th"} Year` : "—"}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-white border" style={{ borderColor: "var(--sand)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>GWA</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{getValues("gwa") || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-4 p-5 rounded-xl" style={{ background: "var(--parchment)", border: "1px solid rgba(45, 106, 79, 0.1)" }}>
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
              className="px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2"
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
                className="px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2 hover:opacity-90 shadow-md"
                style={{ background: "var(--green-deep)", color: "white" }}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-3 rounded-full font-medium transition-all flex items-center gap-2 hover:opacity-90 disabled:opacity-70 shadow-md"
                style={{ background: "#f97316", color: "white" }}
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