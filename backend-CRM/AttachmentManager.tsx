import React, { useEffect, useRef } from 'react';
import { useAttachments } from './useAttachments';

interface AttachmentManagerProps {
  recordId: string;
  category: string;
  title?: string;
}

export const AttachmentManager: React.FC<AttachmentManagerProps> = ({
  recordId,
  category,
  title = 'File Attachments'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    uploading,
    attachments,
    error,
    loading,
    uploadAttachment,
    deleteAttachment,
    listAttachments,
    downloadAttachment,
    getAttachmentStats
  } = useAttachments(recordId, category);

  // Load attachments on component mount
  useEffect(() => {
    if (recordId && category) {
      listAttachments();
    }
  }, [recordId, category]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const success = await uploadAttachment(file);
    if (success) {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      await deleteAttachment(attachmentId);
    }
  };

  const handleDownload = (attachment: any) => {
    downloadAttachment(attachment.id, attachment.originalName);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="attachment-manager" style={styles.attachmentManager}>
      <div className="attachment-header" style={styles.attachmentHeader}>
        <h3 style={styles.title}>{title}</h3>
        <div className="upload-section">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }}
            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="upload-btn"
            style={uploading ? styles.uploadBtnDisabled : styles.uploadBtn}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" style={styles.errorMessage}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading" style={styles.loading}>Loading attachments...</div>
      ) : (
        <div className="attachments-list">
          {attachments.length === 0 ? (
            <div className="no-attachments" style={styles.noAttachments}>No attachments found</div>
          ) : (
            <div className="attachments-grid" style={styles.attachmentsGrid}>
              {attachments.map((attachment) => (
                <div key={attachment.id} className="attachment-item" style={styles.attachmentItem}>
                  <div className="attachment-info" style={styles.attachmentInfo}>
                    <div className="attachment-name" style={styles.attachmentName} title={attachment.originalName}>
                      {attachment.originalName}
                    </div>
                    <div className="attachment-meta" style={styles.attachmentMeta}>
                      <span className="file-size">{formatFileSize(attachment.fileSize)}</span>
                      <span className="upload-date">{formatDate(attachment.uploadedAt)}</span>
                    </div>
                    {attachment.description && (
                      <div className="attachment-description" style={styles.attachmentDescription}>{attachment.description}</div>
                    )}
                    {attachment.tags && attachment.tags.length > 0 && (
                      <div className="attachment-tags" style={styles.attachmentTags}>
                        {attachment.tags.map((tag: string, index: number) => (
                          <span key={index} className="tag" style={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="attachment-actions" style={styles.attachmentActions}>
                    <button
                      onClick={() => handleDownload(attachment)}
                      className="download-btn"
                      style={styles.actionBtn}
                      title="Download"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() => handleDelete(attachment.id)}
                      className="delete-btn"
                      style={styles.actionBtn}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  attachmentManager: {
    border: '1px solid #e1e5e9',
    borderRadius: '8px',
    padding: '1rem',
    background: 'white',
  },
  attachmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  title: {
    margin: 0,
    color: '#2d3748',
  },
  uploadBtn: {
    background: '#3182ce',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  uploadBtnDisabled: {
    background: '#a0aec0',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontSize: '14px',
  },
  errorMessage: {
    background: '#fed7d7',
    color: '#c53030',
    padding: '0.5rem',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '1rem',
  },
  loading: {
    textAlign: 'center' as const,
    color: '#718096',
    padding: '2rem',
    fontStyle: 'italic',
  },
  noAttachments: {
    textAlign: 'center' as const,
    color: '#718096',
    padding: '2rem',
    fontStyle: 'italic',
  },
  attachmentsGrid: {
    display: 'grid',
    gap: '1rem',
  },
  attachmentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    background: '#f7fafc',
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontWeight: 500,
    color: '#2d3748',
    marginBottom: '0.25rem',
    wordBreak: 'break-word' as const,
  },
  attachmentMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '12px',
    color: '#718096',
    marginBottom: '0.25rem',
  },
  attachmentDescription: {
    fontSize: '13px',
    color: '#4a5568',
    marginBottom: '0.25rem',
  },
  attachmentTags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  },
  tag: {
    background: '#edf2f7',
    color: '#4a5568',
    padding: '0.125rem 0.375rem',
    borderRadius: '12px',
    fontSize: '11px',
  },
  attachmentActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    padding: '0.25rem',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '16px',
  },
};
