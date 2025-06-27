
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Constants } from "@/integrations/supabase/types";
import { useConsultants } from "@/hooks/consultant";
import { Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DependentsManager } from "@/components/DependentsManager";
import { LicensesManager } from "@/components/LicensesManager";
import { PaymentsManager } from "@/components/PaymentsManager";
import { BasicInfoSection } from "@/components/consultant-form/BasicInfoSection";
import { ContactInfoSection } from "@/components/consultant-form/ContactInfoSection";
import { EmergencyContactSection } from "@/components/consultant-form/EmergencyContactSection";
import { CFSInfoSection } from "@/components/consultant-form/CFSInfoSection";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const consultantFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  role: z.enum(Constants.public.Enums.user_role),
  manager_id: z.string().optional().nullable(),
  comment: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
  maiden_name: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zip_code: z.string().optional().nullable(),
  mobile_phone: z.string().optional().nullable(),
  work_phone: z.string().optional().nullable(),
  other_phone: z.string().optional().nullable(),
  fax: z.string().optional().nullable(),
  membership_type: z.string().optional().nullable(),
  amount: z.coerce.number().optional().nullable(),
  joint_member_name: z.string().optional().nullable(),
  emergency_contact_name: z.string().optional().nullable(),
  emergency_contact_relationship: z.string().optional().nullable(),
  emergency_contact_phone: z.string().optional().nullable(),
  consultant_id: z.string().optional().nullable(),
  entry_date: z.string().optional().nullable(),
  status: z.enum(Constants.public.Enums.consultant_status).optional(),
  title: z.string().optional().nullable(),
  mi: z.string().optional().nullable(),
  suffix: z.string().optional().nullable(),
  dob: z.string().optional().nullable(),
  marital_status: z.string().optional().nullable(),
  sex: z.string().optional().nullable(),
  race: z.string().optional().nullable(),
  spouse_name: z.string().optional().nullable(),
  anniversary: z.string().optional().nullable(),
  spouse_occupation: z.string().optional().nullable(),
  education_level: z.string().optional().nullable(),
  drivers_license_number: z.string().optional().nullable(),
  drivers_license_state: z.string().optional().nullable(),
  employment_status: z.string().optional().nullable(),
  employer: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  ein: z.string().optional().nullable(),
  hire_date: z.string().optional().nullable(),
  years_with_frq: z.coerce.number().optional().nullable(),
  company_name: z.string().optional().nullable(),
  cfs_certification_date: z.string().optional().nullable(),
  effective_date: z.string().optional().nullable(),
  member_type: z.string().optional().nullable(),
  mbr_amt: z.coerce.number().optional().nullable(),
  pay_type: z.string().optional().nullable(),
  mp_fee: z.coerce.number().optional().nullable(),
  cfs_status: z.string().optional().nullable(),
  status_date: z.string().optional().nullable(),
});

export type ConsultantFormValues = z.infer<typeof consultantFormSchema>;

interface ConsultantFormProps {
  onSubmit: (values: ConsultantFormValues) => void;
  defaultValues?: Partial<Profile>;
  isLoading: boolean;
  isEditMode?: boolean;
}

export function ConsultantForm({
  onSubmit,
  defaultValues,
  isLoading,
  isEditMode = false,
}: ConsultantFormProps) {
  const form = useForm<ConsultantFormValues>({
    resolver: zodResolver(consultantFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: undefined,
      manager_id: "no-manager",
      comment: "",
      remarks: "",
      maiden_name: "",
      address: "",
      city: "",
      county: "",
      state: "",
      zip_code: "",
      mobile_phone: "",
      work_phone: "",
      other_phone: "",
      fax: "",
      membership_type: "",
      amount: undefined,
      joint_member_name: "",
      emergency_contact_name: "",
      emergency_contact_relationship: "",
      emergency_contact_phone: "",
      consultant_id: "",
      entry_date: "",
      status: "Active",
      title: "placeholder",
      mi: "",
      suffix: "",
      dob: "",
      marital_status: "placeholder",
      sex: "placeholder",
      race: "",
      spouse_name: "",
      anniversary: "",
      spouse_occupation: "",
      education_level: "placeholder",
      drivers_license_number: "",
      drivers_license_state: "",
      employment_status: "placeholder",
      employer: "",
      occupation: "",
      industry: "",
      ssn: "",
      ein: "",
      hire_date: "",
      years_with_frq: undefined,
      company_name: "",
      cfs_certification_date: "",
      effective_date: "",
      member_type: "",
      mbr_amt: undefined,
      pay_type: "",
      mp_fee: undefined,
      cfs_status: "",
      status_date: "",
    },
  });

  // Reset form with defaultValues when they change
  useEffect(() => {
    if (defaultValues && isEditMode) {
      console.log("Setting form values with defaultValues:", defaultValues);
      
      const formData = {
        first_name: defaultValues.first_name || "",
        last_name: defaultValues.last_name || "",
        email: defaultValues.email || "",
        phone: defaultValues.phone || "",
        role: defaultValues.role,
        manager_id: defaultValues.manager_id || "no-manager",
        comment: defaultValues.comment || "",
        remarks: defaultValues.remarks || "",
        maiden_name: defaultValues.maiden_name || "",
        address: defaultValues.address || "",
        city: defaultValues.city || "",
        county: defaultValues.county || "",
        state: defaultValues.state || "",
        zip_code: defaultValues.zip_code || "",
        mobile_phone: defaultValues.mobile_phone || "",
        work_phone: defaultValues.work_phone || "",
        other_phone: defaultValues.other_phone || "",
        fax: defaultValues.fax || "",
        membership_type: defaultValues.membership_type || "",
        amount: defaultValues.amount || undefined,
        joint_member_name: defaultValues.joint_member_name || "",
        emergency_contact_name: defaultValues.emergency_contact_name || "",
        emergency_contact_relationship: defaultValues.emergency_contact_relationship || "",
        emergency_contact_phone: defaultValues.emergency_contact_phone || "",
        consultant_id: "",
        entry_date: defaultValues.created_at ? new Date(defaultValues.created_at).toISOString().split('T')[0] : "",
        status: defaultValues.status || "Active",
        title: (defaultValues as any).title || "placeholder",
        mi: (defaultValues as any).mi || "",
        suffix: (defaultValues as any).suffix || "",
        dob: defaultValues.dob ? new Date(defaultValues.dob).toISOString().split('T')[0] : "",
        marital_status: defaultValues.marital_status || "placeholder",
        sex: defaultValues.sex || "placeholder",
        race: defaultValues.race || "",
        spouse_name: defaultValues.spouse_name || "",
        anniversary: defaultValues.anniversary ? new Date(defaultValues.anniversary).toISOString().split('T')[0] : "",
        spouse_occupation: defaultValues.spouse_occupation || "",
        education_level: defaultValues.education_level || "placeholder",
        drivers_license_number: defaultValues.drivers_license_number || "",
        drivers_license_state: defaultValues.drivers_license_state || "",
        employment_status: defaultValues.employment_status || "placeholder",
        employer: defaultValues.employer || "",
        occupation: defaultValues.occupation || "",
        industry: defaultValues.industry || "",
        ssn: defaultValues.ssn || "",
        ein: defaultValues.ein || "",
        hire_date: defaultValues.hire_date ? new Date(defaultValues.hire_date).toISOString().split('T')[0] : "",
        years_with_frq: defaultValues.years_with_frq || undefined,
        company_name: defaultValues.company_name || "",
        cfs_certification_date: defaultValues.cfs_certification_date ? new Date(defaultValues.cfs_certification_date).toISOString().split('T')[0] : "",
        effective_date: defaultValues.effective_date ? new Date(defaultValues.effective_date).toISOString().split('T')[0] : "",
        member_type: defaultValues.member_type || "",
        mbr_amt: defaultValues.mbr_amt || undefined,
        pay_type: defaultValues.pay_type || "",
        mp_fee: defaultValues.mp_fee || undefined,
        cfs_status: defaultValues.cfs_status || "",
        status_date: defaultValues.status_date ? new Date(defaultValues.status_date).toISOString().split('T')[0] : "",
      };
      
      console.log("Form data being set:", formData);
      form.reset(formData);
    }
  }, [defaultValues, isEditMode, form]);

  const { data: consultants, isLoading: isLoadingConsultants } = useConsultants();
  
  const getFullName = (firstName: string | null, lastName: string | null) => {
    return [firstName, lastName].filter(Boolean).join(" ");
  }

  const handleFormSubmit = (values: ConsultantFormValues) => {
    console.log("Form submitted with values:", values);
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Main Information Section */}
        <Card>
          <CardHeader className="bg-blue-500 text-white">
            <CardTitle>Main Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="consultant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultant ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="CON007" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "placeholder"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="placeholder" disabled>Select a position</SelectItem>
                        {Constants.public.Enums.user_role.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "placeholder"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="placeholder" disabled>Select status</SelectItem>
                        {Constants.public.Enums.consultant_status.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
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
                    <Select onValueChange={field.onChange} value={field.value || "placeholder"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="placeholder" disabled>Select title</SelectItem>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Tristan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MI</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="McLean" {...field} />
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
                      <Input placeholder="" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Comment and Remarks */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add a comment..." {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add remarks..." {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="cfs">CFS Information</TabsTrigger>
            <TabsTrigger value="lineage">Lineage</TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="mt-4">
            <Card>
              <CardContent className="p-6 space-y-6">
                <ContactInfoSection form={form} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal" className="mt-4">
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="marital_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || "placeholder"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="placeholder" disabled>Select status</SelectItem>
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
                          <Select onValueChange={field.onChange} value={field.value || "placeholder"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sex" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="placeholder" disabled>Select sex</SelectItem>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="race"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Race/Ethnicity</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="anniversary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anniversary</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="spouse_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spouse's Name</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="spouse_occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spouse's Occupation</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="education_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "placeholder"}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select education level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="placeholder" disabled>Select education level</SelectItem>
                            <SelectItem value="High School">High School</SelectItem>
                            <SelectItem value="Some College">Some College</SelectItem>
                            <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                            <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                            <SelectItem value="Doctorate">Doctorate</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="drivers_license_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver's License Number</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="drivers_license_state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver's License State</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="employment_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || "placeholder"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="placeholder" disabled>Select status</SelectItem>
                              <SelectItem value="Employed">Employed</SelectItem>
                              <SelectItem value="Unemployed">Unemployed</SelectItem>
                              <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                              <SelectItem value="Retired">Retired</SelectItem>
                              <SelectItem value="Student">Student</SelectItem>
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
                            <Input placeholder="" {...field} value={field.value ?? ''} />
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
                            <Input placeholder="" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Emergency Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <EmergencyContactSection form={form} />
                </CardContent>
              </Card>

              {/* Dependents */}
              {isEditMode && defaultValues?.id && (
                <DependentsManager consultantId={defaultValues.id} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="cfs" className="mt-4">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>CFS Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CFSInfoSection form={form} />
                </CardContent>
              </Card>

              {/* Licenses and Payments sections only show in edit mode */}
              {isEditMode && defaultValues?.id && (
                <>
                  <LicensesManager consultantId={defaultValues.id} />
                  <PaymentsManager consultantId={defaultValues.id} />
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="lineage" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="manager_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager (Upline)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "no-manager"} disabled={isLoadingConsultants}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a manager" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="no-manager">No Manager</SelectItem>
                          {consultants?.filter(c => c.id !== defaultValues?.id).map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {getFullName(c.first_name, c.last_name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="bg-gray-800 hover:bg-gray-700">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Consultant Profile" : "Create Consultant"}
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
