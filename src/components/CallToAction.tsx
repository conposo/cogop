import { useContent } from '@/contexts/ContentContext';
import Link from 'next/link'

interface CallToActionButton {
  text: string;
  link: string;
  variant: 'primary' | 'outline' | 'dark';
  icon?: string;
}

interface CallToActionProps {
  title?: string;
  description?: string;
  buttons?: CallToActionButton[];
}

const CallToAction: React.FC<CallToActionProps> = () => {
  const { callToActions } = useContent();
  const getButtonClass = (variant: 'primary' | 'outline' | 'dark') => {
    switch (variant) {
      case 'dark':
        return 'btn btn-dark'
      case 'outline':
        return 'btn btn-outline-primary'
      default:
        return 'btn btn-primary text-white'
    }
  }

  return (
    <div className="row mt-5 pt-4 pt-sm-5">
      <div className="col-12">
        <div className="card px-sm-5 bg-light rounded-5 border-0 shadow-sm">
          <div className="card-body text-center">
            <h4 className="card-title my-2">{callToActions.title}</h4>
            <p className="card-text">{callToActions.description}</p>
            <div className="row">
              {callToActions.buttons.map((button, index) => (
                <div key={index} className="col-md-4 mb-2 mx-auto">
                  <Link href={button.link} className={`${getButtonClass(button.variant)} w-100 rounded-5`}>
                    {button.icon && <i className={`${button.icon} me-2`}></i>}
                    {button.text}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallToAction 
