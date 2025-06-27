import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tables } from "@/integrations/supabase/types";
import { AttachmentUploader } from "@/components/attachments/AttachmentUploader";

interface NotesTabProps {
  client: Tables<"clients">;
}

export function NotesTab({ client }: NotesTabProps) {
  return (
    <Card>
      <CardHeader className="bg-cyan-500 text-white">
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Client Notes</label>
            <Textarea 
              className="mt-1" 
              rows={8}
              placeholder="Enter notes about this client..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Attachments</label>
            {/* Users can upload and see attachments for this client note */}
            <AttachmentUploader
              recordId={client.id}
              category="note"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
