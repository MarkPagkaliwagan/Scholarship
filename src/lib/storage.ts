import { Application, Scholarship, AdminUser } from './types';

export const STORAGE_KEYS = {
  APPLICATIONS: 'scholarship_applications',
  SCHOLARSHIPS: 'scholarship_listings',
  ADMIN_SESSION: 'admin_session',
  USER_PREFERENCES: 'user_preferences',
} as const;

export class StorageService {
  // Applications
  static getApplications(): Application[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data, this.dateReviver) : [];
    } catch (error) {
      console.error('Error loading applications:', error);
      return [];
    }
  }

  static saveApplications(applications: Application[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch (error) {
      console.error('Error saving applications:', error);
    }
  }

  static addApplication(application: Application): void {
    const applications = this.getApplications();
    applications.push(application);
    this.saveApplications(applications);
  }

  static updateApplication(id: string, updates: Partial<Application>): void {
    const applications = this.getApplications();
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates, updatedAt: new Date() };
      this.saveApplications(applications);
    }
  }

  static deleteApplication(id: string): void {
    const applications = this.getApplications();
    const filtered = applications.filter(app => app.id !== id);
    this.saveApplications(filtered);
  }

  static getApplicationByReferenceCode(referenceCode: string): Application | null {
    const applications = this.getApplications();
    return applications.find(app => app.referenceCode === referenceCode) || null;
  }

  // Scholarships
  static getScholarships(): Scholarship[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS);
      return data ? JSON.parse(data, this.dateReviver) : [];
    } catch (error) {
      console.error('Error loading scholarships:', error);
      return [];
    }
  }

  static saveScholarships(scholarships: Scholarship[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(scholarships));
    } catch (error) {
      console.error('Error saving scholarships:', error);
    }
  }

  static addScholarship(scholarship: Scholarship): void {
    const scholarships = this.getScholarships();
    scholarships.push(scholarship);
    this.saveScholarships(scholarships);
  }

  static updateScholarship(id: string, updates: Partial<Scholarship>): void {
    const scholarships = this.getScholarships();
    const index = scholarships.findIndex(sch => sch.id === id);
    if (index !== -1) {
      scholarships[index] = { ...scholarships[index], ...updates, updatedAt: new Date() };
      this.saveScholarships(scholarships);
    }
  }

  static deleteScholarship(id: string): void {
    const scholarships = this.getScholarships();
    const filtered = scholarships.filter(sch => sch.id !== id);
    this.saveScholarships(filtered);
  }

  static getActiveScholarships(): Scholarship[] {
    return this.getScholarships().filter(sch => sch.isActive && new Date(sch.deadline) > new Date());
  }

  // Admin Session
  static getAdminSession(): AdminUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      return data ? JSON.parse(data, this.dateReviver) : null;
    } catch (error) {
      console.error('Error loading admin session:', error);
      return null;
    }
  }

  static saveAdminSession(admin: AdminUser): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(admin));
    } catch (error) {
      console.error('Error saving admin session:', error);
    }
  }

  static clearAdminSession(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }

  // Utility methods
  private static dateReviver(key: string, value: any): any {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return new Date(value);
    }
    return value;
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static exportData(): string {
    const data = {
      applications: this.getApplications(),
      scholarships: this.getScholarships(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }
}
