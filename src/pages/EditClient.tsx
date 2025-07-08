import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClientEditTabs } from "@/components/client-edit/ClientEditTabs";
import { Loader2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Client } from "../types/mongodb-client";

// Dummy fetch function (replace with your real API call)
async function fetchClientById(clientId: string): Promise<Client | null> {
  // TODO: Replace with actual API call
  return null;
}

export default function EditClient() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    setIsLoading(true);
    fetchClientById(clientId)
      .then((data) => {
        setClient(data);
      })
      .finally(() => setIsLoading(false));
  }, [clientId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (!client) {
    return <div className="p-6">Client not found.</div>;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call to update client
      // await api.updateClient(client._id, client);
      toast.success("Client updated successfully!");
      // Optionally navigate back to view mode
      // navigate(`/securia/clients/${client._id}`);
    } catch (err: any) {
      toast.error("Failed to update client: " + (err?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
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
      <form onSubmit={onSubmit} className="space-y-6">
        <ClientEditTabs
          client={client}
          setClient={setClient}
          isSubmitting={isSubmitting}
          isEditMode={true}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Client"}
          </button>
        </div>
      </form>
    </div>
  );
}
