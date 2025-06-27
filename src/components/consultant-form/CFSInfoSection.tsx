
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ConsultantFormValues } from "@/components/ConsultantForm";

interface CFSInfoSectionProps {
  form: UseFormReturn<ConsultantFormValues>;
}

export function CFSInfoSection({ form }: CFSInfoSectionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="ssn"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SSN</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="ein"
        render={({ field }) => (
          <FormItem>
            <FormLabel>EIN</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="hire_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hire Date</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="years_with_frq"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Years with FRQ</FormLabel>
            <FormControl>
              <Input {...field} type="number" onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cfs_certification_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CFS Certification Date</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="effective_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Effective Date</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="member_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Member Type</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="mbr_amt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mbr Amt</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.01" onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="pay_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pay Type</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="mp_fee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>MP/Fee</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.01" onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cfs_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status Date</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
