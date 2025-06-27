
import React, { useRef, useEffect } from 'react';
import { useAttachments } from "@/hooks/useAttachments";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AttachmentUploaderProps {
  recordId: string;
  category: string; // "note", "contact", "deal" etc.
}

export function AttachmentUploader({ recordId, category }: AttachmentUploaderProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploading,
    attachmentUrls,
    error,
    uploadAttachment,
    deleteAttachment,
    listAttachments,
  } = useAttachments(recordId, category);

  useEffect(() => {
    listAttachments();
    // eslint-disable-next-line
  }, [recordId, category]);

  // Parse filename from url and get the actual filename for deletion
  const getFileInfo = (url: string) => {
    try {
      const urlParts = url.split('/');
      const fullFileName = urlParts[urlParts.length - 1];
      const decodedFileName = decodeURIComponent(fullFileName);
      // Remove timestamp prefix (e.g., "1703123456-filename.pdf" -> "filename.pdf")
      const displayName = decodedFileName.replace(/^\d+-/, '');
      return { fullFileName, displayName };
    } catch {
      return { fullFileName: url, displayName: url };
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id || !e.target.files?.length) return;
    const success = await uploadAttachment(e.target.files[0], user.id);
    if (success) {
      toast({ title: "Success", description: "File uploaded successfully!" });
    }
    e.target.value = "";
  };

  const handleDelete = async (url: string) => {
    const { fullFileName } = getFileInfo(url);
    await deleteAttachment(fullFileName);
    toast({ title: "Success", description: "File deleted successfully!" });
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
      
      <div className="space-y-2">
        {attachmentUrls.length > 0 ? (
          attachmentUrls.map((url) => {
            const { displayName } = getFileInfo(url);
            return (
              <div key={url} className="flex items-center justify-between p-2 border rounded bg-gray-50">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-2 flex-1"
                >
                  <Download className="h-4 w-4" />
                  {displayName}
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(url)}
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
    </div>
  );
}
