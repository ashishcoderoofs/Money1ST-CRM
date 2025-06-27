
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ConsultantFormValues } from "@/components/ConsultantForm";

interface ContactInfoSectionProps {
  form: UseFormReturn<ConsultantFormValues>;
}

export function ContactInfoSection({ form }: ContactInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="maiden_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maiden or Other Name Used</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} value={field.value ?? ''} />
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
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tristan.mclean@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Main St" {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="county"
          render={({ field }) => (
            <FormItem>
              <FormLabel>County</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zip_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Phone</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobile_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="work_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="other_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="fax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fax</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="membership_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership Type</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="joint_member_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Joint Member's Name</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
