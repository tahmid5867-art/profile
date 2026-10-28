import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Search,
  Globe,
  Share2,
  CheckCircle2,
  Save,
  ShieldCheck,
} from 'lucide-react';

export const AdminSeo: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useData();

  const [form, setForm] = useState({ ...siteSettings });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] tracking-tight">
            SEO & Metadata Manager
          </h2>
          <p className="text-xs sm:text-sm text-[#A7B2C8] mt-1">
            Configure OpenGraph social cards, search snippets, and robots indexing directives.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors shadow-md shadow-[#6C9BFF]/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save SEO Configuration'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-[#52C481]/15 border border-[#52C481]/40 text-[#52C481] text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>SEO settings updated in Cloud Firestore!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-4">
            <h3 className="text-sm font-bold text-[#F5F7FC] flex items-center gap-2 border-b border-[#29354B] pb-3">
              <Globe className="w-4 h-4 text-[#6C9BFF]" />
              <span>Search Engine Title & Descriptions</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Site Title (English)
              </label>
              <input
                type="text"
                value={form.siteTitleEn || ''}
                onChange={(e) => setForm({ ...form, siteTitleEn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Site Title (Bengali)
              </label>
              <input
                type="text"
                value={form.siteTitleBn || ''}
                onChange={(e) => setForm({ ...form, siteTitleBn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Meta Description (English)
              </label>
              <textarea
                rows={3}
                value={form.descriptionEn || ''}
                onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Meta Description (Bengali)
              </label>
              <textarea
                rows={3}
                value={form.descriptionBn || ''}
                onChange={(e) => setForm({ ...form, descriptionBn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>
          </div>

          {/* Privacy & Indexing Safety */}
          <div className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-3">
            <h3 className="text-sm font-bold text-[#F5F7FC] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#52C481]" />
              <span>Indexing Security Guarantees</span>
            </h3>
            <div className="text-xs text-[#A7B2C8] space-y-2 leading-relaxed">
              <p>
                ✓ Private routes (<code className="text-[#F5F7FC] bg-[#18243A] px-1 py-0.5 rounded">/admin/*</code>) are protected against indexing and exclude search bot crawling.
              </p>
              <p>
                ✓ Unpublished draft case studies are never rendered into sitemaps or public lists.
              </p>
              <p>
                ✓ Client inquiries are isolated behind Firestore security rules with zero search engine exposure.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Social Share Live Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FC] flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#6C9BFF]" />
            <span>OpenGraph Social Card Preview</span>
          </h3>

          <div className="rounded-2xl bg-[#121A2B] border border-[#29354B] overflow-hidden shadow-xl">
            {/* Mock Image */}
            <div className="aspect-[1.91/1] bg-[#0B1020] border-b border-[#29354B] relative overflow-hidden flex items-center justify-center p-6 text-center">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#6C9BFF] mx-auto flex items-center justify-center font-bold text-white text-lg">
                  A
                </div>
                <div className="text-sm font-bold text-[#F5F7FC]">
                  {form.siteTitleEn || 'Apex Digital'}
                </div>
                <div className="text-[11px] text-[#A7B2C8]">
                  UI/UX • Web Dev • Email Copy • AI Automation
                </div>
              </div>
            </div>

            {/* Snippet Details */}
            <div className="p-4 space-y-1.5 bg-[#18243A]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#A7B2C8]">
                portfolio.studio
              </div>
              <h4 className="text-sm font-bold text-[#F5F7FC] line-clamp-1">
                {form.siteTitleEn || 'Apex Digital — Portfolio & Creative Studio'}
              </h4>
              <p className="text-xs text-[#A7B2C8] line-clamp-2">
                {form.descriptionEn || 'Digital problem-solver combining UI/UX design, modern web development, email copywriting, and AI automation.'}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
