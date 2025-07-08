import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { ClientEditTabs } from "@/components/client-edit/ClientEditTabs";
import { useState } from "react";
import { toast } from "sonner";
import type { Client } from "../types/mongodb-client";
import { useCreateSecuriaClient } from "@/hooks/useSecuriaClients";

// Initial empty client structure matching the new nested Client type
const initialClient: Client = {
  applicant: {},
  coApplicant: {},
  householdMembers: [],
};

// Helper to map frontend status to backend enum
function mapStatus(status: string | undefined) {
  if (!status) return "active";
  const s = status.toLowerCase();
  if (["active", "inactive", "draft", "submitted"].includes(s)) return s;
  if (s === "pending") return "draft";
  return "active";
}

export default function NewClient() {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client>(initialClient);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createClientMutation = useCreateSecuriaClient();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Ensure applicant email is present and non-null
      if (!client.applicant?.email) {
        toast.error("Applicant email is required.");
        setIsSubmitting(false);
        return;
      }
      const payload = {
        ...client,
        status: mapStatus(client.status),
        coApplicant: client.coApplicant?.includeCoApplicant ? client.coApplicant : undefined,
      };
      const result = await createClientMutation.mutateAsync(payload as any);
      if (result?.data?._id) {
        toast.success("Client created successfully.");
        navigate(`/securia/clients/${result.data._id}`);
      } else {
        throw new Error("No client ID returned from API");
      }
    } catch (err: any) {
      toast.error("Failed to create client: " + (err?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <Form>
        <form onSubmit={onSubmit} className="space-y-6 relative">
          <div className="sticky top-0 z-20 flex justify-end bg-gray-50 pt-2 pb-2" style={{ right: 0 }}>
            <button
              type="submit"
              className="h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Client"}
            </button>
          </div>
          <ClientEditTabs 
            client={client} 
            setClient={setClient}
            isSubmitting={isSubmitting}
            isEditMode={false}
          />
        </form>
      </Form>
    </div>
  );
}
