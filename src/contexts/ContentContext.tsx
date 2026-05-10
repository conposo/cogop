'use client';

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { t } from '@/lib/i18n';
import { fetchArticlesFromFirestore, fetchEventsFromFirestore, Article, Event, MultilingualString } from '@/lib/dummyContent';

export interface PageContent {
  title: string;
  description: string;
  content?: string;
  backgroundImage?: string;
  sections?: Array<{
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  }>;
  faq?: {
    introduction: string;
    categories: Array<{
      title: string;
      questions: Array<{
        id: string;
        question: string;
        answer: string;
        isExpanded?: boolean;
      }>;
    }>;
  };
}

interface ContentContextType {
  pages: {
    [key: string]: PageContent;
  };
  stats: Array<{
    label: string;
    value: string;
  }>;
  mainCTAs: Array<{
    label: string;
    link: string;
    icon: string;
  }>;
  callToActions: {
    title: string;
    description: string;
    buttons: Array<{
      text: string;
      link: string;
      variant: 'primary' | 'outline' | 'dark';
      icon?: string;
    }>;
  };
  articles: Article[];
  events: Event[];
  podcasts: Array<{
    series: string;
    host: string;
    title: string;
    description: string;
  }>;
  carousel: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    buttonText?: string;
    buttonLink?: string;
  }>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

// Helper function to get localized string or fallback
const getLocalizedString = (field: MultilingualString | string | undefined, lang: string, fallbackLang: string = 'en'): string => {
  if (!field) return '';
  if (typeof field === 'string') return field; // Handle legacy string format
  if (typeof field === 'object' && field !== null) {
    // Handle multilingual object format
    return field[lang] || field[fallbackLang] || Object.values(field)[0] || '';
  }
  return '';
};

const getContentData = (): ContentContextType => ({
  // Global statistics
  stats: [
    { label: t('countries', { defaultValue: 'Countries' }), value: '135' },
    { label: t('churches_and_missions', { defaultValue: 'Churches and Missions' }), value: '12k' },
    { label: t('members_around_world', { defaultValue: 'Members Around the World' }), value: '1.5m' },
    { label: t('languages', { defaultValue: 'Languages' }), value: '130' },
  ],

  mainCTAs: [
    { label: t('start_here', { defaultValue: 'Get Connected' }), link: '/get-connected', icon: 'bi bi-house' },
    { label: t('about', { defaultValue: 'About' }), link: '/about', icon: 'bi bi-envelope' },
    { label: t('ministries', { defaultValue: 'Ministries' }), link: '/ministries', icon: 'bi bi-person-plus' },
    { label: t('resources', { defaultValue: 'Resources' }), link: '/resources', icon: 'bi bi-geo-alt' },
  ],

  callToActions: {
    title: t('faq_still_have_questions', { defaultValue: 'Still Have Questions?' }),
    description: t('faq_here_to_help', { defaultValue: 'We\'re here to help! Don\'t hesitate to reach out with any questions about our church, beliefs, or how to get involved.' }),
    buttons: [
      {
        text: t('faq_contact_us', { defaultValue: 'Contact Us' }),
        link: "/get-connected/contact",
        variant: "dark",
        icon: "bi bi-envelope"
      },
    ]
    },

  // Carousel slides for hero section
  carousel: [
    {
      id: 1,
      title: t('hero_title_1', { defaultValue: 'We are the Church of God of Prophecy' }),
      description: t('hero_desc_1', { defaultValue: 'This 24-page booklet is a guide for anyone interested in understanding who we are, what we believe, and how we live out our mission together.' }),
      // image: 'https://firebasestorage.googleapis.com/v0/b/cogop-beta.firebasestorage.app/o/news-images%2F1748511359680-slider-01.webp?alt=media&token=182e1e9f-a315-49e7-b58a-79388c9c73ee',
      image: 'https://cogop.org/wp-content/uploads/2025/03/slider-01.webp',
      buttonText: t('hero_btn_1', { defaultValue: 'See more' }),
      buttonLink: '/booklet'
    },
    {
      id: 2,
      title: t('hero_title_2', { defaultValue: 'Global Community of Faith' }),
      description: t('hero_desc_2', { defaultValue: 'Join us as we serve Christ in 135 countries with over 12,000 churches and missions worldwide.' }),
      image: 'https://cogop.org/wp-content/uploads/2025/03/slider-01.webp',
      buttonText: t('hero_btn_2', { defaultValue: 'Learn More' }),
      buttonLink: '/about/who-we-are'
    },
    {
      id: 3,
      title: t('hero_title_3', { defaultValue: 'Spirit-Led Ministry' }),
      description: t('hero_desc_3', { defaultValue: 'Discover how we are fulfilling the Great Commission through the power of the Holy Spirit.' }),
      image: 'https://cogop.org/wp-content/uploads/2025/03/slider-01.webp',
      buttonText: t('hero_btn_3', { defaultValue: 'Our Mission' }),
      buttonLink: '/about'
    }
  ],

  // Podcasts
  podcasts: [
    {
      series: t('sound_doctrine_series', { defaultValue: 'Sound Doctrine' }),
      host: 'Rev. Elva Howard',
      title: t('sound_doctrine_title', { defaultValue: "Time? New Testament O'Clock (1981)" }),
      description: t('sound_doctrine_desc', { defaultValue: 'Step back to the 2000 International Assembly as Bishop Tedroy Powell opens the gathering with a stirring message rooted in Matthew 5:3.' })
    },
    {
      series: t('white_wing_podcast_series', { defaultValue: 'White Wing Messenger Podcast' }),
      host: 'Marsha Robinson',
      title: t('white_wing_podcast_title', { defaultValue: 'The Call: To Send and Support' }),
      description: t('white_wing_podcast_desc', { defaultValue: "Join podcast host Managing Editor Marsha Robinson as we end the month of April with a roundtable discussion of this month's White Wing Messenger." })
    }
  ],

  // All page content
  pages: {
    // Get Connected Section
    'get-connected': {
      title: t('get_connected_title', { defaultValue: 'Get Connected' }),
      description: t('get_connected_description', { defaultValue: 'Connect with the Church of God of Prophecy community and discover ways to get involved.' }),
      sections: [
        {
          title: t('calendar', { defaultValue: 'Calendar' }),
          description: t('stay_updated', { defaultValue: 'Stay updated with upcoming events, services, and important dates.' }),
          buttonText: t('view_calendar', { defaultValue: 'View Calendar' }),
          buttonLink: '/get-connected/calendar'
        },
        {
          title: t('contact_us', { defaultValue: 'Contact Us' }),
          description: t('reach_out', { defaultValue: 'Reach out with questions, prayer requests, or to learn more.' }),
          buttonText: t('contact_us', { defaultValue: 'Contact Us' }),
          buttonLink: '/get-connected/contact'
        },
        {
          title: t('employment', { defaultValue: 'Employment' }),
          description: t('explore_career', { defaultValue: 'Explore career opportunities within our organization.' }),
          buttonText: t('view_opportunities', { defaultValue: 'View Opportunities' }),
          buttonLink: '/get-connected/employment'
        },
        {
          title: t('schedule_tour', { defaultValue: 'Schedule a Tour' }),
          description: t('visit_facilities', { defaultValue: 'Visit our facilities and learn about our community.' }),
          buttonText: t('schedule_tour', { defaultValue: 'Schedule Tour' }),
          buttonLink: '/get-connected/schedule-tour'
        }
      ],
      content: `
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="card-title">${t('calendar', { defaultValue: 'Calendar' })}</h3>
                <p class="card-text">${t('stay_updated', { defaultValue: 'Stay updated with upcoming events, services, and important dates.' })}</p>
                <a href="/get-connected/calendar" class="btn btn-dark">${t('view_calendar', { defaultValue: 'View Calendar' })}</a>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="card-title">${t('contact_us', { defaultValue: 'Contact Us' })}</h3>
                <p class="card-text">${t('reach_out', { defaultValue: 'Reach out with questions, prayer requests, or to learn more.' })}</p>
                <a href="/get-connected/contact" class="btn btn-dark">${t('contact_us', { defaultValue: 'Contact Us' })}</a>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="card-title">${t('employment', { defaultValue: 'Employment' })}</h3>
                <p class="card-text">${t('explore_career', { defaultValue: 'Explore career opportunities within our organization.' })}</p>
                <a href="/get-connected/employment" class="btn btn-dark">${t('view_opportunities', { defaultValue: 'View Opportunities' })}</a>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="card-title">${t('schedule_tour', { defaultValue: 'Schedule a Tour' })}</h3>
                <p class="card-text">${t('visit_facilities', { defaultValue: 'Visit our facilities and learn about our community.' })}</p>
                <a href="/get-connected/schedule-tour" class="btn btn-dark">${t('schedule_tour', { defaultValue: 'Schedule Tour' })}</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    'get-connected/calendar': {
      title: t('calendar_title', { defaultValue: 'Calendar' }),
      description: t('calendar_description', { defaultValue: 'Stay updated with upcoming events, services, and important dates in our church calendar.' }),
      content: `<p>${t('calendar_content_coming_soon', { defaultValue: 'Calendar content coming soon...' })}</p>`
    },
    'get-connected/contact': {
      title: t('contact_us_title', { defaultValue: 'Contact Us' }),
      description: t('contact_us_description', { defaultValue: 'Reach out to us with your questions, prayer requests, or to learn more about our church.' }),
      content: `
        <div class="row">
          <div class="col-md-6">
            <h3>${t('physical_address', { defaultValue: 'Physical Address' })}</h3>
            <p>ул. Аксаков 8<br>Русе, 7012<br>${t('phone', { defaultValue: 'Phone' })}: (359) 888-888-888</p>
            
            <h3>${t('mailing_address', { defaultValue: 'Mailing Address' })}</h3>
            <p>ул. Аксаков 8<br>Русе, 7012</p>
          </div>
          <div class="col-md-6">
            <h3>${t('contact_form', { defaultValue: 'Contact Form' })}</h3>
            <form>
              <div class="mb-3">
                <label for="name" class="form-label">${t('name', { defaultValue: 'Name' })}</label>
                <input type="text" class="form-control" id="name" required>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">${t('email_label', { defaultValue: 'Email' })}</label>
                <input type="email" class="form-control" id="email" required>
              </div>
              <div class="mb-3">
                <label for="message" class="form-label">${t('message_label', { defaultValue: 'Message' })}</label>
                <textarea class="form-control" id="message" rows="4" required></textarea>
              </div>
              <button type="submit" class="btn btn-dark">${t('send_message', { defaultValue: 'Send Message' })}</button>
            </form>
          </div>
        </div>
      `
    },
    'get-connected/faq': {
      title: t('faq_title', { defaultValue: 'Frequently Asked Questions' }),
      description: t('faq_description', { defaultValue: 'Find answers to common questions about our church, beliefs, and services.' }),
      content: t('faq_booklet_html', { defaultValue: '<p>Content coming soon.</p>' }),
    },
    'get-connected/employment': {
      title: t('employment_title', { defaultValue: 'Employment' }),
      description: t('employment_description', { defaultValue: 'Explore career opportunities within our organization.' }),
      content: `<p>${t('employment_opportunities_coming_soon', { defaultValue: 'Employment opportunities coming soon...' })}</p>`
    },
    'get-connected/schedule-tour': {
      title: t('schedule_tour_title', { defaultValue: 'Schedule a Tour' }),
      description: t('schedule_tour_description', { defaultValue: 'Visit our facilities and learn about our community.' }),
      content: `<p>${t('tour_scheduling_coming_soon', { defaultValue: 'Tour scheduling coming soon...' })}</p>`
    },

    // About Section
    'about': {
      title: t('about_title', { defaultValue: 'About Us' }),
      description: t('about_description', { defaultValue: 'Learn about the Church of God of Prophecy, our mission, values, and commitment to Christ.' }),
      content: `
        <h2>${t('our_mission', { defaultValue: 'Our Mission' })}</h2>
        <p>${t('our_mission_text', { defaultValue: 'The Church of God of Prophecy is a global, Christ-centered movement rooted in Scripture, steadfast in faith, passionate about people, and dedicated to reconciling the world to Christ through the power of the Holy Spirit.' })}</p>
        
        <h2>${t('our_vision', { defaultValue: 'Our Vision' })}</h2>
        <p>${t('our_vision_text', { defaultValue: 'To be a Spirit-led global community of believers committed to reaching every person in every nation with the Gospel of Jesus Christ.' })}</p>
        
        <h2>${t('our_values', { defaultValue: 'Our Values' })}</h2>
        <ul>
          <li><strong>${t('biblical_authority', { defaultValue: 'Biblical Authority' })}:</strong> ${t('biblical_authority_desc', { defaultValue: 'We believe the Bible is the inspired Word of God' })}</li>
          <li><strong>${t('global_unity', { defaultValue: 'Global Unity' })}:</strong> ${t('global_unity_desc', { defaultValue: 'We are one church with many expressions' })}</li>
          <li><strong>${t('spirit_led_living', { defaultValue: 'Spirit-Led Living' })}:</strong> ${t('spirit_led_living_desc', { defaultValue: 'We depend on the Holy Spirit for guidance' })}</li>
          <li><strong>${t('holistic_ministry', { defaultValue: 'Holistic Ministry' })}:</strong> ${t('holistic_ministry_desc', { defaultValue: 'We minister to the whole person' })}</li>
          <li><strong>${t('cultural_sensitivity', { defaultValue: 'Cultural Sensitivity' })}:</strong> ${t('cultural_sensitivity_desc', { defaultValue: 'We respect and embrace diversity' })}</li>
        </ul>
      `
    },
    'about/who-we-are': {
      title: t('who_we_are_title', { defaultValue: 'Who We Are' }),
      description: t('who_we_are_description', { defaultValue: 'Discover our identity as a Christ-centered, Spirit-led global movement.' }),
      content: (() => {
        const detailed = t('who_we_are_html');
        if (detailed && /\S/.test(detailed)) {
          return detailed;
        }
        return `
        <h2>${t('global_movement', { defaultValue: 'A Global Movement' })}</h2>
        <p>${t('global_movement_text', { defaultValue: 'The Church of God of Prophecy is a vibrant, global Christian movement with presence in 135 countries and territories. We are united by our common faith in Jesus Christ and our commitment to biblical truth.' })}</p>
        
        <h2>${t('our_identity', { defaultValue: 'Our Identity' })}</h2>
        <p>${t('we_are', { defaultValue: 'We are:' })}</p>
        <ul>
          <li>${t('christ_centered', { defaultValue: 'Christ-centered in our worship and witness' })}</li>
          <li>${t('spirit_led', { defaultValue: 'Spirit-led in our ministry and mission' })}</li>
          <li>${t('scripture_based', { defaultValue: 'Scripture-based in our beliefs and practices' })}</li>
          <li>${t('global_reach', { defaultValue: 'Global in our reach and impact' })}</li>
          <li>${t('unified_diversity', { defaultValue: 'Unified in our diversity' })}</li>
        </ul>
        
        <h2>${t('our_story', { defaultValue: 'Our Story' })}</h2>
        <p>${t('our_story_text', { defaultValue: 'Founded in the early 20th century, we have grown from humble beginnings to become a worldwide fellowship of believers committed to advancing God\'s kingdom on earth.' })}</p>
      `;
      })(),
    },
    'about/what-we-believe': {
      title: t('what_we_believe_title', { defaultValue: 'What We Believe' }),
      description: t('what_we_believe_description', { defaultValue: 'Explore our core beliefs, doctrine, and theological foundations.' }),
      content: (() => {
        const detailed = t('what_we_believe_detailed_html');
        const heading = `<h2>${t('statement_of_faith', { defaultValue: 'Statement of Faith' })}</h2>`;
        if (detailed && /\S/.test(detailed)) {
          return `${heading}${detailed}`;
        }
        return `
        ${heading}
        <p>${t('we_believe_in', { defaultValue: 'We believe in:' })}</p>
        
        <h3>${t('the_trinity', { defaultValue: 'The Trinity' })}</h3>
        <p>${t('trinity_desc', { defaultValue: 'One God eternally existing in three persons: Father, Son, and Holy Spirit.' })}</p>
        
        <h3>${t('jesus_christ', { defaultValue: 'Jesus Christ' })}</h3>
        <p>${t('jesus_desc', { defaultValue: 'The deity of Jesus Christ, His virgin birth, sinless life, atoning death, bodily resurrection, and glorious return.' })}</p>
        
        <h3>${t('salvation', { defaultValue: 'Salvation' })}</h3>
        <p>${t('salvation_desc', { defaultValue: 'Salvation by grace through faith in Jesus Christ, not by works.' })}</p>
        
        <h3>${t('holy_spirit', { defaultValue: 'The Holy Spirit' })}</h3>
        <p>${t('holy_spirit_desc', { defaultValue: 'The baptism of the Holy Spirit as a distinct experience available to all believers.' })}</p>
        
        <h3>${t('the_church', { defaultValue: 'The Church' })}</h3>
        <p>${t('church_desc', { defaultValue: 'The church as the body of Christ, called to unity and holiness.' })}</p>
        
        <h3>${t('scripture', { defaultValue: 'Scripture' })}</h3>
        <p>${t('scripture_desc', { defaultValue: 'The Bible as the inspired, inerrant Word of God and our final authority for faith and practice.' })}</p>
      `;
      })(),
    },
    'about/leadership': {
      title: t('our_leadership_title', { defaultValue: 'Our Leadership' }),
      description: t('our_leadership_description', { defaultValue: 'Meet the leaders who guide and serve our global church community.' }),
      content: (() => {
        const body = t('leadership_organization_html');
        if (body && /\S/.test(body)) {
          return body;
        }
        return `<p>${t('leadership_information_coming_soon', { defaultValue: 'Leadership information coming soon...' })}</p>`;
      })(),
    },
    'about/history': {
      title: t('our_history_title', { defaultValue: 'Our History' }),
      description: t('our_history_description', { defaultValue: 'Journey through the rich history of the Church of God of Prophecy.' }),
      content: (() => {
        const body = t('our_history_html');
        if (body && /\S/.test(body)) {
          return body;
        }
        return `<p>${t('historical_information_coming_soon', { defaultValue: 'Historical information coming soon...' })}</p>`;
      })(),
    },
    'about/membership': {
      title: t('membership_title', { defaultValue: 'Membership' }),
      description: t('membership_description', { defaultValue: 'Learn about becoming a member of our global church family.' }),
      content: `
        <h2>Becoming a Member</h2>
        <p>Membership in the Church of God of Prophecy is open to all who have accepted Jesus Christ as their personal Savior and desire to follow Him in baptism and Christian living.</p>
        
        <h2>Steps to Membership</h2>
        <ol>
          <li><strong>Accept Christ:</strong> Make a personal decision to follow Jesus</li>
          <li><strong>Be Baptized:</strong> Follow Christ in water baptism</li>
          <li><strong>Commit to Growth:</strong> Engage in Bible study and fellowship</li>
          <li><strong>Serve Others:</strong> Use your gifts to serve God and others</li>
        </ol>
        
        <h2>Member Benefits</h2>
        <ul>
          <li>Voting privileges in church matters</li>
          <li>Access to member resources and materials</li>
          <li>Opportunities for leadership and service</li>
          <li>Connection with our global church family</li>
        </ul>
      `
    },

    // Ministries Section
    'ministries': {
      title: t('ministries_title', { defaultValue: 'Our Ministries' }),
      description: t('ministries_description', { defaultValue: 'Explore the various ministries and outreach programs of our church.' }),
      content: `
        <h2>${t('serving_god_through_ministry', { defaultValue: 'Serving God Through Ministry' })}</h2>
        <p>${t('serving_god_ministry_desc', { defaultValue: 'The Church of God of Prophecy is committed to fulfilling the Great Commission through various ministries that serve our local communities and reach the world.' })}</p>
        
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${t('global_missions_title', { defaultValue: 'Global Missions' })}</h5>
                <p class="card-text">${t('global_missions_desc', { defaultValue: 'Reaching 135 countries with the Gospel of Jesus Christ.' })}</p>
                <a href="/ministries/global-missions" class="btn btn-dark">${t('learn_more', { defaultValue: 'Learn More' })}</a>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${t('youth_title', { defaultValue: 'Youth Ministry' })}</h5>
                <p class="card-text">${t('empowering_next_generation', { defaultValue: 'Empowering the next generation of believers.' })}</p>
                <a href="/ministries/youth" class="btn btn-dark">${t('learn_more', { defaultValue: 'Learn More' })}</a>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${t('spirit_life_seminary_title', { defaultValue: 'Seminary' })}</h5>
                <p class="card-text">${t('training_leaders_ministry', { defaultValue: 'Training ministers for effective service.' })}</p>
                <a href="/ministries/seminary" class="btn btn-dark">${t('learn_more', { defaultValue: 'Learn More' })}</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    'ministries/global-missions': {
      title: t('global_missions_title', { defaultValue: 'Global Missions' }),
      description: t('global_missions_description', { defaultValue: 'Discover our worldwide mission work and evangelism efforts across 135 countries.' }),
      content: `
        <h2>${t('reaching_world_for_christ', { defaultValue: 'Reaching the World for Christ' })}</h2>
        <p>${t('global_missions_desc', { defaultValue: 'Our global missions ministry spans 135 countries and territories, working to fulfill the Great Commission by making disciples of all nations.' })}</p>
        
        <h3>${t('our_mission', { defaultValue: 'Our Mission' })}</h3>
        <p>${t('our_mission_text', { defaultValue: 'To present the Gospel of Jesus Christ to every person in every nation, establishing churches and training leaders to continue the work of evangelism and discipleship.' })}</p>
        
        <h3>${t('key_focus_areas', { defaultValue: 'Key Focus Areas' })}</h3>
        <ul>
          <li>${t('church_planting', { defaultValue: 'Church planting in unreached areas' })}</li>
          <li>${t('training_leadership', { defaultValue: 'Training indigenous leadership' })}</li>
          <li>${t('bible_translation', { defaultValue: 'Bible translation and distribution' })}</li>
          <li>${t('medical_missions', { defaultValue: 'Medical missions and humanitarian aid' })}</li>
          <li>${t('educational_ministries', { defaultValue: 'Educational ministries' })}</li>
        </ul>
        
        <h3>${t('get_involved', { defaultValue: 'Get Involved' })}</h3>
        <p>${t('get_involved', { defaultValue: 'There are many ways to support global missions:' })}</p>
        <div class="row">
          <div class="col-md-6">
            <h4>${t('pray', { defaultValue: 'Pray' })}</h4>
            <p>${t('pray_desc', { defaultValue: 'Join our prayer network for missionaries and ministry partners around the world.' })}</p>
          </div>
          <div class="col-md-6">
            <h4>${t('give', { defaultValue: 'Give' })}</h4>
            <p>${t('give_desc', { defaultValue: 'Support missionaries and mission projects through financial contributions.' })}</p>
          </div>
        </div>
      `
    },
    'ministries/youth': {
      title: t('youth_title', { defaultValue: 'Youth Ministry' }),
      description: t('content_coming_soon', { defaultValue: 'Content coming soon...' }),
      content: `<p class="lead text-muted">${t('content_coming_soon', { defaultValue: 'Content coming soon...' })}</p>`,
    },
    'ministries/seminary': {
      title: 'Spirit and Life Seminary',
      description: 'Training ministers for effective service in the 21st century.',
      content: `
        <h2>Training Leaders for Ministry</h2>
        <p>Spirit and Life Seminary exists to provide quality theological education and practical ministry training for current and future leaders in the Church of God of Prophecy.</p>
        
        <h3>Our Programs</h3>
        <ul>
          <li>Bachelor of Arts in Ministry</li>
          <li>Master of Divinity</li>
          <li>Master of Arts in Christian Leadership</li>
          <li>Certificate programs in various ministry specializations</li>
          <li>Continuing education for ministers</li>
        </ul>
        
        <h3>Mission Statement</h3>
        <p>To provide excellent academic and practical training that equips men and women for effective ministry in the global Church of God of Prophecy.</p>
        
        <h3>Accreditation</h3>
        <p>Spirit and Life Seminary is committed to maintaining the highest academic standards while staying true to our Pentecostal heritage and biblical foundation.</p>
      `
    },
    'ministries/one-child-fund': {
      title: 'One Child Fund',
      description: 'Providing education and care for children in need around the world.',
      content: `
        <h2>Changing Lives One Child at a Time</h2>
        <p>The One Child Fund is a ministry of compassion that provides educational opportunities, basic necessities, and spiritual nurturing for children in developing countries.</p>
        
        <h3>How It Works</h3>
        <p>Through monthly sponsorship, supporters provide:</p>
        <ul>
          <li>Educational expenses including tuition, books, and supplies</li>
          <li>Nutritious meals and healthcare</li>
          <li>Clothing and other basic necessities</li>
          <li>Spiritual guidance and biblical instruction</li>
          <li>Hope for a brighter future</li>
        </ul>
        
        <h3>Make a Difference</h3>
        <p>For just $30 per month, you can sponsor a child and help break the cycle of poverty through education and Christian love.</p>
        
        <div class="row my-4">
          <div class="col-md-6">
            <div class="card">
              <div class="card-body text-center">
                <h5 class="card-title">Sponsor a Child</h5>
                <p class="card-text">Begin your sponsorship journey today and change a child's life forever.</p>
                <a href="/give" class="btn btn-dark">Start Sponsoring</a>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-body text-center">
                <h5 class="card-title">Learn More</h5>
                <p class="card-text">Discover more about our global children's ministry initiatives.</p>
                <a href="/get-connected/contact" class="btn btn-outline-primary">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
        
        <h3>Global Impact</h3>
        <p>The One Child Fund operates in multiple countries, partnering with local Church of God of Prophecy congregations to identify and support children who need educational assistance.</p>
      `
    },
    'ministries/admin-finance': {
      title: 'Administration & Finance',
      description: 'Supporting ministry through sound financial stewardship and administration.',
      content: `
        <h2>Faithful Stewardship</h2>
        <p>The Administration & Finance ministry ensures the faithful stewardship of resources entrusted to the Church of God of Prophecy.</p>
        
        <h3>Our Mission</h3>
        <p>To provide financial oversight, administrative support, and stewardship guidance that enables effective ministry worldwide.</p>
        
        <h3>Key Responsibilities</h3>
        <ul>
          <li>Financial planning and budgeting</li>
          <li>Audit and accountability measures</li>
          <li>Administrative policy development</li>
          <li>Stewardship education and resources</li>
          <li>Technology and systems management</li>
        </ul>
      `
    },
    'ministries/harvest-partners': {
      title: 'Harvest Partners',
      description: 'Supporting missionaries and ministry partners around the world.',
      content: `
        <h2>Partners in the Harvest</h2>
        <p>Harvest Partners connects supporters with missionaries and ministry leaders serving in the global harvest field.</p>
        
        <h3>How It Works</h3>
        <p>Through partnership, supporters help provide:</p>
        <ul>
          <li>Monthly financial support for missionaries</li>
          <li>Special project funding</li>
          <li>Equipment and resources for ministry</li>
          <li>Prayer and encouragement</li>
        </ul>
        
        <h3>Become a Harvest Partner</h3>
        <p>Join with us in supporting those who are reaching the world for Christ. Your partnership makes a difference in advancing God's kingdom globally.</p>
      `
    },
    'ministries/helping-hands': {
      title: 'Helping Hands',
      description: 'Disaster relief and humanitarian assistance ministry.',
      content: `
        <h2>Extending Christ's Love in Times of Need</h2>
        <p>Helping Hands is our disaster relief and humanitarian assistance ministry, providing aid to communities affected by natural disasters and crises.</p>
        
        <h3>Our Response</h3>
        <ul>
          <li>Emergency relief supplies</li>
          <li>Medical assistance and healthcare</li>
          <li>Temporary shelter and housing</li>
          <li>Long-term recovery support</li>
          <li>Spiritual care and counseling</li>
        </ul>
        
        <h3>Get Involved</h3>
        <p>You can help by donating funds, volunteering for relief efforts, or organizing supply drives in your local community.</p>
      `
    },
    'ministries/heritage': {
      title: 'Heritage',
      description: 'Preserving and sharing the history of the Church of God of Prophecy.',
      content: `
        <h2>Honoring Our Past, Inspiring Our Future</h2>
        <p>The Heritage ministry preserves the rich history and traditions of the Church of God of Prophecy for current and future generations.</p>
        
        <h3>Our Work</h3>
        <ul>
          <li>Historical research and documentation</li>
          <li>Archives and artifact preservation</li>
          <li>Educational resources and publications</li>
          <li>Heritage tours and presentations</li>
          <li>Commemorative events and celebrations</li>
        </ul>
        
        <h3>Learn Our Story</h3>
        <p>Discover the remarkable history of God's faithfulness to our movement and the pioneers who helped establish our global church.</p>
      `
    },
    'ministries/fields-of-the-wood': {
      title: 'Fields of the Wood',
      description: 'A biblical theme park and retreat center in Murphy, North Carolina.',
      content: `
        <h2>Where Bible History Comes Alive</h2>
        <p>Fields of the Wood is a unique biblical theme park and retreat center located in the beautiful mountains of North Carolina.</p>
        
        <h3>Attractions</h3>
        <ul>
          <li>World's largest Ten Commandments display</li>
          <li>Prayer Mountain with historic prayer grottos</li>
          <li>Golgotha replica depicting Christ's crucifixion</li>
          <li>Biblical gardens and walking trails</li>
          <li>Gift shop and visitor center</li>
        </ul>
        
        <h3>Visit Us</h3>
        <p>Plan your visit to experience this sacred space where thousands have found spiritual renewal and inspiration. Open year-round for visitors and groups.</p>
      `
    },
    'ministries/stewardship': {
      title: 'Stewardship',
      description: 'Teaching biblical principles of stewardship and financial responsibility.',
      content: `
        <h2>Faithful Stewards of God's Blessings</h2>
        <p>Our stewardship ministry teaches biblical principles of managing God's blessings and resources with wisdom and faithfulness.</p>
        
        <h3>Key Areas</h3>
        <ul>
          <li>Biblical giving and tithing</li>
          <li>Personal financial management</li>
          <li>Church financial stewardship</li>
          <li>Time and talent stewardship</li>
          <li>Environmental stewardship</li>
        </ul>
        
        <h3>Resources Available</h3>
        <p>We offer educational materials, workshops, and training to help individuals and churches develop faithful stewardship practices.</p>
      `
    },
    'ministries/bookstore': {
      title: 'Bookstore',
      description: 'Christian books, resources, and materials for spiritual growth.',
      content: `
        <h2>Resources for Spiritual Growth</h2>
        <p>Our bookstore provides quality Christian literature, educational materials, and resources to support your spiritual journey and ministry needs.</p>
        
        <h3>Available Resources</h3>
        <ul>
          <li>Bibles and study materials</li>
          <li>Devotional books and commentaries</li>
          <li>Children's Christian literature</li>
          <li>Ministry training resources</li>
          <li>Church supplies and materials</li>
        </ul>
        
        <h3>Online Ordering</h3>
        <p>Browse our catalog online or visit our physical location for personalized service and recommendations.</p>
      `
    },
    'ministries/global-communications': {
      title: 'Global Communications',
      description: 'Connecting our worldwide church through media and communications.',
      content: `
        <h2>Connecting the Global Church</h2>
        <p>Global Communications coordinates media, publications, and communication efforts to connect our worldwide church family.</p>
        
        <h3>Our Services</h3>
        <ul>
          <li>Website development and maintenance</li>
          <li>Social media management</li>
          <li>Video production and streaming</li>
          <li>Translation services</li>
          <li>Digital marketing and outreach</li>
        </ul>
        
        <h3>Stay Connected</h3>
        <p>Follow us on social media and subscribe to our communications to stay informed about global church news and events.</p>
      `
    },
    'resources/white-wing-messenger': {
      title: 'White Wing Messenger',
      description: 'Our official church publication sharing news, inspiration, and teaching.',
      content: `
        <h2>The Voice of Our Movement</h2>
        <p>The White Wing Messenger is the official publication of the Church of God of Prophecy, providing news, inspiration, and biblical teaching to our global church family.</p>
        
        <h3>Content Features</h3>
        <ul>
          <li>Inspirational articles and testimonies</li>
          <li>Biblical teaching and devotionals</li>
          <li>Global church news and updates</li>
          <li>Ministry spotlights and profiles</li>
          <li>Youth and children's sections</li>
        </ul>
        
        <h3>Subscribe Today</h3>
        <p>Stay connected with your global church family through our monthly publication. Available in print and digital formats.</p>
      `
    },
    'ministries/prayer': {
      title: 'Prayer',
      description: 'Connecting believers worldwide through the power of prayer.',
      content: `
        <h2>The Power of United Prayer</h2>
        <p>Our prayer ministry connects believers around the world in intercession, supplication, and thanksgiving to our Heavenly Father.</p>
        
        <h3>Prayer Initiatives</h3>
        <ul>
          <li>Global prayer networks</li>
          <li>Prayer request coordination</li>
          <li>Prayer warrior training</li>
          <li>Prayer conferences and events</li>
          <li>24/7 prayer chains</li>
        </ul>
        
        <h3>Submit a Prayer Request</h3>
        <p>Share your prayer needs with our global prayer network. We believe in the power of agreement in prayer.</p>
      `
    },
    'ministries/international-assembly': {
      title: 'International Assembly',
      description: 'Our global church gathering held every four years.',
      content: `
        <h2>Uniting the Global Church</h2>
        <p>The International Assembly is our global church gathering held every four years, bringing together delegates from 135 countries for worship, fellowship, and business.</p>
        
        <h3>Next Assembly</h3>
        <p><strong>Location:</strong> Orlando, Florida<br>
        <strong>Dates:</strong> July 15-19, 2026<br>
        <strong>Venue:</strong> Rosen Shingle Creek</p>
        
        <h3>Assembly Features</h3>
        <ul>
          <li>Inspirational worship services</li>
          <li>Global church business sessions</li>
          <li>Ministry exhibitions and displays</li>
          <li>Cultural celebrations from around the world</li>
          <li>Youth and children's programs</li>
        </ul>
      `
    },
    'ministries/leadership-development': {
      title: 'Leadership Development',
      description: 'Training and equipping leaders for effective ministry worldwide.',
      content: `
        <h2>Developing Leaders for Tomorrow</h2>
        <p>Our leadership development ministry provides training, resources, and mentoring to prepare current and emerging leaders for effective ministry.</p>
        
        <h3>Training Programs</h3>
        <ul>
          <li>Pastoral leadership development</li>
          <li>Women's leadership training</li>
          <li>Youth leadership preparation</li>
          <li>Marketplace ministry</li>
          <li>Cross-cultural leadership skills</li>
        </ul>
        
        <h3>Leadership Resources</h3>
        <p>Access training materials, leadership assessments, and mentoring opportunities to grow in your calling and effectiveness.</p>
      `
    },
    'ministries/accredited-ministries': {
      title: 'Accredited Ministries',
      description: 'Recognizing and supporting specialized ministry organizations.',
      content: `
        <h2>Supporting Specialized Ministries</h2>
        <p>Accredited Ministries recognizes and supports specialized ministry organizations that align with our mission and values.</p>
        
        <h3>Ministry Areas</h3>
        <ul>
          <li>Chaplaincy services</li>
          <li>Prison ministry</li>
          <li>Hospital and healthcare ministry</li>
          <li>Military ministry</li>
          <li>Campus ministry</li>
        </ul>
        
        <h3>Accreditation Process</h3>
        <p>Learn about becoming an accredited ministry and joining our network of specialized outreach organizations.</p>
      `
    },
    'ministries/center-biblical-leadership': {
      title: 'Center for Biblical Leadership',
      description: 'Developing Christ-centered leaders through biblical principles.',
      content: `
        <h2>Biblical Leadership Excellence</h2>
        <p>The Center for Biblical Leadership develops Christ-centered leaders who lead with integrity, wisdom, and biblical principles.</p>
        
        <h3>Leadership Principles</h3>
        <ul>
          <li>Servant leadership model</li>
          <li>Biblical decision-making</li>
          <li>Ethical leadership practices</li>
          <li>Spiritual formation and character</li>
          <li>Vision casting and implementation</li>
        </ul>
        
        <h3>Training Opportunities</h3>
        <p>Participate in workshops, seminars, and certification programs designed to develop effective, godly leaders.</p>
      `
    },
    'ministries/spirit-life-seminary': {
      title: 'Spirit & Life Seminary',
      description: 'Graduate-level theological education for ministry leaders.',
      content: `
        <h2>Excellence in Theological Education</h2>
        <p>Spirit & Life Seminary provides graduate-level theological education that combines academic excellence with practical ministry training.</p>
        
        <h3>Degree Programs</h3>
        <ul>
          <li>Master of Divinity (M.Div.)</li>
          <li>Master of Arts in Christian Leadership</li>
          <li>Master of Arts in Biblical Studies</li>
          <li>Doctor of Ministry (D.Min.)</li>
          <li>Certificate programs in specialized ministries</li>
        </ul>
        
        <h3>Learning Formats</h3>
        <p>Flexible learning options including online courses, intensive seminars, and hybrid programs to accommodate working ministers and students.</p>
      `
    },
    'ministries/childrens': {
      title: t('childrens_title', { defaultValue: "Children's Ministry" }),
      description: t('content_coming_soon', { defaultValue: 'Content coming soon...' }),
      content: `<p class="lead text-muted">${t('content_coming_soon', { defaultValue: 'Content coming soon...' })}</p>`,
    },

    // Where We Serve Section
    'where-we-serve': {
      title: t('where_we_serve_title', { defaultValue: 'Where We Serve' }),
      description: t('where_we_serve_description', { defaultValue: 'Explore our global presence and ministry impact.' }),
      content: `<p>${t('global_presence_overview_coming_soon', { defaultValue: 'Global presence overview coming soon...' })}</p>`
    },
    'where-we-serve/presiding-bishop': {
      title: 'Presiding Bishop',
      description: 'Leadership and oversight of the global Church of God of Prophecy.',
      content: `
        <h2>Global Church Leadership</h2>
        <p>The Presiding Bishop provides spiritual leadership and administrative oversight for the worldwide Church of God of Prophecy.</p>
        
        <h3>Responsibilities</h3>
        <ul>
          <li>Spiritual leadership and guidance</li>
          <li>Oversight of global ministries</li>
          <li>Coordination with regional leaders</li>
          <li>Doctrinal guidance and teaching</li>
          <li>Strategic planning and vision casting</li>
        </ul>
        
        <h3>Global Unity</h3>
        <p>Working together with bishops and leaders worldwide to maintain unity while respecting cultural diversity in our global church family.</p>
      `
    },
    'where-we-serve/africa': {
      title: 'Africa',
      description: 'Ministry and mission work across the African continent.',
      content: `
        <h2>Church of God of Prophecy in Africa</h2>
        <p>Our ministry in Africa spans multiple countries with vibrant congregations and dynamic outreach programs.</p>
        
        <h3>Countries Served</h3>
        <p>We have established churches and ministries throughout Africa, including:</p>
        <ul>
          <li>South Africa</li>
          <li>Kenya</li>
          <li>Ghana</li>
          <li>Nigeria</li>
          <li>Uganda</li>
          <li>And many other nations</li>
        </ul>
        
        <h3>Ministry Focus</h3>
        <ul>
          <li>Church planting and evangelism</li>
          <li>Leadership training and development</li>
          <li>Educational ministries</li>
          <li>Healthcare and humanitarian aid</li>
          <li>Youth and children's programs</li>
        </ul>
      `
    },
    'where-we-serve/asia-australia-oceania': {
      title: 'Asia, Australia & Oceania',
      description: 'Spreading the Gospel across Asia, Australia, and the Pacific islands.',
      content: `
        <h2>Ministry Across Asia and the Pacific</h2>
        <p>Our ministry extends across diverse cultures and nations in Asia, Australia, and Oceania.</p>
        
        <h3>Regional Presence</h3>
        <ul>
          <li>Philippines</li>
          <li>India</li>
          <li>Australia</li>
          <li>Indonesia</li>
          <li>Papua New Guinea</li>
          <li>Pacific Island nations</li>
        </ul>
        
        <h3>Cultural Sensitivity</h3>
        <p>Our approach respects local cultures while sharing the unchanging Gospel message, adapting our methods to effectively reach diverse populations.</p>
      `
    },
    'where-we-serve/caribbean-atlantic': {
      title: 'Caribbean & Atlantic',
      description: 'Island ministries throughout the Caribbean and Atlantic regions.',
      content: `
        <h2>Island Ministry Network</h2>
        <p>Serving island communities throughout the Caribbean and Atlantic with the Gospel of Jesus Christ.</p>
        
        <h3>Island Nations</h3>
        <ul>
          <li>Jamaica</li>
          <li>Bahamas</li>
          <li>Barbados</li>
          <li>Trinidad and Tobago</li>
          <li>Puerto Rico</li>
          <li>Dominican Republic</li>
          <li>Various smaller islands</li>
        </ul>
        
        <h3>Community Impact</h3>
        <p>Our ministries focus on strengthening families, developing leadership, and serving community needs throughout the region.</p>
      `
    },
    'where-we-serve/central-america': {
      title: 'Central America',
      description: 'Church growth and ministry throughout Central America.',
      content: `
        <h2>Growing Church Movement</h2>
        <p>The Church of God of Prophecy has experienced significant growth throughout Central America with active congregations and ministries.</p>
        
        <h3>Countries</h3>
        <ul>
          <li>Guatemala</li>
          <li>El Salvador</li>
          <li>Honduras</li>
          <li>Nicaragua</li>
          <li>Costa Rica</li>
          <li>Panama</li>
          <li>Belize</li>
        </ul>
        
        <h3>Regional Ministries</h3>
        <ul>
          <li>Church planting initiatives</li>
          <li>Biblical education programs</li>
          <li>Social outreach projects</li>
          <li>Youth conferences and camps</li>
          <li>Disaster relief coordination</li>
        </ul>
      `
    },
    'where-we-serve/north-america': {
      title: 'North America',
      description: 'Ministry throughout the United States, Canada, and Mexico.',
      content: `
        <h2>Established Ministry Base</h2>
        <p>North America serves as a key base for our global ministry with established churches, institutions, and outreach programs.</p>
        
        <h3>Key Locations</h3>
        <ul>
          <li>United States - Headquarters in Cleveland, TN</li>
          <li>Canada - Provinces throughout the nation</li>
          <li>Mexico - Growing church presence</li>
        </ul>
        
        <h3>Ministry Infrastructure</h3>
        <ul>
          <li>Spirit and Life Seminary</li>
          <li>Fields of the Wood biblical park</li>
          <li>Publishing and communications center</li>
          <li>Administrative and financial services</li>
          <li>Training and conference facilities</li>
        </ul>
      `
    },
    'where-we-serve/south-america': {
      title: 'South America',
      description: 'Dynamic church growth across South American nations.',
      content: `
        <h2>Expanding Gospel Reach</h2>
        <p>South America represents one of our fastest-growing regions with dynamic churches and enthusiastic believers.</p>
        
        <h3>Major Presence</h3>
        <ul>
          <li>Brazil</li>
          <li>Colombia</li>
          <li>Venezuela</li>
          <li>Peru</li>
          <li>Argentina</li>
          <li>Chile</li>
          <li>Other nations throughout the continent</li>
        </ul>
        
        <h3>Growth Initiatives</h3>
        <ul>
          <li>Aggressive church planting</li>
          <li>Leadership multiplication</li>
          <li>Seminary education programs</li>
          <li>Youth and children's ministries</li>
          <li>Community development projects</li>
        </ul>
      `
    },
    'where-we-serve/europe-middle-east': {
      title: 'Europe & Middle East',
      description: 'Ministry in challenging and diverse cultural contexts.',
      content: `
        <h2>Ministry in Diverse Cultures</h2>
        <p>Our ministry in Europe and the Middle East operates in diverse cultural and religious contexts, bringing hope through the Gospel.</p>
        
        <h3>Regional Presence</h3>
        <ul>
          <li>United Kingdom</li>
          <li>Germany</li>
          <li>Italy</li>
          <li>Various Eastern European nations</li>
          <li>Middle Eastern countries</li>
        </ul>
        
        <h3>Strategic Approach</h3>
        <ul>
          <li>Culturally sensitive evangelism</li>
          <li>Immigrant and refugee ministry</li>
          <li>Interfaith dialogue and witness</li>
          <li>Church planting in unreached areas</li>
          <li>Partnership with established believers</li>
        </ul>
      `
    },

    // Resources Section
    'resources': {
      title: t('resources_title', { defaultValue: 'Resources' }),
      description: t('resources_description', { defaultValue: 'Access educational materials, documents, and spiritual resources.' }),
      content: `<p>${t('resources_overview_coming_soon', { defaultValue: 'Resources overview coming soon...' })}</p>`
    },
    'resources/get-started': {
      title: 'Get Started',
      description: 'Begin your journey with the Church of God of Prophecy.',
      content: `
        <h2>Welcome to Our Church Family</h2>
        <p>We're excited to help you begin your spiritual journey with the Church of God of Prophecy. Here's how to get started:</p>
        
        <h3>First Steps</h3>
        <ol>
          <li><strong>Visit a Service:</strong> Join us for worship and fellowship</li>
          <li><strong>Meet Our Pastors:</strong> Connect with our leadership team</li>
          <li><strong>Join a Small Group:</strong> Build relationships and grow in faith</li>
          <li><strong>Discover Your Gifts:</strong> Find ways to serve and make a difference</li>
        </ol>
        
        <h3>New Member Classes</h3>
        <p>Our new member classes help you understand our beliefs, discover your purpose, and connect with our church family.</p>
      `
    },
    'resources/know-god': {
      title: t('how_to_know_god_title', { defaultValue: 'How to Know God' }),
      description: t('how_to_know_god_description', { defaultValue: 'Discover a personal relationship with Jesus Christ and experience the peace that comes from knowing God.' }),
      content: `<div class="mb-5">
          <p class="lead">${t('know_god_intro_p1', { defaultValue: '' })}</p>
          <p>${t('know_god_intro_p2', { defaultValue: '' })}</p>
          <p>${t('know_god_intro_p3', { defaultValue: '' })}</p>
          <blockquote class="blockquote">
            <p>“${t('know_god_romans_5_1_quote', { defaultValue: '' })}”</p>
            <footer class="blockquote-footer">${t('know_god_romans_5_1_ref', { defaultValue: '' })}</footer>
          </blockquote>
          <blockquote class="blockquote">
            <p>“${t('know_god_john_10_10_quote', { defaultValue: '' })}”</p>
            <footer class="blockquote-footer">${t('know_god_john_10_10_ref', { defaultValue: '' })}</footer>
          </blockquote>
          <p>${t('know_god_lead_in_powerful_verse', { defaultValue: '' })}</p>
          <blockquote class="blockquote">
            <p>“${t('know_god_john_3_16_extended_quote', { defaultValue: '' })}”</p>
            <footer class="blockquote-footer">${t('john_3_16', { defaultValue: 'John 3:16' })}</footer>
          </blockquote>
        </div>

        <div class="mb-5">
          <h2 class="h3 mb-3">${t('know_god_problem_sin_heading', { defaultValue: '' })}</h2>
          <p>${t('know_god_problem_sin_body', { defaultValue: '' })}</p>
          <blockquote class="blockquote">
            <p>“${t('for_all_have_sinned_and_fall_short_of_the_glory_of_god', { defaultValue: 'For all have sinned and fall short of the glory of God.' })}”</p>
            <footer class="blockquote-footer">${t('romans_3_23', { defaultValue: 'Romans 3:23' })}</footer>
          </blockquote>
        </div>

        <div class="mb-5">
          <h2 class="h3 mb-3">${t('know_god_answer_cross_heading', { defaultValue: '' })}</h2>
          <p>${t('know_god_answer_cross_p1', { defaultValue: '' })}</p>
          <p>${t('know_god_answer_cross_p2', { defaultValue: '' })}</p>
          <blockquote class="blockquote">
            <p>“${t('know_god_1_peter_2_24_quote', { defaultValue: '' })}”</p>
            <footer class="blockquote-footer">${t('know_god_1_peter_2_24_ref', { defaultValue: '' })}</footer>
          </blockquote>
        </div>

        <div class="mb-5">
          <h2 class="h3 mb-3">${t('know_god_what_must_i_do_heading', { defaultValue: '' })}</h2>
          <p>${t('know_god_bridge_body', { defaultValue: '' })}</p>
        </div>

        <div class="mb-5">
          <h2 class="h3 mb-3">${t('know_god_starting_point_heading', { defaultValue: '' })}</h2>
          <ol class="mb-4">
            <li class="mb-3">${t('know_god_step_1', { defaultValue: '' })}</li>
            <li class="mb-3">${t('know_god_step_2', { defaultValue: '' })}</li>
            <li class="mb-3">${t('know_god_step_3', { defaultValue: '' })}</li>
            <li class="mb-3">${t('know_god_step_4', { defaultValue: '' })}</li>
          </ol>
          <blockquote class="blockquote">
            <p>“${t('know_god_rev_3_20_quote', { defaultValue: '' })}”</p>
            <footer class="blockquote-footer">${t('know_god_rev_3_20_ref', { defaultValue: '' })}</footer>
          </blockquote>
          <blockquote class="blockquote">
            <p>“${t('know_god_romans_10_13_quote', { defaultValue: '' })}”</p>
            <footer class="blockquote-footer">${t('know_god_romans_10_13_ref', { defaultValue: '' })}</footer>
          </blockquote>
          <p class="mt-4">${t('know_god_sample_prayer_intro', { defaultValue: '' })}</p>
          <div class="border rounded p-4 bg-light mb-4">
            <p class="mb-0" style="white-space: pre-wrap;">${t('know_god_sample_prayer_body', { defaultValue: '' })}</p>
          </div>
          <p class="mb-2">${t('know_god_closing_contact', { defaultValue: '' })}</p>
          <p class="text-center mb-0"><a href="/get-connected/contact" class="btn btn-dark">${t('know_god_contact_church_here', { defaultValue: 'Contact the church here' })}</a></p>
        </div>`
    },
    'resources/media': {
      title: t('media_title', { defaultValue: 'Media' }),
      description: t('media_description', { defaultValue: 'Access sermons, videos, and multimedia resources for spiritual growth and ministry.' }),
      content: `
        <h2>${t('media_page_heading', { defaultValue: 'Multimedia Resources' })}</h2>
        <p>${t('media_page_intro', { defaultValue: 'Access our library of sermons, videos, and multimedia content to support your spiritual growth and ministry needs.' })}</p>

        <h3 class="mt-5 mb-3">${t('media_featured_videos_heading', { defaultValue: 'Featured videos' })}</h3>
        <p class="text-body-secondary mb-4">${t('media_featured_videos_lead', { defaultValue: 'Watch here or open on YouTube in a new tab.' })}</p>
        <div class="row g-4 mb-5 align-items-stretch">
          <div class="col-12 col-lg-6">
            <div class="card border-0 shadow h-100 overflow-hidden rounded-4">
              <div class="ratio ratio-16x9 bg-dark">
                <iframe
                  src="https://www.youtube.com/embed/rQA7V-uvWaQ"
                  title="${t('media_video_iframe_title_1', { defaultValue: 'Featured video 1' })}"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                  loading="lazy"
                ></iframe>
              </div>
              <div class="card-body d-flex align-items-center justify-content-between gap-2 py-3 px-3 px-md-4">
                <span class="small text-body-secondary mb-0"><i class="bi bi-youtube text-danger me-1" aria-hidden="true"></i>${t('media_youtube_brand', { defaultValue: 'YouTube' })}</span>
                <a href="https://www.youtube.com/watch?v=rQA7V-uvWaQ" class="btn btn-sm btn-dark rounded-pill px-3" target="_blank" rel="noopener noreferrer">${t('media_open_video', { defaultValue: 'Open' })} <i class="bi bi-box-arrow-up-right ms-1" aria-hidden="true"></i></a>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-6">
            <div class="card border-0 shadow h-100 overflow-hidden rounded-4">
              <div class="ratio ratio-16x9 bg-dark">
                <iframe
                  src="https://www.youtube.com/embed/ys6oW7to2JU"
                  title="${t('media_video_iframe_title_2', { defaultValue: 'Featured video 2' })}"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                  loading="lazy"
                ></iframe>
              </div>
              <div class="card-body d-flex align-items-center justify-content-between gap-2 py-3 px-3 px-md-4">
                <span class="small text-body-secondary mb-0"><i class="bi bi-youtube text-danger me-1" aria-hidden="true"></i>${t('media_youtube_brand', { defaultValue: 'YouTube' })}</span>
                <a href="https://www.youtube.com/watch?v=ys6oW7to2JU" class="btn btn-sm btn-dark rounded-pill px-3" target="_blank" rel="noopener noreferrer">${t('media_open_video', { defaultValue: 'Open' })} <i class="bi bi-box-arrow-up-right ms-1" aria-hidden="true"></i></a>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 bg-body-tertiary rounded-4 shadow-sm mb-5 mx-auto" style="max-width: 42rem;">
          <div class="card-body py-4 px-4 text-center">
            <p class="text-uppercase small text-body-secondary mb-2">${t('media_channel_kicker', { defaultValue: 'YouTube channel' })}</p>
            <h3 class="h5 mb-3">${t('media_channel_heading', { defaultValue: 'More on YouTube' })}</h3>
            <p class="text-body-secondary small mb-4 mb-md-3">${t('media_channel_intro', { defaultValue: 'Subscribe to <strong>@obc-ruse</strong> for new videos, services, and teaching.' })}</p>
            <a href="https://www.youtube.com/@obc-ruse" class="btn btn-danger rounded-pill px-4" target="_blank" rel="noopener noreferrer">
              <i class="bi bi-youtube me-2" aria-hidden="true"></i>${t('media_open_channel_button', { defaultValue: 'Open channel' })}
            </a>
          </div>
        </div>
        
        <h3>${t('media_available_heading', { defaultValue: 'Available Content' })}</h3>
        <ul>
          <li>${t('media_list_weekly_sermons', { defaultValue: 'Weekly sermon recordings' })}</li>
          <li>${t('media_list_event_videos', { defaultValue: 'Conference and special event videos' })}</li>
          <li>${t('media_list_teaching_series', { defaultValue: 'Teaching series and Bible studies' })}</li>
          <li>${t('media_list_worship_music', { defaultValue: 'Worship music and recordings' })}</li>
          <li>${t('media_list_promo_videos', { defaultValue: 'Promotional and informational videos' })}</li>
        </ul>
        
        <h3>${t('media_streaming_heading', { defaultValue: 'Streaming Options' })}</h3>
        <p>${t('media_streaming_intro', { defaultValue: 'Content is available through our website, mobile apps, and social media platforms for convenient access anywhere.' })}</p>

        <div class="card border-0 bg-body-tertiary rounded-4 shadow-sm mt-5 mb-0 mx-auto" style="max-width: 42rem;">
          <div class="card-body py-4 px-4 text-center">
            <p class="text-uppercase small text-body-secondary mb-2">${t('media_booklet_kicker', { defaultValue: 'Church brochure' })}</p>
            <h3 class="h5 mb-3">${t('media_booklet_heading', { defaultValue: 'We are the Church of God of Prophecy' })}</h3>
            <p class="text-body-secondary small mb-4 mb-md-3">${t('media_booklet_intro', { defaultValue: 'Our 24-page booklet introduces who we are, what we believe, and how we serve together—browse it on the site or download the PDF.' })}</p>
            <a href="/booklet" class="btn btn-dark rounded-pill px-4">
              <i class="bi bi-journal-bookmark me-2" aria-hidden="true"></i>${t('media_booklet_button', { defaultValue: 'View booklet' })}
            </a>
          </div>
        </div>
      `
    },
    'resources/podcasts': {
      title: 'Podcasts',
      description: 'Listen to our podcasts for inspiration and biblical teaching.',
      content: `
        <h2>Podcast Ministry</h2>
        <p>Stay connected with our podcast series featuring biblical teaching, inspiration, and church news.</p>
        
        <h3>Featured Podcasts</h3>
        <ul>
          <li><strong>Sound Doctrine:</strong> Biblical teaching and theological insights</li>
          <li><strong>White Wing Messenger Podcast:</strong> Church news and discussions</li>
          <li><strong>Leadership Insights:</strong> Ministry leadership training</li>
          <li><strong>Global Voices:</strong> Stories from our worldwide church</li>
        </ul>
        
        <h3>Subscribe</h3>
        <p>Available on all major podcast platforms including Apple Podcasts, Spotify, and Google Podcasts.</p>
      `
    },
    'resources/youtube': {
      title: 'YouTube',
      description: 'Watch our videos on YouTube for worship, teaching, and inspiration.',
      content: `
        <h2>YouTube Channel</h2>
        <p>Subscribe to our YouTube channel for the latest videos, live streams, and archived content.</p>
        
        <h3>Channel Content</h3>
        <ul>
          <li>Live worship services</li>
          <li>Conference sessions and special events</li>
          <li>Teaching series and Bible studies</li>
          <li>Global ministry highlights</li>
          <li>Youth and children's content</li>
        </ul>
        
        <h3>Stay Updated</h3>
        <p>Subscribe and turn on notifications to be alerted when new content is available.</p>
      `
    },
    'resources/library': {
      title: t('library_title', { defaultValue: 'Library' }),
      description: t('library_description', { defaultValue: 'Coming soon.' }),
      content: `<p class="lead text-muted text-center my-5 py-md-4">${t('content_coming_soon', { defaultValue: 'Content coming soon...' })}</p>`,
    },
    'resources/assembly-documents': {
      title: 'Assembly Documents',
      description: 'Official documents and proceedings from our International Assembly.',
      content: `
        <h2>International Assembly Documents</h2>
        <p>Access official documents, resolutions, and proceedings from our International Assembly gatherings.</p>
        
        <h3>Available Documents</h3>
        <ul>
          <li>Assembly resolutions and decisions</li>
          <li>Constitutional amendments and changes</li>
          <li>Ministry reports and updates</li>
          <li>Statistical reports and data</li>
          <li>Official statements and declarations</li>
        </ul>
        
        <h3>Archive</h3>
        <p>Historical assembly documents dating back to previous gatherings are also available for research and reference.</p>
      `
    },
    'resources/policies-guidelines': {
      title: 'Policies & Guidelines',
      description: 'Official church policies and ministry guidelines.',
      content: `
        <h2>Church Policies and Guidelines</h2>
        <p>Official policies and guidelines for ministry, administration, and church governance.</p>
        
        <h3>Policy Areas</h3>
        <ul>
          <li>Ministry standards and practices</li>
          <li>Administrative procedures</li>
          <li>Financial management guidelines</li>
          <li>Child protection policies</li>
          <li>Conflict resolution procedures</li>
        </ul>
        
        <h3>Updates</h3>
        <p>Policies are regularly reviewed and updated to ensure they reflect current best practices and legal requirements.</p>
      `
    },
    'resources/public-statements': {
      title: 'Public Statements',
      description: 'Official statements on important issues and current events.',
      content: `
        <h2>Public Statements</h2>
        <p>Official statements from church leadership on important social, theological, and cultural issues.</p>
        
        <h3>Statement Categories</h3>
        <ul>
          <li>Theological and doctrinal positions</li>
          <li>Social justice and human rights</li>
          <li>Family and marriage</li>
          <li>Religious freedom</li>
          <li>Current events and crises</li>
        </ul>
        
        <h3>Purpose</h3>
        <p>These statements help our global church understand our position on important issues and provide guidance for ministry and witness.</p>
      `
    },
    'resources/assembly-minutes': {
      title: 'Assembly Minutes',
      description: 'Official minutes and records from International Assembly meetings.',
      content: `
        <h2>Assembly Minutes</h2>
        <p>Official minutes and records from International Assembly business sessions and meetings.</p>
        
        <h3>Record Keeping</h3>
        <ul>
          <li>Business session proceedings</li>
          <li>Committee reports and recommendations</li>
          <li>Voting results and decisions</li>
          <li>Financial reports and budgets</li>
          <li>Leadership appointments and changes</li>
        </ul>
        
        <h3>Transparency</h3>
        <p>These records ensure transparency and accountability in our church governance and decision-making processes.</p>
      `
    },
    'resources/church-resources': {
      title: 'Church Resources',
      description: 'Tools and materials for local church ministry and administration.',
      content: `
        <h2>Local Church Resources</h2>
        <p>Practical tools and materials to support local church ministry, administration, and growth.</p>
        
        <h3>Available Resources</h3>
        <ul>
          <li>Ministry planning templates</li>
          <li>Administrative forms and documents</li>
          <li>Training materials for leaders</li>
          <li>Curriculum for various age groups</li>
          <li>Promotional materials and graphics</li>
        </ul>
        
        <h3>Support</h3>
        <p>Our team is available to help local churches implement these resources effectively in their ministry context.</p>
      `
    },
    'resources/church-locator': {
      title: 'Church Locator',
      description: 'Find a Church of God of Prophecy congregation near you.',
      content: `
        <h2>Find a Church Near You</h2>
        <p>Use our church locator to find a Church of God of Prophecy congregation in your area.</p>
        
        <h3>Search Options</h3>
        <ul>
          <li>Search by city, state, or country</li>
          <li>Filter by services and programs</li>
          <li>View contact information and directions</li>
          <li>See service times and special events</li>
        </ul>
        
        <h3>Global Network</h3>
        <p>With over 12,000 churches and missions worldwide, you're likely to find a congregation near you.</p>
      `
    },
    'resources/church-logos': {
      title: 'Church Logos',
      description: 'Official logos and branding materials for church use.',
      content: `
        <h2>Official Church Logos</h2>
        <p>Download official Church of God of Prophecy logos and branding materials for church and ministry use.</p>
        
        <h3>Available Formats</h3>
        <ul>
          <li>High-resolution PNG files</li>
          <li>Vector formats (AI, EPS)</li>
          <li>Various color options</li>
          <li>Different size configurations</li>
        </ul>
        
        <h3>Usage Guidelines</h3>
        <p>Please follow our brand guidelines when using official logos to maintain consistency and proper representation.</p>
      `
    },
    'resources/treasurers-report': {
      title: "Treasurer's Report",
      description: 'Financial reports and transparency information.',
      content: `
        <h2>Financial Transparency</h2>
        <p>We believe in financial transparency and accountability. View our annual financial reports and budget information.</p>
        
        <h3>Available Reports</h3>
        <ul>
          <li>Annual financial statements</li>
          <li>Budget summaries and allocations</li>
          <li>Ministry spending reports</li>
          <li>Global missions funding</li>
          <li>Independent audit results</li>
        </ul>
        
        <h3>Stewardship</h3>
        <p>These reports demonstrate our commitment to faithful stewardship of the resources entrusted to our ministry.</p>
      `
    },
    'resources/directory': {
      title: 'Directory',
      description: 'Contact information for church leaders and offices worldwide.',
      content: `
        <h2>Global Church Directory</h2>
        <p>Contact information for church leaders, offices, and ministries around the world.</p>
        
        <h3>Directory Sections</h3>
        <ul>
          <li>International leadership contacts</li>
          <li>Regional and national bishops</li>
          <li>Ministry department contacts</li>
          <li>Educational institution information</li>
          <li>Administrative office details</li>
        </ul>
        
        <h3>Updates</h3>
        <p>Directory information is regularly updated to ensure accuracy and current contact details.</p>
      `
    },

    // Give Section // https://app.easytithe.com/app/giving/cogop
    'give': {
      title: t('give_title', { defaultValue: 'Give' }),
      description: t('give_description', { defaultValue: 'Support the ministry and mission of the Church of God of Prophecy through your giving.' }),
      content: `
        <h2>${t('why_we_give', { defaultValue: 'Why We Give' })}</h2>
        <p>${t('giving_desc', { defaultValue: 'Giving is an act of worship and a way to participate in God\'s work around the world. Your generous gifts help support local ministries, global missions, and community outreach.' })}</p>
        
        <h2>${t('ways_to_give', { defaultValue: 'Ways to Give' })}</h2>
        <div class="row">
          <div class="col-md-4 mb-3">
            <div class="card">
              <div class="card-body text-center">
                <h5 class="card-title">${t('online_giving', { defaultValue: 'Online Giving' })}</h5>
                <p class="card-text">${t('online_giving_desc', { defaultValue: 'Secure online donations' })}</p>
                <button class="btn btn-dark">${t('give_online', { defaultValue: 'Give Online' })}</button>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card">
              <div class="card-body text-center">
                <h5 class="card-title">${t('mail_check', { defaultValue: 'Mail a Check' })}</h5>
                <p class="card-text">${t('mail_check_desc', { defaultValue: 'Send to our mailing address' })}</p>
                <button class="btn btn-outline-primary">${t('get_address', { defaultValue: 'Get Address' })}</button>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card">
              <div class="card-body text-center">
                <h5 class="card-title">${t('text_to_give', { defaultValue: 'Text to Give' })}</h5>
                <p class="card-text">${t('text_to_give_desc', { defaultValue: 'Give via text message' })}</p>
                <button class="btn btn-outline-primary">${t('learn_more', { defaultValue: 'Learn More' })}</button>
              </div>
            </div>
          </div>
        </div>
      `
    },

    // Find a Church Section
    'find-a-church': {
      title: t('find_a_church_title', { defaultValue: 'Find a Church' }),
      description: t('find_a_church_description', { defaultValue: 'Locate a Church of God of Prophecy congregation near you.' }),
      content: `
        <h2>${t('find_congregation', { defaultValue: 'Find a Congregation Near You' })}</h2>
        <p>${t('find_church_desc', { defaultValue: 'With over 12,000 churches and missions in 135 countries, there\'s likely a Church of God of Prophecy congregation near you.' })}</p>
        
        <div class="row">
          <div class="col-md-6">
            <h3>${t('search_by_location', { defaultValue: 'Search by Location' })}</h3>
            <form class="mb-4">
              <div class="mb-3">
                <label for="location" class="form-label">${t('enter_city_state_country', { defaultValue: 'Enter City, State, or Country' })}</label>
                <input type="text" class="form-control" id="location" placeholder="${t('location_placeholder', { defaultValue: 'e.g., Cleveland, TN or United States' })}">
              </div>
              <button type="submit" class="btn btn-dark">${t('search_churches', { defaultValue: 'Search Churches' })}</button>
            </form>
          </div>
          <div class="col-md-6">
            <h3>${t('contact_information', { defaultValue: 'Contact Information' })}</h3>
            <p>${t('cant_find_church', { defaultValue: 'Can\'t find a church near you? Contact us for assistance.' })}</p>
            <p><strong>${t('phone', { defaultValue: 'Phone' })}:</strong> (423) 559-5100<br>
            <strong>Email:</strong> info@cogop.org</p>
            <a href="/get-connected/contact" class="btn btn-outline-primary">${t('contact_us', { defaultValue: 'Contact Us' })}</a>
          </div>
        </div>
        
        <h3>${t('what_to_expect_at_churches', { defaultValue: 'What to Expect at Our Churches' })}</h3>
        <p>${t('what_to_expect_desc', { defaultValue: 'At Church of God of Prophecy congregations, you\'ll find:' })}</p>
        <ul>
          <li>${t('spirit_led_worship_teaching', { defaultValue: 'Spirit-led worship and biblical teaching' })}</li>
          <li>${t('warm_welcoming_fellowship', { defaultValue: 'Warm, welcoming fellowship' })}</li>
          <li>${t('opportunities_spiritual_growth', { defaultValue: 'Opportunities for spiritual growth' })}</li>
          <li>${t('community_outreach_missions', { defaultValue: 'Community outreach and missions' })}</li>
          <li>${t('programs_for_all_ages', { defaultValue: 'Programs for all ages' })}</li>
        </ul>
      `
    }
  },

  articles: [],
  events: [],
  loading: true,
  refreshData: async () => {
    // This is a placeholder function for static data
    // The actual implementation is in the ContentProvider
  }
});

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { language } = useI18n();
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [fetchedArticles, fetchedEvents] = await Promise.all([
        fetchArticlesFromFirestore(language),
        fetchEventsFromFirestore(language)
      ]);
      setArticles(fetchedArticles);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching articles and events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [language]);

  const staticData = useMemo(() => getContentData(), [language]);

  const contextValue: ContentContextType = {
    ...staticData,
    articles,
    events,
    loading,
    refreshData
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
}

export function getPageContent(path: string): PageContent {
  const staticData = getContentData();
  return staticData.pages[path] || {
    title: 'Page Not Found',
    description: 'The requested page could not be found.',
    content: '<p>Page content not available.</p>'
  };
} 
