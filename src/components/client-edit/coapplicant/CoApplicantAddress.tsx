
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useUpdateCoApplicantAddress } from "@/hooks/clients/useApplicantMutations";
import { toast } from "sonner";

interface CoApplicantAddressProps {
  form: any;
  client: Tables<"clients">;
}

export function CoApplicantAddress({ form, client }: CoApplicantAddressProps) {
  const updateCoApplicantAddress = useUpdateCoApplicantAddress();

  const handleSave = async () => {
    try {
      const formData = form.getValues();
      
      // Prepare data for backend API
      const addressData = {
        currentAddress: {
          street: formData.coapplicant_address,
          city: formData.coapplicant_city,
          state: formData.coapplicant_state,
          zipCode: formData.coapplicant_zip,
          county: formData.coapplicant_county,
          howLongYears: parseInt(formData.coapplicant_years_at_address) || 0,
          howLongMonths: parseInt(formData.coapplicant_months_at_address) || 0
        },
        previousAddress: {
          street: formData.coapplicant_previous_address,
          city: formData.coapplicant_previous_city,
          state: formData.coapplicant_previous_state,
          zipCode: formData.coapplicant_previous_zip,
          howLongYears: parseInt(formData.coapplicant_previous_years) || 0,
          howLongMonths: parseInt(formData.coapplicant_previous_months) || 0
        }
      };

      await updateCoApplicantAddress.mutateAsync({
        clientId: client.id,
        data: addressData
      });

      toast.success("Co-applicant address information saved successfully");
    } catch (error) {
      console.error("Failed to save co-applicant address:", error);
      toast.error("Failed to save co-applicant address information");
    }
  };
  return (
    <div className="space-y-6">
      {/* Current Address */}
      <div>
        <h4 className="font-medium text-green-700 mb-3">Current Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <FormField
            control={form.control}
            name="coapplicant_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter street address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter city" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter state" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter zip code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_county"
            render={({ field }) => (
              <FormItem>
                <FormLabel>County</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter county" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_home_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Home Phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_other_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Phone</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="Enter other phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_cell_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cell Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter cell Phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_other_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter other Phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} placeholder="email@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_fax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fax</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Fax" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>How Long at Current Address</FormLabel>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="coapplicant_current_address_years"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value || "0"}>
                      <FormControl>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="0 years" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 51 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>{i} years</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coapplicant_current_address_months"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value || "0"}>
                      <FormControl>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="0 months" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>{i} months</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Previous Address Information */}
      <div>
        <h4 className="font-medium text-green-700 mb-3">Previous Address Information (if less than 2 years at current address)</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="coapplicant_previous_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_previous_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter city" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_previous_state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter state" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coapplicant_previous_zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter zip code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>How Long at Previous Address</FormLabel>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="coapplicant_previous_address_years"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value || "0"}>
                      <FormControl>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="0 years" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 51 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>{i} years</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coapplicant_previous_address_months"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value || "0"}>
                      <FormControl>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="0 months" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>{i} months</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={handleSave}
          disabled={updateCoApplicantAddress.isPending}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateCoApplicantAddress.isPending ? "Saving..." : "Save Address Info"}
        </Button>
      </div>
    </div>
  );
}
