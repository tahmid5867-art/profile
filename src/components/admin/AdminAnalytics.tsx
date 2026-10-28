import React from 'react';
import { useData } from '../../context/DataContext';
import {
  BarChart3,
  PieChart,
  Inbox,
  Sparkles,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { inquiries, projects, services } = useData();

  // Aggregate genuine inquiry counts by discipline
  const serviceDistribution: Record<string, number> = {};
  const budgetDistribution: Record<string, number> = {};

  for (const inq of inquiries) {
    const srv = inq.serviceRequested || 'Unspecified';
    serviceDistribution[srv] = (serviceDistribution[srv] || 0) + 1;

    const bgt = inq.budgetRange || 'Flexible';
    budgetDistribution[bgt] = (budgetDistribution[bgt] || 0) + 1;
  }

  const publishedProjectsCount = projects.filter((p) => p.status === 'published').length;
  const draftProjectsCount = projects.filter((p) => p.status === 'draft').length;

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] tracking-tight">
          Data & Inquiries Analytics
        </h2>
        <p className="text-xs sm:text-sm text-[#A7B2C8] mt-1">
          Truthful portfolio demand metrics computed directly from Cloud Firestore records.
        </p>
      </div>

      {/* Transparency Banner on Analytics */}
      <div className="p-4 rounded-2xl bg-[#18243A]/80 border border-[#29354B] flex items-start gap-3 text-xs text-[#A7B2C8] leading-relaxed">
        <Info className="w-5 h-5 text-[#6C9BFF] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#F5F7FC]">Authentic Data Integrity:</strong> This dashboard displays actual stored database interactions (inquiries received, discipline demand, and publication metrics). We deliberately do not fabricate arbitrary web traffic or visitor graphs. If you configure a production Firebase Measurement ID, live web traffic analytics can be connected with GDPR/cookie consent controls.
        </div>
      </div>

      {/* High-level metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-1">
          <div className="text-xs text-[#A7B2C8] uppercase tracking-wider font-semibold">Total Inquiries</div>
          <div className="text-3xl font-black text-[#F5F7FC]">{inquiries.length}</div>
          <div className="text-[11px] text-[#A7B2C8]">All-time submissions</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-1">
          <div className="text-xs text-[#A7B2C8] uppercase tracking-wider font-semibold">Unread Inquiries</div>
          <div className="text-3xl font-black text-[#6C9BFF]">
            {inquiries.filter((i) => i.status === 'unread').length}
          </div>
          <div className="text-[11px] text-[#A7B2C8]">Pending response</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-1">
          <div className="text-xs text-[#A7B2C8] uppercase tracking-wider font-semibold">Live Case Studies</div>
          <div className="text-3xl font-black text-[#52C481]">{publishedProjectsCount}</div>
          <div className="text-[11px] text-[#A7B2C8]">Publicly visible</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-1">
          <div className="text-xs text-[#A7B2C8] uppercase tracking-wider font-semibold">Draft Studies</div>
          <div className="text-3xl font-black text-[#E5B54F]">{draftProjectsCount}</div>
          <div className="text-[11px] text-[#A7B2C8]">Private in progress</div>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discipline Demand */}
        <div className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FC] flex items-center gap-2 border-b border-[#29354B] pb-3">
            <PieChart className="w-4 h-4 text-[#6C9BFF]" />
            <span>Client Demand by Discipline</span>
          </h3>

          {Object.keys(serviceDistribution).length === 0 ? (
            <div className="py-10 text-center text-xs text-[#A7B2C8]">
              No inquiry submissions recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(serviceDistribution).map(([serviceName, count]) => {
                const percent = Math.round((count / inquiries.length) * 100);
                return (
                  <div key={serviceName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F5F7FC]">{serviceName}</span>
                      <span className="text-[#A7B2C8]">{count} inquiries ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#18243A] overflow-hidden">
                      <div
                        className="h-full bg-[#6C9BFF] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Budget Distribution */}
        <div className="p-6 rounded-2xl bg-[#121A2B] border border-[#29354B] space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FC] flex items-center gap-2 border-b border-[#29354B] pb-3">
            <BarChart3 className="w-4 h-4 text-[#52C481]" />
            <span>Budget Tier Distribution</span>
          </h3>

          {Object.keys(budgetDistribution).length === 0 ? (
            <div className="py-10 text-center text-xs text-[#A7B2C8]">
              No budget selections recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(budgetDistribution).map(([budgetRange, count]) => {
                const percent = Math.round((count / inquiries.length) * 100);
                return (
                  <div key={budgetRange} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F5F7FC]">{budgetRange}</span>
                      <span className="text-[#A7B2C8]">{count} ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#18243A] overflow-hidden">
                      <div
                        className="h-full bg-[#52C481] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
