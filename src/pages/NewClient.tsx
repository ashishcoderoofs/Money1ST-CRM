
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { useClientForm } from "@/hooks/clients/useClientForm";
import { useCreateClient } from "@/hooks/clients/useClientMutations";
import { toast } from "sonner";
import { ClientEditTabs } from "@/components/client-edit/ClientEditTabs";
import { createMockClient } from "@/components/client-edit/MockClientData";

export default function NewClient() {
  const navigate = useNavigate();
  const { form } = useClientForm();
  const createMutation = useCreateClient();

  function onSubmit(values: any) {
    console.log("Creating new client with values:", values);
    createMutation.mutate(values, {
      onSuccess: (data) => {
        toast.success("Client created successfully.");
        navigate(`/securia/clients/${data.id}`);
      },
      onError: (err: any) => {
        console.error("Creation error:", err);
        toast.error("Failed to create client: " + err.message);
      },
    });
  }

  // Create a mock client object for the tabs (since they expect a client prop)
  const mockClient = createMockClient();

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ClientEditTabs 
            client={mockClient} 
            form={form} 
            isSubmitting={createMutation.isPending}
          />
        </form>
      </Form>
    </div>
  );
}
