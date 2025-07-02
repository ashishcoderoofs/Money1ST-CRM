
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useClientByIdQuery } from "@/hooks/clients/useClientByIdQuery";
import { useClientForm } from "@/hooks/clients/useClientForm";
import { useLiabilitiesQuery } from "@/hooks/clients/useLiabilitiesQuery";
import { toast } from "sonner";
import { Loader2, Save, X, Eye } from "lucide-react";
import { ClientEditTabs } from "@/components/client-edit/ClientEditTabs";
import { useEffect } from "react";

export default function EditClient() {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: client, isLoading } = useClientByIdQuery(clientId);
  const { data: liabilities = [] } = useLiabilitiesQuery(clientId);
  const navigate = useNavigate();

  const { form, mutation } = useClientForm(client);

  // Update form with liabilities when they are loaded
  useEffect(() => {
    if (liabilities && liabilities.length > 0) {
      console.log("Setting liabilities in form:", liabilities);
      form.setValue("liabilities", liabilities);
    }
  }, [liabilities, form]);

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

  async function onSubmit(values: any) {
    console.log("=== FORM SUBMISSION HANDLER TRIGGERED ===");
    console.log("Submit button clicked at:", new Date().toISOString());
    console.log("Client ID available:", client?.id);
    console.log("Mutation state before submission:", {
      isPending: mutation.isPending,
      isError: mutation.isError,
      isSuccess: mutation.isSuccess,
      error: mutation.error
    });
    
    // Prevent multiple submissions
    if (mutation.isPending) {
      console.log("=== SUBMISSION BLOCKED - ALREADY PENDING ===");
      toast.error("Update already in progress, please wait...");
      return;
    }
    
    // Validate client ID
    if (!client?._id) {
      console.error("=== CRITICAL ERROR - NO CLIENT ID ===");
      toast.error("Cannot update: Client ID is missing");
      return;
    }
    
    console.log("=== STARTING FORM VALIDATION ===");
    
    try {
      // Trigger form validation
      const isValid = await form.trigger();
      console.log("Form validation result:", isValid);
      
      if (!isValid) {
        const errors = form.formState.errors;
        console.log("=== FORM VALIDATION FAILED ===");
        console.log("Form errors:", errors);
        
        // Find first error for user feedback
        const errorFields = Object.keys(errors);
        if (errorFields.length > 0) {
          const firstError = errors[errorFields[0]];
          const errorMessage = firstError?.message || `Please check the ${errorFields[0]} field`;
          console.log("First validation error:", errorMessage);
          toast.error(`Validation failed: ${errorMessage}`);
        } else {
          toast.error("Please check all required fields and try again");
        }
        return;
      }
      
      console.log("=== FORM VALIDATION PASSED ===");
      console.log("=== PREPARING MUTATION DATA ===");
      
      const mutationData = { ...values, id: client._id };
      console.log("Mutation data keys:", Object.keys(mutationData));
      console.log("Mutation data sample:", {
        id: mutationData.id,
        applicant: mutationData.applicant,
        co_applicant: mutationData.co_applicant,
        liabilities_count: mutationData.liabilities?.length || 0
      });
      
      console.log("=== CALLING MUTATION.MUTATE ===");
      
      // Execute the mutation with comprehensive error handling
      mutation.mutate(mutationData, {
        onSuccess: (data) => {
          console.log("=== MUTATION SUCCESS CALLBACK ===");
          console.log("Success data:", data);
          toast.success("Client updated successfully!");
          navigate(`/securia/clients/${client._id}`);
        },
        onError: (error: any) => {
          console.log("=== MUTATION ERROR CALLBACK ===");
          console.error("Mutation error details:", {
            error: error,
            message: error?.message,
            name: error?.name,
            stack: error?.stack,
            cause: error?.cause
          });
          
          // Enhanced error message based on error type
          let userMessage = "Failed to update client";
          
          if (error?.message) {
            if (error.message.includes("403") || error.message.includes("Forbidden")) {
              userMessage = "Access denied - you don't have permission to update this client";
            } else if (error.message.includes("401") || error.message.includes("Unauthorized")) {
              userMessage = "Authentication failed - please log in again";
            } else if (error.message.includes("404")) {
              userMessage = "Client not found - it may have been deleted";
            } else if (error.message.includes("network") || error.message.includes("fetch")) {
              userMessage = "Network error - please check your connection and try again";
            } else if (error.message.includes("Database")) {
              userMessage = error.message;
            } else {
              userMessage = `Update failed: ${error.message}`;
            }
          }
          
          console.error("Showing error toast:", userMessage);
          toast.error(userMessage);
        },
        onSettled: (data, error) => {
          console.log("=== MUTATION SETTLED CALLBACK ===");
          console.log("Settled with data:", !!data, "error:", !!error);
        }
      });
      
      console.log("=== MUTATION.MUTATE CALLED SUCCESSFULLY ===");
      
    } catch (validationError: any) {
      console.error("=== FORM VALIDATION EXCEPTION ===");
      console.error("Validation error details:", {
        error: validationError,
        message: validationError?.message,
        stack: validationError?.stack
      });
      toast.error("Form validation failed. Please try again.");
    }
  }

  return (
    <div className="w-full px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Client: {client.client_number}</h1>
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ClientEditTabs client={client} form={form} />
          
          {/* Action Buttons */}
          <div className="flex gap-3 justify-center py-6">
            <Button 
              type="submit" 
              disabled={mutation.isPending} 
              className="bg-gray-800 hover:bg-gray-900 px-8"
              onClick={(e) => {
                console.log("=== UPDATE BUTTON CLICKED ===");
                console.log("Button click event:", e);
                console.log("Form valid:", form.formState.isValid);
                console.log("Form errors:", form.formState.errors);
                console.log("Mutation pending:", mutation.isPending);
              }}
            >
              <Save className="w-4 h-4 mr-1" />
              {mutation.isPending ? "Updating..." : "Update Client"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/securia/clients/${client._id}`)}
              disabled={mutation.isPending}
              className="px-8"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
