export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
}

export interface AcademicInfo {
  institution: string;
  major: string;
  gpa: number;
  year: string;
  expectedGraduation: Date;
}

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  deadline: Date;
  requiredDocuments: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  referenceCode: string;
  scholarshipId: string;
  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo;
  status: ApplicationStatus;
  adminRemarks?: string;
  fileNames: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface AdminUser {
  id: string;
  username: string;
  createdAt: Date;
}

export interface ApplicationFormData {
  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo;
  scholarshipId: string;
  files: File[];
}

export interface ScholarshipFormData {
  title: string;
  description: string;
  eligibility: string;
  deadline: Date;
  requiredDocuments: string[];
  isActive: boolean;
}

export interface ApplicationFilters {
  status?: ApplicationStatus;
  scholarshipId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  activeScholarships: number;
  totalScholarships: number;
}

export interface FileUploadInfo {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}
