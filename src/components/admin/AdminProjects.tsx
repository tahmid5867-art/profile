import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';
import { generateSlug } from '../../utils/logic';
import { compressAndResizeImage } from '../../utils/imageCompressor';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  AlertTriangle,
  X,
  ExternalLink,
  Layers,
  ArrowUpDown,
  Upload,
} from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const { projects, saveProject, toggleProjectPublish, deleteProject } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const compressed = await compressAndResizeImage(file, 1000, 700, 0.82);
      setEditingProject((prev) => ({
        ...prev,
        coverImage: compressed.dataUrl,
      }));
    } catch (err: unknown) {
      console.error('Project image upload error:', err);
      setFormError('Failed to process project image');
    } finally {
      setUploadingCover(false);
    }
  };

  const categories = [
    'UI/UX Design',
    'Website Design',
    'Website Development',
    'Email Copywriting',
    'AI Automation',
  ];

  const filteredProjects = projects.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.titleEn.toLowerCase().includes(q) ||
        p.titleBn.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingProject({
      titleEn: '',
      titleBn: '',
      slug: '',
      shortDescEn: '',
      shortDescBn: '',
      category: 'UI/UX Design',
      coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      tools: ['React', 'TypeScript', 'Tailwind CSS'],
      roleEn: 'Lead Designer & Developer (Concept)',
      roleBn: '',
      challengeEn: '',
      challengeBn: '',
      solutionEn: '',
      solutionBn: '',
      outcomeEn: '',
      outcomeBn: '',
      liveDemoUrl: '',
      sourceUrl: '',
      isFeatured: false,
      isPractice: true,
      displayOrder: projects.length + 1,
      status: 'draft',
    });
    setFormError(null);
    setIsEditing(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project });
    setFormError(null);
    setIsEditing(true);
  };

  const handleDuplicate = async (project: Project) => {
    const dup: Partial<Project> & { titleEn: string; category: string } = {
      ...project,
      id: undefined,
      titleEn: `${project.titleEn} (Copy)`,
      titleBn: project.titleBn ? `${project.titleBn} (কপি)` : '',
      slug: `${project.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'draft',
      displayOrder: projects.length + 1,
    };
    await saveProject(dup);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!editingProject.titleEn || editingProject.titleEn.trim().length === 0) {
      setFormError('English Project Title is required.');
      return;
    }

    if (!editingProject.category) {
      setFormError('Service Category is required.');
      return;
    }

    // Auto-generate slug if empty
    const slug = editingProject.slug && editingProject.slug.trim().length > 0
      ? generateSlug(editingProject.slug)
      : generateSlug(editingProject.titleEn);

    setSaveLoading(true);
    try {
      await saveProject({
        ...editingProject,
        titleEn: editingProject.titleEn,
        category: editingProject.category,
        slug,
      } as Partial<Project> & { titleEn: string; category: string });

      setIsEditing(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] tracking-tight">
            Projects & Case Studies
          </h2>
          <p className="text-xs sm:text-sm text-[#A7B2C8] mt-1">
            Manage public portfolio showcases, draft case studies, and transparency tags.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors shadow-md shadow-[#6C9BFF]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Controls Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121A2B] border border-[#29354B]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A7B2C8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] placeholder-[#A7B2C8]/50 focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          {(['all', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-[#6C9BFF] text-white'
                  : 'bg-[#18243A] border border-[#29354B] text-[#A7B2C8] hover:text-[#F5F7FC]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table / List */}
      <div className="rounded-2xl bg-[#121A2B] border border-[#29354B] overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-[#A7B2C8] space-y-2">
            <Layers className="w-10 h-10 mx-auto text-[#A7B2C8]/50" />
            <p className="text-sm font-semibold text-[#F5F7FC]">No projects match your filter.</p>
            <p className="text-xs">Create a new project or adjust your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#18243A] text-[#A7B2C8] uppercase font-bold text-[11px] tracking-wider border-b border-[#29354B]">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29354B]/70">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-[#18243A]/40 transition-colors">
                    {/* Project Title & Slug */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#0B1020] border border-[#29354B] shrink-0">
                          <img
                            src={project.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-[#F5F7FC]">{project.titleEn}</div>
                          <div className="text-[11px] text-[#A7B2C8] font-mono">
                            /{project.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-[#A7B2C8]">
                      <span className="px-2 py-0.5 rounded bg-[#18243A] text-[11px] font-medium border border-[#29354B]">
                        {project.category}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      {project.isPractice ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E5B54F]/15 text-[#E5B54F] border border-[#E5B54F]/30">
                          Concept Study
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#52C481]/15 text-[#52C481] border border-[#52C481]/30">
                          Client Case
                        </span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleProjectPublish(project.id, project.status !== 'published')}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase transition-all ${
                          project.status === 'published'
                            ? 'bg-[#52C481]/20 text-[#52C481] border border-[#52C481]/40 hover:bg-[#52C481]/30'
                            : 'bg-[#E5B54F]/20 text-[#E5B54F] border border-[#E5B54F]/40 hover:bg-[#E5B54F]/30'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {project.status}
                      </button>
                    </td>

                    {/* Display Order */}
                    <td className="py-3.5 px-4 font-mono text-[#A7B2C8]">
                      #{project.displayOrder}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDuplicate(project)}
                          className="p-1.5 rounded-lg bg-[#18243A] text-[#A7B2C8] hover:text-[#6C9BFF] hover:border-[#6C9BFF]/40 border border-[#29354B]"
                          title="Duplicate Project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 rounded-lg bg-[#18243A] text-[#A7B2C8] hover:text-[#6C9BFF] hover:border-[#6C9BFF]/40 border border-[#29354B]"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(project.id)}
                          className="p-1.5 rounded-lg bg-[#18243A] text-[#A7B2C8] hover:text-[#E05252] hover:border-[#E05252]/40 border border-[#29354B]"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Project Modal Form */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#0B1020]/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={() => setIsEditing(false)} />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#121A2B] border border-[#29354B] p-6 sm:p-8 space-y-6 z-10 text-left shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#29354B]">
              <h3 className="text-xl font-bold text-[#F5F7FC]">
                {editingProject.id ? 'Edit Case Study' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl text-[#A7B2C8] hover:text-[#F5F7FC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-[#E05252]/10 border border-[#E05252]/40 text-xs text-[#E05252] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              {/* Titles EN / BN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F7FC]">
                    Project Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.titleEn || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      setEditingProject({
                        ...editingProject,
                        titleEn: title,
                        slug: editingProject.slug ? editingProject.slug : generateSlug(title),
                      });
                    }}
                    placeholder="e.g. Nexus Pay — Mobile Banking"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F7FC]">
                    Project Title (Bengali)
                  </label>
                  <input
                    type="text"
                    value={editingProject.titleBn || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, titleBn: e.target.value })}
                    placeholder="e.g. নেক্সাস পে — মোবাইল ব্যাংকিং"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                  />
                </div>
              </div>

              {/* Slug & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F7FC]">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingProject.slug || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: generateSlug(e.target.value) })}
                    placeholder="nexus-pay-mobile-banking"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm font-mono text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F7FC]">
                    Service Category *
                  </label>
                  <select
                    value={editingProject.category || categories[0]}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover Image & File Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#F5F7FC]">
                    Cover Image
                  </label>
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="flex items-center gap-1.5 text-xs text-[#6C9BFF] hover:underline font-semibold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingCover ? 'Optimizing...' : 'Upload Image File'}</span>
                  </button>
                </div>

                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  {editingProject.coverImage && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#0B1020] border border-[#29354B] shrink-0">
                      <img
                        src={editingProject.coverImage}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={editingProject.coverImage || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                    placeholder="Paste image URL or click 'Upload Image File' above..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                  />
                </div>
              </div>

              {/* Short Descriptions EN / BN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F7FC]">
                    Short Summary (English)
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.shortDescEn || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, shortDescEn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F7FC]">
                    Short Summary (Bengali)
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.shortDescBn || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, shortDescBn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                  />
                </div>
              </div>

              {/* Tools (comma separated) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F7FC]">
                  Tools & Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={editingProject.tools?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="React, TypeScript, Tailwind CSS, Figma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                />
              </div>

              {/* Challenge & Solution */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F7FC]">
                    Problem / Challenge Statement
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.challengeEn || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, challengeEn: e.target.value })}
                    placeholder="Describe the problem, audience constraints, or friction points..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F7FC]">
                    Strategy & Technical Solution
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.solutionEn || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, solutionEn: e.target.value })}
                    placeholder="Detail the architecture, UX decisions, or automation approach..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F7FC]">
                    Outcome & Observations
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.outcomeEn || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, outcomeEn: e.target.value })}
                    placeholder="Verified design artifacts, code test results, or lessons learned..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC]"
                  />
                </div>
              </div>

              {/* Demo URL & Source URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F7FC]">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.liveDemoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F7FC]">
                    Source Code URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.sourceUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, sourceUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs text-[#F5F7FC]"
                  />
                </div>
              </div>

              {/* Checkboxes: Status, Concept Study, Featured */}
              <div className="p-4 rounded-xl bg-[#18243A] border border-[#29354B] grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#F5F7FC]">
                  <input
                    type="checkbox"
                    checked={editingProject.status === 'published'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        status: e.target.checked ? 'published' : 'draft',
                      })
                    }
                    className="rounded text-[#6C9BFF] focus:ring-[#6C9BFF]"
                  />
                  <span>Published on Public Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#F5F7FC]">
                  <input
                    type="checkbox"
                    checked={!!editingProject.isPractice}
                    onChange={(e) => setEditingProject({ ...editingProject, isPractice: e.target.checked })}
                    className="rounded text-[#6C9BFF] focus:ring-[#6C9BFF]"
                  />
                  <span>Concept Study Tag</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#F5F7FC]">
                  <input
                    type="checkbox"
                    checked={!!editingProject.isFeatured}
                    onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                    className="rounded text-[#6C9BFF] focus:ring-[#6C9BFF]"
                  />
                  <span>Featured Showcase</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#29354B]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-[#29354B] text-xs sm:text-sm font-semibold text-[#A7B2C8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors disabled:opacity-50"
                >
                  {saveLoading ? 'Saving...' : 'Save Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-[#121A2B] border border-[#29354B] p-6 space-y-4 z-10 text-left shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-[#E05252]/15 text-[#E05252] flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F5F7FC]">Confirm Project Deletion</h3>
            <p className="text-xs text-[#A7B2C8] leading-relaxed">
              Are you sure you want to delete this case study? This action will permanently remove it from Firestore.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-[#29354B] text-xs font-semibold text-[#A7B2C8]"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteProject(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#E05252] text-white text-xs font-semibold hover:bg-[#c93f3f] transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
