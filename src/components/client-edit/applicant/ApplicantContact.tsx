
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ApplicantContactProps {
  form: any;
}

export function ApplicantContact({ form }: ApplicantContactProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="applicant_home_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Home phone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter mobile phone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_other_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Other phone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_fax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fax</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Fax number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_email"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter email address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
