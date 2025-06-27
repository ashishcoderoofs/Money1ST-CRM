
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";

interface CaseInformationCardProps {
  client: Tables<"clients">;
  form: any;
}

export function CaseInformationCard({ client, form }: CaseInformationCardProps) {
  return (
    <Card>
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle>Case Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="entry_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <label className="text-sm font-medium">Client ID</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
              value={`CLI${client.id.slice(0, 6).toUpperCase()}`}
              readOnly
            />
          </div>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <FormField
            control={form.control}
            name="consultant_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consultant</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Consultant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CON002 - Jane Doe">CON002 - Jane Doe</SelectItem>
                    <SelectItem value="CON005 - Sarah Wilson">CON005 - Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="processor_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Processor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CON005 - Sarah Wilson">CON005 - Sarah Wilson</SelectItem>
                    <SelectItem value="CON010 - Mike Johnson">CON010 - Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payoff_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payoff Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-gray-100 px-2 py-1 rounded-l border-r">
                      $
                    </span>
                    <Input 
                      {...field} 
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-12"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
