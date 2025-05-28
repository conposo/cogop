# Churches Management System

This document describes the Churches management functionality implemented for super administrators.

## Overview

The Churches management system allows super administrators to manage church information in the Firestore database. This includes adding, viewing, editing, and deleting church records.

## Access Control

- **Super Admin Only**: Only users with the `super_admin` role can access the Churches management features
- **Navigation**: The Churches management link appears in the admin navigation only for super admins
- **Dashboard**: Church statistics are displayed on the admin dashboard for super admins

## Features

### 1. Churches List Page (`/admin/churches`)
- View all churches in a table format
- Display church name, location, pastor, denomination, and status
- Search and filter capabilities
- Add new church button
- Actions: View, Edit, Delete for each church

### 2. Add/Edit Church Modal
- Comprehensive form with the following fields:
  - **Required**: Name, Address, City, State, Zip Code
  - **Optional**: Pastor, Phone, Email, Website, Denomination, Description
  - **Status**: Active/Inactive toggle
- Form validation for required fields
- Real-time updates to the churches list

### 3. Church Details Page (`/admin/churches/[id]`)
- Detailed view of individual church information
- Contact information with clickable links (phone, email, website)
- Address with Google Maps integration
- Metadata (creation/update timestamps and user info)
- Quick actions (Edit, Delete)
- Breadcrumb navigation

### 4. Dashboard Integration
- Church count displayed in dashboard statistics
- Quick action button to manage churches
- Church management link in quick links section

## Database Structure

Churches are stored in the `churches` collection in Firestore with the following schema:

```typescript
interface Church {
  id: string;                    // Auto-generated document ID
  name: string;                  // Church name (required)
  address: string;               // Street address (required)
  city: string;                  // City (required)
  state: string;                 // State (required)
  zipCode: string;               // Zip code (required)
  phone?: string;                // Phone number (optional)
  email?: string;                // Email address (optional)
  website?: string;              // Website URL (optional)
  pastor?: string;               // Pastor name (optional)
  denomination?: string;         // Denomination (optional)
  description?: string;          // Description (optional)
  isActive: boolean;             // Active status
  createdAt: Timestamp;          // Creation timestamp
  createdBy: string;             // Creator user ID
  updatedAt?: Timestamp;         // Last update timestamp
  updatedBy?: string;            // Last updater user ID
}
```

## Navigation Structure

```
Admin Dashboard
├── Churches Management (Super Admin Only)
    ├── Churches List (/admin/churches)
    ├── Add New Church (Modal)
    ├── Edit Church (Modal)
    └── Church Details (/admin/churches/[id])
        ├── View Church Information
        ├── Edit Church (redirects to list with edit modal)
        └── Delete Church (with confirmation)
```

## Security Features

- Role-based access control (super admin only)
- Firestore security rules should be configured to restrict church collection access
- All operations are logged with user ID and timestamp
- Confirmation dialogs for destructive actions (delete)

## UI/UX Features

- Responsive design using Bootstrap classes
- Loading states for all async operations
- Error handling with user-friendly messages
- Breadcrumb navigation
- Bootstrap icons for visual consistency
- Modal forms for add/edit operations
- Clickable contact information (tel:, mailto:, external links)
- Google Maps integration for addresses

## Future Enhancements

Potential improvements that could be added:

1. **Search and Filtering**: Add search functionality to filter churches by name, city, denomination, etc.
2. **Bulk Operations**: Allow bulk editing or deletion of multiple churches
3. **Import/Export**: CSV import/export functionality for church data
4. **Image Upload**: Add support for church photos
5. **Service Times**: Add fields for service schedules
6. **Member Count**: Track congregation size
7. **Contact History**: Log communication history with churches
8. **Geolocation**: Store and display churches on a map view
9. **Reports**: Generate reports on church statistics and demographics

## Installation Notes

The Churches management system is automatically available to super admins once the code is deployed. No additional setup is required beyond ensuring:

1. Firestore is properly configured
2. Admin authentication is working
3. Super admin roles are properly assigned in the `admins` collection
4. Bootstrap and Bootstrap Icons are available for styling 