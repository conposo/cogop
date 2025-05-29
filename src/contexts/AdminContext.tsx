'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  adminData: AdminData | null;
}

interface AdminData {
  role: 'admin' | 'super_admin' | 'editor';
  permissions: string[];
  createdAt: Date;
  createdBy: string;
}

interface ChurchUser {
  id: string;
  userId: string;
  churchId: string;
  role: 'admin' | 'manager' | 'editor' | 'member';
  permissions: string[];
  email?: string;
  displayName?: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}

interface ChurchUserContextType {
  churchUsers: ChurchUser[];
  loading: boolean;
  addChurchUser: (churchId: string, userData: Partial<ChurchUser>) => Promise<void>;
  updateChurchUser: (churchUserId: string, updates: Partial<ChurchUser>) => Promise<void>;
  removeChurchUser: (churchUserId: string) => Promise<void>;
  getChurchUsers: (churchId: string) => Promise<ChurchUser[]>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user || !user.uid) {
        setIsAdmin(false);
        setAdminData(null);
        setLoading(false);
        return;
      }

      // Wait a brief moment to ensure auth is initialized
      await new Promise(resolve => setTimeout(resolve, 100));

      // User is present, so we need to fetch their admin status.
      // Set loading to true *before* starting the async operation.
      setLoading(true);

      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        if (adminDoc.exists()) {
          const data = adminDoc.data() as AdminData;
          setIsAdmin(true);
          setAdminData(data);
        } else {
          setIsAdmin(false);
          setAdminData(null);
        }
      } catch (error) {
        // Only log error if it's not a permission error during initialization
        if (error instanceof Error && !error.message.includes('permission')) {
          console.error('Error checking admin status:', error);
        }
        setIsAdmin(false);
        setAdminData(null);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const value: AdminContextType = {
    isAdmin,
    loading,
    adminData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
} 