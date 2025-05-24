interface PageLayoutProps {
  title: string;
  description?: string;
  backgroundImage?: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, description, backgroundImage, children }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <header 
        className={`page-layout__header ${backgroundImage ? 'page-layout__header--with-bg' : ''}`}
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
      >
        <div className="container">
          <h1 className="page-layout__title">{title}</h1>
          {description && <p className="page-layout__description">{description}</p>}
        </div>
      </header>
      <div className="container page-layout__content">
        {children}
      </div>
    </div>
  );
} 