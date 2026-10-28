import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  MessageSquare,
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ContactSectionProps {
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  preselectedService,
}) => {
  const { language, t } = useLanguage();
  const { siteSettings, services, submitInquiry } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [serviceRequested, setServiceRequested] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [honeypot, setHoneypot] = useState(''); // anti-spam bot trap
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setServiceRequested(preselectedService);
    }
  }, [preselectedService]);

  const budgetOptions = [
    { label: language === 'en' ? 'Under $500 / ৳50,000' : '$৫০০ / ৫০,০০০ টাকার নিচে', value: '< $500' },
    { label: language === 'en' ? '$500 - $1,500 / ৳50k - ৳1.5L' : '$৫০০ - $১,৫০০', value: '$500 - $1,500' },
    { label: language === 'en' ? '$1,500 - $4,000' : '$১,৫০০ - $৪,০০০', value: '$1,500 - $4,000' },
    { label: language === 'en' ? '$4,000+ / Enterprise' : '$৪,০০০+ / এন্টারপ্রাইজ', value: '$4,000+' },
    { label: language === 'en' ? 'Flexible / To Be Discussed' : 'আলোচনা সাপেক্ষে', value: 'Flexible' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setErrors({});

    // Honeypot spam check
    if (honeypot) {
      return;
    }

    setSubmitting(true);

    const result = await submitInquiry({
      name,
      email,
      company,
      serviceRequested: serviceRequested || services[0]?.titleEn || 'UI/UX Design',
      budgetRange: budgetRange || 'Flexible',
      projectDescription,
      preferredLanguage: language,
    });

    setSubmitting(false);

    if (result.success) {
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setCompany('');
      setProjectDescription('');
      setBudgetRange('');
    } else {
      if (result.errors) {
        setErrors(result.errors);
      }
      setSubmitError(result.message || 'Validation failed. Please review the highlighted fields.');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 relative border-t border-[#29354B]/80 bg-[#0B1020]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121A2B] border border-[#29354B] text-xs font-semibold text-[#6C9BFF]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t('contactTitle')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FC]">
            {language === 'en'
              ? 'Ready to Start Your Next Project?'
              : 'আপনার পরবর্তী প্রজেক্ট নিয়ে আলোচনা শুরু করুন'}
          </h2>
          <p className="text-base sm:text-lg text-[#A7B2C8]">
            {t('contactSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Info & Guarantees */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="rounded-3xl bg-[#121A2B] border border-[#29354B] p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold text-[#F5F7FC]">
                {language === 'en' ? 'Direct Contact Options' : 'সরাসরি যোগাযোগ মাধ্যম'}
              </h3>
              <p className="text-sm text-[#A7B2C8] leading-relaxed">
                {language === 'en'
                  ? 'Feel free to reach out via direct channels or submit the structured project inquiry form. I typically respond within 24 hours.'
                  : 'সরাসরি হোয়াটসঅ্যাপ, ইমেইল অথবা পাশের ফর্মটি পূরণ করে আপনার রিকোয়ারমেন্ট পাঠাতে পারেন। সাধারণ ২৪ ঘণ্টার মধ্যে রিপ্লাই দেওয়া হয়।'}
              </p>

              <div className="space-y-4 pt-2">
                {/* Email */}
                {siteSettings.contactEmail && (
                  <a
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#18243A] border border-[#29354B] hover:border-[#6C9BFF]/60 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#6C9BFF]/10 text-[#6C9BFF] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-[#A7B2C8] font-medium">{t('directEmail')}</div>
                      <div className="text-sm font-bold text-[#F5F7FC] group-hover:text-[#6C9BFF] transition-colors break-all">
                        {siteSettings.contactEmail}
                      </div>
                    </div>
                  </a>
                )}

                {/* WhatsApp */}
                {siteSettings.whatsappNumber && (
                  <a
                    href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#18243A] border border-[#29354B] hover:border-[#52C481]/60 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#52C481]/10 text-[#52C481] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-[#A7B2C8] font-medium">{t('directWhatsApp')}</div>
                      <div className="text-sm font-bold text-[#F5F7FC] group-hover:text-[#52C481] transition-colors">
                        {siteSettings.whatsappNumber}
                      </div>
                    </div>
                  </a>
                )}

                {/* Location */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#18243A]/50 border border-[#29354B]">
                  <div className="w-12 h-12 rounded-xl bg-[#121A2B] text-[#A7B2C8] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#A7B2C8] font-medium">{t('locationLabel')}</div>
                    <div className="text-sm font-semibold text-[#F5F7FC]">
                      {siteSettings.location || 'Dhaka, Bangladesh & Remote Clients Worldwide'}
                    </div>
                  </div>
                </div>

                {/* Response SLA */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#18243A]/50 border border-[#29354B]">
                  <div className="w-12 h-12 rounded-xl bg-[#121A2B] text-[#6C9BFF] flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#A7B2C8] font-medium">Turnaround Time</div>
                    <div className="text-sm font-semibold text-[#F5F7FC]">
                      Initial assessment within 24 hours
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#121A2B] border border-[#29354B] p-6 sm:p-10 shadow-2xl relative text-left">
              {submitSuccess ? (
                <div className="py-12 px-4 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#52C481]/15 text-[#52C481] mx-auto flex items-center justify-center border border-[#52C481]/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#F5F7FC]">
                    {language === 'en' ? 'Inquiry Submitted Securely' : 'ইনকোয়ারি সফলভাবে গৃহীত হয়েছে'}
                  </h3>
                  <p className="text-sm sm:text-base text-[#A7B2C8] max-w-lg mx-auto leading-relaxed">
                    {t('formSuccess')}
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm font-semibold text-[#F5F7FC] hover:border-[#6C9BFF]/60 transition-colors"
                  >
                    {language === 'en' ? 'Submit Another Request' : 'আরেকটি প্রস্তাব পাঠান'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Global error banner if any */}
                  {submitError && (
                    <div className="p-4 rounded-xl bg-[#E05252]/10 border border-[#E05252]/40 text-[#E05252] text-xs sm:text-sm flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>{submitError}</div>
                    </div>
                  )}

                  {/* Anti-spam hidden honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website_hp">Leave this empty</label>
                    <input
                      type="text"
                      id="website_hp"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="inquiry-name" className="block text-xs font-semibold text-[#F5F7FC]">
                        {t('formName')}
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Farhan Rahman"
                        className={`w-full px-4 py-3 rounded-xl bg-[#18243A] border text-sm text-[#F5F7FC] placeholder-[#A7B2C8]/50 focus:outline-none focus:ring-2 focus:ring-[#6C9BFF] transition-all ${
                          errors.name ? 'border-[#E05252]' : 'border-[#29354B]'
                        }`}
                      />
                      {errors.name && <p className="text-xs text-[#E05252]">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="inquiry-email" className="block text-xs font-semibold text-[#F5F7FC]">
                        {t('formEmail')}
                      </label>
                      <input
                        id="inquiry-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. client@brand.com"
                        className={`w-full px-4 py-3 rounded-xl bg-[#18243A] border text-sm text-[#F5F7FC] placeholder-[#A7B2C8]/50 focus:outline-none focus:ring-2 focus:ring-[#6C9BFF] transition-all ${
                          errors.email ? 'border-[#E05252]' : 'border-[#29354B]'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-[#E05252]">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Company & Requested Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="inquiry-company" className="block text-xs font-semibold text-[#F5F7FC]">
                        {t('formCompany')}
                      </label>
                      <input
                        id="inquiry-company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Fintech Global Ltd."
                        className="w-full px-4 py-3 rounded-xl bg-[#18243A] border border-[#29354B] text-sm text-[#F5F7FC] placeholder-[#A7B2C8]/50 focus:outline-none focus:ring-2 focus:ring-[#6C9BFF] transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="inquiry-service" className="block text-xs font-semibold text-[#F5F7FC]">
                        {t('formService')}
                      </label>
                      <select
                        id="inquiry-service"
                        value={serviceRequested}
                        onChange={(e) => setServiceRequested(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-[#18243A] border text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF] transition-all ${
                          errors.serviceRequested ? 'border-[#E05252]' : 'border-[#29354B]'
                        }`}
                      >
                        <option value="">{language === 'en' ? '-- Select a Discipline --' : '-- সার্ভিস নির্বাচন করুন --'}</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.titleEn}>
                            {language === 'en' ? s.titleEn : s.titleBn || s.titleEn}
                          </option>
                        ))}
                      </select>
                      {errors.serviceRequested && (
                        <p className="text-xs text-[#E05252]">{errors.serviceRequested}</p>
                      )}
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#F5F7FC]">
                      {t('formBudget')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {budgetOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setBudgetRange(opt.value)}
                          className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                            budgetRange === opt.value
                              ? 'bg-[#6C9BFF]/20 border-[#6C9BFF] text-[#F5F7FC]'
                              : 'bg-[#18243A] border-[#29354B] text-[#A7B2C8] hover:border-[#6C9BFF]/40'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="space-y-2">
                    <label htmlFor="inquiry-desc" className="block text-xs font-semibold text-[#F5F7FC]">
                      {t('formDescription')}
                    </label>
                    <textarea
                      id="inquiry-desc"
                      rows={5}
                      required
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder={
                        language === 'en'
                          ? 'Describe your project scope, target timeline, key goals, and any reference URLs...'
                          : 'আপনার প্রজেক্টের লক্ষ্য, সময়সীমা এবং প্রয়োজনীয় ফিচারসমূহ সংক্ষেপে বর্ণনা করুন...'
                      }
                      className={`w-full px-4 py-3 rounded-xl bg-[#18243A] border text-sm text-[#F5F7FC] placeholder-[#A7B2C8]/50 focus:outline-none focus:ring-2 focus:ring-[#6C9BFF] transition-all resize-y ${
                        errors.projectDescription ? 'border-[#E05252]' : 'border-[#29354B]'
                      }`}
                    />
                    {errors.projectDescription && (
                      <p className="text-xs text-[#E05252]">{errors.projectDescription}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-[#6C9BFF] to-[#4574E8] text-white text-base font-semibold shadow-xl shadow-[#6C9BFF]/20 hover:shadow-[#6C9BFF]/35 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t('formSubmitting')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('formSubmit')}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-[#A7B2C8]/70">
                    {language === 'en'
                      ? 'Inquiries are encrypted and stored in Cloud Firestore under strict access rules.'
                      : 'তথ্যসমূহ ক্লাউড ফায়ারস্টোরে কঠোর সুরক্ষায় সংরক্ষিত থাকে।'}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
