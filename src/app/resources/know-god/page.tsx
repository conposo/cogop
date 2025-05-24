import Link from 'next/link'

export default function KnowGod() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="display-4 mb-4">How to Know God</h1>
          <p className="lead mb-5">Discover a personal relationship with Jesus Christ and experience the peace that comes from knowing God.</p>
          
          <div className="mb-5">
            <h2 className="h3 mb-3">God Loves You</h2>
            <p>God created you in His image and desires a personal relationship with you. He loves you unconditionally and has a wonderful plan for your life.</p>
            <blockquote className="blockquote">
              <p>"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."</p>
              <footer className="blockquote-footer">John 3:16</footer>
            </blockquote>
          </div>

          <div className="mb-5">
            <h2 className="h3 mb-3">We Are Separated from God</h2>
            <p>Sin has created a barrier between us and God. We all fall short of God's perfect standard, and this separation affects every aspect of our lives.</p>
            <blockquote className="blockquote">
              <p>"For all have sinned and fall short of the glory of God."</p>
              <footer className="blockquote-footer">Romans 3:23</footer>
            </blockquote>
          </div>

          <div className="mb-5">
            <h2 className="h3 mb-3">Jesus Is the Answer</h2>
            <p>Jesus Christ bridged the gap between God and humanity through His death on the cross. He paid the price for our sins so we could have a relationship with God.</p>
            <blockquote className="blockquote">
              <p>"But God demonstrates his own love for us in this: While we were still sinners, Christ died for us."</p>
              <footer className="blockquote-footer">Romans 5:8</footer>
            </blockquote>
          </div>

          <div className="mb-5">
            <h2 className="h3 mb-3">You Must Respond</h2>
            <p>Knowing about God's love is not enough. You must personally receive Jesus Christ as your Lord and Savior by faith.</p>
            <blockquote className="blockquote">
              <p>"If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved."</p>
              <footer className="blockquote-footer">Romans 10:9</footer>
            </blockquote>
          </div>

          <div className="text-center bg-light p-4 rounded">
            <h2 className="h4 mb-3">Ready to Take the Next Step?</h2>
            <p className="mb-4">If you'd like to know more about having a personal relationship with Jesus Christ, we're here to help.</p>
            <Link href="/get-connected/contact" className="btn btn-primary me-3">Contact Us</Link>
            <Link href="/resources/membership" className="btn btn-outline-primary">Learn About Membership</Link>
          </div>
        </div>
      </div>
    </div>
  )
} 