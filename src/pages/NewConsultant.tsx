
import { useNavigate } from "react-router-dom";
import { useCreateConsultant } from "@/hooks/consultant";
import { ConsultantForm, type ConsultantFormValues } from "@/components/ConsultantForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewConsultant() {
  const navigate = useNavigate();
  const createConsultantMutation = useCreateConsultant();

  const handleSubmit = (values: ConsultantFormValues) => {
    createConsultantMutation.mutate(
      {
        ...values,
        manager_id: values.manager_id === 'no-manager' ? null : values.manager_id,
      },
      {
        onSuccess: () => {
          navigate("/securia/consultants");
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Add New Consultant</h2>
      <Card>
        <CardHeader>
          <CardTitle>Consultant Information</CardTitle>
          <CardDescription>
            Fill out the form below to create a new consultant profile. An invitation email with a temporary password will be sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConsultantForm
            onSubmit={handleSubmit}
            isLoading={createConsultantMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
