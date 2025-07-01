
import { useNavigate } from "react-router-dom";
import { ConsultantFormApi } from "@/components/ConsultantFormApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export default function NewConsultant() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/securia/consultants");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Add New Consultant</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Consultant Information</CardTitle>
          <CardDescription>
            Fill out the form below to create a new consultant profile. An invitation email with a temporary password will be sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConsultantFormApi onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
