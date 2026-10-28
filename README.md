# Apex Digital — Personal Portfolio & Creative Studio

A production-grade personal portfolio and content management system for a digital service provider offering:
1. **UI/UX Design**
2. **Website Design**
3. **Website Development**
4. **Email Copywriting**
5. **AI Automation**

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Google Cloud Firestore**, and **Firebase Authentication**.

---

## 1. Architecture Overview

- **Public Website (`/`)**:
  - **Navigation**: Editable logo wordmark, section jump links, English/Bengali language toggle, and "Start a Project" CTA.
  - **Hero Section**: High-impact value proposition, supporting copy, primary and secondary CTAs, and interactive workspace composition.
  - **Credibility**: Truthful foundations, production tech stack (Figma, React, TypeScript, Tailwind CSS, Firestore, Node.js), and zero fabricated statistics.
  - **Services**: 5 independently manageable disciplines with icons, summaries, and deliverables.
  - **Featured Projects**: Interactive category filtering, cover images, technology badges, clearly badged concept studies, and deep-dive case study modal.
  - **About Me**: Editorial layout with personal bio, photo, competencies, tools, work philosophy, and social links.
  - **Work Process**: 5-step structured workflow (Discover, Plan, Design, Build, Review & Improve).
  - **Project Inquiries**: Validated inquiry form with bot anti-spam protection, direct WhatsApp & Email triggers, and encrypted Firestore write.
  - **Footer**: Dynamic copyright year, privacy terms modal, and quick admin portal link.

- **Private Admin Console (`/admin`)**:
  - **Secure Authentication**: Google Authentication with automatic authorization for `tahmid5867@gmail.com` or users in the `/admins/{uid}` collection.
  - **Dashboard**: Real-time project counts (published vs. draft), active services, and incoming inquiry alerts.
  - **Projects Manager**: Complete CRUD, slug generation, draft/published toggle, and concept study labeling.
  - **Services Manager**: Manage descriptions, icons, display order, and deliverables.
  - **Content & Bio**: Edit hero headlines, CTAs, about biography, tools, WhatsApp, and contact email.
  - **Media Library**: Curated high-resolution image asset management and URL clipboard tools.
  - **Inquiry Inbox**: Filter unread/read/archived inquiries, inspect project requirements, and reply via email.
  - **SEO & Social Share**: Edit page titles, meta descriptions, and live Open Graph preview.
  - **Analytics**: Authentic Firestore data telemetry without fabricated visitor counters.
  - **Activity Log**: Chronological audit history of administrator operations.

---

## 2. Security Architecture & Rules

Database security rules are deployed at `firestore.rules` adhering to least-privilege attribute-based access control (ABAC):
- **Catch-all deny**: `match /{document=**} { allow read, write: if false; }`
- **Site Settings & Profile**: Publicly readable for rendering; writable only by verified admins (`isAdmin()`).
- **Services & Projects**: Public queries can **only** read documents where `status == 'published'` or `isPublished == true`. Drafts remain strictly private to authorized administrators.
- **Inquiries**: Anyone can submit a valid inquiry constrained by strict string length and field rules (`status == 'unread'`). Only verified admins can read, update, or delete inquiry submissions. Public visitors can never read inquiry documents.
- **Bootstrapped Admin**: Evaluates `request.auth.token.email == 'tahmid5867@gmail.com'` and verifies membership in the `/admins/$(request.auth.uid)` document.

---

## 3. First-Administrator Setup Guide

1. Navigate to `/admin` or click the shield icon in the top navigation.
2. Click **Sign in with Google**.
3. Sign in using the owner account: `tahmid5867@gmail.com`.
4. The application immediately recognizes the authenticated administrator and opens the full dashboard.
5. **Adding Additional Admins**: In the Firestore console or via administrative scripts, create a document in the `admins` collection with the user's Auth UID:
   ```json
   {
     "email": "teammate@example.com",
     "role": "admin",
     "addedAt": "2026-10-27T00:00:00.000Z"
   }
   ```

---

## 4. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests (Node.js test runner)
npx --yes tsx --test src/utils/logic.test.ts

# 3. Start development server
npm run dev

# 4. Compile & build check
npm run build
```

---

## 5. Free-First Deployment Instructions

This application is architected to run permanently within the **Firebase Free Spark Tier**:
- **Hosting**: Deploy using Firebase Hosting (`firebase deploy --only hosting`) or Vercel/Netlify.
- **Firestore**: Free tier includes 50,000 daily reads, 20,000 daily writes, and 1 GB stored data.
- **Images**: Direct HTTPS image URLs and CDN links avoid Storage bandwidth limits on the free plan.
- **Analytics**: Firebase Analytics can be enabled on the free tier once a Measurement ID is configured in `firebase-applet-config.json`.
