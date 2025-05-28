# Church Discussions Feature

A comprehensive discussions system for church communities, allowing members to create, participate in, and manage discussions within their church context.

## Features

### Core Functionality
- **Create Discussions**: Church members can start new discussions with titles, content, and tags
- **Threaded Comments**: Multi-level comment system with replies to comments
- **Tag System**: Organize discussions with customizable tags
- **Search & Filter**: Find discussions by content, tags, or keywords
- **Pin Discussions**: Administrators can pin important discussions to the top
- **Role-based Permissions**: Different access levels based on church role

### User Roles & Permissions

#### Member
- Create discussions
- Comment on discussions
- Reply to comments
- View all church discussions

#### Editor
- All member permissions
- Moderate discussions (edit/delete any content)
- Create discussions

#### Manager
- All editor permissions
- Pin/unpin discussions
- Manage discussions
- Moderate discussions

#### Admin
- All manager permissions
- Full discussion management
- User role management

## Architecture

### Context Structure
- `DiscussionsContext.tsx` - Main context for discussions functionality
- `AdminContext.tsx` - Admin role checking (updated with discussion permissions)
- `ChurchUserContext.tsx` - Church membership and role management

### Components
- `DiscussionsList.tsx` - Main list view of discussions
- `DiscussionCard.tsx` - Individual discussion preview card
- `CreateDiscussionModal.tsx` - Modal for creating new discussions
- `DiscussionDetailModal.tsx` - Full discussion view with comments
- `ChurchUserEditModal.tsx` - Updated with discussion permissions

### Data Models

#### Discussion
```typescript
interface Discussion {
  id: string;
  churchId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  tags: string[];
  isActive: boolean;
  isPinned: boolean;
  commentCount: number;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt?: Date;
  updatedBy?: string;
}
```

#### Comment
```typescript
interface Comment {
  id: string;
  discussionId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  updatedBy?: string;
  parentCommentId?: string; // For threaded replies
  replyCount?: number;
}
```

## Firestore Collections

### discussions
- Stores all discussion documents
- Indexed by: `churchId`, `isActive`, `isPinned`, `lastActivityAt`
- Security rules should check church membership

### comments
- Stores all comment documents
- Indexed by: `discussionId`, `isActive`, `createdAt`
- Supports threaded comments via `parentCommentId`

## Setup Instructions

### 1. Install Dependencies
The discussions functionality uses the existing Firebase setup, so no additional dependencies are required.

### 2. Firestore Security Rules
Add these rules to your Firestore security rules:

```javascript
// Discussions collection
match /discussions/{discussionId} {
  allow read: if isChurchMember(resource.data.churchId);
  allow create: if isAuthenticated() && 
                 isChurchMember(request.resource.data.churchId) &&
                 hasPermission(request.resource.data.churchId, 'create_discussions');
  allow update: if isAuthenticated() && 
                (resource.data.authorId == request.auth.uid ||
                 hasPermission(resource.data.churchId, 'moderate_discussions'));
  allow delete: if isAuthenticated() && 
                (resource.data.authorId == request.auth.uid ||
                 hasPermission(resource.data.churchId, 'moderate_discussions'));
}

// Comments collection
match /comments/{commentId} {
  allow read: if isAuthenticated() && 
              isChurchMemberOfDiscussion(resource.data.discussionId);
  allow create: if isAuthenticated() && 
                isChurchMemberOfDiscussion(request.resource.data.discussionId) &&
                hasPermissionForDiscussion(request.resource.data.discussionId, 'comment_discussions');
  allow update: if isAuthenticated() && 
                (resource.data.authorId == request.auth.uid ||
                 hasPermissionForDiscussion(resource.data.discussionId, 'moderate_discussions'));
  allow delete: if isAuthenticated() && 
                (resource.data.authorId == request.auth.uid ||
                 hasPermissionForDiscussion(resource.data.discussionId, 'moderate_discussions'));
}
```

### 3. Add Provider to App
Wrap your app with the DiscussionsProvider:

```tsx
import { DiscussionsProvider } from '@/contexts/DiscussionsContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthProvider>
          <ChurchUserProvider>
            <DiscussionsProvider>
              {children}
            </DiscussionsProvider>
          </ChurchUserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 4. Add Discussions Page
The discussions page is available at `/churches/[id]/discussions` and includes:
- Authentication checking
- Church membership verification
- Role-based access control
- Complete discussions interface

## Usage Examples

### Basic Usage
```tsx
import { useDiscussions } from '@/contexts/DiscussionsContext';

function MyComponent() {
  const { 
    getChurchDiscussions, 
    createDiscussion, 
    createComment 
  } = useDiscussions();

  // Load discussions for a church
  const loadDiscussions = async () => {
    const discussions = await getChurchDiscussions('church-id');
    console.log(discussions);
  };

  // Create a new discussion
  const createNew = async () => {
    const discussionId = await createDiscussion('church-id', {
      title: 'Welcome Discussion',
      content: 'Let\'s discuss our upcoming events!',
      tags: ['events', 'community']
    });
  };

  // Add a comment
  const addComment = async () => {
    await createComment('discussion-id', {
      content: 'Great discussion!'
    });
  };
}
```

### Using the Complete Interface
```tsx
import DiscussionsList from '@/components/admin/DiscussionsList';

function ChurchPage({ churchId }: { churchId: string }) {
  return (
    <DiscussionsProvider>
      <DiscussionsList churchId={churchId} />
    </DiscussionsProvider>
  );
}
```

## Features in Detail

### Discussion Creation
- Rich text content support
- Tag system with common tags and custom tags
- Form validation and character limits
- Community guidelines display

### Comment System
- Threaded conversations
- Real-time comment counts
- Reply functionality
- Moderation controls

### Search & Filter
- Full-text search across titles and content
- Tag-based filtering
- Role-based visibility controls

### Moderation
- Soft delete functionality
- Pin/unpin discussions
- Comment moderation
- Role-based permissions

## Performance Considerations

### Pagination
The system uses Firestore's `limit()` for pagination. Default limit is 50 discussions per load.

### Indexing
Recommended Firestore indexes:
- `(churchId, isActive, isPinned, lastActivityAt)` - For main discussion queries
- `(discussionId, isActive, createdAt)` - For comment queries
- `(churchId, isActive, tags, lastActivityAt)` - For tag filtering

### Caching
- Discussion lists are cached in component state
- Comment threads are loaded on-demand
- Consider adding React Query or SWR for advanced caching

## Customization

### Styling
The components use Bootstrap classes and can be customized by:
- Overriding Bootstrap variables
- Adding custom CSS classes
- Modifying component styling

### Permissions
Extend the permission system by:
- Adding new permission types to the role definitions
- Implementing custom permission checks
- Creating role-specific features

### Features
Potential enhancements:
- Like/reaction system
- Mention system (@username)
- Rich text editing
- File attachments
- Email notifications
- Discussion categories

## Troubleshooting

### Common Issues

1. **Users can't see discussions**
   - Check church membership in `churchUsers` collection
   - Verify Firestore security rules
   - Ensure user has proper permissions

2. **Comments not loading**
   - Check `discussionId` is correct
   - Verify user permissions for the church
   - Check Firestore indexes

3. **Permission errors**
   - Verify user role in church
   - Check permission arrays match expected values
   - Ensure context providers are properly nested

### Debug Mode
Enable debug logging by adding to component:
```tsx
useEffect(() => {
  console.log('Current user:', user);
  console.log('Church membership:', churchMembership);
  console.log('User permissions:', permissions);
}, [user, churchMembership, permissions]);
```

## Security Considerations

- All operations require authentication
- Church membership is verified for each action
- Soft delete preserves data integrity
- Role-based permissions prevent unauthorized access
- Input validation prevents XSS attacks
- Content moderation capabilities for administrators

## Future Enhancements

- Real-time updates using Firestore listeners
- Push notifications for new discussions/comments
- Advanced search with Algolia integration
- Content moderation with automatic filters
- Discussion analytics and insights
- Mobile app optimization
- Offline support with sync capabilities 