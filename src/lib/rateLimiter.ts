import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const RATE_LIMIT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_REQUESTS = 3; // Maximum 3 submissions per 5 minutes

interface RateLimitData {
  count: number;
  firstRequest: any;
}

export async function checkRateLimit(identifier: string): Promise<boolean> {
  const rateLimitRef = doc(db, 'rateLimits', identifier);
  
  try {
    const docSnap = await getDoc(rateLimitRef);
    const now = Date.now();
    
    if (!docSnap.exists()) {
      // First request from this IP/email
      await setDoc(rateLimitRef, {
        count: 1,
        firstRequest: serverTimestamp()
      });
      return true;
    }

    const data = docSnap.data() as RateLimitData;
    const firstRequestTime = data.firstRequest.toDate().getTime();
    
    if (now - firstRequestTime > RATE_LIMIT_DURATION) {
      // Reset rate limit if duration has passed
      await setDoc(rateLimitRef, {
        count: 1,
        firstRequest: serverTimestamp()
      });
      return true;
    }
    
    if (data.count >= MAX_REQUESTS) {
      return false; // Rate limit exceeded
    }
    
    // Increment counter
    await setDoc(rateLimitRef, {
      count: data.count + 1,
      firstRequest: data.firstRequest
    });
    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Allow request if rate limit check fails
  }
} 