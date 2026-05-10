const fs = require('fs');
const path = require('path');

const pages = [
  // Get Connected Section
  { path: 'get-connected', title: 'Get Connected' },
  { path: 'get-connected/calendar', title: 'Calendar' },
  { path: 'get-connected/contact', title: 'Contact Us' },
  { path: 'get-connected/faq', title: 'FAQ' },
  { path: 'get-connected/employment', title: 'Employment' },
  { path: 'get-connected/schedule-tour', title: 'Schedule a Tour' },

  // About Section
  { path: 'about', title: 'About Us' },
  { path: 'about/who-we-are', title: 'Who We Are' },
  { path: 'about/what-we-believe', title: 'What We Believe' },
  { path: 'about/leadership', title: 'Our Leadership' },
  { path: 'about/history', title: 'Our History' },
  { path: 'about/membership', title: 'Membership' },

  // Ministries Section - All from Navigation
  { path: 'ministries', title: 'Our Ministries' },
  { path: 'ministries/admin-finance', title: 'Administration & Finance' },
  { path: 'ministries/global-missions', title: 'Global Missions' },
  { path: 'ministries/harvest-partners', title: 'Harvest Partners' },
  { path: 'ministries/helping-hands', title: 'Helping Hands' },
  { path: 'ministries/one-child-fund', title: 'One Child Fund' },
  { path: 'ministries/heritage', title: 'Heritage' },
  { path: 'ministries/fields-of-the-wood', title: 'Fields of the Wood' },
  { path: 'ministries/stewardship', title: 'Stewardship' },
  { path: 'ministries/bookstore', title: 'Bookstore' },
  { path: 'ministries/library', title: 'Library' },
  { path: 'ministries/global-communications', title: 'Global Communications' },
  { path: 'ministries/white-wing-messenger', title: 'White Wing Messenger' },
  { path: 'ministries/prayer', title: 'Prayer' },
  { path: 'ministries/international-assembly', title: 'International Assembly' },
  { path: 'ministries/leadership-development', title: 'Leadership Development' },
  { path: 'ministries/accredited-ministries', title: 'Accredited Ministries' },
  { path: 'ministries/center-biblical-leadership', title: 'Center for Biblical Leadership' },
  { path: 'ministries/spirit-life-seminary', title: 'Spirit & Life Seminary' },
  { path: 'ministries/childrens', title: 'Children\'s Ministry' },
  { path: 'ministries/youth', title: 'Youth Ministry' },
  { path: 'ministries/seminary', title: 'Seminary' },
  { path: 'ministries/children', title: 'Children\'s Ministry' },
  { path: 'ministries/womens', title: 'Women\'s Ministry' },
  { path: 'ministries/mens', title: 'Men\'s Ministry' },
  { path: 'ministries/music', title: 'Music Ministry' },
  { path: 'ministries/discipleship', title: 'Discipleship' },
  { path: 'ministries/evangelism', title: 'Evangelism' },
  { path: 'ministries/care', title: 'Care Ministry' },
  { path: 'ministries/bible-training', title: 'Bible Training' },
  { path: 'ministries/international-ministries', title: 'International Ministries' },
  { path: 'ministries/local-outreach', title: 'Local Outreach' },
  { path: 'ministries/social-action', title: 'Social Action' },
  { path: 'ministries/disaster-relief', title: 'Disaster Relief' },
  { path: 'ministries/chaplaincy', title: 'Chaplaincy' },

  // Where We Serve Section - All from Navigation
  { path: 'where-we-serve', title: 'Where We Serve' },
  { path: 'where-we-serve/presiding-bishop', title: 'Presiding Bishop' },
  { path: 'where-we-serve/africa', title: 'Africa' },
  { path: 'where-we-serve/asia-australia-oceania', title: 'Asia, Australia & Oceania' },
  { path: 'where-we-serve/caribbean-atlantic', title: 'Caribbean & Atlantic' },
  { path: 'where-we-serve/central-america', title: 'Central America' },
  { path: 'where-we-serve/north-america', title: 'North America' },
  { path: 'where-we-serve/south-america', title: 'South America' },
  { path: 'where-we-serve/europe-middle-east', title: 'Europe & Middle East' },
  { path: 'where-we-serve/asia', title: 'Asia' },
  { path: 'where-we-serve/caribbean', title: 'Caribbean' },
  { path: 'where-we-serve/europe', title: 'Europe' },
  { path: 'where-we-serve/oceania', title: 'Oceania' },
  { path: 'where-we-serve/middle-east', title: 'Middle East' },

  // Resources Section - All from Navigation
  { path: 'resources', title: 'Resources' },
  { path: 'resources/get-started', title: 'Get Started' },
  { path: 'resources/how-to-know-god', title: 'How to Know God' },
  { path: 'resources/membership', title: 'Membership' },
  { path: 'resources/media', title: 'Media' },
  { path: 'resources/podcasts', title: 'Podcasts' },
  { path: 'resources/youtube', title: 'YouTube' },
  { path: 'resources/library', title: 'Library' },
  { path: 'resources/assembly-documents', title: 'Assembly Documents' },
  { path: 'resources/policies-guidelines', title: 'Policies & Guidelines' },
  { path: 'resources/public-statements', title: 'Public Statements' },
  { path: 'resources/assembly-minutes', title: 'Assembly Minutes' },
  { path: 'resources/church-resources', title: 'Church Resources' },
  { path: 'resources/church-locator', title: 'Church Locator' },
  { path: 'resources/church-logos', title: 'Church Logos' },
  { path: 'resources/treasurers-report', title: 'Treasurer\'s Report' },
  { path: 'resources/directory', title: 'Directory' },
  { path: 'resources/baptism', title: 'Baptism' },
  { path: 'resources/bible-study', title: 'Bible Study' },
  { path: 'resources/prayer', title: 'Prayer' },
  { path: 'resources/fasting', title: 'Fasting' },
  { path: 'resources/white-wing-messenger', title: 'White Wing Messenger' },
  { path: 'resources/policies', title: 'Policies' },
  { path: 'resources/forms', title: 'Forms' },
  { path: 'resources/annual-reports', title: 'Annual Reports' },
  { path: 'resources/financial-information', title: 'Financial Information' },
  { path: 'resources/legal-notices', title: 'Legal Notices' },
  { path: 'resources/downloads', title: 'Downloads' },
  { path: 'resources/links', title: 'Helpful Links' },
  { path: 'resources/contact-directory', title: 'Contact Directory' },

  // Additional pages
  { path: 'give', title: 'Give' },
  { path: 'find-a-church', title: 'Find a Church' },
];

function generatePageContent(pagePath, title) {
  return `'use client'

import { useContent, getPageContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'

export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  const pageContent = getPageContent('${pagePath}')

  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
    >
      <div dangerouslySetInnerHTML={{ __html: pageContent.content || '<p>Content coming soon...</p>' }} />
    </PageLayout>
  )
}
`;
}

// Create directories and pages
pages.forEach(page => {
  const filePath = path.join('src', 'app', page.path, 'page.tsx');
  const dir = path.dirname(filePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Generate and write page content
  const content = generatePageContent(page.path, page.title);
  fs.writeFileSync(filePath, content);
  
  console.log(`Generated: ${filePath}`);
});

console.log(`Successfully generated ${pages.length} pages!`); 