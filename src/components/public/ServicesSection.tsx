import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { getLocalizedText } from '../../utils/logic';
import {
  Layout,
  Palette,
  Code2,
  Mail,
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForInquiry?: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForInquiry,
}) => {
  const { language, t } = useLanguage();
  const { services } = useData();

  // Filter only published services
  const publishedServices = services
    .filter((s) => s.isPublished)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'layout':
        return Layout;
      case 'palette':
        return Palette;
      case 'code2':
      case 'code':
        return Code2;
      case 'mail':
        return Mail;
      case 'bot':
      case 'ai':
        return Bot;
      default:
        return Sparkles;
    }
  };

  const handleServiceSelect = (serviceTitle: string) => {
    if (onSelectServiceForInquiry) {
      onSelectServiceForInquiry(serviceTitle);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121A2B] border border-[#29354B] text-xs font-semibold text-[#6C9BFF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('servicesTitle')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FC]">
            {language === 'en'
              ? 'Five Core Services for Digital Growth'
              : 'ডিজিটাল অগ্রগতির জন্য পাঁচটি বিশেষায়িত সেবা'}
          </h2>
          <p className="text-base sm:text-lg text-[#A7B2C8]">
            {t('servicesSubtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedServices.map((service, index) => {
            const Icon = getIcon(service.iconName);
            const title = getLocalizedText(service.titleEn, service.titleBn, language);
            const desc = getLocalizedText(service.shortDescEn, service.shortDescBn, language);
            const cta = getLocalizedText(service.ctaTextEn, service.ctaTextBn, language) || 'Request Scope';
            const deliverables = language === 'bn' && service.deliverablesBn?.length
              ? service.deliverablesBn
              : service.deliverablesEn || [];

            return (
              <div
                key={service.id || index}
                className="rounded-2xl bg-[#121A2B] border border-[#29354B] p-7 flex flex-col justify-between hover:border-[#6C9BFF]/60 hover:shadow-xl hover:shadow-[#6C9BFF]/5 transition-all group relative overflow-hidden"
              >
                {/* Top glow accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C9BFF]/5 rounded-bl-full pointer-events-none group-hover:bg-[#6C9BFF]/10 transition-colors" />

                <div>
                  {/* Icon & Category Pill */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#18243A] border border-[#29354B] flex items-center justify-center text-[#6C9BFF] group-hover:bg-[#6C9BFF] group-hover:text-white transition-all shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#A7B2C8]/70 px-2.5 py-1 rounded bg-[#18243A] border border-[#29354B]/80">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-[#F5F7FC] mb-3 group-hover:text-[#6C9BFF] transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-[#A7B2C8] leading-relaxed mb-6 font-normal">
                    {desc}
                  </p>

                  {/* Deliverables List */}
                  {deliverables.length > 0 && (
                    <div className="space-y-2 mb-8 pt-4 border-t border-[#29354B]/60">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-[#A7B2C8]/70 mb-2">
                        {language === 'en' ? 'Core Deliverables' : 'প্রধান ডেলিভারেবলস'}
                      </p>
                      {deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-xs text-[#F5F7FC]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#6C9BFF] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Service CTA */}
                <button
                  onClick={() => handleServiceSelect(service.titleEn)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#29354B] bg-[#18243A] text-xs sm:text-sm font-semibold text-[#F5F7FC] hover:bg-[#6C9BFF] hover:border-[#6C9BFF] hover:text-white transition-all group/btn"
                >
                  <span>{cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
