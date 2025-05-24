import PageHeader from './PageHeader';

interface PageLayoutProps {
  title: string;
  description?: string;
  backgroundImage?: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  description, 
  backgroundImage, 
  children 
}) => {
  return (
    <>
      <PageHeader 
        title={title} 
        description={description} 
        backgroundImage={backgroundImage} 
      />
      <div className="container pb-5">
        <div className="row">
          <div className="col-12">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default PageLayout; 