'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';
import { MultilingualString } from '@/lib/dummyContent';

// Helper function to get localized string or fallback
const getLocalizedString = (field: MultilingualString | string | undefined, lang: string, fallbackLang: string = 'en'): string => {
  if (!field) return '';
  if (typeof field === 'string') return field; // Handle legacy string format
  if (typeof field === 'object' && field !== null) {
    // Handle multilingual object format
    return field[lang] || field[fallbackLang] || Object.values(field)[0] || '';
  }
  return '';
};

interface DashboardStats {
  totalNews: number;
  totalUsers: number;
  recentNews: any[];
}

export default function AdminDashboard() {
  const { adminData } = useAdmin();
  const { language } = useI18n();
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    totalUsers: 0,
    recentNews: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch news count
        const newsSnapshot = await getDocs(collection(db, 'news'));
        const totalNews = newsSnapshot.size;

        // Fetch recent news
        const recentNewsQuery = query(
          collection(db, 'news'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const recentNewsSnapshot = await getDocs(recentNewsQuery);
        const recentNews = recentNewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch users count (admins collection)
        const usersSnapshot = await getDocs(collection(db, 'admins'));
        const totalUsers = usersSnapshot.size;

        setStats({
          totalNews,
          totalUsers,
          recentNews
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <div className="text-muted">
          Welcome back, {adminData?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{stats.totalNews}</h4>
                  <p className="card-text">Total News Articles</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-newspaper fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{stats.totalUsers}</h4>
                  <p className="card-text">Admin Users</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-people fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">5</h4>
                  <p className="card-text">Recent Articles</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-clock-history fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">Active</h4>
                  <p className="card-text">System Status</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-check-circle fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link href="/admin/news/new" className="btn btn-dark">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Article
                </Link>
                <Link href="/admin/news" className="btn btn-outline-primary">
                  <i className="bi bi-newspaper me-2"></i>
                  Manage News
                </Link>
                <Link href="/admin/users" className="btn btn-outline-secondary">
                  <i className="bi bi-people me-2"></i>
                  Manage Users
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent News Articles</h5>
            </div>
            <div className="card-body">
              {stats.recentNews.length > 0 ? (
                <div className="list-group list-group-flush">
                  {stats.recentNews.map((article: any) => (
                    <div key={article.id} className="list-group-item px-0">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{getLocalizedString(article.title, language)}</h6>
                        <small className="text-muted">
                          {article.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                        </small>
                      </div>
                      <p className="mb-1 text-muted small">
                        {getLocalizedString(article.excerpt, language) || 'No excerpt available'}
                      </p>
                      <small className="text-muted">
                        Status: <span className={`badge ${article.published ? 'bg-success' : 'bg-warning'}`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No news articles found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">System Information</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Admin Information</h6>
              <ul className="list-unstyled">
                <li><strong>Role:</strong> {adminData?.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}</li>
                <li><strong>Permissions:</strong> {adminData?.permissions?.join(', ') || 'All'}</li>
                <li><strong>Access Level:</strong> Full Admin Panel</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Quick Links</h6>
              <ul className="list-unstyled">
                <li><Link href="/admin/news" className="text-decoration-none">News Management</Link></li>
                <li><Link href="/admin/users" className="text-decoration-none">User Management</Link></li>
                <li><Link href="/admin/settings" className="text-decoration-none">Admin Settings</Link></li>
                <li><Link href="/" className="text-decoration-none">Back to Website</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 