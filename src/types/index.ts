export type Language = 'en' | 'bn';

export interface SiteSettings {
  id?: string;
  siteTitleEn: string;
  siteTitleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  heroHeadlineEn: string;
  heroHeadlineBn: string;
  heroSubtitleEn: string;
  heroSubtitleBn: string;
  heroPrimaryCtaEn: string;
  heroPrimaryCtaBn: string;
  heroSecondaryCtaEn: string;
  heroSecondaryCtaBn: string;
  contactEmail: string;
  whatsappNumber: string;
  defaultLanguage: Language;
  location: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  updatedAt: string;
}

export interface Profile {
  id?: string;
  name: string;
  headlineEn: string;
  headlineBn: string;
  bioEn: string;
  bioBn: string;
  photoUrl: string;
  email?: string;
  whatsappNumber?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  skills: string[];
  tools: string[];
  interestsEn?: string;
  interestsBn?: string;
  workApproachEn: string;
  workApproachBn: string;
  defaultLanguage?: Language;
  updatedAt: string;
}

export interface Project {
  id: string;
  titleEn: string;
  titleBn: string;
  slug: string;
  shortDescEn: string;
  shortDescBn: string;
  category: string; // 'UI/UX Design' | 'Website Design' | 'Website Development' | 'Email Copywriting' | 'AI Automation'
  coverImage: string;
  gallery?: string[];
  tools: string[];
  roleEn: string;
  roleBn: string;
  challengeEn: string;
  challengeBn: string;
  solutionEn: string;
  solutionBn: string;
  outcomeEn: string;
  outcomeBn: string;
  liveDemoUrl?: string;
  sourceUrl?: string;
  isFeatured: boolean;
  isPractice: boolean;
  displayOrder: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Service {
  id: string;
  titleEn: string;
  titleBn: string;
  shortDescEn: string;
  shortDescBn: string;
  category: string;
  iconName: string;
  displayOrder: number;
  isPublished: boolean;
  ctaTextEn: string;
  ctaTextBn: string;
  deliverablesEn: string[];
  deliverablesBn: string[];
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  serviceRequested: string;
  budgetRange?: string;
  projectDescription: string;
  preferredLanguage: Language;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details: string;
  performedBy: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  addedAt: string;
}
