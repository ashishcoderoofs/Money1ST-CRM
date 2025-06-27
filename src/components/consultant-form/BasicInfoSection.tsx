
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ConsultantFormValues } from "@/components/ConsultantForm";

interface BasicInfoSectionProps {
  form: UseFormReturn<ConsultantFormValues>;
  isEditMode?: boolean;
  consultants: any[];
}

export function BasicInfoSection({ form, isEditMode = false, consultants }: BasicInfoSectionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <Input {...field} type="email" disabled={isEditMode} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="IBA">IBA</SelectItem>
                <SelectItem value="Senior Associate">Senior Associate</SelectItem>
                <SelectItem value="Managing Associate">Managing Associate</SelectItem>
                <SelectItem value="Senior Managing Associate">Senior Managing Associate</SelectItem>
                <SelectItem value="Principal">Principal</SelectItem>
                <SelectItem value="Senior Principal">Senior Principal</SelectItem>
                <SelectItem value="Vice President">Vice President</SelectItem>
                <SelectItem value="Senior Vice President">Senior Vice President</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="manager_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Manager (Upline)</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value || 'no-manager'}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no-manager">No Manager</SelectItem>
                {consultants?.map((consultant) => (
                  <SelectItem key={consultant.id} value={consultant.id}>
                    {[consultant.first_name, consultant.last_name].filter(Boolean).join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
