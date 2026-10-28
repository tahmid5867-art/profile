import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Service } from '../../types';
import {
  Sparkles,
  Edit2,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  X,
  Layout,
  Palette,
  Code2,
  Mail,
  Bot,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { services, saveService, deleteService } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const iconOptions = ['Layout', 'Palette', 'Code2', 'Mail', 'Bot', 'Sparkles'];
  const categoryOptions = [
    'UI/UX Design',
    'Website Design',
    'Website Development',
    'Email Copywriting',
    'AI Automation',
    'Consulting & Strategy',
  ];

  const handleOpenCreate = () => {
    setEditingService({
      titleEn: '',
      titleBn: '',
      shortDescEn: '',
      shortDescBn: '',
      category: 'UI/UX Design',
      iconName: 'Layout',
      displayOrder: services.length + 1,
      isPublished: true,
      ctaTextEn: 'Request Scope',
      ctaTextBn: 'প্রস্তাব পাঠান',
      deliverablesEn: [],
      deliverablesBn: [],
    });
    setFormError(null);
    setIsEditing(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService({ ...service });
    setFormError(null);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!editingService.titleEn || editingService.titleEn.trim().length === 0) {
      setFormError('Service Title (English) is required.');
      return;
    }

    const category = editingService.category?.trim() || 'UI/UX Design';

    setSaveLoading(true);
    try {
      await saveService({
        ...editingService,
        titleEn: editingService.titleEn.trim(),
        category,
      } as Partial<Service> & { titleEn: string; category: string });

      setSuccessMsg(`Service "${editingService.titleEn}" saved successfully!`);
      setTimeout(() => setSuccessMsg(null), 4000);
      setIsEditing(false);
    } catch (err: unknown) {
      console.error('Service save error:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to save service in Firestore');
    } finally {
      setSaveLoading(false);
    }
  };

  const togglePublish = async (service: Service) => {
    try {
      await saveService({
        ...service,
        isPublished: !service.isPublished,
      });
      setSuccessMsg(`Service "${service.titleEn}" ${service.isPublished ? 'hidden' : 'published'}!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      console.error('Toggle error:', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] tracking-tight">
            Services Management
          </h2>
          <p className="text-xs sm:text-sm text-[#A7B2C8] mt-1">
            Configure the 5 primary specialized disciplines, deliverables, and call-to-actions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors shadow-md shadow-[#6C9BFF]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-[#52C481]/15 border border-[#52C481]/40 text-[#52C481] text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-6 rounded-2xl bg-[#121A2B] border transition-all space-y-4 ${
              service.isPublished ? 'border-[#29354B]' : 'border-[#29354B]/50 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#18243A] border border-[#29354B] flex items-center justify-center text-[#6C9BFF]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#F5F7FC]">{service.titleEn}</h3>
                  <p className="text-xs text-[#A7B2C8] font-mono">{service.titleBn || service.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublish(service)}
                  className={`p-1.5 rounded-lg border text-xs font-semibold ${
                    service.isPublished
                      ? 'bg-[#52C481]/15 text-[#52C481] border-[#52C481]/30'
                      : 'bg-[#18243A] text-[#A7B2C8] border-[#29354B]'
                  }`}
                  title={service.isPublished ? 'Hide from public' : 'Publish to site'}
                >
                  {service.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="p-1.5 rounded-lg bg-[#18243A] text-[#A7B2C8] hover:text-[#6C9BFF] border border-[#29354B]"
                  title="Edit Service"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(service.id)}
                  className="p-1.5 rounded-lg bg-[#18243A] text-[#A7B2C8] hover:text-[#E05252] border border-[#29354B]"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#A7B2C8] leading-relaxed">
              {service.shortDescEn}
            </p>

            {service.deliverablesEn && service.deliverablesEn.length > 0 && (
              <div className="pt-2 border-t border-[#29354B]/60">
                <div className="text-[11px] font-semibold text-[#A7B2C8] mb-1.5">Deliverables:</div>
                <div className="flex flex-wrap gap-1.5">
                  {service.deliverablesEn.map((d, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#18243A] text-[10px] font-medium text-[#F5F7FC]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-[#A7B2C8] pt-2">
              <span>Sort Order: #{service.displayOrder}</span>
              <span>CTA: "{service.ctaTextEn}"</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#0B1020]/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={() => setIsEditing(false)} />
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#121A2B] border border-[#29354B] p-6 sm:p-8 space-y-6 z-10 text-left shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#29354B]">
              <h3 className="text-lg font-bold text-[#F5F7FC]">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-[#A7B2C8] hover:text-[#F5F7FC]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-[#E05252]/10 border border-[#E05252]/40 text-xs text-[#E05252] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#F5F7FC]">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingService.titleEn || ''}
                    onChange={(e) => setEditingService({ ...editingService, titleEn: e.target.value })}
                    placeholder="e.g. AI Automation"
                    className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#F5F7FC]">Title (Bengali)</label>
                  <input
                    type="text"
                    value={editingService.titleBn || ''}
                    onChange={(e) => setEditingService({ ...editingService, titleBn: e.target.value })}
                    placeholder="e.g. এআই অটোমেশন"
                    className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#F5F7FC]">Category *</label>
                  <select
                    value={editingService.category || 'UI/UX Design'}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#F5F7FC]">Icon Identifier</label>
                  <select
                    value={editingService.iconName || 'Layout'}
                    onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
                  >
                    {iconOptions.map((ico) => (
                      <option key={ico} value={ico}>{ico}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#F5F7FC]">Description (English)</label>
                <textarea
                  rows={2}
                  value={editingService.shortDescEn || ''}
                  onChange={(e) => setEditingService({ ...editingService, shortDescEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#F5F7FC]">Description (Bengali)</label>
                <textarea
                  rows={2}
                  value={editingService.shortDescBn || ''}
                  onChange={(e) => setEditingService({ ...editingService, shortDescBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#F5F7FC]">
                  Deliverables (Comma Separated)
                </label>
                <input
                  type="text"
                  value={editingService.deliverablesEn?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      deliverablesEn: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#F5F7FC]">Display Order</label>
                  <input
                    type="number"
                    value={editingService.displayOrder ?? 1}
                    onChange={(e) => setEditingService({ ...editingService, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#F5F7FC]">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingService.ctaTextEn || 'Request Scope'}
                    onChange={(e) => setEditingService({ ...editingService, ctaTextEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#29354B]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-[#29354B] text-xs text-[#A7B2C8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-xl bg-[#6C9BFF] text-white text-xs font-semibold hover:bg-[#5084f0]"
                >
                  {saveLoading ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-2xl bg-[#121A2B] border border-[#29354B] p-6 space-y-4 text-left shadow-2xl">
            <h3 className="text-base font-bold text-[#F5F7FC]">Delete Service?</h3>
            <p className="text-xs text-[#A7B2C8]">This will remove the service from both public display and Firestore.</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg border border-[#29354B] text-xs text-[#A7B2C8]"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteService(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#E05252] text-white text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
