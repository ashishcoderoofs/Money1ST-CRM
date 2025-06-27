
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export function ApplicantHouseholdMembers() {
  return (
    <Card>
      <CardHeader className="bg-gray-600 text-white flex flex-row items-center justify-between">
        <CardTitle>Applicant Household Members</CardTitle>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
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
              <tr>
                <td className="border border-gray-300 px-2 py-2">
                  <Input placeholder="First Name" className="border-0 shadow-none" />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <Input placeholder="MI" className="border-0 shadow-none w-16" />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <Input placeholder="Last Name" className="border-0 shadow-none" />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <Input type="date" className="border-0 shadow-none" />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <Input placeholder="Age" className="border-0 shadow-none w-20" />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <Input placeholder="SSN" className="border-0 shadow-none" />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <Select>
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
                  <Button size="sm" variant="destructive" className="w-8 h-8 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-2">
                  <Input placeholder="First Name" className="border-0 shadow-none" />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <Input placeholder="MI" className="border-0 shadow-none w-16" />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <Input placeholder="Last Name" className="border-0 shadow-none" />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <Input type="date" className="border-0 shadow-none" />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <Input placeholder="Age" className="border-0 shadow-none w-20" />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <Input placeholder="SSN" className="border-0 shadow-none" />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <Select>
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
                  <Button size="sm" variant="destructive" className="w-8 h-8 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
