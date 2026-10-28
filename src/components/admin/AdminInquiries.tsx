import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Inquiry } from '../../types';
import {
  Inbox,
  Search,
  CheckCircle2,
  Archive,
  Trash2,
  Mail,
  Building2,
  Calendar,
  Languages,
  DollarSign,
  AlertCircle,
  X,
  PhoneCall,
} from 'lucide-react';

export const AdminInquiries: React.FC = () => {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useData();

  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        (inq.company && inq.company.toLowerCase().includes(q)) ||
        inq.serviceRequested.toLowerCase().includes(q) ||
        inq.projectDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelectInquiry = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    if (inq.status === 'unread') {
      updateInquiryStatus(inq.id, 'read');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] tracking-tight">
            Client Inquiries Manager
          </h2>
          <p className="text-xs sm:text-sm text-[#A7B2C8] mt-1">
            Private inquiries received securely through the public project initiation form.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121A2B] border border-[#29354B]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A7B2C8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, company..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] placeholder-[#A7B2C8]/50 focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          {(['all', 'unread', 'read', 'archived'] as const).map((st) => (
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

      {/* Main Two-Pane View: List on left, Details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Inquiries List */}
        <div className="lg:col-span-5 rounded-2xl bg-[#121A2B] border border-[#29354B] overflow-hidden max-h-[750px] overflow-y-auto">
          {filteredInquiries.length === 0 ? (
            <div className="p-12 text-center text-[#A7B2C8] space-y-2">
              <Inbox className="w-10 h-10 mx-auto text-[#A7B2C8]/50" />
              <p className="text-sm font-semibold text-[#F5F7FC]">No inquiries match this criteria.</p>
              <p className="text-xs">Adjust your status filter or search query.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#29354B]/70">
              {filteredInquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => handleSelectInquiry(inq)}
                    className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                      isSelected
                        ? 'bg-[#18243A] border-l-4 border-l-[#6C9BFF]'
                        : 'hover:bg-[#18243A]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {inq.status === 'unread' && (
                          <span className="w-2 h-2 rounded-full bg-[#6C9BFF] shrink-0" />
                        )}
                        <span className="font-bold text-sm text-[#F5F7FC]">{inq.name}</span>
                      </div>
                      <span className="text-[10px] text-[#A7B2C8]">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs text-[#6C9BFF] font-medium">
                      {inq.serviceRequested}
                    </div>

                    <p className="text-xs text-[#A7B2C8] line-clamp-2">
                      {inq.projectDescription}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Inquiry Detail */}
        <div className="lg:col-span-7 rounded-2xl bg-[#121A2B] border border-[#29354B] p-6 sm:p-8 space-y-6">
          {selectedInquiry ? (
            <div className="space-y-6">
              {/* Header Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#29354B]">
                <div>
                  <h3 className="text-xl font-bold text-[#F5F7FC]">{selectedInquiry.name}</h3>
                  <div className="text-xs text-[#A7B2C8] flex items-center gap-2 mt-1">
                    <Mail className="w-3.5 h-3.5 text-[#6C9BFF]" />
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-[#6C9BFF] hover:underline"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedInquiry.status === 'unread' ? (
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'read')}
                      className="px-3 py-1.5 rounded-lg bg-[#18243A] text-xs font-semibold text-[#52C481] border border-[#29354B] hover:bg-[#52C481]/15"
                    >
                      Mark Read
                    </button>
                  ) : (
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'unread')}
                      className="px-3 py-1.5 rounded-lg bg-[#18243A] text-xs font-semibold text-[#A7B2C8] border border-[#29354B] hover:text-[#F5F7FC]"
                    >
                      Mark Unread
                    </button>
                  )}

                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'archived')}
                    className="p-2 rounded-lg bg-[#18243A] text-xs text-[#A7B2C8] border border-[#29354B] hover:text-[#6C9BFF]"
                    title="Archive inquiry"
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(selectedInquiry.id)}
                    className="p-2 rounded-lg bg-[#18243A] text-xs text-[#E05252] border border-[#29354B] hover:bg-[#E05252]/15"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inquiry Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#18243A] border border-[#29354B]">
                  <div className="text-[10px] text-[#A7B2C8] uppercase tracking-wider font-semibold">Service</div>
                  <div className="text-xs font-bold text-[#F5F7FC] mt-1">{selectedInquiry.serviceRequested}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#18243A] border border-[#29354B]">
                  <div className="text-[10px] text-[#A7B2C8] uppercase tracking-wider font-semibold">Budget Range</div>
                  <div className="text-xs font-bold text-[#6C9BFF] mt-1">{selectedInquiry.budgetRange || 'Flexible'}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#18243A] border border-[#29354B]">
                  <div className="text-[10px] text-[#A7B2C8] uppercase tracking-wider font-semibold">Company</div>
                  <div className="text-xs font-bold text-[#F5F7FC] mt-1">{selectedInquiry.company || 'Individual'}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#18243A] border border-[#29354B]">
                  <div className="text-[10px] text-[#A7B2C8] uppercase tracking-wider font-semibold">Language</div>
                  <div className="text-xs font-bold text-[#F5F7FC] mt-1 uppercase">{selectedInquiry.preferredLanguage}</div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#A7B2C8]">
                  Project Description & Vision:
                </div>
                <div className="p-4 rounded-xl bg-[#0B1020] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] leading-relaxed whitespace-pre-line">
                  {selectedInquiry.projectDescription}
                </div>
              </div>

              {/* Direct Reply Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#29354B]">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding Your Project Inquiry (${encodeURIComponent(selectedInquiry.serviceRequested)})`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C9BFF] text-white text-xs sm:text-sm font-semibold hover:bg-[#5084f0] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-[#A7B2C8] space-y-2">
              <Inbox className="w-10 h-10 mx-auto text-[#A7B2C8]/50" />
              <p className="text-sm font-semibold text-[#F5F7FC]">No Inquiry Selected</p>
              <p className="text-xs">Click on any inquiry from the left panel to inspect details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-2xl bg-[#121A2B] border border-[#29354B] p-6 space-y-4 text-left shadow-2xl">
            <h3 className="text-base font-bold text-[#F5F7FC]">Permanently Delete Inquiry?</h3>
            <p className="text-xs text-[#A7B2C8]">This will permanently remove the submission record from Cloud Firestore.</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg border border-[#29354B] text-xs text-[#A7B2C8]"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteInquiry(deleteConfirmId);
                  if (selectedInquiry?.id === deleteConfirmId) {
                    setSelectedInquiry(null);
                  }
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
