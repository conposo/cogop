'use client';

import { createContext, useContext, useState } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

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
  // Optional church details for display
  churchDetails?: {
    name: string;
    city: string;
    state: string;
    country: string;
    isActive: boolean;
  };
}

interface ChurchUserContextType {
  churchUsers: ChurchUser[];
  loading: boolean;
  addChurchUser: (churchId: string, userData: Partial<ChurchUser>) => Promise<void>;
  updateChurchUser: (churchUserId: string, updates: Partial<ChurchUser>) => Promise<void>;
  removeChurchUser: (churchUserId: string) => Promise<void>;
  leaveChurch: (churchId: string, userId: string) => Promise<void>;
  getChurchUsers: (churchId: string) => Promise<ChurchUser[]>;
  getUserChurches: (userId: string) => Promise<ChurchUser[]>;
}

const ChurchUserContext = createContext<ChurchUserContextType | undefined>(undefined);

export function useChurchUser() {
  const context = useContext(ChurchUserContext);
  if (context === undefined) {
    throw new Error('useChurchUser must be used within a ChurchUserProvider');
  }
  return context;
}

export function ChurchUserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [churchUsers, setChurchUsers] = useState<ChurchUser[]>([]);
  const [loading, setLoading] = useState(false);

  const addChurchUser = async (churchId: string, userData: Partial<ChurchUser>) => {
    if (!user) throw new Error('User not authenticated');

    const churchUserId = `${churchId}_${userData.userId}`;
    
    const newChurchUser = {
      userId: userData.userId!,
      churchId,
      role: userData.role || 'member',
      permissions: userData.permissions || getDefaultPermissions(userData.role || 'member'),
      email: userData.email,
      displayName: userData.displayName,
      isActive: true,
      createdAt: serverTimestamp(),
      createdBy: user.uid,
    };
    console.log(churchUserId, '🔍 New church user:', newChurchUser);
    await setDoc(doc(db, 'churchUsers', churchUserId), newChurchUser);
  };

  const updateChurchUser = async (churchUserId: string, updates: Partial<ChurchUser>) => {
    if (!user) throw new Error('User not authenticated');

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    };

    await updateDoc(doc(db, 'churchUsers', churchUserId), updateData);
  };

  const removeChurchUser = async (churchUserId: string) => {
    await deleteDoc(doc(db, 'churchUsers', churchUserId));
  };

  const leaveChurch = async (churchId: string, userId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const churchUserId = `${churchId}_${userId}`;
    
    // Only allow users to remove themselves
    if (user.uid !== userId) {
      throw new Error('You can only remove yourself from churches');
    }
    
    await deleteDoc(doc(db, 'churchUsers', churchUserId));
  };

  const getChurchUsers = async (churchId: string): Promise<ChurchUser[]> => {
    setLoading(true);
    try {
      const q = query(collection(db, 'churchUsers'), where('churchId', '==', churchId));
      const querySnapshot = await getDocs(q);
      
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as ChurchUser[];

      setChurchUsers(users);
      return users;
    } finally {
      setLoading(false);
    }
  };

  const getUserChurches = async (userId: string): Promise<ChurchUser[]> => {
    const q = query(collection(db, 'churchUsers'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const churchUsers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as ChurchUser[];

    // Fetch church details for each church membership
    const churchUsersWithDetails = await Promise.all(
      churchUsers.map(async (churchUser) => {
        try {
          const churchDoc = await getDoc(doc(db, 'churches', churchUser.churchId));
          if (churchDoc.exists()) {
            const churchData = churchDoc.data();
            return {
              ...churchUser,
              churchDetails: {
                name: churchData.name,
                city: churchData.city,
                state: churchData.state,
                country: churchData.country,
                isActive: churchData.isActive,
              }
            };
          }
        } catch (error) {
          console.error(`Error fetching church details for ${churchUser.churchId}:`, error);
        }
        return churchUser;
      })
    );

    return churchUsersWithDetails;
  };

  const getDefaultPermissions = (role: string): string[] => {
    switch (role) {
      case 'admin':
        return ['manage_users', 'manage_content', 'manage_events', 'view_analytics', 'manage_settings', 'manage_discussions', 'pin_discussions', 'moderate_discussions'];
      case 'manager':
        return ['manage_content', 'manage_events', 'view_analytics', 'manage_discussions', 'pin_discussions', 'moderate_discussions'];
      case 'editor':
        return ['manage_content', 'manage_events', 'create_discussions', 'moderate_discussions'];
      case 'member':
        return ['view_content', 'create_discussions', 'comment_discussions'];
      default:
        return ['view_content'];
    }
  };

  const value: ChurchUserContextType = {
    churchUsers,
    loading,
    addChurchUser,
    updateChurchUser,
    removeChurchUser,
    leaveChurch,
    getChurchUsers,
    getUserChurches,
  };

  return (
    <ChurchUserContext.Provider value={value}>
      {children}
    </ChurchUserContext.Provider>
  );
}

export type { ChurchUser }; 