import { I18n } from 'i18n-js';

const i18n = new I18n();

i18n.translations = {
  en: {
    // Navigation
    welcome: 'Welcome',
    home: 'Home',
    about: 'About',
    get_connected: 'Get Connected',
    calendar: 'Calendar',
    contact: 'Contact',
    faq: 'FAQ',
    employment: 'Employment',
    schedule_tour: 'Schedule a Tour',
    who_we_are: 'Who We Are',
    what_we_believe: 'What We Believe',
    our_leadership: 'Our Leadership',
    our_history: 'Our History',
    membership: 'Membership',
    ministries: 'Ministries',
    resources: 'Resources',
    give: 'Give',
    where_we_serve: 'Where We Serve',
    presiding_bishop: 'Presiding Bishop',
    africa: 'Africa',
    asia_australia_oceania: 'Asia, Australia & Oceania',
    caribbean_atlantic: 'Caribbean & Atlantic',
    central_america: 'Central America',
    north_america: 'North America',
    south_america: 'South America',
    europe_middle_east: 'Europe & Middle East',
    
    // Statistics
    countries: 'Countries',
    churches_and_missions: 'Churches and Missions',
    members_around_world: 'Members Around the World',
    languages: 'Languages',
    
    // Hero/Carousel
    hero_title_1: 'We are the Church of God of Prophecy',
    hero_desc_1: 'This 24-page booklet is a guide for anyone interested in understanding who we are, what we believe, and how we live out our mission together.',
    hero_btn_1: 'Order Now',
    hero_title_2: 'Global Community of Faith',
    hero_desc_2: 'Join us as we serve Christ in 135 countries with over 12,000 churches and missions worldwide.',
    hero_btn_2: 'Learn More',
    hero_title_3: 'Spirit-Led Ministry',
    hero_desc_3: 'Discover how we are fulfilling the Great Commission through the power of the Holy Spirit.',
    hero_btn_3: 'Our Mission',
    
    // Buttons & UI
    sign_in: 'Sign In',
    sign_up: 'Sign Up',
    learn_more: 'Learn More',
    view_calendar: 'View Calendar',
    contact_us: 'Contact Us',
    back_to_news: 'Back to All News',
    content_coming_soon: 'Content coming soon...',
    
    // Page Titles & Descriptions
    get_connected_title: 'Get Connected',
    get_connected_description: 'Connect with the Church of God of Prophecy community and discover ways to get involved.',
    
    about_title: 'About',
    about_description: 'Learn about our identity, beliefs, and mission as a global church movement.',
    
    who_we_are_title: 'Who We Are',
    who_we_are_description: 'Discover our identity as a Christ-centered, Spirit-led global movement.',
    
    what_we_believe_title: 'What We Believe',
    what_we_believe_description: 'Explore our core beliefs, doctrine, and theological foundations.',
    
    our_leadership_title: 'Our Leadership',
    our_leadership_description: 'Meet the leaders who guide and serve our global church community.',
    
    our_history_title: 'Our History',
    our_history_description: 'Journey through the rich history of the Church of God of Prophecy.',
    
    membership_title: 'Membership',
    membership_description: 'Learn about becoming a member of our global church family.',
    
    // Ministries
    ministries_title: 'Ministries',
    ministries_description: 'Discover our various ministries serving communities worldwide.',
    
    admin_finance_title: 'Administration & Finance',
    admin_finance_description: 'Supporting ministry through sound financial stewardship and administration.',
    
    global_missions_title: 'Global Missions',
    global_missions_description: 'Discover our worldwide mission work and evangelism efforts across 135 countries.',
    
    harvest_partners_title: 'Harvest Partners',
    harvest_partners_description: 'Supporting missionaries and ministry partners around the world.',
    
    helping_hands_title: 'Helping Hands',
    helping_hands_description: 'Disaster relief and humanitarian assistance ministry.',
    
    one_child_fund_title: 'One Child Fund',
    one_child_fund_description: 'Supporting children and families in need around the world.',
    
    heritage_title: 'Heritage',
    heritage_description: 'Preserving and sharing the history of the Church of God of Prophecy.',
    
    fields_of_wood_title: 'Fields of the Wood',
    fields_of_wood_description: 'A biblical theme park and retreat center in Murphy, North Carolina.',
    
    stewardship_title: 'Stewardship',
    stewardship_description: 'Teaching biblical principles of stewardship and financial responsibility.',
    
    bookstore_title: 'Bookstore',
    bookstore_description: 'Christian books, resources, and materials for spiritual growth.',
    
    global_communications_title: 'Global Communications',
    global_communications_description: 'Connecting our worldwide church through media and communications.',
    
    white_wing_messenger_title: 'White Wing Messenger',
    white_wing_messenger_description: 'Our official church publication sharing news, inspiration, and teaching.',
    
    prayer_title: 'Prayer',
    prayer_description: 'Connecting believers worldwide through the power of prayer.',
    
    international_assembly_title: 'International Assembly',
    international_assembly_description: 'Our global church gathering held every four years.',
    
    leadership_development_title: 'Leadership Development',
    leadership_development_description: 'Training and equipping leaders for effective ministry worldwide.',
    
    accredited_ministries_title: 'Accredited Ministries',
    accredited_ministries_description: 'Officially recognized ministries and institutions.',
    
    center_biblical_leadership_title: 'Center for Biblical Leadership',
    center_biblical_leadership_description: 'Developing leaders through biblical principles and practical training.',
    
    spirit_life_seminary_title: 'Spirit & Life Seminary',
    spirit_life_seminary_description: 'Training ministers for effective service in the 21st century.',
    
    childrens_title: "Children's Ministry",
    childrens_description: 'Nurturing faith in the hearts of our youngest members.',
    
    youth_title: 'Youth Ministry',
    youth_description: 'Empowering young people to grow in faith and leadership.',
    
    // Where We Serve
    where_we_serve_title: 'Where We Serve',
    where_we_serve_description: 'Explore our global presence and ministry impact.',
    
    presiding_bishop_title: 'Presiding Bishop',
    presiding_bishop_description: 'Leadership and oversight of our global church movement.',
    
    africa_title: 'Africa',
    africa_description: 'Ministry and church growth across the African continent.',
    
    asia_australia_oceania_title: 'Asia, Australia & Oceania',
    asia_australia_oceania_description: 'Spreading the Gospel across Asia, Australia, and the Pacific islands.',
    
    caribbean_atlantic_title: 'Caribbean & Atlantic',
    caribbean_atlantic_description: 'Island ministries throughout the Caribbean and Atlantic regions.',
    
    central_america_title: 'Central America',
    central_america_description: 'Church growth and ministry throughout Central America.',
    
    north_america_title: 'North America',
    north_america_description: 'Ministry throughout the United States, Canada, and Mexico.',
    
    south_america_title: 'South America',
    south_america_description: 'Dynamic church growth across South American nations.',
    
    europe_middle_east_title: 'Europe & Middle East',
    europe_middle_east_description: 'Ministry in challenging and diverse cultural contexts.',
    
    // Resources
    resources_title: 'Resources',
    resources_description: 'Access educational materials, documents, and spiritual resources.',
    
    get_started_title: 'Get Started',
    get_started_description: 'Begin your journey with the Church of God of Prophecy.',
    
    how_to_know_god_title: 'How to Know God',
    how_to_know_god_description: 'Discover a personal relationship with Jesus Christ.',
    
    media_title: 'Media',
    media_description: 'Videos, audio, and multimedia resources for spiritual growth.',
    
    podcasts_title: 'Podcasts',
    podcasts_description: 'Listen to inspiring messages and teachings from our leaders.',
    
    youtube_title: 'YouTube',
    youtube_description: 'Watch our latest videos and live streams.',
    
    library_title: 'Library',
    library_description: 'Access our digital library of books, articles, and educational materials.',
    
    assembly_documents_title: 'Assembly Documents',
    assembly_documents_description: 'Official documents and proceedings from our International Assembly.',
    
    policies_guidelines_title: 'Policies & Guidelines',
    policies_guidelines_description: 'Official church policies and ministry guidelines.',
    
    public_statements_title: 'Public Statements',
    public_statements_description: 'Official statements on important issues and current events.',
    
    assembly_minutes_title: 'Assembly Minutes',
    assembly_minutes_description: 'Minutes and records from assembly meetings.',
    
    church_resources_title: 'Church Resources',
    church_resources_description: 'Tools and materials for local church ministry.',
    
    church_locator_title: 'Church Locator',
    church_locator_description: 'Find a Church of God of Prophecy congregation near you.',
    
    church_logos_title: 'Church Logos',
    church_logos_description: 'Official logos and branding materials for church use.',
    
    treasurers_report_title: "Treasurer's Report",
    treasurers_report_description: 'Financial reports and transparency information.',
    
    directory_title: 'Directory',
    directory_description: 'Contact information for church leaders and offices worldwide.',
    
    // Give
    give_title: 'Give',
    give_description: 'Support the ministry through your generous giving.',
    
    // Error pages
    '404_title': '404 - Page Not Found',
    '404_description': 'The page you are looking for does not exist.',
    '404_content': '<p>This page could not be found.</p>',
    
    // Common content headings
    statement_of_faith: 'Statement of Faith',
    the_trinity: 'The Trinity',
    jesus_christ: 'Jesus Christ',
    salvation: 'Salvation',
    holy_spirit: 'The Holy Spirit',
    the_church: 'The Church',
    scripture: 'Scripture',
    our_mission: 'Our Mission',
    get_involved: 'Get Involved',
    contact_info: 'Contact Information',
    
    // Footer
    social_media: 'Social Media',
    quick_links: 'Quick Links',
    contact_information: 'Contact Information',
    
    // Search
    search: 'Search',
    search_placeholder: 'Search pages, articles, podcasts, and events...',
    search_shortcut: 'Search (Ctrl+K)',
    start_typing_to_search: 'Start typing to search...',
    search_help_text: 'Search through pages, articles, podcasts, and events',
    searching: 'Searching...',
    no_results_found: 'No results found',
    no_results_help: 'Try different keywords or check your spelling',
    search_navigation_help: 'Use arrow keys to navigate, Enter to select, Esc to close',
    
    // Result types
    page: 'Page',
    article: 'Article',
    podcast: 'Podcast',
    event: 'Event',
    
    // Loading states
    loading: 'Loading...',
    checking_permissions: 'Checking permissions...',
    
    // FAQ Questions and Answers
    faq_general_questions: 'General Questions',
    faq_what_is_cogop: 'What is the Church of God of Prophecy?',
    faq_what_is_cogop_answer: 'The Church of God of Prophecy is a global, Christ-centered movement rooted in Scripture, steadfast in faith, passionate about people, and dedicated to reconciling the world to Christ through the power of the Holy Spirit. We have over 12,000 churches and missions in 135 countries worldwide.',
    faq_when_founded: 'When was the Church of God of Prophecy founded?',
    faq_when_founded_answer: 'The Church of God of Prophecy was founded in the early 20th century as part of the modern Pentecostal movement. We have grown from humble beginnings to become a worldwide fellowship of believers committed to advancing God\'s kingdom on earth.',
    faq_headquarters_location: 'Where is your headquarters located?',
    faq_headquarters_answer: 'Our international headquarters is located in Cleveland, Tennessee, USA, at 3720 Keith Street NW. Our mailing address is PO Box 2910, Cleveland, TN 37320. You can reach us at (423) 559-5100.',
    
    faq_bible_belief: 'What do you believe about the Bible?',
    faq_bible_answer: 'We believe the Bible is the inspired, inerrant Word of God and our final authority for faith and practice. Scripture is God-breathed and profitable for teaching, reproof, correction, and instruction in righteousness.',
    faq_trinity_belief: 'Do you believe in the Trinity?',
    faq_trinity_answer: 'Yes, we believe in one God eternally existing in three persons: Father, Son, and Holy Spirit. Each person of the Trinity is fully God, yet there is only one God.',
    faq_salvation_position: 'What is your position on salvation?',
    faq_salvation_answer: 'We believe salvation is by grace through faith in Jesus Christ, not by works. It is a free gift from God available to all who repent of their sins and accept Jesus as their personal Lord and Savior.',
    faq_holy_spirit_baptism: 'Do you believe in the baptism of the Holy Spirit?',
    faq_holy_spirit_answer: 'Yes, we believe in the baptism of the Holy Spirit as a distinct experience available to all believers. This empowerment enables Christians to live victorious lives and serve God effectively in ministry and witness.',
    
    faq_services_worship: 'Services and Worship',
    faq_worship_service: 'What can I expect during a worship service?',
    faq_dress_code: 'What should I wear to church?',
    faq_dress_answer: 'Come as you are! We welcome people regardless of how they dress. Some prefer casual attire while others dress more formally. The most important thing is that you feel comfortable and can focus on worshiping God.',
    faq_children_programs: 'Do you have programs for children and youth?',
    faq_children_answer: 'Yes! We have age-appropriate programs including Sunday School, children\'s church, youth groups, Vacation Bible School, camps, and special events. Our goal is to help young people develop a strong relationship with Jesus Christ.',
    
    faq_membership_involvement: 'Membership and Getting Involved',
    faq_become_member: 'How do I become a member?',
    faq_member_answer: 'Membership is open to all who have accepted Jesus Christ as their personal Savior. The steps include: accepting Christ, being baptized by immersion, committing to spiritual growth through Bible study and fellowship, and using your gifts to serve others.',
    faq_baptism_required: 'Do I need to be baptized to attend church?',
    faq_baptism_answer: 'No, you don\'t need to be baptized to attend church. Everyone is welcome to join us for worship and fellowship. Baptism is required for membership and represents your public declaration of faith in Jesus Christ.',
    faq_get_involved_ministry: 'How can I get involved in ministry?',
    faq_ministry_answer: 'There are many ways to get involved! You can serve in worship teams, children\'s ministry, youth programs, missions, community outreach, administrative roles, and more. Contact your local church leadership to discover opportunities that match your gifts and interests.',
    
    // Article Categories
    spirit_life_seminary: 'Spirit and Life Seminary',
    digital_evangelism: 'Digital Evangelism',
    featured_article: 'Featured Article',
    global_missions: 'Global Missions',
    youth_ministry: 'Youth Ministry',
    
    // Event Categories
    youth_conference: 'Youth Conference',
    stewardship: 'Stewardship',
    global_assembly: 'Global Assembly',
    
    // Contact Information
    physical_address: 'Physical Address',
    mailing_address: 'Mailing Address',
    contact_form: 'Contact Form',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send_message: 'Send Message',
    phone: 'Phone',
    
    // Common UI Elements
    view_opportunities: 'View Opportunities',
    stay_updated: 'Stay updated with upcoming events, services, and important dates',
    reach_out: 'Reach out with questions, prayer requests, or to learn more',
    explore_career: 'Explore career opportunities within our organization',
    visit_facilities: 'Visit our facilities and learn about our community',
    
    // Form Labels
    full_name: 'Full Name',
    display_name: 'Display Name',
    password: 'Password',
    confirm_password: 'Confirm Password',
    
    // Buttons
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    
    // Navigation Labels
    toggle_navigation: 'Toggle navigation',
    select_language: 'Select language',
    english: 'English',
    bulgarian: 'Български',

    // Article titles and content
    seminary_commencement_title: 'Spirit and Life Seminary Celebrates Fourth Commencement Ceremony',
    seminary_commencement_excerpt: 'Celebrating the achievements of our newest ministry graduates.',
    digital_communities_title: 'Sharing and Growing in Online Communities',
    digital_communities_excerpt: 'How our digital ministry is reaching new audiences.',
    digital_gospel_title: 'Therefore, Login and Upload the Gospel into All the World',
    digital_gospel_excerpt: 'Exploring the intersection of technology and ministry.',
    sharing_gospel_title: 'Sharing the Gospel Across the World',
    sharing_gospel_excerpt: 'Learn about our mission work across 135 countries.',
    icm_youth_title: 'ICM Youth Conference: Empowering the Next Generation',
    icm_youth_excerpt: 'Young people from around the world gather for spiritual growth.',

    // Podcast series and content
    sound_doctrine_series: 'Sound Doctrine',
    sound_doctrine_title: "Time? New Testament O'Clock (1981)",
    sound_doctrine_desc: 'Step back to the 2000 International Assembly as Bishop Tedroy Powell opens the gathering with a stirring message rooted in Matthew 5:3.',
    white_wing_podcast_series: 'White Wing Messenger Podcast',
    white_wing_podcast_title: 'The Call: To Send and Support',
    white_wing_podcast_desc: "Join podcast host Managing Editor Marsha Robinson as we end the month of April with a roundtable discussion of this month's White Wing Messenger.",

    // Event details
    icm_testify_title: 'ICM: Testify',
    icm_testify_desc: 'Join young adults from around the world for a transformative conference experience.',
    stewardshift_title: 'StewardShift Conference',
    stewardshift_desc: 'Learn about biblical stewardship and financial responsibility.',
    international_assembly_desc: 'Our global church gathering bringing together believers from 135 countries.',
    north_carolina_asheville: 'North Carolina, near Asheville',
    ridgecrest_center: 'Ridgecrest Conference Center',
    peerless_church: 'Peerless Church',
    rosen_shingle_creek: 'Rosen Shingle Creek',

    // FAQ content
    faq_lead_text: "We've compiled answers to some of the most common questions about the Church of God of Prophecy. If you don't find what you're looking for, please",
    faq_contact_link: 'contact us',
    faq_contact_link_end: 'directly.',

    // Page content
    global_movement_heading: 'A Global Movement',
    global_movement_text: 'The Church of God of Prophecy is a vibrant, global Christian movement with presence in 135 countries and territories. We are united by our common faith in Jesus Christ and our commitment to biblical truth.',
    our_identity_heading: 'Our Identity',
    our_identity_intro: 'We are:',
    christ_centered: 'Christ-centered in our worship and witness',
    spirit_led: 'Spirit-led in our ministry and mission',
    scripture_based: 'Scripture-based in our beliefs and practices',
    global_reach: 'Global in our reach and impact',
    unified_diversity: 'Unified in our diversity',
    our_story_heading: 'Our Story',
    our_story_text: 'Founded in the early 20th century, we have grown from humble beginnings to become a worldwide fellowship of believers committed to advancing God\'s kingdom on earth.',

    // Additional content translations
    calendar_title: 'Calendar',
    calendar_description: 'Stay updated with upcoming events, services, and important dates in our church calendar.',
    calendar_content_coming_soon: 'Calendar content coming soon...',
    contact_us_title: 'Contact Us',
    contact_us_description: 'Reach out to us with your questions, prayer requests, or to learn more about our church.',
    faq_title: 'Frequently Asked Questions',
    faq_description: 'Find answers to common questions about our church, beliefs, and services.',
    employment_title: 'Employment',
    employment_description: 'Explore career opportunities within our organization.',
    schedule_tour_title: 'Schedule a Tour',
    schedule_tour_description: 'Visit our facilities and learn about our community.',

    // Additional FAQ sections
    faq_giving_support: 'Giving & Support',
    faq_tithe_required: 'Do I have to tithe or give money?',
    faq_tithe_answer: 'Giving is voluntary and should come from a joyful heart. We teach biblical stewardship and believe tithing (giving 10% of income) is a biblical principle, but we never pressure anyone to give. Your relationship with God is not based on your financial contributions.',
    faq_donations_used: 'How are donations used?',
    faq_donations_answer: 'Donations support local church ministries, global missions, humanitarian aid, educational programs, and administrative costs. We practice financial transparency and provide annual reports showing how funds are used to advance God\'s kingdom worldwide.',
    
    faq_global_ministry: 'Global Ministry',
    faq_support_missions: 'How can I support global missions?',
    faq_support_missions_answer: 'You can support missions through prayer, financial giving, participating in mission trips, sponsoring a child through our One Child Fund, or becoming a Harvest Partner to support missionaries. Contact us to learn about specific opportunities.',
    faq_international_assembly: 'What is the International Assembly?',
    faq_international_assembly_answer: 'The International Assembly is our global church gathering held every four years. It brings together delegates from around the world for worship, fellowship, business sessions, and to set direction for our worldwide ministry.',
    
    faq_contact_next_steps: 'Contact and Next Steps',
    faq_find_local_church: 'How do I find a local church?',
    faq_find_local_church_answer: 'Use our church locator to find a congregation near you. You can also call our headquarters at (423) 559-5100 or contact us online for assistance in finding a local church.',
    faq_schedule_tour_question: 'Can I schedule a tour of your facilities?',
    faq_schedule_tour_answer: 'Yes! We\'d love to show you around our facilities. You can schedule a tour of our headquarters in Cleveland, Tennessee, or visit Fields of the Wood, our biblical theme park in North Carolina.',
    faq_more_questions: 'I have more questions. How can I get answers?',
    faq_more_questions_answer: 'We\'re here to help! You can contact us through our website, call us at (423) 559-5100, or email us at info@cogop.org. You can also reach out to a local Church of God of Prophecy pastor in your area.',
    
    // FAQ footer section
    still_have_questions: 'Still Have Questions?',
    still_have_questions_text: 'We\'re here to help! Don\'t hesitate to reach out with any questions about our church, beliefs, or how to get involved.',
    find_a_church: 'Find a Church',

    // Page content sections
    our_ministries: 'Our Ministries',
    serving_god_through_ministry: 'Serving God Through Ministry',
    serving_god_ministry_desc: 'The Church of God of Prophecy is committed to fulfilling the Great Commission through various ministries that serve our local communities and reach the world.',
    reaching_world_for_christ: 'Reaching the World for Christ',
    global_missions_desc: 'Our global missions ministry spans 135 countries and territories, working to fulfill the Great Commission by making disciples of all nations.',
    our_mission_text: 'To present the Gospel of Jesus Christ to every person in every nation, establishing churches and training leaders to continue the work of evangelism and discipleship.',
    key_focus_areas: 'Key Focus Areas',
    church_planting: 'Church planting in unreached areas',
    training_leadership: 'Training indigenous leadership',
    bible_translation: 'Bible translation and distribution',
    medical_missions: 'Medical missions and humanitarian aid',
    educational_ministries: 'Educational ministries',
    pray: 'Pray',
    pray_desc: 'Join our prayer network for missionaries and ministry partners around the world.',
    give_desc: 'Support missionaries and mission projects through financial contributions.',

    // Youth Ministry content
    empowering_next_generation: 'Empowering the Next Generation',
    youth_ministry_desc: 'Our youth ministry is dedicated to helping young people develop a strong relationship with Jesus Christ and discover their purpose in God\'s kingdom.',
    programs_activities: 'Programs and Activities',
    icm_youth_conference: 'ICM (International Convention of Ministry) Youth Conference',
    local_youth_groups: 'Local youth groups and Bible studies',
    leadership_development_programs: 'Leadership development programs',
    mission_trips: 'Mission trips and service projects',
    sports_recreation: 'Sports and recreation ministries',
    icm_testify: 'ICM: Testify',
    icm_testify_desc_full: 'Our annual international youth conference brings together young adults from around the world for worship, teaching, and fellowship.',
    timothy_quote: '"Don\'t let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity."',
    timothy_reference: '1 Timothy 4:12',

    // Seminary content
    training_leaders_ministry: 'Training Leaders for Ministry',
    seminary_desc: 'Spirit and Life Seminary exists to provide quality theological education and practical ministry training for current and future leaders in the Church of God of Prophecy.',
    our_programs: 'Our Programs',
    bachelor_arts_ministry: 'Bachelor of Arts in Ministry',
    master_divinity: 'Master of Divinity',
    master_christian_leadership: 'Master of Arts in Christian Leadership',
    certificate_programs: 'Certificate programs in various ministry specializations',
    continuing_education: 'Continuing education for ministers',
    seminary_mission: 'To provide excellent academic and practical training that equips men and women for effective ministry in the global Church of God of Prophecy.',
    seminary_accreditation: 'Spirit and Life Seminary is committed to maintaining the highest academic standards while staying true to our Pentecostal heritage and biblical foundation.',

    // Children's Ministry content
    building_faith_early: 'Building Faith from an Early Age',
    children_ministry_desc: 'Our children\'s ministry is designed to help children develop a love for God, learn biblical truths, and grow in their relationship with Jesus Christ.',
    age_appropriate_programs: 'Age-Appropriate Programs',
    sunday_school_classes: 'Sunday School classes for all age groups',
    childrens_church: 'Children\'s church during worship services',
    vacation_bible_school: 'Vacation Bible School',
    kids_camps: 'Kids\' camps and retreats',
    family_ministry_events: 'Family ministry events',
    teaching_approach: 'Teaching Approach',
    teaching_approach_desc: 'We use creative, interactive methods to help children:',
    learn_bible_stories: 'Learn Bible stories and principles',
    develop_prayer_habits: 'Develop prayer habits',
    understand_gods_love: 'Understand God\'s love',
    build_christian_friendships: 'Build Christian friendships',
    serve_community: 'Serve others in their community',

    // One Child Fund content
    changing_lives_one_child: 'Changing Lives One Child at a Time',
    one_child_fund_desc: 'The One Child Fund is a ministry of compassion that provides educational opportunities, basic necessities, and spiritual nurturing for children in developing countries.',
    how_it_works: 'How It Works',
    monthly_sponsorship_provides: 'Through monthly sponsorship, supporters provide:',
    educational_expenses: 'Educational expenses including tuition, books, and supplies',
    nutritious_meals: 'Nutritious meals and healthcare',
    clothing_necessities: 'Clothing and other basic necessities',
    spiritual_guidance: 'Spiritual guidance and biblical instruction',
    hope_future: 'Hope for a brighter future',
    make_difference: 'Make a Difference',
    sponsor_child_desc: 'For just $30 per month, you can sponsor a child and help break the cycle of poverty through education and Christian love.',
    sponsor_child: 'Sponsor a Child',
    sponsor_child_btn_desc: 'Begin your sponsorship journey today and change a child\'s life forever.',
    start_sponsoring: 'Start Sponsoring',
    learn_more_btn_desc: 'Discover more about our global children\'s ministry initiatives.',
    global_impact: 'Global Impact',
    global_impact_desc: 'The One Child Fund operates in multiple countries, partnering with local Church of God of Prophecy congregations to identify and support children who need educational assistance.',

    // About section content
    global_movement_desc: 'The Church of God of Prophecy is a vibrant, global Christian movement with presence in 135 countries and territories. We are united by our common faith in Jesus Christ and our commitment to biblical truth.',
    our_vision: 'Our Vision',
    our_vision_text: 'To be a Spirit-led global community of believers committed to reaching every person in every nation with the Gospel of Jesus Christ.',
    our_values: 'Our Values',
    biblical_authority: 'Biblical Authority',
    biblical_authority_desc: 'We believe the Bible is the inspired Word of God',
    global_unity: 'Global Unity',
    global_unity_desc: 'We are one church with many expressions',
    spirit_led_living: 'Spirit-Led Living',
    spirit_led_living_desc: 'We depend on the Holy Spirit for guidance',
    holistic_ministry: 'Holistic Ministry',
    holistic_ministry_desc: 'We minister to the whole person',
    cultural_sensitivity: 'Cultural Sensitivity',
    cultural_sensitivity_desc: 'We respect and embrace diversity',

    // Who We Are content
    global_movement: 'A Global Movement',
    global_movement_text: 'The Church of God of Prophecy is a vibrant, global Christian movement with presence in 135 countries and territories. We are united by our common faith in Jesus Christ and our commitment to biblical truth.',
    our_identity: 'Our Identity',
    we_are: 'We are:',
    christ_centered: 'Christ-centered in our worship and witness',
    spirit_led: 'Spirit-led in our ministry and mission',
    scripture_based: 'Scripture-based in our beliefs and practices',
    global_reach: 'Global in our reach and impact',
    unified_diversity: 'Unified in our diversity',
    our_story: 'Our Story',

    // What We Believe content
    statement_of_faith: 'Statement of Faith',
    we_believe_in: 'We believe in:',
    the_trinity: 'The Trinity',
    trinity_desc: 'One God eternally existing in three persons: Father, Son, and Holy Spirit.',
    jesus_christ: 'Jesus Christ',
    jesus_desc: 'The deity of Jesus Christ, His virgin birth, sinless life, atoning death, bodily resurrection, and glorious return.',
    salvation: 'Salvation',
    salvation_desc: 'Salvation by grace through faith in Jesus Christ, not by works.',
    holy_spirit: 'The Holy Spirit',
    holy_spirit_desc: 'The baptism of the Holy Spirit as a distinct experience available to all believers.',
    the_church: 'The Church',
    church_desc: 'The church as the body of Christ, called to unity and holiness.',
    scripture: 'Scripture',
    scripture_desc: 'The Bible as the inspired, inerrant Word of God and our final authority for faith and practice.',

    // Membership content
    becoming_member: 'Becoming a Member',
    membership_desc: 'Membership in the Church of God of Prophecy is open to all who have accepted Jesus Christ as their personal Savior and desire to follow Him in baptism and Christian living.',
    steps_to_membership: 'Steps to Membership',
    accept_christ: 'Accept Christ',
    accept_christ_desc: 'Make a personal decision to follow Jesus',
    be_baptized: 'Be Baptized',
    be_baptized_desc: 'Follow Christ in water baptism',
    commit_growth: 'Commit to Growth',
    commit_growth_desc: 'Engage in Bible study and fellowship',
    serve_others: 'Serve Others',
    serve_others_desc: 'Use your gifts to serve God and others',
    member_benefits: 'Member Benefits',
    voting_privileges: 'Voting privileges in church matters',
    access_resources: 'Access to member resources and materials',
    leadership_opportunities: 'Opportunities for leadership and service',
    global_connection: 'Connection with our global church family',

    // Give section content
    why_we_give: 'Why We Give',
    giving_desc: 'Giving is an act of worship and a way to participate in God\'s work around the world. Your generous gifts help support local ministries, global missions, and community outreach.',
    ways_to_give: 'Ways to Give',
    online_giving: 'Online Giving',
    online_giving_desc: 'Secure online donations',
    give_online: 'Give Online',
    mail_check: 'Mail a Check',
    mail_check_desc: 'Send to our mailing address',
    get_address: 'Get Address',
    text_to_give: 'Text to Give',
    text_to_give_desc: 'Give via text message',

    // Find a Church content
    find_congregation: 'Find a Congregation Near You',
    find_church_desc: 'With over 12,000 churches and missions in 135 countries, there\'s likely a Church of God of Prophecy congregation near you.',
    search_by_location: 'Search by Location',
    enter_location: 'Enter City, State, or Country',
    location_placeholder: 'e.g., Cleveland, TN or United States',
    search_churches: 'Search Churches',
    contact_information: 'Contact Information',
    need_help_finding: 'Need help finding a church or have questions?',
    what_to_expect: 'What to Expect',
    what_to_expect_desc: 'At Church of God of Prophecy congregations, you\'ll find:',
    spirit_led_worship: 'Spirit-led worship and biblical teaching',
    warm_fellowship: 'Warm, welcoming fellowship',
    spiritual_growth_opportunities: 'Opportunities for spiritual growth',
    community_outreach: 'Community outreach and missions',
    programs_all_ages: 'Programs for all ages',
    diverse_multicultural_community: 'Diverse, multicultural community',

    // Common fallback content
    content_coming_soon: 'Content coming soon...',
    employment_opportunities_coming_soon: 'Employment opportunities coming soon...',
    tour_scheduling_coming_soon: 'Tour scheduling coming soon...',
    global_presence_overview_coming_soon: 'Global presence overview coming soon...',
    resources_overview_coming_soon: 'Resources overview coming soon...',
    leadership_information_coming_soon: 'Leadership information coming soon...',
    historical_information_coming_soon: 'Historical information coming soon...',

    // Find a Church page translations
    find_a_church_title: 'Find a Church',
    find_a_church_description: 'Locate a Church of God of Prophecy congregation near you.',
    filter_by_programs: 'Filter by Programs',
    clear_filters: 'Clear Filters',
    need_help: 'Need Help?',
    cant_find_church: 'Can\'t find a church near you? Contact us for assistance.',
    found_churches: 'Found {count} Churches',
    for_search_term: 'for "{term}"',
    showing_results_worldwide: 'Showing results worldwide',
    searching_for_churches: 'Searching for churches...',
    no_churches_found: 'No Churches Found',
    no_churches_message: 'We couldn\'t find any churches matching your search criteria. Try adjusting your search terms or contact us for assistance.',
    get_directions: 'Get Directions',
    visit_website: 'Visit Website',
    call_church: 'Call Church',
    pastor: 'Pastor',
    service_times: 'Service Times',
    programs_ministries: 'Programs & Ministries',
    our_global_network: 'Our Global Network',
    global_network_description: 'The Church of God of Prophecy has over 12,000 churches and missions in 135 countries worldwide. If you don\'t see a church near you, we may still have a congregation in your area.',
    churches_missions: 'Churches & Missions',
    countries: 'Countries',
    members: 'Members',
    years_of_ministry: 'Years of Ministry',
    what_to_expect_at_churches: 'What to Expect at Our Churches',
    spirit_led_worship_teaching: 'Spirit-led worship and biblical teaching',
    warm_welcoming_fellowship: 'Warm, welcoming fellowship',
    opportunities_spiritual_growth: 'Opportunities for spiritual growth',
    community_outreach_missions: 'Community outreach and missions',
    programs_for_all_ages: 'Programs for all ages',
    diverse_multicultural_community: 'Diverse, multicultural community',
  },
  bg: {
    // Navigation
    welcome: 'Добре дошли',
    home: 'Начало',
    about: 'За нас',
    get_connected: 'Свържете се с нас',
    calendar: 'Календар',
    contact: 'Контакт',
    faq: 'Често задавани въпроси',
    employment: 'Работа',
    schedule_tour: 'Запишете обиколка',
    who_we_are: 'Кои сме ние',
    what_we_believe: 'В какво вярваме',
    our_leadership: 'Нашето ръководство',
    our_history: 'Нашата история',
    membership: 'Членство',
    ministries: 'Служения',
    resources: 'Ресурси',
    give: 'Дари',
    where_we_serve: 'Къде служим',
    presiding_bishop: 'Председателстващ епископ',
    africa: 'Африка',
    asia_australia_oceania: 'Азия, Австралия и Океания',
    caribbean_atlantic: 'Карибски и Атлантически регион',
    central_america: 'Централна Америка',
    north_america: 'Северна Америка',
    south_america: 'Южна Америка',
    europe_middle_east: 'Европа и Близкия изток',
    
    // Statistics
    countries: 'Държави',
    churches_and_missions: 'Църкви и мисии',
    members_around_world: 'Членове по света',
    languages: 'Езици',
    
    // Hero/Carousel
    hero_title_1: 'Ние сме Църква на Бога на Пророчеството',
    hero_desc_1: 'Тази 24-странична брошура е ръководство за всеки, който иска да разбере кои сме, в какво вярваме и как изпълняваме нашата мисия заедно.',
    hero_btn_1: 'Поръчай сега',
    hero_title_2: 'Глобална общност на вярата',
    hero_desc_2: 'Присъединете се към нас, докато служим на Христос в 135 държави с над 12 000 църкви и мисии по света.',
    hero_btn_2: 'Научете повече',
    hero_title_3: 'Водено от Духа служение',
    hero_desc_3: 'Открийте как изпълняваме Великото поръчение чрез силата на Светия Дух.',
    hero_btn_3: 'Нашата мисия',
    
    // Buttons & UI
    sign_in: 'Вход',
    sign_up: 'Регистрация',
    learn_more: 'Научете повече',
    view_calendar: 'Вижте календара',
    contact_us: 'Свържете се с нас',
    back_to_news: 'Обратно към всички новини',
    content_coming_soon: 'Съдържанието идва скоро...',
    
    // Page Titles & Descriptions
    get_connected_title: 'Свържете се с нас',
    get_connected_description: 'Свържете се с общността на Църква на Бога на Пророчеството и открийте начини да се включите.',
    
    about_title: 'За нас',
    about_description: 'Научете за нашата идентичност, вярвания и мисия като глобално църковно движение.',
    
    who_we_are_title: 'Кои сме ние',
    who_we_are_description: 'Открийте нашата идентичност като центрирано на Христос, водено от Духа глобално движение.',
    
    what_we_believe_title: 'В какво вярваме',
    what_we_believe_description: 'Изследвайте нашите основни вярвания, доктрина и теологически основи.',
    
    our_leadership_title: 'Нашето ръководство',
    our_leadership_description: 'Запознайте се с лидерите, които ръководят и служат на нашата глобална църковна общност.',
    
    our_history_title: 'Нашата история',
    our_history_description: 'Пътувайте през богатата история на Църква на Бога на Пророчеството.',
    
    membership_title: 'Членство',
    membership_description: 'Научете как да станете член на нашето глобално църковно семейство.',
    
    // Ministries
    ministries_title: 'Служения',
    ministries_description: 'Открийте нашите различни служения, които служат на общности по целия свят.',
    
    admin_finance_title: 'Администрация и финанси',
    admin_finance_description: 'Подкрепа на служението чрез здраво финансово управление и администрация.',
    
    global_missions_title: 'Глобални мисии',
    global_missions_description: 'Открийте нашата световна мисионерска работа и евангелизационни усилия в 135 държави.',
    
    harvest_partners_title: 'Партньори в жътвата',
    harvest_partners_description: 'Подкрепа на мисионери и служебни партньори по целия свят.',
    
    helping_hands_title: 'Помагащи ръце',
    helping_hands_description: 'Служение за помощ при бедствия и хуманитарна помощ.',
    
    one_child_fund_title: 'Фонд за едно дете',
    one_child_fund_description: 'Подкрепа на деца и семейства в нужда по целия свят.',
    
    heritage_title: 'Наследство',
    heritage_description: 'Запазване и споделяне на историята на Církva на Бога на Пророчеството.',
    
    fields_of_wood_title: 'Полета на дървото',
    fields_of_wood_description: 'Библейски тематичен парк и център за отдих в Мърфи, Северна Каролина.',
    
    stewardship_title: 'Настойничество',
    stewardship_description: 'Преподаване на библейски принципи за настойничество и финансова отговорност.',
    
    bookstore_title: 'Книжарница',
    bookstore_description: 'Християнски книги, ресурси и материали за духовен растеж.',
    
    global_communications_title: 'Глобални комуникации',
    global_communications_description: 'Свързване на нашата световна църква чрез медии и комуникации.',
    
    white_wing_messenger_title: 'Вестник Бяло крило',
    white_wing_messenger_description: 'Нашето официално църковно издание, споделящо новини, вдъхновение и учение.',
    
    prayer_title: 'Молитва',
    prayer_description: 'Свързване на вярващи по целия свят чрез силата на молитвата.',
    
    international_assembly_title: 'Международно събрание',
    international_assembly_description: 'Нашето глобално църковно събиране, провеждано на всеки четири години.',
    
    leadership_development_title: 'Развитие на лидерството',
    leadership_development_description: 'Обучение и подготовка на лидери за ефективно служение по целия свят.',
    
    accredited_ministries_title: 'Акредитирани служения',
    accredited_ministries_description: 'Официално признати служения и институции.',
    
    center_biblical_leadership_title: 'Център за библейско лидерство',
    center_biblical_leadership_description: 'Развиване на лидери чрез библейски принципи и практическо обучение.',
    
    spirit_life_seminary_title: 'Семинария Дух и живот',
    spirit_life_seminary_description: 'Обучение на служители за ефективно служене в 21-ви век.',
    
    childrens_title: 'Детско служение',
    childrens_description: 'Възпитаване на вяра в сърцата на най-малките ни членове.',
    
    youth_title: 'Младежко служение',
    youth_description: 'Овластяване на младите хора да растат във вярата и лидерството.',
    
    // Where We Serve
    where_we_serve_title: 'Къде служим',
    where_we_serve_description: 'Изследвайте нашето глобално присъствие и въздействие на служението.',
    
    presiding_bishop_title: 'Председателстващ епископ',
    presiding_bishop_description: 'Лидерство и надзор на нашето глобално църковно движение.',
    
    africa_title: 'Африка',
    africa_description: 'Служение и църковен растеж в африканския континент.',
    
    asia_australia_oceania_title: 'Азия, Австралия и Океания',
    asia_australia_oceania_description: 'Разпространение на Евангелието в Азия, Австралия и тихоокеанските острови.',
    
    caribbean_atlantic_title: 'Карибски и Атлантически регион',
    caribbean_atlantic_description: 'Островни служения в карибския и атлантическия регион.',
    
    central_america_title: 'Централна Америка',
    central_america_description: 'Църковен растеж и служение в Централна Америка.',
    
    north_america_title: 'Северна Америка',
    north_america_description: 'Служение в Съединените щати, Канада и Мексико.',
    
    south_america_title: 'Южна Америка',
    south_america_description: 'Динамичен църковен растеж в южноамериканските нации.',
    
    europe_middle_east_title: 'Европа и Близкия изток',
    europe_middle_east_description: 'Служение в предизвикателни и разнообразни културни контексти.',
    
    // Resources
    resources_title: 'Ресурси',
    resources_description: 'Достъп до образователни материали, документи и духовни ресурси.',
    
    get_started_title: 'Започнете',
    get_started_description: 'Започнете вашето пътуване с Църква на Бога на Пророчеството.',
    
    how_to_know_god_title: 'Как да познаем Бога',
    how_to_know_god_description: 'Открийте лична връзка с Исус Христос.',
    
    media_title: 'Медия',
    media_description: 'Видеа, аудио и мултимедийни ресурси за духовен растеж.',
    
    podcasts_title: 'Подкастове',
    podcasts_description: 'Слушайте вдъхновяващи послания и учения от нашите лидери.',
    
    youtube_title: 'YouTube',
    youtube_description: 'Гледайте нашите най-нови видеа и живи предавания.',
    
    library_title: 'Библиотека',
    library_description: 'Достъп до нашата цифрова библиотека с книги, статии и образователни материали.',
    
    assembly_documents_title: 'Документи от събранието',
    assembly_documents_description: 'Официални документи и протоколи от нашето Международно събрание.',
    
    policies_guidelines_title: 'Политики и насоки',
    policies_guidelines_description: 'Официални църковни политики и насоки за служение.',
    
    public_statements_title: 'Публични изявления',
    public_statements_description: 'Официални изявления по важни въпроси и текущи събития.',
    
    assembly_minutes_title: 'Протоколи от събранието',
    assembly_minutes_description: 'Протоколи и записи от заседания на събранието.',
    
    church_resources_title: 'Църковни ресурси',
    church_resources_description: 'Инструменти и материали за местно църковно служение.',
    
    church_locator_title: 'Намиране на църква',
    church_locator_description: 'Намерете конгрегация на Църква на Бога на Пророчеството близо до вас.',
    
    church_logos_title: 'Църковни логота',
    church_logos_description: 'Официални логота и брандинг материали за църковна употреба.',
    
    treasurers_report_title: 'Доклад на касиера',
    treasurers_report_description: 'Финансови доклади и информация за прозрачност.',
    
    directory_title: 'Директория',
    directory_description: 'Контактна информация за църковни лидери и офиси по целия свят.',
    
    // Give
    give_title: 'Дари',
    give_description: 'Подкрепете служението чрез вашето щедро даряване.',
    
    // Error pages
    '404_title': '404 - Страницата не е намерена',
    '404_description': 'Страницата, която търсите, не съществува.',
    '404_content': '<p>Тази страница не можа да бъде намерена.</p>',
    
    // Common content headings
    statement_of_faith: 'Изявление на вярата',
    the_trinity: 'Троицата',
    jesus_christ: 'Исус Христос',
    salvation: 'Спасение',
    holy_spirit: 'Светият Дух',
    the_church: 'Цървата',
    scripture: 'Писанието',
    our_mission: 'Нашата мисия',
    get_involved: 'Включете се',
    contact_info: 'Контактна информация',
    
    // Footer
    social_media: 'Социални медии',
    quick_links: 'Бързи връзки',
    contact_information: 'Контактна информация',
    
    // Search
    search: 'Търсене',
    search_placeholder: 'Търсете страници, статии, подкастове и събития...',
    search_shortcut: 'Търсене (Ctrl+K)',
    start_typing_to_search: 'Започнете да пишете за търсене...',
    search_help_text: 'Търсете в страници, статии, подкастове и събития',
    searching: 'Търсене...',
    no_results_found: 'Няма намерени резултати',
    no_results_help: 'Опитайте различни ключови думи или проверете правописа',
    search_navigation_help: 'Използвайте стрелките за навигация, Enter за избор, Esc за затваряне',
    
    // Result types
    page: 'Страница',
    article: 'Статия',
    podcast: 'Подкаст',
    event: 'Събитие',
    
    // Loading states
    loading: 'Зареждане...',
    checking_permissions: 'Проверка на разрешенията...',
    
    // FAQ Questions and Answers
    faq_general_questions: 'Общи въпроси',
    faq_what_is_cogop: 'Какво е Църква на Бога на Пророчеството?',
    faq_what_is_cogop_answer: 'Църква на Бога на Пророчеството е глобално, центрирано на Христос движение, основано на Писанието, твърдо във вярата, страстно към хората и посветено на примиряването на света с Христос чрез силата на Светия Дух. Имаме над 12 000 църкви и мисии в 135 държави по света.',
    faq_when_founded: 'Кога е основана Църква на Бога на Пророчеството?',
    faq_when_founded_answer: 'Църква на Бога на Пророчеството е основана в началото на 20-ти век като част от модерното петдесятническо движение. Израснахме от скромни начала до световно братство от вярващи, посветени на напредването на Божието царство на земята.',
    faq_headquarters_location: 'Къде се намира вашата централа?',
    faq_headquarters_answer: 'Нашата международна централа се намира в Кливланд, Тенеси, САЩ, на адрес 3720 Keith Street NW. Нашият пощенски адрес е PO Box 2910, Cleveland, TN 37320. Можете да ни достигнете на (423) 559-5100.',
    
    faq_bible_belief: 'Какво вярвате за Библията?',
    faq_bible_answer: 'Вярваме, че Библията е вдъхновената, безгрешна Божия дума и нашия окончателен авторитет за вяра и практика. Писанието е Богодухновено и полезно за учение, изобличение, поправка и наставление в правда.',
    faq_trinity_belief: 'Вярвате ли в Троицата?',
    faq_trinity_answer: 'Да, вярваме в един Бог, съществуващ вечно в три лица: Отец, Син и Свети Дух. Всяко лице от Троицата е напълно Бог, но има само един Бог.',
    faq_salvation_position: 'Каква е вашата позиция за спасението?',
    faq_salvation_answer: 'Вярваме, че спасението е чрез благодат чрез вяра в Исус Христос, не чрез дела. То е безплатен дар от Бога, достъпен за всички, които се покаят за греховете си и приемат Исус като свой личен Господ и Спасител.',
    faq_holy_spirit_baptism: 'Вярвате ли в кръщението със Светия Дух?',
    faq_holy_spirit_answer: 'Да, вярваме в кръщението със Светия Дух като отделно преживяване, достъпно за всички вярващи. Това овластяване позволява на християните да живеят победоносен живот и да служат на Бога ефективно в служението и свидетелството.',
    
    faq_services_worship: 'Служби и поклонение',
    faq_worship_service: 'Какво мога да очаквам по време на богослужение?',
    faq_dress_code: 'Какво трябва да облека в църквата?',
    faq_dress_answer: 'Елате такива, каквито сте! Приемаме хората независимо от това как се обличат. Някои предпочитат ежедневно облекло, докато други се обличат по-официално. Най-важното е да се чувствате удобно и да можете да се съсредоточите върху поклонението пред Бога.',
    faq_children_programs: 'Имате ли програми за деца и младежи?',
    faq_children_answer: 'Да! Имаме подходящи за възрастта програми, включително неделно училище, детска църква, младежки групи, ваканционно библейско училище, лагери и специални събития. Нашата цел е да помогнем на младите хора да развият силна връзка с Исус Христос.',
    
    faq_membership_involvement: 'Членство и включване',
    faq_become_member: 'Как мога да стана член?',
    faq_member_answer: 'Членството е отворено за всички, които са приели Исус Христос като свой личен Спасител. Стъпките включват: приемане на Христос, кръщаване чрез потапяне, ангажиране към духовен растеж чрез изучаване на Библията и общение, и използване на вашите дарби за служене на другите.',
    faq_baptism_required: 'Трябва ли да бъда кръстен, за да посещавам църквата?',
    faq_baptism_answer: 'Не, не е необходимо да бъдете кръстени, за да посещавате църквата. Всички са добре дошли да се присъединят към нас за поклонение и общение. Кръщението е необходимо за членство и представлява вашето публично обявяване на вяра в Исус Христос.',
    faq_get_involved_ministry: 'Как мога да се включа в служението?',
    faq_ministry_answer: 'Има много начини да се включите! Можете да служите в екипи за поклонение, детско служение, младежки програми, мисии, обществена дейност, административни роли и други. Свържете се с местното църковно ръководство, за да откриете възможности, които съответстват на вашите дарби и интереси.',
    
    // Article Categories
    spirit_life_seminary: 'Семинария Дух и живот',
    digital_evangelism: 'Дигитална евангелизация',
    featured_article: 'Препоръчана статия',
    global_missions: 'Глобални мисии',
    youth_ministry: 'Младежко служение',
    
    // Event Categories
    youth_conference: 'Младежка конференция',
    stewardship: 'Настойничество',
    global_assembly: 'Глобално събрание',
    
    // Contact Information
    physical_address: 'Физически адрес',
    mailing_address: 'Пощенски адрес',
    contact_form: 'Форма за контакт',
    name: 'Име',
    email: 'Имейл',
    message: 'Съобщение',
    send_message: 'Изпрати съобщение',
    phone: 'Телефон',
    
    // Common UI Elements
    view_opportunities: 'Вижте възможностите',
    stay_updated: 'Останете в течение с предстоящи събития, служби и важни дати',
    reach_out: 'Свържете се с въпроси, молитвени искания или за да научите повече',
    explore_career: 'Изследвайте кариерни възможности в нашата организация',
    visit_facilities: 'Посетете нашите съоръжения и научете за нашата общност',
    
    // Form Labels
    full_name: 'Пълно име',
    display_name: 'Показвано име',
    password: 'Парола',
    confirm_password: 'Потвърди парола',
    
    // Buttons
    submit: 'Изпрати',
    cancel: 'Отказ',
    save: 'Запази',
    edit: 'Редактирай',
    delete: 'Изтрий',
    close: 'Затвори',
    
    // Navigation Labels
    toggle_navigation: 'Превключи навигация',
    select_language: 'Избери език',
    english: 'English',
    bulgarian: 'Български',

    // Article titles and content
    seminary_commencement_title: 'Семинария Дух и живот празнува четвърта церемония по дипломиране',
    seminary_commencement_excerpt: 'Празнуване на постиженията на нашите най-нови завършили служители.',
    digital_communities_title: 'Споделяне и растеж в онлайн общности',
    digital_communities_excerpt: 'Как нашето дигитално служение достига нови аудитории.',
    digital_gospel_title: 'Затова влезте и качете Евангелието в целия свят',
    digital_gospel_excerpt: 'Изследване на пресечната точка между технологията и служението.',
    sharing_gospel_title: 'Споделяне на Евангелието по света',
    sharing_gospel_excerpt: 'Научете за нашата мисионерска работа в 135 държави.',
    icm_youth_title: 'ICM Младежка конференция: Овластяване на следващото поколение',
    icm_youth_excerpt: 'Млади хора от цял свят се събират за духовен растеж.',

    // Podcast series and content
    sound_doctrine_series: 'Здрава доктрина',
    sound_doctrine_title: 'Време? Новозаветно време (1981)',
    sound_doctrine_desc: 'Върнете се към Международното събрание от 2000 г., когато епископ Тедрой Пауъл открива събирането с вълнуващо послание, основано на Матей 5:3.',
    white_wing_podcast_series: 'Подкаст Вестник Бяло крило',
    white_wing_podcast_title: 'Призивът: Да изпращаме и подкрепяме',
    white_wing_podcast_desc: 'Присъединете се към водещата на подкаста, главен редактор Марша Робинсън, докато завършваме месец април с кръгла маса за дискусия на този месечен Вестник Бяло крило.',

    // Event details
    icm_testify_title: 'ICM: Свидетелствай',
    icm_testify_desc: 'Присъединете се към млади възрастни от цял свят за трансформиращо конферентно преживяване.',
    stewardshift_title: 'Конференция StewardShift',
    stewardshift_desc: 'Научете за библейското настойничество и финансовата отговорност.',
    international_assembly_desc: 'Нашето глобално църковно събиране, обединяващо вярващи от 135 държави.',
    north_carolina_asheville: 'Северна Каролина, близо до Ашвил',
    ridgecrest_center: 'Конферентен център Риджкрест',
    peerless_church: 'Църква Пиърлес',
    rosen_shingle_creek: 'Розен Шингъл Крийк',

    // FAQ content
    faq_lead_text: 'Събрахме отговори на някои от най-често задаваните въпроси за Църква на Бога на Пророчеството. Ако не намерите това, което търсите, моля',
    faq_contact_link: 'свържете се с нас',
    faq_contact_link_end: 'директно.',

    // Page content
    global_movement_heading: 'Глобално движение',
    global_movement_text: 'Църква на Бога на Пророчеството е живо, глобално християнско движение с присъствие в 135 държави и територии. Обединени сме от нашата обща вяра в Исус Христос и нашия ангажимент към библейската истина.',
    our_identity_heading: 'Нашата идентичност',
    our_identity_intro: 'Ние сме:',
    christ_centered: 'Центрирани на Христос в нашето поклонение и свидетелство',
    spirit_led: 'Водени от Духа в нашето служение и мисия',
    scripture_based: 'Основани на Писанието в нашите вярвания и практики',
    global_reach: 'Глобални в нашия обхват и въздействие',
    unified_diversity: 'Обединени в нашето разнообразие',
    our_story_heading: 'Нашата история',
    our_story_text: 'Основани в началото на 20-ти век, израснахме от скромни начала до световно братство от вярващи, посветени на напредването на Божието царство на земята.',

    // Additional content translations
    calendar_title: 'Календар',
    calendar_description: 'Останете в течение с предстоящи събития, служби и важни дати в нашия църковен календар.',
    calendar_content_coming_soon: 'Съдържанието на календара идва скоро...',
    contact_us_title: 'Свържете се с нас',
    contact_us_description: 'Свържете се с нас с вашите въпроси, молитвени искания или за да научите повече за нашата църква.',
    faq_title: 'Често задавани въпроси',
    faq_description: 'Намерете отговори на често задавани въпроси за нашата църква, вярвания и служби.',
    employment_title: 'Работа',
    employment_description: 'Изследвайте кариерни възможности в нашата организация.',
    schedule_tour_title: 'Запишете обиколка',
    schedule_tour_description: 'Посетете нашите съоръжения и научете за нашата общност.',

    // Additional FAQ sections
    faq_giving_support: 'Даряване и подкрепа',
    faq_tithe_required: 'Трябва ли да давам десятък или пари?',
    faq_tithe_answer: 'Даряването е доброволно и трябва да идва от радостно сърце. Учим библейско настойничество и вярваме, че десятъкът (даване на 10% от дохода) е библейски принцип, но никога не принуждаваме никого да дава. Вашата връзка с Бога не се основава на вашите финансови приноси.',
    faq_donations_used: 'Как се използват дарениите?',
    faq_donations_answer: 'Дарениите подкрепят местни църковни служения, глобални мисии, хуманитарна помощ, образователни програми и административни разходи. Практикуваме финансова прозрачност и предоставяме годишни доклади, показващи как средствата се използват за напредването на Божието царство по света.',
    
    faq_global_ministry: 'Глобално служение',
    faq_support_missions: 'Как мога да подкрепя глобалните мисии?',
    faq_support_missions_answer: 'Можете да подкрепите мисиите чрез молитва, финансово даряване, участие в мисионерски пътувания, спонсориране на дете чрез нашия Фонд за едно дете или ставане на Партньор в жътвата за подкрепа на мисионери. Свържете се с нас, за да научите за конкретни възможности.',
    faq_international_assembly: 'Какво е Международното събрание?',
    faq_international_assembly_answer: 'Международното събрание е нашето глобално църковно събиране, провеждано на всеки четири години. То обединява делегати от целия свят за поклонение, общение, работни сесии и определяне на посоката за нашето световно служение.',
    
    faq_contact_next_steps: 'Контакт и следващи стъпки',
    faq_find_local_church: 'Как мога да намеря местна църква?',
    faq_find_local_church_answer: 'Използвайте нашия локатор на църкви, за да намерите конгрегация близо до вас. Можете също да се обадите на нашата централа на (423) 559-5100 или да се свържете с нас онлайн за помощ при намирането на местна църква.',
    faq_schedule_tour_question: 'Мога ли да запиша обиколка на вашите съоръжения?',
    faq_schedule_tour_answer: 'Да! Ще се радваме да ви покажем нашите съоръжения. Можете да запишете обиколка на нашата централа в Кливланд, Тенеси, или да посетите Полета на дървото, нашия библейски тематичен парк в Северна Каролина.',
    faq_more_questions: 'Имам още въпроси. Как мога да получа отговори?',
    faq_more_questions_answer: 'Тук сме, за да помогнем! Можете да се свържете с нас чрез нашия уебсайт, да ни се обадите на (423) 559-5100 или да ни изпратите имейл на info@cogop.org. Можете също да се свържете с местен пастор на Църква на Бога на Пророчеството във вашия район.',
    
    // FAQ footer section
    still_have_questions: 'Все още имате въпроси?',
    still_have_questions_text: 'Тук сме, за да помогнем! Не се колебайте да се свържете с всякакви въпроси за нашата църква, вярвания или как да се включите.',
    find_a_church: 'Намерете църква',

    // Calendar specific translations
    event_calendar: 'Календар на събитията',
    view_all_upcoming_events: 'Вижте всички предстоящи събития и дейности',
    loading_calendar: 'Зареждане на календара...',
    more: 'още',
    today: 'Днес',
    previous_month: 'Предишен месец',
    next_month: 'Следващ месец',
    calendar_view: 'Изглед календар',
    list_view: 'Изглед списък',
    upcoming_events: 'Предстоящи събития',
    no_events_scheduled: 'Няма планирани събития',
    
    // Profile page translations
    profile: 'Профил',
    display_name: 'Показвано име',
    update_profile: 'Актуализирай профила',
    profile_updated: 'Профилът е актуализиран успешно',
    saving: 'Запазване...',
    
    // Footer translations
    about: 'За нас',
    who_we_are: 'Кои сме ние',
    what_we_believe: 'В какво вярваме',
    our_leadership: 'Нашето ръководство',
    our_history: 'Нашата история',
    get_connected: 'Свържете се с нас',
    ministries: 'Служения',
    where_we_serve: 'Къде служим',
    resources: 'Ресурси',
    give: 'Дари',
    
    // Common fallback content
    content_coming_soon: 'Съдържанието идва скоро...',
    employment_opportunities_coming_soon: 'Възможностите за работа идват скоро...',
    tour_scheduling_coming_soon: 'Планирането на обиколки идва скоро...',
    global_presence_overview_coming_soon: 'Преглед на глобалното присъствие идва скоро...',
    resources_overview_coming_soon: 'Преглед на ресурсите идва скоро...',
    leadership_information_coming_soon: 'Информацията за ръководството идва скоро...',
    historical_information_coming_soon: 'Историческата информация идва скоро...',

    // Find a Church page translations
    find_a_church_title: 'Намери църква',
    find_a_church_description: 'Намерете конгрегация на Църква на Бога на Пророчеството близо до вас.',
    search_churches: 'Търси църкви',
    enter_city_state_country: 'Въведете град, област или държава',
    location_placeholder: 'напр. София, България или България',
    searching: 'Търсене...',
    filter_by_programs: 'Филтрирай по програми',
    clear_filters: 'Изчисти филтрите',
    need_help: 'Нужда от помощ?',
    cant_find_church: 'Не можете да намерите църква близо до вас? Свържете се с нас за помощ.',
    found_churches: 'Намерени {count} църкви',
    for_search_term: 'за "{term}"',
    showing_results_worldwide: 'Показване на резултати по света',
    searching_for_churches: 'Търсене на църкви...',
    no_churches_found: 'Няма намерени църкви',
    no_churches_message: 'Не можахме да намерим църкви, отговарящи на вашите критерии за търсене. Опитайте да промените условията за търсене или се свържете с нас за помощ.',
    get_directions: 'Вземи указания',
    visit_website: 'Посети уебсайта',
    call_church: 'Обади се на църквата',
    pastor: 'Пастор',
    service_times: 'Времена на службите',
    programs_ministries: 'Програми и служения',
    our_global_network: 'Нашата глобална мрежа',
    global_network_description: 'Църква на Бога на Пророчеството има над 12 000 църкви и мисии в 135 държави по света. Ако не виждате църква близо до вас, може все още да имаме конгрегация във вашия район.',
    churches_missions: 'Църкви и мисии',
    countries: 'Държави',
    members: 'Членове',
    years_of_ministry: 'Години служение',
    what_to_expect_at_churches: 'Какво да очаквате в нашите църкви',
    spirit_led_worship_teaching: 'Водено от Духа поклонение и библейско учение',
    warm_welcoming_fellowship: 'Топло, приветливо общение',
    opportunities_spiritual_growth: 'Възможности за духовен растеж',
    community_outreach_missions: 'Обществена дейност и мисии',
    programs_for_all_ages: 'Програми за всички възрасти',
    diverse_multicultural_community: 'Разнообразна, мултикултурна общност',

    // Additional find-a-church translations
    find_congregation: 'Намерете конгрегация близо до вас',
    find_church_desc: 'С над 12 000 църкви и мисии в 135 държави, вероятно има конгрегация на Църква на Бога на Пророчеството близо до вас.',
    search_by_location: 'Търсене по местоположение',
    what_to_expect_desc: 'В конгрегациите на Църква на Бога на Пророчеството ще намерите:',
  },
};

i18n.locale = 'bg'; // Default locale is now Bulgarian

export function setLocale(locale: string) {
  i18n.locale = locale;
}

export function t(key: string, options?: any) {
  return i18n.t(key, options);
} 