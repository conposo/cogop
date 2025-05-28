'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { ChurchUserProvider } from '@/contexts/ChurchUserContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading, adminData } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  const prevAdminDataStateRef = useRef<typeof adminData | undefined>(undefined);
  const wasLoadingInPreviousEffectRun = useRef(true); // Assume loading starts true

  useEffect(() => {
    // Read current props/context values for this effect run
    const currentAuthLoading = authLoading;
    const currentAdminLoading = adminLoading;
    const currentAdminData = adminData;
    const currentUser = user;
    const currentIsAdmin = isAdmin;

    // Read previous state from refs (values from the last effect run)
    const prevAdminData = prevAdminDataStateRef.current;
    const wasLoadingPreviously = wasLoadingInPreviousEffectRun.current;

    // Calculate derived states for this run
    const isCurrentlyLoading = currentAuthLoading || currentAdminLoading;
    const adminDataJustTransitionedToTruthy =
      (prevAdminData === undefined || !prevAdminData) && !!currentAdminData;
    
    // This is true if this is the first effect run where isCurrentlyLoading is false
    const isFirstCycleCompletelyLoaded = !isCurrentlyLoading && wasLoadingPreviously;

    console.log(
      'AdminLayout Effect Triggered:',
      {
        authLoading: currentAuthLoading,
        adminLoading: currentAdminLoading,
        isAdmin: currentIsAdmin,
        user: !!currentUser,
        currentAdminData: currentAdminData, // Log the actual data for better debugging
        prevAdminData: prevAdminData,       // Log the actual data
        adminDataJustTransitionedToTruthy,
        isCurrentlyLoading,
        wasLoadingPreviously, 
        isFirstCycleCompletelyLoaded,
      }
    );

    // --- Main Redirect/Access Logic ---
    if (!isCurrentlyLoading) {
      if (!currentUser) {
        console.log('AdminLayout Decision: REDIRECTING. Reason: No user.');
        router.push('/');
      } else if (currentIsAdmin) {
        console.log('AdminLayout Decision: ACCESS GRANTED. Reason: User is admin.');
      } else { 
        // User is logged in, all loading complete, but currentIsAdmin is false.
        // Determine if we should redirect or defer.
        let shouldRedirect = false;
        let decisionReason = "";

        if (adminDataJustTransitionedToTruthy) {
          decisionReason = "adminData just transitioned to truthy, currentIsAdmin is false. Deferring for currentIsAdmin update.";
        } else if (currentAdminData) {
          // adminData is TRUTHY (and didn't just transition, so it's somewhat stable).
          // Since currentIsAdmin is false, this implies the user (with data) is not an admin.
          shouldRedirect = true;
          decisionReason = "currentAdminData is TRUTHY (and stable), currentIsAdmin is false. Redirecting.";
        } else { // currentAdminData is FALSY (null/undefined)
          if (isFirstCycleCompletelyLoaded) {
            // It's the first cycle after all loading finished, and adminData is still falsy.
            // Defer to give adminData a chance to populate in the next cycle.
            decisionReason = "First cycle post-load, currentAdminData is FALSY. Deferring.";
          } else {
            // Not the first cycle post-load. Loaders were also false in the previous cycle.
            // Check if adminData has been stably falsy.
            const adminDataStablyFalsy =
              (prevAdminData === null || prevAdminData === undefined) &&
              (currentAdminData === null || currentAdminData === undefined);

            if (adminDataStablyFalsy) {
              shouldRedirect = true;
              decisionReason = "currentAdminData is FALSY (stably, in non-first post-loading cycle), currentIsAdmin is false. Redirecting.";
            } else {
              // adminData is falsy, but not stably so (e.g., it might have just changed from truthy to falsy, or prev was initial undefined).
              // This implies a transient state or a recent change. Defer to observe next state.
              decisionReason = "currentAdminData is FALSY (post-loading, but not stable FALSY or changed from truthy). Deferring.";
            }
          }
        }

        console.log(`AdminLayout Decision: ${shouldRedirect ? 'REDIRECTING' : 'DEFERRING'}. Reason: ${decisionReason}`);
        if (shouldRedirect) {
          router.push('/');
        }
      }
    } else {
      console.log('AdminLayout: Still loading...');
    }

    // Update refs for the *next* effect run
    prevAdminDataStateRef.current = currentAdminData;
    wasLoadingInPreviousEffectRun.current = isCurrentlyLoading; // Store current loading state for next run's 'wasLoadingPreviously'

  }, [user, isAdmin, authLoading, adminLoading, router, adminData]);

  // --- Loading State UI ---
  if (authLoading || adminLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // --- Null Render if Redirecting (avoids flash of content) ---
  // The useEffect handles the actual redirect. This prevents rendering children if a redirect is imminent or user is not admin.
  if (!user || !isAdmin) {
    return null;
  }

  // --- Admin Content UI ---
  const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: 'bi-speedometer2' },
    { href: '/admin/news', label: 'News Management', icon: 'bi-newspaper' },
    { href: '/admin/import-articles', label: 'Import Articles', icon: 'bi-download' },
    { href: '/admin/users', label: 'User Management', icon: 'bi-people' },
    ...(adminData?.role === 'super_admin' ? [
      { href: '/admin/churches', label: 'Churches Management', icon: 'bi-building' }
    ] : []),
    { href: '/admin/settings', label: 'Admin Settings', icon: 'bi-gear' },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-3 col-lg-2">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-shield-check me-2"></i>
                Admin Panel
              </h5>
            </div>
            <div className="card-body p-0">
              <nav className="nav flex-column">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link ${
                      pathname === item.href ? 'active bg-primary text-white' : 'text-dark'
                    }`}
                  >
                    <i className={`${item.icon} me-2`}></i>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="col-md-9 col-lg-10">
          <ChurchUserProvider>
            {children}
          </ChurchUserProvider>
        </div>
      </div>
    </div>
  );
} 