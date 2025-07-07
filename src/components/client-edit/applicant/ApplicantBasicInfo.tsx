
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useUpdateApplicantBasicInfo } from "@/hooks/clients/useApplicantMutations";
import { toast } from "sonner";

interface ApplicantBasicInfoProps {
  form: any;
  client: Tables<"clients">;
}

export function ApplicantBasicInfo({ form, client }: ApplicantBasicInfoProps) {
  const updateApplicantBasicInfo = useUpdateApplicantBasicInfo();

  const handleSave = async () => {
    try {
      const formData = form.getValues();
      
      // Prepare data for backend API
      const applicantData = {
        title: formData.applicant_title,
        firstName: formData.applicant_first_name,
        mi: formData.applicant_mi,
        lastName: formData.applicant_last_name,
        suffix: formData.applicant_suffix,
        maidenName: formData.applicant_maiden_name,
        isConsultant: formData.applicant_is_consultant || false,
        homePhone: formData.applicant_home_phone,
        workPhone: formData.applicant_work_phone,
        cellPhone: formData.applicant_cell_phone,
        otherPhone: formData.applicant_other_phone,
        fax: formData.applicant_fax,
        email: formData.applicant_email
      };

      await updateApplicantBasicInfo.mutateAsync({
        clientId: client.id,
        data: applicantData
      });

      toast.success("Applicant basic information saved successfully");
    } catch (error) {
      console.error("Failed to save applicant basic info:", error);
      toast.error("Failed to save applicant basic information");
    }
  };
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="applicant_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                    <SelectItem value="Ms.">Ms.</SelectItem>
                    <SelectItem value="Dr.">Dr.</SelectItem>
                    <SelectItem value="Prof.">Prof.</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-3">
          <FormField
            control={form.control}
            name="applicant_first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-1">
          <FormField
            control={form.control}
            name="applicant_mi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MI</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-4">
          <FormField
            control={form.control}
            name="applicant_last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="applicant_suffix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suffix</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Jr.">Jr.</SelectItem>
                    <SelectItem value="Sr.">Sr.</SelectItem>
                    <SelectItem value="II">II</SelectItem>
                    <SelectItem value="III">III</SelectItem>
                    <SelectItem value="IV">IV</SelectItem>
                    <SelectItem value="V">V</SelectItem>
                    <SelectItem value="MD">MD</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="applicant_maiden_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maiden Name (if Different than Legal)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Maiden name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_is_consultant"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-6">
              <FormControl>
                <Checkbox 
                  checked={field.value || false} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">Is a consultant?</FormLabel>
            </FormItem>
          )}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button 
          type="button" 
          onClick={handleSave}
          disabled={updateApplicantBasicInfo.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateApplicantBasicInfo.isPending ? "Saving..." : "Save Basic Info"}
        </Button>
      </div>
    </div>
  );
}
