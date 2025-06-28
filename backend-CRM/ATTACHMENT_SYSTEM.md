# File Attachment System

This document describes the file attachment system that replaces Supabase storage functionality with a backend API solution.

## Backend Components

### 1. Database Model (Attachment.ts)

The `Attachment` model stores metadata about uploaded files:
- `recordId`: ID of the parent record (client, deal, note, etc.)
- `category`: File category (note, contact, deal, client, document, image, other)
- `fileName`: Generated filename on disk
- `originalName`: Original uploaded filename
- `filePath`: Relative path to the file
- `fileSize`: File size in bytes
- `mimeType`: File MIME type
- `uploadedBy`: User who uploaded the file
- `uploadedAt`: Upload timestamp
- `description`: Optional file description
- `tags`: Optional tags array

### 2. File Upload Middleware (upload.ts)

Multer configuration for handling file uploads:
- Stores files in `uploads/{category}/{recordId}/` directory structure
- Generates unique filenames with timestamps
- Supports file type validation
- 10MB file size limit per file
- Maximum 5 files for multiple uploads

### 3. Controller (attachmentController.ts)

REST API endpoints for file management:
- `POST /api/attachments/upload` - Upload file
- `GET /api/attachments/{recordId}/{category}` - List attachments
- `GET /api/attachments/details/{id}` - Get attachment details
- `GET /api/attachments/file/{id}` - Download file
- `PUT /api/attachments/{id}` - Update attachment metadata
- `DELETE /api/attachments/{id}` - Delete attachment
- `GET /api/attachments/stats/{recordId}` - Get statistics

### 4. Routes (attachmentRoutes.ts)

Express routes with authentication middleware and Swagger documentation.

## Frontend Components

### 1. React Hook (useAttachments.ts)

Custom hook that provides attachment functionality:

```typescript
const {
  uploading,
  attachments,
  error,
  loading,
  uploadAttachment,
  deleteAttachment,
  listAttachments,
  updateAttachment,
  getAttachmentDetails,
  downloadAttachment,
  getAttachmentStats,
  setAttachments,
  setError,
} = useAttachments(recordId, category);
```

### 2. React Component (AttachmentManager.tsx)

Pre-built UI component for file management with upload, list, download, and delete functionality.

## Usage Examples

### Basic Hook Usage

```typescript
import { useAttachments } from './useAttachments';

function MyComponent() {
  const { uploadAttachment, listAttachments, attachments } = useAttachments('client-123', 'document');
  
  const handleUpload = async (file: File) => {
    await uploadAttachment(file, undefined, 'Contract document', ['contract', 'legal']);
  };
  
  useEffect(() => {
    listAttachments();
  }, []);
  
  return (
    <div>
      {attachments.map(att => (
        <div key={att.id}>{att.originalName}</div>
      ))}
    </div>
  );
}
```

### Using the Component

```typescript
import { AttachmentManager } from './AttachmentManager';

function ClientDetail({ clientId }: { clientId: string }) {
  return (
    <div>
      <h2>Client Documents</h2>
      <AttachmentManager 
        recordId={clientId} 
        category="client" 
        title="Client Files" 
      />
    </div>
  );
}
```

## API Endpoints

### Upload File
```
POST /api/attachments/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- file: (binary)
- recordId: string
- category: string
- description?: string
- tags?: string (JSON array)
```

### List Attachments
```
GET /api/attachments/{recordId}/{category}?page=1&limit=50
Authorization: Bearer {token}
```

### Download File
```
GET /api/attachments/file/{attachmentId}
Authorization: Bearer {token}
```

### Delete Attachment
```
DELETE /api/attachments/{attachmentId}
Authorization: Bearer {token}
```

## File Storage

Files are stored in the `uploads/` directory with this structure:
```
uploads/
├── client/
│   ├── client-123/
│   │   ├── 1640995200000-contract.pdf
│   │   └── 1640995300000-photo.jpg
├── deal/
│   └── deal-456/
│       └── 1640995400000-proposal.docx
└── note/
    └── note-789/
        └── 1640995500000-attachment.txt
```

## Security Features

- Authentication required for all endpoints
- Users can only delete/update their own uploads (unless admin)
- File type validation
- File size limits
- Secure file paths to prevent directory traversal

## Environment Variables

Make sure these are set in your `.env` file:
```
VITE_API_URL=http://localhost:3000  # Frontend
JWT_SECRET=your-secret-key          # Backend
```

## Installation

1. Backend dependencies are already installed with multer
2. Copy the frontend files (`useAttachments.ts`, `AttachmentManager.tsx`) to your frontend project
3. Update the API base URL in the hook if needed
4. Ensure your authentication stores the token in localStorage as 'authToken' or 'token'

## Migration from Supabase

To migrate from Supabase storage:
1. Replace `useAttachments` hook import
2. Update component props if needed
3. The API interface is similar, so most existing code should work with minimal changes
4. Remove Supabase client dependencies
