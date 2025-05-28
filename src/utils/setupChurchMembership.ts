import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from 'firebase/auth';

interface SetupMembershipProps {
  user: User;
  churchId: string;
  role?: 'admin' | 'manager' | 'editor' | 'member';
}

export async function setupChurchMembership({ 
  user, 
  churchId, 
  role = 'member' 
}: SetupMembershipProps) {
  const churchUserId = `${churchId}_${user.uid}`;
  const churchUserRef = doc(db, 'churchUsers', churchUserId);
  
  try {
    // Check if membership already exists
    const existingMembership = await getDoc(churchUserRef);
    
    if (existingMembership.exists()) {
      console.log('✅ Church membership already exists');
      return existingMembership.data();
    }

    // Get default permissions for role
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

    // Create new membership
    const membershipData = {
      userId: user.uid,
      churchId,
      role,
      permissions: getDefaultPermissions(role),
      email: user.email,
      displayName: user.displayName || 'Unknown User',
      isActive: true,
      createdAt: serverTimestamp(),
      createdBy: user.uid,
    };

    await setDoc(churchUserRef, membershipData);
    
    console.log('✅ Church membership created successfully');
    console.log('Role:', role);
    console.log('Permissions:', getDefaultPermissions(role));
    
    return membershipData;
    
  } catch (error) {
    console.error('❌ Error setting up church membership:', error);
    throw error;
  }
}

// Quick setup function for console testing
export function quickSetupMembership(churchId: string, role: 'admin' | 'manager' | 'editor' | 'member' = 'member') {
  // This should be called from browser console where auth is available
  if (typeof window !== 'undefined' && (window as any).auth) {
    const auth = (window as any).auth;
    const user = auth.currentUser;
    
    if (!user) {
      console.error('❌ No authenticated user found');
      return;
    }
    
    return setupChurchMembership({ user, churchId, role });
  } else {
    console.error('❌ Firebase auth not available in this context');
  }
} 