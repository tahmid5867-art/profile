import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const DEFAULT_ADMIN_EMAIL = 'tahmid5867@gmail.com';
export const DEFAULT_ADMIN_PASSWORD = 'Admin@123456';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpAdmin: (email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateAdminPassword: (newPassword: string, currentPassword?: string) => Promise<void>;
  signOut: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpAdmin: async () => {},
  sendPasswordReset: async () => {},
  updateAdminPassword: async () => {},
  signOut: async () => {},
  authError: null,
  clearAuthError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const checkIsAdmin = async (user: User | null): Promise<boolean> => {
    if (!user || !user.email) return false;
    const emailLower = user.email.toLowerCase();
    if (emailLower === 'tahmid5867@gmail.com') {
      return true;
    }
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      return adminDoc.exists();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const adminStatus = await checkIsAdmin(user);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const isAdm = await checkIsAdmin(result.user);
      setIsAdmin(isAdm);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google authentication failed';
      setAuthError(message);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setAuthError(null);
    const trimmedEmail = email.trim().toLowerCase();

    try {
      const result = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const isAdm = await checkIsAdmin(result.user);
      setIsAdmin(isAdm);
      if (!isAdm) {
        throw new Error('Access denied: This email is not registered in the administrator allowlist.');
      }
    } catch (err: unknown) {
      // If the designated superadmin is signing in with default credentials or for the first time,
      // and the user account doesn't exist yet in Firebase Auth, automatically initialize it.
      if (
        trimmedEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() &&
        err instanceof Error &&
        (err.message.includes('auth/user-not-found') || err.message.includes('auth/invalid-credential'))
      ) {
        try {
          const createResult = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
          try {
            await setDoc(doc(db, 'admins', createResult.user.uid), {
              email: trimmedEmail,
              role: 'superadmin',
              addedAt: new Date().toISOString(),
            });
          } catch (writeErr) {
            console.warn('Could not auto-write admins doc:', writeErr);
          }
          setIsAdmin(true);
          return;
        } catch (createErr) {
          console.warn('Auto initialization fallback skipped:', createErr);
        }
      }

      let message = 'Failed to sign in. Please verify your email and password.';
      if (err instanceof Error) {
        if (err.message.includes('auth/invalid-credential') || err.message.includes('auth/wrong-password')) {
          message = `Invalid credentials. The default login is: ${DEFAULT_ADMIN_EMAIL} / ${DEFAULT_ADMIN_PASSWORD}`;
        } else if (err.message.includes('auth/user-not-found')) {
          message = `No administrator account found. Use ${DEFAULT_ADMIN_EMAIL} with default password: ${DEFAULT_ADMIN_PASSWORD}`;
        } else if (err.message.includes('auth/too-many-requests')) {
          message = 'Too many failed login attempts. Please reset your password or try again later.';
        } else {
          message = err.message;
        }
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const updateAdminPassword = async (newPassword: string, currentPassword?: string) => {
    setAuthError(null);
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No authenticated administrator found. Please log in first.');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    try {
      // If current password provided, re-authenticate first to ensure session freshness
      if (currentPassword) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      await updatePassword(auth.currentUser, newPassword);
    } catch (err: unknown) {
      let message = 'Failed to update administrator password.';
      if (err instanceof Error) {
        if (err.message.includes('auth/requires-recent-login')) {
          message = 'For security reasons, updating your password requires entering your current password to re-authenticate.';
        } else if (err.message.includes('auth/wrong-password')) {
          message = 'Current password entered is incorrect.';
        } else if (err.message.includes('auth/weak-password')) {
          message = 'Password is too weak. Please choose a stronger password (at least 6 characters).';
        } else {
          message = err.message;
        }
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const signUpAdmin = async (email: string, password: string) => {
    setAuthError(null);
    const trimmedEmail = email.trim().toLowerCase();
    
    // Security check: Only allow designated superadmin email to self-provision initial password
    if (trimmedEmail !== 'tahmid5867@gmail.com') {
      const errorMsg = 'Unauthorized: Only the designated primary administrator (tahmid5867@gmail.com) can initialize admin credentials.';
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      // Automatically register admin document in Firestore
      try {
        await setDoc(doc(db, 'admins', result.user.uid), {
          email: trimmedEmail,
          role: 'superadmin',
          addedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Could not auto-write admins doc, but email matches master rule:', e);
      }
      setIsAdmin(true);
    } catch (err: unknown) {
      let message = 'Failed to create admin credentials.';
      if (err instanceof Error) {
        if (err.message.includes('auth/email-already-in-use')) {
          message = 'An account with this email already exists. Please sign in directly or use password reset.';
        } else if (err.message.includes('auth/weak-password')) {
          message = 'Password is too weak. Please use at least 6 characters.';
        } else {
          message = err.message;
        }
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send password reset email';
      setAuthError(message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setIsAdmin(false);
      setCurrentUser(null);
    } catch (err: unknown) {
      console.error('Sign out error:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpAdmin,
        sendPasswordReset,
        updateAdminPassword,
        signOut,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
