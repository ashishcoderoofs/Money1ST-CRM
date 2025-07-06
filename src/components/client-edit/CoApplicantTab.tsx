
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/integrations/supabase/types";
import { useState } from "react";
import { CoApplicantForm } from "./coapplicant/CoApplicantForm";

interface CoApplicantTabProps {
  client: Tables<"clients">;
  form: any;
}

export function CoApplicantTab({ client, form }: CoApplicantTabProps) {
  const [includeCoApplicant, setIncludeCoApplicant] = useState(false);

  return (
    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-blue-800 text-lg">Co-Applicant Information</h3>
        <div className="space-y-2 flex items-center space-x-2">
          <FormField
            control={form.control}
            name="include_co_applicant"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={includeCoApplicant}
                    onCheckedChange={(checked) => {
                      setIncludeCoApplicant(checked as boolean);
                      field.onChange(checked);
                    }}
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium">Include Co-Applicant</FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {!includeCoApplicant ? (
        <p className="text-gray-600 text-center py-8">
          Enable "Include Co-Applicant" toggle to add co-applicant information.
        </p>
      ) : (
        <div className="space-y-6">
          <CoApplicantForm form={form} client={client} />
        </div>
      )}
    </div>
  );
}
