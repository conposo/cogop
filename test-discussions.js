// Test script for discussions functionality
// Run this in your browser console on a page where you have access to Firebase

async function testDiscussionsSetup() {
  console.log('🧪 Testing Discussions Setup...');
  
  try {
    // Test 1: Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      console.error('❌ User not authenticated');
      return;
    }
    console.log('✅ User authenticated:', user.uid);

    // Test 2: Check if user has church membership
    const testChurchId = 'YOUR_CHURCH_ID_HERE'; // Replace with actual church ID
    const churchUserRef = doc(db, 'churchUsers', `${testChurchId}_${user.uid}`);
    const churchUserDoc = await getDoc(churchUserRef);
    
    if (!churchUserDoc.exists()) {
      console.error('❌ User is not a member of church:', testChurchId);
      console.log('Creating test church membership...');
      
      // Create test membership
      await setDoc(churchUserRef, {
        userId: user.uid,
        churchId: testChurchId,
        role: 'member',
        permissions: ['view_content', 'create_discussions', 'comment_discussions'],
        email: user.email,
        displayName: user.displayName || 'Test User',
        isActive: true,
        createdAt: serverTimestamp(),
        createdBy: user.uid
      });
      console.log('✅ Test church membership created');
    } else {
      console.log('✅ User is member of church with role:', churchUserDoc.data().role);
    }

    // Test 3: Try to read discussions
    const discussionsRef = collection(db, 'discussions');
    const q = query(
      discussionsRef,
      where('churchId', '==', testChurchId),
      where('isActive', '==', true),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    console.log('✅ Successfully queried discussions. Found:', snapshot.size, 'discussions');

    // Test 4: Create a test discussion
    const testDiscussion = {
      churchId: testChurchId,
      title: 'Test Discussion',
      content: 'This is a test discussion created by the setup script.',
      authorId: user.uid,
      authorName: user.displayName || 'Test User',
      authorEmail: user.email,
      tags: ['test'],
      isActive: true,
      isPinned: false,
      commentCount: 0,
      lastActivityAt: serverTimestamp(),
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(discussionsRef, testDiscussion);
    console.log('✅ Successfully created test discussion:', docRef.id);

    // Test 5: Read the created discussion
    const createdDiscussion = await getDoc(docRef);
    if (createdDiscussion.exists()) {
      console.log('✅ Successfully read created discussion');
    }

    // Clean up - delete test discussion
    await updateDoc(docRef, { isActive: false });
    console.log('✅ Test discussion marked as inactive (cleaned up)');

    console.log('🎉 All tests passed! Discussions setup is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('📋 Troubleshooting steps:');
      console.log('1. Check Firestore security rules are deployed');
      console.log('2. Verify user has church membership');
      console.log('3. Check that required indexes are created');
      console.log('4. Ensure user has proper permissions array');
    }
  }
}

// Run the test
testDiscussionsSetup(); 