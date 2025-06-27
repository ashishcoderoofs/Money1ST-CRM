
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserForm } from "./UserForm";
import { useManagers, useCreateUser } from "@/hooks/users";
import { sanitizeEmail, sanitizeString } from "@/utils/inputSanitization";
import { AlertTriangle } from "lucide-react";
import type { CreateUserData } from "@/hooks/users/types";

export function AdminUserCreation() {
  const { data: managers = [] } = useManagers();
  const createUserMutation = useCreateUser();

  const handleCreateUser = async (values: CreateUserData) => {
    // Sanitize inputs
    const sanitizedData = {
      ...values,
      email: sanitizeEmail(values.email),
      first_name: sanitizeString(values.first_name),
      last_name: sanitizeString(values.last_name),
      phone: values.phone ? sanitizeString(values.phone) : undefined,
    };

    // Validate sanitized email
    if (!sanitizedData.email) {
      return;
    }

    try {
      await createUserMutation.mutateAsync(sanitizedData);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> This creates users directly through the admin API. Users will receive a default password "TempPass123!" and should change it on first login.
        </AlertDescription>
      </Alert>

      <UserForm
        onSubmit={handleCreateUser}
        managers={managers}
        isLoading={createUserMutation.isPending}
      />
    </div>
  );
}
