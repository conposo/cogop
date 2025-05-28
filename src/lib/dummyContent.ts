import { collection, getDocs, query, orderBy, where, Timestamp, doc, getDoc, addDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase'; // Assuming firebase.ts is in the same lib folder

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl?: string;
  category: string;
  languages?: string[];
  date: string;
  author: string;
  featured?: boolean;
  content?: string;
}

// Keep the original dummyArticles for fallback or if needed elsewhere, renamed
export const staticDummyArticles: Article[] = [
  {
    id: '1',
    title: 'Embracing Change: Our Vision for the Future',
    slug: 'embracing-change-vision-future',
    summary: 'Discover the exciting new directions and initiatives our church is undertaking as we step into a new era of growth and community engagement.',
    imageUrl: '/images/placeholder-article-1.jpg',
    category: 'Church News',
    date: '2024-07-15',
    author: 'Pastor John Doe',
    featured: true,
    content: 'Full content of article 1...',
  },
  {
    id: '2',
    title: 'The Power of Community: Stories from Our Members',
    slug: 'power-of-community-member-stories',
    summary: 'Read heartfelt testimonials and experiences from our diverse congregation, highlighting the strength and support found within our church family.',
    imageUrl: '/images/placeholder-article-2.jpg',
    category: 'Community',
    date: '2024-07-10',
    author: 'Jane Smith',
    content: '',
  },
  {
    id: '3',
    title: 'Youth Ministry Kicks Off Summer Program',
    slug: 'youth-ministry-summer-program',
    summary: 'Our youth ministry is launching an engaging summer program filled with activities, learning, and fellowship. Find out how to get involved!',
    imageUrl: '/images/placeholder-article-3.jpg',
    category: 'Ministries',
    date: '2024-07-05',
    author: 'Youth Pastor Mark',
    featured: true,
    content: '',
  },
  {
    id: '4',
    title: 'Understanding Grace: A Theological Reflection',
    slug: 'understanding-grace-theological-reflection',
    summary: 'Delve into a deeper understanding of grace, its significance in our faith, and how it transforms our daily lives.',
    imageUrl: '/images/placeholder-article-4.jpg',
    category: 'Theology',
    date: '2024-06-28',
    author: 'Dr. Eleanor Vance',
    content: '',
  },
   {
    id: '5',
    title: 'Missions Update: Impacting Lives Globally',
    slug: 'missions-update-global-impact',
    summary: 'Get the latest updates from our global mission fields, showcasing the incredible work being done and the lives being touched by the Gospel.',
    imageUrl: '/images/placeholder-article-5.jpg',
    category: 'Missions',
    date: '2024-07-20',
    author: 'Missions Team',
    featured: true,
    content: '',
  },
  {
    id: '6',
    title: 'Volunteer Spotlight: Making a Difference Together',
    slug: 'volunteer-spotlight-making-difference',
    summary: 'Celebrating the dedicated volunteers who generously give their time and talents to serve our church and community.',
    imageUrl: '/images/placeholder-article-6.jpg',
    category: 'Community',
    date: '2024-07-18',
    author: 'Sarah Brown',
    content: 'Full content of article 6...',
  }
];

// Function to save both static articles and events to Firebase
export const saveStaticArticlesToFirebase = async (): Promise<void> => {
  try {
    console.log('Starting to save static content to Firebase...');
    
    // Save articles
    for (const article of staticDummyArticles) {
      const articleDate = new Date(article.date);
      
      const articleData = {
        title: article.title,
        slug: article.slug,
        excerpt: article.summary,
        content: article.content || article.summary,
        category: article.category,
        published: true,
        featured: article.featured || false,
        createdAt: Timestamp.fromDate(articleDate),
        updatedAt: Timestamp.fromDate(new Date()),
        authorId: 'system',
        authorName: article.author,
        imageUrl: article.imageUrl,
        tags: [article.category.toLowerCase().replace(/\s+/g, '-')],
        type: 'article'
      };

      await setDoc(doc(db, 'news', article.id), articleData);
      console.log(`Saved article with ID: ${article.id}`);
    }
    
    // Save events
    for (const event of staticDummyEvents) {
      const eventDate = new Date(event.date);
      
      const eventData = {
        title: event.title,
        excerpt: event.excerpt,
        content: event.content,
        category: event.category,
        published: true,
        featured: event.featured || false,
        createdAt: Timestamp.fromDate(eventDate),
        updatedAt: Timestamp.fromDate(new Date()),
        authorId: 'system',
        authorName: event.author,
        imageUrl: event.imageUrl,
        tags: [event.category.toLowerCase().replace(/\s+/g, '-')],
        type: 'event',
        eventDate: event.eventDate,
        eventTime: event.eventTime,
        eventEndDate: event.eventEndDate,
        eventEndTime: event.eventEndTime,
        eventLocation: event.eventLocation,
        eventAddress: event.eventAddress
      };

      await setDoc(doc(db, 'news', event.id), eventData);
      console.log(`Saved event with ID: ${event.id}`);
    }
    
    console.log('Successfully saved all static content to Firebase!');
  } catch (error) {
    console.error('Error saving content to Firebase:', error);
    throw error;
  }
};

// New function to fetch articles from Firestore
export const fetchArticlesFromFirestore = async (language?: string): Promise<Article[]> => {
  try {
    let q;
    if (language) {
      q = query(
        collection(db, 'news'), 
        where('type', '!=', 'event'),
        where('languages', 'array-contains', language),
        orderBy('type'),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'news'), 
        where('type', '!=', 'event'),
        orderBy('type'),
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

      return {
        id: docSnap.id,
        title: data.title || 'No Title',
        slug: docSnap.id || data.slug,
        summary: data.excerpt || '',
        imageUrl: data.imageUrl,
        category: data.category || 'General',
        languages: data.languages || ['en'], // Default to English array
        date: dateString,
        author: data.authorName || 'Unknown Author',
        featured: data.featured || false,
        content: data.content || '',
      } as Article;
    });
    return articlesData;
  } catch (error) {
    console.error('Error fetching articles from Firestore:', error);
    return staticDummyArticles;
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
        title: data.title || 'No Title',
        slug: data.slug || docSnap.id,
        summary: data.excerpt || '',
        content: data.content || '',
        imageUrl: data.imageUrl,
        category: data.category || 'General',
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
export const dummyArticles = async (): Promise<Article[]> => {
  return await fetchArticlesFromFirestore();
};

export const dummyEvents = [
  {
    id: 'evt1',
    title: 'Annual Church Picnic',
    date: '2024-08-15',
    time: '12:00 PM - 4:00 PM',
    location: 'Central Park, Meadow Lane',
    description: 'Join us for a day of fun, food, and fellowship at our annual church picnic. Games for all ages!',
    category: 'Community',
    imageUrl: '/images/placeholder-event-1.jpg',
  },
  {
    id: 'evt2',
    title: 'Leadership Workshop',
    date: '2024-09-05',
    time: '9:00 AM - 1:00 PM',
    location: 'Church Hall, Room 3',
    description: 'A workshop for aspiring and current leaders within the church, focusing on servant leadership principles.',
    category: 'Workshop',
    imageUrl: '/images/placeholder-event-2.jpg',
  },
  {
    id: 'evt3',
    title: 'Youth Night Revival',
    date: '2024-09-20',
    time: '7:00 PM - 9:00 PM',
    location: 'Main Sanctuary',
    description: 'A special revival night for our youth, featuring guest speakers and worship.',
    category: 'Youth',
    imageUrl: '/images/placeholder-event-3.jpg',
  }
];

// Static dummy events for import
export const staticDummyEvents = [
  {
    id: 'event-1',
    title: 'Annual Church Conference 2024',
    excerpt: 'Join us for our annual church conference featuring inspiring speakers, worship, and fellowship.',
    content: 'Our Annual Church Conference is a time of spiritual renewal and community building. This year\'s theme is "Walking in Faith" and will feature keynote speakers from around the world, worship sessions, breakout workshops, and opportunities for fellowship. The conference will include sessions on spiritual growth, community outreach, and ministry development. Meals will be provided for all attendees. Registration is required and scholarships are available for those in need.',
    category: 'Events',
    author: 'Conference Committee',
    date: '2024-09-15',
    featured: true,
    imageUrl: '/images/conference-2024.jpg',
    eventDate: '2024-09-15',
    eventTime: '09:00',
    eventEndDate: '2024-09-17',
    eventEndTime: '17:00',
    eventLocation: 'Main Sanctuary',
    eventAddress: '3720 Keith Street NW, Cleveland, TN 37312'
  },
  {
    id: 'event-2',
    title: 'Community Food Drive',
    excerpt: 'Help us serve our local community by donating non-perishable food items.',
    content: 'Our monthly community food drive is an opportunity to serve those in need in our local area. We are collecting non-perishable food items, canned goods, and personal care items. All donations will be distributed through our community outreach program to local families in need. Volunteers are also needed to help sort and distribute items. This is a great opportunity for families to serve together and make a difference in our community.',
    category: 'Community Outreach',
    author: 'Outreach Ministry',
    date: '2024-08-10',
    featured: false,
    imageUrl: '/images/food-drive.jpg',
    eventDate: '2024-08-10',
    eventTime: '10:00',
    eventEndDate: '2024-08-10',
    eventEndTime: '14:00',
    eventLocation: 'Fellowship Hall',
    eventAddress: '3720 Keith Street NW, Cleveland, TN 37312'
  },
  {
    id: 'event-3',
    title: 'Youth Summer Camp',
    excerpt: 'A week-long summer camp experience for youth ages 12-18 with activities, worship, and spiritual growth.',
    content: 'Our Youth Summer Camp is designed to provide a transformative experience for young people ages 12-18. The week will include outdoor activities, team building exercises, worship services, Bible studies, and opportunities for spiritual growth. Campers will stay in comfortable cabins and enjoy three meals a day. Activities include hiking, swimming, arts and crafts, sports, and evening campfires. Our experienced youth leaders and counselors will provide guidance and mentorship throughout the week.',
    category: 'Youth Ministry',
    author: 'Youth Pastor',
    date: '2024-07-20',
    featured: true,
    imageUrl: '/images/youth-camp.jpg',
    eventDate: '2024-07-20',
    eventTime: '14:00',
    eventEndDate: '2024-07-26',
    eventEndTime: '11:00',
    eventLocation: 'Camp Ridgecrest',
    eventAddress: 'Ridgecrest Conference Center, North Carolina'
  },
  {
    id: 'event-4',
    title: 'Marriage Enrichment Retreat',
    excerpt: 'A weekend retreat for married couples to strengthen their relationships and grow together.',
    content: 'Join us for a weekend of marriage enrichment designed to help couples strengthen their relationships and deepen their connection. The retreat will feature sessions on communication, conflict resolution, intimacy, and spiritual growth as a couple. Experienced marriage counselors and pastors will lead workshops and provide guidance. The retreat includes comfortable accommodations, all meals, and childcare for families with young children. This is an investment in your marriage that will pay dividends for years to come.',
    category: 'Ministry Updates',
    author: 'Family Ministry',
    date: '2024-10-05',
    featured: false,
    imageUrl: '/images/marriage-retreat.jpg',
    eventDate: '2024-10-05',
    eventTime: '18:00',
    eventEndDate: '2024-10-06',
    eventEndTime: '16:00',
    eventLocation: 'Mountain View Retreat Center',
    eventAddress: 'Mountain View Retreat Center, Gatlinburg, TN'
  },
  {
    id: 'event-5',
    title: 'Christmas Cantata Performance',
    excerpt: 'Our church choir presents a beautiful Christmas cantata celebrating the birth of Jesus.',
    content: 'Experience the joy and wonder of Christmas through music as our church choir presents a beautiful cantata celebrating the birth of our Savior. This special performance will feature traditional Christmas carols, contemporary worship songs, and dramatic readings that tell the story of Jesus\' birth. The choir has been preparing for months under the direction of our music minister. The performance will include special lighting, costumes, and staging to create a memorable worship experience for the whole family.',
    category: 'Announcements',
    author: 'Music Ministry',
    date: '2024-12-15',
    featured: true,
    imageUrl: '/images/christmas-cantata.jpg',
    eventDate: '2024-12-15',
    eventTime: '19:00',
    eventEndDate: '2024-12-15',
    eventEndTime: '20:30',
    eventLocation: 'Main Sanctuary',
    eventAddress: '3720 Keith Street NW, Cleveland, TN 37312'
  },
  {
    id: 'event-6',
    title: 'Prayer and Fasting Week',
    excerpt: 'Join us for a week of focused prayer and fasting as we seek God\'s direction for our church.',
    content: 'We invite you to join us for a special week of prayer and fasting as we seek God\'s direction and blessing for our church and community. Each evening will feature a prayer service with different focuses: Monday - Personal Renewal, Tuesday - Family and Relationships, Wednesday - Church Unity, Thursday - Community Outreach, Friday - Global Missions. Fasting guidelines and resources will be provided for those who choose to participate. This is a time to draw closer to God and experience His presence in a powerful way.',
    category: 'Prayer Requests',
    author: 'Prayer Ministry',
    date: '2024-11-10',
    featured: false,
    imageUrl: '/images/prayer-week.jpg',
    eventDate: '2024-11-10',
    eventTime: '19:00',
    eventEndDate: '2024-11-15',
    eventEndTime: '20:00',
    eventLocation: 'Prayer Chapel',
    eventAddress: '3720 Keith Street NW, Cleveland, TN 37312'
  }
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

export interface Event {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  languages?: string[];
  published: boolean;
  featured: boolean;
  createdAt: any;
  updatedAt: any;
  authorId: string;
  authorName: string;
  imageUrl?: string;
  tags: string[];
  type: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventAddress?: string;
  eventEndDate?: string;
  eventEndTime?: string;
}

// Function to fetch events from Firestore
export const fetchEventsFromFirestore = async (language?: string): Promise<Event[]> => {
  try {
    let q;
    if (language) {
      q = query(
        collection(db, 'news'), 
        where('languages', 'array-contains', language),
        orderBy('eventDate', 'asc')
      );
    } else {
      q = query(
        collection(db, 'news'), 
        orderBy('eventDate', 'asc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const eventsData = querySnapshot.docs
      .map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data
        } as Event;
      })
      .filter(item => item.type === 'event' && item.published)
      .filter(event => {
        // Only show future events
        const eventDate = new Date(event.eventDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
      });
    
    return eventsData;
  } catch (error) {
    console.error('Error fetching events from Firestore:', error);
    return [];
  }
};

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

// Function to fetch a single event by ID from Firestore
export const fetchEventById = async (id: string): Promise<Event | null> => {
  try {
    const docRef = doc(db, 'news', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Only return if it's an event type
      if (data.type !== 'event') {
        console.log(`Document with ID '${id}' is not an event.`);
        return null;
      }

      return {
        id: docSnap.id,
        ...data
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