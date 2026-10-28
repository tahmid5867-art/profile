import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  Languages,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { siteSettings, profile } = useData();
  const { navigate, pathname } = useRouter();
  const { currentUser, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t('navHome'), href: '#hero' },
    { label: t('navServices'), href: '#services' },
    { label: t('navProjects'), href: '#projects' },
    { label: t('navAbout'), href: '#about' },
    { label: t('navProcess'), href: '#process' },
    { label: t('navContact'), href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0B1020]/85 border-b border-[#29354B]/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Wordmark / Brand */}
        <button
          onClick={() => handleLinkClick('#hero')}
          className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-[#6C9BFF] rounded-lg p-1"
          aria-label="Apex Digital Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C9BFF] to-[#3B62D1] flex items-center justify-center text-white font-bold shadow-lg shadow-[#6C9BFF]/20 group-hover:scale-105 transition-transform">
            <span className="text-xl tracking-tight">A</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#F5F7FC] group-hover:text-[#6C9BFF] transition-colors">
                {profile.name || 'Tahmid Hasan'}
              </span>
            </div>
            <p className="text-xs text-[#A7B2C8] tracking-wider uppercase font-medium">
              Digital Studio & Solutions
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="text-sm font-medium text-[#A7B2C8] hover:text-[#F5F7FC] transition-colors focus:outline-none focus:text-[#6C9BFF]"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#29354B] bg-[#121A2B] text-xs font-semibold text-[#A7B2C8] hover:text-[#F5F7FC] hover:border-[#6C9BFF]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
            aria-label={`Switch language, currently ${language === 'en' ? 'English' : 'Bengali'}`}
          >
            <Languages className="w-3.5 h-3.5 text-[#6C9BFF]" />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Admin link */}
          <button
            onClick={() => navigate('/admin')}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#6C9BFF] ${
              isAdmin
                ? 'border-[#6C9BFF]/50 text-[#6C9BFF] bg-[#18243A]'
                : 'border-transparent text-[#A7B2C8]/70 hover:text-[#F5F7FC]'
            }`}
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <Shield className="w-4 h-4" />
            {isAdmin && <span className="text-[11px] font-semibold">Admin</span>}
          </button>

          {/* CTA Button */}
          <button
            onClick={() => handleLinkClick('#contact')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C9BFF] to-[#4574E8] text-white text-sm font-semibold shadow-lg shadow-[#6C9BFF]/25 hover:shadow-[#6C9BFF]/40 hover:brightness-110 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
          >
            <span>{t('navStartProject')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg border border-[#29354B] bg-[#121A2B] text-xs font-semibold text-[#A7B2C8]"
            aria-label="Toggle language"
          >
            {language === 'en' ? 'বাংলা' : 'EN'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-[#29354B] bg-[#121A2B] text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#29354B] bg-[#0B1020]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-[#A7B2C8] hover:text-[#F5F7FC] hover:bg-[#121A2B] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#29354B] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/admin');
              }}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg bg-[#121A2B] text-sm font-medium text-[#A7B2C8]"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#6C9BFF]" />
                {t('adminPortal')}
              </span>
              {isAdmin && <span className="text-xs text-[#6C9BFF] font-semibold">Active</span>}
            </button>

            <button
              onClick={() => handleLinkClick('#contact')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#6C9BFF] text-white font-semibold text-sm shadow-md"
            >
              <span>{t('navStartProject')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
