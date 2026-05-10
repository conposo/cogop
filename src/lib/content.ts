// Server-side content provider for metadata generation
// This mirrors the ContentContext but works in server components

import { PageContent } from '@/lib/metadata'

interface ContentData {
  pages: Record<string, PageContent>
}

// This should match the structure from ContentContext
export const getServerContentData = (): ContentData => ({
  pages: {
    // Get Connected Section
    'get-connected': {
      title: 'Get Connected',
      description: 'Connect with the Church of God of Prophecy community and discover ways to get involved.',
      keywords: ['get connected', 'church community', 'involvement', 'contact'],
    },
    'get-connected/calendar': {
      title: 'Calendar',
      description: 'Stay updated with upcoming events, services, and important dates in our church calendar.',
      keywords: ['calendar', 'events', 'church services', 'dates'],
    },
    'get-connected/contact': {
      title: 'Contact Us',
      description: 'Reach out to us with your questions, prayer requests, or to learn more about our church.',
      keywords: ['contact', 'questions', 'prayer requests', 'church information'],
    },
    'get-connected/faq': {
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions about our church, beliefs, and ministries.',
      keywords: ['faq', 'questions', 'answers', 'church information'],
    },
    'get-connected/employment': {
      title: 'Employment',
      description: 'Explore career opportunities within our organization.',
      keywords: ['employment', 'careers', 'jobs', 'opportunities'],
    },
    'get-connected/schedule-tour': {
      title: 'Schedule a Tour',
      description: 'Visit our facilities and learn about our community.',
      keywords: ['tour', 'visit', 'facilities', 'community'],
    },

    // About Section
    'about': {
      title: 'About Us',
      description: 'Learn about our identity, beliefs, and mission as a global church movement.',
      keywords: ['about', 'identity', 'beliefs', 'mission', 'church movement'],
    },
    'about/who-we-are': {
      title: 'Who We Are',
      description: 'Discover our identity as a Christ-centered, Spirit-led global movement.',
      keywords: ['identity', 'christ-centered', 'spirit-led', 'global movement'],
    },
    'about/what-we-believe': {
      title: 'What We Believe',
      description: 'Explore our core beliefs, doctrine, and theological foundations.',
      keywords: ['beliefs', 'doctrine', 'theology', 'faith'],
    },
    'about/leadership': {
      title: 'Our Leadership',
      description: 'Meet the leaders who guide and serve our global church community.',
      keywords: ['leadership', 'leaders', 'pastors', 'bishops'],
    },
    'about/history': {
      title: 'Our History',
      description: 'Journey through the rich history of the Church of God of Prophecy.',
      keywords: ['history', 'heritage', 'church history', 'timeline'],
    },
    'about/membership': {
      title: 'Membership',
      description: 'Learn about becoming a member of our global church family.',
      keywords: ['membership', 'joining', 'church family', 'community'],
    },

    // Ministries Section
    'ministries': {
      title: 'Our Ministries',
      description: 'Discover our various ministries serving communities worldwide.',
      keywords: ['ministries', 'service', 'global ministry', 'community service'],
    },
    'ministries/global-missions': {
      title: 'Global Missions',
      description: 'Discover our worldwide mission work and evangelism efforts across 135 countries.',
      keywords: ['global missions', 'evangelism', 'worldwide ministry', '135 countries'],
    },
    'ministries/harvest-partners': {
      title: 'Harvest Partners',
      description: 'Supporting missionaries and ministry partners around the world.',
      keywords: ['harvest partners', 'missionaries', 'ministry partners', 'support'],
    },
    'ministries/helping-hands': {
      title: 'Helping Hands',
      description: 'Disaster relief and humanitarian assistance ministry.',
      keywords: ['helping hands', 'disaster relief', 'humanitarian aid', 'assistance'],
    },
    'ministries/one-child-fund': {
      title: 'One Child Fund',
      description: 'Supporting children and families in need around the world.',
      keywords: ['one child fund', 'children', 'families', 'support', 'charity'],
    },
    'ministries/heritage': {
      title: 'Heritage',
      description: 'Preserving and sharing the history of the Church of God of Prophecy.',
      keywords: ['heritage', 'history', 'preservation', 'church history'],
    },
    'ministries/fields-of-the-wood': {
      title: 'Fields of the Wood',
      description: 'A biblical theme park and retreat center in Murphy, North Carolina.',
      keywords: ['fields of the wood', 'biblical theme park', 'retreat center', 'north carolina'],
    },
    'ministries/stewardship': {
      title: 'Stewardship',
      description: 'Teaching biblical principles of stewardship and financial responsibility.',
      keywords: ['stewardship', 'financial responsibility', 'biblical principles', 'giving'],
    },
    'ministries/bookstore': {
      title: 'Bookstore',
      description: 'Christian books, resources, and materials for spiritual growth.',
      keywords: ['bookstore', 'christian books', 'resources', 'spiritual growth'],
    },
    'ministries/library': {
      title: 'Library',
      description: 'Digital library of books, articles, and educational materials for ministry.',
      keywords: ['library', 'digital library', 'books', 'theological resources', 'ministry'],
    },
    'ministries/global-communications': {
      title: 'Global Communications',
      description: 'Connecting our worldwide church through media and communications.',
      keywords: ['global communications', 'media', 'communications', 'worldwide church'],
    },
    'ministries/white-wing-messenger': {
      title: 'White Wing Messenger',
      description: 'Our official church publication sharing news, inspiration, and teaching.',
      keywords: ['white wing messenger', 'publication', 'church news', 'inspiration'],
    },
    'ministries/prayer': {
      title: 'Prayer',
      description: 'Connecting believers worldwide through the power of prayer.',
      keywords: ['prayer', 'intercession', 'believers', 'worldwide prayer'],
    },
    'ministries/international-assembly': {
      title: 'International Assembly',
      description: 'Our global church gathering held every four years.',
      keywords: ['international assembly', 'global gathering', 'church conference'],
    },
    'ministries/leadership-development': {
      title: 'Leadership Development',
      description: 'Training and equipping leaders for effective ministry worldwide.',
      keywords: ['leadership development', 'training', 'ministry leadership', 'equipping'],
    },
    'ministries/accredited-ministries': {
      title: 'Accredited Ministries',
      description: 'Officially recognized ministries and institutions.',
      keywords: ['accredited ministries', 'recognized ministries', 'institutions'],
    },
    'ministries/center-biblical-leadership': {
      title: 'Center for Biblical Leadership',
      description: 'Developing leaders through biblical principles and practical training.',
      keywords: ['biblical leadership', 'leadership development', 'biblical principles'],
    },
    'ministries/spirit-life-seminary': {
      title: 'Spirit & Life Seminary',
      description: 'Training ministers for effective service in the 21st century.',
      keywords: ['seminary', 'minister training', 'theological education', 'ministry preparation'],
    },
    'ministries/childrens': {
      title: "Children's Ministry",
      description: 'Nurturing faith in the hearts of our youngest members.',
      keywords: ['children ministry', 'kids', 'youth faith', 'children education'],
    },
    'ministries/youth': {
      title: 'Youth Ministry',
      description: 'Empowering young people to grow in faith and leadership.',
      keywords: ['youth ministry', 'young people', 'youth leadership', 'faith development'],
    },

    // Where We Serve Section
    'where-we-serve': {
      title: 'Where We Serve',
      description: 'Explore our global presence and ministry impact.',
      keywords: ['global presence', 'ministry impact', 'worldwide service'],
    },
    'where-we-serve/presiding-bishop': {
      title: 'Presiding Bishop',
      description: 'Leadership and oversight of our global church movement.',
      keywords: ['presiding bishop', 'church leadership', 'global oversight'],
    },
    'where-we-serve/africa': {
      title: 'Africa',
      description: 'Ministry and church growth across the African continent.',
      keywords: ['africa', 'african ministry', 'church growth', 'continent'],
    },
    'where-we-serve/asia-australia-oceania': {
      title: 'Asia, Australia & Oceania',
      description: 'Spreading the Gospel across Asia, Australia, and the Pacific islands.',
      keywords: ['asia', 'australia', 'oceania', 'pacific islands', 'gospel'],
    },
    'where-we-serve/caribbean-atlantic': {
      title: 'Caribbean & Atlantic',
      description: 'Island ministries throughout the Caribbean and Atlantic regions.',
      keywords: ['caribbean', 'atlantic', 'island ministries', 'regions'],
    },
    'where-we-serve/central-america': {
      title: 'Central America',
      description: 'Church growth and ministry throughout Central America.',
      keywords: ['central america', 'church growth', 'ministry'],
    },
    'where-we-serve/north-america': {
      title: 'North America',
      description: 'Ministry throughout the United States, Canada, and Mexico.',
      keywords: ['north america', 'united states', 'canada', 'mexico'],
    },
    'where-we-serve/south-america': {
      title: 'South America',
      description: 'Dynamic church growth across South American nations.',
      keywords: ['south america', 'church growth', 'nations'],
    },
    'where-we-serve/europe-middle-east': {
      title: 'Europe & Middle East',
      description: 'Ministry in challenging and diverse cultural contexts.',
      keywords: ['europe', 'middle east', 'cultural ministry', 'diverse contexts'],
    },

    // Resources Section
    'resources': {
      title: 'Resources',
      description: 'Access educational materials, documents, and spiritual resources.',
      keywords: ['resources', 'educational materials', 'documents', 'spiritual resources'],
    },
    'resources/get-started': {
      title: 'Get Started',
      description: 'Begin your journey with the Church of God of Prophecy.',
      keywords: ['get started', 'journey', 'beginning', 'church introduction'],
    },
    'resources/how-to-know-god': {
      title: 'How to Know God',
      description: 'Discover a personal relationship with Jesus Christ.',
      keywords: ['know god', 'personal relationship', 'jesus christ', 'salvation'],
    },
    'resources/membership': {
      title: 'Membership',
      description: 'Learn about becoming a member of our global church family.',
      keywords: ['membership', 'church family', 'joining'],
    },
    'resources/media': {
      title: 'Media',
      description: 'Videos, audio, and multimedia resources for spiritual growth.',
      keywords: ['media', 'videos', 'audio', 'multimedia', 'spiritual growth'],
    },
    'resources/podcasts': {
      title: 'Podcasts',
      description: 'Listen to inspiring messages and teachings from our leaders.',
      keywords: ['podcasts', 'messages', 'teachings', 'audio content'],
    },
    'resources/youtube': {
      title: 'YouTube',
      description: 'Watch our latest videos and live streams.',
      keywords: ['youtube', 'videos', 'live streams', 'video content'],
    },
    'resources/library': {
      title: 'Library',
      description: 'Access our digital library of books, articles, and educational materials.',
      keywords: ['library', 'digital library', 'books', 'articles', 'educational materials'],
    },
    'resources/assembly-documents': {
      title: 'Assembly Documents',
      description: 'Official documents and proceedings from our International Assembly.',
      keywords: ['assembly documents', 'official documents', 'international assembly'],
    },
    'resources/policies-guidelines': {
      title: 'Policies & Guidelines',
      description: 'Official church policies and ministry guidelines.',
      keywords: ['policies', 'guidelines', 'church policies', 'ministry guidelines'],
    },
    'resources/public-statements': {
      title: 'Public Statements',
      description: 'Official statements on important issues and current events.',
      keywords: ['public statements', 'official statements', 'current events'],
    },
    'resources/assembly-minutes': {
      title: 'Assembly Minutes',
      description: 'Minutes and records from assembly meetings.',
      keywords: ['assembly minutes', 'meeting records', 'minutes'],
    },
    'resources/church-resources': {
      title: 'Church Resources',
      description: 'Tools and materials for local church ministry.',
      keywords: ['church resources', 'ministry tools', 'local church', 'materials'],
    },
    'resources/church-locator': {
      title: 'Church Locator',
      description: 'Find a Church of God of Prophecy congregation near you.',
      keywords: ['church locator', 'find church', 'congregation', 'local church'],
    },
    'resources/church-logos': {
      title: 'Church Logos',
      description: 'Official logos and branding materials for church use.',
      keywords: ['church logos', 'branding', 'official logos', 'materials'],
    },
    'resources/treasurers-report': {
      title: "Treasurer's Report",
      description: 'Financial reports and transparency information.',
      keywords: ['treasurers report', 'financial reports', 'transparency'],
    },
    'resources/directory': {
      title: 'Directory',
      description: 'Contact information for church leaders and offices worldwide.',
      keywords: ['directory', 'contact information', 'church leaders', 'offices'],
    },

    // Give
    'give': {
      title: 'Give',
      description: 'Support the ministry through your generous giving.',
      keywords: ['give', 'giving', 'support', 'ministry support', 'donations'],
    },
  }
})

export function getPageContent(path: string): PageContent {
  const staticData = getServerContentData()
  return staticData.pages[path] || {
    title: 'Page Not Found',
    description: 'The requested page could not be found.',
    keywords: ['page not found', '404'],
  }
} 