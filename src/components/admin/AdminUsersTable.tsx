import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  useAdminUsers, 
  useToggleUserStatus, 
  useUpdateUserRole, 
  useResetUserPassword 
} from '@/hooks/useAdminAPI';
import { Search, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Types
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  consultantId?: string;
}

interface Filters {
  page: number;
  limit: number;
  role: string;
  isActive: string;
  search: string;
}

// Constants
const ROLES = ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA'];

export function AdminUsersTable() {
  // State
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 10,
    role: 'all',
    isActive: 'all',
    search: ''
  });
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // API Hooks
  const { data: usersData, isLoading } = useAdminUsers(filters);
  const toggleStatusMutation = useToggleUserStatus();
  const updateRoleMutation = useUpdateUserRole();
  const resetPasswordMutation = useResetUserPassword();

  // Derived State
  const users: User[] = usersData?.users || [];
  const pagination = usersData?.pagination || {};

  // Utility Functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const showToast = (type: 'success' | 'error', title: string, description: string) => {
    toast({
      title,
      description,
      variant: type === 'error' ? 'destructive' : 'default',
    });
  };

  // Event Handlers
  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleStatusMutation.mutateAsync(userId);
      showToast('success', 'Success', 'User status updated successfully');
    } catch (error: any) {
      showToast('error', 'Error', error.message);
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await updateRoleMutation.mutateAsync({ userId, role });
      showToast('success', 'Success', 'User role updated successfully');
      setEditingUser(null);
    } catch (error: any) {
      showToast('error', 'Error', error.message);
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUser || !newPassword || newPassword.length < 6) {
      showToast('error', 'Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({ 
        userId: resetPasswordUser._id, 
        newPassword 
      });
      showToast('success', 'Success', 'Password reset successfully');
      setResetPasswordUser(null);
      setNewPassword('');
    } catch (error: any) {
      showToast('error', 'Error', error.message);
    }
  };

  // Render Functions
  const renderFilters = () => (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Select value={filters.role} onValueChange={(value) => handleFilterChange('role', value)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          {ROLES.map(role => (
            <SelectItem key={role} value={role}>{role}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.isActive} onValueChange={(value) => handleFilterChange('isActive', value)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="true">Active</SelectItem>
          <SelectItem value="false">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderUserRow = (user: User) => (
    <TableRow key={user._id}>
      <TableCell>
        <div>
          <p className="font-medium">{user.firstName} {user.lastName}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.consultantId && (
            <p className="text-xs text-blue-600">ID: {user.consultantId}</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{user.role}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={user.isActive}
            onCheckedChange={() => handleToggleStatus(user._id)}
            disabled={toggleStatusMutation.isPending}
          />
          <span className="text-sm text-muted-foreground">
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
        </span>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditingUser(user)}
        >
          Edit
        </Button>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setResetPasswordUser(user)}
        >
          Reset Password
        </Button>
      </TableCell>
    </TableRow>
  );

  const renderLoadingRows = () => 
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: 7 }).map((_, j) => (
          <TableCell key={j}>
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </TableCell>
        ))}
      </TableRow>
    ));

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
        No users found
      </TableCell>
    </TableRow>
  );

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {((pagination.page - 1) * filters.limit) + 1} to {Math.min(pagination.page * filters.limit, pagination.total)} of {pagination.total} users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm">Page {pagination.page} of {pagination.pages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNext}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderFilters()}

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead>Reset Password</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading 
                  ? renderLoadingRows()
                  : users.length === 0 
                    ? renderEmptyState()
                    : users.map(renderUserRow)
                }
              </TableBody>
            </Table>
          </div>

          {renderPagination()}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditUserDialog
        user={editingUser}
        onOpenChange={() => setEditingUser(null)}
        onUpdateRole={handleUpdateRole}
        roles={ROLES}
      />

      <ResetPasswordDialog
        user={resetPasswordUser}
        onOpenChange={() => setResetPasswordUser(null)}
        password={newPassword}
        onPasswordChange={setNewPassword}
        onConfirm={handleResetPassword}
      />
    </div>
  );
}

// Dialog Components
interface EditUserDialogProps {
  user: User | null;
  onOpenChange: () => void;
  onUpdateRole: (userId: string, role: string) => void;
  roles: string[];
}

function EditUserDialog({ user, onOpenChange, onUpdateRole, roles }: EditUserDialogProps) {
  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>User</Label>
            <p className="text-sm text-muted-foreground">
              {user?.firstName} {user?.lastName} ({user?.email})
            </p>
          </div>
          <div>
            <Label>Current Role</Label>
            <p className="text-sm">{user?.role}</p>
          </div>
          <div>
            <Label>New Role</Label>
            <Select onValueChange={(role) => user && onUpdateRole(user._id, role)}>
              <SelectTrigger>
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ResetPasswordDialogProps {
  user: User | null;
  onOpenChange: () => void;
  password: string;
  onPasswordChange: (password: string) => void;
  onConfirm: () => void;
}

function ResetPasswordDialog({ user, onOpenChange, password, onPasswordChange, onConfirm }: ResetPasswordDialogProps) {
  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>User</Label>
            <p className="text-sm text-muted-foreground">
              {user?.firstName} {user?.lastName} ({user?.email})
            </p>
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Reset Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
