
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApplicantEmploymentAddressProps {
  form: any;
}

export function ApplicantEmploymentAddress({ form }: ApplicantEmploymentAddressProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <FormField
        control={form.control}
        name="applicant_employer_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employer Address</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Employer address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="applicant_employer_city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input {...field} placeholder="City" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="applicant_employer_state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="ca">California</SelectItem>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="tx">Texas</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
