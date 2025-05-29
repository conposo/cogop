'use client'

import { useState, FormEvent } from 'react'
import { useContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'
import { submitContactForm, ContactFormData } from '@/lib/contactService'

export default function ContactUsPage() {
  const { pages } = useContent()
  const pageContent = pages['get-connected/contact']

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      await submitContactForm(formData)
      setFormData({ name: '', email: '', message: '' })
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message. We will get back to you soon!'
      })
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'There was an error sending your message. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
      showCallToAction={false}
    >
      <div className="row">
        <div className="col-md-6">
          <h3>Physical Address</h3>
          <p>ул. Аксаков 8<br />Русе, 7012<br />Phone: (359) 888-888-888</p>
          
          <h3>Mailing Address</h3>
          <p>ул. Аксаков 8<br />Русе, 7012</p>
        </div>
        <div className="col-md-6">
          <h3>Contact Form</h3>
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                minLength={10}
              />
            </div>
            <button
              type="submit"
              className="btn btn-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          
          {submitStatus.type && (
            <div 
              className={`alert alert-${submitStatus.type === 'success' ? 'success' : 'danger'} mt-3`} 
              role="alert"
            >
              {submitStatus.message}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
