interface PageHeaderProps {
  title: string;
  description?: string;
  backgroundImage?: string;
  isAboutPage?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, backgroundImage, isAboutPage }) => {
  const headerStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundColor: backgroundImage ? 'transparent' : (isAboutPage ? 'transparent' : '#f8f9fa')
  };

  return (
    <div
      className={`page-header py-5 mb-5 -rounded-5`}
      style={headerStyle}
    >
      <div className="container -fluid">
        <div className="row">
          <div className="col-12">
            <h1 className="display-4 mb-3">{title}</h1>
            {description && (
              <p className="lead mb-0">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 