
import React, { useState } from "react";
import { useLicenses, useCreateLicense, useUpdateLicense, useDeleteLicense } from "@/hooks/useLicenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Database } from "@/integrations/supabase/types";

type License = Database["public"]["Tables"]["licenses"]["Row"];

interface LicensesManagerProps {
  consultantId: string;
}

export function LicensesManager({ consultantId }: LicensesManagerProps) {
  const { data: licenses, isLoading } = useLicenses(consultantId);
  const createLicenseMutation = useCreateLicense();
  const updateLicenseMutation = useUpdateLicense();
  const deleteLicenseMutation = useDeleteLicense();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [formData, setFormData] = useState({
    license_type: "",
    license_number: "",
    issue_date: "",
    expiration_date: "",
    issuing_authority: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const licenseData = {
      consultant_id: consultantId,
      license_type: formData.license_type,
      license_number: formData.license_number || null,
      issue_date: formData.issue_date || null,
      expiration_date: formData.expiration_date || null,
      issuing_authority: formData.issuing_authority || null,
    };

    if (editingLicense) {
      updateLicenseMutation.mutate({
        id: editingLicense.id,
        consultant_id: consultantId,
        ...licenseData,
      });
    } else {
      createLicenseMutation.mutate(licenseData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      license_type: "",
      license_number: "",
      issue_date: "",
      expiration_date: "",
      issuing_authority: "",
    });
    setEditingLicense(null);
  };

  const handleEdit = (license: License) => {
    setEditingLicense(license);
    setFormData({
      license_type: license.license_type,
      license_number: license.license_number || "",
      issue_date: license.issue_date || "",
      expiration_date: license.expiration_date || "",
      issuing_authority: license.issuing_authority || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (license: License) => {
    if (confirm("Are you sure you want to delete this license?")) {
      deleteLicenseMutation.mutate({ id: license.id, consultant_id: consultantId });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Licenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Licenses</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add License
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLicense ? "Edit License" : "Add License"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="license_type">License Type *</Label>
                <Select 
                  value={formData.license_type} 
                  onValueChange={(value) => setFormData({ ...formData, license_type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select license type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Financial Planning">Financial Planning</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  value={formData.license_number}
                  onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="expiration_date">Expiration Date</Label>
                <Input
                  id="expiration_date"
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="issuing_authority">Issuing Authority</Label>
                <Input
                  id="issuing_authority"
                  value={formData.issuing_authority}
                  onChange={(e) => setFormData({ ...formData, issuing_authority: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createLicenseMutation.isPending || updateLicenseMutation.isPending}>
                  {editingLicense ? "Update" : "Add"} License
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {licenses && licenses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Authority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell>{license.license_type}</TableCell>
                  <TableCell>{license.license_number || "N/A"}</TableCell>
                  <TableCell>{license.issue_date ? new Date(license.issue_date).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>{license.expiration_date ? new Date(license.expiration_date).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>{license.issuing_authority || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(license)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(license)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">No licenses added yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
