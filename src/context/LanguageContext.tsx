import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '../types';

export const UI_STRINGS = {
  navHome: { en: 'Home', bn: 'হোম' },
  navServices: { en: 'Services', bn: 'সার্ভিসসমূহ' },
  navProjects: { en: 'Projects', bn: 'প্রজেক্ট' },
  navAbout: { en: 'About', bn: 'সম্পর্কে' },
  navProcess: { en: 'Process', bn: 'কাজের পদ্ধতি' },
  navContact: { en: 'Contact', bn: 'যোগাযোগ' },
  navStartProject: { en: 'Start a Project', bn: 'প্রজেক্ট শুরু করুন' },
  adminPortal: { en: 'Admin Portal', bn: 'অ্যাডমিন পোর্টাল' },
  
  heroBadge: { en: 'Available for Q4/Q1 Projects', bn: 'নতুন প্রজেক্টের জন্য উন্মুক্ত' },
  exploreWork: { en: 'Explore My Work', bn: 'আমার কাজ দেখুন' },
  discussProject: { en: "Let's Discuss Your Project", bn: 'প্রজেক্ট আলোচনা করুন' },

  credibilityTitle: { en: 'Truthful Foundations & Capabilities', bn: 'নির্ভরযোগ্য দক্ষতা ও সক্ষমতা' },
  credibilitySubtitle: { 
    en: 'Real skills, proven software stacks, and a transparent approach with zero fabricated numbers.', 
    bn: 'বাস্তব দক্ষতা, আধুনিক সফটওয়্যার স্ট্যাক এবং কোনো বানোয়াট সংখ্যা ছাড়া একটি স্বচ্ছ পদ্ধতি।' 
  },

  servicesTitle: { en: 'Specialized Digital Services', bn: 'বিশেষায়িত ডিজিটাল সেবাসমূহ' },
  servicesSubtitle: { 
    en: 'Five disciplines designed to transform ideas into reliable, high-converting digital assets.', 
    bn: 'আইডিয়াকে কার্যকর ও সফল ডিজিটাল সম্পদে রূপান্তর করতে পাঁচটি প্রধান সেবা।' 
  },

  projectsTitle: { en: 'Selected Work & Case Studies', bn: 'নির্বাচিত কাজ ও কেস স্টাডি' },
  projectsSubtitle: { 
    en: 'Real-world technical demonstrations and concept studies clearly documented with problem, approach, and outcome.', 
    bn: 'বাস্তবসম্মত টেকনিক্যাল সমাধান এবং স্পষ্ট সমস্যা, পদ্ধতি ও ফলাফলে সমৃদ্ধ কেস স্টাডি।' 
  },
  allFilter: { en: 'All Disciplines', bn: 'সকল ক্যাটাগরি' },
  conceptBadge: { en: 'Concept Study', bn: 'কনসেপ্ট স্টাডি' },
  viewCaseStudy: { en: 'View Case Study', bn: 'কেস স্টাডি দেখুন' },
  liveDemo: { en: 'Live Demo', bn: 'লাইভ ডেমো' },
  sourceCode: { en: 'Source Code', bn: 'সোর্স কোড' },

  aboutTitle: { en: 'About & Working Philosophy', bn: 'পরিচিতি ও কাজের দর্শন' },
  aboutSubtitle: { en: 'Pragmatic digital problem solver combining aesthetics with technical rigor.', bn: 'নান্দনিকতা এবং টেকনিক্যাল দক্ষতার মেলবন্ধনে ডিজিটাল সমাধানকারী।' },
  coreSkills: { en: 'Core Competencies', bn: 'মূল দক্ষতাসমূহ' },
  toolsStack: { en: 'Tools & Technologies', bn: 'ব্যবহৃত টুলস ও প্রযুক্তি' },
  workPhilosophy: { en: 'Work Approach', bn: 'কাজের দর্শন' },

  processTitle: { en: 'Structured 5-Step Process', bn: '৫-ধাপের সুশৃঙ্খল প্রক্রিয়া' },
  processSubtitle: { en: 'From discovery to post-launch refinement, every phase is transparent and goal-driven.', bn: 'প্রথম আলোচনা থেকে শুরু করে লঞ্চ-পরবর্তী পরিচর্যা পর্যন্ত প্রতিটি ধাপ স্বচ্ছ ও লক্ষ্যভিত্তিক।' },
  step1Title: { en: '1. Discover', bn: '১. অনুসন্ধান (Discover)' },
  step1Desc: { en: 'Uncover core business objectives, user audience, pain points, and technical constraints.', bn: 'মূল ব্যবসায়িক লক্ষ্য, টার্গেট অডিয়েন্স, সমস্যা ও সীমাবদ্ধতা বিস্তারিতভাবে জানা।' },
  step2Title: { en: '2. Plan', bn: '২. পরিকল্পনা (Plan)' },
  step2Desc: { en: 'Define project scope, information architecture, messaging strategy, and conversion milestones.', bn: 'কাজের পরিধি, ইনফরমেশন আর্কিটেকচার, মেসেজিং স্ট্র্যাটেজি ও মাইলস্টোন নির্ধারণ।' },
  step3Title: { en: '3. Design', bn: '৩. ডিজাইন (Design)' },
  step3Desc: { en: 'Craft intuitive layouts, wireframes, accessible typography, and interactive design prototypes.', bn: 'সহজ ইউজার ফ্লো, ওয়্যারফ্রেম, টাইপোগ্রাফি এবং ইন্টারঅ্যাক্টিভ প্রোটোটাইপ তৈরি।' },
  step4Title: { en: '4. Build', bn: '৪. নির্মাণ (Build)' },
  step4Desc: { en: 'Implement clean, performant TypeScript and React code, secure data persistence, and automations.', bn: 'পরিচ্ছন্ন রিঅ্যাক্ট ও টাইপস্ক্রিপ্ট কোড, নিরাপদ ডেটাবেস এবং অটোমেশন স্থাপন।' },
  step5Title: { en: '5. Review & Improve', bn: '৫. পর্যালোচনা ও উন্নতি (Review)' },
  step5Desc: { en: 'Thorough QA testing, device responsiveness verification, accessibility check, and handoff.', bn: 'বিভিন্ন ডিভাইসে পরীক্ষা, গতি ও অ্যাক্সেসিবিলিটি যাচাই এবং সফল হ্যান্ডঅফ।' },

  contactTitle: { en: 'Initiate a Project', bn: 'প্রজেক্টের প্রস্তাব পাঠান' },
  contactSubtitle: { 
    en: 'Tell me about your vision, goals, or workflow challenge. Serving clients across Bangladesh & internationally.', 
    bn: 'আপনার পরিকল্পনা বা চ্যালেঞ্জ সম্পর্কে জানান। বাংলাদেশ এবং বিশ্বব্যাপী ক্লায়েন্টদের জন্য উন্মুক্ত।' 
  },
  formName: { en: 'Your Name *', bn: 'আপনার নাম *' },
  formEmail: { en: 'Email Address *', bn: 'ইমেইল অ্যাড্রেস *' },
  formCompany: { en: 'Company or Brand Name (Optional)', bn: 'কোম্পানি বা ব্র্যান্ডের নাম (ঐচ্ছিক)' },
  formService: { en: 'Requested Service *', bn: 'প্রয়োজনীয় সার্ভিস *' },
  formBudget: { en: 'Estimated Budget (Optional)', bn: 'আনুমানিক বাজেট (ঐচ্ছিক)' },
  formDescription: { en: 'Project Details & Goals *', bn: 'প্রজেক্টের বিবরণ ও লক্ষ্য *' },
  formSubmit: { en: 'Submit Project Inquiry', bn: 'ইনকোয়ারি জমা দিন' },
  formSubmitting: { en: 'Securing & Sending Inquiry...', bn: 'ইনকোয়ারি পাঠানো হচ্ছে...' },
  formSuccess: { 
    en: 'Inquiry received securely! I will review your project details and follow up directly via email or WhatsApp.', 
    bn: 'আপনার বার্তা নিরাপদে পৌঁছেছে! আমি বিস্তারিত দেখে খুব শীঘ্রই আপনার সাথে যোগাযোগ করব।' 
  },
  directEmail: { en: 'Direct Email', bn: 'সরাসরি ইমেইল' },
  directWhatsApp: { en: 'WhatsApp Chat', bn: 'হোয়াটসঅ্যাপ চ্যাট' },
  locationLabel: { en: 'Location', bn: 'অবস্থান' },

  footerRights: { en: 'All rights reserved.', bn: 'সর্বস্বত্ব সংরক্ষিত।' },
  footerPrivacy: { en: 'Privacy & Data Terms', bn: 'গোপনীয়তা ও ডেটা নীতিমালা' },
  practiceDisclosure: { 
    en: 'Concept studies are labeled as practice designs to honor truth-in-portfolio standards.', 
    bn: 'স্বচ্ছতা বজায় রাখতে কনসেপ্ট প্রজেক্টগুলো সুস্পষ্টভাবে চিহ্নিত করা হয়েছে।' 
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof UI_STRINGS) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => UI_STRINGS[key]?.en || '',
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('apex_portfolio_lang');
    return saved === 'bn' || saved === 'en' ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('apex_portfolio_lang', lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof typeof UI_STRINGS): string => {
    const entry = UI_STRINGS[key];
    if (!entry) return '';
    return entry[language] || entry.en || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
