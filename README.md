# Church of God of Prophecy Website Clone

A modern, responsive Next.js clone of the Church of God of Prophecy (cogop.org) website built with TypeScript, SCSS, and Bootstrap 5.

## 🌟 Features

- **Responsive Design**: Mobile-first approach with Bootstrap 5 grid system
- **Modern Tech Stack**: Next.js 14, TypeScript, SCSS, Bootstrap 5
- **SEO Optimized**: Dynamic metadata generation and semantic HTML
- **Content Management**: Centralized content system using Context API
- **Global Presence**: Showcasing the church's worldwide ministry across 135 countries
- **Multilingual Welcome**: Supporting multiple languages for global accessibility
- **Interactive Components**: News, events, podcasts, and resource sections

## 🚀 Live Demo

The application runs on `localhost:3001` in development mode.

## 🛠 Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: SCSS with Bootstrap 5
- **Icons**: Bootstrap Icons
- **Content Management**: React Context API
- **Fonts**: Inter (Google Fonts)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About section pages
│   ├── get-connected/     # Connection and contact pages
│   ├── ministries/        # Ministry pages
│   ├── resources/         # Resource pages
│   ├── where-we-serve/    # Global presence pages
│   ├── give/              # Giving page
│   ├── events/            # Events page
│   ├── news/              # News page
│   └── find-a-church/     # Church locator page
├── components/            # Reusable components
│   ├── Navigation/        # Main navigation
│   ├── Footer/           # Site footer
│   └── PageLayout/       # Page layout wrapper
├── contexts/             # React contexts
│   └── ContentContext.tsx # Content management
├── lib/                  # Utility libraries
│   └── content.ts        # Server-side content data
├── styles/               # SCSS architecture
│   ├── abstracts/        # Variables and mixins
│   ├── base/             # Reset and typography
│   ├── components/       # Component styles
│   ├── layout/           # Layout-specific styles
│   └── main.scss         # Main SCSS entry point
└── scripts/              # Build scripts
    └── generate-pages.js # Page generation script
```

## 🎨 SCSS Architecture

The project follows a structured SCSS architecture:

### Abstracts
- `_variables.scss`: Color, typography, spacing, and breakpoint variables
- `_mixins.scss`: Reusable mixins for media queries, flexbox, transitions

### Base
- `_reset.scss`: CSS reset and base styles
- `_typography.scss`: Typography utilities and base text styles

### Components
- `_navbar.scss`: Navigation component styles
- `_footer.scss`: Footer component styles  
- `_page-layout.scss`: Page layout component styles

### Layout
- Section-specific layout styles for different page types

## 📋 Content Management

The project uses a hybrid content management approach:

1. **Server-side Content** (`src/lib/content.ts`):
   - Page metadata and basic content
   - Used for SEO and initial page rendering

2. **Client-side Context** (`src/contexts/ContentContext.tsx`):
   - Dynamic content updates
   - Component-level content management

## 🌍 Website Sections

### Main Sections
- **Home**: Hero section, statistics, articles, podcasts, events
- **Get Connected**: Calendar, contact, FAQ, employment, tours
- **About**: Who we are, beliefs, leadership, history, membership
- **Ministries**: 19 different ministry areas including missions, education, and outreach
- **Where We Serve**: Global presence across 8 major regions
- **Resources**: 16 resource categories including media, library, policies
- **Give**: Donation and financial support information

### Key Pages
- **News & Articles**: Latest church news and updates
- **Events**: Upcoming conferences and gatherings
- **Find a Church**: Church locator functionality
- **Resources**: Educational and spiritual growth materials

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cogop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install SCSS support**
   ```bash
   npm install sass
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3001`

## 📦 Key Dependencies

```json
{
  "next": "14.x",
  "react": "18.x",
  "typescript": "5.x",
  "sass": "^1.x",
  "bootstrap": "^5.x",
  "bootstrap-icons": "^1.x"
}
```

## 🎯 Design Philosophy

- **Mobile-First**: Responsive design starting from mobile devices
- **Accessibility**: Semantic HTML and ARIA compliance
- **Performance**: Optimized images and code splitting
- **SEO**: Proper meta tags and structured data
- **User Experience**: Intuitive navigation and clear information hierarchy
- **Global Reach**: Multilingual support and cultural sensitivity

## 🌐 Global Statistics

The Church of God of Prophecy serves:
- **135 Countries** worldwide
- **12,000+ Churches and Missions**
- **1.5 Million Members** globally
- **130 Languages** spoken

## 🛠 Development Scripts

- `npm run dev`: Start development server on port 3001
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `node scripts/generate-pages.js`: Generate pages from templates

## 📱 Responsive Breakpoints

```scss
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);
```

## 🎨 Color Scheme

```scss
$primary: #007bff;
$secondary: #6c757d;
$success: #28a745;
$info: #17a2b8;
$warning: #ffc107;
$danger: #dc3545;
$light: #f8f9fa;
$dark: #343a40;
```

## 🚦 Future Enhancements

- [ ] Church locator with interactive maps
- [ ] Multi-language content management
- [ ] Event registration system
- [ ] Member portal integration
- [ ] Advanced search functionality
- [ ] Newsletter subscription
- [ ] Social media integration
- [ ] Accessibility improvements

## 🤝 Contributing

This project follows modern web development best practices:
- Use TypeScript for type safety
- Follow BEM naming convention for SCSS
- Maintain responsive design principles
- Ensure accessibility compliance
- Write semantic HTML

## 📄 License

This project is created for educational and demonstration purposes.

---

**Built with ❤️ for the Church of God of Prophecy community**

*A global, Christ-centered movement rooted in Scripture, steadfast in faith, passionate about people.*
# cogop
