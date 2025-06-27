
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";

interface RentersTabProps {
  client: Tables<"clients">;
}

export function RentersTab({ client }: RentersTabProps) {
  return (
    <div className="space-y-6">
      {/* Current and Proposed Coverage */}
      <Card>
        <CardHeader className="bg-teal-600 text-white">
          <CardTitle>Coverage Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Coverage */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Current</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Carrier</label>
                  <Input placeholder="Enter carrier" />
                </div>
                <div>
                  <label className="text-sm font-medium">Premium</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Expiration Date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium">Savings</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
            </div>

            {/* Proposed Coverage */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Proposed</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Carrier</label>
                  <Input placeholder="Enter carrier" />
                </div>
                <div>
                  <label className="text-sm font-medium">Premium</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Expiration Date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium">Savings</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Information */}
      <Card>
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle>Property Information</CardTitle>
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
              <label className="text-sm font-medium">Year Built</label>
              <Input type="number" placeholder="Year" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Yr. at Current Address</label>
              <Input type="number" placeholder="Years" />
            </div>
            <div>
              <label className="text-sm font-medium">Apt/Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="townhome">Townhome</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium"># of Stories</label>
              <Input type="number" placeholder="1" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Sq. Footage</label>
              <Input type="number" placeholder="0" />
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
                  <SelectItem value="concrete">Concrete</SelectItem>
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
                  <SelectItem value="flat">Flat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Garage</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Garage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attached">Attached</SelectItem>
                  <SelectItem value="detached">Detached</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
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
              <label className="text-sm font-medium">Issue Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Disclosure</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Policy No.</label>
              <Input placeholder="Policy Number" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">DFT</label>
              <Input placeholder="DFT" />
            </div>
            <div>
              <label className="text-sm font-medium">DFT #</label>
              <Input placeholder="DFT Number" />
            </div>
            <div>
              <label className="text-sm font-medium">GAP</label>
              <Input placeholder="GAP" />
            </div>
            <div>
              <label className="text-sm font-medium">Units</label>
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

      {/* Rent Status */}
      <Card>
        <CardHeader className="bg-green-600 text-white">
          <CardTitle>Rent Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Rent Status</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="behind">Behind</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Status Date</label>
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coverage Details */}
      <Card>
        <CardHeader className="bg-orange-600 text-white">
          <CardTitle>Coverage Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Coverage Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Current Coverage</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Deductible</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Deductible" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="250">$250</SelectItem>
                      <SelectItem value="500">$500</SelectItem>
                      <SelectItem value="1000">$1,000</SelectItem>
                      <SelectItem value="2500">$2,500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Liability</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Contents</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Medical Payments</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Scheduled Property</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Property Type and Value</label>
                  <textarea 
                    className="w-full border rounded px-3 py-2 mt-1 min-h-[80px]"
                    placeholder="Enter property type and value details"
                  />
                </div>
              </div>
            </div>

            {/* Proposed Coverage Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Proposed Coverage</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Deductible</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Deductible" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="250">$250</SelectItem>
                      <SelectItem value="500">$500</SelectItem>
                      <SelectItem value="1000">$1,000</SelectItem>
                      <SelectItem value="2500">$2,500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Liability</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Contents</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Medical Payments</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Scheduled Property</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Property Type and Value</label>
                  <textarea 
                    className="w-full border rounded px-3 py-2 mt-1 min-h-[80px]"
                    placeholder="Enter property type and value details"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
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
            <button className="px-3 py-1 bg-gray-700 text-white ml-2">Search</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
