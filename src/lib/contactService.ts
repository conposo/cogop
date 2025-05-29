import { addDoc, collection, serverTimestamp, query, where, getDocs, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { checkRateLimit } from './rateLimiter';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  createdAt?: any;
  status?: 'new' | 'read' | 'replied' | 'archived';
}

export interface ContactSubmission extends ContactFormData {
  id: string;
  createdAt: any;
  status: 'new' | 'read' | 'replied' | 'archived';
}

export async function submitContactForm(formData: ContactFormData): Promise<string> {
  // Check rate limit using email as identifier
  const isAllowed = await checkRateLimit(formData.email);
  if (!isAllowed) {
    throw new Error('Too many requests. Please try again later.');
  }

  try {
    const contactsRef = collection(db, 'contacts');
    const docRef = await addDoc(contactsRef, {
      ...formData,
      createdAt: serverTimestamp(),
      status: 'new'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw new Error('Failed to submit contact form. Please try again later.');
  }
}

export async function getContactSubmissions(
  status?: 'new' | 'read' | 'replied' | 'archived',
  limit_?: number
): Promise<ContactSubmission[]> {
  try {
    const contactsRef = collection(db, 'contacts');
    let q = query(contactsRef, orderBy('createdAt', 'desc'));
    
    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    if (limit_) {
      q = query(q, limit(limit_));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ContactSubmission[];
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    throw new Error('Failed to fetch contact submissions.');
  }
}

export async function updateContactStatus(
  id: string,
  status: 'new' | 'read' | 'replied' | 'archived'
): Promise<void> {
  try {
    const docRef = doc(db, 'contacts', id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error('Error updating contact status:', error);
    throw new Error('Failed to update contact status.');
  }
} 