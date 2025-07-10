import { useNavigate } from "react-router-dom";
import ClientForm from "@/components/client/ClientFormTabs";
import { useCreateClient } from "@/hooks/useSecuriaClients";
import { toast } from "sonner";

export default function NewClient() {
  const navigate = useNavigate();
  const createClientMutation = useCreateClient();

  async function handleSave(newClient: any) {
    try {
      // Map top-level fields to snake_case for backend
      const payload = {
        ...newClient,
        entry_date: newClient.entryDate,
        payoff_amount: newClient.payoffAmount,
        consultant_name: newClient.consultantName,
        processor_name: newClient.processorName,
      };
      delete payload.entryDate;
      delete payload.payoffAmount;
      delete payload.consultantName;
      delete payload.processorName;
      const result = await createClientMutation.mutateAsync(payload);
      if (result?.data?._id) {
        toast.success("Client created successfully.");
        // Do not navigate here; let ClientFormTabs handle it after liabilities are created
        return result.data;
      } else {
        throw new Error("No client ID returned from API");
      }
    } catch (err: any) {
      toast.error("Failed to create client: " + (err?.message || "Unknown error"));
      return null;
    }
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <ClientForm
        mode="create"
        clientData={null}
        onSave={(data) => handleSave(data)}
        onCancel={() => navigate("/securia/clients")}
        onBack={() => navigate("/securia/clients")}
      />
    </div>
  );
}
