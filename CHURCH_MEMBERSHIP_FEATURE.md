# Church Membership Feature

## Overview
This feature allows users to join churches as members directly from their profile page. It provides a comprehensive church user management system with different roles and permissions.

## Features

### For Regular Users (Profile Page)
- **View Church Memberships**: Users can see all churches they are members of
- **Join Churches**: Users can search and join any active church as a member
- **Search Functionality**: Search churches by name, city, or state
- **Membership Details**: View role, status, permissions, and join date for each church

### For Super Admins (Admin Panel)
- **Church User Management**: Full CRUD operations for church users
- **Role Management**: Assign roles (Admin, Manager, Editor, Member) to church users
- **Permission Management**: Customize permissions for each user
- **User Status Control**: Activate/deactivate church users
- **Church Overview**: View user statistics and role breakdown for each church

## User Roles and Permissions

### Member (Default for self-registration)
- **Permissions**: `view_content`
- **Description**: Basic access to view church content

### Editor
- **Permissions**: `manage_content`, `manage_events`
- **Description**: Can manage church content and events

### Manager
- **Permissions**: `manage_content`, `manage_events`, `view_analytics`
- **Description**: Can manage content, events, and view analytics

### Admin
- **Permissions**: `manage_users`, `manage_content`, `manage_events`, `view_analytics`, `manage_settings`
- **Description**: Full access to manage users, content, events, and settings

## Database Structure

### Collection: `churchUsers`
```typescript
interface ChurchUser {
  id: string;                    // Format: {churchId}_{userId}
  userId: string;                // Firebase Auth UID
  churchId: string;              // Church document ID
  role: 'admin' | 'manager' | 'editor' | 'member';
  permissions: string[];         // Array of permission strings
  email?: string;                // User email
  displayName?: string;          // User display name
  isActive: boolean;             // User status
  createdAt: Date;               // When user joined church
  createdBy: string;             // Who added the user
  updatedAt?: Date;              // Last update timestamp
  updatedBy?: string;            // Who last updated the user
}
```

## API Functions

### ChurchUserContext
- `addChurchUser(churchId, userData)` - Add user to church
- `updateChurchUser(churchUserId, updates)` - Update church user
- `removeChurchUser(churchUserId)` - Remove user from church
- `getChurchUsers(churchId)` - Get all users for a church
- `getUserChurches(userId)` - Get all churches for a user

## Usage Examples

### User Joining a Church
1. Navigate to Profile page
2. Click "Join Church" button
3. Search for desired church
4. Select church from dropdown
5. Click "Join as Member"
6. User is automatically added with "member" role

### Admin Managing Church Users
1. Navigate to Admin > Churches
2. Select a church
3. Click "Manage Users"
4. Add users by Firebase UID
5. Assign roles and permissions
6. Activate/deactivate users as needed

## Security Considerations
- Only authenticated users can join churches
- Only super admins can manage church users
- Users can only join as members (lowest privilege level)
- Admins can assign higher roles and custom permissions
- All operations are logged with timestamps and user attribution

## Future Enhancements
- Email invitations to join churches
- Bulk user import functionality
- Church-specific content access control
- User approval workflow for joining churches
- Integration with church events and content management 