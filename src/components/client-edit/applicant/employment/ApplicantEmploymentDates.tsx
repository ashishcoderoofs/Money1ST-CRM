
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ApplicantEmploymentDatesProps {
  form: any;
}

export function ApplicantEmploymentDates({ form }: ApplicantEmploymentDatesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <FormField
        control={form.control}
        name="applicant_start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="applicant_end_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Date</FormLabel>
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
