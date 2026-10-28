/**
 * Pure helper functions for portfolio state, formatting, slug generation, and validation.
 */

export type Language = 'en' | 'bn';

export function getLocalizedText(
  enText: string | undefined | null,
  bnText: string | undefined | null,
  lang: Language
): string {
  if (lang === 'bn') {
    if (bnText && bnText.trim().length > 0) {
      return bnText.trim();
    }
  }
  return (enText || '').trim();
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 160) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export interface InquiryInput {
  name: string;
  email: string;
  company?: string;
  serviceRequested: string;
  budgetRange?: string;
  projectDescription: string;
  preferredLanguage?: Language;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateInquiry(input: InquiryInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Please provide a valid name (at least 2 characters).';
  } else if (input.name.trim().length > 120) {
    errors.name = 'Name cannot exceed 120 characters.';
  }

  if (!input.email || !isValidEmail(input.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!input.serviceRequested || input.serviceRequested.trim().length === 0) {
    errors.serviceRequested = 'Please select a service category.';
  }

  if (!input.projectDescription || input.projectDescription.trim().length < 10) {
    errors.projectDescription = 'Please describe your project (minimum 10 characters).';
  } else if (input.projectDescription.trim().length > 3000) {
    errors.projectDescription = 'Project description exceeds limit of 3,000 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface ProjectSummaryItem {
  id: string;
  titleEn: string;
  category: string;
  status: 'draft' | 'published';
  isFeatured?: boolean;
  displayOrder?: number;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  featuredProjects: number;
  categoryBreakdown: Record<string, number>;
  activeServicesCount: number;
  unreadInquiriesCount: number;
}

export function calculateDashboardStats(
  projects: ProjectSummaryItem[],
  activeServicesCount: number,
  unreadInquiriesCount: number
): DashboardStats {
  const publishedProjects = projects.filter((p) => p.status === 'published').length;
  const draftProjects = projects.filter((p) => p.status === 'draft').length;
  const featuredProjects = projects.filter((p) => p.isFeatured && p.status === 'published').length;

  const categoryBreakdown: Record<string, number> = {};
  for (const p of projects) {
    if (p.status === 'published') {
      categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + 1;
    }
  }

  return {
    totalProjects: projects.length,
    publishedProjects,
    draftProjects,
    featuredProjects,
    categoryBreakdown,
    activeServicesCount,
    unreadInquiriesCount,
  };
}

export function filterAndSortProjects<T extends { category: string; displayOrder?: number; status: string }>(
  items: T[],
  categoryFilter: string,
  includeDrafts: boolean = false
): T[] {
  return items
    .filter((item) => {
      if (!includeDrafts && item.status !== 'published') return false;
      if (categoryFilter === 'all' || !categoryFilter) return true;
      return item.category.toLowerCase() === categoryFilter.toLowerCase();
    })
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
}
