import { Scholarship, Application, PersonalInfo, AcademicInfo, ApplicationStatus } from './types';

// Sample scholarships data
export const mockScholarships: Scholarship[] = [
  {
    id: 'sch-001',
    title: 'Academic Excellence Scholarship',
    description: 'Awarded to students with outstanding academic performance and leadership potential.',
    eligibility: 'Minimum GPA of 3.5, enrolled full-time, demonstrated leadership experience',
    deadline: new Date('2024-12-31'),
    requiredDocuments: ['Transcript', 'Personal Statement', 'Letters of Recommendation (2)', 'Resume'],
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'sch-002',
    title: 'Community Service Scholarship',
    description: 'Recognizing students who have made significant contributions to their communities.',
    eligibility: 'Minimum 100 hours of community service, GPA of 2.5 or higher, essay on service experience',
    deadline: new Date('2024-11-30'),
    requiredDocuments: ['Community Service Verification', 'Essay', 'Transcript', 'Reference Letter'],
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'sch-003',
    title: 'STEM Innovation Scholarship',
    description: 'Supporting students pursuing careers in Science, Technology, Engineering, and Mathematics.',
    eligibility: 'STEM major, GPA of 3.0 or higher, innovation project proposal',
    deadline: new Date('2024-12-15'),
    requiredDocuments: ['Transcript', 'Project Proposal', 'Faculty Recommendation', 'Portfolio'],
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'sch-004',
    title: 'Arts and Culture Scholarship',
    description: 'For talented students in visual arts, music, theater, or creative writing.',
    eligibility: 'Arts major or minor, portfolio or audition, GPA of 2.8 or higher',
    deadline: new Date('2024-11-15'),
    requiredDocuments: ['Portfolio/Audition Recording', 'Artist Statement', 'Transcript', 'Letters of Recommendation (2)'],
    isActive: false,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-10-01'),
  },
  {
    id: 'sch-005',
    title: 'First Generation Student Scholarship',
    description: 'Supporting students who are the first in their family to attend college.',
    eligibility: 'First-generation college student, GPA of 2.5 or higher, personal statement',
    deadline: new Date('2024-12-20'),
    requiredDocuments: ['Personal Statement', 'Transcript', 'FAFSA', 'Parent/Guardian Letter'],
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
];

// Sample personal info data
const samplePersonalInfo: PersonalInfo[] = [
  {
    firstName: 'Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Springfield, IL 62701',
    dateOfBirth: new Date('2003-05-15'),
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
    address: '456 Oak Ave, Madison, WI 53703',
    dateOfBirth: new Date('2002-08-22'),
  },
  {
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@email.com',
    phone: '(555) 345-6789',
    address: '789 Pine Rd, Denver, CO 80202',
    dateOfBirth: new Date('2003-01-10'),
  },
  {
    firstName: 'James',
    lastName: 'Rodriguez',
    email: 'james.rodriguez@email.com',
    phone: '(555) 456-7890',
    address: '321 Elm St, Austin, TX 78701',
    dateOfBirth: new Date('2002-11-30'),
  },
  {
    firstName: 'Olivia',
    lastName: 'Brown',
    email: 'olivia.brown@email.com',
    phone: '(555) 567-8901',
    address: '654 Maple Dr, Portland, OR 97201',
    dateOfBirth: new Date('2003-07-18'),
  },
];

// Sample academic info data
const sampleAcademicInfo: AcademicInfo[] = [
  {
    institution: 'University of Illinois at Urbana-Champaign',
    major: 'Computer Science',
    gpa: 3.8,
    year: 'Junior',
    expectedGraduation: new Date('2026-05-15'),
  },
  {
    institution: 'University of Wisconsin-Madison',
    major: 'Mechanical Engineering',
    gpa: 3.6,
    year: 'Senior',
    expectedGraduation: new Date('2025-05-20'),
  },
  {
    institution: 'University of Colorado Boulder',
    major: 'Molecular Biology',
    gpa: 3.9,
    year: 'Sophomore',
    expectedGraduation: new Date('2027-05-10'),
  },
  {
    institution: 'University of Texas at Austin',
    major: 'Business Administration',
    gpa: 3.4,
    year: 'Junior',
    expectedGraduation: new Date('2026-05-15'),
  },
  {
    institution: 'Portland State University',
    major: 'Graphic Design',
    gpa: 3.7,
    year: 'Freshman',
    expectedGraduation: new Date('2028-05-12'),
  },
];

// Sample file names
const sampleFileNames = [
  'transcript.pdf',
  'personal_statement.pdf',
  'recommendation_letter_1.pdf',
  'recommendation_letter_2.pdf',
  'resume.pdf',
  'portfolio.pdf',
  'essay.pdf',
  'community_service_verification.pdf',
  'project_proposal.pdf',
  'artist_statement.pdf',
];

// Generate reference code
function generateReferenceCode(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `SCH-${year}-${random}`;
}

// Generate mock applications
export const mockApplications: Application[] = [
  {
    id: 'app-001',
    referenceCode: 'SCH-2024-1234',
    scholarshipId: 'sch-001',
    personalInfo: samplePersonalInfo[0],
    academicInfo: sampleAcademicInfo[0],
    status: 'PENDING',
    adminRemarks: '',
    fileNames: ['transcript.pdf', 'personal_statement.pdf', 'recommendation_letter_1.pdf', 'recommendation_letter_2.pdf'],
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-10-15'),
  },
  {
    id: 'app-002',
    referenceCode: 'SCH-2024-2345',
    scholarshipId: 'sch-002',
    personalInfo: samplePersonalInfo[1],
    academicInfo: sampleAcademicInfo[1],
    status: 'UNDER_REVIEW',
    adminRemarks: 'Strong community service background. GPA meets requirements.',
    fileNames: ['community_service_verification.pdf', 'essay.pdf', 'transcript.pdf', 'reference_letter.pdf'],
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-10-18'),
  },
  {
    id: 'app-003',
    referenceCode: 'SCH-2024-3456',
    scholarshipId: 'sch-003',
    personalInfo: samplePersonalInfo[2],
    academicInfo: sampleAcademicInfo[2],
    status: 'APPROVED',
    adminRemarks: 'Excellent academic record and innovative project proposal. Approved for full award.',
    fileNames: ['transcript.pdf', 'project_proposal.pdf', 'faculty_recommendation.pdf', 'portfolio.pdf'],
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-10-20'),
  },
  {
    id: 'app-004',
    referenceCode: 'SCH-2024-4567',
    scholarshipId: 'sch-004',
    personalInfo: samplePersonalInfo[3],
    academicInfo: sampleAcademicInfo[3],
    status: 'REJECTED',
    adminRemarks: 'Application submitted after deadline. Scholarship no longer active.',
    fileNames: ['portfolio.pdf', 'artist_statement.pdf', 'transcript.pdf'],
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-22'),
  },
  {
    id: 'app-005',
    referenceCode: 'SCH-2024-5678',
    scholarshipId: 'sch-005',
    personalInfo: samplePersonalInfo[4],
    academicInfo: sampleAcademicInfo[4],
    status: 'PENDING',
    adminRemarks: '',
    fileNames: ['personal_statement.pdf', 'transcript.pdf', 'fafsa.pdf', 'parent_letter.pdf'],
    createdAt: new Date('2024-10-22'),
    updatedAt: new Date('2024-10-22'),
  },
  {
    id: 'app-006',
    referenceCode: 'SCH-2024-6789',
    scholarshipId: 'sch-001',
    personalInfo: samplePersonalInfo[0],
    academicInfo: sampleAcademicInfo[0],
    status: 'UNDER_REVIEW',
    adminRemarks: 'Outstanding academic performance. Leadership experience well documented.',
    fileNames: ['transcript.pdf', 'personal_statement.pdf', 'resume.pdf', 'leadership_certificates.pdf'],
    createdAt: new Date('2024-10-18'),
    updatedAt: new Date('2024-10-21'),
  },
];

// Utility functions for generating more mock data
export const generateMockApplication = (scholarshipId: string): Application => {
  const randomPersonIndex = Math.floor(Math.random() * samplePersonalInfo.length);
  const randomAcademicIndex = Math.floor(Math.random() * sampleAcademicInfo.length);
  const randomStatus: ApplicationStatus[] = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
  const randomStatusIndex = Math.floor(Math.random() * randomStatus.length);
  
  const statuses = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const;
  const status = statuses[randomStatusIndex];
  
  const remarksMap = {
    PENDING: '',
    UNDER_REVIEW: 'Application under review. All required documents received.',
    APPROVED: 'Excellent candidate. Approved for scholarship award.',
    REJECTED: 'Does not meet eligibility requirements.',
  };

  return {
    id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    referenceCode: generateReferenceCode(),
    scholarshipId,
    personalInfo: { ...samplePersonalInfo[randomPersonIndex] },
    academicInfo: { ...sampleAcademicInfo[randomAcademicIndex] },
    status,
    adminRemarks: remarksMap[status],
    fileNames: sampleFileNames.slice(0, Math.floor(Math.random() * 4) + 2),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Initialize mock data in localStorage
export const initializeMockData = (): void => {
  if (typeof window !== 'undefined') {
    const { StorageService } = require('./storage');
    
    // Initialize scholarships if empty
    const existingScholarships = StorageService.getScholarships();
    if (existingScholarships.length === 0) {
      StorageService.saveScholarships(mockScholarships);
    }
    
    // Initialize applications if empty
    const existingApplications = StorageService.getApplications();
    if (existingApplications.length === 0) {
      StorageService.saveApplications(mockApplications);
    }
  }
};
