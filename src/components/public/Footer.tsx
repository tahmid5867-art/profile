import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useRouter } from '../../context/RouterContext';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Shield,
  ArrowUp,
  FileText,
  X,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { siteSettings, profile, services } = useData();
  const { navigate, pathname } = useRouter();
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (href: string) => {
    if (pathname !== '/') {
      navigate('/' + href);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="border-t border-[#29354B] bg-[#080C18] text-[#A7B2C8] py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Intro */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C9BFF] to-[#3B62D1] flex items-center justify-center text-white font-bold shadow-md">
                <span className="text-xl">A</span>
              </div>
              <div>
                <span className="font-bold text-lg text-[#F5F7FC]">
                  {profile.name || 'Tahmid Hasan'}
                </span>
                <p className="text-xs text-[#A7B2C8]">Digital Problem-Solver</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#A7B2C8] max-w-sm">
              {language === 'en'
                ? 'Helping businesses in Bangladesh and globally with UI/UX design, modern web applications, conversion email sequences, and practical AI automation.'
                : 'বাংলাদেশ ও আন্তর্জাতিক ক্লায়েন্টদের জন্য ইউআই/ইউএক্স ডিজাইন, আধুনিক ওয়েব অ্যাপ, ইমেইল কপিরাইটিং এবং বাস্তবসম্মত এআই অটোমেশন সেবা।'}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {siteSettings.githubUrl && (
                <a
                  href={siteSettings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#121A2B] border border-[#29354B] text-[#A7B2C8] hover:text-[#6C9BFF] hover:border-[#6C9BFF]/60 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {siteSettings.linkedinUrl && (
                <a
                  href={siteSettings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#121A2B] border border-[#29354B] text-[#A7B2C8] hover:text-[#6C9BFF] hover:border-[#6C9BFF]/60 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {siteSettings.twitterUrl && (
                <a
                  href={siteSettings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#121A2B] border border-[#29354B] text-[#A7B2C8] hover:text-[#6C9BFF] hover:border-[#6C9BFF]/60 transition-colors"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {siteSettings.contactEmail && (
                <a
                  href={`mailto:${siteSettings.contactEmail}`}
                  className="p-2.5 rounded-xl bg-[#121A2B] border border-[#29354B] text-[#A7B2C8] hover:text-[#6C9BFF] hover:border-[#6C9BFF]/60 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3 text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F5F7FC]">
              {language === 'en' ? 'Navigation' : 'ন্যাভিগেশন'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleLinkClick('#hero')} className="hover:text-[#F5F7FC] transition-colors">
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('#services')} className="hover:text-[#F5F7FC] transition-colors">
                  {t('navServices')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('#projects')} className="hover:text-[#F5F7FC] transition-colors">
                  {t('navProjects')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('#about')} className="hover:text-[#F5F7FC] transition-colors">
                  {t('navAbout')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('#process')} className="hover:text-[#F5F7FC] transition-colors">
                  {t('navProcess')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-3 text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F5F7FC]">
              {language === 'en' ? 'Services' : 'সেবাসমূহ'}
            </h4>
            <ul className="space-y-2 text-sm">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => handleLinkClick('#services')}
                    className="hover:text-[#F5F7FC] transition-colors text-left"
                  >
                    {language === 'en' ? s.titleEn : s.titleBn || s.titleEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Trust & Portal */}
          <div className="space-y-3 text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F5F7FC]">
              {language === 'en' ? 'Administration' : 'অ্যাডমিনিস্ট্রেশন'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 hover:text-[#6C9BFF] transition-colors text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-[#6C9BFF]" />
                  <span>{t('adminPortal')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPrivacyModalOpen(true)}
                  className="flex items-center gap-2 hover:text-[#F5F7FC] transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t('footerPrivacy')}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#29354B]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A7B2C8]/70">
          <div>
            &copy; {currentYear} {profile.name || 'Tahmid Hasan'}. {t('footerRights')}
            <span className="ml-2 hidden sm:inline">| {t('practiceDisclosure')}</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 p-2 rounded-lg bg-[#121A2B] border border-[#29354B] text-[#A7B2C8] hover:text-[#F5F7FC] hover:border-[#6C9BFF]/60 transition-colors"
            aria-label="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Privacy Modal */}
      {privacyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={() => setPrivacyModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-[#121A2B] border border-[#29354B] p-6 sm:p-8 space-y-4 z-10 text-left shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#F5F7FC]">{t('footerPrivacy')}</h3>
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="p-1 rounded-lg text-[#A7B2C8] hover:text-[#F5F7FC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs sm:text-sm text-[#A7B2C8] space-y-3 leading-relaxed">
              <p>
                <strong>Information Collected:</strong> When you submit a project inquiry, your name, email, company name, service selection, and project description are securely written to Google Cloud Firestore under least-privilege security rules.
              </p>
              <p>
                <strong>Usage:</strong> Your inquiry information is exclusively used by the site owner to assess project feasibility and reply directly to your inquiry. We never sell or share contact details with third-party advertisers.
              </p>
              <p>
                <strong>Truth-in-Portfolio Standard:</strong> All self-directed practice and concept studies on this website are explicitly badged as such, ensuring zero fabricated client metrics or unverified performance claims.
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
