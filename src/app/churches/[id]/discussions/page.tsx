'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChurchUser } from '@/contexts/ChurchUserContext';
import { DiscussionsProvider } from '@/contexts/DiscussionsContext';
import DiscussionsList from '@/components/admin/DiscussionsList';
import SetupChurchMembership from '@/components/admin/SetupChurchMembership';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';

export default function ChurchDiscussionsPage() {
  const params = useParams();
  const churchId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const { getUserChurches } = useChurchUser();
  const { isSuperAdmin } = useSuperAdmin();
  const { t } = useTranslation();
  
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
            <span className="visually-hidden">{t('loading', { defaultValue: 'Loading...' })}</span>
          </div>
          <p className="mt-2 text-muted">{t('loading_discussions', { defaultValue: 'Loading discussions...' })}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container -fluid py-5">
        <div className="text-center">
          <i className="bi bi-person-x text-muted" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-3">{t('authentication_required', { defaultValue: 'Authentication Required' })}</h3>
          <p className="text-muted">{t('please_log_in_discussions', { defaultValue: 'Please log in to access church discussions.' })}</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>
            {t('log_in', { defaultValue: 'Log In' })}
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
          <h3 className="mt-3">{t('access_denied', { defaultValue: 'Access Denied' })}</h3>
          <p className="text-muted">
            {t('no_access_discussions', { defaultValue: "You don't have access to this church's discussions. Please contact a church administrator to request access." })}
          </p>
          <button className="btn btn-secondary" onClick={() => window.history.back()}>
            {t('go_back', { defaultValue: 'Go Back' })}
          </button>
        </div>
        
        {/* Development Setup Tool - Only for Super Admins */}
        {isSuperAdmin && (
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="alert alert-warning mb-3">
                <i className="bi bi-shield-check me-2"></i>
                <strong>{t('super_admin_tools', { defaultValue: 'Super Admin Tools' })}</strong> - {t('super_admin_tools_description', { defaultValue: 'The following development tools are only visible to super administrators.' })}
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
              <Link href="/churches" className="text-decoration-none">{t('churches', { defaultValue: 'Churches' })}</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={`/churches/${churchId}`} className="text-decoration-none">{churchName}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">{t('discussions', { defaultValue: 'Discussions' })}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                {/* <h1 className="h2 mb-1">
                  <i className="bi bi-chat-dots me-2"></i>
                  {t('church_discussions_title', { defaultValue: '{churchName} Discussions' }).replace('{churchName}', churchName)}
                </h1> */}
                <p className="small text-uppercase fw-bold opacity-25 text-muted mb-0">
                  {t('connect_engage_community', { defaultValue: 'Connect and engage with your church community' })}
                  <span className="badge bg-light text-dark ms-2">{userRole}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        {/* <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a className="nav-link" href={`/churches/${churchId}`}>
                  <i className="bi bi-house me-1"></i>
                  {t('church_home', { defaultValue: 'Church Home' })}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href={`/churches/${churchId}/discussions`}>
                  <i className="bi bi-chat-dots me-1"></i>
                  {t('all_discussions', { defaultValue: 'All Discussions' })}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`/churches/${churchId}/events`}>
                  <i className="bi bi-calendar-event me-1"></i>
                  {t('events', { defaultValue: 'Events' })}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`/churches/${churchId}/members`}>
                  <i className="bi bi-people me-1"></i>
                  {t('members', { defaultValue: 'Members' })}
                </a>
              </li>
            </ul>
          </div>
        </div> */}

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
                  {t('how_to_use_discussions', { defaultValue: 'How to Use Discussions' })}
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <h6 className="text-primary">
                      <i className="bi bi-plus-circle me-1"></i>
                      {t('create', { defaultValue: 'Create' })}
                    </h6>
                    <small className="text-muted">
                      {t('create_discussions_description', { defaultValue: 'Start new discussions on topics that matter to your church community.' })}
                    </small>
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-success">
                      <i className="bi bi-chat-left-text me-1"></i>
                      {t('engage', { defaultValue: 'Engage' })}
                    </h6>
                    <small className="text-muted">
                      {t('engage_discussions_description', { defaultValue: 'Comment and reply to discussions to build meaningful connections.' })}
                    </small>
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-warning">
                      <i className="bi bi-tags me-1"></i>
                      {t('organize', { defaultValue: 'Organize' })}
                    </h6>
                    <small className="text-muted">
                      {t('organize_discussions_description', { defaultValue: 'Use tags to categorize discussions and make them easy to find.' })}
                    </small>
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-info">
                      <i className="bi bi-search me-1"></i>
                      {t('discover', { defaultValue: 'Discover' })}
                    </h6>
                    <small className="text-muted">
                      {t('discover_discussions_description', { defaultValue: 'Search and filter discussions to find conversations you\'re interested in.' })}
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