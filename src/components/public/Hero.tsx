import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { getLocalizedText } from '../../utils/logic';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Code2,
  Mail,
  Cpu,
  CheckCircle2,
  MessageSquare,
  User,
  Palette,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, t } = useLanguage();
  const { siteSettings, profile } = useData();

  // 5 Specialized Services for sequential animation
  const servicesList = [
    {
      id: 1,
      nameEn: 'UI/UX Design',
      nameBn: 'ইউআই/ইউএক্স ডিজাইন',
      icon: Layers,
      highlight: 'User Flows, Wireframes & Design Systems',
    },
    {
      id: 2,
      nameEn: 'Website Design',
      nameBn: 'ওয়েবসাইট ডিজাইন',
      icon: Palette,
      highlight: 'High-Converting Landing Pages & Clean Layouts',
    },
    {
      id: 3,
      nameEn: 'Website Development',
      nameBn: 'ওয়েবসাইট ডেভেলপমেন্ট',
      icon: Code2,
      highlight: 'Fast, Accessible React & TypeScript Applications',
    },
    {
      id: 4,
      nameEn: 'Email Copywriting',
      nameBn: 'ইমেইল কপিরাইটিং',
      icon: Mail,
      highlight: 'Strategic Onboarding & High-Open Campaigns',
    },
    {
      id: 5,
      nameEn: 'AI Automation',
      nameBn: 'এআই অটোমেশন',
      icon: Cpu,
      highlight: 'Time-Saving Workflows & Intelligent Pipelines',
    },
  ];

  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sequential animation interval (cycles every 2.8s)
  useEffect(() => {
    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveServiceIndex((prev) => (prev + 1) % servicesList.length);
        setIsTransitioning(false);
      }, 350); // fade out duration before switching
    }, 2800);

    return () => clearInterval(interval);
  }, [servicesList.length]);

  const currentService = servicesList[activeServiceIndex];
  const CurrentIcon = currentService.icon;

  const headline = getLocalizedText(
    siteSettings.heroHeadlineEn,
    siteSettings.heroHeadlineBn,
    language
  ) || 'I Design Digital Experiences That Help Businesses Grow.';

  const subtitle = getLocalizedText(
    siteSettings.heroSubtitleEn,
    siteSettings.heroSubtitleBn,
    language
  ) || 'From intuitive interfaces and modern websites to persuasive email campaigns and practical AI automation, I help businesses turn ideas into useful digital solutions.';

  const primaryCta = getLocalizedText(
    siteSettings.heroPrimaryCtaEn,
    siteSettings.heroPrimaryCtaBn,
    language
  ) || 'Explore My Work';

  const secondaryCta = getLocalizedText(
    siteSettings.heroSecondaryCtaEn,
    siteSettings.heroSecondaryCtaBn,
    language
  ) || "Let's Work Together";

  const profileName = profile.name || 'Tahmid Hasan';
  const profileTitle = getLocalizedText(profile.headlineEn, profile.headlineBn, language) || 'Full-Stack Digital Problem-Solver & Designer';
  const profilePhoto = profile.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#6C9BFF]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-16 right-10 w-[350px] h-[300px] bg-[#3B62D1]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ========================================================
              LEFT COLUMN: Value Proposition, Headline, Animated Service, CTAs
              ======================================================== */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left order-1">
            
            {/* Introductory Badge Label */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121A2B] border border-[#29354B] text-xs font-semibold text-[#6C9BFF]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C9BFF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6C9BFF]"></span>
              </span>
              <span className="tracking-wider uppercase text-[11px]">
                {language === 'en' ? 'Digital Services & Creative Solutions' : 'ডিজিটাল সার্ভিস ও ক্রিয়েটিভ সলিউশন'}
              </span>
            </div>

            {/* Powerful Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F7FC] leading-[1.12]">
              {headline}
            </h1>

            {/* Sequential Animated Service Carousel Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121A2B] border border-[#29354B] relative overflow-hidden shadow-lg group">
              {/* Glowing accent border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#6C9BFF]/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-wider font-semibold text-[#A7B2C8]/80 mb-2">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#6C9BFF]" />
                  <span>{language === 'en' ? 'Specialized Discipline in Action' : 'বিশেষায়িত সেবা'}</span>
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#18243A] text-[#6C9BFF] border border-[#29354B]">
                  0{currentService.id} / 05
                </span>
              </div>

              {/* Animated Text Container with Fixed Height to Prevent Layout Shifts */}
              <div className="h-14 sm:h-16 flex flex-col justify-center">
                <div
                  className={`flex items-center gap-3 transition-all duration-300 transform ${
                    isTransitioning
                      ? 'opacity-0 -translate-y-2'
                      : 'opacity-100 translate-y-0'
                  }`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#18243A] border border-[#6C9BFF]/40 flex items-center justify-center text-[#6C9BFF] shrink-0 shadow-md">
                    <CurrentIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#F5F7FC] tracking-tight">
                      {language === 'en' ? currentService.nameEn : currentService.nameBn}
                    </h2>
                    <p className="text-xs text-[#A7B2C8] line-clamp-1 font-normal">
                      {currentService.highlight}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Indicator Dots */}
              <div className="flex items-center gap-1.5 pt-2">
                {servicesList.map((srv, idx) => (
                  <button
                    key={srv.id}
                    onClick={() => setActiveServiceIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeServiceIndex
                        ? 'w-7 bg-[#6C9BFF]'
                        : 'w-1.5 bg-[#29354B] hover:bg-[#A7B2C8]/50'
                    }`}
                    aria-label={`View ${srv.nameEn}`}
                  />
                ))}
              </div>
            </div>

            {/* Short Introduction */}
            <p className="text-base sm:text-lg text-[#A7B2C8] leading-relaxed max-w-2xl font-normal">
              {subtitle}
            </p>

            {/* Mobile-Only Portrait Appearance: Shown right after intro on small screens */}
            <div className="block lg:hidden my-6">
              <div className="max-w-xs mx-auto">
                <div className="relative rounded-2xl overflow-hidden bg-[#121A2B] border-2 border-[#29354B] shadow-2xl p-3">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#0B1020] relative">
                    <img
                      src={profilePhoto}
                      alt={profileName}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  {/* Name and Tagline below photo */}
                  <div className="pt-3 text-center space-y-0.5">
                    <h3 className="text-lg font-extrabold text-[#F5F7FC]">{profileName}</h3>
                    <p className="text-xs text-[#6C9BFF] font-medium">{profileTitle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <button
                onClick={() => scrollToSection('projects')}
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#6C9BFF] to-[#4574E8] text-white text-base font-semibold shadow-xl shadow-[#6C9BFF]/25 hover:shadow-[#6C9BFF]/40 hover:brightness-110 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
              >
                <span>{primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-[#29354B] bg-[#121A2B] text-[#F5F7FC] text-base font-medium hover:bg-[#18243A] hover:border-[#6C9BFF]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
              >
                <MessageSquare className="w-4 h-4 text-[#6C9BFF]" />
                <span>{secondaryCta}</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN (Desktop): Prominent Profile Photo, Name, and Title
              ======================================================== */}
          <div className="hidden lg:block lg:col-span-5 relative order-2">
            <div className="relative mx-auto max-w-sm">
              
              {/* Electric blue glow under photo card */}
              <div className="absolute -inset-1 bg-gradient-to-b from-[#6C9BFF]/30 to-[#3B62D1]/10 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />

              {/* Main Portrait Frame Card */}
              <div className="relative rounded-3xl bg-[#121A2B] border-2 border-[#29354B] p-4 shadow-2xl shadow-black/60 backdrop-blur-xl">
                
                {/* Image Frame with natural portrait aspect ratio */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#0B1020] border border-[#29354B]">
                  <img
                    src={profilePhoto}
                    alt={profileName}
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020]/60 via-transparent to-transparent opacity-80 pointer-events-none" />
                  
                  {/* Corner Availability Status */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#121A2B]/90 backdrop-blur-md border border-[#29354B] flex items-center gap-1.5 text-[11px] font-semibold text-[#52C481]">
                    <span className="w-2 h-2 rounded-full bg-[#52C481] animate-pulse" />
                    <span>Available</span>
                  </div>
                </div>

                {/* Name & Professional Title Positioned Directly Underneath Photo */}
                <div className="pt-4 pb-2 px-2 text-center space-y-1">
                  <h3 className="text-2xl font-black tracking-tight text-[#F5F7FC]">
                    {profileName}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#6C9BFF] leading-snug">
                    {profileTitle}
                  </p>
                  <p className="text-[11px] text-[#A7B2C8] tracking-wider uppercase font-medium pt-1">
                    {siteSettings.location || 'Dhaka, Bangladesh & Worldwide'}
                  </p>
                </div>

                {/* Mini disciplines summary pill */}
                <div className="mt-2 pt-3 border-t border-[#29354B]/70 flex items-center justify-center gap-2 text-[11px] text-[#A7B2C8]">
                  <span>Design</span>
                  <span>•</span>
                  <span>Development</span>
                  <span>•</span>
                  <span>AI Automation</span>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-4 -left-4 p-3 rounded-2xl bg-[#18243A] border border-[#6C9BFF]/40 shadow-xl flex items-center gap-2.5 backdrop-blur-md">
                <div className="p-1.5 rounded-lg bg-[#6C9BFF]/20 text-[#6C9BFF]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#F5F7FC]">Verified Portfolio</div>
                  <div className="text-[10px] text-[#A7B2C8]">100% Truthful Credentials</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
