import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ClientForm from "@/components/client/ClientFormTabs";
import { Loader2, Eye } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useClient, useUpdateClient } from "@/hooks/useSecuriaClients";

export default function EditClient() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useClient(clientId || "");
  const [client, setClient] = useState(data?.data || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateClientMutation = useUpdateClient();

  // Update local state when data loads
  React.useEffect(() => {
    if (data?.data) setClient(data.data);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (error || !client) {
    return <div className="p-6">Client not found.</div>;
  }

  async function handleSave(updatedClient: any) {
    setIsSubmitting(true);
    try {
      if (!updatedClient || !updatedClient._id) throw new Error("Missing client ID");
      // Remove fields that should not be updated
      const { _id, createdAt, updatedAt, ...update } = updatedClient;
      await updateClientMutation.mutateAsync({ id: updatedClient._id, update });
      toast.success("Client updated successfully!");
      navigate(`/securia/clients/${updatedClient._id}`);
    } catch (err: any) {
      toast.error("Failed to update client: " + (err?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <ClientForm
        mode="edit"
        clientData={client}
        onSave={handleSave}
        onCancel={() => navigate(`/securia/clients/${client._id}`)}
        onBack={() => navigate("/securia/clients")}
      />
    </div>
  );
}
