
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
import { useConsultants, useDeleteConsultant } from "@/hooks/consultant";
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

export default function Consultants() {
  const { data: consultants, isLoading, error } = useConsultants();
  const deleteConsultantMutation = useDeleteConsultant();

  const handleDelete = (id: string) => {
    deleteConsultantMutation.mutate(id);
  };

  const getFullName = (firstName: string | null, lastName: string | null) => {
    return [firstName, lastName].filter(Boolean).join(" ");
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'destructive';
      case 'Pending':
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
            {consultants?.map((consultant) => (
              <TableRow key={consultant.id}>
                <TableCell className="font-mono text-xs uppercase">{consultant.id.substring(0, 8)}</TableCell>
                <TableCell className="font-medium">{getFullName(consultant.first_name, consultant.last_name)}</TableCell>
                <TableCell>{consultant.role}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(consultant.status)}>
                    {consultant.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(consultant.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{consultant.email}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button asChild size="sm" className="bg-cyan-500 text-primary-foreground hover:bg-cyan-600">
                    <Link to={`/securia/consultants/${consultant.id}`}><Eye /> View</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-yellow-400 text-secondary-foreground hover:bg-yellow-500">
                    <Link to={`/securia/consultants/edit/${consultant.id}`}><Pencil /> Edit</Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will permanently delete the consultant and all their associated data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(consultant.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
