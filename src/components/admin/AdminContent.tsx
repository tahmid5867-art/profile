import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  FileEdit,
  Save,
  CheckCircle2,
  AlertTriangle,
  User,
  Sparkles,
  PhoneCall,
  Globe,
} from 'lucide-react';

export const AdminContent: React.FC = () => {
  const { siteSettings, profile, updateSiteSettings, updateProfile } = useData();

  const [settingsForm, setSettingsForm] = useState({ ...siteSettings });
  const [profileForm, setProfileForm] = useState({ ...profile });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      await updateSiteSettings(settingsForm);
      await updateProfile(profileForm);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] tracking-tight">
            Website Content & Bio Manager
          </h2>
          <p className="text-xs sm:text-sm text-[#A7B2C8] mt-1">
            Update hero copy, bilingual bio, skills, work approach, and contact channels.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors shadow-md shadow-[#6C9BFF]/20 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving Updates...' : 'Save All Changes'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-[#52C481]/15 border border-[#52C481]/40 text-[#52C481] text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Website content and profile synchronized to Firestore successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#E05252]/15 border border-[#E05252]/40 text-[#E05252] text-xs sm:text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* Section 1: Hero Section Copy */}
        <div className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-5">
          <h3 className="text-base font-bold text-[#F5F7FC] flex items-center gap-2 border-b border-[#29354B] pb-3">
            <Sparkles className="w-4 h-4 text-[#6C9BFF]" />
            <span>Hero Headline & CTAs</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Hero Headline (English)
              </label>
              <input
                type="text"
                value={settingsForm.heroHeadlineEn || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadlineEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Hero Headline (Bengali)
              </label>
              <input
                type="text"
                value={settingsForm.heroHeadlineBn || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadlineBn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Hero Subtitle (English)
              </label>
              <textarea
                rows={3}
                value={settingsForm.heroSubtitleEn || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitleEn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Hero Subtitle (Bengali)
              </label>
              <textarea
                rows={3}
                value={settingsForm.heroSubtitleBn || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitleBn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Primary CTA (EN)</label>
              <input
                type="text"
                value={settingsForm.heroPrimaryCtaEn || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroPrimaryCtaEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Primary CTA (BN)</label>
              <input
                type="text"
                value={settingsForm.heroPrimaryCtaBn || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroPrimaryCtaBn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Secondary CTA (EN)</label>
              <input
                type="text"
                value={settingsForm.heroSecondaryCtaEn || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroSecondaryCtaEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Secondary CTA (BN)</label>
              <input
                type="text"
                value={settingsForm.heroSecondaryCtaBn || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroSecondaryCtaBn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Personal Profile & Biography */}
        <div className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-5">
          <h3 className="text-base font-bold text-[#F5F7FC] flex items-center gap-2 border-b border-[#29354B] pb-3">
            <User className="w-4 h-4 text-[#6C9BFF]" />
            <span>Profile & Biography</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Display Name</label>
              <input
                type="text"
                value={profileForm.name || ''}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Headline (EN)</label>
              <input
                type="text"
                value={profileForm.headlineEn || ''}
                onChange={(e) => setProfileForm({ ...profileForm, headlineEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Headline (BN)</label>
              <input
                type="text"
                value={profileForm.headlineBn || ''}
                onChange={(e) => setProfileForm({ ...profileForm, headlineBn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F5F7FC]">Profile Photo URL</label>
            <input
              type="url"
              value={profileForm.photoUrl || ''}
              onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Bio (English)</label>
              <textarea
                rows={4}
                value={profileForm.bioEn || ''}
                onChange={(e) => setProfileForm({ ...profileForm, bioEn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Bio (Bengali)</label>
              <textarea
                rows={4}
                value={profileForm.bioBn || ''}
                onChange={(e) => setProfileForm({ ...profileForm, bioBn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Skills (Comma Separated)
              </label>
              <input
                type="text"
                value={profileForm.skills?.join(', ') || ''}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Tools (Comma Separated)
              </label>
              <input
                type="text"
                value={profileForm.tools?.join(', ') || ''}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Work Approach (EN)</label>
              <textarea
                rows={2}
                value={profileForm.workApproachEn || ''}
                onChange={(e) => setProfileForm({ ...profileForm, workApproachEn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Work Approach (BN)</label>
              <textarea
                rows={2}
                value={profileForm.workApproachBn || ''}
                onChange={(e) => setProfileForm({ ...profileForm, workApproachBn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact Channels & Location */}
        <div className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-5">
          <h3 className="text-base font-bold text-[#F5F7FC] flex items-center gap-2 border-b border-[#29354B] pb-3">
            <PhoneCall className="w-4 h-4 text-[#6C9BFF]" />
            <span>Contact Channels & Social Links</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Contact Email</label>
              <input
                type="email"
                value={settingsForm.contactEmail || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">WhatsApp Number</label>
              <input
                type="text"
                value={settingsForm.whatsappNumber || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                placeholder="+880..."
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Location</label>
              <input
                type="text"
                value={settingsForm.location || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">GitHub URL</label>
              <input
                type="url"
                value={settingsForm.githubUrl || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, githubUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">LinkedIn URL</label>
              <input
                type="url"
                value={settingsForm.linkedinUrl || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Twitter / X URL</label>
              <input
                type="url"
                value={settingsForm.twitterUrl || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
