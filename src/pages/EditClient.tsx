import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClientEditTabs } from "@/components/client-edit/ClientEditTabs";
import { Loader2, Eye } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useSecuriaClient, useUpdateSecuriaClient } from "@/hooks/useSecuriaClients";

export default function EditClient() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSecuriaClient(clientId || "");
  const [client, setClient] = useState(data?.data || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateClientMutation = useUpdateSecuriaClient();

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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!client || !client._id) throw new Error("Missing client ID");
      // Remove fields that should not be updated
      const { _id, createdAt, updatedAt, ...update } = client;
      await updateClientMutation.mutateAsync({ id: client._id, update });
      toast.success("Client updated successfully!");
      navigate(`/securia/clients/${client._id}`);
    } catch (err: any) {
      toast.error("Failed to update client: " + (err?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-6 relative">
        <div className="sticky top-0 z-20 flex justify-end bg-gray-50 pt-2 pb-2" style={{ right: 0 }}>
          <button
            type="submit"
            className="h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Client"}
          </button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Edit Client: {client.clientId || client._id}</h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/securia/clients/${client._id}`)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Mode
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/securia/clients")}
            >
              Back to Clients
            </Button>
          </div>
        </div>
        <ClientEditTabs
          client={client}
          setClient={setClient}
          isSubmitting={isSubmitting}
          isEditMode={true}
        />
      </form>
    </div>
  );
}
