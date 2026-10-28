import React from 'react';
import { useData } from '../../context/DataContext';
import { calculateDashboardStats } from '../../utils/logic';
import {
  FolderGit2,
  Sparkles,
  Inbox,
  FileCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { projects, services, inquiries, activityLogs, updateInquiryStatus } = useData();

  const publishedServicesCount = services.filter((s) => s.isPublished).length;
  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'unread').length;

  const stats = calculateDashboardStats(
    projects.map((p) => ({
      id: p.id,
      titleEn: p.titleEn,
      category: p.category,
      status: p.status,
      isFeatured: p.isFeatured,
      displayOrder: p.displayOrder,
    })),
    publishedServicesCount,
    unreadInquiriesCount
  );

  const recentInquiries = inquiries.slice(0, 5);
  const recentLogs = activityLogs.slice(0, 5);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-xs sm:text-sm text-[#A7B2C8] mt-1">
            Real-time portfolio metrics, publication status, and incoming client inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('projects')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors shadow-md shadow-[#6C9BFF]/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Projects */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-2">
          <div className="flex items-center justify-between text-[#A7B2C8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Projects</span>
            <FolderGit2 className="w-5 h-5 text-[#6C9BFF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F5F7FC]">
            {stats.totalProjects}
          </div>
          <div className="text-[11px] text-[#A7B2C8] flex items-center gap-2">
            <span className="text-[#52C481] font-semibold">{stats.publishedProjects} Published</span>
            <span>•</span>
            <span className="text-[#E5B54F] font-semibold">{stats.draftProjects} Drafts</span>
          </div>
        </div>

        {/* Active Services */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-2">
          <div className="flex items-center justify-between text-[#A7B2C8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Services</span>
            <Sparkles className="w-5 h-5 text-[#6C9BFF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F5F7FC]">
            {stats.activeServicesCount} / 5
          </div>
          <div className="text-[11px] text-[#A7B2C8]">
            Disciplines offered to clients
          </div>
        </div>

        {/* Unread Inquiries */}
        <div
          onClick={() => onNavigateTab('inquiries')}
          className="p-5 sm:p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-2 cursor-pointer hover:border-[#6C9BFF]/60 transition-colors"
        >
          <div className="flex items-center justify-between text-[#A7B2C8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Client Inquiries</span>
            <Inbox className="w-5 h-5 text-[#6C9BFF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F5F7FC]">
            {stats.unreadInquiriesCount}
          </div>
          <div className="text-[11px] text-[#A7B2C8]">
            {stats.unreadInquiriesCount > 0 ? (
              <span className="text-[#6C9BFF] font-semibold">Requires your review</span>
            ) : (
              <span>All inquiries cleared</span>
            )}
          </div>
        </div>

        {/* Concept / Practice Transparency */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-2">
          <div className="flex items-center justify-between text-[#A7B2C8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Truth In Portfolio</span>
            <FileCheck className="w-5 h-5 text-[#52C481]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#52C481]">
            100%
          </div>
          <div className="text-[11px] text-[#A7B2C8]">
            Zero fabricated client stats
          </div>
        </div>
      </div>

      {/* Main Two-Column Content: Inquiries & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Client Inquiries */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#F5F7FC] flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#6C9BFF]" />
              <span>Incoming Project Inquiries</span>
            </h3>
            <button
              onClick={() => onNavigateTab('inquiries')}
              className="text-xs text-[#6C9BFF] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl bg-[#121A2B] border border-[#29354B] overflow-hidden">
            {recentInquiries.length === 0 ? (
              <div className="p-8 text-center text-[#A7B2C8] text-xs space-y-2">
                <Inbox className="w-8 h-8 mx-auto text-[#A7B2C8]/50" />
                <p>No project inquiries submitted yet.</p>
                <p className="text-[11px] text-[#A7B2C8]/70">
                  Submissions through the public contact form appear here immediately.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#29354B]/70">
                {recentInquiries.map((inq) => (
                  <div key={inq.id} className="p-4 sm:p-5 hover:bg-[#18243A]/40 transition-colors space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-sm text-[#F5F7FC]">{inq.name}</span>
                        {inq.company && (
                          <span className="text-xs text-[#A7B2C8] ml-2">({inq.company})</span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          inq.status === 'unread'
                            ? 'bg-[#6C9BFF]/20 text-[#6C9BFF] border border-[#6C9BFF]/40'
                            : inq.status === 'read'
                            ? 'bg-[#52C481]/20 text-[#52C481]'
                            : 'bg-[#A7B2C8]/20 text-[#A7B2C8]'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#A7B2C8] line-clamp-2">
                      {inq.projectDescription}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A7B2C8]/70 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#18243A] text-[#F5F7FC]">
                          {inq.serviceRequested}
                        </span>
                        <span>•</span>
                        <span>{inq.budgetRange}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {inq.status === 'unread' && (
                          <button
                            onClick={() => updateInquiryStatus(inq.id, 'read')}
                            className="text-[#6C9BFF] hover:underline font-semibold"
                          >
                            Mark Read
                          </button>
                        )}
                        <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Shortcuts & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Actions */}
          <div className="rounded-2xl bg-[#121A2B] border border-[#29354B] p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A7B2C8]">
              Quick Management Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigateTab('profile')}
                className="p-3 rounded-xl bg-[#18243A] border border-[#29354B] text-xs font-semibold text-left hover:border-[#6C9BFF]/60 hover:text-[#6C9BFF] transition-colors flex items-center justify-between"
              >
                <span>Edit Profile & Photo</span>
                <span className="text-[10px] text-[#6C9BFF]">Hero</span>
              </button>
              <button
                onClick={() => onNavigateTab('projects')}
                className="p-3 rounded-xl bg-[#18243A] border border-[#29354B] text-xs font-semibold text-left hover:border-[#6C9BFF]/60 hover:text-[#6C9BFF] transition-colors"
              >
                + Add Project
              </button>
              <button
                onClick={() => onNavigateTab('services')}
                className="p-3 rounded-xl bg-[#18243A] border border-[#29354B] text-xs font-semibold text-left hover:border-[#6C9BFF]/60 hover:text-[#6C9BFF] transition-colors"
              >
                Manage Services
              </button>
              <button
                onClick={() => onNavigateTab('seo')}
                className="p-3 rounded-xl bg-[#18243A] border border-[#29354B] text-xs font-semibold text-left hover:border-[#6C9BFF]/60 hover:text-[#6C9BFF] transition-colors"
              >
                SEO & OpenGraph
              </button>
            </div>
          </div>

          {/* Activity Log Preview */}
          <div className="rounded-2xl bg-[#121A2B] border border-[#29354B] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#A7B2C8]">
                Recent Audit Trail
              </h4>
              <button
                onClick={() => onNavigateTab('activity')}
                className="text-xs text-[#6C9BFF] hover:underline"
              >
                History
              </button>
            </div>

            {recentLogs.length === 0 ? (
              <p className="text-xs text-[#A7B2C8]/70 py-4 text-center">
                No recent activity recorded.
              </p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="text-xs space-y-1 pb-2 border-b border-[#29354B]/50 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#F5F7FC]">{log.action}</span>
                      <span className="text-[10px] text-[#A7B2C8]">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[#A7B2C8] line-clamp-1">{log.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
