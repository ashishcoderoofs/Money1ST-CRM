
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { useClientForm } from "@/hooks/clients/useClientForm";
import { useCreateClient } from "@/hooks/clients/useClientMutations";
import { toast } from "sonner";
import { ClientEditTabs } from "@/components/client-edit/ClientEditTabs";
import { NewClientHeader } from "@/components/client-edit/NewClientHeader";
import { NewClientActions } from "@/components/client-edit/NewClientActions";
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
    <div className="w-full mt-6 space-y-6">
      <NewClientHeader />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ClientEditTabs client={mockClient} form={form} />
          <NewClientActions isSubmitting={createMutation.isPending} />
        </form>
      </Form>
    </div>
  );
}
