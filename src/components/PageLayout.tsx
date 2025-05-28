import PageHeader from './PageHeader';
import CallToAction from './CallToAction';

interface PageLayoutProps {
  title: string;
  description?: string;
  backgroundImage?: string;
  children: React.ReactNode;
  showCallToAction?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  description, 
  backgroundImage, 
  children,
  showCallToAction = true
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
            {showCallToAction && <CallToAction />}
          </div>
        </div>
      </div>
    </>
  );
};

export default PageLayout; 