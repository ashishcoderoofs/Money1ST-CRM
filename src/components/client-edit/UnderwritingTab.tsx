
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tables } from "@/integrations/supabase/types";

interface UnderwritingTabProps {
  client: Tables<"clients">;
  form?: any;
}

export function UnderwritingTab({ client, form }: UnderwritingTabProps) {
  return (
    <div className="space-y-6">
      {/* Address and Client Information */}
      <Card>
        <CardHeader className="bg-cyan-500 text-white">
          <CardTitle>Underwriting</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address Section */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input 
                  placeholder="5100 S KINBARK" 
                  className="mt-1"
                  {...(form ? form.register("underwriting_address") : {})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">City</label>
                <Input 
                  placeholder="CHICAGO" 
                  className="mt-1"
                  {...(form ? form.register("underwriting_city") : {})}
                />
              </div>
            </div>

            {/* Client ID Section */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Client ID</label>
                <div className="flex items-center mt-1">
                  <Input 
                    placeholder="19" 
                    className="flex-1"
                    {...(form ? form.register("underwriting_client_id") : {})}
                  />
                  <button className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded">
                    ≡
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">State</label>
                <Input 
                  placeholder="IL" 
                  className="mt-1"
                  {...(form ? form.register("underwriting_state") : {})}
                />
              </div>
            </div>

            {/* Credit Scores Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Credit Scores</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600">Applicant</label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Co-Applicant</label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600">Equifax</label>
                    <Input placeholder="0" className="mt-1" />
                  </div>
                  <div>
                    <Input placeholder="0" className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600">Experian</label>
                    <Input placeholder="0" className="mt-1" />
                  </div>
                  <div>
                    <Input placeholder="0" className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600">TransUnion</label>
                    <Input placeholder="0" className="mt-1" />
                  </div>
                  <div>
                    <Input placeholder="0" className="mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CNH and TUD Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CNH Section */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">CNH</h3>
            <RadioGroup 
              className="space-y-3"
              {...(form ? form.register("underwriting_cnh_option") : {})}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit" id="credit" />
                <label htmlFor="credit" className="text-sm">Credit</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="equity" id="equity" />
                <label htmlFor="equity" className="text-sm">Equity</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ltv" id="ltv" />
                <label htmlFor="ltv" className="text-sm">LTV</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bankrupt" id="bankrupt" />
                <label htmlFor="bankrupt" className="text-sm">Bankrupt</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-benefit" id="no-benefit" />
                <label htmlFor="no-benefit" className="text-sm">No Benefit</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suspend-fu-date" id="suspend-fu-date" />
                <label htmlFor="suspend-fu-date" className="text-sm">Suspend - FU Date</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="collateral" id="collateral" />
                <label htmlFor="collateral" className="text-sm">Collateral</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dti" id="dti" />
                <label htmlFor="dti" className="text-sm">DTI</label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* TUD Section */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">TUD</h3>
            <RadioGroup 
              className="space-y-3"
              {...(form ? form.register("underwriting_tud_option") : {})}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-interest" id="no-interest" />
                <label htmlFor="no-interest" className="text-sm">No Interest</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rate" id="rate" />
                <label htmlFor="rate" className="text-sm">Rate</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="terms-payment" id="terms-payment" />
                <label htmlFor="terms-payment" className="text-sm">Terms/Payment</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fee" id="fee" />
                <label htmlFor="fee" className="text-sm">Fee</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-value" id="no-value" />
                <label htmlFor="no-value" className="text-sm">No Value</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wont-elsewhere" id="wont-elsewhere" />
                <label htmlFor="wont-elsewhere" className="text-sm">Won't Elsewhere</label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Terms and Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div>
              <label className="text-sm font-medium">Terms</label>
              <Select {...(form ? form.register("underwriting_terms") : {})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30-year">30 Year Fixed</SelectItem>
                  <SelectItem value="15-year">15 Year Fixed</SelectItem>
                  <SelectItem value="arm-5-1">5/1 ARM</SelectItem>
                  <SelectItem value="arm-7-1">7/1 ARM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <label className="text-sm font-medium">Programs</label>
              <Select {...(form ? form.register("underwriting_programs") : {})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conventional">Conventional</SelectItem>
                  <SelectItem value="fha">FHA</SelectItem>
                  <SelectItem value="va">VA</SelectItem>
                  <SelectItem value="usda">USDA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Underwriting Notes */}
      <Card>
        <CardContent className="pt-6">
          <div>
            <label className="text-sm font-medium">Underwriting Notes:</label>
            <Textarea 
              placeholder="Enter underwriting notes here..." 
              className="mt-2 min-h-[120px]"
              {...(form ? form.register("underwriting_notes") : {})}
            />
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
              <span>1 of 2</span>
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
