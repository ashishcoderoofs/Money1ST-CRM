import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Shield, User, Mail, Phone, MapPin, Calendar, Building, Award } from "lucide-react";
import { useAdminUserById } from "@/hooks/useAdminAPI";
import { format } from "date-fns";

export default function UserDetails() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useAdminUserById(userId);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  if (isLoading) {
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
        <p className="text-muted-foreground mb-6">The user you're looking for doesn't exist or has been deleted.</p>
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
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate(`/admin/users/${userId}/edit`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit User
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </div>
      </div>

      {/* Main Information Card */}
      <Card>
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Main Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Consultant ID</label>
              <p className="text-lg font-semibold">{user.consultantId || "Not assigned"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Position</label>
              <p className="text-lg">{user.position || "Not specified"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <div className="mt-1">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Award className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Title</label>
              <p className="text-lg">{user.title || "Not specified"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-lg">
                {[user.title, user.firstName, user.middleInitial, user.lastName, user.suffix]
                  .filter(Boolean)
                  .join(" ")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card>
        <CardHeader className="bg-green-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Mobile
              </label>
              <p className="text-lg">{user.mobile || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Home Phone
              </label>
              <p className="text-lg">{user.homePhone || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Work Phone
              </label>
              <p className="text-lg">{user.workPhone || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Other Phone
              </label>
              <p className="text-lg">{user.otherPhone || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fax</label>
              <p className="text-lg">{user.fax || "Not provided"}</p>
            </div>
          </div>

          {/* Address Section */}
          {(user.address || user.city || user.state || user.zipCode) && (
            <div className="mt-6 pt-6 border-t">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-3">
                <MapPin className="w-4 h-4" />
                Address
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-lg">
                  {[
                    user.address,
                    [user.city, user.state].filter(Boolean).join(", "),
                    user.zipCode
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </p>
                {user.county && (
                  <p className="text-sm text-muted-foreground mt-1">
                    County: {user.county}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information Card */}
      <Card>
        <CardHeader className="bg-purple-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {user.comment && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Comments</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{user.comment}</p>
              </div>
            </div>
          )}
          {user.remarks && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Remarks</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{user.remarks}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Information Card */}
      <Card>
        <CardHeader className="bg-gray-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Entry Date</label>
              <p className="text-lg">
                {user.entryDate ? formatDate(user.entryDate) : "Not available"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Login</label>
              <p className="text-lg">
                {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Created</label>
              <p className="text-lg">
                {user.createdAt ? formatDate(user.createdAt) : "Not available"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created By</label>
              <p className="text-lg">
                {user.createdBy?.firstName && user.createdBy?.lastName
                  ? `${user.createdBy.firstName} ${user.createdBy.lastName}`
                  : "System"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
