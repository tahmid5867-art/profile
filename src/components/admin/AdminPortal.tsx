import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminProjects } from './AdminProjects';
import { AdminServices } from './AdminServices';
import { AdminContent } from './AdminContent';
import { AdminMedia } from './AdminMedia';
import { AdminInquiries } from './AdminInquiries';
import { AdminSeo } from './AdminSeo';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminActivity } from './AdminActivity';
import { AdminProfile } from './AdminProfile';

export const AdminPortal: React.FC = () => {
  const { currentUser, isAdmin, loading } = useAuth();
  const { pathname, navigate } = useRouter();

  // Derive initial tab from path e.g. /admin/projects -> 'projects'
  const getTabFromPath = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return parts[1];
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromPath);

  useEffect(() => {
    const tab = getTabFromPath();
    setActiveTab(tab);
  }, [pathname]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    navigate(`/admin/${newTab}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] text-[#F5F7FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#6C9BFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#A7B2C8]">Verifying administrative credentials...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or not an admin -> show AdminLogin with clear instructions
  if (!currentUser || !isAdmin) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={handleTabChange} />}
      {activeTab === 'profile' && <AdminProfile />}
      {activeTab === 'projects' && <AdminProjects />}
      {activeTab === 'services' && <AdminServices />}
      {activeTab === 'content' && <AdminContent />}
      {activeTab === 'media' && <AdminMedia />}
      {activeTab === 'inquiries' && <AdminInquiries />}
      {activeTab === 'seo' && <AdminSeo />}
      {activeTab === 'analytics' && <AdminAnalytics />}
      {activeTab === 'activity' && <AdminActivity />}
    </AdminLayout>
  );
};
