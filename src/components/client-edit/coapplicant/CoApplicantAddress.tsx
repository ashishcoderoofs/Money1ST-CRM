
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CoApplicantAddressProps {
  form: any;
}

export function CoApplicantAddress({ form }: CoApplicantAddressProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">Current Address</h3>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="coapplicant_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Street address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="coapplicant_city"
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
            name="coapplicant_state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="State" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coapplicant_zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ZIP code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="coapplicant_county"
            render={({ field }) => (
              <FormItem>
                <FormLabel>County</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="County" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coapplicant_time_at_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time at Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 2 years" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="border-t pt-4 mt-4">
          <h4 className="text-md font-semibold mb-3">Previous Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_previous_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Previous address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coapplicant_previous_address_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time at Previous Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 3 years" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
