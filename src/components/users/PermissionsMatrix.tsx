
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Shield } from "lucide-react";

interface Permission {
  feature: string;
  description: string;
  Admin: boolean;
  "Field Builder": boolean;
  "Field Trainer": boolean;
  "Senior BMA": boolean;
  BMA: boolean;
  IBA: boolean;
}

const permissions: Permission[] = [
  {
    feature: "Dashboard",
    description: "View main dashboard",
    Admin: true,
    "Field Builder": true,
    "Field Trainer": true,
    "Senior BMA": true,
    BMA: true,
    IBA: true,
  },
  {
    feature: "Contacts",
    description: "View and manage contacts",
    Admin: true,
    "Field Builder": true,
    "Field Trainer": true,
    "Senior BMA": true,
    BMA: true,
    IBA: true,
  },
  {
    feature: "Deals",
    description: "View and manage deals",
    Admin: true,
    "Field Builder": true,
    "Field Trainer": true,
    "Senior BMA": true,
    BMA: true,
    IBA: true,
  },
  {
    feature: "Tasks",
    description: "View and manage tasks",
    Admin: true,
    "Field Builder": true,
    "Field Trainer": true,
    "Senior BMA": true,
    BMA: true,
    IBA: true,
  },
  {
    feature: "Reports",
    description: "View analytics and reports",
    Admin: true,
    "Field Builder": true,
    "Field Trainer": true,
    "Senior BMA": true,
    BMA: false,
    IBA: false,
  },
  {
    feature: "User Management",
    description: "Create and manage users",
    Admin: true,
    "Field Builder": true,
    "Field Trainer": false,
    "Senior BMA": false,
    BMA: false,
    IBA: false,
  },
  {
    feature: "Securia Access",
    description: "Access to Securia module",
    Admin: true,
    "Field Builder": false,
    "Field Trainer": false,
    "Senior BMA": false,
    BMA: false,
    IBA: false,
  },
];

const roles = ["Admin", "Field Builder", "Field Trainer", "Senior BMA", "BMA", "IBA"] as const;

export function PermissionsMatrix() {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "destructive";
      case "Field Builder":
        return "default";
      case "Field Trainer":
        return "secondary";
      case "Senior BMA":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permissions Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Feature</TableHead>
                <TableHead className="min-w-[250px]">Description</TableHead>
                {roles.map((role) => (
                  <TableHead key={role} className="text-center min-w-[120px]">
                    <Badge variant={getRoleBadgeVariant(role)} className="text-xs">
                      {role}
                    </Badge>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.feature}>
                  <TableCell className="font-medium">{permission.feature}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {permission.description}
                  </TableCell>
                  {roles.map((role) => (
                    <TableCell key={role} className="text-center">
                      {permission[role] ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-red-600 mx-auto" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
