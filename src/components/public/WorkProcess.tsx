import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  FileSpreadsheet,
  Palette,
  Code2,
  CheckCircle2,
  GitBranch,
} from 'lucide-react';

export const WorkProcess: React.FC = () => {
  const { language, t } = useLanguage();

  const steps = [
    {
      step: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: Search,
    },
    {
      step: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: FileSpreadsheet,
    },
    {
      step: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: Palette,
    },
    {
      step: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: Code2,
    },
    {
      step: '05',
      title: t('step5Title'),
      desc: t('step5Desc'),
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="process" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121A2B] border border-[#29354B] text-xs font-semibold text-[#6C9BFF]">
            <GitBranch className="w-3.5 h-3.5" />
            <span>{t('processTitle')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FC]">
            {language === 'en'
              ? 'Predictable, Step-by-Step Execution'
              : 'সুশৃঙ্খল ও ধারাবাহিক কর্মপদ্ধতি'}
          </h2>
          <p className="text-base sm:text-lg text-[#A7B2C8]">
            {t('processSubtitle')}
          </p>
        </div>

        {/* 5-Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative rounded-2xl bg-[#121A2B] border border-[#29354B] p-6 flex flex-col justify-between hover:border-[#6C9BFF]/60 hover:-translate-y-1 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black font-mono text-[#6C9BFF]/40 group-hover:text-[#6C9BFF] transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#18243A] border border-[#29354B] flex items-center justify-center text-[#6C9BFF]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#F5F7FC] mb-2 group-hover:text-[#6C9BFF] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A7B2C8] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
