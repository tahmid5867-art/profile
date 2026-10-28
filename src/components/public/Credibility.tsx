import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  FileCheck,
  CheckCircle,
} from 'lucide-react';

export const Credibility: React.FC = () => {
  const { language, t } = useLanguage();
  const { profile } = useData();

  const capabilities = [
    {
      titleEn: 'End-to-End Product Lifecycle',
      titleBn: 'শুরু থেকে শেষ পর্যন্ত প্রোডাক্ট বাস্তবায়ন',
      descEn: 'From initial user flows and Figma prototypes down to production-level TypeScript, state architecture, and deployments.',
      descBn: 'ফিগমায় প্রাথমিক ইউজার ফ্লো থেকে শুরু করে টাইপস্ক্রিপ্ট ফ্রন্টএন্ড এবং প্রোডাকশন ডিপ্লয়মেন্ট পর্যন্ত সমন্বিত দক্ষতা।',
      icon: Layers,
    },
    {
      titleEn: 'Rigorous Type Safety & Clean Code',
      titleBn: 'নির্ভুল কোডিং ও মেইনটেইনেবল আর্কিটেকচার',
      descEn: 'Strict compiler rules, modular components, accessible semantics, and zero-shortcut engineering practices.',
      descBn: 'কঠোর টাইপ চেকিং, মডুলার কম্পোনেন্ট, অ্যাক্সেসিবিলিটি এবং দীর্ঘমেয়াদে সম্প্রসারণযোগ্য কোডিং মান।',
      icon: Terminal,
    },
    {
      titleEn: 'Zero-Fluff Conversion Focus',
      titleBn: 'ফলাফল ও রূপান্তর-কেন্দ্রিক ডিজাইন',
      descEn: 'Email copy and landing pages engineered around customer clarity, objections resolution, and actionable user paths.',
      descBn: 'অপ্রয়োজনীয় অলঙ্কার বাদ দিয়ে ব্যবহারকারীর সিদ্ধান্ত গ্রহণ এবং রূপান্তরকে প্রাধান্য দেওয়া।',
      icon: FileCheck,
    },
    {
      titleEn: 'Practical AI & Automation',
      titleBn: 'বাস্তবসম্মত এআই ও অটোমেশন সমাধান',
      descEn: 'Pragmatic automations that eliminate hours of repetitive manual data entry without over-engineering.',
      descBn: 'দৈনন্দিন পুনরাবৃত্তিমূলক কাজ কমাতে এবং সময় বাঁচাতে কার্যকরী ওয়েবহুক ও এআই সমাধান।',
      icon: Cpu,
    },
  ];

  return (
    <section id="credibility" className="py-16 md:py-24 border-y border-[#29354B]/80 bg-[#121A2B]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18243A] border border-[#29354B] text-xs font-semibold text-[#6C9BFF]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('credibilityTitle')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FC]">
            {language === 'en'
              ? 'Technical Rigor Over Inflated Metrics'
              : 'অতিরঞ্জিত দাবিমুক্ত খাঁটি টেকনিক্যাল সক্ষমতা'}
          </h2>
          <p className="text-base sm:text-lg text-[#A7B2C8]">
            {t('credibilitySubtitle')}
          </p>
        </div>

        {/* 4 Truthful Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] hover:border-[#6C9BFF]/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#18243A] border border-[#29354B] flex items-center justify-center text-[#6C9BFF] mb-5 group-hover:scale-105 group-hover:bg-[#6C9BFF]/10 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F5F7FC] mb-2 group-hover:text-[#6C9BFF] transition-colors">
                    {language === 'en' ? item.titleEn : item.titleBn}
                  </h3>
                  <p className="text-sm text-[#A7B2C8] leading-relaxed">
                    {language === 'en' ? item.descEn : item.descBn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verified Tools Marquee / Grid */}
        <div className="mt-14 pt-10 border-t border-[#29354B]/60">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#A7B2C8]/70 text-center mb-6">
            {language === 'en' ? 'Active Production Tech Stack' : 'নিয়মিত ব্যবহৃত প্রোডাকশন টেক স্ট্যাক'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {(profile.tools && profile.tools.length > 0
              ? profile.tools
              : ['Figma', 'React', 'TypeScript', 'Tailwind CSS', 'Cloud Firestore', 'Node.js', 'Make', 'Git']
            ).map((tool) => (
              <div
                key={tool}
                className="px-4 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm font-semibold text-[#F5F7FC] flex items-center gap-2 hover:border-[#6C9BFF]/40 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#6C9BFF]" />
                <span>{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
