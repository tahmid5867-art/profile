import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';
import { getLocalizedText } from '../../utils/logic';
import { ProjectModal } from './ProjectModal';
import {
  FolderGit2,
  ExternalLink,
  Layers,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { projects } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', labelEn: 'All Disciplines', labelBn: 'সকল কাজ' },
    { id: 'UI/UX Design', labelEn: 'UI/UX Design', labelBn: 'ইউআই/ইউএক্স' },
    { id: 'Website Design', labelEn: 'Website Design', labelBn: 'ওয়েব ডিজাইন' },
    { id: 'Website Development', labelEn: 'Website Development', labelBn: 'ওয়েব ডেভেলপমেন্ট' },
    { id: 'Email Copywriting', labelEn: 'Email Copywriting', labelBn: 'ইমেল কপি' },
    { id: 'AI Automation', labelEn: 'AI Automation', labelBn: 'এআই অটোমেশন' },
  ];

  // Only public published projects
  const publishedProjects = projects
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const filteredProjects = publishedProjects.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section id="projects" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121A2B] border border-[#29354B] text-xs font-semibold text-[#6C9BFF]">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>{t('projectsTitle')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FC]">
            {language === 'en'
              ? 'Proven Disciplines in Action'
              : 'বাস্তবসম্মত প্রজেক্ট ও কেস স্টাডিজ'}
          </h2>
          <p className="text-base sm:text-lg text-[#A7B2C8]">
            {t('projectsSubtitle')}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12" role="tablist">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            const label = language === 'en' ? cat.labelEn : cat.labelBn;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#6C9BFF] ${
                  isActive
                    ? 'bg-[#6C9BFF] text-white shadow-lg shadow-[#6C9BFF]/25'
                    : 'bg-[#121A2B] border border-[#29354B] text-[#A7B2C8] hover:text-[#F5F7FC] hover:border-[#6C9BFF]/40'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-[#121A2B] border border-[#29354B]">
            <Layers className="w-10 h-10 text-[#A7B2C8]/50 mx-auto mb-3" />
            <p className="text-base font-semibold text-[#F5F7FC]">
              {language === 'en' ? 'No projects published in this category yet.' : 'এই ক্যাটাগরিতে এখনো কোনো প্রজেক্ট নেই।'}
            </p>
            <p className="text-xs text-[#A7B2C8] mt-1">
              {language === 'en' ? 'Switch category or check back soon.' : 'অন্যান্য ক্যাটাগরি দেখুন বা শীঘ্রই ফিরে আসুন।'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => {
              const title = getLocalizedText(project.titleEn, project.titleBn, language);
              const shortDesc = getLocalizedText(project.shortDescEn, project.shortDescBn, language);

              return (
                <div
                  key={project.id}
                  className="rounded-3xl bg-[#121A2B] border border-[#29354B] overflow-hidden hover:border-[#6C9BFF]/60 hover:shadow-2xl hover:shadow-[#6C9BFF]/5 transition-all group flex flex-col justify-between"
                >
                  {/* Card Cover with Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0B1020] border-b border-[#29354B]/80">
                    <img
                      src={project.coverImage}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121A2B] via-transparent to-transparent opacity-80" />

                    {/* Category & Concept Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#121A2B]/90 backdrop-blur-md text-[#6C9BFF] border border-[#29354B]">
                        {project.category}
                      </span>
                      {project.isPractice && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#121A2B]/90 backdrop-blur-md text-[#E5B54F] border border-[#E5B54F]/40 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{t('conceptBadge')}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#F5F7FC] group-hover:text-[#6C9BFF] transition-colors leading-snug">
                        {title}
                      </h3>
                      <p className="text-sm text-[#A7B2C8] leading-relaxed line-clamp-3 font-normal">
                        {shortDesc}
                      </p>
                    </div>

                    {/* Tech Badges */}
                    {project.tools && project.tools.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.tools.slice(0, 4).map((tool) => (
                          <span
                            key={tool}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#18243A] text-[#A7B2C8] border border-[#29354B]/70"
                          >
                            {tool}
                          </span>
                        ))}
                        {project.tools.length > 4 && (
                          <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-[#18243A] text-[#A7B2C8]">
                            +{project.tools.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#29354B]/70">
                      <button
                        onClick={() => setActiveModalProject(project)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6C9BFF] hover:text-[#9bbdff] transition-colors group/btn focus:outline-none"
                      >
                        <span>{t('viewCaseStudy')}</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-[#18243A] border border-[#29354B] text-[#A7B2C8] hover:text-[#F5F7FC] hover:border-[#6C9BFF]/50 transition-colors"
                          title="Open Live Demo"
                          aria-label={`Live demo for ${title}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
