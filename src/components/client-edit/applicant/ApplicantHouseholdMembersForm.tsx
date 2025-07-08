
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface HouseholdMember {
  first_name: string;
  mi: string;
  last_name: string;
  date_of_birth: string;
  age: string;
  ssn: string;
  relationship: string;
}

interface ApplicantHouseholdMembersFormProps {
  form: any;
}

export function ApplicantHouseholdMembersForm({ form }: ApplicantHouseholdMembersFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "household_members"
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

  const calculateAge = (dob: string) => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  return (
    <Card>
      <CardHeader className="bg-gray-600 text-white flex flex-row items-center justify-between">
        <CardTitle>Applicant Household Members</CardTitle>
        <Button size="sm" type="button" onClick={addMember} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-1" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
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
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      placeholder="First Name"
                      className="border-0 shadow-none"
                      {...form.register(`household_members.${index}.first_name`)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      placeholder="MI"
                      className="border-0 shadow-none w-16"
                      {...form.register(`household_members.${index}.mi`)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      placeholder="Last Name"
                      className="border-0 shadow-none"
                      {...form.register(`household_members.${index}.last_name`)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="date"
                      className="border-0 shadow-none"
                      {...form.register(`household_members.${index}.date_of_birth`)}
                      onChange={(e) => {
                        form.setValue(`household_members.${index}.date_of_birth`, e.target.value);
                        form.setValue(`household_members.${index}.age`, calculateAge(e.target.value));
                      }}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      placeholder="Age"
                      className="border-0 shadow-none w-20"
                      readOnly
                      {...form.register(`household_members.${index}.age`)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      placeholder="SSN"
                      className="border-0 shadow-none"
                      {...form.register(`household_members.${index}.ssn`)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Select
                      onValueChange={(value) => 
                        form.setValue(`household_members.${index}.relationship`, value)
                      }
                      defaultValue={form.watch(`household_members.${index}.relationship`)}
                    >
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
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    {(() => {
                      const member = form.getValues(`household_members.${index}`);
                      const hasData = Object.values(member).some((v) => v && v !== "");
                      if (!hasData) {
                        return (
                          <Button 
                            size="sm" 
                            type="button"
                            variant="destructive" 
                            className="w-8 h-8 p-0"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        );
                      }
                      return (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              type="button"
                              variant="destructive" 
                              className="w-8 h-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Household Member?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This row contains data. Are you sure you want to remove this household member? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove(index)}>
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      );
                    })()}
                  </td>
                </tr>
              ))}
              {fields.length === 0 && (
                <tr>
                  <td colSpan={8} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                    No household members added. Click "Add Member" to add household members.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
