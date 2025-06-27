
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";

interface LiabilitiesManagementProps {
  form: any;
}

export function LiabilitiesManagement({ form }: LiabilitiesManagementProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "liabilities"
  });

  const addLiability = () => {
    append({
      debtor_type: "Applicant",
      liability_type: "",
      creditor_name: "",
      current_balance: 0,
      monthly_payment: 0,
      pay_off: false,
      property_address: "",
      property_value: 0,
      gross_rent: 0,
      escrow: "",
      taxes: 0,
      hoi: 0,
    });
  };

  const calculateTotalEscrow = (taxes: number, hoi: number) => {
    return (taxes || 0) + (hoi || 0);
  };

  const calculateNetRent = (grossRent: number, taxes: number, hoi: number) => {
    return (grossRent || 0) - calculateTotalEscrow(taxes || 0, hoi || 0);
  };

  const liabilities = form.watch("liabilities") || [];
  const totalBalance = liabilities.reduce((sum: number, liability: any) => sum + (Number(liability.current_balance) || 0), 0);
  const totalPayment = liabilities.reduce((sum: number, liability: any) => sum + (Number(liability.monthly_payment) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-cyan-400 text-white px-4 py-3 rounded-t flex justify-between items-center">
        <h2 className="text-lg font-semibold">List all Monthly Payments and Properties Owned</h2>
        <Button 
          type="button" 
          size="sm" 
          className="bg-white text-cyan-600 hover:bg-gray-100"
          onClick={addLiability}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Liability
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-300 rounded-b">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Client#</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Debtor</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Debt Type</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Debt Name</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Balance</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Payment</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Pay Off</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Property Address</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Property Value</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Gross Rent</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Escrow</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Taxes</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">HOI</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Total Esc.</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Net Rent</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.length === 0 ? (
                <tr>
                  <td colSpan={16} className="border border-gray-300 px-4 py-6 text-center text-gray-500">
                    No liabilities added. Click "Add Liability" to get started.
                  </td>
                </tr>
              ) : (
                fields.map((field, index) => {
                  const liability = form.watch(`liabilities.${index}`);
                  return (
                    <tr key={field.id} className="liability-row bg-white hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Select
                          value={liability?.debtor_type || "Applicant"}
                          onValueChange={(value) => form.setValue(`liabilities.${index}.debtor_type`, value)}
                        >
                          <SelectTrigger className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                            <SelectItem value="Applicant">Applicant</SelectItem>
                            <SelectItem value="Co-Applicant">Co-Applicant</SelectItem>
                            <SelectItem value="Joint">Joint</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Select
                          value={liability?.liability_type || ""}
                          onValueChange={(value) => form.setValue(`liabilities.${index}.liability_type`, value)}
                        >
                          <SelectTrigger className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                            <SelectItem value="Credit Card">Credit Card</SelectItem>
                            <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                            <SelectItem value="Student Loan">Student Loan</SelectItem>
                            <SelectItem value="Auto Loan">Auto Loan</SelectItem>
                            <SelectItem value="Medical Debt">Medical Debt</SelectItem>
                            <SelectItem value="Business Debt">Business Debt</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          {...form.register(`liabilities.${index}.creditor_name`)}
                          placeholder="Creditor Name"
                          className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <div className="flex items-center">
                          <span className="text-sm mr-1">$</span>
                          <Input
                            {...form.register(`liabilities.${index}.current_balance`, { 
                              valueAsNumber: true,
                              setValueAs: (value) => value === "" ? 0 : Number(value)
                            })}
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            className="h-8 text-sm border border-gray-300 bg-white text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <div className="flex items-center">
                          <span className="text-sm mr-1">$</span>
                          <Input
                            {...form.register(`liabilities.${index}.monthly_payment`, { 
                              valueAsNumber: true,
                              setValueAs: (value) => value === "" ? 0 : Number(value)
                            })}
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            className="h-8 text-sm border border-gray-300 bg-white text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <Checkbox
                          checked={liability?.pay_off || false}
                          onCheckedChange={(checked) => form.setValue(`liabilities.${index}.pay_off`, checked)}
                          className="border border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          {...form.register(`liabilities.${index}.property_address`)}
                          placeholder="Property Address"
                          className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <div className="flex items-center">
                          <span className="text-sm mr-1">$</span>
                          <Input
                            {...form.register(`liabilities.${index}.property_value`, { 
                              valueAsNumber: true,
                              setValueAs: (value) => value === "" ? 0 : Number(value)
                            })}
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            className="h-8 text-sm border border-gray-300 bg-white text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <div className="flex items-center">
                          <span className="text-sm mr-1">$</span>
                          <Input
                            {...form.register(`liabilities.${index}.gross_rent`, { 
                              valueAsNumber: true,
                              setValueAs: (value) => value === "" ? 0 : Number(value)
                            })}
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            className="h-8 text-sm border border-gray-300 bg-white text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Select
                          value={liability?.escrow || ""}
                          onValueChange={(value) => form.setValue(`liabilities.${index}.escrow`, value)}
                        >
                          <SelectTrigger className="h-8 text-sm border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                            <SelectItem value="YES">YES</SelectItem>
                            <SelectItem value="NO">NO</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <div className="flex items-center">
                          <span className="text-sm mr-1">$</span>
                          <Input
                            {...form.register(`liabilities.${index}.taxes`, { 
                              valueAsNumber: true,
                              setValueAs: (value) => value === "" ? 0 : Number(value)
                            })}
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            className="h-8 text-sm border border-gray-300 bg-white text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <div className="flex items-center">
                          <span className="text-sm mr-1">$</span>
                          <Input
                            {...form.register(`liabilities.${index}.hoi`, { 
                              valueAsNumber: true,
                              setValueAs: (value) => value === "" ? 0 : Number(value)
                            })}
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            className="h-8 text-sm border border-gray-300 bg-white text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-right text-sm bg-gray-50">
                        ${calculateTotalEscrow(Number(liability?.taxes) || 0, Number(liability?.hoi) || 0).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-right text-sm bg-gray-50">
                        ${calculateNetRent(Number(liability?.gross_rent) || 0, Number(liability?.taxes) || 0, Number(liability?.hoi) || 0).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="w-7 h-7 p-0 bg-red-600 hover:bg-red-700"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {fields.length > 0 && (
              <tfoot className="bg-gray-100">
                <tr>
                  <td colSpan={4} className="border border-gray-300 px-3 py-2 text-center font-bold text-sm text-gray-700">
                    Total Balance: ${totalBalance.toFixed(2)}
                  </td>
                  <td colSpan={4} className="border border-gray-300 px-3 py-2 text-center font-bold text-sm text-gray-700">
                    Total Payment: ${totalPayment.toFixed(2)}
                  </td>
                  <td colSpan={8} className="border border-gray-300"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
