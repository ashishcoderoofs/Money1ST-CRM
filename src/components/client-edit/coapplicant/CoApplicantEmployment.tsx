
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CoApplicantEmploymentProps {
  form: any;
}

export function CoApplicantEmployment({ form }: CoApplicantEmploymentProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">Employment Information</h3>
      
      {/* Current Employment */}
      <div className="space-y-4 mb-6">
        <h4 className="text-md font-semibold">Current Employment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="coapplicant_employment_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Employed">Employed</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coapplicant_business_owner"
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
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="coapplicant_employer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employer Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Employer name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coapplicant_occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Job title/occupation" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Employer Address */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="coapplicant_employer_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employer Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Employer street address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_employer_city"
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
              name="coapplicant_employer_state"
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
              name="coapplicant_employer_zip"
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
        </div>

        {/* Employment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="coapplicant_employer_phone"
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
          <FormField
            control={form.control}
            name="coapplicant_start_date"
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
            name="coapplicant_end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (if applicable)</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Income Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="coapplicant_monthly_salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Salary</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" placeholder="Monthly salary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coapplicant_additional_income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Income</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" placeholder="Additional monthly income" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="coapplicant_additional_income_source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Income Source</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Source of additional income" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Previous Employment */}
      <div className="border-t pt-4">
        <h4 className="text-md font-semibold mb-3">Previous Employment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="coapplicant_previous_employer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Previous Employer</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Previous employer name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coapplicant_previous_occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Previous Occupation</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Previous job title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <FormField
            control={form.control}
            name="coapplicant_previous_employer_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Previous Employer Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Previous employer address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coapplicant_previous_employment_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment From</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coapplicant_previous_employment_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment To</FormLabel>
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
