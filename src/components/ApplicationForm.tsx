"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, ChevronRight, ChevronLeft, UploadCloud, FileText, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

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

const steps = [
  { id: "personal", title: "Personal Details" },
  { id: "education", title: "Education" },
  { id: "documents", title: "Documents" },
  { id: "account", title: "Account" },
  { id: "review", title: "Review" },
];

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState("");

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
    } else if (currentStep === 2) {
      // Document upload validation would go here. Assuming valid for now.
      isValid = true;
    } else if (currentStep === 3) {
      // Account validation would go here. Assuming valid for now.
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", data);
    setApplicationId(`SPC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    setIsSubmitting(false);
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 md:p-12 text-center bg-white rounded-3xl shadow-sm border" style={{ borderColor: "var(--sand)" }}>
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-in zoom-in" style={{ background: "var(--green-light)", color: "var(--green-deep)" }}>
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-display text-4xl font-bold mb-4" style={{ color: "var(--green-deep)" }}>Application Submitted!</h2>
        <p className="font-body text-lg mb-8" style={{ color: "var(--muted)" }}>
          Thank you for applying. We have received your application and will begin the evaluation process soon.
        </p>
        <div className="p-6 rounded-2xl mb-8" style={{ background: "var(--cream)" }}>
          <p className="font-mono text-sm uppercase tracking-widest mb-2" style={{ color: "var(--green-mid)" }}>Your Application ID</p>
          <p className="font-mono text-3xl font-bold tracking-widest" style={{ color: "var(--green-deep)" }}>{applicationId}</p>
        </div>
        <p className="font-body text-sm mb-8" style={{ color: "var(--muted)" }}>
          Please save this ID. You can use it to track your application status on our homepage.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium font-body transition-all hover:opacity-90" style={{ background: "var(--green-deep)", color: "var(--cream)" }}>
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      
      {/* Progress Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200 z-0" />
          <div className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 transition-all duration-500 z-0" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%`, background: "var(--green-bright)" }} />
          
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm transition-colors duration-300 ${
                  isCompleted ? "bg-[var(--green-bright)] text-white" : 
                  isCurrent ? "bg-[var(--green-deep)] text-white ring-4 ring-[var(--green-light)]" : 
                  "bg-white border-2 border-gray-200 text-gray-400"
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider absolute top-12 whitespace-nowrap transition-colors ${
                  isCurrent ? "text-[var(--green-deep)]" : "text-gray-400"
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border mt-16" style={{ borderColor: "var(--sand)" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Step 1: Personal Details */}
          <div className={currentStep === 0 ? "block" : "hidden"}>
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold mb-2" style={{ color: "var(--green-deep)" }}>Personal Details</h2>
              <p className="font-body text-[var(--muted)]">Please provide your legal name and contact information.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>First Name <span className="text-red-500">*</span></label>
                <input id="firstName" {...register("firstName")} className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[var(--green-bright)]'} focus:outline-none focus:ring-2`} />
                {errors.firstName && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>Last Name <span className="text-red-500">*</span></label>
                <input id="lastName" {...register("lastName")} className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[var(--green-bright)]'} focus:outline-none focus:ring-2`} />
                {errors.lastName && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>Email Address <span className="text-red-500">*</span></label>
                <input id="email" type="email" {...register("email")} className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[var(--green-bright)]'} focus:outline-none focus:ring-2`} />
                {errors.email && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>Mobile Number <span className="text-red-500">*</span></label>
                <input id="phone" type="tel" placeholder="09XX XXX XXXX" {...register("phone")} className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[var(--green-bright)]'} focus:outline-none focus:ring-2`} />
                {errors.phone && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label htmlFor="address" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>Full Address in San Pablo City <span className="text-red-500">*</span></label>
              <textarea id="address" rows={3} {...register("address")} className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[var(--green-bright)]'} focus:outline-none focus:ring-2 resize-none`} />
              {errors.address && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.address.message}</p>}
            </div>
          </div>

          {/* Step 2: Education */}
          <div className={currentStep === 1 ? "block" : "hidden"}>
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold mb-2" style={{ color: "var(--green-deep)" }}>Educational Background</h2>
              <p className="font-body text-[var(--muted)]">Details about your current academic standing.</p>
            </div>
            
            <div className="space-y-2 mb-6">
              <label htmlFor="schoolName" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>Name of School / University <span className="text-red-500">*</span></label>
              <input id="schoolName" {...register("schoolName")} className={`w-full px-4 py-3 rounded-xl border ${errors.schoolName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[var(--green-bright)]'} focus:outline-none focus:ring-2`} />
              {errors.schoolName && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.schoolName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="course" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>Course / Program <span className="text-red-500">*</span></label>
                <input id="course" {...register("course")} className={`w-full px-4 py-3 rounded-xl border ${errors.course ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[var(--green-bright)]'} focus:outline-none focus:ring-2`} />
                {errors.course && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.course.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="yearLevel" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>Year Level <span className="text-red-500">*</span></label>
                  <select id="yearLevel" {...register("yearLevel")} className={`w-full px-4 py-3 rounded-xl border bg-white ${errors.yearLevel ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[var(--green-bright)]'} focus:outline-none focus:ring-2 appearance-none`}>
                    <option value="">Select...</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                  {errors.yearLevel && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.yearLevel.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="gwa" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>Latest GWA <span className="text-red-500">*</span></label>
                  <input id="gwa" placeholder="e.g. 1.50 or 92" {...register("gwa")} className={`w-full px-4 py-3 rounded-xl border ${errors.gwa ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[var(--green-bright)]'} focus:outline-none focus:ring-2`} />
                  {errors.gwa && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.gwa.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Documents */}
          <div className={currentStep === 2 ? "block" : "hidden"}>
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold mb-2" style={{ color: "var(--green-deep)" }}>Required Documents</h2>
              <p className="font-body text-[var(--muted)]">Please upload clear copies of the following documents. (PDF, JPG, PNG)</p>
            </div>
            
            <div className="space-y-4">
              {[
                { label: "Certificate of Residency", desc: "Issued within the last 3 months" },
                { label: "Valid ID", desc: "School ID or any Government ID" }
              ].map((doc, idx) => (
                <div key={idx} className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform text-[var(--green-bright)]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "var(--green-deep)" }}>{doc.label}</p>
                      <p className="text-sm text-gray-500">{doc.desc}</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-white border shadow-sm font-medium text-sm flex items-center gap-2 text-[var(--green-deep)]">
                    <UploadCloud className="w-4 h-4" /> Upload
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-6 flex items-start gap-2 bg-blue-50 p-4 rounded-xl text-blue-900">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              Note: For this prototype, document upload is simulated. You do not need to upload actual files to proceed.
            </p>
          </div>

          {/* Step 4: Account */}
          <div className={currentStep === 3 ? "block" : "hidden"}>
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold mb-2" style={{ color: "var(--green-deep)" }}>Account Information</h2>
              <p className="font-body text-[var(--muted)]">Create your account to track your application status.</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>Username <span className="text-red-500">*</span></label>
                <input id="username" type="text" placeholder="Choose a username" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--green-bright)]" />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>Password <span className="text-red-500">*</span></label>
                <input id="password" type="password" placeholder="Create a password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--green-bright)]" />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{ color: "var(--green-deep)" }}>Confirm Password <span className="text-red-500">*</span></label>
                <input id="confirmPassword" type="password" placeholder="Confirm your password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--green-bright)]" />
              </div>
            </div>
            
            <p className="text-sm text-gray-500 flex items-start gap-2 bg-blue-50 p-4 rounded-xl text-blue-900">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              Note: For this prototype, account creation is simulated. You can proceed without entering credentials.
            </p>
          </div>

          {/* Step 5: Review */}
          <div className={currentStep === 4 ? "block" : "hidden"}>
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold mb-2" style={{ color: "var(--green-deep)" }}>Review & Submit</h2>
              <p className="font-body text-[var(--muted)]">Please review your application details before submitting.</p>
            </div>
            
            <div className="bg-[var(--cream)] rounded-2xl p-6 md:p-8 space-y-8 border border-[var(--sand)]">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--green-mid)] mb-4 border-b border-[var(--sand)] pb-2">Personal Details</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div><p className="text-gray-500">Full Name</p><p className="font-medium text-[var(--ink)]">{getValues("firstName")} {getValues("lastName")}</p></div>
                  <div><p className="text-gray-500">Email</p><p className="font-medium text-[var(--ink)]">{getValues("email") || "—"}</p></div>
                  <div><p className="text-gray-500">Phone</p><p className="font-medium text-[var(--ink)]">{getValues("phone") || "—"}</p></div>
                  <div className="col-span-2"><p className="text-gray-500">Address</p><p className="font-medium text-[var(--ink)]">{getValues("address") || "—"}</p></div>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--green-mid)] mb-4 border-b border-[var(--sand)] pb-2">Education</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="col-span-2"><p className="text-gray-500">School / University</p><p className="font-medium text-[var(--ink)]">{getValues("schoolName") || "—"}</p></div>
                  <div><p className="text-gray-500">Course / Program</p><p className="font-medium text-[var(--ink)]">{getValues("course") || "—"}</p></div>
                  <div><p className="text-gray-500">Year Level</p><p className="font-medium text-[var(--ink)]">{getValues("yearLevel") ? `Year ${getValues("yearLevel")}` : "—"}</p></div>
                  <div><p className="text-gray-500">GWA</p><p className="font-medium text-[var(--ink)]">{getValues("gwa") || "—"}</p></div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 text-[var(--green-deep)] border-gray-300 rounded focus:ring-[var(--green-bright)]" />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                I hereby certify that all information provided in this application is true and correct to the best of my knowledge. I understand that any false information may lead to the rejection of my application or revocation of the scholarship.
              </label>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2 ${currentStep === 0 ? 'invisible' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2 hover:opacity-90"
                style={{ background: "var(--green-deep)", color: "var(--cream)" }}
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2 hover:opacity-90 disabled:opacity-70"
                style={{ background: "#F97316", color: "white" }}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Submit Application</>
                )}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
