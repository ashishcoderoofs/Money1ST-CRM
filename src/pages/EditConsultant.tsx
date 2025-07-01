import { useNavigate, useParams } from "react-router-dom";
import { useConsultant } from "@/hooks/useConsultantAPI";
import { ConsultantFormApi } from "@/components/ConsultantFormApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditConsultant() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading: isLoadingConsultant } = useConsultant(id ?? null);

  const consultant = response?.data;

  if (isLoadingConsultant) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Edit Consultant Profile</h2>
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    );
  }

  if (!consultant) {
    return <div>Consultant not found.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Edit Consultant Profile</h2>
      <ConsultantFormApi
        onSuccess={() => navigate("/securia/consultants")}
        defaultValues={consultant}
        isEditMode={true}
        consultantId={id}
      />
    </div>
  );
}
