import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

interface CoApplicantDemographicsProps {
  form: any;
  client: Tables<"clients">;
}

export function CoApplicantDemographics({ form, client }: CoApplicantDemographicsProps) {
  const updateCoApplicantDemographics = useUpdateCoApplicantDemographics();

  const handleSave = async () => {
    try {
      const formData = form.getValues();
      
      // Prepare data for backend API
      const demographicsData = {
        birthPlace: formData.coapplicant_birth_place,
        dateOfBirth: formData.coapplicant_date_of_birth ? new Date(formData.coapplicant_date_of_birth) : undefined,
        race: formData.coapplicant_race,
        maritalStatus: formData.coapplicant_marital_status,
        anniversary: formData.coapplicant_anniversary ? new Date(formData.coapplicant_anniversary) : undefined,
        spouseName: formData.coapplicant_spouse_name,
        spouseOccupation: formData.coapplicant_spouse_occupation,
        numberOfDependents: parseInt(formData.coapplicant_number_of_dependents) || 0
      };

      await updateCoApplicantDemographics.mutateAsync({
        clientId: client.id,
        data: demographicsData
      });

      toast.success("Co-applicant demographics information saved successfully");
    } catch (error) {
      console.error("Failed to save co-applicant demographics:", error);
      toast.error("Failed to save co-applicant demographics information");
    }
  };
  return (
    <div>
      <div className="bg-green-600 text-white px-4 py-2 mb-4">
        <h3 className="text-lg font-semibold">Demographic Information</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <FormField
          control={form.control}
          name="coapplicant_birth_place"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Place</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter birth place" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coapplicant_dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input {...field} type="date" placeholder="dd-mm-yyyy" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coapplicant_race"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Race</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="American Indian">American Indian</SelectItem>
                  <SelectItem value="Asian">Asian</SelectItem>
                  <SelectItem value="Black/African American">Black/African American</SelectItem>
                  <SelectItem value="Hispanic/Latino">Hispanic/Latino</SelectItem>
                  <SelectItem value="Native Hawaiian">Native Hawaiian</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Decline to Answer">Decline to Answer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <FormField
          control={form.control}
          name="coapplicant_marital_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Separated">Separated</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coapplicant_anniversary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anniversary</FormLabel>
              <FormControl>
                <Input {...field} type="date" placeholder="dd-mm-yyyy" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coapplicant_spouse_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spouse Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter spouse name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="coapplicant_spouse_occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spouse Occupation</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter spouse occupation" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coapplicant_number_of_dependents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Dependents</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="0" min="0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button 
          type="button" 
          onClick={handleSave}
          disabled={updateCoApplicantDemographics.isPending}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateCoApplicantDemographics.isPending ? "Saving..." : "Save Demographics Info"}
        </Button>
      </div>
    </div>
  );
}
