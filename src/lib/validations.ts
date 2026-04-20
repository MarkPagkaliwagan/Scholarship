import { z } from 'zod';

// Personal Info Validation
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  dateOfBirth: z.date().refine(
    (date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 16 && age <= 100;
    },
    'Applicant must be between 16 and 100 years old'
  ),
});

// Academic Info Validation
export const academicInfoSchema = z.object({
  institution: z.string().min(3, 'Institution name must be at least 3 characters'),
  major: z.string().min(3, 'Major must be at least 3 characters'),
  gpa: z.number().min(0).max(4.0, 'GPA must be between 0 and 4.0'),
  year: z.enum(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'], {
    message: 'Please select your academic year',
  }),
  expectedGraduation: z.date().refine(
    (date) => date > new Date(),
    'Expected graduation date must be in the future'
  ),
});

// Scholarship Validation
export const scholarshipSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  eligibility: z.string().min(10, 'Eligibility criteria must be at least 10 characters'),
  deadline: z.date().refine(
    (date) => date > new Date(),
    'Deadline must be in the future'
  ),
  requiredDocuments: z.array(z.string()).min(1, 'At least one required document must be specified'),
  isActive: z.boolean(),
});

// Application Form Validation
export const applicationFormSchema = z.object({
  personalInfo: personalInfoSchema,
  academicInfo: academicInfoSchema,
  scholarshipId: z.string().min(1, 'Please select a scholarship'),
  files: z.array(z.any()).min(1, 'At least one file must be uploaded'),
});

// Admin Login Validation
export const adminLoginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Reference Code Validation
export const referenceCodeSchema = z.object({
  referenceCode: z.string()
    .regex(/^SCH-\d{4}-\d{4}$/, 'Reference code must be in format SCH-YYYY-XXXX')
    .min(12, 'Invalid reference code format'),
});

// File Upload Validation
export const fileUploadSchema = z.object({
  file: z.any().refine(
    (file) => file instanceof File,
    'Please select a file'
  ).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB
    'File size must be less than 5MB'
  ).refine(
    (file) => {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return allowedTypes.includes(file.type);
    },
    'Only PDF, DOC, DOCX, JPG, and PNG files are allowed'
  ),
});

// Search/Filter Validation
export const applicationFiltersSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']).optional(),
  scholarshipId: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  searchTerm: z.string().optional(),
});

// Export types
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AcademicInfoFormData = z.infer<typeof academicInfoSchema>;
export type ScholarshipFormData = z.infer<typeof scholarshipSchema>;
export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
export type ReferenceCodeFormData = z.infer<typeof referenceCodeSchema>;
export type ApplicationFiltersFormData = z.infer<typeof applicationFiltersSchema>;
