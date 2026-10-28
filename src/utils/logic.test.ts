import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLocalizedText,
  generateSlug,
  isValidEmail,
  isValidUrl,
  validateInquiry,
  calculateDashboardStats,
  filterAndSortProjects,
} from './logic';

test('getLocalizedText returns Bengali when present and requested, otherwise English fallback', () => {
  assert.equal(getLocalizedText('Hello World', 'হ্যালো বিশ্ব', 'bn'), 'হ্যালো বিশ্ব');
  assert.equal(getLocalizedText('Hello World', '', 'bn'), 'Hello World');
  assert.equal(getLocalizedText('Hello World', undefined, 'bn'), 'Hello World');
  assert.equal(getLocalizedText('Hello World', 'হ্যালো বিশ্ব', 'en'), 'Hello World');
});

test('generateSlug converts strings to clean lowercase url-friendly slugs', () => {
  assert.equal(generateSlug('UI/UX SaaS Dashboard 2026!'), 'uiux-saas-dashboard-2026');
  assert.equal(generateSlug('   AI Workflow Automation for FinTech   '), 'ai-workflow-automation-for-fintech');
  assert.equal(generateSlug('E-commerce Storefront & Mobile App'), 'e-commerce-storefront-mobile-app');
});

test('isValidEmail correctly identifies valid and invalid emails', () => {
  assert.equal(isValidEmail('client@business.com'), true);
  assert.equal(isValidEmail('tahmid5867@gmail.com'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail('missing@domain'), false);
  assert.equal(isValidEmail(''), false);
});

test('isValidUrl validates http/https urls properly', () => {
  assert.equal(isValidUrl('https://example.com/demo'), true);
  assert.equal(isValidUrl('http://localhost:3000'), true);
  assert.equal(isValidUrl('not-a-valid-url'), false);
  assert.equal(isValidUrl(''), false);
});

test('validateInquiry enforces form bounds and requirements', () => {
  const invalidResult = validateInquiry({
    name: 'A',
    email: 'bademail',
    serviceRequested: '',
    projectDescription: 'short',
  });
  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.name);
  assert.ok(invalidResult.errors.email);
  assert.ok(invalidResult.errors.serviceRequested);
  assert.ok(invalidResult.errors.projectDescription);

  const validResult = validateInquiry({
    name: 'Farhan Rahman',
    email: 'farhan@growthbrands.co',
    serviceRequested: 'Website Design',
    projectDescription: 'We need a high-converting web presence for our emerging B2B SaaS startup.',
  });
  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test('calculateDashboardStats produces accurate metrics without fabricating values', () => {
  const mockProjects = [
    { id: '1', titleEn: 'Project 1', category: 'UI/UX Design', status: 'published' as const, isFeatured: true },
    { id: '2', titleEn: 'Project 2', category: 'Website Design', status: 'published' as const, isFeatured: false },
    { id: '3', titleEn: 'Project 3', category: 'UI/UX Design', status: 'draft' as const },
  ];

  const stats = calculateDashboardStats(mockProjects, 5, 2);
  assert.equal(stats.totalProjects, 3);
  assert.equal(stats.publishedProjects, 2);
  assert.equal(stats.draftProjects, 1);
  assert.equal(stats.featuredProjects, 1);
  assert.equal(stats.activeServicesCount, 5);
  assert.equal(stats.unreadInquiriesCount, 2);
  assert.equal(stats.categoryBreakdown['UI/UX Design'], 1);
  assert.equal(stats.categoryBreakdown['Website Design'], 1);
});

test('filterAndSortProjects filters by category and hides drafts from public', () => {
  const items = [
    { id: '1', category: 'UI/UX Design', status: 'published', displayOrder: 2 },
    { id: '2', category: 'AI Automation', status: 'published', displayOrder: 1 },
    { id: '3', category: 'UI/UX Design', status: 'draft', displayOrder: 3 },
  ];

  const publicAll = filterAndSortProjects(items, 'all', false);
  assert.equal(publicAll.length, 2);
  assert.equal(publicAll[0].id, '2'); // order 1 comes first

  const publicUiUx = filterAndSortProjects(items, 'UI/UX Design', false);
  assert.equal(publicUiUx.length, 1);
  assert.equal(publicUiUx[0].id, '1');

  const adminWithDrafts = filterAndSortProjects(items, 'UI/UX Design', true);
  assert.equal(adminWithDrafts.length, 2);
});
