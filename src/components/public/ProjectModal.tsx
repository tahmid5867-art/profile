import React, { useEffect } from 'react';
import { Project } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedText } from '../../utils/logic';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Target,
  Sparkles,
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { language } = useLanguage();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const title = getLocalizedText(project.titleEn, project.titleBn, language);
  const shortDesc = getLocalizedText(project.shortDescEn, project.shortDescBn, language);
  const role = getLocalizedText(project.roleEn, project.roleBn, language);
  const challenge = getLocalizedText(project.challengeEn, project.challengeBn, language);
  const solution = getLocalizedText(project.solutionEn, project.solutionBn, language);
  const outcome = getLocalizedText(project.outcomeEn, project.outcomeBn, language);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#0B1020]/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#121A2B] border border-[#29354B] p-6 sm:p-10 shadow-2xl shadow-black z-10 text-left space-y-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-[#18243A] border border-[#29354B] text-[#A7B2C8] hover:text-[#F5F7FC] hover:border-[#6C9BFF]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
          aria-label="Close case study modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tags & Title */}
        <div className="space-y-3 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#6C9BFF]/15 text-[#6C9BFF] border border-[#6C9BFF]/30">
              {project.category}
            </span>
            {project.isPractice && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E5B54F]/15 text-[#E5B54F] border border-[#E5B54F]/30 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {language === 'en' ? 'Self-Directed Concept Case Study' : 'সেলফ-ডিরেক্টেড কনসেপ্ট স্টাডি'}
              </span>
            )}
          </div>

          <h2 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] leading-snug">
            {title}
          </h2>

          <p className="text-base text-[#A7B2C8] leading-relaxed">
            {shortDesc}
          </p>

          {role && (
            <div className="text-xs text-[#A7B2C8] font-medium pt-1">
              <span className="text-[#6C9BFF] font-semibold">{language === 'en' ? 'Role / Responsibility: ' : 'দায়িত্ব / ভূমিকা: '}</span>
              {role}
            </div>
          )}
        </div>

        {/* Hero Cover Image */}
        <div className="rounded-2xl overflow-hidden border border-[#29354B] bg-[#0B1020] aspect-video w-full relative">
          <img
            src={project.coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tools and Technologies */}
        {project.tools && project.tools.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#18243A]/80 border border-[#29354B]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#A7B2C8] uppercase tracking-wider mb-3">
              <Wrench className="w-4 h-4 text-[#6C9BFF]" />
              <span>{language === 'en' ? 'Tools & Technologies Used' : 'ব্যবহৃত টুলস ও প্রযুক্তি'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 rounded-lg bg-[#0B1020] border border-[#29354B] text-xs font-medium text-[#F5F7FC]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Deep Dive: Problem, Solution, Outcome */}
        <div className="space-y-6 pt-2">
          {/* Challenge */}
          {challenge && (
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#F5F7FC] flex items-center gap-2">
                <Target className="w-5 h-5 text-[#E05252]" />
                <span>{language === 'en' ? 'The Challenge & Problem Space' : 'সমস্যা ও চ্যালেঞ্জ'}</span>
              </h3>
              <p className="text-sm sm:text-base text-[#A7B2C8] leading-relaxed whitespace-pre-line pl-7">
                {challenge}
              </p>
            </div>
          )}

          {/* Solution */}
          {solution && (
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#F5F7FC] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#6C9BFF]" />
                <span>{language === 'en' ? 'The Strategy & Technical Solution' : 'কৌশল ও সমাধান'}</span>
              </h3>
              <p className="text-sm sm:text-base text-[#A7B2C8] leading-relaxed whitespace-pre-line pl-7">
                {solution}
              </p>
            </div>
          )}

          {/* Outcome / Learnings */}
          {outcome && (
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#F5F7FC] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#52C481]" />
                <span>{language === 'en' ? 'Verified Outcome & Architecture' : 'ফলাফল ও পর্যবেক্ষণ'}</span>
              </h3>
              <p className="text-sm sm:text-base text-[#A7B2C8] leading-relaxed whitespace-pre-line pl-7">
                {outcome}
              </p>
            </div>
          )}
        </div>

        {/* Gallery if present */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[#29354B]/70">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#A7B2C8]">
              {language === 'en' ? 'Supporting Artifacts & Views' : 'স্ক্রিনশট ও ভিজ্যুয়াল ভিউ'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.gallery.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border border-[#29354B] bg-[#0B1020] aspect-video"
                >
                  <img
                    src={imgUrl}
                    alt={`${title} gallery preview ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Links & Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#29354B]">
          <div className="flex flex-wrap items-center gap-3">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors"
              >
                <span>{language === 'en' ? 'View Live Demo' : 'লাইভ ডেমো দেখুন'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-[#F5F7FC] text-xs sm:text-sm font-semibold hover:border-[#6C9BFF]/60 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>{language === 'en' ? 'Inspect Repository' : 'সোর্স কোড'}</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#29354B] text-[#A7B2C8] hover:text-[#F5F7FC] text-xs sm:text-sm font-medium transition-colors"
          >
            {language === 'en' ? 'Close Case Study' : 'বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
