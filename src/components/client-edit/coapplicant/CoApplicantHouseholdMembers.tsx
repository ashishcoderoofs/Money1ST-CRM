
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";

interface CoApplicantHouseholdMembersProps {
  form: any;
}

export function CoApplicantHouseholdMembers({ form }: CoApplicantHouseholdMembersProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "coapplicant_household_members"
  });

  const addMember = () => {
    append({
      first_name: "",
      mi: "",
      last_name: "",
      date_of_birth: "",
      age: "",
      ssn: "",
      relationship: ""
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return "";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Co-Applicant Household Members</h3>
        <Button type="button" size="sm" className="bg-green-600 hover:bg-green-700" onClick={addMember}>
          <Plus className="w-4 h-4 mr-1" />
          Add Member
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">First Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">MI</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Last Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date of Birth</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
              <th className="border border-gray-300 px-4 py-2 text-left">SSN</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Relationship</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 ? (
              <tr>
                <td colSpan={8} className="border border-gray-300 px-4 py-4 text-center text-gray-500">
                  No household members added. Click "Add Member" to get started.
                </td>
              </tr>
            ) : (
              fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="border border-gray-300 px-2 py-2">
                    <FormField
                      control={form.control}
                      name={`coapplicant_household_members.${index}.first_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="First Name" 
                              className="border-0 shadow-none" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <FormField
                      control={form.control}
                      name={`coapplicant_household_members.${index}.mi`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="MI" 
                              className="border-0 shadow-none w-16" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <FormField
                      control={form.control}
                      name={`coapplicant_household_members.${index}.last_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Last Name" 
                              className="border-0 shadow-none" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <FormField
                      control={form.control}
                      name={`coapplicant_household_members.${index}.date_of_birth`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date" 
                              className="border-0 shadow-none"
                              onChange={(e) => {
                                field.onChange(e);
                                // Auto-calculate age when date changes
                                const age = calculateAge(e.target.value);
                                form.setValue(`coapplicant_household_members.${index}.age`, age);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <FormField
                      control={form.control}
                      name={`coapplicant_household_members.${index}.age`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Age" 
                              className="border-0 shadow-none w-20" 
                              readOnly
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <FormField
                      control={form.control}
                      name={`coapplicant_household_members.${index}.ssn`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="SSN" 
                              className="border-0 shadow-none" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <FormField
                      control={form.control}
                      name={`coapplicant_household_members.${index}.relationship`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <SelectTrigger className="border-0 shadow-none">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="spouse">Spouse</SelectItem>
                                <SelectItem value="child">Child</SelectItem>
                                <SelectItem value="parent">Parent</SelectItem>
                                <SelectItem value="sibling">Sibling</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Button 
                      type="button"
                      size="sm" 
                      variant="destructive" 
                      className="w-8 h-8 p-0"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
