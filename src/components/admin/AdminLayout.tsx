import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  FolderGit2,
  Sparkles,
  FileEdit,
  Image,
  Inbox,
  Search,
  BarChart3,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
  Database,
  Check,
  User,
} from 'lucide-react';

interface AdminLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  const { currentUser, isAdmin, signOut, loading } = useAuth();
  const { navigate } = useRouter();
  const { inquiries, seedInitialDataToFirestore } = useData();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'unread').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Bio', icon: User },
    { id: 'projects', label: 'Projects & Case Studies', icon: FolderGit2 },
    { id: 'services', label: 'Services', icon: Sparkles },
    { id: 'content', label: 'Website Content', icon: FileEdit },
    { id: 'media', label: 'Media Library', icon: Image },
    {
      id: 'inquiries',
      label: 'Inquiries',
      icon: Inbox,
      badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : undefined,
    },
    { id: 'seo', label: 'SEO & Metadata', icon: Search },
    { id: 'analytics', label: 'Data & Analytics', icon: BarChart3 },
    { id: 'activity', label: 'Activity Log', icon: History },
  ];

  const handleSeed = async () => {
    if (!confirm('Bootstrap Firestore with initial verified services, projects, and site settings?')) return;
    setSeeding(true);
    try {
      await seedInitialDataToFirestore();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 4000);
    } catch (err) {
      console.error('Seed error:', err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#0B1020] text-[#F5F7FC] flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[#29354B] bg-[#121A2B] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6C9BFF] flex items-center justify-center font-bold text-white text-sm">
            A
          </div>
          <span className="font-bold text-base">Admin Studio</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-[#18243A] text-xs text-[#A7B2C8]"
            title="Public Site"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded-lg bg-[#18243A] text-[#F5F7FC]"
            aria-label="Toggle navigation"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebar for Desktop & Mobile Overlay with dedicated scrollbar */}
      <aside
        className={`fixed md:static top-0 z-40 h-full w-72 bg-[#121A2B] border-r border-[#29354B] flex flex-col justify-between p-5 shrink-0 overflow-y-auto transition-transform duration-200 ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#29354B]/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C9BFF] to-[#3B62D1] flex items-center justify-center text-white font-bold shadow-md">
                <span>A</span>
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-tight text-[#F5F7FC]">Admin Console</h1>
                <p className="text-[11px] text-[#6C9BFF] font-mono">Tahmid Portfolio v2</p>
              </div>
            </div>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="md:hidden text-[#A7B2C8] hover:text-[#F5F7FC]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#6C9BFF] text-white shadow-md shadow-[#6C9BFF]/20 font-semibold'
                      : 'text-[#A7B2C8] hover:bg-[#18243A] hover:text-[#F5F7FC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white text-[#6C9BFF]' : 'bg-[#6C9BFF] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-4 border-t border-[#29354B]/80 text-left">
          {/* Seed Initial Data Button */}
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#18243A] border border-[#29354B] text-[11px] font-medium text-[#A7B2C8] hover:text-[#6C9BFF] hover:border-[#6C9BFF]/40 transition-colors disabled:opacity-50"
            title="Bootstrap initial sample services and concept studies to Firestore"
          >
            {seedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#52C481]" />
                <span className="text-[#52C481]">Firestore Synchronized!</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-[#6C9BFF]" />
                <span>{seeding ? 'Syncing...' : 'Bootstrap Firestore Data'}</span>
              </>
            )}
          </button>

          {/* User info */}
          <div className="p-3 rounded-xl bg-[#0B1020]/70 border border-[#29354B] space-y-1">
            <div className="text-[11px] text-[#A7B2C8]">Signed in as:</div>
            <div className="text-xs font-semibold text-[#F5F7FC] truncate" title={currentUser?.email || ''}>
              {currentUser?.email || 'admin@studio.com'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#18243A] border border-[#29354B] text-xs font-medium text-[#A7B2C8] hover:text-[#F5F7FC] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>

            <button
              onClick={() => signOut()}
              className="p-2 rounded-xl bg-[#18243A] border border-[#29354B] text-[#E05252] hover:bg-[#E05252]/10 transition-colors"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area with dedicated momentum scrolling */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 lg:p-10 w-full min-h-0">
        <div className="max-w-7xl mx-auto pb-12">
          {children}
        </div>
      </main>
    </div>
  );
};
