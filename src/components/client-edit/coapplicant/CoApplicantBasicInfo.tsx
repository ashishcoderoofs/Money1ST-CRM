import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useUpdateCoApplicantBasicInfo } from "@/hooks/clients/useCoApplicantMutations";

interface CoApplicantBasicInfoProps {
  form: any;
  client: Tables<"clients">;
}

export function CoApplicantBasicInfo({ form, client }: CoApplicantBasicInfoProps) {
  const updateBasicInfo = useUpdateCoApplicantBasicInfo();

  const handleSave = async () => {
    const formData = form.getValues();
    const basicInfoData = {
      title: formData.coapplicant_title,
      firstName: formData.coapplicant_first_name,
      middleInitial: formData.coapplicant_mi,
      lastName: formData.coapplicant_last_name,
      suffix: formData.coapplicant_suffix,
      maidenName: formData.coapplicant_maiden_name,
      isConsultant: formData.coapplicant_is_consultant
    };

    await updateBasicInfo.mutateAsync({
      clientId: client.id,
      data: basicInfoData
    });
  };

  return (
    <div>
      <div className="bg-green-600 text-white px-4 py-2 mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Name Information</h3>
        <Button
          type="button"
          onClick={handleSave}
          disabled={updateBasicInfo.isPending}
          size="sm"
          className="bg-white text-green-600 hover:bg-gray-100"
        >
          <Save className="w-4 h-4 mr-1" />
          {updateBasicInfo.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
      
      <div className="grid grid-cols-5 gap-4 mb-4">
        <FormField
          control={form.control}
          name="coapplicant_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select title" />
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
        
        <FormField
          control={form.control}
          name="coapplicant_first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="Enter first name" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coapplicant_mi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Initial</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="M" maxLength={1} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coapplicant_last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="Enter last name" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coapplicant_suffix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suffix</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select suffix" />
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
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="coapplicant_maiden_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maiden Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="Enter maiden name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coapplicant_is_consultant"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-6">
              <FormControl>
                <Checkbox 
                  checked={field.value || false} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">Is Consultant</FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
