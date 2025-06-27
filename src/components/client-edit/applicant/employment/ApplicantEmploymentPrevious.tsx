
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ApplicantEmploymentPreviousProps {
  form: any;
}

export function ApplicantEmploymentPrevious({ form }: ApplicantEmploymentPreviousProps) {
  return (
    <div className="mt-6">
      <p className="text-sm font-medium mb-4">Complete if employed less than 2 years with current employer</p>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="applicant_previous_employer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Previous Employer</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Previous employer" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="applicant_previous_employer_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Previous employer address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="applicant_previous_occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Previous occupation" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="applicant_previous_employment_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="applicant_previous_employment_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
