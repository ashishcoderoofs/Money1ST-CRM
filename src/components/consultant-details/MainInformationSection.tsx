
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MainInformationSectionProps {
  consultant: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    title: string | null;
    mi: string | null;
    suffix: string | null;
    role: string;
    status: string;
    created_at: string;
    comment: string | null;
    remarks: string | null;
  };
}

export function MainInformationSection({ consultant }: MainInformationSectionProps) {
  const getFullName = () => {
    const parts = [
      consultant.title && consultant.title !== 'placeholder' ? consultant.title : null,
      consultant.first_name,
      consultant.mi,
      consultant.last_name,
      consultant.suffix
    ].filter(Boolean);
    return parts.join(' ');
  };

  return (
    <Card>
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle>Main Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="font-semibold">ConsultID:</span> CON{consultant.id.slice(0, 3).toUpperCase()}
          </div>
          <div>
            <span className="font-semibold">Entry Date:</span> {new Date(consultant.created_at).toLocaleDateString()}
          </div>
          <div>
            <span className="font-semibold">Position:</span> {consultant.role}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {consultant.status}
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold">Name:</span> {getFullName() || "N/A"}
          </div>
          {consultant.comment && (
            <div className="md:col-span-3">
              <span className="font-semibold">Comment:</span> {consultant.comment}
            </div>
          )}
          {consultant.remarks && (
            <div className="md:col-span-3">
              <span className="font-semibold">Remarks:</span> {consultant.remarks}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
