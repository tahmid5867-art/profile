import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { getLocalizedText } from '../../utils/logic';
import {
  User,
  Compass,
  CheckCircle2,
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { profile, siteSettings } = useData();

  const headline = getLocalizedText(profile.headlineEn, profile.headlineBn, language);
  const bio = getLocalizedText(profile.bioEn, profile.bioBn, language);
  const approach = getLocalizedText(profile.workApproachEn, profile.workApproachBn, language);
  const interests = getLocalizedText(profile.interestsEn, profile.interestsBn, language);

  return (
    <section id="about" className="py-20 md:py-32 border-t border-[#29354B]/80 relative bg-[#121A2B]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121A2B] border border-[#29354B] text-xs font-semibold text-[#6C9BFF]">
            <User className="w-3.5 h-3.5" />
            <span>{t('aboutTitle')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FC]">
            {language === 'en'
              ? 'Behind the Craft: Technical & Strategic Focus'
              : 'পরিচিতি ও কাজের মূল ভিত্তি'}
          </h2>
          <p className="text-base sm:text-lg text-[#A7B2C8]">
            {t('aboutSubtitle')}
          </p>
        </div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Portrait & Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-[#121A2B] border border-[#29354B] p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              {/* Photo */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#29354B] bg-[#0B1020]">
                <img
                  src={profile.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121A2B] via-transparent to-transparent opacity-60" />
              </div>

              {/* Name & Headline */}
              <div>
                <h3 className="text-2xl font-bold text-[#F5F7FC]">{profile.name}</h3>
                <p className="text-sm text-[#6C9BFF] font-medium mt-1">{headline}</p>
                <div className="flex items-center gap-2 text-xs text-[#A7B2C8] mt-3">
                  <MapPin className="w-4 h-4 text-[#6C9BFF]" />
                  <span>{siteSettings.location || 'Dhaka, Bangladesh & Worldwide'}</span>
                </div>
              </div>

              {/* Social links */}
              <div className="pt-4 border-t border-[#29354B]/70 flex items-center gap-3">
                {siteSettings.githubUrl && (
                  <a
                    href={siteSettings.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-[#A7B2C8] hover:text-[#6C9BFF] hover:border-[#6C9BFF]/50 transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {siteSettings.linkedinUrl && (
                  <a
                    href={siteSettings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-[#A7B2C8] hover:text-[#6C9BFF] hover:border-[#6C9BFF]/50 transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {siteSettings.twitterUrl && (
                  <a
                    href={siteSettings.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-[#A7B2C8] hover:text-[#6C9BFF] hover:border-[#6C9BFF]/50 transition-colors"
                    aria-label="Twitter / X Profile"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {siteSettings.contactEmail && (
                  <a
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="p-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-[#A7B2C8] hover:text-[#6C9BFF] hover:border-[#6C9BFF]/50 transition-colors"
                    aria-label="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Skills & Work Philosophy */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Biography */}
            <div className="rounded-3xl bg-[#121A2B] border border-[#29354B] p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-[#F5F7FC] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#6C9BFF]" />
                <span>{language === 'en' ? 'Professional Biography' : 'পেশাগত পরিচিতি'}</span>
              </h3>
              <p className="text-base text-[#A7B2C8] leading-relaxed whitespace-pre-line font-normal">
                {bio}
              </p>
            </div>

            {/* Work Approach */}
            {approach && (
              <div className="rounded-3xl bg-[#121A2B] border border-[#29354B] p-6 sm:p-8 space-y-4">
                <h3 className="text-xl font-bold text-[#F5F7FC]">
                  {t('workPhilosophy')}
                </h3>
                <p className="text-base text-[#A7B2C8] leading-relaxed whitespace-pre-line font-normal">
                  {approach}
                </p>
              </div>
            )}

            {/* Core Competencies */}
            <div className="rounded-3xl bg-[#121A2B] border border-[#29354B] p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-[#F5F7FC]">
                {t('coreSkills')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(profile.skills && profile.skills.length > 0
                  ? profile.skills
                  : [
                      'UI/UX Architecture',
                      'Interactive Prototyping',
                      'Responsive Web Development',
                      'Email Sequence Architecture',
                      'AI Workflow Automation',
                      'Conversion Optimization',
                    ]
                ).map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#18243A]/80 border border-[#29354B] text-xs sm:text-sm font-medium text-[#F5F7FC]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#6C9BFF] shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Interests if present */}
            {interests && (
              <div className="p-6 rounded-2xl bg-[#18243A]/50 border border-[#29354B] text-xs sm:text-sm text-[#A7B2C8]">
                <span className="font-bold text-[#F5F7FC] mr-2">
                  {language === 'en' ? 'Professional Interests:' : 'পেশাগত আগ্রহ:'}
                </span>
                <span>{interests}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
