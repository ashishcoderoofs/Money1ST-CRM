
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MainInformationSectionProps {
  consultant: {
    _id: string;
    firstName: string;
    lastName: string;
    title?: string;
    middleInitial?: string;
    suffix?: string;
    position?: string;
    status: string;
    entryDate?: string;
    createdAt: string;
    comment?: string;
    remarks?: string;
    consultantId?: string;
  };
}

export function MainInformationSection({ consultant }: MainInformationSectionProps) {
  const getFullName = () => {
    const parts = [
      consultant.title && consultant.title !== 'placeholder' ? consultant.title : null,
      consultant.firstName,
      consultant.middleInitial,
      consultant.lastName,
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
            <span className="font-semibold">ConsultID:</span> {consultant.consultantId || `CON${consultant._id?.slice(-6)?.toUpperCase()}`}
          </div>
          <div>
            <span className="font-semibold">Entry Date:</span> {consultant.entryDate ? new Date(consultant.entryDate).toLocaleDateString() : new Date(consultant.createdAt).toLocaleDateString()}
          </div>
          <div>
            <span className="font-semibold">Position:</span> {consultant.position || 'N/A'}
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
