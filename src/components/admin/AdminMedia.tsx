import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { compressAndResizeImage } from '../../utils/imageCompressor';
import {
  Image as ImageIcon,
  Plus,
  Check,
  Copy,
  ExternalLink,
  Trash2,
  AlertCircle,
  Upload,
} from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const { projects } = useData();

  // Curated list of verified, high-resolution portfolio assets
  const [mediaList, setMediaList] = useState<Array<{ id: string; url: string; title: string; category: string }>>([
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
      title: 'Mobile Banking & Fintech Concept Cover',
      category: 'UI/UX Design',
    },
    {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
      title: 'Enterprise SaaS Dashboard Mockup',
      category: 'Website Development',
    },
    {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1000&q=80',
      title: 'Email Copy & Typography Canvas',
      category: 'Email Copywriting',
    },
    {
      id: 'img-4',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      title: 'Workflow Automation & Data Mesh',
      category: 'AI Automation',
    },
    {
      id: 'img-5',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
      title: 'Analytical Data Visualization',
      category: 'UI/UX Design',
    },
    {
      id: 'img-6',
      url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
      title: 'Modern Responsive Web Layout',
      category: 'Website Design',
    },
  ]);

  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressed = await compressAndResizeImage(file, 1000, 750, 0.82);
      const item = {
        id: `media-${Date.now()}`,
        url: compressed.dataUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Uploaded Asset',
      };
      setMediaList([item, ...mediaList]);
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const item = {
      id: `media-${Date.now()}`,
      url: newUrl.trim(),
      title: newTitle.trim() || 'Custom Project Asset',
      category: 'General',
    };
    setMediaList([item, ...mediaList]);
    setNewUrl('');
    setNewTitle('');
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = (id: string) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] tracking-tight">
            Media & Image Library
          </h2>
          <p className="text-xs sm:text-sm text-[#A7B2C8] mt-1">
            Curate, validate, and copy verified image assets and case study screenshots.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors shadow-md shadow-[#6C9BFF]/20"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Processing Image...' : 'Upload Image File'}</span>
          </button>
        </div>
      </div>

      {/* Free-First Storage Notice */}
      <div className="p-4 rounded-2xl bg-[#18243A]/60 border border-[#29354B] flex items-start gap-3 text-xs text-[#A7B2C8] leading-relaxed">
        <AlertCircle className="w-5 h-5 text-[#6C9BFF] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#F5F7FC]">Optimized Storage:</strong> Uploaded images are automatically compressed and resized for high-performance rendering with minimal storage footprint.
        </div>
      </div>

      {/* Add New Media Form */}
      <form onSubmit={handleAddMedia} className="p-5 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-4">
        <h3 className="text-sm font-bold text-[#F5F7FC] flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#6C9BFF]" />
          <span>Add External Image Asset URL</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <input
              type="url"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Paste HTTPS image URL (e.g. Unsplash, CDN, or Cloud Storage)..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
            />
          </div>
          <div className="sm:col-span-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Image title or alt description..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors"
            >
              Add Asset
            </button>
          </div>
        </div>
      </form>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaList.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-[#121A2B] border border-[#29354B] overflow-hidden group space-y-3 p-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0B1020] border border-[#29354B]/80">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="px-1">
                <h4 className="text-xs font-bold text-[#F5F7FC] truncate">{item.title}</h4>
                <p className="text-[11px] text-[#A7B2C8] truncate font-mono mt-0.5">{item.url}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#29354B]/70">
              <button
                onClick={() => handleCopy(item.id, item.url)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  copiedId === item.id
                    ? 'bg-[#52C481]/20 text-[#52C481]'
                    : 'bg-[#18243A] text-[#A7B2C8] hover:text-[#6C9BFF]'
                }`}
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-[#18243A] text-[#A7B2C8] hover:text-[#F5F7FC]"
                title="Open image in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg bg-[#18243A] text-[#A7B2C8] hover:text-[#E05252]"
                title="Remove from library"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
