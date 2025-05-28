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
  orderBy,
  limit,
  serverTimestamp,
  getDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Discussion {
  id: string;
  churchId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  tags: string[];
  isActive: boolean;
  isPinned: boolean;
  commentCount: number;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt?: Date;
  updatedBy?: string;
}

interface Comment {
  id: string;
  discussionId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  updatedBy?: string;
  // Optional reply to another comment
  parentCommentId?: string;
  replyCount?: number;
}

interface DiscussionsContextType {
  discussions: Discussion[];
  comments: Comment[];
  loading: boolean;
  // Discussion methods
  createDiscussion: (churchId: string, discussionData: Partial<Discussion>) => Promise<string>;
  updateDiscussion: (discussionId: string, updates: Partial<Discussion>) => Promise<void>;
  deleteDiscussion: (discussionId: string) => Promise<void>;
  getChurchDiscussions: (churchId: string, limitCount?: number) => Promise<Discussion[]>;
  getDiscussion: (discussionId: string) => Promise<Discussion | null>;
  pinDiscussion: (discussionId: string, isPinned: boolean) => Promise<void>;
  // Comment methods
  createComment: (discussionId: string, commentData: Partial<Comment>) => Promise<string>;
  updateComment: (commentId: string, updates: Partial<Comment>) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  getDiscussionComments: (discussionId: string) => Promise<Comment[]>;
  // Search and filter
  searchDiscussions: (churchId: string, searchTerm: string) => Promise<Discussion[]>;
  getDiscussionsByTag: (churchId: string, tag: string) => Promise<Discussion[]>;
}

const DiscussionsContext = createContext<DiscussionsContextType | undefined>(undefined);

export function useDiscussions() {
  const context = useContext(DiscussionsContext);
  if (context === undefined) {
    throw new Error('useDiscussions must be used within a DiscussionsProvider');
  }
  return context;
}

export function DiscussionsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const createDiscussion = async (churchId: string, discussionData: Partial<Discussion>): Promise<string> => {
    if (!user) {
      const errorMsg = 'User not authenticated - please log in to create discussions';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    // Debug logging
    console.log('🔄 Creating discussion...');
    console.log('User:', user.uid, user.email);
    console.log('Church ID:', churchId);
    console.log('Discussion data:', discussionData);

    const newDiscussion = {
      churchId,
      title: discussionData.title || '',
      content: discussionData.content || '',
      authorId: user.uid,
      authorName: user.displayName || 'Anonymous',
      authorEmail: user.email,
      tags: discussionData.tags || [],
      isActive: true,
      isPinned: false,
      commentCount: 0,
      lastActivityAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'discussions'), newDiscussion);
      console.log('✅ Discussion created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('❌ Failed to create discussion:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Enhanced error logging for debugging
      if (error.code === 'permission-denied') {
        console.log('🔍 Permission denied details:');
        console.log('- User ID:', user.uid);
        console.log('- Church ID:', churchId);
        console.log('- User email:', user.email);
        console.log('- User display name:', user.displayName);
        console.log('📋 Next steps:');
        console.log('1. Check if user exists in churchUsers collection');
        console.log('2. Verify user has "create_discussions" permission');
        console.log('3. Confirm Firestore security rules are deployed');
      }
      
      // Re-throw the original error for the component to handle
      throw error;
    }
  };

  const updateDiscussion = async (discussionId: string, updates: Partial<Discussion>) => {
    if (!user) throw new Error('User not authenticated');

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    };

    await updateDoc(doc(db, 'discussions', discussionId), updateData);
  };

  const deleteDiscussion = async (discussionId: string) => {
    if (!user) throw new Error('User not authenticated');

    // Soft delete by setting isActive to false
    await updateDoc(doc(db, 'discussions', discussionId), {
      isActive: false,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    });
  };

  const getChurchDiscussions = async (churchId: string, limitCount: number = 50): Promise<Discussion[]> => {
    if (!churchId) {
      console.warn('No churchId provided to getChurchDiscussions');
      return [];
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, 'discussions'), 
        where('churchId', '==', churchId),
        where('isActive', '==', true),
        orderBy('isPinned', 'desc'),
        orderBy('lastActivityAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      const discussions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastActivityAt: doc.data().lastActivityAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Discussion[];

      setDiscussions(discussions);
      console.log(`📚 Loaded ${discussions.length} discussions for church ${churchId}`);
      return discussions;
    } catch (error: any) {
      console.error('Error fetching discussions:', error);
      setDiscussions([]);
      
      // Don't throw the error, return empty array instead
      if (error.code === 'permission-denied') {
        console.error('Permission denied. User may not be a member of this church.');
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getDiscussion = async (discussionId: string): Promise<Discussion | null> => {
    try {
      const docRef = doc(db, 'discussions', discussionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          lastActivityAt: docSnap.data().lastActivityAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
        } as Discussion;
      }
      return null;
    } catch (error) {
      console.error('Error fetching discussion:', error);
      return null;
    }
  };

  const pinDiscussion = async (discussionId: string, isPinned: boolean) => {
    if (!user) throw new Error('User not authenticated');

    await updateDoc(doc(db, 'discussions', discussionId), {
      isPinned,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    });
  };

  const createComment = async (discussionId: string, commentData: Partial<Comment>): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const newComment = {
      discussionId,
      content: commentData.content || '',
      authorId: user.uid,
      authorName: user.displayName || 'Anonymous',
      authorEmail: user.email,
      isActive: true,
      createdAt: serverTimestamp(),
      parentCommentId: commentData.parentCommentId || null,
      replyCount: 0,
    };

    const docRef = await addDoc(collection(db, 'comments'), newComment);

    // Update discussion comment count and last activity
    const discussionRef = doc(db, 'discussions', discussionId);
    const discussionDoc = await getDoc(discussionRef);
    if (discussionDoc.exists()) {
      const currentCount = discussionDoc.data().commentCount || 0;
      await updateDoc(discussionRef, {
        commentCount: currentCount + 1,
        lastActivityAt: serverTimestamp(),
      });
    }

    // If this is a reply, update parent comment reply count
    if (commentData.parentCommentId) {
      const parentCommentRef = doc(db, 'comments', commentData.parentCommentId);
      const parentCommentDoc = await getDoc(parentCommentRef);
      if (parentCommentDoc.exists()) {
        const currentReplyCount = parentCommentDoc.data().replyCount || 0;
        await updateDoc(parentCommentRef, {
          replyCount: currentReplyCount + 1,
        });
      }
    }

    return docRef.id;
  };

  const updateComment = async (commentId: string, updates: Partial<Comment>) => {
    if (!user) throw new Error('User not authenticated');

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    };

    await updateDoc(doc(db, 'comments', commentId), updateData);
  };

  const deleteComment = async (commentId: string) => {
    if (!user) throw new Error('User not authenticated');

    // Soft delete by setting isActive to false
    await updateDoc(doc(db, 'comments', commentId), {
      isActive: false,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    });

    // Get the comment to find the discussion and update counts
    const commentDoc = await getDoc(doc(db, 'comments', commentId));
    if (commentDoc.exists()) {
      const commentData = commentDoc.data();
      
      // Update discussion comment count
      const discussionRef = doc(db, 'discussions', commentData.discussionId);
      const discussionDoc = await getDoc(discussionRef);
      if (discussionDoc.exists()) {
        const currentCount = discussionDoc.data().commentCount || 0;
        await updateDoc(discussionRef, {
          commentCount: Math.max(0, currentCount - 1),
        });
      }

      // If this was a reply, update parent comment reply count
      if (commentData.parentCommentId) {
        const parentCommentRef = doc(db, 'comments', commentData.parentCommentId);
        const parentCommentDoc = await getDoc(parentCommentRef);
        if (parentCommentDoc.exists()) {
          const currentReplyCount = parentCommentDoc.data().replyCount || 0;
          await updateDoc(parentCommentRef, {
            replyCount: Math.max(0, currentReplyCount - 1),
          });
        }
      }
    }
  };

  const getDiscussionComments = async (discussionId: string): Promise<Comment[]> => {
    try {
      const q = query(
        collection(db, 'comments'), 
        where('discussionId', '==', discussionId),
        where('isActive', '==', true),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      const comments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Comment[];

      setComments(comments);
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const searchDiscussions = async (churchId: string, searchTerm: string): Promise<Discussion[]> => {
    // Note: This is a basic search. For production, consider using Algolia or similar
    try {
      const q = query(
        collection(db, 'discussions'), 
        where('churchId', '==', churchId),
        where('isActive', '==', true),
        orderBy('lastActivityAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const allDiscussions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastActivityAt: doc.data().lastActivityAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Discussion[];

      // Filter by search term
      const filteredDiscussions = allDiscussions.filter(discussion => 
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      return filteredDiscussions;
    } catch (error) {
      console.error('Error searching discussions:', error);
      return [];
    }
  };

  const getDiscussionsByTag = async (churchId: string, tag: string): Promise<Discussion[]> => {
    try {
      const q = query(
        collection(db, 'discussions'), 
        where('churchId', '==', churchId),
        where('isActive', '==', true),
        where('tags', 'array-contains', tag),
        orderBy('lastActivityAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const discussions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastActivityAt: doc.data().lastActivityAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Discussion[];

      return discussions;
    } catch (error) {
      console.error('Error fetching discussions by tag:', error);
      return [];
    }
  };

  const value: DiscussionsContextType = {
    discussions,
    comments,
    loading,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
    getChurchDiscussions,
    getDiscussion,
    pinDiscussion,
    createComment,
    updateComment,
    deleteComment,
    getDiscussionComments,
    searchDiscussions,
    getDiscussionsByTag,
  };

  return (
    <DiscussionsContext.Provider value={value}>
      {children}
    </DiscussionsContext.Provider>
  );
}

// Export interfaces for use in components
export type { Discussion, Comment }; 