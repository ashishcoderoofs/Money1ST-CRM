
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/integrations/supabase/types";

interface HomeownersTabProps {
  client: Tables<"clients">;
}

export function HomeownersTab({ client }: HomeownersTabProps) {
  return (
    <div className="space-y-6">
      {/* Current Coverage */}
      <Card>
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle>Current Coverage</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input placeholder="Enter address" />
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <Input placeholder="Enter city" />
            </div>
            <div>
              <label className="text-sm font-medium">State</label>
              <Input placeholder="Enter state" />
            </div>
            <div>
              <label className="text-sm font-medium">Provider</label>
              <Input placeholder="Insurance provider" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Premium</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Deductible</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Deductible" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">$500</SelectItem>
                  <SelectItem value="1000">$1,000</SelectItem>
                  <SelectItem value="2500">$2,500</SelectItem>
                  <SelectItem value="5000">$5,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Medical Payments</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Liability</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Liability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100000">$100,000</SelectItem>
                  <SelectItem value="300000">$300,000</SelectItem>
                  <SelectItem value="500000">$500,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposed Coverage */}
      <Card>
        <CardHeader className="bg-green-600 text-white">
          <CardTitle>Proposed Coverage</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Premium (Proposed)</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Deductible (Proposed)</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Deductible" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">$500</SelectItem>
                  <SelectItem value="1000">$1,000</SelectItem>
                  <SelectItem value="2500">$2,500</SelectItem>
                  <SelectItem value="5000">$5,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Medical Payments (Proposed)</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Liability (Proposed)</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Liability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100000">$100,000</SelectItem>
                  <SelectItem value="300000">$300,000</SelectItem>
                  <SelectItem value="500000">$500,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Savings</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Details */}
      <Card>
        <CardHeader className="bg-purple-600 text-white">
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">App Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Status Date</label>
              <Input type="date" />
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
              <label className="text-sm font-medium">Policy Number</label>
              <Input placeholder="Policy Number" />
            </div>
            <div>
              <label className="text-sm font-medium">DFT</label>
              <Input placeholder="DFT" />
            </div>
            <div>
              <label className="text-sm font-medium">DFT Number</label>
              <Input placeholder="DFT Number" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="homeowners-units" />
              <label htmlFor="homeowners-units" className="text-sm font-medium">Units</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Information */}
      <Card>
        <CardHeader className="bg-orange-600 text-white">
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Year Built</label>
              <Input type="number" placeholder="Year" />
            </div>
            <div>
              <label className="text-sm font-medium">Purchase Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Mortgage Balance</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Payment</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Mo Rental Income</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Square Footage</label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium">Property Value</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Housing Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-family">Single Family</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardHeader className="bg-indigo-600 text-white">
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Style</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ranch">Ranch</SelectItem>
                  <SelectItem value="colonial">Colonial</SelectItem>
                  <SelectItem value="split-level">Split Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Construction</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Construction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frame">Frame</SelectItem>
                  <SelectItem value="brick">Brick</SelectItem>
                  <SelectItem value="stone">Stone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Roof</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Roof Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shingle">Shingle</SelectItem>
                  <SelectItem value="tile">Tile</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Foundation</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Foundation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slab">Slab</SelectItem>
                  <SelectItem value="crawlspace">Crawlspace</SelectItem>
                  <SelectItem value="basement">Basement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Foundation %</label>
              <Input placeholder="0.00%" />
            </div>
            <div>
              <label className="text-sm font-medium">Sq Ft General Features</label>
              <Input placeholder="0.00%" />
            </div>
            <div>
              <label className="text-sm font-medium"># of Fireplaces</label>
              <Input type="number" defaultValue="0" />
            </div>
            <div>
              <label className="text-sm font-medium">Deck Sq. Footage</label>
              <Input type="number" defaultValue="0" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Features */}
      <Card>
        <CardHeader className="bg-teal-600 text-white">
          <CardTitle>Additional Features</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Open Porch Sq Ft</label>
              <Input type="number" defaultValue="0" />
            </div>
            <div>
              <label className="text-sm font-medium">Enclosed Porch Sq Ft</label>
              <Input type="number" defaultValue="0" />
            </div>
            <div>
              <label className="text-sm font-medium"># of Pets</label>
              <Input type="number" defaultValue="0" />
            </div>
            <div>
              <label className="text-sm font-medium"># of Car Garage can Hold</label>
              <Input type="number" defaultValue="0" />
            </div>
            <div>
              <label className="text-sm font-medium"># of Full Baths</label>
              <Input type="number" defaultValue="0" />
            </div>
            <div>
              <label className="text-sm font-medium"># of Half Baths</label>
              <Input type="number" defaultValue="0" />
            </div>
            <div>
              <label className="text-sm font-medium"># of Claims in the past 5 years</label>
              <Input type="number" defaultValue="0" />
            </div>
            <div>
              <label className="text-sm font-medium">Amt of Claims</label>
              <Input type="number" step="0.01" defaultValue="0.00" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yes/No Questions */}
      <Card>
        <CardHeader className="bg-red-600 text-white">
          <CardTitle>Property Questions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Owner Occupied</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Tenant Occupied</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Pool</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Trampoline</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Garage</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attached">Attached</SelectItem>
                  <SelectItem value="detached">Detached</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Self Loading Gate</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Offered for Sale in the last 12 months</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Re-financed in the past 12 months</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Business operated on the Premises</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Non Smoking Household</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Flood Policy</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader className="bg-gray-700 text-white">
          <CardTitle>Security Features</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Monitored Burglar Alarm</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Smoke Detector</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Monitored Fire Alarm</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">24 Hour Security Guard</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Deadbolt Locks</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Fire Extinguisher</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader className="bg-emerald-600 text-white">
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Hm Assoc Fee</label>
              <Input type="number" step="0.01" defaultValue="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Account Credit</label>
              <Input type="number" step="0.01" defaultValue="0.00" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Property */}
      <Card>
        <CardHeader className="bg-yellow-600 text-white">
          <CardTitle>Scheduled Property</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">#</label>
              <Input />
            </div>
            <div>
              <label className="text-sm font-medium">Property Description</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Description" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Value</label>
              <Input type="number" step="0.01" defaultValue="0.00" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span>Record:</span>
            <button className="px-2 py-1 border">{"<<"}</button>
            <button className="px-2 py-1 border">{"<"}</button>
            <span>1 of 1</span>
            <button className="px-2 py-1 border">{">"}</button>
            <button className="px-2 py-1 border">{">>"}</button>
            <label className="flex items-center ml-4">
              <input type="checkbox" className="mr-1" />
              No Filter
            </label>
            <button className="px-3 py-1 bg-gray-700 text-white">Search</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
