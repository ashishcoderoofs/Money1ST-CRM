
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ApplicantEmploymentDetailsProps {
  form: any;
}

export function ApplicantEmploymentDetails({ form }: ApplicantEmploymentDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <FormField
        control={form.control}
        name="applicant_employer_zip"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zip Code</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Zip code" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="applicant_occupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occupation</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Occupation" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="applicant_employer_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employer Phone</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Employer phone" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
