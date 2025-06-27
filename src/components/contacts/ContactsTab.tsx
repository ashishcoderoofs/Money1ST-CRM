
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AttachmentUploader } from "@/components/attachments/AttachmentUploader";

interface ContactsTabProps {
  contact: { id: string; [key: string]: any };
}

export function ContactsTab({ contact }: ContactsTabProps) {
  return (
    <Card>
      <CardHeader className="bg-cyan-600 text-white">
        <CardTitle>Contact Attachments</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <AttachmentUploader recordId={contact.id} category="contact" />
      </CardContent>
    </Card>
  );
}
