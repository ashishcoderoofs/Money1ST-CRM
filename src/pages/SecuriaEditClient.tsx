import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useClient } from "@/hooks/useSecuriaClients";
import { ArrowLeft, Save } from "lucide-react";

export default function EditClient() {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: clientResponse, isLoading } = useClient(clientId!);
  const client = clientResponse?.data;
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!client) {
    return <div className="p-6">Client not found.</div>;
  }

  const handleSave = () => {
    // TODO: Implement client update functionality
    console.log("Save client", client);
    navigate(`/securia/clients/${client._id}`);
  };

  return (
    <div className="w-full px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Client: {client.applicant?.first_name} {client.applicant?.last_name}</h1>
        <div className="flex gap-3">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/securia/clients/${client._id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to View
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Client Edit Form</h2>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Client editing functionality will be implemented here.</p>
          <p className="text-gray-400 text-sm mt-2">This will include form fields for updating client information.</p>
        </div>
      </div>
    </div>
  );
}
