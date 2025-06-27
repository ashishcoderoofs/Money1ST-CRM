
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ApplicantEmploymentIncomeProps {
  form: any;
}

export function ApplicantEmploymentIncome({ form }: ApplicantEmploymentIncomeProps) {
  return (
    <div className="space-y-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="applicant_monthly_salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gross Monthly Salary</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-gray-100 px-2 py-1 rounded-l border-r">
                    $
                  </span>
                  <Input 
                    {...field} 
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-12"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicant_additional_income"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Monthly Income</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-gray-100 px-2 py-1 rounded-l border-r">
                    $
                  </span>
                  <Input 
                    {...field} 
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-12"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="applicant_additional_income_source"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source of Additional Income</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-gray-100 px-2 py-1 rounded-l border-r text-xs">
                  SRC
                </span>
                <Input 
                  {...field} 
                  placeholder="e.g., Freelance, Rental Income" 
                  className="pl-14"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
