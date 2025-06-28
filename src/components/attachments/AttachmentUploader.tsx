
import React, { useRef, useEffect } from 'react';
import { useAttachments } from "@/hooks/useAttachments";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AttachmentUploaderProps {
  recordId: string;
  category: string; // "note", "contact", "deal" etc.
}

export function AttachmentUploader({ recordId, category }: AttachmentUploaderProps) {
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
  } = useAttachments(recordId, category);

  useEffect(() => {
    if (recordId && category) {
      listAttachments();
    }
    // eslint-disable-next-line
  }, [recordId, category]);

  // Parse filename from attachment object
  const getFileInfo = (attachment: any) => {
    try {
      const displayName = attachment.originalName || attachment.fileName || 'Unknown file';
      return { fullFileName: attachment.fileName, displayName };
    } catch {
      return { fullFileName: attachment.fileName || '', displayName: 'Unknown file' };
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const success = await uploadAttachment(e.target.files[0]);
    if (success) {
      toast({ title: "Success", description: "File uploaded successfully!" });
    }
    e.target.value = "";
  };

  const handleDelete = async (attachmentId: string) => {
    await deleteAttachment(attachmentId);
    toast({ title: "Success", description: "File deleted successfully!" });
  };

  const handleDownload = (attachment: any) => {
    downloadAttachment(attachment.id, attachment.originalName);
  };

  return (
    <div className="mt-4">
      <div className="flex gap-2 items-center mb-4">
        <input
          type="file"
          accept="*/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          size="sm"
        >
          {uploading ? "Uploading..." : "Add Attachment"}
        </Button>
        {error && <span className="text-red-500 ml-2 text-xs">{error}</span>}
      </div>
      
      {loading ? (
        <div className="text-gray-500 text-sm">Loading attachments...</div>
      ) : (
        <div className="space-y-2">
          {attachments.length > 0 ? (
            attachments.map((attachment) => {
              const { displayName } = getFileInfo(attachment);
              return (
                <div key={attachment.id} className="flex items-center justify-between p-2 border rounded bg-gray-50">
                  <button
                    onClick={() => handleDownload(attachment)}
                    className="text-blue-600 hover:underline flex items-center gap-2 flex-1 text-left"
                  >
                    <Download className="h-4 w-4" />
                    {displayName}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(attachment.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">No attachments yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
