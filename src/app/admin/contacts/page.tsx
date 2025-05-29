'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getContactSubmissions, updateContactStatus, ContactSubmission } from '@/lib/contactService'
import { useAuth } from '@/contexts/AuthContext'

export default function ContactsAdminPage() {
  const router = useRouter()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'new' | 'read' | 'replied' | 'archived' | undefined>(undefined)

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/')
      return
    }

    if (user && isAdmin) {
      loadContacts()
    }
  }, [user, isAdmin, authLoading, filter])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const submissions = await getContactSubmissions(filter)
      setContacts(submissions)
      setError(null)
    } catch (err) {
      setError('Failed to load contact submissions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: 'new' | 'read' | 'replied' | 'archived') => {
    try {
      await updateContactStatus(id, newStatus)
      await loadContacts() // Reload the list
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp.seconds * 1000).toLocaleString()
  }

  if (authLoading || loading) return <div className="p-4">Loading...</div>
  if (!user || !isAdmin) return null // Will redirect in useEffect
  if (error) return <div className="p-4 text-danger">{error}</div>

  return (
    <div className="container py-4">
      <h1 className="mb-4">Contact Form Submissions</h1>
      
      <div className="mb-4">
        <select 
          className="form-select w-auto"
          value={filter || ''}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="">All Submissions</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td>{formatDate(contact.createdAt)}</td>
                <td>{contact.name}</td>
                <td>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </td>
                <td>
                  <div style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>
                    {contact.message}
                  </div>
                </td>
                <td>
                  <span className={`badge bg-${
                    contact.status === 'new' ? 'primary' :
                    contact.status === 'read' ? 'info' :
                    contact.status === 'replied' ? 'success' :
                    'secondary'
                  }`}>
                    {contact.status}
                  </span>
                </td>
                <td>
                  <div className="btn-group">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleStatusUpdate(contact.id, 'read')}
                      disabled={contact.status === 'read'}
                    >
                      Mark Read
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-success"
                      onClick={() => handleStatusUpdate(contact.id, 'replied')}
                      disabled={contact.status === 'replied'}
                    >
                      Mark Replied
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleStatusUpdate(contact.id, 'archived')}
                      disabled={contact.status === 'archived'}
                    >
                      Archive
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contacts.length === 0 && (
        <div className="text-center p-4">
          <p className="text-muted">No contact submissions found</p>
        </div>
      )}
    </div>
  )
} 