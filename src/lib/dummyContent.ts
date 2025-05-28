import { collection, getDocs, query, orderBy, where, Timestamp, doc, getDoc, addDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase'; // Assuming firebase.ts is in the same lib folder

// Define a type for multilingual fields used in Article and Event
export interface MultilingualString {
  [key: string]: string;
}

export interface Article {
  id: string;
  title: MultilingualString; // Changed from string to MultilingualString
  slug: string; // Slug might need to be language-agnostic or handled differently
  summary: MultilingualString; // Changed from string to MultilingualString
  imageUrl?: string;
  category: string;
  languages?: string[];
  date: string; // Publication date, might be language-agnostic
  author: string;
  featured?: boolean;
  content?: MultilingualString; // Changed from string to MultilingualString
}

// Keep the original dummyArticles for fallback or if needed elsewhere, renamed
// This static data needs to be updated to the new MultilingualString structure if used directly
export const staticDummyArticles: Article[] = [
  // Example update (only for the first article for brevity):
  {
    id: '1',
    title: { en: 'Embracing Change: Our Vision for the Future' },
    slug: 'embracing-change-vision-future',
    summary: { en: 'Discover the exciting new directions and initiatives our church is undertaking as we step into a new era of growth and community engagement.' },
    imageUrl: '/images/placeholder-article-1.jpg',
    category: 'Church News',
    languages: ['en'],
    date: '2024-07-15',
    author: 'Pastor John Doe',
    featured: true,
    content: { en: 'Full content of article 1...' },
  },
  // Other static articles would need similar updates...
  {
    id: '2',
    title: { en: 'The Power of Community: Stories from Our Members' },
    slug: 'power-of-community-member-stories',
    summary: { en: 'Read heartfelt testimonials and experiences from our diverse congregation, highlighting the strength and support found within our church family.' },
    imageUrl: '/images/placeholder-article-2.jpg',
    category: 'Community',
    languages: ['en'],
    date: '2024-07-10',
    author: 'Jane Smith',
    content: { en: '' },
  },
  {
    id: '3',
    title: { en: 'Youth Ministry Kicks Off Summer Program' },
    slug: 'youth-ministry-summer-program',
    summary: { en: 'Our youth ministry is launching an engaging summer program filled with activities, learning, and fellowship. Find out how to get involved!' },
    imageUrl: '/images/placeholder-article-3.jpg',
    category: 'Ministries',
    languages: ['en'],
    date: '2024-07-05',
    author: 'Youth Pastor Mark',
    featured: true,
    content: { en: '' },
  },
  {
    id: '4',
    title: { en: 'Understanding Grace: A Theological Reflection' },
    slug: 'understanding-grace-theological-reflection',
    summary: { en: 'Delve into a deeper understanding of grace, its significance in our faith, and how it transforms our daily lives.' },
    imageUrl: '/images/placeholder-article-4.jpg',
    category: 'Theology',
    languages: ['en'],
    date: '2024-06-28',
    author: 'Dr. Eleanor Vance',
    content: { en: '' },
  },
   {
    id: '5',
    title: { en: 'Missions Update: Impacting Lives Globally' },
    slug: 'missions-update-global-impact',
    summary: { en: 'Get the latest updates from our global mission fields, showcasing the incredible work being done and the lives being touched by the Gospel.' },
    imageUrl: '/images/placeholder-article-5.jpg',
    category: 'Missions',
    languages: ['en'],
    date: '2024-07-20',
    author: 'Missions Team',
    featured: true,
    content: { en: '' },
  },
  {
    id: '6',
    title: { en: 'Volunteer Spotlight: Making a Difference Together' },
    slug: 'volunteer-spotlight-making-difference',
    summary: { en: 'Celebrating the dedicated volunteers who generously give their time and talents to serve our church and community.' },
    imageUrl: '/images/placeholder-article-6.jpg',
    category: 'Community',
    languages: ['en'],
    date: '2024-07-18',
    author: 'Sarah Brown',
    content: { en: 'Full content of article 6...' },
  }
];

// Function to save static content to Firebase - needs update for multilingual fields
export const saveStaticArticlesToFirebase = async (): Promise<void> => {
  try {
    console.log('Starting to save static content to Firebase...');
    
    for (const article of staticDummyArticles) {
      const articleDate = article.date ? new Date(article.date) : new Date();
      
      const articleData = {
        title: article.title,
        slug: article.slug,
        excerpt: article.summary,
        content: article.content || { en: article.summary.en || '' }, 
        category: article.category,
        languages: article.languages || ['en'],
        published: true,
        featured: article.featured || false,
        createdAt: Timestamp.fromDate(articleDate),
        updatedAt: Timestamp.fromDate(new Date()),
        authorId: 'system', // Or a specific ID from article if available
        authorName: article.author, // authorName is from Article interface
        imageUrl: article.imageUrl,
        tags: [article.category.toLowerCase().replace(/\s+/g, '-')],
        type: 'article' as 'article' // Explicitly type
      };

      await setDoc(doc(db, 'news', article.id), articleData);
      console.log(`Saved article with ID: ${article.id}`);
    }
    
    for (const event of staticDummyEvents) {
      // For staticDummyEvents, we expect `date` and `author` to be present for initial creation
      // `createdAt`, `updatedAt`, `authorId`, `authorName` are part of the full Event structure
      const eventCreationDate = event.date ? new Date(event.date) : new Date();
      
      const eventDataToSave = {
        title: event.title,
        excerpt: event.excerpt,
        content: event.content,
        category: event.category,
        languages: event.languages || ['en'],
        published: event.published,
        featured: event.featured,
        // Use values from staticDummyEvent if they exist, otherwise generate new ones
        createdAt: event.createdAt || Timestamp.fromDate(eventCreationDate),
        updatedAt: event.updatedAt || Timestamp.fromDate(new Date()),
        authorId: event.authorId || 'system-event', // Default or from event.author if mapped
        authorName: event.authorName || event.author || 'Event Staff', // Use event.author from static if authorName not set
        imageUrl: event.imageUrl,
        tags: event.tags || [event.category.toLowerCase().replace(/\s+/g, '-')],
        type: 'event' as 'event',
        eventDate: event.eventDate,
        eventTime: event.eventTime,
        eventEndDate: event.eventEndDate,
        eventEndTime: event.eventEndTime,
        eventLocation: event.eventLocation,
        eventAddress: event.eventAddress
      };

      await setDoc(doc(db, 'news', event.id), eventDataToSave);
      console.log(`Saved event with ID: ${event.id}`);
    }
    
    console.log('Successfully saved all static content to Firebase!');
  } catch (error) {
    console.error('Error saving content to Firebase:', error);
    throw error;
  }
};

// New function to fetch articles from Firestore
export const fetchArticlesFromFirestore = async (currentLang?: string): Promise<Article[]> => {
  try {
    let q = query(
      collection(db, 'news'), 
      where('type', '!=', 'event'),
      // orderBy('type'), // orderBy on type might not be needed if only fetching articles
      orderBy('createdAt', 'desc')
    );
    
    // If a language is specified, we also filter by it. 
    // This means an article must *include* the current language to be fetched.
    if (currentLang) {
        q = query(
            collection(db, 'news'),
            where('type', '!=', 'event'),
            where('languages', 'array-contains', currentLang),
            orderBy('createdAt', 'desc')
        );
    }

    const querySnapshot = await getDocs(q);
    const articlesData = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      let dateString = data.createdAt;
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        dateString = data.createdAt.toDate().toISOString().split('T')[0];
      } else if (data.createdAt instanceof Timestamp) {
        dateString = data.createdAt.toDate().toISOString().split('T')[0];
      }

      // The returned Article object will have title, summary, content as MultilingualString
      // The consumer of this function will need to select the appropriate language string.
      return {
        id: docSnap.id,
        title: data.title || { en: 'No Title' }, // Default to English if somehow missing
        slug: docSnap.id || data.slug, // Slug needs careful consideration for multilingual
        summary: data.excerpt || { en: '' }, // Default to English
        imageUrl: data.imageUrl,
        category: data.category || 'General',
        languages: data.languages || ['en'],
        date: dateString,
        author: data.authorName || 'Unknown Author',
        featured: data.featured || false,
        content: data.content || { en: '' }, // Default to English
      } as Article;
    });
    return articlesData;
  } catch (error) {
    console.error('Error fetching articles from Firestore:', error);
    // Fallback to staticDummyArticles needs careful handling due to structure mismatch now.
    // For simplicity, returning an empty array. Update static data or handle fallback properly.
    return []; 
  }
};

// New function to fetch a single article by ID from Firestore
export const fetchArticleById = async (id: string): Promise<Article | null> => {
  try {
    const docRef = doc(db, 'news', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      let dateString = data.createdAt;
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        dateString = data.createdAt.toDate().toISOString().split('T')[0];
      } else if (data.createdAt instanceof Timestamp) {
        dateString = data.createdAt.toDate().toISOString().split('T')[0];
      }

      return {
        id: docSnap.id,
        title: data.title || { en: 'No Title' },
        slug: data.slug || docSnap.id,
        summary: data.excerpt || { en: '' },
        content: data.content || { en: '' },
        imageUrl: data.imageUrl,
        category: data.category || 'General',
        languages: data.languages || ['en'],
        date: dateString,
        author: data.authorName || 'Unknown Author',
        featured: data.featured || false,
      } as Article;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    return null;
  }
};

// Modify dummyArticles to be a function that fetches data
// This is now an async function. Places consuming this might need to be updated.
export const dummyArticles = async (currentLang?: string): Promise<Article[]> => {
  return await fetchArticlesFromFirestore(currentLang);
};

export interface Event {
  id: string;
  title: MultilingualString;
  excerpt: MultilingualString;
  content: MultilingualString;
  category: string;
  languages?: string[];
  published: boolean;
  featured: boolean;
  createdAt: Timestamp; // Firestore Timestamp
  updatedAt: Timestamp; // Firestore Timestamp
  authorId: string;
  authorName: string;
  imageUrl?: string;
  tags: string[];
  type: 'event'; // Literal type
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventAddress?: string;
  eventEndDate?: string;
  eventEndTime?: string;
  // For static data, if we are mapping to this structure before saving
  date?: string; // Raw date string for initial creation
  author?: string; // Raw author string for initial creation
}

// Static dummy events for import - needs update for multilingual fields
export const staticDummyEvents: Event[] = [
  {
    id: 'event-1',
    title: { en: 'Annual Church Conference 2024' },
    excerpt: { en: 'Join us for our annual church conference featuring inspiring speakers, worship, and fellowship.' },
    content: { en: 'Our Annual Church Conference is a time of spiritual renewal and community building. This year\'s theme is "Walking in Faith" and will feature keynote speakers from around the world, worship sessions, breakout workshops, and opportunities for fellowship. The conference will include sessions on spiritual growth, community outreach, and ministry development. Meals will be provided for all attendees. Registration is required and scholarships are available for those in need.' },
    category: 'Events',
    languages: ['en'],
    published: true,
    featured: true,
    createdAt: Timestamp.fromDate(new Date('2024-09-15')), // Use Timestamp
    updatedAt: Timestamp.fromDate(new Date()),
    authorId: 'system-conf-committee',
    authorName: 'Conference Committee',
    imageUrl: '/images/conference-2024.jpg',
    tags: ['conference'],
    type: 'event',
    eventDate: '2024-09-15',
    eventTime: '09:00',
    eventEndDate: '2024-09-17',
    eventEndTime: '17:00',
    eventLocation: 'Main Sanctuary',
    eventAddress: '3720 Keith Street NW, Cleveland, TN 37312',
    // Keep raw date/author for saveStaticArticlesToFirebase if it needs them
    date: '2024-09-15',
    author: 'Conference Committee',
  },
  {
    id: 'event-2',
    title: { en: 'Community Food Drive' },
    excerpt: { en: 'Help us serve our local community by donating non-perishable food items.' },
    content: { en: 'Our monthly community food drive is an opportunity to serve those in need in our local area. We are collecting non-perishable food items, canned goods, and personal care items. All donations will be distributed through our community outreach program to local families in need. Volunteers are also needed to help sort and distribute items. This is a great opportunity for families to serve together and make a difference in our community.' },
    category: 'Community Outreach',
    languages: ['en'],
    published: true,
    featured: false,
    createdAt: Timestamp.fromDate(new Date('2024-08-10')),
    updatedAt: Timestamp.fromDate(new Date()),
    authorId: 'system-outreach-min',
    authorName: 'Outreach Ministry',
    imageUrl: '/images/food-drive.jpg',
    tags: ['community', 'outreach'],
    type: 'event',
    eventDate: '2024-08-10',
    eventTime: '10:00',
    eventEndDate: '2024-08-10',
    eventEndTime: '14:00',
    eventLocation: 'Fellowship Hall',
    eventAddress: '3720 Keith Street NW, Cleveland, TN 37312',
    date: '2024-08-10',
    author: 'Outreach Ministry',
  },
  // Add more updated static events as needed, ensuring all required Event fields are present
];

// Function to fetch events from Firestore
export const fetchEventsFromFirestore = async (currentLang?: string): Promise<Event[]> => {
  try {
    let q = query(
      collection(db, 'news'), 
      where('type', '==', 'event'),
      orderBy('eventDate', 'asc')
    );

    if (currentLang) {
        q = query(
            collection(db, 'news'),
            where('type', '==', 'event'),
            where('languages', 'array-contains', currentLang),
            orderBy('eventDate', 'asc')
        );
    }

    const querySnapshot = await getDocs(q);
    const eventsData = querySnapshot.docs
      .map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || { en: 'No Title' },
          excerpt: data.excerpt || { en: '' },
          content: data.content || { en: '' },
          category: data.category || 'General',
          languages: data.languages || ['en'],
          published: data.published || false,
          featured: data.featured || false,
          createdAt: data.createdAt as Timestamp, // Cast to Timestamp
          updatedAt: data.updatedAt as Timestamp,
          authorId: data.authorId || 'system',
          authorName: data.authorName || 'Unknown Author',
          imageUrl: data.imageUrl,
          tags: data.tags || [],
          type: 'event' as 'event',
          eventDate: data.eventDate || '',
          eventTime: data.eventTime || '',
          eventLocation: data.eventLocation || '',
          eventAddress: data.eventAddress || '',
          eventEndDate: data.eventEndDate || '',
          eventEndTime: data.eventEndTime || '',
        } as Event;
      })
      .filter(item => item.published)
      .filter(event => {
        const eventDateObj = new Date(event.eventDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDateObj >= today;
      });
    
    return eventsData;
  } catch (error) {
    console.error('Error fetching events from Firestore:', error);
    return [];
  }
};

// Function to fetch a single event by ID from Firestore
export const fetchEventById = async (id: string): Promise<Event | null> => {
  try {
    const docRef = doc(db, 'news', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      if (data.type !== 'event') {
        console.log(`Document with ID '${id}' is not an event.`);
        return null;
      }

      return {
        id: docSnap.id,
        title: data.title || { en: 'No Title' },
        excerpt: data.excerpt || { en: '' },
        content: data.content || { en: '' },
        category: data.category || 'General',
        languages: data.languages || ['en'],
        published: data.published || false,
        featured: data.featured || false,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
        authorId: data.authorId || 'system',
        authorName: data.authorName || 'Unknown Author',
        imageUrl: data.imageUrl,
        tags: data.tags || [],
        type: 'event' as 'event',
        eventDate: data.eventDate || '',
        eventTime: data.eventTime || '',
        eventLocation: data.eventLocation || '',
        eventAddress: data.eventAddress || '',
        eventEndDate: data.eventEndDate || '',
        eventEndTime: data.eventEndTime || '',
      } as Event;
    } else {
      console.log("No such event!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return null;
  }
};

// dummyEvents array (if still used directly) should also be updated like staticDummyEvents.
// For example:
export const dummyEvents: Event[] = [
  {
    id: 'evt1',
    title: { en: 'Annual Church Picnic' },
    excerpt: { en: 'Join us for a day of fun, food, and fellowship at our annual church picnic. Games for all ages!' },
    content: { en: 'Detailed description of the picnic... Bring your family and enjoy an afternoon of connection and community building.' },
    category: 'Community',
    languages: ['en'],
    published: true,
    featured: false,
    createdAt: Timestamp.fromDate(new Date('2024-08-15')), // Add required fields
    updatedAt: Timestamp.fromDate(new Date()),
    authorId: 'church-staff',
    authorName: 'Church Staff',
    imageUrl: '/images/placeholder-event-1.jpg',
    tags: ['community', 'family', 'picnic'],
    type: 'event',
    eventDate: '2024-08-15',
    eventTime: '12:00',
    eventLocation: 'Central Park, Meadow Lane',
    eventEndDate: '2024-08-15',
    eventEndTime: '16:00',
    date: '2024-08-15', // For consistency if mapping from a raw 'date' field
  },
  // Other dummyEvents need similar updates
];

export const dummyPodcasts = [
  {
    id: 'pod1',
    title: 'Faith in Modern Times',
    episode: 12,
    date: '2024-07-12',
    duration: '35min',
    description: 'Discussing how to maintain and grow faith in the complexities of the modern world.',
    audioUrl: '/audio/placeholder-podcast-1.mp3',
    imageUrl: '/images/placeholder-podcast-1.jpg',
  },
  {
    id: 'pod2',
    title: 'The Beatitudes: A Deep Dive',
    episode: 5,
    date: '2024-07-05',
    duration: '42min',
    description: 'An in-depth study of the Beatitudes and their application to our lives.',
    audioUrl: '/audio/placeholder-podcast-2.mp3',
    imageUrl: '/images/placeholder-podcast-2.jpg',
  },
  {
    id: 'pod3',
    title: 'Parenting with Purpose',
    episode: 8,
    date: '2024-06-28',
    duration: '30min',
    description: 'Practical advice and biblical wisdom for Christian parents.',
    audioUrl: '/audio/placeholder-podcast-3.mp3',
    imageUrl: '/images/placeholder-podcast-3.jpg',
  }
];

// You can add more dummy data for other sections like Who We Are, Ministries, etc.
// For example:
export interface Ministry {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  contactEmail?: string;
}

export const dummyMinistries: Ministry[] = [
  {
    id: 'min1',
    name: "Children's Ministry",
    description: "Nurturing the faith of our youngest members through engaging lessons and activities.",
    imageUrl: "/images/ministry-children.jpg",
    contactEmail: "children@cogop.org"
  },
  // ... more ministries
];

export interface Statistic {
  value: string;
  label: string;
  icon: string; // e.g., 'bi-globe', 'bi-people-fill'
}

export const dummyStatistics: Statistic[] = [
  { value: '1.5M+', label: 'Members Worldwide', icon: 'bi-people-fill' },
  { value: '135+', label: 'Countries Reached', icon: 'bi-globe' },
  { value: '7,000+', label: 'Churches Globally', icon: 'bi-house-heart-fill' },
  { value: '100+', label: 'Years of Ministry', icon: 'bi-calendar-check-fill' },
];

// Function to format event date and time for display
export const formatEventDateTime = (event: Event): string => {
  const startDate = new Date(event.eventDate);
  const endDate = event.eventEndDate ? new Date(event.eventEndDate) : null;
  
  let dateStr = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  if (endDate && endDate.getTime() !== startDate.getTime()) {
    dateStr += ` - ${endDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`;
  }
  
  if (event.eventTime) {
    const timeStr = new Date(`2000-01-01T${event.eventTime}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    dateStr += ` at ${timeStr}`;
    
    if (event.eventEndTime && event.eventEndTime !== event.eventTime) {
      const endTimeStr = new Date(`2000-01-01T${event.eventEndTime}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      dateStr += ` - ${endTimeStr}`;
    }
  }
  
  return dateStr;
}; 