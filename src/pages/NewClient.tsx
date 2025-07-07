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
    console.log("🔄 FORM SUBMISSION STARTED");
    console.log("Creating new client with values:", values);
    console.log("Form validation state:", form.formState);
    console.log("Form errors:", form.formState.errors);
    
    // Transform boolean business_owner fields to strings for API compatibility
    const transformedValues = {
      ...values,
      applicant: `${values.applicant_first_name || ''} ${values.applicant_last_name || ''}`.trim() || '',
      co_applicant: `${values.coapplicant_first_name || ''} ${values.coapplicant_last_name || ''}`.trim() || '',
      applicant_business_owner: typeof values.applicant_business_owner === 'boolean' 
        ? (values.applicant_business_owner ? 'yes' : 'no') 
        : values.applicant_business_owner,
      coapplicant_business_owner: typeof values.coapplicant_business_owner === 'boolean' 
        ? (values.coapplicant_business_owner ? 'yes' : 'no') 
        : values.coapplicant_business_owner,
    };
    
    console.log("Transformed values for API:", transformedValues);
    
    createMutation.mutate(transformedValues, {
      onSuccess: (data) => {
        console.log("✅ Form submission onSuccess:", data);
        toast.success("Client created successfully.");
        navigate(`/securia/clients/${data.id}`);
      },
      onError: (err: any) => {
        console.error("❌ Form submission onError:", err);
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
        <form 
          onSubmit={(e) => {
            console.log("📝 FORM ONSUBMIT EVENT TRIGGERED");
            console.log("Event:", e);
            console.log("Form validation errors:", form.formState.errors);
            console.log("Form is valid:", form.formState.isValid);
            console.log("Form values:", form.getValues());
            
            return form.handleSubmit(onSubmit)(e);
          }} 
          className="space-y-6"
        >
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
