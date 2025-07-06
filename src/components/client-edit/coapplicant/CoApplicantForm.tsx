import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface CoApplicantFormProps {
  form: any;
  client: Tables<"clients">;
}

export function CoApplicantForm({ form, client }: CoApplicantFormProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-700">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Mrs.">Mrs.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                      <SelectItem value="Dr.">Dr.</SelectItem>
                      <SelectItem value="Prof.">Prof.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coapplicant_first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter first name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coapplicant_mi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>M.I.</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="M.I." maxLength={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coapplicant_last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter last name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coapplicant_suffix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suffix</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select suffix" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Jr.">Jr.</SelectItem>
                      <SelectItem value="Sr.">Sr.</SelectItem>
                      <SelectItem value="II">II</SelectItem>
                      <SelectItem value="III">III</SelectItem>
                      <SelectItem value="IV">IV</SelectItem>
                      <SelectItem value="V">V</SelectItem>
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
              name="coapplicant_maiden_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maiden Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter maiden name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coapplicant_is_consultant"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 mt-6">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Is Consultant</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-700">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} type="email" placeholder="Enter email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coapplicant_cell_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cell Phone *</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter cell phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_home_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Phone</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter home phone" />
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
                    <Input {...field} value={field.value || ""} placeholder="Enter other phone" />
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
                    <Input {...field} value={field.value || ""} placeholder="Enter fax number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-700">Current Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address *</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter street address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coapplicant_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter city" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_county"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>County</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter county" />
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
                    <Input {...field} value={field.value || ""} placeholder="Enter state" />
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
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter zip code" />
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
                    <Input {...field} value={field.value || ""} placeholder="e.g., 2 years" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_previous_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Address</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter previous address" />
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
                    <Input {...field} value={field.value || ""} placeholder="e.g., 3 years" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Employment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-700">Employment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                      <Select onValueChange={field.onChange} value={field.value || ""}>
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
                    <Input {...field} value={field.value || ""} placeholder="Enter occupation" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_employer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter employer name" />
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
                    <Input {...field} value={field.value || ""} placeholder="Enter employer address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coapplicant_employer_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer Phone</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter employer phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_monthly_salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Salary</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="$0.00" />
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
                    <Input type="date" {...field} value={field.value || ""} />
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
                    <Input {...field} value={field.value || ""} placeholder="$0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coapplicant_additional_income_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Source</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter source" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-700">Demographics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coapplicant_ssn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SSN</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="xxx-xx-xxxx" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coapplicant_birth_place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Place</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter birth place" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_marital_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                      <SelectItem value="Separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coapplicant_race"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Race/Ethnicity</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select race/ethnicity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="American Indian or Alaska Native">American Indian or Alaska Native</SelectItem>
                      <SelectItem value="Asian">Asian</SelectItem>
                      <SelectItem value="Black or African American">Black or African American</SelectItem>
                      <SelectItem value="Hispanic or Latino">Hispanic or Latino</SelectItem>
                      <SelectItem value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</SelectItem>
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Two or More Races">Two or More Races</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to answer">Prefer not to answer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="coapplicant_anniversary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anniversary</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coapplicant_spouse_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spouse Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Enter spouse name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coapplicant_dependents_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Dependents</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} type="number" placeholder="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
