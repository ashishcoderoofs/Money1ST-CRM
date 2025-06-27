
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ConsultantFormValues } from "@/components/ConsultantForm";

interface EmergencyContactSectionProps {
  form: UseFormReturn<ConsultantFormValues>;
}

export function EmergencyContactSection({ form }: EmergencyContactSectionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="emergency_contact_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Emergency Contact Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="emergency_contact_relationship"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Emergency Contact Relationship</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="emergency_contact_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Emergency Contact Phone</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
