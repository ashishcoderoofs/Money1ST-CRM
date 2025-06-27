
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApplicantDemographicsProps {
  form: any;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export function ApplicantDemographics({ form }: ApplicantDemographicsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">Demographic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="applicant_dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_ssn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SSN</FormLabel>
              <FormControl>
                <Input {...field} placeholder="SSN" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_birth_place"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Place</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
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
        <FormField
          control={form.control}
          name="applicant_marital_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Separated">Separated</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <FormField
          control={form.control}
          name="applicant_race"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Race</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="American Indian">American Indian</SelectItem>
                  <SelectItem value="Asian">Asian</SelectItem>
                  <SelectItem value="Black/African American">Black/African American</SelectItem>
                  <SelectItem value="Hispanic/Latino">Hispanic/Latino</SelectItem>
                  <SelectItem value="Native Hawaiian">Native Hawaiian</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Decline to Answer">Decline to Answer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_anniversary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anniversary</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_spouse_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spouse's Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Spouse's name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_spouse_occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spouse's Occupation</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Spouse's occupation" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <FormField
          control={form.control}
          name="applicant_dependents_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Count of Dependents</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="0" placeholder="0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
