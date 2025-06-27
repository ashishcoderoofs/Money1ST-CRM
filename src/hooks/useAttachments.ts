
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * useAttachments
 * handles upload, list, and delete of attachment files for a specific record (e.g., client/note/deal)
 *
 * @param {string} recordId - The ID of the parent entity (e.g., clientId, contactId, dealId)
 * @param {string} category - A string tag (e.g., "note", "contact", "deal") to namespace files
 */
export function useAttachments(recordId: string, category: string) {
  const [uploading, setUploading] = useState(false);
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // List files
  const listAttachments = async () => {
    if (!recordId) return;
    const { data, error } = await supabase.storage
      .from("crm-attachments")
      .list(`${category}/${recordId}`, { limit: 50, offset: 0 });
    if (error) {
      setError(error.message);
      return [];
    }
    setAttachmentUrls(
      data?.map((f) => supabase.storage.from("crm-attachments").getPublicUrl(`${category}/${recordId}/${f.name}`).data.publicUrl)
        .filter(Boolean) ?? []
    );
    return data ?? [];
  };

  // Upload file
  const uploadAttachment = async (file: File, userId: string) => {
    setUploading(true);
    setError(null);
    const filePath = `${category}/${recordId}/${Date.now()}-${file.name}`;
    let { error } = await supabase.storage
      .from("crm-attachments")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
        // set created_by in metadata for RLS enforcement later
        metadata: { created_by: userId }
      });
    setUploading(false);
    if (error) {
      setError(error.message);
      return false;
    }
    await listAttachments();
    return true;
  };

  // Delete file
  const deleteAttachment = async (fileName: string) => {
    const { error } = await supabase.storage
      .from("crm-attachments")
      .remove([`${category}/${recordId}/${fileName}`]);
    if (error) setError(error.message);
    await listAttachments();
  };

  return {
    uploading,
    attachmentUrls,
    error,
    uploadAttachment,
    deleteAttachment,
    listAttachments,
    setAttachmentUrls
  };
}
