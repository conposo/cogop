const fs = require('fs');
const path = require('path');

const pages = {
  'get-connected': {
    calendar: 'Calendar',
    contact: 'Contact Us',
    faq: 'Frequently Asked Questions',
    employment: 'Employment Opportunities',
    'schedule-tour': 'Schedule a Tour'
  },
  about: {
    'who-we-are': 'Who We Are',
    'what-we-believe': 'What We Believe',
    leadership: 'Our Leadership',
    history: 'Our History',
    membership: 'Membership'
  },
  ministries: {
    'admin-finance': 'Administration & Finance',
    'global-missions': 'Global Missions',
    'harvest-partners': 'Harvest Partners',
    'helping-hands': 'Helping Hands',
    'one-child-fund': 'One Child Fund',
    heritage: 'Heritage',
    'fields-of-the-wood': 'Fields of the Wood',
    stewardship: 'Stewardship',
    bookstore: 'Bookstore',
    library: 'Library',
    'global-communications': 'Global Communications',
    'white-wing-messenger': 'White Wing Messenger',
    prayer: 'Prayer',
    'international-assembly': 'International Assembly',
    'leadership-development': 'Leadership Development',
    'accredited-ministries': 'Accredited Ministries',
    'center-biblical-leadership': 'Center for Biblical Leadership',
    'spirit-life-seminary': 'Spirit & Life Seminary',
    childrens: "Children's Ministries",
    youth: 'Youth Ministries'
  },
  'where-we-serve': {
    'presiding-bishop': 'Presiding Bishop',
    africa: 'Africa',
    'asia-australia-oceania': 'Asia, Australia & Oceania',
    'caribbean-atlantic': 'Caribbean & Atlantic',
    'central-america': 'Central America',
    'north-america': 'North America',
    'south-america': 'South America',
    'europe-middle-east': 'Europe & Middle East'
  },
  resources: {
    'get-started': 'Get Started',
    'how-to-know-god': 'How to Know God',
    membership: 'Membership',
    media: 'Media',
    podcasts: 'Podcasts',
    youtube: 'YouTube',
    library: 'Library',
    'assembly-documents': 'Assembly Documents',
    'policies-guidelines': 'Policies & Guidelines',
    'public-statements': 'Public Statements',
    'assembly-minutes': 'Assembly Minutes',
    'church-resources': 'Church Resources',
    'church-locator': 'Church Locator',
    'church-logos': 'Church Logos',
    'treasurers-report': "Treasurer's Report",
    directory: 'Directory'
  },
  give: null
};

const pageTemplate = (pagePath) => `import { getPageContent } from '@/lib/content';
import PageLayout from '@/components/PageLayout';

export function generateMetadata() {
  const pageContent = getPageContent('${pagePath}');
  return {
    title: pageContent.title + ' | Church of God of Prophecy',
    description: pageContent.description,
  };
}

export default function Page() {
  const pageContent = getPageContent('${pagePath}');
  
  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
    >
      <div className="row">
        <div className="col-12">
          {pageContent.content ? (
            <div dangerouslySetInnerHTML={{ __html: pageContent.content }} />
          ) : (
            <p>Content coming soon...</p>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
`;

const generatePages = () => {
  const baseDir = path.join(process.cwd(), 'src', 'app');

  // Generate pages for each section
  Object.entries(pages).forEach(([section, subPages]) => {
    const sectionDir = path.join(baseDir, section);

    // Create page.tsx for main section
    fs.writeFileSync(
      path.join(sectionDir, 'page.tsx'),
      pageTemplate(section)
    );

    // Create pages for subsections
    if (subPages) {
      Object.entries(subPages).forEach(([subPage, title]) => {
        const subPageDir = path.join(sectionDir, subPage);
        fs.writeFileSync(
          path.join(subPageDir, 'page.tsx'),
          pageTemplate(`${section}/${subPage}`)
        );
      });
    }
  });
};

generatePages(); 