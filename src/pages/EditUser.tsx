import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, X, User } from "lucide-react";
import { useAdminUserById, useUpdateAdminUser } from "@/hooks/useAdminAPI";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";

const ROLES = ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA'];

const userEditSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA']),
  consultantId: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(['Active', 'Inactive']),
  title: z.string().optional(),
  middleInitial: z.string().optional(),
  suffix: z.string().optional(),
  mobile: z.string().optional(),
  homePhone: z.string().optional(),
  workPhone: z.string().optional(),
  otherPhone: z.string().optional(),
  fax: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  comment: z.string().optional(),
  remarks: z.string().optional(),
  isAdmin: z.boolean().optional(),
});

type UserEditFormValues = z.infer<typeof userEditSchema>;

export default function EditUser() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  console.log("EditUser - userId from params:", userId);
  
  const { data: user, isLoading: isLoadingUser, error } = useAdminUserById(userId);
  const updateUserMutation = useUpdateAdminUser();

  console.log("EditUser - user data:", user);
  console.log("EditUser - loading:", isLoadingUser);
  console.log("EditUser - error:", error);

  const form = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "IBA",
      consultantId: "",
      position: "",
      status: "Active",
      title: "",
      middleInitial: "",
      suffix: "",
      mobile: "",
      homePhone: "",
      workPhone: "",
      otherPhone: "",
      fax: "",
      address: "",
      city: "",
      county: "",
      state: "",
      zipCode: "",
      comment: "",
      remarks: "",
      isAdmin: false,
    },
  });

  // Update form with user data when loaded
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "IBA",
        consultantId: user.consultantId || "",
        position: user.position || "",
        status: (user.status as "Active" | "Inactive") || "Active",
        title: user.title || "",
        middleInitial: user.middleInitial || "",
        suffix: user.suffix || "",
        mobile: user.mobile || "",
        homePhone: user.homePhone || "",
        workPhone: user.workPhone || "",
        otherPhone: user.otherPhone || "",
        fax: user.fax || "",
        address: user.address || "",
        city: user.city || "",
        county: user.county || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        comment: user.comment || "",
        remarks: user.remarks || "",
        isAdmin: user.isAdmin || false,
      });
    }
  }, [user, form]);

  const onSubmit = async (values: UserEditFormValues) => {
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    try {
      // Convert form values to the expected format for MongoDB API
      await updateUserMutation.mutateAsync({
        userId,
        userData: values,
      });
      toast.success("User updated successfully!");
      navigate(`/admin/users/${userId}`);
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.message || "Failed to update user");
    }
  };

  if (isLoadingUser) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">User Not Found</h2>
        <p className="text-muted-foreground mb-6">The user you're trying to edit doesn't exist or has been deleted.</p>
        <Button onClick={() => navigate("/admin")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin Panel
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8" />
            Edit User: {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground">Update user information and permissions</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/users/${userId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to User Details
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Information */}
          <Card>
            <CardHeader className="bg-blue-500 text-white">
              <CardTitle>Main Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="consultantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultant ID</FormLabel>
                      <FormControl>
                        <Input placeholder="CON001" {...field} />
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
                      <FormControl>
                        <Input placeholder="Financial Consultant" {...field} />
                      </FormControl>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
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
              </div>

              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
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
                        <Input placeholder="D" {...field} />
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
                        <Input placeholder="Smith" {...field} />
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
                        <Input placeholder="Jr." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.smith@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Role and Admin Privileges Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Role *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ROLES.map((role) => (
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
                
                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => {
                    const currentRole = form.watch("role");
                    const isAdminRole = currentRole === "Admin";
                    
                    // Automatically set isAdmin to true if role is Admin
                    useEffect(() => {
                      if (isAdminRole) {
                        form.setValue("isAdmin", true);
                      }
                    }, [isAdminRole]);

                    return (
                      <FormItem>
                        <FormLabel>Additional Admin Privileges</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={(value) => field.onChange(value === "true")} 
                            value={field.value ? "true" : "false"}
                            disabled={isAdminRole}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Grant Admin Access</SelectItem>
                              <SelectItem value="false">Standard Access</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {isAdminRole ? (
                          <p className="text-sm text-muted-foreground">
                            ✅ Admin role automatically grants admin privileges
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Choose whether this user should have admin privileges in addition to their main role
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader className="bg-green-500 text-white">
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Phone Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
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
                        <Input placeholder="(555) 123-4567" {...field} />
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
                      <FormLabel>Work Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
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
                      <FormLabel>Other Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Fax */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fax</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Dallas" {...field} />
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
                          <Input placeholder="Dallas County" {...field} />
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
                          <Input placeholder="TX" {...field} />
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
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="75201" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader className="bg-purple-500 text-white">
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any comments..." {...field} />
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
                      <Textarea placeholder="Add any remarks..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center py-6">
            <Button 
              type="submit" 
              disabled={updateUserMutation.isPending}
              className="bg-gray-800 hover:bg-gray-900 px-8"
            >
              <Save className="w-4 h-4 mr-1" />
              {updateUserMutation.isPending ? "Updating..." : "Update User"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/admin/users/${userId}`)}
              disabled={updateUserMutation.isPending}
              className="px-8"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
