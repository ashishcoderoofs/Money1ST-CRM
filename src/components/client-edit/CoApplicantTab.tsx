import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import type { Client } from "@/types/mongodb-client";

interface CoApplicantTabProps {
  client: Client;
  setClient: (client: Client) => void;
}

export function CoApplicantTab({ client, setClient }: CoApplicantTabProps) {
  // Helper to update nested coApplicant fields
  const updateCoApplicant = (field: string, value: any, nested?: string) => {
    if (nested) {
      setClient({
        ...client,
        coApplicant: {
          ...client.coApplicant,
          [nested]: {
            ...client.coApplicant?.[nested],
            [field]: value,
          },
        },
      });
    } else {
      setClient({
        ...client,
        coApplicant: {
          ...client.coApplicant,
          [field]: value,
        },
      });
    }
  };

  const include = client.coApplicant?.includeCoApplicant ?? true;

  return (
    <div className="bg-blue-50 p-4 rounded-lg relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-blue-800 mb-0">Co-Applicant Information</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={include}
            onCheckedChange={checked => updateCoApplicant("includeCoApplicant", checked)}
          />
          <span className="text-sm">Include Co-Applicant</span>
        </div>
      </div>
      {!include ? (
        <p className="text-gray-600 text-center py-8">
          Enable "Include Co-Applicant" to add co-applicant information.
        </p>
      ) : (
        <div className="space-y-8">
          {/* Name Information */}
          <div>
            <h4 className="font-medium text-blue-700 mb-3">Name Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <Select
                  value={client.coApplicant?.title || ""}
                  onValueChange={value => updateCoApplicant("title", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                    <SelectItem value="Ms.">Ms.</SelectItem>
                    <SelectItem value="Dr.">Dr.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium">First Name *</label>
                <Input
                  value={client.coApplicant?.firstName || ""}
                  onChange={e => updateCoApplicant("firstName", e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Middle Initial</label>
                <Input
                  value={client.coApplicant?.middleInitial || ""}
                  onChange={e => updateCoApplicant("middleInitial", e.target.value)}
                  placeholder="MI"
                  maxLength={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name *</label>
                <Input
                  value={client.coApplicant?.lastName || ""}
                  onChange={e => updateCoApplicant("lastName", e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Suffix</label>
                <Select
                  value={client.coApplicant?.suffix || ""}
                  onValueChange={value => updateCoApplicant("suffix", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select suffix" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jr.">Jr.</SelectItem>
                    <SelectItem value="Sr.">Sr.</SelectItem>
                    <SelectItem value="II">II</SelectItem>
                    <SelectItem value="III">III</SelectItem>
                    <SelectItem value="IV">IV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium">Maiden Name</label>
                <Input
                  value={client.coApplicant?.maidenName || ""}
                  onChange={e => updateCoApplicant("maidenName", e.target.value)}
                  placeholder="Enter maiden name"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <Checkbox
                checked={client.coApplicant?.isConsultant || false}
                onCheckedChange={checked => updateCoApplicant("isConsultant", checked)}
              />
              <span className="text-sm">Is Consultant</span>
            </div>
          </div>

          {/* Contact & Current Address */}
          <div>
            <h4 className="font-medium text-green-700 mb-3">Contact & Current Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium">Address</label>
                <Input
                  value={client.coApplicant?.currentAddress?.street || ""}
                  onChange={e => updateCoApplicant("street", e.target.value, "currentAddress")}
                  placeholder="Enter street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">City</label>
                <Input
                  value={client.coApplicant?.currentAddress?.city || ""}
                  onChange={e => updateCoApplicant("city", e.target.value, "currentAddress")}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">State</label>
                <Select
                  value={client.coApplicant?.currentAddress?.state || ""}
                  onValueChange={value => updateCoApplicant("state", value, "currentAddress")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    {/* Add more states as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium">Zip Code</label>
                <Input
                  value={client.coApplicant?.currentAddress?.zipCode || ""}
                  onChange={e => updateCoApplicant("zipCode", e.target.value, "currentAddress")}
                  placeholder="Enter zip code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">County</label>
                <Input
                  value={client.coApplicant?.currentAddress?.county || ""}
                  onChange={e => updateCoApplicant("county", e.target.value, "currentAddress")}
                  placeholder="Enter county"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Home Phone</label>
                <Input
                  value={client.coApplicant?.homePhone || ""}
                  onChange={e => updateCoApplicant("homePhone", e.target.value)}
                  placeholder="Enter Home Phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Work Phone</label>
                <Input
                  value={client.coApplicant?.workPhone || ""}
                  onChange={e => updateCoApplicant("workPhone", e.target.value)}
                  placeholder="Enter Work Phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Cell Phone</label>
                <Input
                  value={client.coApplicant?.cellPhone || ""}
                  onChange={e => updateCoApplicant("cellPhone", e.target.value)}
                  placeholder="Enter Cell Phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Other Phone</label>
                <Input
                  value={client.coApplicant?.otherPhone || ""}
                  onChange={e => updateCoApplicant("otherPhone", e.target.value)}
                  placeholder="Enter Other Phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={client.coApplicant?.email || ""}
                  onChange={e => updateCoApplicant("email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Fax</label>
                <Input
                  value={client.coApplicant?.fax || ""}
                  onChange={e => updateCoApplicant("fax", e.target.value)}
                  placeholder="Enter Fax"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">How Long at Current Address</label>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-xs font-medium">Years</label>
                    <Input
                      type="number"
                      value={client.coApplicant?.currentAddress?.howLongYears || "0"}
                      onChange={e => updateCoApplicant("howLongYears", Number(e.target.value), "currentAddress")}
                      placeholder="Years"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Months</label>
                    <Input
                      type="number"
                      value={client.coApplicant?.currentAddress?.howLongMonths || "0"}
                      onChange={e => updateCoApplicant("howLongMonths", Number(e.target.value), "currentAddress")}
                      placeholder="Months"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Previous Address */}
          <div>
            <h4 className="font-medium text-green-700 mb-3">Previous Address Information (if less than 2 years at current address)</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium">Previous Address</label>
                <Input
                  value={client.coApplicant?.previousAddress?.street || ""}
                  onChange={e => updateCoApplicant("street", e.target.value, "previousAddress")}
                  placeholder="Enter previous address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Previous City</label>
                <Input
                  value={client.coApplicant?.previousAddress?.city || ""}
                  onChange={e => updateCoApplicant("city", e.target.value, "previousAddress")}
                  placeholder="Enter previous city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Previous State</label>
                <Input
                  value={client.coApplicant?.previousAddress?.state || ""}
                  onChange={e => updateCoApplicant("state", e.target.value, "previousAddress")}
                  placeholder="Enter previous state"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Previous Zip Code</label>
                <Input
                  value={client.coApplicant?.previousAddress?.zipCode || ""}
                  onChange={e => updateCoApplicant("zipCode", e.target.value, "previousAddress")}
                  placeholder="Enter zip code"
                />
              </div>
              <div className="space-y-2 mt-4">
                <label className="block text-sm font-medium">How Long at Previous Address</label>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-xs font-medium">Years</label>
                    <Input
                      type="number"
                      value={client.coApplicant?.previousAddress?.howLongYears || "0"}
                      onChange={e => updateCoApplicant("howLongYears", Number(e.target.value), "previousAddress")}
                      placeholder="Years"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Months</label>
                    <Input
                      type="number"
                      value={client.coApplicant?.previousAddress?.howLongMonths || "0"}
                      onChange={e => updateCoApplicant("howLongMonths", Number(e.target.value), "previousAddress")}
                      placeholder="Months"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Employment */}
          <div>
            <h4 className="font-medium text-green-700 mb-3">Current Employment Information</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm text-black">Employment Status</div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={client.coApplicant?.employment?.isBusinessOwner || false}
                          onCheckedChange={checked => updateCoApplicant("isBusinessOwner", checked, "employment")}
                        />
                        <label className="text-sm font-normal">Business Owner</label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <label className="block text-sm font-medium">Employment Status</label>
                    <Select
                      value={client.coApplicant?.employment?.employmentStatus || ""}
                      onValueChange={value => updateCoApplicant("employmentStatus", value, "employment")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Employed">Employed</SelectItem>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                        <SelectItem value="Unemployed">Unemployed</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Part-Time">Part-Time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="w-[400px]">
                  <label className="block text-sm font-medium">Occupation</label>
                  <Input
                    value={client.coApplicant?.employment?.occupation || ""}
                    onChange={e => updateCoApplicant("occupation", e.target.value, "employment")}
                    placeholder="Enter occupation"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium">Employer Name</label>
                  <Input
                    value={client.coApplicant?.employment?.employerName || ""}
                    onChange={e => updateCoApplicant("employerName", e.target.value, "employment")}
                    placeholder="Enter employer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Employer Address</label>
                  <Input
                    value={client.coApplicant?.employment?.employerAddress || ""}
                    onChange={e => updateCoApplicant("employerAddress", e.target.value, "employment")}
                    placeholder="Enter employer address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">City</label>
                  <Input
                    value={client.coApplicant?.employment?.employerCity || ""}
                    onChange={e => updateCoApplicant("employerCity", e.target.value, "employment")}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">State</label>
                  <Input
                    value={client.coApplicant?.employment?.employerState || ""}
                    onChange={e => updateCoApplicant("employerState", e.target.value, "employment")}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Zip Code</label>
                  <Input
                    value={client.coApplicant?.employment?.employerZipCode || ""}
                    onChange={e => updateCoApplicant("employerZipCode", e.target.value, "employment")}
                    placeholder="Enter zip code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Gross Monthly Salary</label>
                  <Input
                    value={client.coApplicant?.employment?.monthlyGrossSalary || ""}
                    onChange={e => updateCoApplicant("monthlyGrossSalary", Number(e.target.value), "employment")}
                    placeholder="$0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={client.coApplicant?.employment?.startDate || ""}
                    onChange={e => updateCoApplicant("startDate", e.target.value, "employment")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={client.coApplicant?.employment?.endDate || ""}
                    onChange={e => updateCoApplicant("endDate", e.target.value, "employment")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Supervisor</label>
                  <Input
                    value={client.coApplicant?.employment?.supervisor || ""}
                    onChange={e => updateCoApplicant("supervisor", e.target.value, "employment")}
                    placeholder="Enter supervisor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Supervisor Phone</label>
                  <Input
                    value={client.coApplicant?.employment?.supervisorPhone || ""}
                    onChange={e => updateCoApplicant("supervisorPhone", e.target.value, "employment")}
                    placeholder="Enter supervisor phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Additional Income</label>
                  <Input
                    value={client.coApplicant?.employment?.additionalIncome || ""}
                    onChange={e => updateCoApplicant("additionalIncome", Number(e.target.value), "employment")}
                    placeholder="$0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Source</label>
                  <Input
                    value={client.coApplicant?.employment?.source || ""}
                    onChange={e => updateCoApplicant("source", e.target.value, "employment")}
                    placeholder="Enter source"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Previous Employment */}
          <div>
            <h4 className="font-medium text-green-700 mb-3">Previous Employment Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium">Employer Name</label>
                <Input
                  value={client.coApplicant?.previousEmployment?.employerName || ""}
                  onChange={e => updateCoApplicant("employerName", e.target.value, "previousEmployment")}
                  placeholder="Enter employer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Employer Address</label>
                <Input
                  value={client.coApplicant?.previousEmployment?.employerAddress || ""}
                  onChange={e => updateCoApplicant("employerAddress", e.target.value, "previousEmployment")}
                  placeholder="Enter employer address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">City</label>
                <Input
                  value={client.coApplicant?.previousEmployment?.city || ""}
                  onChange={e => updateCoApplicant("city", e.target.value, "previousEmployment")}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">State</label>
                <Input
                  value={client.coApplicant?.previousEmployment?.state || ""}
                  onChange={e => updateCoApplicant("state", e.target.value, "previousEmployment")}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Zip Code</label>
                <Input
                  value={client.coApplicant?.previousEmployment?.zipCode || ""}
                  onChange={e => updateCoApplicant("zipCode", e.target.value, "previousEmployment")}
                  placeholder="Enter zip code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Occupation</label>
                <Input
                  value={client.coApplicant?.previousEmployment?.occupation || ""}
                  onChange={e => updateCoApplicant("occupation", e.target.value, "previousEmployment")}
                  placeholder="Enter occupation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">From Date</label>
                <Input
                  type="date"
                  value={client.coApplicant?.previousEmployment?.fromDate || ""}
                  onChange={e => updateCoApplicant("fromDate", e.target.value, "previousEmployment")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">To Date</label>
                <Input
                  type="date"
                  value={client.coApplicant?.previousEmployment?.toDate || ""}
                  onChange={e => updateCoApplicant("toDate", e.target.value, "previousEmployment")}
                />
              </div>
            </div>
          </div>

          {/* Demographics */}
          <div>
            <h4 className="font-medium text-green-700 mb-3">Demographic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium">Birth Place</label>
                <Input
                  value={client.coApplicant?.demographics?.birthPlace || ""}
                  onChange={e => updateCoApplicant("birthPlace", e.target.value, "demographics")}
                  placeholder="Enter birth place"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Date of Birth</label>
                <Input
                  type="date"
                  value={client.coApplicant?.demographics?.dateOfBirth || ""}
                  onChange={e => updateCoApplicant("dateOfBirth", e.target.value, "demographics")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">SSN</label>
                <Input
                  value={client.coApplicant?.demographics?.ssn || ""}
                  onChange={e => updateCoApplicant("ssn", e.target.value, "demographics")}
                  placeholder="Enter SSN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Race</label>
                <Select
                  value={client.coApplicant?.demographics?.race || ""}
                  onValueChange={value => updateCoApplicant("race", value, "demographics")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="American Indian or Alaska Native">American Indian or Alaska Native</SelectItem>
                    <SelectItem value="Asian">Asian</SelectItem>
                    <SelectItem value="Black or African American">Black or African American</SelectItem>
                    <SelectItem value="Hispanic or Latino">Hispanic or Latino</SelectItem>
                    <SelectItem value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</SelectItem>
                    <SelectItem value="White">White</SelectItem>
                    <SelectItem value="Two or More Races">Two or More Races</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium">Marital Status</label>
                <Select
                  value={client.coApplicant?.demographics?.maritalStatus || ""}
                  onValueChange={value => updateCoApplicant("maritalStatus", value, "demographics")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Separated">Separated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium">Anniversary</label>
                <Input
                  type="date"
                  value={client.coApplicant?.demographics?.anniversary || ""}
                  onChange={e => updateCoApplicant("anniversary", e.target.value, "demographics")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Spouse Name</label>
                <Input
                  value={client.coApplicant?.demographics?.spouseName || ""}
                  onChange={e => updateCoApplicant("spouseName", e.target.value, "demographics")}
                  placeholder="Enter spouse name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Spouse Occupation</label>
                <Input
                  value={client.coApplicant?.demographics?.spouseOccupation || ""}
                  onChange={e => updateCoApplicant("spouseOccupation", e.target.value, "demographics")}
                  placeholder="Enter spouse occupation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Number of Dependents</label>
                <Input
                  type="number"
                  value={client.coApplicant?.demographics?.numberOfDependents || ""}
                  onChange={e => updateCoApplicant("numberOfDependents", Number(e.target.value), "demographics")}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
