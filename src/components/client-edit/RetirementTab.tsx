
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface RetirementTabProps {
  client: Tables<"clients">;
}

export function RetirementTab({ client }: RetirementTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pension Information */}
        <Card>
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle>Pension Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Pension Amount:</label>
              <div className="flex items-center mt-1">
                <span className="mr-2">$</span>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Pension Info:</label>
              <Textarea 
                placeholder="Enter pension details..." 
                className="mt-1 min-h-[80px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Remarks:</label>
              <Textarea 
                placeholder="Enter remarks..." 
                className="mt-1 min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Investment Summary */}
        <Card>
          <CardHeader className="bg-green-600 text-white">
            <CardTitle>Investment Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Total Investment Value:</label>
              <div className="flex items-center mt-1">
                <span className="mr-2">$</span>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Total Qualified Accounts:</label>
              <div className="flex items-center mt-1">
                <span className="mr-2">$</span>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Total Non-Qualified Accounts:</label>
              <div className="flex items-center mt-1">
                <span className="mr-2">$</span>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Accounts */}
      <Card>
        <CardHeader className="bg-purple-600 text-white">
          <CardTitle>Investment Accounts</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Name of Account</th>
                  <th className="text-left p-2 font-medium">Investment Firm</th>
                  <th className="text-left p-2 font-medium">Account Balance</th>
                  <th className="text-left p-2 font-medium">Type of Investment Account</th>
                  <th className="text-left p-2 font-medium">Investment Type</th>
                  <th className="text-left p-2 font-medium">Ownership</th>
                  <th className="text-left p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">
                    <Input placeholder="Account name" />
                  </td>
                  <td className="p-2">
                    <Input placeholder="Investment firm" />
                  </td>
                  <td className="p-2">
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input type="number" step="0.01" placeholder="0.00" />
                    </div>
                  </td>
                  <td className="p-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="401k">401(k)</SelectItem>
                        <SelectItem value="ira">IRA</SelectItem>
                        <SelectItem value="roth">Roth IRA</SelectItem>
                        <SelectItem value="403b">403(b)</SelectItem>
                        <SelectItem value="pension">Pension</SelectItem>
                        <SelectItem value="annuity">Annuity</SelectItem>
                        <SelectItem value="brokerage">Brokerage</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Investment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stocks">Stocks</SelectItem>
                        <SelectItem value="bonds">Bonds</SelectItem>
                        <SelectItem value="mutual-funds">Mutual Funds</SelectItem>
                        <SelectItem value="etf">ETF</SelectItem>
                        <SelectItem value="cd">Certificate of Deposit</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Ownership" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="joint">Joint</SelectItem>
                        <SelectItem value="trust">Trust</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Button size="sm" variant="outline" className="mr-1">
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Income Sources */}
      <Card>
        <CardHeader className="bg-teal-600 text-white">
          <CardTitle>Additional Income Sources</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Income Source</th>
                  <th className="text-left p-2 font-medium">Amount</th>
                  <th className="text-left p-2 font-medium">Taxable?</th>
                  <th className="text-left p-2 font-medium">COLA Adjusted?</th>
                  <th className="text-left p-2 font-medium">Start Age</th>
                  <th className="text-left p-2 font-medium">End Age</th>
                  <th className="text-left p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">
                    <Input placeholder="Income source" />
                  </td>
                  <td className="p-2">
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input type="number" step="0.01" placeholder="0.00" />
                    </div>
                  </td>
                  <td className="p-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Input type="number" placeholder="Age" />
                  </td>
                  <td className="p-2">
                    <Input type="number" placeholder="Age" />
                  </td>
                  <td className="p-2">
                    <Button size="sm" variant="outline" className="mr-1">
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
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
