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

const CallToAction: React.FC<CallToActionProps> = ({ 
  title = "Still Have Questions?",
  description = "We're here to help! Don't hesitate to reach out with any questions about our church, beliefs, or how to get involved.",
  buttons = [
    {
      text: "Contact Us",
      link: "/get-connected/contact",
      variant: "dark",
      icon: "bi bi-envelope"
    },
    {
      text: "Find a Church",
      link: "/find-a-church",
      variant: "outline",
      icon: "bi bi-geo-alt"
    },
    {
      text: "Schedule a Tour",
      link: "/get-connected/schedule-tour",
      variant: "outline",
      icon: "bi bi-calendar-plus"
    }
  ]
}) => {
  const getButtonClass = (variant: 'primary' | 'outline' | 'dark') => {
    switch (variant) {
      case 'dark':
        return 'btn btn-dark'
      case 'outline':
        return 'btn btn-outline-primary'
      default:
        return 'btn btn-primary'
    }
  }

  return (
    <div className="row mt-5">
      <div className="col-12">
        <div className="card px-sm-5 bg-light rounded-5 border-0 shadow-sm">
          <div className="card-body text-center">
            <h4 className="card-title my-2">{title}</h4>
            <p className="card-text">{description}</p>
            <div className="row">
              {buttons.map((button, index) => (
                <div key={index} className="col-md-4 mb-2">
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