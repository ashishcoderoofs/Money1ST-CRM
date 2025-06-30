import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useSecuriaConsultants, useDeleteConsultant } from "@/hooks/useSecuriaConsultants";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Consultants() {
  const { data, isLoading, error } = useSecuriaConsultants();
  const deleteConsultantMutation = useDeleteConsultant();

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteConsultantMutation.mutateAsync(id);
      toast.success("Consultant deleted successfully");
    } catch (error) {
      toast.error("Failed to delete consultant");
    }
  };

  const getFullName = (firstName: string, lastName: string) => {
    return [firstName, lastName].filter(Boolean).join(" ");
  };

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Consultant Profiles</h2>
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="border rounded-lg bg-card p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading consultants: {error.message}</div>;
  }

  const consultants = data?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Consultant Profiles</h2>
        <Button asChild>
          <Link to="/securia/consultants/new">Add New Consultant</Link>
        </Button>
      </div>
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ConsultID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position (Role)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Entry Date</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-gray-500">
                    <p className="mb-4">No consultants found</p>
                    <Button asChild>
                      <Link to="/securia/consultants/new">Add Your First Consultant</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              consultants.map((consultant) => (
                <TableRow key={consultant._id}>
                  <TableCell className="font-mono text-xs uppercase">
                    {consultant.consultantId || `CON${consultant._id.substring(consultant._id.length - 6)}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {getFullName(consultant.firstName, consultant.lastName)}
                  </TableCell>
                  <TableCell>{consultant.position || consultant.specialization}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(consultant.status)}>
                      {consultant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(consultant.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{consultant.email}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild size="sm" className="bg-cyan-500 text-primary-foreground hover:bg-cyan-600">
                      <Link to={`/securia/consultants/${consultant._id}`}><Eye /> View</Link>
                    </Button>
                    <Button asChild size="sm" className="bg-yellow-400 text-secondary-foreground hover:bg-yellow-500">
                      <Link to={`/securia/consultants/edit/${consultant._id}`}><Pencil /> Edit</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" disabled={deleteConsultantMutation.isPending}>
                          <Trash2 /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will permanently delete the consultant "{getFullName(consultant.firstName, consultant.lastName)}" and all their associated data. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(consultant._id, getFullName(consultant.firstName, consultant.lastName))}
                            className="bg-destructive hover:bg-destructive/90"
                            disabled={deleteConsultantMutation.isPending}
                          >
                            {deleteConsultantMutation.isPending ? "Deleting..." : "Delete Permanently"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}