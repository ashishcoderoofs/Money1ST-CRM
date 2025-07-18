import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateUser } from '@/hooks/useAdminAPI';
import { UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function AdminUserCreation() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    consultantId: '',
    isAdmin: false
  });

  const createUserMutation = useCreateUser();

  const roles = ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA'];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      role: value,
      // Automatically set isAdmin to true if role is Admin
      isAdmin: value === 'Admin' ? true : prev.isAdmin
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        consultantId: formData.consultantId || undefined,
        isAdmin: formData.isAdmin
      };

      await createUserMutation.mutateAsync(userData);
      
      toast({ title: "Success", description: "User created successfully" });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        consultantId: '',
        isAdmin: false
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Create New User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultantId">Consultant ID</Label>
              <Input
                id="consultantId"
                value={formData.consultantId}
                onChange={(e) => handleInputChange('consultantId', e.target.value)}
                placeholder="Enter consultant ID (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Main Role *</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isAdmin">Additional Admin Privileges</Label>
              <Select 
                value={formData.isAdmin ? "true" : "false"} 
                onValueChange={(value) => handleInputChange('isAdmin', value === "true")}
                disabled={formData.role === 'Admin'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select admin privileges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Grant Admin Access</SelectItem>
                  <SelectItem value="false">Standard Access</SelectItem>
                </SelectContent>
              </Select>
              {formData.role === 'Admin' ? (
                <p className="text-sm text-muted-foreground">
                  ✅ Admin role automatically grants admin privileges
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Choose whether this user should have admin privileges in addition to their main role
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password (min 6 characters)"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: '',
                consultantId: '',
                isAdmin: false
              })}
            >
              Reset Form
            </Button>
            <Button 
              type="submit" 
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </div>
              ) : (
                'Create User'
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Role Descriptions:</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p><strong>Admin:</strong> Full system access and user management</p>
            <p><strong>Field Builder:</strong> Senior field management role</p>
            <p><strong>Field Trainer:</strong> Training and development role</p>
            <p><strong>Senior BMA:</strong> Senior Business Manager Associate</p>
            <p><strong>BMA:</strong> Business Manager Associate</p>
            <p><strong>IBA:</strong> Independent Business Associate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
