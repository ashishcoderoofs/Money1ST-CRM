
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface LineageTabProps {
  client: Tables<"clients">;
}

export function LineageTab({ client }: LineageTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-600 text-white">
          <CardTitle>Client Lineage Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Referring Agent</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mt-1"
                placeholder="Enter referring agent"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Source</label>
              <select className="w-full border rounded px-3 py-2 mt-1">
                <option value="">Select Source</option>
                <option value="referral">Referral</option>
                <option value="marketing">Marketing</option>
                <option value="website">Website</option>
                <option value="social">Social Media</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Campaign</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mt-1"
                placeholder="Enter campaign name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Lead Quality</label>
              <select className="w-full border rounded px-3 py-2 mt-1">
                <option value="">Select Quality</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Follow-up Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Priority Level</label>
              <select className="w-full border rounded px-3 py-2 mt-1">
                <option value="">Select Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium">Additional Notes</label>
            <textarea
              className="w-full border rounded px-3 py-2 mt-1 h-24"
              placeholder="Enter additional notes about client lineage"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
