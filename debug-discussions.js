// Debug script for discussions functionality
// Copy and paste this into your browser console on the discussions page

console.log('🔧 Starting Discussions Debug Script...');

async function debugDiscussions() {
  try {
    // Check if Firebase is available
    if (typeof window.auth === 'undefined' || typeof window.db === 'undefined') {
      console.error('❌ Firebase not available. Make sure you\'re on a page with Firebase loaded.');
      alert('❌ Firebase not available. Please run this on the discussions page.');
      return;
    }

    const auth = window.auth;
    const db = window.db;

    // Check authentication
    const user = auth.currentUser;
    if (!user) {
      console.error('❌ No authenticated user');
      alert('❌ You need to be logged in. Please log in and try again.');
      return;
    }

    console.log('✅ User authenticated:', user.uid, user.email);

    // Get church ID from URL
    const url = window.location.href;
    const churchIdMatch = url.match(/churches\/([^\/]+)/);
    if (!churchIdMatch) {
      console.error('❌ Could not determine church ID from URL');
      alert('❌ Please run this script on a church discussions page.');
      return;
    }

    const churchId = churchIdMatch[1];
    console.log('✅ Church ID found:', churchId);

    // Check church membership
    const churchUserRef = window.firebase.firestore().doc(db, 'churchUsers', `${churchId}_${user.uid}`);
    
    try {
      const churchUserDoc = await window.firebase.firestore().getDoc(churchUserRef);
      
      if (!churchUserDoc.exists()) {
        console.error('❌ User is not a member of this church');
        alert(`❌ You're not a member of this church yet.

To fix this:
1. Ask a church administrator to add you as a member
2. Or use the "Setup Church Membership" tool on the page
3. Church ID: ${churchId}
4. Your User ID: ${user.uid}`);
        return;
      }

      const membership = churchUserDoc.data();
      console.log('✅ Church membership found:', membership);
      console.log('Role:', membership.role);
      console.log('Permissions:', membership.permissions);

      // Check if user has create_discussions permission
      if (!membership.permissions || !membership.permissions.includes('create_discussions')) {
        console.warn('⚠️ User does not have create_discussions permission');
        alert(`⚠️ Your account doesn't have permission to create discussions.

Current permissions: ${membership.permissions ? membership.permissions.join(', ') : 'none'}
Role: ${membership.role}

Contact a church administrator to grant you "create_discussions" permission.`);
      } else {
        console.log('✅ User has create_discussions permission');
      }

    } catch (membershipError) {
      console.error('❌ Error checking church membership:', membershipError);
      alert(`❌ Error checking church membership: ${membershipError.message}

This might be a Firestore security rules or permissions issue.`);
      return;
    }

    // Test reading discussions
    try {
      const discussionsQuery = window.firebase.firestore().query(
        window.firebase.firestore().collection(db, 'discussions'),
        window.firebase.firestore().where('churchId', '==', churchId),
        window.firebase.firestore().where('isActive', '==', true),
        window.firebase.firestore().limit(1)
      );

      const snapshot = await window.firebase.firestore().getDocs(discussionsQuery);
      console.log('✅ Can read discussions. Found:', snapshot.size);

    } catch (readError) {
      console.error('❌ Cannot read discussions:', readError);
      alert(`❌ Cannot read discussions: ${readError.message}

This suggests a Firestore security rules issue.`);
      return;
    }

    console.log('🎉 Basic diagnostics complete! Check console for details.');
    alert(`✅ Diagnostics complete!

✅ User authenticated: ${user.email}
✅ Church membership found
✅ Can read discussions
✅ Has permissions: ${membership.permissions.join(', ')}

If you're still having issues creating discussions, check:
1. Firestore security rules are deployed correctly
2. Required Firestore indexes exist
3. Try refreshing the page

Check the browser console for detailed logs.`);

  } catch (error) {
    console.error('❌ Debug script error:', error);
    alert(`❌ Debug script error: ${error.message}`);
  }
}

// Run the debug function
debugDiscussions(); 