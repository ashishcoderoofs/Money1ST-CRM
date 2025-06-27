
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AttachmentUploader } from "@/components/attachments/AttachmentUploader";

interface DealsTabProps {
  deal: { id: string; [key: string]: any };
}

export function DealsTab({ deal }: DealsTabProps) {
  return (
    <Card>
      <CardHeader className="bg-cyan-700 text-white">
        <CardTitle>Deal Attachments</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <AttachmentUploader recordId={deal.id} category="deal" />
      </CardContent>
    </Card>
  );
}
