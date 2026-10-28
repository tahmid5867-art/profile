import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../types';
import { storage } from '../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { compressAndResizeImage, CompressedImageResult } from '../../utils/imageCompressor';
import {
  User,
  Upload,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Mail,
  PhoneCall,
  Globe,
  Camera,
  Layers,
  Wrench,
  Compass,
  Lock,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const { profile, updateProfile, siteSettings, updateSiteSettings } = useData();
  const { currentUser, updateAdminPassword } = useAuth();

  // Local form state
  const [formData, setFormData] = useState<Profile>({ ...profile });
  const [photoPreview, setPhotoPreview] = useState<string>(profile.photoUrl || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedResult, setCompressedResult] = useState<CompressedImageResult | null>(null);
  const [compressionStatus, setCompressionStatus] = useState<string | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmRemovePhoto, setConfirmRemovePhoto] = useState(false);

  // Admin password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form state when profile from Firestore updates
  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        email: profile.email || siteSettings.contactEmail || '',
        whatsappNumber: profile.whatsappNumber || siteSettings.whatsappNumber || '',
        githubUrl: profile.githubUrl || siteSettings.githubUrl || '',
        linkedinUrl: profile.linkedinUrl || siteSettings.linkedinUrl || '',
        twitterUrl: profile.twitterUrl || siteSettings.twitterUrl || '',
      });
      setPhotoPreview(profile.photoUrl || '');
    }
  }, [profile, siteSettings]);

  // Handle local file selection with instant client-side compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setCompressionStatus(null);

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Invalid file type. Supported formats are JPEG, PNG, and WebP.');
      return;
    }

    try {
      setCompressionStatus('Compressing image in browser...');
      const compressed = await compressAndResizeImage(file, 800, 800, 0.82);
      setSelectedFile(file);
      setCompressedResult(compressed);
      setPhotoPreview(compressed.dataUrl);
      setCompressionStatus(`Ready to upload: ${compressed.formattedSize} (${compressed.width}×${compressed.height}px)`);
    } catch (err: unknown) {
      console.warn('Compression fallback to direct file:', err);
      setSelectedFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setCompressionStatus('Selected file ready for upload.');
    }
  };

  // Upload photo to Firebase Storage with intelligent compressed fallback
  const uploadProfilePhoto = async (file: File): Promise<string> => {
    setUploading(true);
    setUploadProgress(15);

    try {
      // 1. Obtain optimized compressed image blob & dataUrl
      const compressed = compressedResult || await compressAndResizeImage(file, 800, 800, 0.82);

      // 2. Attempt upload to Firebase Storage
      const fileExt = file.name.split('.').pop() || 'jpg';
      const storagePath = `profiles/photo_${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, storagePath);

      return await new Promise<string>((resolve) => {
        const uploadTask = uploadBytesResumable(storageRef, compressed.blob);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(prog);
          },
          (storageError) => {
            console.warn('Firebase Storage upload restricted, using compact optimized data in Firestore:', storageError.message);
            // Compact ~40KB compressed data URL fallback safely fits in Firestore
            resolve(compressed.dataUrl);
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadUrl);
            } catch {
              resolve(compressed.dataUrl);
            }
          }
        );
      });
    } catch (err) {
      console.warn('Direct fallback to optimized image:', err);
      if (compressedResult) {
        return compressedResult.dataUrl;
      }
      const compressed = await compressAndResizeImage(file, 800, 800, 0.82);
      return compressed.dataUrl;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Immediate 1-Click Photo Save
  const handleQuickSavePhoto = async () => {
    if (!selectedFile && !photoPreview) return;
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let finalPhotoUrl = photoPreview;
      if (selectedFile) {
        finalPhotoUrl = await uploadProfilePhoto(selectedFile);
        setSelectedFile(null);
      }

      await updateProfile({
        ...formData,
        photoUrl: finalPhotoUrl,
        updatedAt: new Date().toISOString(),
      });

      setPhotoPreview(finalPhotoUrl);
      setSuccessMsg('Profile photo uploaded and published successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save photo');
    } finally {
      setSaving(false);
    }
  };

  // Admin Password Change Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg(null);
    setPasswordSuccessMsg(null);

    if (newPassword.length < 6) {
      setPasswordErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('Passwords do not match.');
      return;
    }

    setPasswordUpdating(true);
    try {
      await updateAdminPassword(newPassword, currentPassword || undefined);
      setPasswordSuccessMsg('Administrator password changed successfully! You can now log in with your new password.');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      setTimeout(() => setPasswordSuccessMsg(null), 6000);
    } catch (err: unknown) {
      setPasswordErrorMsg(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview('');
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, photoUrl: '' }));
    setConfirmRemovePhoto(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.name || formData.name.trim().length === 0) {
      setErrorMsg('Full Name is required.');
      setSaving(false);
      return;
    }

    try {
      let finalPhotoUrl = formData.photoUrl;

      // If a new local file was selected, upload it first
      if (selectedFile) {
        finalPhotoUrl = await uploadProfilePhoto(selectedFile);
        setSelectedFile(null);
      }

      const updatedPayload: Profile = {
        ...formData,
        photoUrl: finalPhotoUrl,
        updatedAt: new Date().toISOString(),
      };

      // 1. Save Profile in Firestore
      await updateProfile(updatedPayload);

      // 2. Synchronize contact channels to SiteSettings
      await updateSiteSettings({
        contactEmail: formData.email || siteSettings.contactEmail,
        whatsappNumber: formData.whatsappNumber || siteSettings.whatsappNumber,
        githubUrl: formData.githubUrl || siteSettings.githubUrl,
        linkedinUrl: formData.linkedinUrl || siteSettings.linkedinUrl,
        twitterUrl: formData.twitterUrl || siteSettings.twitterUrl,
        defaultLanguage: formData.defaultLanguage || siteSettings.defaultLanguage,
      });

      setSuccessMsg('Profile information and photo saved successfully to Firestore!');
      setPhotoPreview(finalPhotoUrl);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      console.error('Profile save error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] tracking-tight">
            Profile & Personal Brand Manager
          </h2>
          <p className="text-xs sm:text-sm text-[#A7B2C8] mt-1">
            Manage your personal identity, uploaded photo, headline, bio, and competencies.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving || uploading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors shadow-md shadow-[#6C9BFF]/20 disabled:opacity-50"
        >
          {saving || uploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving to Firestore...' : uploading ? `Uploading ${uploadProgress}%...` : 'Save Profile'}</span>
        </button>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-[#52C481]/15 border border-[#52C481]/40 text-[#52C481] text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#E05252]/15 border border-[#E05252]/40 text-[#E05252] text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Section 1: Profile Photo Upload & Frame */}
        <div className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-6">
          <div className="flex items-center justify-between border-b border-[#29354B] pb-3">
            <h3 className="text-base font-bold text-[#F5F7FC] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#6C9BFF]" />
              <span>Profile Photo & Avatar Frame</span>
            </h3>
            <span className="text-[11px] text-[#A7B2C8]">Appears on the right side of the hero section</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Photo Preview Box */}
            <div className="relative group shrink-0">
              <div className="w-36 h-44 sm:w-44 sm:h-56 rounded-2xl overflow-hidden bg-[#0B1020] border-2 border-[#29354B] group-hover:border-[#6C9BFF]/60 shadow-xl relative transition-all">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt={formData.name || 'Profile preview'}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#A7B2C8]/50 p-4 text-center">
                    <User className="w-12 h-12 mb-2" />
                    <span className="text-xs">No Photo Selected</span>
                  </div>
                )}

                {/* Upload progress overlay */}
                {uploading && (
                  <div className="absolute inset-0 bg-[#0B1020]/80 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center">
                    <div className="w-8 h-8 border-2 border-[#6C9BFF] border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-xs font-semibold text-[#6C9BFF]">{uploadProgress}%</span>
                    <span className="text-[10px] text-[#A7B2C8]">Uploading image...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Photo Action Controls */}
            <div className="flex-1 space-y-4 text-left">
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FC]">Choose New Profile Photo</h4>
                <p className="text-xs text-[#A7B2C8] mt-1 leading-relaxed">
                  Upload a high-resolution portrait (JPEG, PNG, or WebP up to 5 MB). The image will be processed, uploaded, and prominently displayed in the public hero section.
                </p>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {compressionStatus && (
                <div className="p-3 rounded-xl bg-[#6C9BFF]/10 border border-[#6C9BFF]/30 text-xs text-[#6C9BFF] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{compressionStatus}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm font-semibold text-[#F5F7FC] hover:border-[#6C9BFF]/60 hover:text-[#6C9BFF] transition-colors"
                >
                  <Upload className="w-4 h-4 text-[#6C9BFF]" />
                  <span>{photoPreview ? 'Choose New Image' : 'Choose Image'}</span>
                </button>

                {(selectedFile || photoPreview) && (
                  <button
                    type="button"
                    onClick={handleQuickSavePhoto}
                    disabled={saving || uploading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors shadow-md shadow-[#6C9BFF]/20 disabled:opacity-50"
                  >
                    {saving || uploading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{saving ? 'Saving...' : uploading ? `Uploading ${uploadProgress}%...` : 'Save Photo Now'}</span>
                  </button>
                )}

                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => setConfirmRemovePhoto(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs font-semibold text-[#E05252] hover:bg-[#E05252]/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              {/* Direct image URL input field */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-[#A7B2C8]">
                  Or provide a direct image URL:
                </label>
                <input
                  type="url"
                  value={formData.photoUrl || ''}
                  onChange={(e) => {
                    const url = e.target.value;
                    setFormData((prev) => ({ ...prev, photoUrl: url }));
                    setPhotoPreview(url);
                    setSelectedFile(null);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC] placeholder-[#A7B2C8]/50 focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                />
              </div>

              {/* Confirmation modal for removal */}
              {confirmRemovePhoto && (
                <div className="p-3.5 rounded-xl bg-[#E05252]/10 border border-[#E05252]/30 text-xs text-[#F5F7FC] flex items-center justify-between gap-3">
                  <span>Confirm removing current profile photo?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmRemovePhoto(false)}
                      className="px-2.5 py-1 rounded bg-[#18243A] text-[#A7B2C8]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-2.5 py-1 rounded bg-[#E05252] text-white font-semibold"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Name & Professional Titles */}
        <div className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-5">
          <h3 className="text-base font-bold text-[#F5F7FC] flex items-center gap-2 border-b border-[#29354B] pb-3">
            <User className="w-4 h-4 text-[#6C9BFF]" />
            <span>Name & Professional Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Full Display Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tahmid Hasan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
              />
              <p className="text-[10px] text-[#A7B2C8]">Appears directly underneath profile photo in hero</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Professional Title / Tagline (EN) *
              </label>
              <input
                type="text"
                required
                value={formData.headlineEn || ''}
                onChange={(e) => setFormData({ ...formData, headlineEn: e.target.value })}
                placeholder="e.g. Full-Stack Digital Problem-Solver & Designer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
              />
              <p className="text-[10px] text-[#A7B2C8]">Sub-headline beneath your name</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Professional Title / Tagline (BN)
              </label>
              <input
                type="text"
                value={formData.headlineBn || ''}
                onChange={(e) => setFormData({ ...formData, headlineBn: e.target.value })}
                placeholder="e.g. ফুল-স্ট্যাক ডিজিটাল প্রবলেম সলভার ও ডিজাইনার"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Biography (English)
              </label>
              <textarea
                rows={4}
                value={formData.bioEn || ''}
                onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
                placeholder="Detailed professional story and background..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Biography (Bengali)
              </label>
              <textarea
                rows={4}
                value={formData.bioBn || ''}
                onChange={(e) => setFormData({ ...formData, bioBn: e.target.value })}
                placeholder="বাংলা পরিচিতি ও কাজের বিবরণ..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Skills, Tools & Approach */}
        <div className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-5">
          <h3 className="text-base font-bold text-[#F5F7FC] flex items-center gap-2 border-b border-[#29354B] pb-3">
            <Wrench className="w-4 h-4 text-[#6C9BFF]" />
            <span>Skills, Tech Stack & Working Approach</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Core Competencies (Comma Separated)
              </label>
              <input
                type="text"
                value={formData.skills?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="UI/UX Architecture, Responsive Web Development, AI Automations"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Production Tools (Comma Separated)
              </label>
              <input
                type="text"
                value={formData.tools?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="Figma, React, TypeScript, Tailwind CSS, Cloud Firestore"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Work Approach Philosophy (EN)
              </label>
              <textarea
                rows={3}
                value={formData.workApproachEn || ''}
                onChange={(e) => setFormData({ ...formData, workApproachEn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Work Approach Philosophy (BN)
              </label>
              <textarea
                rows={3}
                value={formData.workApproachBn || ''}
                onChange={(e) => setFormData({ ...formData, workApproachBn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Contact Channels & Socials */}
        <div className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-5">
          <h3 className="text-base font-bold text-[#F5F7FC] flex items-center gap-2 border-b border-[#29354B] pb-3">
            <PhoneCall className="w-4 h-4 text-[#6C9BFF]" />
            <span>Contact Channels & Social Media</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Primary Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tahmid5867@gmail.com"
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">WhatsApp Number</label>
              <input
                type="text"
                value={formData.whatsappNumber || ''}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+8801700000000"
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Default Language</label>
              <select
                value={formData.defaultLanguage || 'en'}
                onChange={(e) => setFormData({ ...formData, defaultLanguage: e.target.value as 'en' | 'bn' })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
              >
                <option value="en">English (Default)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedinUrl || ''}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Twitter / X URL</label>
              <input
                type="url"
                value={formData.twitterUrl || ''}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                placeholder="https://twitter.com/..."
                className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
              />
            </div>
          </div>
        </div>

        {/* Submit bottom bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#29354B]">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#6C9BFF] to-[#4574E8] text-white text-sm font-semibold shadow-xl shadow-[#6C9BFF]/25 hover:shadow-[#6C9BFF]/40 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {saving || uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* ========================================================
          Section 5: Admin Security & Password Change
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#29354B] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#6C9BFF]/10 text-[#6C9BFF]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F7FC]">Admin Security & Password Change</h3>
              <p className="text-xs text-[#A7B2C8]">Change your console login password. The initial default password is <span className="font-mono text-[#F5F7FC]">Admin@123456</span>.</p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-[#52C481]/15 text-[#52C481] border border-[#52C481]/30 text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#52C481] animate-pulse" />
            <span>Superadmin Active</span>
          </span>
        </div>

        {/* Password success banner */}
        {passwordSuccessMsg && (
          <div className="p-4 rounded-xl bg-[#52C481]/15 border border-[#52C481]/40 text-[#52C481] text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{passwordSuccessMsg}</span>
          </div>
        )}

        {/* Password error banner */}
        {passwordErrorMsg && (
          <div className="p-4 rounded-xl bg-[#E05252]/15 border border-[#E05252]/40 text-[#E05252] text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{passwordErrorMsg}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Admin Email (read only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A7B2C8]">Admin Account</label>
              <div className="px-3.5 py-2.5 rounded-xl bg-[#0B1020] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] font-mono">
                {currentUser?.email || 'tahmid5867@gmail.com'}
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">New Password *</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters..."
                  className="w-full px-3.5 pr-10 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] placeholder-[#A7B2C8]/50 focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7B2C8] hover:text-[#F5F7FC] p-1"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">Confirm New Password *</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password..."
                  className="w-full px-3.5 pr-10 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] placeholder-[#A7B2C8]/50 focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-[#A7B2C8] leading-relaxed">
              Updating your password immediately updates your Firebase Authentication credentials. Next time you sign in to the Admin Console, enter your new password.
            </p>

            <button
              type="submit"
              disabled={passwordUpdating || !newPassword}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors shadow-md shadow-[#6C9BFF]/20 disabled:opacity-50 shrink-0"
            >
              {passwordUpdating ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              <span>{passwordUpdating ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
