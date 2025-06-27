
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HouseholdMembersTable({
  members = [],
  client,
  role = "applicant",
}: {
  members?: any[];
  client?: any;
  role?: "applicant" | "coapplicant";
}) {
  // Parse household members from client data if available
  let householdMembers = members;
  
  if (client) {
    try {
      if (role === "coapplicant" && client.coapplicant_household_members_json) {
        householdMembers = JSON.parse(client.coapplicant_household_members_json);
      } else if (role === "applicant" && client.household_members_json) {
        householdMembers = JSON.parse(client.household_members_json);
      }
    } catch (error) {
      console.error("Error parsing household members:", error);
      householdMembers = [];
    }
  }

  const title = role === "coapplicant" ? "Co-Applicant Household Members" : "Household Members";

  // Calculate statistics
  const totalMembers = householdMembers?.length || 0;
  const totalMinors = householdMembers?.filter((member: any) => {
    const age = parseInt(member.age || "0");
    return age < 18;
  }).length || 0;
  const tobaccoUsers = householdMembers?.filter((member: any) => 
    member.tobacco_user === "Yes"
  ).length || 0;
  const students = householdMembers?.filter((member: any) => 
    member.student === "Yes"
  ).length || 0;
  
  const totalHouseholdIncome = householdMembers?.reduce((total: number, member: any) => {
    const income = parseFloat(member.monthly_income || "0");
    return total + income;
  }, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Main Household Members Section with Border */}
      <div className="border border-gray-200 rounded bg-gray-50">
        <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">
          {title}
        </div>
        
        <div className="p-3">
          <div className="bg-gray-600 text-white px-4 py-2 rounded-t">
            <h3 className="font-medium">Household Members</h3>
          </div>
          
          <div className="overflow-x-auto border border-gray-300 rounded-b">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">First Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">Last Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">Relationship</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">Age</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">Sex</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">Date of Birth</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">Monthly Income</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">Tobacco User</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">Student</th>
                </tr>
              </thead>
              <tbody>
                {householdMembers && householdMembers.length > 0 ? (
                  householdMembers.map((member: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 px-3 py-2">{member.first_name || ""}</td>
                      <td className="border border-gray-300 px-3 py-2">{member.last_name || ""}</td>
                      <td className="border border-gray-300 px-3 py-2">{member.relationship || ""}</td>
                      <td className="border border-gray-300 px-3 py-2">{member.age || ""}</td>
                      <td className="border border-gray-300 px-3 py-2">{member.sex || ""}</td>
                      <td className="border border-gray-300 px-3 py-2">{member.date_of_birth || ""}</td>
                      <td className="border border-gray-300 px-3 py-2">
                        {member.monthly_income ? `$${parseFloat(member.monthly_income).toFixed(2)}` : "$0.00"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          member.tobacco_user === "Yes" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}>
                          {member.tobacco_user || "No"}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 py-2">{member.student || "No"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="border border-gray-300 px-4 py-6 text-center text-gray-500">
                      No household members added.
                    </td>
                  </tr>
                )}
                {/* Total Row */}
                {householdMembers && householdMembers.length > 0 && (
                  <tr className="bg-gray-100 font-medium">
                    <td colSpan={6} className="border border-gray-300 px-3 py-2 text-right">
                      Total Household Income
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      ${totalHouseholdIncome.toFixed(2)}
                    </td>
                    <td colSpan={2} className="border border-gray-300"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Combined Household Statistics */}
      <Card>
        <CardHeader className="bg-gray-100 py-3">
          <CardTitle className="text-base font-medium">Combined Household Statistics</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Household Members</p>
              <p className="text-3xl font-bold text-blue-600">{totalMembers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Minors</p>
              <p className="text-3xl font-bold text-blue-600">{totalMinors}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Tobacco Users</p>
              <p className="text-3xl font-bold text-orange-600">{tobaccoUsers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Students</p>
              <p className="text-3xl font-bold text-blue-600">{students}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
