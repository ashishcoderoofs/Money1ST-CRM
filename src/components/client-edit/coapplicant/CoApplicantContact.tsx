
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CoApplicantContactProps {
  form: any;
}

export function CoApplicantContact({ form }: CoApplicantContactProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">Contact Information</h3>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="coapplicant_contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Mobile phone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coapplicant_home_phone"
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
          name="coapplicant_other_phone"
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
          name="coapplicant_fax"
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
          name="coapplicant_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Email address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
