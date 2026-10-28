/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { testFirestoreConnection } from './firebase/config';

import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { Credibility } from './components/public/Credibility';
import { ServicesSection } from './components/public/ServicesSection';
import { ProjectsSection } from './components/public/ProjectsSection';
import { AboutSection } from './components/public/AboutSection';
import { WorkProcess } from './components/public/WorkProcess';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { AdminPortal } from './components/admin/AdminPortal';
import { ArrowLeft, Home } from 'lucide-react';

const MainContent: React.FC = () => {
  const { pathname, navigate } = useRouter();
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Validate Firestore connection on boot
    testFirestoreConnection();
  }, []);

  // Admin route check
  if (pathname.startsWith('/admin')) {
    return <AdminPortal />;
  }

  // Public Portfolio Homepage for all other paths (including /, /index.html, /#section, etc.)
  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FC] flex flex-col selection:bg-[#6C9BFF]/30 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Credibility />
        <ServicesSection onSelectServiceForInquiry={(s) => setSelectedService(s)} />
        <ProjectsSection />
        <AboutSection />
        <WorkProcess />
        <ContactSection preselectedService={selectedService} />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <DataProvider>
          <RouterProvider>
            <MainContent />
          </RouterProvider>
        </DataProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
