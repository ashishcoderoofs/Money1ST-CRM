
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tables } from "@/integrations/supabase/types";

interface IncomeProtectionTabProps {
  client: Tables<"clients">;
}

export function IncomeProtectionTab({ client }: IncomeProtectionTabProps) {
  const familyMembers = [
    { name: "BARACK H OBAMA", dob: "1/1/1962", sex: "63 M", relationship: "APPLICANT", ssn: "333-33-4533", ht: "0", wt: "", tobacco: "", quitDate: "", military: "", flyingHazard: "", dutyAircraft: "", rider: "", student: "", actions: "$" },
    { name: "MICHELLE R OBAMA", dob: "2/26/1964", sex: "59 F", relationship: "CO-APPLICANT", ssn: "782-72-4473", ht: "0", wt: "", tobacco: "", quitDate: "", military: "", flyingHazard: "", dutyAircraft: "", rider: "", student: "", actions: "$" },
    { name: "MALIA A OBAMA", dob: "9/12/1998", sex: "26 F", relationship: "DAUGHTER", ssn: "863-72-6279", ht: "0", wt: "", tobacco: "", quitDate: "", military: "", flyingHazard: "", dutyAircraft: "", rider: "", student: "", actions: "$" },
    { name: "SASHA A OBAMA", dob: "3/18/2000", sex: "24 F", relationship: "DAUGHTER", ssn: "737-26-1728", ht: "0", wt: "", tobacco: "", quitDate: "", military: "", flyingHazard: "", dutyAircraft: "", rider: "", student: "", actions: "$" },
    { name: "ASRA A AS", dob: "3/19/2000", sex: "24 F", relationship: "SON", ssn: "737-26-1728", ht: "", wt: "", tobacco: "", quitDate: "", military: "", flyingHazard: "", dutyAircraft: "", rider: "", student: "", actions: "$" },
  ];

  return (
    <div className="space-y-6">
      {/* Protection Information */}
      <Card>
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle>Income Protection</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Protection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Current Protection</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Provider</label>
                  <Input placeholder="Enter provider" />
                </div>
                <div>
                  <label className="text-sm font-medium">Face Amount</label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Term</label>
                  <Input placeholder="Enter term" />
                </div>
                <div>
                  <label className="text-sm font-medium">Monthly Premium</label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Annual Premium</label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
              </div>
            </div>

            {/* Proposed Protection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Proposed Protection</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Provider</label>
                  <Input placeholder="Enter provider" />
                </div>
                <div>
                  <label className="text-sm font-medium">Face Amount</label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Term</label>
                  <Input placeholder="Enter term" />
                </div>
                <div>
                  <label className="text-sm font-medium">Monthly Premium</label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Annual Premium</label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-blue-600 font-medium">Savings</span>
                  <div className="flex items-center justify-center mt-2">
                    <span className="mr-2">$</span>
                    <Input type="number" step="0.01" placeholder="0.00" className="text-center" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Details and Policy Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Application Details */}
        <Card>
          <CardHeader className="bg-teal-600 text-white">
            <CardTitle>Application Date</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Policy Number</label>
              <Input placeholder="Policy Number" />
            </div>
            <div>
              <label className="text-sm font-medium">Issue Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Disclosure Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium"># of Units</label>
              <Input type="number" placeholder="0" />
            </div>
          </CardContent>
        </Card>

        {/* Policy Status */}
        <Card>
          <CardHeader className="bg-purple-600 text-white">
            <CardTitle>Policy Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Status Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Processing Mgr</label>
              <Input placeholder="Processing Manager" />
            </div>
            <div>
              <label className="text-sm font-medium">DFT</label>
              <Input placeholder="DFT" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Gross Annual Premium (GAP)</label>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">DFT# →</label>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Family Members Table */}
      <Card>
        <CardHeader className="bg-green-600 text-white">
          <CardTitle>Family members proposed for coverage</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>DOB</TableHead>
                  <TableHead>Sex</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>SSN</TableHead>
                  <TableHead>Ht</TableHead>
                  <TableHead>Wt</TableHead>
                  <TableHead>Tobacco</TableHead>
                  <TableHead>Quit Date</TableHead>
                  <TableHead>Military</TableHead>
                  <TableHead>Flying/Hazard</TableHead>
                  <TableHead>Duty/Aircraft</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {familyMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.dob}</TableCell>
                    <TableCell>{member.sex}</TableCell>
                    <TableCell>{member.relationship}</TableCell>
                    <TableCell>{member.ssn}</TableCell>
                    <TableCell>{member.ht}</TableCell>
                    <TableCell>{member.wt}</TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{member.quitDate}</TableCell>
                    <TableCell>{member.military}</TableCell>
                    <TableCell>{member.flyingHazard}</TableCell>
                    <TableCell>{member.dutyAircraft}</TableCell>
                    <TableCell>{member.rider}</TableCell>
                    <TableCell>{member.student}</TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800">$</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Owner Information */}
      <Card>
        <CardHeader className="bg-orange-600 text-white">
          <CardTitle>Owner: (if different than applicant or if under age 18)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Owner</label>
              <Textarea placeholder="Enter owner information" className="min-h-[100px]" />
            </div>
            <div>
              <label className="text-sm font-medium">Relationship</label>
              <Textarea placeholder="Enter relationship" className="min-h-[100px]" />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Textarea placeholder="Enter address" className="min-h-[100px]" />
            </div>
            <div>
              <label className="text-sm font-medium">SSN:</label>
              <Input placeholder="Enter SSN" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Record:</span>
              <button className="px-2 py-1 border">{"<<"}</button>
              <button className="px-2 py-1 border">{"<"}</button>
              <span>1 of 1</span>
              <button className="px-2 py-1 border">{">"}</button>
              <button className="px-2 py-1 border">{">>"}</button>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-3 py-1 bg-gray-600 text-white text-sm">No Filter</button>
              <button className="px-3 py-1 bg-gray-800 text-white text-sm">Search</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
