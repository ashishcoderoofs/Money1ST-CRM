
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApplicantAddressProps {
  form: any;
}

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export function ApplicantAddress({ form }: ApplicantAddressProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">Contact & Current Address</h3>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="applicant_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="applicant_city"
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
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="applicant_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="applicant_zip_code"
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
          </div>
        </div>
        <FormField
          control={form.control}
          name="applicant_time_at_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How Long at Current Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. 3 years 5 months" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_previous_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previous Address (if less than 2 years at current residence)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Previous address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_previous_address_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How Long</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. 2 years" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
