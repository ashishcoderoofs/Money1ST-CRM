
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";

interface HouseholdMembersManagementProps {
  form: any;
  role: "applicant" | "coapplicant";
}

export function HouseholdMembersManagement({ form, role }: HouseholdMembersManagementProps) {
  const fieldName = role === "applicant" ? "household_members" : "coapplicant_household_members";
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName
  });

  const addMember = () => {
    append({
      first_name: "",
      last_name: "",
      relationship: "",
      age: "",
      sex: "",
      date_of_birth: "",
      monthly_income: "0",
      tobacco_user: "No",
      student: "No",
    });
  };

  const title = role === "coapplicant" ? "Co-Applicant Household Members" : "Household Members";

  return (
    <div className="space-y-4">
      <div className="bg-gray-600 text-white px-4 py-2 rounded-t flex justify-between items-center">
        <h3 className="font-medium">{title}</h3>
        <Button 
          type="button" 
          size="sm" 
          className="bg-white text-gray-600 hover:bg-gray-100"
          onClick={addMember}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Member
        </Button>
      </div>
      
      <div className="overflow-x-auto border border-gray-300 rounded-b">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">First Name</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">Last Name</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">Relationship</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">Age</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">Sex</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">Date of Birth</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">Monthly Income</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">Tobacco User</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">Student</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 ? (
              <tr>
                <td colSpan={10} className="border border-gray-300 px-4 py-6 text-center text-gray-500">
                  No household members added. Click "Add Member" to get started.
                </td>
              </tr>
            ) : (
              fields.map((field, index) => (
                <tr key={field.id} className="bg-white hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      {...form.register(`${fieldName}.${index}.first_name`)}
                      placeholder="First Name"
                      className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      {...form.register(`${fieldName}.${index}.last_name`)}
                      placeholder="Last Name"
                      className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Select
                      value={form.watch(`${fieldName}.${index}.relationship`) || ""}
                      onValueChange={(value) => form.setValue(`${fieldName}.${index}.relationship`, value)}
                    >
                      <SelectTrigger className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                        <SelectItem value="Spouse">Spouse</SelectItem>
                        <SelectItem value="Child">Child</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Sibling">Sibling</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      {...form.register(`${fieldName}.${index}.age`)}
                      type="number"
                      placeholder="Age"
                      min="0"
                      max="120"
                      className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Select
                      value={form.watch(`${fieldName}.${index}.sex`) || ""}
                      onValueChange={(value) => form.setValue(`${fieldName}.${index}.sex`, value)}
                    >
                      <SelectTrigger className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      {...form.register(`${fieldName}.${index}.date_of_birth`)}
                      type="date"
                      className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <div className="flex items-center">
                      <span className="text-sm mr-1">$</span>
                      <Input
                        {...form.register(`${fieldName}.${index}.monthly_income`, {
                          setValueAs: (value) => value === "" ? "0" : value
                        })}
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        className="h-8 text-sm border border-gray-300 bg-white text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Select
                      value={form.watch(`${fieldName}.${index}.tobacco_user`) || "No"}
                      onValueChange={(value) => form.setValue(`${fieldName}.${index}.tobacco_user`, value)}
                    >
                      <SelectTrigger className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Select
                      value={form.watch(`${fieldName}.${index}.student`) || "No"}
                      onValueChange={(value) => form.setValue(`${fieldName}.${index}.student`, value)}
                    >
                      <SelectTrigger className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="w-7 h-7 p-0 bg-red-600 hover:bg-red-700"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-3 h-3" />
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
