'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import Link from 'next/link';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) return null;

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="btn btn-link text-decoration-none d-flex align-items-center"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ border: 'none', padding: '0.5rem' }}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={displayName}
            className="rounded-circle me-2"
            style={{ width: '32px', height: '32px' }}
          />
        ) : (
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
            style={{ width: '32px', height: '32px', fontSize: '0.875rem' }}
          >
            {initials}
          </div>
        )}
        {/* <span className="text-dark">{displayName}</span> */}
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} ms-1`}></i>
      </button>

      {isOpen && (
        <ul className="dropdown-menu dropdown-menu-end show" style={{ minWidth: '200px' }}>
          <li>
            <div className="dropdown-item-text">
              <div className="fw-bold">{displayName}</div>
              <small className="text-muted">{user.email}</small>
              {isAdmin && (
                <small className="badge bg-warning text-dark ms-2">Admin</small>
              )}
            </div>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <Link className="dropdown-item" href="/profile">
              <i className="bi bi-person me-2"></i>
              Profile
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" href="/settings">
              <i className="bi bi-gear me-2"></i>
              Settings
            </Link>
          </li>
          {isAdmin && (
            <>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <Link className="dropdown-item" href="/admin">
                  <i className="bi bi-shield-check me-2"></i>
                  Admin Dashboard
                </Link>
              </li>
            </>
          )}
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button className="dropdown-item" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Sign Out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
} 