
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ClientHeader({ client }: { client: any }) {
  const navigate = useNavigate();
  return (
    <Card className="p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <div className="text-lg font-bold">
          Client #{client.client_number} - {client.applicant}
        </div>
        <div className="text-muted-foreground">
          Status:{" "}
          <span
            className={`inline-block px-2 py-1 rounded text-xs ${
              client.status === "Open"
                ? "bg-green-100 text-green-900"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {client.status}
          </span>
        </div>
        <div className="text-xs mt-1">
          Entry Date: {client.entry_date}
        </div>
      </div>
      <Button
        variant="outline"
        onClick={() => navigate(`/securia/clients/${client.id}/edit`)}
        className="flex items-center gap-1"
      >
        <Pencil className="h-4 w-4" />
        Edit Applicant
      </Button>
    </Card>
  );
}
