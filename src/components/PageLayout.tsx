import PageHeader from './PageHeader';
import CallToAction from './CallToAction';

interface PageLayoutProps {
  title: string;
  description?: string;
  backgroundImage?: string;
  children: React.ReactNode;
  showCallToAction?: boolean;
  isAboutPage?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  description, 
  backgroundImage, 
  children,
  showCallToAction = true,
  isAboutPage = false
}) => {
  return (
    <>
      <PageHeader 
        title={title} 
        description={description} 
        backgroundImage={backgroundImage} 
        isAboutPage={isAboutPage}
      />
      <div className="container -fluid pb-5">
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