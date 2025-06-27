
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApplicantEmploymentBasicProps {
  form: any;
}

export function ApplicantEmploymentBasic({ form }: ApplicantEmploymentBasicProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <FormField
        control={form.control}
        name="applicant_employment_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employment Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="self-employed">Self-Employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="applicant_business_owner"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Owner</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="applicant_employer_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employer/Business Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Employer name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="applicant_supervisor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supervisor</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Supervisor name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
