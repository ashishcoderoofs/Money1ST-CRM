import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useCreateConsultant, useUpdateConsultant, type ConsultantData } from "@/hooks/useConsultantAPI";

// Import all the modular components
import { ConsultantBasicForm } from "./consultant-form/ConsultantBasicForm";
import { ConsultantContactForm } from "./consultant-form/ConsultantContactForm";
import { ConsultantPersonalForm } from "./consultant-form/ConsultantPersonalForm";
import { ConsultantCfsForm } from "./consultant-form/ConsultantCfsForm";
import { ConsultantLineageForm } from "./consultant-form/ConsultantLineageForm";
import { 
  consultantFormSchema, 
  type ConsultantFormValues, 
  type ConsultantFormProps 
} from "./consultant-form/types";

export function ConsultantFormApi({
  onSuccess,
  defaultValues,
  isEditMode = false,
  consultantId
}: ConsultantFormProps) {
  const [currentTab, setCurrentTab] = useState("contact");
  
  const createConsultant = useCreateConsultant();
  const updateConsultant = useUpdateConsultant();

  const form = useForm<ConsultantFormValues>({
    resolver: zodResolver(consultantFormSchema),
    defaultValues: {
      // Basic Information
      consultantId: "",
      entryDate: new Date().toISOString().split('T')[0],
      position: "",
      status: 'Active' as const,
      title: "",
      firstName: "",
      middleInitial: "",
      lastName: "",
      suffix: "",
      comment: "",
      remarks: "",
      
      // Contact Information
      email: "",
      maidenName: "",
      address: "",
      city: "",
      county: "",
      state: "",
      zipCode: "",
      homePhone: "",
      mobile: "",
      workPhone: "",
      otherPhone: "",
      fax: "",
      membershipType: "",
      amount: undefined,
      jointMemberName: "",

      // Personal Information
      dateOfBirth: "",
      maritalStatus: undefined,
      sex: undefined,
      race: "",
      spouseName: "",
      anniversary: "",
      spouseOccupation: "",
      educationLevel: undefined,
      driversLicenseNumber: "",
      driversLicenseState: "",
      employmentStatus: undefined,
      employer: "",
      occupation: "",
      industry: "",

      // CFS Information
      ssn: "",
      ein: "",
      hireDate: "",
      yearsWithFrq: undefined,
      companyName: "",
      cfsCertificationDate: "",
      effectiveDate: "",
      memberType: "",
      mbrAmt: undefined,
      payType: "",
      mpFee: undefined,
      cfsStatus: "",
      statusDate: "",

      // Emergency Contact
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
      ...defaultValues
    }
  });

  // Helper function to convert date values
  const convertDateToString = (date: any): string => {
    if (!date) return "";
    if (typeof date === 'string') return date;
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return "";
  };

  useEffect(() => {
    if (defaultValues) {
      const processedDefaultValues = {
        ...defaultValues,
        entryDate: convertDateToString(defaultValues.entryDate),
        dateOfBirth: convertDateToString(defaultValues.dateOfBirth),
        anniversary: convertDateToString(defaultValues.anniversary),
        hireDate: convertDateToString(defaultValues.hireDate),
        cfsCertificationDate: convertDateToString(defaultValues.cfsCertificationDate),
        effectiveDate: convertDateToString(defaultValues.effectiveDate),
        statusDate: convertDateToString(defaultValues.statusDate),
      };
      form.reset(processedDefaultValues);
    }
  }, [defaultValues, form]);

  const isLoading = createConsultant.isPending || updateConsultant.isPending;

  const handleFormSubmit = async (values: ConsultantFormValues) => {
    try {
      if (isEditMode && consultantId) {
        await updateConsultant.mutateAsync({
          id: consultantId,
          data: values as ConsultantData
        });
      } else {
        await createConsultant.mutateAsync(values as ConsultantData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by the hooks
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <ConsultantBasicForm form={form} />

        {/* Tabbed Sections */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="cfs">CFS Information</TabsTrigger>
            <TabsTrigger value="lineage">Lineage</TabsTrigger>
          </TabsList>

          <TabsContent value="contact">
            <ConsultantContactForm form={form} />
          </TabsContent>

          <TabsContent value="personal">
            <ConsultantPersonalForm form={form} />
          </TabsContent>

          <TabsContent value="cfs">
            <ConsultantCfsForm form={form} />
          </TabsContent>

          <TabsContent value="lineage">
            <ConsultantLineageForm form={form} />
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditMode ? "Update Consultant" : "Create Consultant"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Re-export the schema and types for backward compatibility
export { consultantFormSchema } from "./consultant-form/types";
export type { ConsultantFormValues } from "./consultant-form/types";
