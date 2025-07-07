import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { useUpdateCoApplicantEmployment } from "@/hooks/clients/useUpdateCoApplicantEmployment";

interface CoApplicantEmploymentProps {
  form: any;
  client: Tables<"clients">;
}

export function CoApplicantEmployment({ form, client }: CoApplicantEmploymentProps) {
  const updateCoApplicantEmployment = useUpdateCoApplicantEmployment();

  const handleSave = async () => {
    try {
      const formData = form.getValues();
      
      // Prepare data for backend API
      const employmentData = {
        employment: {
          employmentStatus: formData.coapplicant_employment_status,
          isBusinessOwner: formData.coapplicant_business_owner || false,
          occupation: formData.coapplicant_occupation,
          employerName: formData.coapplicant_employer_name,
          employerAddress: formData.coapplicant_employer_address,
          employerCity: formData.coapplicant_employer_city,
          employerState: formData.coapplicant_employer_state,
          employerZipCode: formData.coapplicant_employer_zip,
          monthlyGrossSalary: parseFloat(formData.coapplicant_monthly_salary) || 0,
          startDate: formData.coapplicant_start_date ? new Date(formData.coapplicant_start_date) : undefined,
          endDate: formData.coapplicant_end_date ? new Date(formData.coapplicant_end_date) : undefined,
          supervisor: formData.coapplicant_supervisor,
          supervisorPhone: formData.coapplicant_supervisor_phone,
          additionalIncome: parseFloat(formData.coapplicant_additional_income) || 0,
          source: formData.coapplicant_additional_income_source
        },
        previousEmployment: {
          employerName: formData.coapplicant_previous_employer,
          employerAddress: formData.coapplicant_previous_employer_address,
          city: formData.coapplicant_previous_employer_city,
          state: formData.coapplicant_previous_employer_state,
          zipCode: formData.coapplicant_previous_employer_zip,
          occupation: formData.coapplicant_previous_occupation,
          fromDate: formData.coapplicant_previous_from_date ? new Date(formData.coapplicant_previous_from_date) : undefined,
          toDate: formData.coapplicant_previous_to_date ? new Date(formData.coapplicant_previous_to_date) : undefined
        }
      };

      await updateCoApplicantEmployment.mutateAsync({
        clientId: client.id,
        data: employmentData
      });

      toast.success("Co-applicant employment information saved successfully");
    } catch (error) {
      console.error("Failed to save co-applicant employment:", error);
      toast.error("Failed to save co-applicant employment information");
    }
  };
  return (
    <div className="space-y-6">
      {/* Current Employment Information */}
      <div>
        <h4 className="font-medium text-green-700 mb-3">Current Employment Information</h4>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-[400px]">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm text-black">Employment Status</div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="coapplicant_business_owner"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">Business Owner</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <FormField
                  control={form.control}
                  name="coapplicant_employment_status"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Employed">Employed</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                          <SelectItem value="Unemployed">Unemployed</SelectItem>
                          <SelectItem value="Retired">Retired</SelectItem>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Part-Time">Part-Time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="coapplicant_occupation"
              render={({ field }) => (
                <FormItem className="w-[400px]">
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="Enter occupation" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_employer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="Enter employer name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coapplicant_employer_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer Address</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="Enter employer address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coapplicant_employer_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="Enter city" />
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
                    <Input {...field} value={field.value || ''} placeholder="Enter state" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coapplicant_employer_zip_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="Enter zip code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coapplicant_monthly_salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gross Monthly Salary</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="$0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coapplicant_employment_start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coapplicant_employment_end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coapplicant_employment_supervisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="Enter supervisor name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coapplicant_employment_supervisor_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor Phone</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="Enter supervisor phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coapplicant_other_income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Income</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="$0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coapplicant_employment_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="Enter source" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Previous Employment */}
      <div>
        <h4 className="font-medium text-green-700 mb-3">Previous Employment</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <FormField
            control={form.control}
            name="coapplicant_previous_employer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employer Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="Enter employer name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_previous_employer_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employer Address</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="Enter employer address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_previous_employer_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="Enter city" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_previous_employer_state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AL">Alabama</SelectItem>
                    <SelectItem value="AK">Alaska</SelectItem>
                    <SelectItem value="AZ">Arizona</SelectItem>
                    <SelectItem value="AR">Arkansas</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="CO">Colorado</SelectItem>
                    <SelectItem value="CT">Connecticut</SelectItem>
                    <SelectItem value="DE">Delaware</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="HI">Hawaii</SelectItem>
                    <SelectItem value="ID">Idaho</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="IN">Indiana</SelectItem>
                    <SelectItem value="IA">Iowa</SelectItem>
                    <SelectItem value="KS">Kansas</SelectItem>
                    <SelectItem value="KY">Kentucky</SelectItem>
                    <SelectItem value="LA">Louisiana</SelectItem>
                    <SelectItem value="ME">Maine</SelectItem>
                    <SelectItem value="MD">Maryland</SelectItem>
                    <SelectItem value="MA">Massachusetts</SelectItem>
                    <SelectItem value="MI">Michigan</SelectItem>
                    <SelectItem value="MN">Minnesota</SelectItem>
                    <SelectItem value="MS">Mississippi</SelectItem>
                    <SelectItem value="MO">Missouri</SelectItem>
                    <SelectItem value="MT">Montana</SelectItem>
                    <SelectItem value="NE">Nebraska</SelectItem>
                    <SelectItem value="NV">Nevada</SelectItem>
                    <SelectItem value="NH">New Hampshire</SelectItem>
                    <SelectItem value="NJ">New Jersey</SelectItem>
                    <SelectItem value="NM">New Mexico</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="ND">North Dakota</SelectItem>
                    <SelectItem value="OH">Ohio</SelectItem>
                    <SelectItem value="OK">Oklahoma</SelectItem>
                    <SelectItem value="OR">Oregon</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="RI">Rhode Island</SelectItem>
                    <SelectItem value="SC">South Carolina</SelectItem>
                    <SelectItem value="SD">South Dakota</SelectItem>
                    <SelectItem value="TN">Tennessee</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="UT">Utah</SelectItem>
                    <SelectItem value="VT">Vermont</SelectItem>
                    <SelectItem value="VA">Virginia</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                    <SelectItem value="WV">West Virginia</SelectItem>
                    <SelectItem value="WI">Wisconsin</SelectItem>
                    <SelectItem value="WY">Wyoming</SelectItem>
                    <SelectItem value="DC">District of Columbia</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_previous_employer_zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="Enter zip code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_previous_employment_occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="Enter occupation" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_previous_employment_from_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_previous_employment_to_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} />
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
