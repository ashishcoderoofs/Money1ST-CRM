import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Calendar } from "lucide-react";
import { useCreateConsultant, useUpdateConsultant, type ConsultantData } from "@/hooks/useConsultantAPI";

// Enhanced schema based on the backend model
export const consultantFormSchema = z.object({
  // Basic Information
  consultantId: z.string().optional(),
  entryDate: z.string().min(1, "Entry date is required"),
  position: z.string().optional(),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  middleInitial: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  suffix: z.string().optional(),
  comment: z.string().optional(),
  remarks: z.string().optional(),

  // Contact Information
  email: z.string().email("Invalid email address"),
  maidenName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  homePhone: z.string().optional(),
  mobile: z.string().optional(),
  workPhone: z.string().optional(),
  otherPhone: z.string().optional(),
  fax: z.string().optional(),
  membershipType: z.string().optional(),
  amount: z.coerce.number().optional().nullable(),
  jointMemberName: z.string().optional(),

  // Personal Information
  dateOfBirth: z.string().optional(),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed', 'Separated']).optional(),
  sex: z.enum(['Male', 'Female', 'Other']).optional(),
  race: z.string().optional(),
  spouseName: z.string().optional(),
  anniversary: z.string().optional(),
  spouseOccupation: z.string().optional(),
  educationLevel: z.enum(['High School', 'Associate Degree', 'Bachelor Degree', 'Master Degree', 'Doctorate', 'Other']).optional(),
  driversLicenseNumber: z.string().optional(),
  driversLicenseState: z.string().optional(),
  employmentStatus: z.enum(['Employed', 'Unemployed', 'Self-Employed', 'Retired', 'Student', 'Part time', 'Contract']).optional(),
  employer: z.string().optional(),
  occupation: z.string().optional(),
  industry: z.string().optional(),

  // CFS Information
  ssn: z.string().optional(),
  ein: z.string().optional(),
  hireDate: z.string().optional(),
  yearsWithFrq: z.coerce.number().optional().nullable(),
  companyName: z.string().optional(),
  cfsCertificationDate: z.string().optional(),
  effectiveDate: z.string().optional(),
  memberType: z.string().optional(),
  mbrAmt: z.coerce.number().optional().nullable(),
  payType: z.string().optional(),
  mpFee: z.coerce.number().optional().nullable(),
  cfsStatus: z.string().optional(),
  statusDate: z.string().optional(),

  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

export type ConsultantFormValues = z.infer<typeof consultantFormSchema>;

interface ConsultantFormApiProps {
  onSuccess?: () => void;
  defaultValues?: Partial<ConsultantData>;
  isEditMode?: boolean;
  consultantId?: string;
}

export function ConsultantFormApi({
  onSuccess,
  defaultValues,
  isEditMode = false,
  consultantId
}: ConsultantFormApiProps) {
  const [currentTab, setCurrentTab] = useState("contact");
  
  const createConsultant = useCreateConsultant();
  const updateConsultant = useUpdateConsultant();

  const form = useForm<ConsultantFormValues>({
    resolver: zodResolver(consultantFormSchema),
    defaultValues: {
      // Basic Information
      consultantId: "",
      entryDate: new Date().toISOString().split('T')[0],
      position: "",
      status: 'Active' as const,
      title: "",
      firstName: "",
      middleInitial: "",
      lastName: "",
      suffix: "",
      comment: "",
      remarks: "",
      
      // Contact Information
      email: "",
      maidenName: "",
      address: "",
      city: "",
      county: "",
      state: "",
      zipCode: "",
      homePhone: "",
      mobile: "",
      workPhone: "",
      otherPhone: "",
      fax: "",
      membershipType: "",
      amount: undefined,
      jointMemberName: "",

      // Personal Information
      dateOfBirth: "",
      maritalStatus: undefined,
      sex: undefined,
      race: "",
      spouseName: "",
      anniversary: "",
      spouseOccupation: "",
      educationLevel: undefined,
      driversLicenseNumber: "",
      driversLicenseState: "",
      employmentStatus: undefined,
      employer: "",
      occupation: "",
      industry: "",

      // CFS Information
      ssn: "",
      ein: "",
      hireDate: "",
      yearsWithFrq: undefined,
      companyName: "",
      cfsCertificationDate: "",
      effectiveDate: "",
      memberType: "",
      mbrAmt: undefined,
      payType: "",
      mpFee: undefined,
      cfsStatus: "",
      statusDate: "",

      // Emergency Contact
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
    },
  });

  // Helper function to convert Date objects to string format for form inputs
  const convertDateToString = (date: any): string => {
    if (!date) return "";
    if (typeof date === 'string') return date.split('T')[0]; // Handle ISO strings
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return "";
  };

  // Use useEffect to set form values when defaultValues change
  useEffect(() => {
    if (defaultValues && isEditMode) {
      // Create a safe defaults object with proper type conversion
      const safeDefaults: Partial<ConsultantFormValues> = {};
      
      // Handle all fields with proper type conversion
      Object.keys(defaultValues).forEach(key => {
        const value = defaultValues[key as keyof typeof defaultValues];
        if (value !== undefined && value !== null) {
          // Convert Date fields to string format
          if (key === 'entryDate' || key === 'dateOfBirth' || key === 'anniversary' || 
              key === 'hireDate' || key === 'cfsCertificationDate' || key === 'effectiveDate' || 
              key === 'statusDate') {
            (safeDefaults as any)[key] = convertDateToString(value);
          } else {
            (safeDefaults as any)[key] = value;
          }
        }
      });

      const finalFormData = {
        // Set default values for required fields
        entryDate: safeDefaults.entryDate || new Date().toISOString().split('T')[0],
        status: (safeDefaults.status as 'Active' | 'Inactive') || 'Active',
        firstName: safeDefaults.firstName || "",
        lastName: safeDefaults.lastName || "",
        email: safeDefaults.email || "",
        // Apply all other fields
        ...safeDefaults,
      };

      form.reset(finalFormData);
    }
  }, [defaultValues, isEditMode, form]);

  const isLoading = createConsultant.isPending || updateConsultant.isPending;

  const handleFormSubmit = async (values: ConsultantFormValues) => {
    try {
      // Prepare data for API - ensure required fields are present
      const apiData = {
        ...values,
        firstName: values.firstName || "",
        lastName: values.lastName || "",
        email: values.email || "",
      };

      if (isEditMode && consultantId) {
        await updateConsultant.mutateAsync({ id: consultantId, data: apiData });
      } else {
        await createConsultant.mutateAsync(apiData);
      }
      onSuccess?.();
      if (!isEditMode) {
        form.reset();
        setCurrentTab("contact");
      }
    } catch (error) {
      // Error is handled by the hooks
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Main Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Main Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="consultantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultant ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Auto-generated if empty" 
                      value={field.value || ""}
                      onChange={field.onChange}
                      name={field.name}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Date *</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      value={field.value || ""}
                      onChange={field.onChange}
                      name={field.name}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Field Builder">Field Builder</SelectItem>
                      <SelectItem value="Field Trainer">Field Trainer</SelectItem>
                      <SelectItem value="Senior BMA">Senior BMA</SelectItem>
                      <SelectItem value="BMA">BMA</SelectItem>
                      <SelectItem value="IBA">IBA</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Mrs.">Mrs.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                      <SelectItem value="Miss">Miss</SelectItem>
                      <SelectItem value="Dr.">Dr.</SelectItem>
                      <SelectItem value="Prof.">Prof.</SelectItem>
                      <SelectItem value="Rev.">Rev.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div></div> {/* Empty div for grid alignment */}

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ""}
                      onChange={field.onChange}
                      name={field.name}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="middleInitial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MI</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ""}
                      onChange={field.onChange}
                      name={field.name}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="suffix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suffix</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-3">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add a comment..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-3">
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add remarks..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Sections */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="cfs">CFS Information</TabsTrigger>
            <TabsTrigger value="lineage">Lineage</TabsTrigger>
          </TabsList>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maidenName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maiden or Other Name Used</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          value={field.value || ""}
                          onChange={field.onChange}
                          name={field.name}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fax</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="membershipType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membership Type</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="jointMemberName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Joint Member's Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                          <SelectItem value="Separated">Separated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-3">
                  <FormField
                    control={form.control}
                    name="race"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Race/Ethnicity</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="anniversary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anniversary</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div></div>

                <div></div>

                <FormField
                  control={form.control}
                  name="spouseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spouse's Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spouseOccupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spouse's Occupation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div></div>

                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="High School">High School</SelectItem>
                          <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                          <SelectItem value="Bachelor Degree">Bachelor Degree</SelectItem>
                          <SelectItem value="Master Degree">Master Degree</SelectItem>
                          <SelectItem value="Doctorate">Doctorate</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="driversLicenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver's License Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="driversLicenseState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver's License State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Employment Status</FormLabel> */}
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Employed">Employed</SelectItem>
                          <SelectItem value="Unemployed">Unemployed</SelectItem>
                          <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                          <SelectItem value="Retired">Retired</SelectItem>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Part time">Part time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-3">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CFS Information Tab */}
          <TabsContent value="cfs">
            <Card>
              <CardHeader>
                <CardTitle>CFS Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="ssn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSN</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EIN</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hireDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hire Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearsWithFrq"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years with FRQ</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cfsCertificationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CFS Certification Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="effectiveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effective Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="memberType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member Type</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mbrAmt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member Amount</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pay Type</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mpFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MP Fee</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cfsStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CFS Status</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="statusDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lineage Tab */}
          <TabsContent value="lineage">
            <Card>
              <CardHeader>
                <CardTitle>Lineage Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Relationship</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setCurrentTab("contact");
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Update' : 'Create'} Consultant
          </Button>
        </div>
      </form>
    </Form>
  );
}
