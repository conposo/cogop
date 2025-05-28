'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChurchUser } from '@/contexts/ChurchUserContext';
import { DiscussionsProvider } from '@/contexts/DiscussionsContext';
import DiscussionsList from '@/components/admin/DiscussionsList';
import SetupChurchMembership from '@/components/admin/SetupChurchMembership';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

export default function ChurchDiscussionsPage() {
  const params = useParams();
  const churchId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const { getUserChurches } = useChurchUser();
  const { isSuperAdmin } = useSuperAdmin();
  
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [churchName, setChurchName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is a member of this church
        const userChurches = await getUserChurches(user.uid);
        const churchMembership = userChurches.find(uc => uc.churchId === churchId);
        
        if (churchMembership) {
          setHasAccess(true);
          setUserRole(churchMembership.role);
          setChurchName(churchMembership.churchDetails?.name || 'Church');
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error checking church access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAccess();
    }
  }, [user, churchId, getUserChurches, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="container -fluid py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading discussions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container -fluid py-5">
        <div className="text-center">
          <i className="bi bi-person-x text-muted" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-3">Authentication Required</h3>
          <p className="text-muted">Please log in to access church discussions.</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center mb-4">
          <i className="bi bi-shield-exclamation text-warning" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-3">Access Denied</h3>
          <p className="text-muted">
            You don't have access to this church's discussions. 
            Please contact a church administrator to request access.
          </p>
          <button className="btn btn-secondary" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
        
        {/* Development Setup Tool - Only for Super Admins */}
        {isSuperAdmin && (
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="alert alert-warning mb-3">
                <i className="bi bi-shield-check me-2"></i>
                <strong>Super Admin Tools</strong> - The following development tools are only visible to super administrators.
              </div>
              <SetupChurchMembership churchId={churchId} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <DiscussionsProvider>
      <div className="container -fluid py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/churches" className="text-decoration-none">Churches</a>
            </li>
            <li className="breadcrumb-item">
              <a href={`/churches/${churchId}`} className="text-decoration-none">{churchName}</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">Discussions</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h1 className="h2 mb-1">
                  <i className="bi bi-chat-dots me-2"></i>
                  {churchName} Discussions
                </h1>
                <p className="text-muted mb-0">
                  Connect and engage with your church community
                  <span className="badge bg-light text-dark ms-2">{userRole}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a className="nav-link active" href={`/churches/${churchId}/discussions`}>
                  <i className="bi bi-chat-dots me-1"></i>
                  All Discussions
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`/churches/${churchId}`}>
                  <i className="bi bi-house me-1"></i>
                  Church Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`/churches/${churchId}/events`}>
                  <i className="bi bi-calendar-event me-1"></i>
                  Events
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`/churches/${churchId}/members`}>
                  <i className="bi bi-people me-1"></i>
                  Members
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Discussions Content */}
        <div className="row">
          <div className="col-12">
            <DiscussionsList churchId={churchId} />
          </div>
        </div>

        {/* Quick Help */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-info">
              <div className="card-header bg-info bg-opacity-10">
                <h6 className="mb-0">
                  <i className="bi bi-question-circle me-2"></i>
                  How to Use Discussions
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <h6 className="text-primary">
                      <i className="bi bi-plus-circle me-1"></i>
                      Create
                    </h6>
                    <small className="text-muted">
                      Start new discussions on topics that matter to your church community.
                    </small>
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-success">
                      <i className="bi bi-chat-left-text me-1"></i>
                      Engage
                    </h6>
                    <small className="text-muted">
                      Comment and reply to discussions to build meaningful connections.
                    </small>
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-warning">
                      <i className="bi bi-tags me-1"></i>
                      Organize
                    </h6>
                    <small className="text-muted">
                      Use tags to categorize discussions and make them easy to find.
                    </small>
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-info">
                      <i className="bi bi-search me-1"></i>
                      Discover
                    </h6>
                    <small className="text-muted">
                      Search and filter discussions to find conversations you're interested in.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DiscussionsProvider>
  );
} 