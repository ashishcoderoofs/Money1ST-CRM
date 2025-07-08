import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { Client } from "@/types/mongodb-client";

interface ApplicantTabProps {
  client: Client;
  setClient: (client: Client) => void;
}

export function ApplicantTab({ client, setClient }: ApplicantTabProps) {
  // Helper to update nested applicant fields
  const updateApplicant = (field: string, value: any, nested?: string) => {
    if (nested) {
      setClient({
        ...client,
        applicant: {
          ...client.applicant,
          [nested]: {
            ...client.applicant?.[nested],
            [field]: value,
          },
        },
      });
    } else {
      setClient({
        ...client,
        applicant: {
          ...client.applicant,
          [field]: value,
        },
      });
    }
  };

  // Household members state (if needed)
  const [householdMembers, setHouseholdMembers] = useState(client.householdMembers || []);

  const addHouseholdMember = () => {
    const newMember = {
      firstName: "",
      middleInitial: "",
      lastName: "",
      relationship: "Other" as const,
      dateOfBirth: "",
      age: 0,
      sex: "Male" as const,
      maritalStatus: "Single" as const,
      ssn: "",
    } satisfies import("@/types/mongodb-client").HouseholdMember;
    const updated = [...householdMembers, newMember];
    setHouseholdMembers(updated);
    setClient({ ...client, householdMembers: updated });
  };

  const removeHouseholdMember = (index: number) => {
    const updated = householdMembers.filter((_, i) => i !== index);
    setHouseholdMembers(updated);
    setClient({ ...client, householdMembers: updated });
  };

  const updateHouseholdMember = (index: number, field: string, value: any) => {
    const updated = householdMembers.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    );
    setHouseholdMembers(updated);
    setClient({ ...client, householdMembers: updated });
  };

  return (
    <div className="bg-green-50 p-4 rounded-lg relative">
      <div className="sticky top-0 z-10 flex justify-end mb-2 bg-green-50 pt-2" style={{ right: 0 }}>
        <Button type="button" variant="outline" onClick={() => {
          setClient({
            ...client,
            applicant: {
              ...client.applicant,
              title: "Mr.",
              firstName: "John",
              middleInitial: "A",
              lastName: "Doe",
              suffix: "Jr.",
              maidenName: "Smith",
              isConsultant: false,
              currentAddress: {
                street: "123 Main St",
                city: "Springfield",
                state: "IL",
                zipCode: "62704",
                county: "Sangamon",
                howLongYears: 2,
                howLongMonths: 6
              },
              homePhone: "217-555-1234",
              workPhone: "217-555-5678",
              cellPhone: "217-555-8765",
              email: `john.doe+${Date.now()}@example.com`,
              employment: {
                employmentStatus: "Employed",
                occupation: "Engineer",
                employerName: "Acme Corp",
                employerAddress: "456 Industrial Rd",
                employerCity: "Springfield",
                employerState: "IL",
                employerZipCode: "62704",
                monthlyGrossSalary: 8000,
                startDate: "2020-01-01"
              },
              demographics: {
                birthPlace: "Springfield",
                dateOfBirth: "1985-05-15",
                ssn: "123-45-6789",
                race: "White",
                maritalStatus: "Married",
                anniversary: "2010-06-20",
                spouseName: "Jane Doe",
                spouseOccupation: "Teacher",
                numberOfDependents: 2
              },
              previousAddress: {
                street: "456 Old St",
                city: "Oldtown",
                state: "IL",
                zipCode: "62701",
                howLongYears: 1,
                howLongMonths: 3
              }
            },
            coApplicant: {
              includeCoApplicant: true,
              title: "Mrs.",
              firstName: "Jane",
              middleInitial: "B",
              lastName: "Smith",
              suffix: "Sr.",
              maidenName: "Johnson",
              isConsultant: false,
              currentAddress: {
                street: "789 Oak Ave",
                city: "Rivertown",
                state: "IL",
                zipCode: "62705",
                county: "Riverside",
                howLongYears: 1,
                howLongMonths: 2
              },
              homePhone: "217-555-2222",
              workPhone: "217-555-3333",
              cellPhone: "217-555-4444",
              email: `jane.smith+${Date.now()}@example.com`,
              employment: {
                employmentStatus: "Full-time",
                occupation: "Designer",
                employerName: "Beta LLC",
                employerAddress: "789 Commerce Blvd",
                employerCity: "Rivertown",
                employerState: "IL",
                employerZipCode: "62705",
                monthlyGrossSalary: 6000,
                startDate: "2021-03-01"
              },
              demographics: {
                birthPlace: "Rivertown",
                dateOfBirth: "1987-08-22",
                ssn: "987-65-4321",
                race: "White",
                maritalStatus: "Married",
                anniversary: "2010-06-20",
                spouseName: "John Doe",
                spouseOccupation: "Engineer",
                numberOfDependents: 2
              },
              previousAddress: {
                street: "101 Pine St",
                city: "Oldville",
                state: "IL",
                zipCode: "62702",
                howLongYears: 2,
                howLongMonths: 0
              }
            },
            entryDate: "2024-06-15",
            payoffAmount: 15000,
            status: "Active",
            consultant: "Jane Consultant",
            processor: "Mike Processor",
            householdMembers: [
              {
                firstName: "Jane",
                middleInitial: "B",
                lastName: "Doe",
                relationship: "Spouse",
                dateOfBirth: "1987-08-22",
                age: 36,
                sex: "Female",
                maritalStatus: "Married",
                ssn: "987-65-4321"
              },
              {
                firstName: "Jimmy",
                middleInitial: "C",
                lastName: "Doe",
                relationship: "Son",
                dateOfBirth: "2012-03-10",
                age: 12,
                sex: "Male",
                maritalStatus: "Single",
                ssn: "111-22-3333"
              }
            ]
          });
        }}>
          Fill Dummy Data
        </Button>
      </div>
      <h3 className="font-semibold text-green-800 mb-4">Primary Applicant Information</h3>
      {/* Case Information */}
      <div className="mb-6">
        <h4 className="font-medium text-green-700 mb-3">Case Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium">Client ID</label>
            <Input value={client.clientId || ""} readOnly className="bg-gray-100 cursor-not-allowed" placeholder="Auto-generated on save" />
          </div>
          <div>
            <label className="block text-sm font-medium">Entry Date *</label>
            <Input
              type="date"
              value={client.entryDate || ""}
              onChange={e => setClient({ ...client, entryDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Payoff Amount</label>
            <Input
              type="number"
              value={client.payoffAmount || ""}
              onChange={e => setClient({ ...client, payoffAmount: Number(e.target.value) })}
              placeholder="$0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status *</label>
            <Select
              value={client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : ""}
              onValueChange={value => setClient({ ...client, status: value.toLowerCase() as any })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">Consultant</label>
            <Select
              value={client.consultant || ""}
              onValueChange={value => setClient({ ...client, consultant: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select consultant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jennifer Williams (CON004)">Jennifer Williams (CON004)</SelectItem>
                <SelectItem value="Michael Chen (CON003)">Michael Chen (CON003)</SelectItem>
                <SelectItem value="Maria Rodriguez (CON002)">Maria Rodriguez (CON002)</SelectItem>
                <SelectItem value="James Thompson (CON001)">James Thompson (CON001)</SelectItem>
                <SelectItem value="Martie McLean (CON1750362389503)">Martie McLean (CON1750362389503)</SelectItem>
                <SelectItem value="Test user2 (CON1750361168106)">Test user2 (CON1750361168106)</SelectItem>
                <SelectItem value="Test user (CON1750358147687)">Test user (CON1750358147687)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">Processor</label>
            <Input
              value={client.processor || ""}
              onChange={e => setClient({ ...client, processor: e.target.value })}
              placeholder="Processor name"
            />
          </div>
        </div>
      </div>
      {/* Name Information */}
      <div className="mb-6">
        <h4 className="font-medium text-green-700 mb-3">Name Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <Select
              value={client.applicant?.title || ""}
              onValueChange={value => updateApplicant("title", value)}
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
              value={client.applicant?.firstName || ""}
              onChange={e => updateApplicant("firstName", e.target.value)}
              placeholder="First name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Middle Initial</label>
            <Input
              value={client.applicant?.middleInitial || ""}
              onChange={e => updateApplicant("middleInitial", e.target.value)}
              placeholder="M"
              maxLength={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name *</label>
            <Input
              value={client.applicant?.lastName || ""}
              onChange={e => updateApplicant("lastName", e.target.value)}
              placeholder="Last name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Suffix</label>
            <Select
              value={client.applicant?.suffix || ""}
              onValueChange={value => updateApplicant("suffix", value)}
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
              value={client.applicant?.maidenName || ""}
              onChange={e => updateApplicant("maidenName", e.target.value)}
              placeholder="Maiden name"
            />
          </div>
          <div className="flex items-center mt-4">
            <Checkbox
              checked={!!client.applicant?.isConsultant}
              onCheckedChange={checked => updateApplicant("isConsultant", checked)}
            />
            <span className="ml-2 text-sm">Is Consultant</span>
          </div>
        </div>
      </div>
      {/* Contact Information */}
      <div className="mb-6">
        <h4 className="font-medium text-green-700 mb-3">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Home Phone</label>
            <Input
              value={client.applicant?.homePhone || ""}
              onChange={e => updateApplicant("homePhone", e.target.value)}
              placeholder="Enter home phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Work Phone</label>
            <Input
              value={client.applicant?.workPhone || ""}
              onChange={e => updateApplicant("workPhone", e.target.value)}
              placeholder="Enter work phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cell Phone</label>
            <Input
              value={client.applicant?.cellPhone || ""}
              onChange={e => updateApplicant("cellPhone", e.target.value)}
              placeholder="Enter cell phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Other Phone</label>
            <Input
              value={client.applicant?.otherPhone || ""}
              onChange={e => updateApplicant("otherPhone", e.target.value)}
              placeholder="Enter other phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              value={client.applicant?.email || ""}
              onChange={e => updateApplicant("email", e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Fax</label>
            <Input
              value={client.applicant?.fax || ""}
              onChange={e => updateApplicant("fax", e.target.value)}
              placeholder="Enter fax number"
            />
          </div>
        </div>
      </div>
      {/* Current Address */}
      <div className="mb-6">
        <h4 className="font-medium text-green-700 mb-3">Current Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium">Address</label>
            <Input
              value={client.applicant?.currentAddress?.street || ""}
              onChange={e => updateApplicant("street", e.target.value, "currentAddress")}
              placeholder="Enter street address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <Input
              value={client.applicant?.currentAddress?.city || ""}
              onChange={e => updateApplicant("city", e.target.value, "currentAddress")}
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">State</label>
            <Select
              value={client.applicant?.currentAddress?.state || ""}
              onValueChange={value => updateApplicant("state", value, "currentAddress")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AL">Alabama</SelectItem>
                <SelectItem value="AK">Alaska</SelectItem>
                <SelectItem value="AZ">Arizona</SelectItem>
                <SelectItem value="AR">Arkansas</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="CO">Colorado</SelectItem>
                <SelectItem value="CT">Connecticut</SelectItem>
                <SelectItem value="DE">Delaware</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
                <SelectItem value="GA">Georgia</SelectItem>
                <SelectItem value="HI">Hawaii</SelectItem>
                <SelectItem value="ID">Idaho</SelectItem>
                <SelectItem value="IL">Illinois</SelectItem>
                <SelectItem value="IN">Indiana</SelectItem>
                <SelectItem value="IA">Iowa</SelectItem>
                <SelectItem value="KS">Kansas</SelectItem>
                <SelectItem value="KY">Kentucky</SelectItem>
                <SelectItem value="LA">Louisiana</SelectItem>
                <SelectItem value="ME">Maine</SelectItem>
                <SelectItem value="MD">Maryland</SelectItem>
                <SelectItem value="MA">Massachusetts</SelectItem>
                <SelectItem value="MI">Michigan</SelectItem>
                <SelectItem value="MN">Minnesota</SelectItem>
                <SelectItem value="MS">Mississippi</SelectItem>
                <SelectItem value="MO">Missouri</SelectItem>
                <SelectItem value="MT">Montana</SelectItem>
                <SelectItem value="NE">Nebraska</SelectItem>
                <SelectItem value="NV">Nevada</SelectItem>
                <SelectItem value="NH">New Hampshire</SelectItem>
                <SelectItem value="NJ">New Jersey</SelectItem>
                <SelectItem value="NM">New Mexico</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="NC">North Carolina</SelectItem>
                <SelectItem value="ND">North Dakota</SelectItem>
                <SelectItem value="OH">Ohio</SelectItem>
                <SelectItem value="OK">Oklahoma</SelectItem>
                <SelectItem value="OR">Oregon</SelectItem>
                <SelectItem value="PA">Pennsylvania</SelectItem>
                <SelectItem value="RI">Rhode Island</SelectItem>
                <SelectItem value="SC">South Carolina</SelectItem>
                <SelectItem value="SD">South Dakota</SelectItem>
                <SelectItem value="TN">Tennessee</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="UT">Utah</SelectItem>
                <SelectItem value="VT">Vermont</SelectItem>
                <SelectItem value="VA">Virginia</SelectItem>
                <SelectItem value="WA">Washington</SelectItem>
                <SelectItem value="WV">West Virginia</SelectItem>
                <SelectItem value="WI">Wisconsin</SelectItem>
                <SelectItem value="WY">Wyoming</SelectItem>
                <SelectItem value="DC">District of Columbia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">Zip Code</label>
            <Input
              type="text"
              value={client.applicant?.currentAddress?.zipCode || ""}
              onChange={e => updateApplicant("zipCode", e.target.value, "currentAddress")}
              placeholder="12345"
              maxLength={5}
              pattern="[0-9]{5}"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">County</label>
            <Input
              value={client.applicant?.currentAddress?.county || ""}
              onChange={e => updateApplicant("county", e.target.value, "currentAddress")}
              placeholder="Enter county"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">How Long at Current Address</label>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium">Years</label>
                <Input
                  type="number"
                  value={client.applicant?.currentAddress?.howLongYears || "0"}
                  onChange={e => updateApplicant("howLongYears", Number(e.target.value), "currentAddress")}
                  placeholder="Years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Months</label>
                <Input
                  type="number"
                  value={client.applicant?.currentAddress?.howLongMonths || "0"}
                  onChange={e => updateApplicant("howLongMonths", Number(e.target.value), "currentAddress")}
                  placeholder="Months"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Previous Address Information */}
      <div className="mb-6">
        <h4 className="font-medium text-green-700 mb-3">Previous Address Information (if less than 2 years at current address)</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium">Address</label>
            <Input
              value={client.applicant?.previousAddress?.street || ""}
              onChange={e => updateApplicant("street", e.target.value, "previousAddress")}
              placeholder="Enter address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <Input
              value={client.applicant?.previousAddress?.city || ""}
              onChange={e => updateApplicant("city", e.target.value, "previousAddress")}
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">State</label>
            <Select
              value={client.applicant?.previousAddress?.state || ""}
              onValueChange={value => updateApplicant("state", value, "previousAddress")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AL">Alabama</SelectItem>
                <SelectItem value="AK">Alaska</SelectItem>
                <SelectItem value="AZ">Arizona</SelectItem>
                <SelectItem value="AR">Arkansas</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="CO">Colorado</SelectItem>
                <SelectItem value="CT">Connecticut</SelectItem>
                <SelectItem value="DE">Delaware</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
                <SelectItem value="GA">Georgia</SelectItem>
                <SelectItem value="HI">Hawaii</SelectItem>
                <SelectItem value="ID">Idaho</SelectItem>
                <SelectItem value="IL">Illinois</SelectItem>
                <SelectItem value="IN">Indiana</SelectItem>
                <SelectItem value="IA">Iowa</SelectItem>
                <SelectItem value="KS">Kansas</SelectItem>
                <SelectItem value="KY">Kentucky</SelectItem>
                <SelectItem value="LA">Louisiana</SelectItem>
                <SelectItem value="ME">Maine</SelectItem>
                <SelectItem value="MD">Maryland</SelectItem>
                <SelectItem value="MA">Massachusetts</SelectItem>
                <SelectItem value="MI">Michigan</SelectItem>
                <SelectItem value="MN">Minnesota</SelectItem>
                <SelectItem value="MS">Mississippi</SelectItem>
                <SelectItem value="MO">Missouri</SelectItem>
                <SelectItem value="MT">Montana</SelectItem>
                <SelectItem value="NE">Nebraska</SelectItem>
                <SelectItem value="NV">Nevada</SelectItem>
                <SelectItem value="NH">New Hampshire</SelectItem>
                <SelectItem value="NJ">New Jersey</SelectItem>
                <SelectItem value="NM">New Mexico</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="NC">North Carolina</SelectItem>
                <SelectItem value="ND">North Dakota</SelectItem>
                <SelectItem value="OH">Ohio</SelectItem>
                <SelectItem value="OK">Oklahoma</SelectItem>
                <SelectItem value="OR">Oregon</SelectItem>
                <SelectItem value="PA">Pennsylvania</SelectItem>
                <SelectItem value="RI">Rhode Island</SelectItem>
                <SelectItem value="SC">South Carolina</SelectItem>
                <SelectItem value="SD">South Dakota</SelectItem>
                <SelectItem value="TN">Tennessee</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="UT">Utah</SelectItem>
                <SelectItem value="VT">Vermont</SelectItem>
                <SelectItem value="VA">Virginia</SelectItem>
                <SelectItem value="WA">Washington</SelectItem>
                <SelectItem value="WV">West Virginia</SelectItem>
                <SelectItem value="WI">Wisconsin</SelectItem>
                <SelectItem value="WY">Wyoming</SelectItem>
                <SelectItem value="DC">District of Columbia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">Zip Code</label>
            <Input
              type="text"
              value={client.applicant?.previousAddress?.zipCode || ""}
              onChange={e => updateApplicant("zipCode", e.target.value, "previousAddress")}
              placeholder="12345"
              maxLength={5}
              pattern="[0-9]{5}"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">How Long at Previous Address</label>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium">Years</label>
                <Input
                  type="number"
                  value={client.applicant?.previousAddress?.howLongYears || "0"}
                  onChange={e => updateApplicant("howLongYears", Number(e.target.value), "previousAddress")}
                  placeholder="Years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Months</label>
                <Input
                  type="number"
                  value={client.applicant?.previousAddress?.howLongMonths || "0"}
                  onChange={e => updateApplicant("howLongMonths", Number(e.target.value), "previousAddress")}
                  placeholder="Months"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Current Employment Information */}
      <div className="mb-6">
        <h4 className="font-medium text-green-700 mb-3">Current Employment Information</h4>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-[400px]">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm text-black">Employment Status</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={!!client.applicant?.employment?.isBusinessOwner}
                      onCheckedChange={checked => updateApplicant("isBusinessOwner", checked, "employment")}
                    />
                    <label className="text-sm font-normal">Business Owner</label>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <label className="block text-sm font-medium">Employment Status</label>
                <Select
                  value={client.applicant?.employment?.employmentStatus || ""}
                  onValueChange={value => updateApplicant("employmentStatus", value, "employment")}
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
                value={client.applicant?.employment?.occupation || ""}
                onChange={e => updateApplicant("occupation", e.target.value, "employment")}
                placeholder="Enter occupation"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium">Employer Name</label>
              <Input
                value={client.applicant?.employment?.employerName || ""}
                onChange={e => updateApplicant("employerName", e.target.value, "employment")}
                placeholder="Enter employer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Employer Address</label>
              <Input
                value={client.applicant?.employment?.employerAddress || ""}
                onChange={e => updateApplicant("employerAddress", e.target.value, "employment")}
                placeholder="Enter employer address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">City</label>
              <Input
                value={client.applicant?.employment?.employerCity || ""}
                onChange={e => updateApplicant("employerCity", e.target.value, "employment")}
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">State</label>
              <Input
                value={client.applicant?.employment?.employerState || ""}
                onChange={e => updateApplicant("employerState", e.target.value, "employment")}
                placeholder="Enter state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Zip Code</label>
              <Input
                value={client.applicant?.employment?.employerZipCode || ""}
                onChange={e => updateApplicant("employerZipCode", e.target.value, "employment")}
                placeholder="Enter zip code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Gross Monthly Salary</label>
              <Input
                value={client.applicant?.employment?.monthlyGrossSalary || ""}
                onChange={e => updateApplicant("monthlyGrossSalary", Number(e.target.value), "employment")}
                placeholder="$0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={client.applicant?.employment?.startDate || ""}
                onChange={e => updateApplicant("startDate", e.target.value, "employment")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={client.applicant?.employment?.endDate || ""}
                onChange={e => updateApplicant("endDate", e.target.value, "employment")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Supervisor</label>
              <Input
                value={client.applicant?.employment?.supervisor || ""}
                onChange={e => updateApplicant("supervisor", e.target.value, "employment")}
                placeholder="Enter supervisor name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Supervisor Phone</label>
              <Input
                value={client.applicant?.employment?.supervisorPhone || ""}
                onChange={e => updateApplicant("supervisorPhone", e.target.value, "employment")}
                placeholder="Enter supervisor phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Additional Income</label>
              <Input
                value={client.applicant?.employment?.additionalIncome || ""}
                onChange={e => updateApplicant("additionalIncome", Number(e.target.value), "employment")}
                placeholder="$0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Source</label>
              <Input
                value={client.applicant?.employment?.source || ""}
                onChange={e => updateApplicant("source", e.target.value, "employment")}
                placeholder="Enter source"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Previous Employment */}
      <div className="mb-6">
        <h4 className="font-medium text-green-700 mb-3">Previous Employment</h4>
        <p className="text-sm text-gray-600 mb-4">Complete if employed less than 2 years with current employer</p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium">Employer Name</label>
            <Input
              value={client.applicant?.previousEmployment?.employerName || ""}
              onChange={e => updateApplicant("employerName", e.target.value, "previousEmployment")}
              placeholder="Enter employer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Employer Address</label>
            <Input
              value={client.applicant?.previousEmployment?.employerAddress || ""}
              onChange={e => updateApplicant("employerAddress", e.target.value, "previousEmployment")}
              placeholder="Enter employer address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <Input
              value={client.applicant?.previousEmployment?.city || ""}
              onChange={e => updateApplicant("city", e.target.value, "previousEmployment")}
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">State</label>
            <Input
              value={client.applicant?.previousEmployment?.state || ""}
              onChange={e => updateApplicant("state", e.target.value, "previousEmployment")}
              placeholder="Enter state"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Zip Code</label>
            <Input
              value={client.applicant?.previousEmployment?.zipCode || ""}
              onChange={e => updateApplicant("zipCode", e.target.value, "previousEmployment")}
              placeholder="Enter zip code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Occupation</label>
            <Input
              value={client.applicant?.previousEmployment?.occupation || ""}
              onChange={e => updateApplicant("occupation", e.target.value, "previousEmployment")}
              placeholder="Enter occupation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">From Date</label>
            <Input
              type="date"
              value={client.applicant?.previousEmployment?.fromDate || ""}
              onChange={e => updateApplicant("fromDate", e.target.value, "previousEmployment")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">To Date</label>
            <Input
              type="date"
              value={client.applicant?.previousEmployment?.toDate || ""}
              onChange={e => updateApplicant("toDate", e.target.value, "previousEmployment")}
            />
          </div>
        </div>
      </div>
      {/* Demographic Information */}
      <div className="mb-6">
        <h4 className="font-medium text-green-700 mb-3">Demographic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium">Birth Place</label>
            <Input
              value={client.applicant?.demographics?.birthPlace || ""}
              onChange={e => updateApplicant("birthPlace", e.target.value, "demographics")}
              placeholder="Enter birth place"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <Input
              type="date"
              value={client.applicant?.demographics?.dateOfBirth || ""}
              onChange={e => updateApplicant("dateOfBirth", e.target.value, "demographics")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">SSN</label>
            <Input
              value={client.applicant?.demographics?.ssn || ""}
              onChange={e => updateApplicant("ssn", e.target.value, "demographics")}
              placeholder="XXX-XX-XXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Race</label>
            <Select
              value={client.applicant?.demographics?.race || ""}
              onValueChange={value => updateApplicant("race", value, "demographics")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select race" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="American Indian or Alaska Native">American Indian or Alaska Native</SelectItem>
                <SelectItem value="Asian">Asian</SelectItem>
                <SelectItem value="Black or African American">Black or African American</SelectItem>
                <SelectItem value="Hispanic">Hispanic</SelectItem>
                <SelectItem value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</SelectItem>
                <SelectItem value="White">White</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Prefer not to answer">Prefer not to answer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">Marital Status</label>
            <Select
              value={client.applicant?.demographics?.maritalStatus || ""}
              onValueChange={value => updateApplicant("maritalStatus", value, "demographics")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">Anniversary</label>
            <Input
              type="date"
              value={client.applicant?.demographics?.anniversary || ""}
              onChange={e => updateApplicant("anniversary", e.target.value, "demographics")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Spouse Name</label>
            <Input
              value={client.applicant?.demographics?.spouseName || ""}
              onChange={e => updateApplicant("spouseName", e.target.value, "demographics")}
              placeholder="Enter spouse name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Spouse Occupation</label>
            <Input
              value={client.applicant?.demographics?.spouseOccupation || ""}
              onChange={e => updateApplicant("spouseOccupation", e.target.value, "demographics")}
              placeholder="Enter spouse occupation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Number of Dependents</label>
            <Input
              type="number"
              value={client.applicant?.demographics?.numberOfDependents || ""}
              onChange={e => updateApplicant("numberOfDependents", Number(e.target.value), "demographics")}
              placeholder="Number of dependents"
            />
          </div>
        </div>
      </div>
      {/* Household Members */}
      <div className="mb-6">
        <h4 className="font-medium text-green-700 mb-3">Household Members</h4>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-green-100 px-4 py-2">
            <div className="grid grid-cols-9 gap-2 text-sm font-medium text-green-800">
              <div>First Name</div>
              <div>M.I.</div>
              <div>Last Name</div>
              <div>Relationship</div>
              <div>Date of Birth</div>
              <div>Age</div>
              <div>Sex</div>
              <div>SSN</div>
              <div>Actions</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {householdMembers.map((member, index) => (
              <div key={index} className="px-4 py-3">
                <div className="grid grid-cols-9 gap-2">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={member.firstName}
                    onChange={(e) => updateHouseholdMember(index, "firstName", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="MI"
                    maxLength={1}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={member.middleInitial}
                    onChange={(e) => updateHouseholdMember(index, "middleInitial", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={member.lastName}
                    onChange={(e) => updateHouseholdMember(index, "lastName", e.target.value)}
                  />
                  <select 
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={member.relationship}
                    onChange={(e) => updateHouseholdMember(index, "relationship", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Applicant">Applicant</option>
                    <option value="Co-Applicant">Co-Applicant</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Partner">Partner</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="date"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={member.dateOfBirth}
                    onChange={(e) => updateHouseholdMember(index, "dateOfBirth", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    min="0"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={member.age}
                    onChange={(e) => updateHouseholdMember(index, "age", Number(e.target.value))}
                  />
                  <select 
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={member.sex}
                    onChange={(e) => updateHouseholdMember(index, "sex", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {/* Marital Status dropdown for household member */}
                  <select
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={member.maritalStatus}
                    onChange={e => updateHouseholdMember(index, "maritalStatus", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                  <input
                    type="text"
                    placeholder="XXX-XX-XXXX"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={member.ssn}
                    onChange={(e) => updateHouseholdMember(index, "ssn", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeHouseholdMember(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={addHouseholdMember}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Household Member
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
