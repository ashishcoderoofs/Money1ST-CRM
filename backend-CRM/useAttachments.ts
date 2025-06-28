import { useState } from "react";

/**
 * useAttachments
 * handles upload, list, and delete of attachment files for a specific record (e.g., client/note/deal)
 * Works with the backend API instead of Supabase
 *
 * @param {string} recordId - The ID of the parent entity (e.g., clientId, contactId, dealId)
 * @param {string} category - A string tag (e.g., "note", "contact", "deal") to namespace files
 */
export function useAttachments(recordId: string, category: string) {
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get the API base URL from environment variables
  const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:3000';

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  // List attachments
  const listAttachments = async (page = 1, limit = 50) => {
    if (!recordId) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/attachments/${recordId}/${category}?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAttachments(data.attachments || []);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch attachments';
      setError(errorMessage);
      console.error('Error listing attachments:', err);
      return { attachments: [], pagination: null };
    } finally {
      setLoading(false);
    }
  };

  // Upload attachment
  const uploadAttachment = async (file: File, userId?: string, description?: string, tags?: string[]) => {
    if (!recordId || !category) {
      setError('Record ID and category are required');
      return false;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('recordId', recordId);
      formData.append('category', category);
      
      if (description) {
        formData.append('description', description);
      }
      
      if (tags && tags.length > 0) {
        formData.append('tags', JSON.stringify(tags));
      }

      const response = await fetch(`${API_BASE_URL}/api/attachments/upload`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Refresh the attachments list
      await listAttachments();
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload file';
      setError(errorMessage);
      console.error('Error uploading attachment:', err);
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Delete attachment
  const deleteAttachment = async (attachmentId: string) => {
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Refresh the attachments list
      await listAttachments();
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete attachment';
      setError(errorMessage);
      console.error('Error deleting attachment:', err);
      return false;
    }
  };

  // Update attachment metadata
  const updateAttachment = async (attachmentId: string, description?: string, tags?: string[]) => {
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attachments/${attachmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          description,
          tags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Refresh the attachments list
      await listAttachments();
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update attachment';
      setError(errorMessage);
      console.error('Error updating attachment:', err);
      return false;
    }
  };

  // Get attachment details
  const getAttachmentDetails = async (attachmentId: string) => {
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attachments/details/${attachmentId}`, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get attachment details';
      setError(errorMessage);
      console.error('Error getting attachment details:', err);
      return null;
    }
  };

  // Download attachment
  const downloadAttachment = async (attachmentId: string, fileName?: string) => {
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attachments/file/${attachmentId}`, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `attachment-${attachmentId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to download attachment';
      setError(errorMessage);
      console.error('Error downloading attachment:', err);
      return false;
    }
  };

  // Get attachment statistics
  const getAttachmentStats = async () => {
    if (!recordId) return null;
    
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attachments/stats/${recordId}`, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get attachment statistics';
      setError(errorMessage);
      console.error('Error getting attachment stats:', err);
      return null;
    }
  };

  return {
    // State
    uploading,
    attachments,
    error,
    loading,
    
    // Actions
    uploadAttachment,
    deleteAttachment,
    listAttachments,
    updateAttachment,
    getAttachmentDetails,
    downloadAttachment,
    getAttachmentStats,
    
    // Setters (for manual state management if needed)
    setAttachments,
    setError,
  };
}
