import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import {
  SiteSettings,
  Profile,
  Service,
  Project,
  Inquiry,
  ActivityLog,
} from '../types';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_PROFILE,
  INITIAL_SERVICES,
  INITIAL_PROJECTS,
} from '../firebase/seed';
import { useAuth } from './AuthContext';
import { validateInquiry, InquiryInput } from '../utils/logic';

interface DataContextType {
  siteSettings: SiteSettings;
  profile: Profile;
  services: Service[];
  projects: Project[];
  inquiries: Inquiry[];
  activityLogs: ActivityLog[];
  loading: boolean;
  dbError: string | null;
  // Mutations
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  saveProject: (project: Partial<Project> & { titleEn: string; category: string }) => Promise<string>;
  toggleProjectPublish: (projectId: string, publish: boolean) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  saveService: (service: Partial<Service> & { titleEn: string; category: string }) => Promise<string>;
  deleteService: (serviceId: string) => Promise<void>;
  submitInquiry: (input: InquiryInput) => Promise<{ success: boolean; message?: string; errors?: Record<string, string> }>;
  updateInquiryStatus: (inquiryId: string, status: 'unread' | 'read' | 'archived') => Promise<void>;
  deleteInquiry: (inquiryId: string) => Promise<void>;
  seedInitialDataToFirestore: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Log admin activity helper
  const logActivity = useCallback(async (action: string, resourceType: string, resourceId: string, details: string) => {
    try {
      const logEntry: Omit<ActivityLog, 'id'> = {
        action,
        resourceType,
        resourceId,
        details,
        performedBy: currentUser?.email || 'admin',
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'activityLogs'), logEntry);
    } catch (err) {
      console.warn('Could not record activity log:', err);
    }
  }, [currentUser]);

  // Load Settings & Profile
  useEffect(() => {
    let mounted = true;

    async function loadConfig() {
      try {
        const settingsSnap = await getDoc(doc(db, 'siteSettings', 'general'));
        if (settingsSnap.exists() && mounted) {
          setSiteSettings(settingsSnap.data() as SiteSettings);
        }

        const profileSnap = await getDoc(doc(db, 'profile', 'main'));
        if (profileSnap.exists() && mounted) {
          setProfile(profileSnap.data() as Profile);
        }
      } catch (err) {
        console.warn('Using initial settings/profile default:', err);
      }
    }

    loadConfig();
    return () => {
      mounted = false;
    };
  }, []);

  // Services listener
  useEffect(() => {
    try {
      const q = isAdmin
        ? query(collection(db, 'services'))
        : query(collection(db, 'services'), where('isPublished', '==', true));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Service[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as Service;
              list.push({ ...data, id: d.id });
            });
            list.sort((a, b) => a.displayOrder - b.displayOrder);
            setServices(list);
          } else {
            // Keep default initial services if collection has not been populated
            setServices(INITIAL_SERVICES);
          }
        },
        (error) => {
          console.warn('Services snapshot issue, retaining initial:', error.message);
        }
      );
      return () => unsubscribe();
    } catch {
      // Retain fallback
    }
  }, [isAdmin]);

  // Projects listener
  useEffect(() => {
    try {
      const q = isAdmin
        ? query(collection(db, 'projects'))
        : query(collection(db, 'projects'), where('status', '==', 'published'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Project[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as Project;
              list.push({ ...data, id: d.id });
            });
            list.sort((a, b) => a.displayOrder - b.displayOrder);
            setProjects(list);
          } else {
            setProjects(INITIAL_PROJECTS);
          }
          setLoading(false);
        },
        (error) => {
          console.warn('Projects snapshot issue, retaining initial:', error.message);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, [isAdmin]);

  // Inquiries listener (Admin only)
  useEffect(() => {
    if (!isAdmin) {
      setInquiries([]);
      return;
    }

    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: Inquiry[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as Inquiry;
            list.push({ ...data, id: d.id });
          });
          setInquiries(list);
        },
        (error) => {
          console.warn('Inquiries listener error:', error.message);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('Could not subscribe to inquiries:', err);
    }
  }, [isAdmin]);

  // Activity logs listener (Admin only)
  useEffect(() => {
    if (!isAdmin) {
      setActivityLogs([]);
      return;
    }

    try {
      const q = query(collection(db, 'activityLogs'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: ActivityLog[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as ActivityLog;
            list.push({ ...data, id: d.id });
          });
          setActivityLogs(list);
        },
        (error) => {
          console.warn('Activity logs error:', error.message);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('Could not subscribe to activity logs:', err);
    }
  }, [isAdmin]);

  // Seed Data method
  const seedInitialDataToFirestore = async () => {
    try {
      // 1. Settings
      await setDoc(doc(db, 'siteSettings', 'general'), INITIAL_SITE_SETTINGS);
      setSiteSettings(INITIAL_SITE_SETTINGS);

      // 2. Profile
      await setDoc(doc(db, 'profile', 'main'), INITIAL_PROFILE);
      setProfile(INITIAL_PROFILE);

      // 3. Services
      for (const s of INITIAL_SERVICES) {
        await setDoc(doc(db, 'services', s.id), s);
      }

      // 4. Projects
      for (const p of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', p.id), p);
      }

      await logActivity('BOOTSTRAP_DATABASE', 'system', 'root', 'Populated initial verified data in Cloud Firestore');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'seedInitialData');
    }
  };

  // Update Settings
  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    try {
      const merged = { ...siteSettings, ...updates, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'siteSettings', 'general'), merged);
      setSiteSettings(merged);
      await logActivity('UPDATE_SETTINGS', 'siteSettings', 'general', 'Updated global site branding & contact information');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'siteSettings/general');
    }
  };

  // Update Profile
  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const merged = { ...profile, ...updates, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'profile', 'main'), merged);
      setProfile(merged);
      await logActivity('UPDATE_PROFILE', 'profile', 'main', 'Updated bio, skills, and working approach');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'profile/main');
    }
  };

  // Save Project (create or update)
  const saveProject = async (
    projectData: Partial<Project> & { titleEn: string; category: string }
  ): Promise<string> => {
    try {
      const id = projectData.id || `proj-${Date.now()}`;
      const now = new Date().toISOString();
      const existing = projects.find((p) => p.id === id);

      const record: Project = {
        id,
        titleEn: projectData.titleEn.trim(),
        titleBn: (projectData.titleBn || '').trim(),
        slug: (projectData.slug || id).trim().toLowerCase(),
        shortDescEn: (projectData.shortDescEn || '').trim(),
        shortDescBn: (projectData.shortDescBn || '').trim(),
        category: projectData.category,
        coverImage: projectData.coverImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        gallery: projectData.gallery || [],
        tools: projectData.tools || [],
        roleEn: (projectData.roleEn || '').trim(),
        roleBn: (projectData.roleBn || '').trim(),
        challengeEn: (projectData.challengeEn || '').trim(),
        challengeBn: (projectData.challengeBn || '').trim(),
        solutionEn: (projectData.solutionEn || '').trim(),
        solutionBn: (projectData.solutionBn || '').trim(),
        outcomeEn: (projectData.outcomeEn || '').trim(),
        outcomeBn: (projectData.outcomeBn || '').trim(),
        liveDemoUrl: projectData.liveDemoUrl || '',
        sourceUrl: projectData.sourceUrl || '',
        isFeatured: !!projectData.isFeatured,
        isPractice: projectData.isPractice !== undefined ? projectData.isPractice : true,
        displayOrder: projectData.displayOrder ?? (projects.length + 1),
        status: projectData.status || 'draft',
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        publishedAt: projectData.status === 'published' ? (existing?.publishedAt || now) : undefined,
      };

      await setDoc(doc(db, 'projects', id), record);
      await logActivity(
        existing ? 'UPDATE_PROJECT' : 'CREATE_PROJECT',
        'projects',
        id,
        `${existing ? 'Updated' : 'Created'} project "${record.titleEn}" (${record.status})`
      );
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'projects');
    }
  };

  // Toggle Project Publish
  const toggleProjectPublish = async (projectId: string, publish: boolean) => {
    try {
      const now = new Date().toISOString();
      const updates = {
        status: publish ? ('published' as const) : ('draft' as const),
        updatedAt: now,
        ...(publish ? { publishedAt: now } : {}),
      };
      await updateDoc(doc(db, 'projects', projectId), updates);
      await logActivity(
        publish ? 'PUBLISH_PROJECT' : 'UNPUBLISH_PROJECT',
        'projects',
        projectId,
        `${publish ? 'Published' : 'Unpublished'} project ID: ${projectId}`
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${projectId}`);
    }
  };

  // Delete Project
  const deleteProject = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      await logActivity('DELETE_PROJECT', 'projects', projectId, `Deleted project ID: ${projectId}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${projectId}`);
    }
  };

  // Save Service
  const saveService = async (
    serviceData: Partial<Service> & { titleEn: string; category: string }
  ): Promise<string> => {
    try {
      const id = serviceData.id || `srv-${Date.now()}`;
      const now = new Date().toISOString();

      const record: Service = {
        id,
        titleEn: serviceData.titleEn.trim(),
        titleBn: (serviceData.titleBn || '').trim(),
        shortDescEn: (serviceData.shortDescEn || '').trim(),
        shortDescBn: (serviceData.shortDescBn || '').trim(),
        category: serviceData.category || 'UI/UX Design',
        iconName: serviceData.iconName || 'Layout',
        displayOrder: serviceData.displayOrder ?? (services.length + 1),
        isPublished: serviceData.isPublished !== undefined ? serviceData.isPublished : true,
        ctaTextEn: (serviceData.ctaTextEn || 'Request Scope').trim(),
        ctaTextBn: (serviceData.ctaTextBn || 'প্রস্তাব পাঠান').trim(),
        deliverablesEn: serviceData.deliverablesEn || [],
        deliverablesBn: serviceData.deliverablesBn || [],
        updatedAt: now,
      };

      await setDoc(doc(db, 'services', id), record);
      
      // Optimistic local state update
      setServices((prev) => {
        const withoutCurrent = prev.filter((s) => s.id !== id);
        return [...withoutCurrent, record].sort((a, b) => a.displayOrder - b.displayOrder);
      });

      await logActivity('SAVE_SERVICE', 'services', id, `Saved service "${record.titleEn}"`);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'services');
      throw err;
    }
  };

  // Delete Service
  const deleteService = async (serviceId: string) => {
    try {
      await deleteDoc(doc(db, 'services', serviceId));
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      await logActivity('DELETE_SERVICE', 'services', serviceId, `Deleted service ID: ${serviceId}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `services/${serviceId}`);
      throw err;
    }
  };

  // Submit Inquiry (Public)
  const submitInquiry = async (
    input: InquiryInput
  ): Promise<{ success: boolean; message?: string; errors?: Record<string, string> }> => {
    // 1. Client-side rigorous validation
    const validation = validateInquiry(input);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    try {
      const inquiryId = `inq-${Date.now()}`;
      const payload: Inquiry = {
        id: inquiryId,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        company: (input.company || '').trim(),
        serviceRequested: input.serviceRequested,
        budgetRange: input.budgetRange || 'Flexible',
        projectDescription: input.projectDescription.trim(),
        preferredLanguage: input.preferredLanguage || 'en',
        status: 'unread',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'inquiries', inquiryId), payload);
      return { success: true };
    } catch (err) {
      console.error('Inquiry submission failed:', err);
      return {
        success: false,
        message: 'Could not submit inquiry at this moment. Please reach out directly via WhatsApp or Email.',
      };
    }
  };

  // Mark Inquiry Status
  const updateInquiryStatus = async (inquiryId: string, status: 'unread' | 'read' | 'archived') => {
    try {
      await updateDoc(doc(db, 'inquiries', inquiryId), { status });
      await logActivity('UPDATE_INQUIRY', 'inquiries', inquiryId, `Marked inquiry ${inquiryId} as ${status}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `inquiries/${inquiryId}`);
    }
  };

  // Delete Inquiry
  const deleteInquiry = async (inquiryId: string) => {
    try {
      await deleteDoc(doc(db, 'inquiries', inquiryId));
      await logActivity('DELETE_INQUIRY', 'inquiries', inquiryId, `Deleted inquiry ID: ${inquiryId}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `inquiries/${inquiryId}`);
    }
  };

  return (
    <DataContext.Provider
      value={{
        siteSettings,
        profile,
        services,
        projects,
        inquiries,
        activityLogs,
        loading,
        dbError,
        updateSiteSettings,
        updateProfile,
        saveProject,
        toggleProjectPublish,
        deleteProject,
        saveService,
        deleteService,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        seedInitialDataToFirestore,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
