
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface DriversTabProps {
  client: Tables<"clients">;
}

export function DriversTab({ client }: DriversTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="bg-blue-600 text-white text-center">
          <CardTitle className="text-xl">Vehicle Coverage</CardTitle>
          <div className="text-lg">Drivers</div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-sm font-medium mb-4">Complete for all Household Members</div>
          
          {/* Drivers Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left text-sm font-medium">Full Name</th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-medium">DOB</th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-medium">Age</th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-medium">Relationship</th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-medium">SSN</th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-medium">Sex</th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-medium">Marital Sta</th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-medium">Driving Status</th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-medium">License</th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-medium">St</th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-medium">Accidents/Vi</th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-medium">Explain</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample rows based on the image */}
                <tr className="bg-yellow-100">
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="BARACK H OBAMA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="barack-obama">BARACK H OBAMA</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input type="date" defaultValue="1962-01-01" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="63" readOnly className="w-full bg-gray-50" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="APPLICANT" readOnly className="w-full bg-gray-50" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="333-33-8293" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="M" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="licensed">Licensed</SelectItem>
                        <SelectItem value="not-licensed">Not Licensed</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IL">IL</SelectItem>
                        <SelectItem value="CA">CA</SelectItem>
                        <SelectItem value="TX">TX</SelectItem>
                        <SelectItem value="NY">NY</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="0" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input placeholder="Explain..." className="w-full" />
                  </td>
                </tr>
                
                <tr>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="MICHELLE R OBAMA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="michelle-obama">MICHELLE R OBAMA</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input type="date" defaultValue="1966-02-26" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="59" readOnly className="w-full bg-gray-50" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="CO-APPLICANT" readOnly className="w-full bg-gray-50" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="762-73-8373" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="F" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="licensed">Licensed</SelectItem>
                        <SelectItem value="not-licensed">Not Licensed</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IL">IL</SelectItem>
                        <SelectItem value="CA">CA</SelectItem>
                        <SelectItem value="TX">TX</SelectItem>
                        <SelectItem value="NY">NY</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="0" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input placeholder="Explain..." className="w-full" />
                  </td>
                </tr>

                {/* Additional sample rows for daughters */}
                <tr>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="MALIA P OBAMA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="malia-obama">MALIA P OBAMA</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input type="date" defaultValue="1998-09-12" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="26" readOnly className="w-full bg-gray-50" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="DAUGHTER" readOnly className="w-full bg-gray-50" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="363-73-6278" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="F" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="licensed">Licensed</SelectItem>
                        <SelectItem value="not-licensed">Not Licensed</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IL">IL</SelectItem>
                        <SelectItem value="CA">CA</SelectItem>
                        <SelectItem value="TX">TX</SelectItem>
                        <SelectItem value="NY">NY</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="0" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input placeholder="Explain..." className="w-full" />
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="SASHA A OBAMA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sasha-obama">SASHA A OBAMA</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input type="date" defaultValue="2000-03-19" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="25" readOnly className="w-full bg-gray-50" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="DAUGHTER" readOnly className="w-full bg-gray-50" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="737-28-3728" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="F" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="licensed">Licensed</SelectItem>
                        <SelectItem value="not-licensed">Not Licensed</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IL">IL</SelectItem>
                        <SelectItem value="CA">CA</SelectItem>
                        <SelectItem value="TX">TX</SelectItem>
                        <SelectItem value="NY">NY</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="0" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input placeholder="Explain..." className="w-full" />
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="ASDA A A5" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asda-a5">ASDA A A5</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input type="date" defaultValue="2000-03-19" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="25" readOnly className="w-full bg-gray-50" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="SON" readOnly className="w-full bg-gray-50" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="737-29-3729" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="F" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="licensed">Licensed</SelectItem>
                        <SelectItem value="not-licensed">Not Licensed</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IL">IL</SelectItem>
                        <SelectItem value="CA">CA</SelectItem>
                        <SelectItem value="TX">TX</SelectItem>
                        <SelectItem value="NY">NY</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input value="0" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input placeholder="Explain..." className="w-full" />
                  </td>
                </tr>

                {/* Empty row for new entries */}
                <tr>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Add New Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input type="date" className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input readOnly className="w-full bg-gray-50" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="F">F</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="licensed">Licensed</SelectItem>
                        <SelectItem value="not-licensed">Not Licensed</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IL">IL</SelectItem>
                        <SelectItem value="CA">CA</SelectItem>
                        <SelectItem value="TX">TX</SelectItem>
                        <SelectItem value="NY">NY</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input className="w-full" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input placeholder="Explain..." className="w-full" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <span>Record:</span>
              <button className="px-2 py-1 border">{"<<"}</button>
              <button className="px-2 py-1 border">{"<"}</button>
              <span>1 of 5</span>
              <button className="px-2 py-1 border">{">"}</button>
              <button className="px-2 py-1 border">{">>"}</button>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-3 py-1 bg-gray-600 text-white text-sm">No Filter</button>
              <button className="px-3 py-1 bg-gray-800 text-white text-sm">Search</button>
              <Input placeholder="Search..." className="w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
