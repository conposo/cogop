# Firebase Authentication & Admin Setup Guide

## 1. Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new Firebase project (or use an existing one)
3. Once your project is created, go to **Project settings** (the gear icon)
4. In the "Your apps" section, click the web icon (`</>`) to add a new web app
5. Register your app (you don't need to set up Firebase Hosting)
6. Copy the `firebaseConfig` object that Firebase provides

## 2. Enable Authentication Methods

1. In the Firebase console, go to **Authentication** (in the Build section)
2. Click on the **Sign-in method** tab
3. Enable **Google** as a sign-in provider
4. Enable **Email/Password** as a sign-in provider

## 3. Enable Firestore Database

1. In the Firebase console, go to **Firestore Database** (in the Build section)
2. Click **Create database**
3. Choose **Start in test mode** (you can configure security rules later)
4. Select a location for your database

## 4. Enable Firebase Storage

1. In the Firebase console, go to **Storage** (in the Build section)
2. Click **Get started**
3. Choose **Start in test mode** (you can configure security rules later)
4. Select a location for your storage

## 5. Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Replace the placeholder values with your actual Firebase configuration values from step 1.

## 6. Google OAuth Setup (for Google Sign-in)

1. In the Firebase console, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Enable it and add your project's authorized domains
4. For local development, make sure `localhost` is in the authorized domains

## 7. Admin User Setup

To create admin users, you need to manually add documents to the `admins` collection in Firestore:

1. Go to **Firestore Database** in the Firebase console
2. Click **Start collection** and name it `admins`
3. For each admin user, create a document with the user's UID as the document ID
4. Add the following fields:
   - `role`: "admin" or "super_admin"
   - `permissions`: ["news", "users"] (array of strings)
   - `createdAt`: Current timestamp
   - `createdBy`: "system" or admin UID who created this user

Example admin document:
```
Document ID: [USER_UID_FROM_AUTHENTICATION]
Fields:
- role: "admin"
- permissions: ["news", "users"]
- createdAt: [Current Timestamp]
- createdBy: "system"
```

## 8. Firestore Security Rules

Update your Firestore security rules to protect admin data and churches collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Helper function to check if user is super admin
    function isSuperAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    // Allow read access to published news articles
    match /news/{document} {
      allow read: if resource.data.published == true;
      allow write: if isAdmin();
    }
    
    // Protect admin collection - only admins can read/write
    match /admins/{document} {
      allow read, write: if isAdmin();
    }
    
    // Churches collection - super admins can read/write all, others can read only active
    match /churches/{document} {
      allow read: if isSuperAdmin() || resource.data.isActive == true;
      allow write: if isSuperAdmin();
    }
    
    // Default deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 9. Storage Security Rules

Update your Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /news-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.exists(/databases/(default)/documents/admins/$(request.auth.uid));
    }
  }
}
```

## 10. Testing

After setting up the environment variables and admin users:

1. Restart your development server: `npm run dev`
2. Navigate to your site
3. Sign in with an account that has admin privileges
4. You should see an "Admin" badge in the user menu
5. Click "Admin Dashboard" to access the admin panel

## Features Included

### Authentication
- **Email/Password Authentication**: Users can create accounts and sign in with email and password
- **Google OAuth**: Users can sign in with their Google accounts
- **Password Reset**: Users can reset their passwords via email
- **User Profile**: Displays user information and profile picture
- **Persistent Sessions**: Users stay logged in across browser sessions

### Admin Management
- **Admin Dashboard**: Overview of system statistics and quick actions
- **News Management**: Create, edit, delete, and publish news articles
- **Image Upload**: Upload and manage featured images for articles
- **Content Categories**: Organize articles by category
- **Draft/Publish System**: Save articles as drafts or publish immediately
- **Featured Articles**: Mark articles as featured for homepage display
- **User Management**: View and manage admin users (coming soon)

### Security Features
- **Role-based Access**: Different permission levels for admins
- **Protected Routes**: Admin pages are only accessible to authenticated admins
- **Secure File Upload**: Images are uploaded to Firebase Storage with proper permissions
- **Data Validation**: Form validation and error handling

## Security Notes

- All Firebase configuration variables are prefixed with `NEXT_PUBLIC_` because they need to be accessible in the browser
- These are not sensitive secrets - they're meant to be public
- Firebase security is handled by Firebase Security Rules, not by hiding these values
- Make sure to configure proper Firebase Security Rules for your Firestore database and Storage
- Admin privileges are controlled by the `admins` collection in Firestore 